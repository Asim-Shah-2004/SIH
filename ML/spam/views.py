import os
import re
import json
import time
import torch
import unicodedata
import numpy as np
from typing import Dict, Any, Set, List, Tuple
from dotenv import load_dotenv
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain

load_dotenv()

class ContentModerator:
    def __init__(self):
        self.offensive_words: Set[str] = set()
        self.word_pattern = re.compile(r'\b\w+\b')
        
    def normalize_text(self, text: str) -> str:
        """Normalize text by removing accents and converting to lowercase."""
        text = text.lower()
        text = unicodedata.normalize('NFKD', text)
        text = ''.join(c for c in text if not unicodedata.combining(c))
        return text
    
    def load_words(self, filepath: str) -> None:
        try:
            with open(filepath, 'r', encoding='utf-8') as file:
                words = [line.strip().lower() for line in file if line.strip()]
                self.offensive_words.update(words)
                  # Debug print
        except FileNotFoundError:
            print(f"Warning: Could not find word list file: {filepath}")
        
    def check_text(self, text: str) -> Tuple[bool, List[str], str]:
        """
        Check text for offensive content and return:
        - Whether text is offensive
        - List of found offensive terms
        - Censored version of the text
        """
        if not text:
            return False, [], text
        
        original_text = text
        text = self.normalize_text(text)
        found_terms = []
        censored_text = original_text
        
        # Check for exact matches of multi-word phrases first
        for term in sorted(self.offensive_words, key=len, reverse=True):
            if ' ' in term and term in text:
                found_terms.append(term)
                # Censor the term in the output text
                pattern = re.compile(re.escape(term), re.IGNORECASE)
                censored_text = pattern.sub('*' * len(term), censored_text)
        
        # Check for single word matches
        words = self.word_pattern.findall(text)
        for word in words:
            if word in self.offensive_words:
                found_terms.append(word)
                # Censor the word in the output text
                pattern = re.compile(r'\b' + re.escape(word) + r'\b', re.IGNORECASE)
                censored_text = pattern.sub('*' * len(word), censored_text)
        
        return bool(found_terms), found_terms, censored_text

class HybridSpamDetector:
    def __init__(self):
        # Content Moderation Initialization
        self.content_moderator = ContentModerator()
        try:
            # Use absolute path relative to current file's directory
            current_dir = os.path.dirname(os.path.abspath(__file__))
            offensive_words_path = os.path.join(current_dir, 'offensive_words.txt')
            self.content_moderator.load_words(offensive_words_path)
        except Exception as e:
            print(f"Error initializing content moderator: {e}")

        # Load pre-trained spam detection model (using bert-base-uncased fine-tuned on spam)
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.tokenizer = AutoTokenizer.from_pretrained('bert-base-uncased')
        self.model = AutoModelForSequenceClassification.from_pretrained(
            'bert-base-uncased', 
            num_labels=2
        ).to(self.device)
        
        # Initialize backup Gemini system
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            raise ValueError("Google API key is not set. Please check your .env file.")
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-pro",
            temperature=0.3,
            max_tokens=256,
            api_key=api_key
        )
        
        # Categories for classification
        self.spam_categories = {
            'promotional': ['offer', 'discount', 'limited time', 'buy now'],
            'scam': ['urgent', 'account blocked', 'verify now', 'bank details'],
            'inappropriate': ['adult content', 'offensive', 'explicit'],
            'malicious': ['malware', 'virus', 'hack', 'crack'],
            'phishing': ['password', 'login', 'verify account', 'security alert']
        }
        
        # Load additional pre-trained models for specific checks
        self.toxicity_tokenizer = AutoTokenizer.from_pretrained('unitary/toxic-bert')
        self.toxicity_model = AutoModelForSequenceClassification.from_pretrained('unitary/toxic-bert').to(self.device)
        
        # Message flooding detection parameters
        self.message_history = {}
        self.repetition_threshold = 3  # Number of times a message can be repeated
        self.time_window = 60  # Seconds to track repetitions
        self.ip_flood_tracking = {}
        self.ip_flood_threshold = 10  # Maximum messages from an IP in time window

    def preprocess_text(self, text: str) -> torch.Tensor:
        """Tokenize and prepare text for model input"""
        inputs = self.tokenizer(
            text,
            truncation=True,
            max_length=512,
            padding='max_length',
            return_tensors='pt'
        )
        return inputs.to(self.device)

    def detect_message_flooding(self, text: str, ip_address: str = None) -> Dict[str, bool]:
        """
        Detect message flooding through two mechanisms:
        1. Identical message repetition
        2. High volume of messages from a single IP
        """
        current_time = time.time()
        flood_detection = {
            "message_repetition_flood": False,
            "ip_volume_flood": False
        }
        
        # Clean up old entries in message history
        self.message_history = {
            msg: timestamps for msg, timestamps in self.message_history.items()
            if any(current_time - ts < self.time_window for ts in timestamps)
        }
        
        # Track message repetition
        if text not in self.message_history:
            self.message_history[text] = [current_time]
        else:
            self.message_history[text].append(current_time)
            
            # Check if message exceeds repetition threshold
            if len(self.message_history[text]) > self.repetition_threshold:
                flood_detection["message_repetition_flood"] = True
        
        # Track IP-based flooding if IP is provided
        if ip_address:
            if ip_address not in self.ip_flood_tracking:
                self.ip_flood_tracking[ip_address] = [current_time]
            else:
                # Remove timestamps outside the time window
                self.ip_flood_tracking[ip_address] = [
                    ts for ts in self.ip_flood_tracking[ip_address] 
                    if current_time - ts < self.time_window
                ]
                
                self.ip_flood_tracking[ip_address].append(current_time)
                
                # Check if IP exceeds message volume threshold
                if len(self.ip_flood_tracking[ip_address]) > self.ip_flood_threshold:
                    flood_detection["ip_volume_flood"] = True
        
        return flood_detection

    def get_spam_score(self, text: str) -> float:
        """Get spam probability using pre-trained model"""
        with torch.no_grad():
            inputs = self.preprocess_text(text)
            outputs = self.model(**inputs)
            probabilities = torch.nn.functional.softmax(outputs.logits, dim=-1)
            return probabilities[0][1].item()  # Probability of spam class

    def check_toxicity(self, text: str) -> float:
        """Check content toxicity using toxic-bert"""
        with torch.no_grad():
            inputs = self.toxicity_tokenizer(
                text,
                return_tensors='pt',
                truncation=True,
                max_length=512
            ).to(self.device)
            outputs = self.toxicity_model(**inputs)
            probs = torch.nn.functional.softmax(outputs.logits, dim=-1)
            return probs[0][1].item()

    def identify_categories(self, text: str) -> list:
        """Identify specific spam categories"""
        text_lower = text.lower()
        detected_categories = []
        
        for category, keywords in self.spam_categories.items():
            if any(keyword in text_lower for keyword in keywords):
                detected_categories.append(category)
                
        return detected_categories

    def get_gemini_validation(self, text: str, initial_score: float) -> Dict[str, Any]:
        """Get secondary validation from Gemini for borderline cases"""
        if 0.3 <= initial_score <= 0.7:  # Only use Gemini for uncertain cases
            prompt = PromptTemplate(
                input_variables=["content"],
                template="""
                Analyze if this content is spam. Consider:
                - Promotional content
                - Scams/fraud attempts
                - Inappropriate content
                - Malicious intent
                
                Content: {content}
                
                Respond with only a number between 0 and 1 indicating spam probability.
                """
            )
            chain = LLMChain(llm=self.llm, prompt=prompt)
            try:
                gemini_score = float(chain.run(content=text))
                return {
                    "gemini_score": gemini_score,
                    "combined_score": (initial_score + gemini_score) / 2
                }
            except:
                return {
                    "gemini_score": None,
                    "combined_score": initial_score
                }
        return {
            "gemini_score": None,
            "combined_score": initial_score
        }

    def analyze_content(self, text: str, ip_address: str = None) -> Dict[str, Any]:
        """Complete content analysis"""
        # Content moderation check
        is_offensive, offensive_terms, censored_text = self.content_moderator.check_text(text)
        
        # Get initial spam score
        spam_score = self.get_spam_score(text)
        
        # Get toxicity score
        toxicity_score = self.check_toxicity(text)
        
        # Identify specific categories
        categories = self.identify_categories(text)
        
        # Detect flooding
        flooding_detection = self.detect_message_flooding(text, ip_address)
        
        # Get Gemini validation for uncertain cases
        gemini_results = self.get_gemini_validation(text, spam_score)
        
        # Calculate final spam probability
        final_score = gemini_results["combined_score"]
        
        return {
            "is_spam": (final_score > 0.5 or 
                        flooding_detection["message_repetition_flood"] or 
                        flooding_detection["ip_volume_flood"] or 
                        is_offensive),
            "spam_score": final_score,
            "initial_score": spam_score,
            "toxicity_score": toxicity_score,
            "gemini_score": gemini_results["gemini_score"],
            "categories": categories,
            "confidence": 1 - abs(0.5 - final_score) * 2,
            "requires_manual_review": 0.4 <= final_score <= 0.6,
            "flooding_detection": flooding_detection,
            "offensive_content": {
                "is_offensive": is_offensive,
                "offensive_terms": offensive_terms,
                "censored_text": censored_text
            }
        }

# Initialize global detector
spam_detector = HybridSpamDetector()

@csrf_exempt
@require_http_methods(["POST"])
def analyze_spam(request):
    try:
        data = json.loads(request.body)
        content = data.get('content', '')
        ip_address = request.META.get('REMOTE_ADDR')
        
        if not content:
            return JsonResponse({
                'error': 'No content provided'
            }, status=400)
            
        analysis = spam_detector.analyze_content(content, ip_address)
        
        return JsonResponse({
            'analysis': analysis,
            'content_length': len(content),
            'status': 'success'
        })
        
    except Exception as e:
        return JsonResponse({
            'error': str(e)
        }, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def bulk_analyze_spam(request):
    try:
        data = json.loads(request.body)
        contents = data.get('contents', [])
        ip_address = request.META.get('REMOTE_ADDR')
        
        if not contents:
            return JsonResponse({
                'error': 'No contents provided'
            }, status=400)
            
        results = []
        for content in contents:
            analysis = spam_detector.analyze_content(content, ip_address)
            results.append({
                'content': content,
                'analysis': analysis
            })
            
        return JsonResponse({
            'results': results,
            'total_analyzed': len(results),
            'status': 'success'
        })
        
    except Exception as e:
        return JsonResponse({
            'error': str(e)
        }, status=500)