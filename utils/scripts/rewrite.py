"""
INSTALLATION COMMAND:
pip install transformers torch sentencepiece langchain google-generativeai
"""

import json
import torch
from transformers import pipeline
from typing import Dict, Any

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser

class EmotionPostRewriter:
    def __init__(self):
        # Initialize Gemini model
        self.model = ChatGoogleGenerativeAI(
            model="gemini-pro",
            google_api_key="AIzaSyCjMNWVDFBNU6F0k5UC_6jt5OY2gJCLPSo"
        )
        
        # Emotion Analysis Model
        self.emotion_analyzer = pipeline(
            "text-classification", 
            model="j-hartmann/emotion-english-distilroberta-base"
        )
        
        # Rewriting styles
        self.styles = {
            'professional': PromptTemplate.from_template(
                "Rewrite the following text in a highly professional, formal business communication style:\n\n{post}"
            ),
            'funny': PromptTemplate.from_template(
                "Transform this text into a hilarious, witty version with clever jokes and comedic tone:\n\n{post}"
            ),
            'concise': PromptTemplate.from_template(
                "Drastically reduce the following text to its most essential meaning, removing all unnecessary words:\n\n{post}"
            ),
            'casual': PromptTemplate.from_template(
                "Rewrite this text in a super relaxed, conversational style as if chatting with a close friend:\n\n{post}"
            )
        }
    
    def analyze_emotions(self, text: str) -> Dict[str, Any]:
        """
        Analyze emotions using pre-trained model
        Returns top 3 emotions with their confidence scores
        """
        try:
            # Get emotion analysis results
            emotions = self.emotion_analyzer(text)
            
            # Sort emotions by score in descending order
            sorted_emotions = sorted(
                emotions, 
                key=lambda x: x['score'], 
                reverse=True
            )
            
            # Return top 3 emotions
            return {
                "top_emotions": sorted_emotions[:3]
            }
        except Exception as e:
            return {"error": str(e)}
    
    def rewrite_post(self, post: str, style: str):
        """
        Rewrite post with emotion analysis
        """
        # Validate style
        if style.lower() not in self.styles:
            raise ValueError(f"Invalid style. Choose from: {', '.join(self.styles.keys())}")
        
        # Analyze original text emotions
        original_emotions = self.analyze_emotions(post)
        
        # Create rewriting chain
        rewrite_chain = self.styles[style.lower()] | self.model | StrOutputParser()
        
        # Rewrite the post
        rewritten_post = rewrite_chain.invoke({"post": post})
        
        # Analyze rewritten post emotions
        rewritten_emotions = self.analyze_emotions(rewritten_post)
        
        # Create JSON output
        result = {
            "style": style,
            "emotions": {
                "original": original_emotions,
                "rewritten": rewritten_emotions
            },
            "output": rewritten_post
        }
        
        return json.dumps(result, indent=2)

# Example usage
def main():
    # Initialize the rewriter
    rewriter = EmotionPostRewriter()
    
    # Example post
    post = "I had an incredible day at the beach with my friends. We played volleyball, laughed a lot, and enjoyed delicious ice cream."
    
    # Specify style
    style = "professional"
    
    # Rewrite the post
    result = rewriter.rewrite_post(post, style)
    print(result)

if __name__ == "__main__":
    main()