import os
import re
import json
import logging
import nltk
from typing import Dict, Any, List

# NLP Libraries
from nltk.sentiment import SentimentIntensityAnalyzer
from transformers import pipeline

# Langchain and Gemini
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain.output_parsers import PydanticOutputParser
from pydantic import BaseModel, Field

# Configure logging
logging.basicConfig(
    level=logging.INFO, 
    format='%(asctime)s - %(levelname)s: %(message)s'
)
logger = logging.getLogger(__name__)

# Download necessary NLTK resources
nltk.download('vader_lexicon', quiet=True)

# Pydantic Model for Strict JSON Parsing
class SentimentInsights(BaseModel):
    overall_sentiment: str = Field(
        description="Overall sentiment of the text",
        enum=["Positive", "Negative", "Neutral"]
    )
    emotional_depth: str = Field(
        description="Depth of emotional context in the text"
    )
    professional_context: str = Field(
        description="Professional interpretation of the text"
    )
    communication_effectiveness: str = Field(
        description="Assessment of communication quality"
    )
    key_themes: List[str] = Field(
        description="Primary themes detected in the text"
    )
    engagement_recommendations: List[str] = Field(
        description="Suggestions for further engagement"
    )

class ComprehensiveSentimentAnalyzer:
    def __init__(self):
        """
        Initialize comprehensive sentiment analyzer with multiple models
        """
        # Environment Variable Validation
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            raise ValueError("Google API Key is required but not set")

        # Initialize models
        try:
            # NLTK VADER Sentiment Analyzer
            self.vader_analyzer = SentimentIntensityAnalyzer()

            # Transformer-based Sentiment Models
            self.transformer_sentiment = pipeline(
                "sentiment-analysis",
                model="distilbert-base-uncased-finetuned-sst-2-english"
            )

            # Emotion Detection Model
            self.emotion_model = pipeline(
                "text-classification",
                model="j-hartmann/emotion-english-distilroberta-base"
            )

            # Pydantic Output Parser
            self.output_parser = PydanticOutputParser(pydantic_object=SentimentInsights)

            # Initialize Gemini LLM 
            self.gemini_llm = ChatGoogleGenerativeAI(
                model="gemini-pro",
                temperature=0.3,
                max_tokens=1000,
                convert_system_message_to_human=True,
                google_api_key=api_key
            )

            # Enhanced Prompt Template with Pydantic Output Parsing
            self.gemini_prompt = PromptTemplate(
                template="""Analyze the sentiment and context of the following text. 
{format_instructions}

Sentiment Analysis Context:
- Sentiment Scores: {sentiment_scores}
- Transformer Sentiment: {transformer_sentiment}
- Detected Emotions: {emotions}

Post Content: {post}

Instructions:
- Provide a precise, professional analysis
- Be concise and insightful
- Focus on actionable insights
""",
                input_variables=["post", "sentiment_scores", "transformer_sentiment", "emotions"],
                partial_variables={
                    "format_instructions": self.output_parser.get_format_instructions()
                }
            )

            # Create Gemini Analysis Chain
            self.gemini_chain = LLMChain(
                llm=self.gemini_llm,
                prompt=self.gemini_prompt,
                output_parser=self.output_parser
            )

        except Exception as e:
            logger.error(f"Model initialization failed: {e}")
            raise

    def preprocess_text(self, text: str) -> str:
        """
        Advanced text preprocessing

        Args:
            text (str): Input text to preprocess

        Returns:
            str: Cleaned and normalized text
        """
        text = re.sub(r'[^a-zA-Z0-9\s]', '', text)
        text = text.lower().strip()
        return ' '.join(text.split())

    def analyze_sentiment(self, post: str) -> Dict[str, Any]:
        """
        Comprehensive sentiment analysis with multiple models

        Args:
            post (str): Text content to analyze

        Returns:
            dict: Comprehensive sentiment analysis results
        """
        try:
            # Preprocess the text
            cleaned_post = self.preprocess_text(post)

            # VADER Sentiment Analysis
            vader_scores = self.vader_analyzer.polarity_scores(cleaned_post)

            # Transformer Sentiment Analysis
            transformer_result = self.transformer_sentiment(cleaned_post)[0]

            # Emotion Detection
            emotion_results = self.emotion_model(cleaned_post)

            # Gemini Enhanced Analysis
            try:
                ai_insights = self.gemini_chain.run(
                    post=post,
                    sentiment_scores=json.dumps(vader_scores),
                    transformer_sentiment=transformer_result['label'],
                    emotions=json.dumps([
                        {"label": emotion['label'], "score": emotion['score']}
                        for emotion in emotion_results
                    ])
                )
            except Exception as gemini_error:
                logger.warning(f"Gemini analysis failed: {gemini_error}")
                ai_insights = SentimentInsights(
                    overall_sentiment="Neutral",
                    emotional_depth="Limited Context",
                    professional_context="Analysis Inconclusive",
                    communication_effectiveness="Basic",
                    key_themes=["General Discussion"],
                    engagement_recommendations=["Request More Information"]
                )

            # Comprehensive Analysis Result
            analysis = {
                "original_post": post,
                "cleaned_post": cleaned_post,
                "sentiment_metrics": {
                    "vader_sentiment": {
                        "negative": vader_scores['neg'],
                        "neutral": vader_scores['neu'],
                        "positive": vader_scores['pos'],
                        "compound_score": vader_scores['compound']
                    },
                    "transformer_sentiment": {
                        "label": transformer_result['label'],
                        "confidence": transformer_result['score']
                    },
                    "detected_emotions": {
                        emotion['label']: emotion['score']
                        for emotion in emotion_results
                    }
                },
                "ai_powered_insights": ai_insights.dict()
            }

            return analysis

        except Exception as e:
            logger.error(f"Sentiment Analysis Failed: {e}")
            return {
                "error": str(e),
                "original_post": post,
                "fallback_strategy": {
                    "overall_sentiment": "Neutral",
                    "message": "Analysis could not be completed"
                }
            }