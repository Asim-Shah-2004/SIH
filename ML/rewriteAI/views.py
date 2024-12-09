import os
import json
import torch
import faiss
import logging
import numpy as np
from typing import Dict, Any, List
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.core.exceptions import ValidationError

from transformers import pipeline
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from sentence_transformers import SentenceTransformer
from .template import _define_rewriting_styles

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class AdvancedEmotionPostRewriter:
    MAX_INPUT_LENGTH = 5000
    MIN_INPUT_LENGTH = 10
    
    def __init__(self):
        # Language Model
        self.model = self._initialize_language_model()
        
        # Advanced Text Analysis Models
        self.semantic_model = SentenceTransformer('all-mpnet-base-v2')
        self.content_classifier = pipeline(
            "zero-shot-classification", 
            model="facebook/bart-large-mnli"
        )
        self.emotion_analyzer = pipeline(
            "text-classification", 
            model="j-hartmann/emotion-english-distilroberta-base",
            top_k=None
        )
        
        # Expanded Rewriting Styles
        self.styles = _define_rewriting_styles()
        
        # Initialize FAISS Index for Style Matching
        self._build_style_index()
    
    def _build_style_index(self):
        """Build a FAISS index for style embedding similarity search"""
        try:
            # Extract only style descriptions
            style_descriptions = [
                details['description']
                for details in self.styles.values()
            ]
            style_names = list(self.styles.keys())
            
            # Encode style descriptions
            style_embeddings = self.semantic_model.encode(style_descriptions)
            
            # Create FAISS index
            dimension = style_embeddings.shape[1]
            index = faiss.IndexFlatL2(dimension)
            index.add(style_embeddings)
            
            # Store index and related information
            self.style_index = index
            self.style_embeddings = style_embeddings
            self.style_names = style_names
            
            logger.info(f"FAISS index built for {len(style_names)} styles")
        except Exception as e:
            logger.critical(f"FAISS index creation failed: {e}")
            raise

    def advanced_content_detection(self, text: str) -> List[tuple]:
        """Detect content categories with high confidence"""
        categories = [
            'professional', 'casual', 
            'technical', 'emotional', 
            'informative', 'persuasive'
        ]
        
        classification = self.content_classifier(
            text, 
            categories, 
            multi_label=True
        )
        
        return [
            (class_name, score) 
            for class_name, score in zip(
                classification['labels'], 
                classification['scores']
            ) if score > 0.5
        ]
    
    def nuanced_emotion_analysis(self, text: str) -> List[Dict]:
        """
        Perform emotion detection using a pretrained model
        
        Args:
            text (str): Input text to analyze
        
        Returns:
            List of detected emotions
        """
        try:
            # Use a robust pretrained emotion classification model
            emotion_pipeline = pipeline(
                "text-classification", 
                model="bhadresh-savani/bert-base-uncased-emotion",
                top_k=None
            )
            
            # Truncate very long texts to prevent processing issues
            truncated_text = text[:1024]
            
            # Perform emotion detection
            emotions = emotion_pipeline(truncated_text)
            
            # Sort emotions by score in descending order
            sorted_emotions = sorted(
                emotions[0], 
                key=lambda x: x['score'], 
                reverse=True
            )
            
            return sorted_emotions
        
        except Exception as e:
            logger.error(f"Emotion detection failed: {e}")
            # Return a default emotion result
            return [
                {"label": "neutral", "score": 1.0}
            ]
    def _initialize_language_model(self):
        """Initialize Gemini Pro with robust error handling"""
        try:
            return ChatGoogleGenerativeAI(
                model="gemini-pro",
                google_api_key=os.getenv('GOOGLE_API_KEY'),
                temperature=0.7,
                max_retries=3
            )
        except Exception as e:
            logger.critical(f"Language model initialization failed: {e}")
            raise

    def get_emotion_analysis(self, post: str) -> Dict[str, Any]:
        """
        Perform comprehensive emotion analysis on a given text.
        
        Args:
            post (str): The input text to analyze
        
        Returns:
            Dict containing detailed emotion analysis
        """
        try:
            # Validate input length
            if len(post) < self.MIN_INPUT_LENGTH:
                raise ValidationError("Text too short for emotion analysis")
            
            if len(post) > self.MAX_INPUT_LENGTH:
                raise ValidationError("Text exceeds maximum length")
            
            # Perform emotion analysis
            emotions = self.nuanced_emotion_analysis(post)
            
            # Perform content type detection
            content_types = self.advanced_content_detection(post)
            
            return {
                "emotions": emotions,
                "content_types": content_types
            }
        
        except ValidationError as e:
            logger.warning(f"Validation error in emotion analysis: {e}")
            return {"error": str(e), "status": "validation_failed"}
        except Exception as e:
            logger.error(f"Unexpected error in emotion analysis: {e}")
            return {"error": "Emotion analysis failed", "status": "processing_error"}

    

    def _match_style_with_faiss(self, style_input: str) -> str:
        """
        Match style using FAISS-based semantic similarity
        
        Args:
            style_input (str): Input style description or query
        
        Returns:
            str: Best matching style name
        """
        try:
            # Handle potential encoding issues with style input
            style_input = style_input[:512]  # Truncate to max length
            
            # Encode the input query
            query_embedding = self.semantic_model.encode([style_input])
            
            # Search FAISS index
            distances, indices = self.style_index.search(query_embedding, k=1)
            
            # Get the matched style
            matched_style = self.style_names[indices[0][0]]
            
            logger.info(f"Matched style for '{style_input}': {matched_style}")
            
            return matched_style
        
        except Exception as e:
            logger.error(f"Style matching failed: {e}")
            # Fallback to a default style if matching fails
            return 'professional_standard'

    def validate_input(self, post: str, style: str):
        """Comprehensive input validation with FAISS-based style matching"""
        if len(post) < self.MIN_INPUT_LENGTH:
            raise ValidationError("Text too short")
        
        if len(post) > self.MAX_INPUT_LENGTH:
            raise ValidationError("Text exceeds maximum length")
        
        # Use FAISS-based style matching
        matched_style = self._match_style_with_faiss(style)
        return matched_style

    def semantic_similarity(self, text1: str, text2: str) -> float:
        """Return a default semantic similarity score"""
        return 0.5

    def rewrite_post(self, post: str, style: str) -> Dict[str, Any]:
        """Advanced text rewriting with comprehensive analysis and FAISS-based style matching"""
        try:
            # Validate input length
            if len(post) < self.MIN_INPUT_LENGTH:
                raise ValidationError("Text too short")
            
            if len(post) > self.MAX_INPUT_LENGTH:
                raise ValidationError("Text exceeds maximum length")
            
            # Match style using only the style input
            matched_style = self._match_style_with_faiss(style)
            
            print(f"Original Post Length: {len(post)}")
            print(f"Style Input: {style}")
            print(f"Matched Style: {matched_style}")
            
            # Analyze original text
            original_content_type = self.advanced_content_detection(post)
            original_emotions = self.nuanced_emotion_analysis(post)
            
            # Rewrite text using matched style
            rewrite_chain = (
                self.styles[matched_style]['template'] | 
                self.model | 
                StrOutputParser()
            )
            rewritten_post = rewrite_chain.invoke({"post": post})
            print(rewritten_post)
            # Analyze rewritten text
            rewritten_content_type = self.advanced_content_detection(rewritten_post)
            print("hi")
            print(rewritten_content_type)
            rewritten_emotions = self.nuanced_emotion_analysis(rewritten_post)
            print("hello again")
            # Calculate semantic similarity
            semantic_similarity = self.semantic_similarity(post, rewritten_post)
            
            return {
                "style": matched_style,
                "original_input_style": style,
                "original_content_type": original_content_type,
                "rewritten_content_type": rewritten_content_type,
                "original_emotions": original_emotions,
                "rewritten_emotions": rewritten_emotions,
                "semantic_similarity": semantic_similarity,
                "rewritten_text": rewritten_post
            }
        
        except ValidationError as e:
            logger.warning(f"Validation error: {e}")
            return {"error": str(e), "status": "validation_failed"}
        except Exception as e:
            logger.error(f"Unexpected error: {e}")
            return {"error": "Rewriting process failed", "status": "processing_error"}

    
# Django Views
rewriter = AdvancedEmotionPostRewriter()

@csrf_exempt
@require_http_methods(["POST"])
def rewrite_text(request):
    print("hi")
    """Enhanced text rewriting endpoint"""
    try:
        data = json.loads(request.body)
        post = data.get('post', '').strip()
        style = data.get('style', 'professional_standard')
        
        result = rewriter.rewrite_post(post, style)
        
        if result.get('status') == 'validation_failed':
            return JsonResponse(result, status=400)
        elif result.get('status') == 'processing_error':
            return JsonResponse(result, status=500)
        
        return JsonResponse(result)
    
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)
    except Exception as e:
        logger.critical(f"Unhandled request error: {e}")
        return JsonResponse({"error": "Internal server error"}, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def analyze_emotion(request):
    """Emotion analysis endpoint"""
    try:
        data = json.loads(request.body)
        post = data.get('post', '').strip()
        
        result = rewriter.get_emotion_analysis(post)
        
        if result.get('status') == 'validation_failed':
            return JsonResponse(result, status=400)
        elif result.get('status') == 'processing_error':
            return JsonResponse(result, status=500)
        
        return JsonResponse(result)
    
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)
    except Exception as e:
        logger.critical(f"Unhandled request error in emotion analysis: {e}")
        return JsonResponse({"error": "Internal server error"}, status=500)