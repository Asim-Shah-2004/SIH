from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from pymongo import MongoClient
from bson.objectid import ObjectId
from langchain_google_genai import ChatGoogleGenerativeAI
import os
import logging
import json
from datetime import datetime

logger = logging.getLogger(__name__)

def convert_to_json_serializable(obj):
    """
    Recursively convert MongoDB and Python objects to JSON-serializable format
    """
    if isinstance(obj, ObjectId):
        return str(obj)
    elif isinstance(obj, datetime):
        return obj.isoformat()
    elif isinstance(obj, dict):
        return {key: convert_to_json_serializable(value) for key, value in obj.items()}
    elif isinstance(obj, list):
        return [convert_to_json_serializable(item) for item in obj]
    return obj

class HallOfFameGenerator:
    def __init__(self, api_key):
        # Initialize MongoDB connection
        mongo_url = "mongodb+srv://IPL_AUCTION_24:IPLAuction2024DontGuessAlsoUseVim@cluster0.ilknu4v.mongodb.net/SIH111"
        self.client = MongoClient(mongo_url)
        self.db = self.client.get_database('SIH111')
        
        # Initialize Gemini LLM
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-pro", 
            temperature=0.3, 
            max_tokens=2048,  
            api_key=api_key
        )

    def _generate_hall_of_fame_content(self, prompt):
        """
        Generate Hall of Fame content using Gemini with robust error handling
        """
        try:
            response = self.llm.invoke(prompt)
            content = response.content.strip() if response and response.content else "No content generated."
            # Ensure content is a simple string without complex formatting
            return ' '.join(content.split())
        except Exception as e:
            logger.error(f"Error generating content: {str(e)}")
            return f"Unable to generate content. Error: {str(e)}"

    def get_user_hall_of_fame_details(self, user):
        """
        Generate Hall of Fame content for a user with comprehensive error handling
        """
        try:
            # Extract relevant user details with fallback
            full_name = user.get('fullName', 'Unknown User')
            skills = ', '.join(user.get('skills', ['No skills listed']))
            work_experiences = user.get('workExperience', [])
            education = user.get('education', [])

            # Prepare Hall of Fame content with robust prompts
            hall_of_fame_details = {
                'achievements': self._generate_hall_of_fame_content(
                    f"Generate a professional summary of notable achievements in brief for {full_name}, "
                    f"highlighting skills in {skills} in 3-4 words. Focus on unique professional accomplishments. "
                    f"Keep the response concise and factual.in 1 line"
                ),
                'first_job': self._generate_hall_of_fame_content(
                    f"Write a brief narrative about {full_name}'s first job experience. in brief"
                    f"If no first job details are available, create a plausible professional origin story  in brief"
                    f"based on their skills in {skills}. Keep it short and direct. in brief"
                ),
                'current_work': self._generate_hall_of_fame_content(
                    f"Describe {full_name}'s current professional context in a few sentences.  in brief "
                    f"If no current work is specified, generate a forward-looking description  in brief"
                    f"that aligns with their skills in {skills}. Be concise and clear  in brief  strictly."
                )
            }

            return hall_of_fame_details

        except Exception as e:
            logger.error(f"Comprehensive error in hall of fame generation: {str(e)}")
            return {
                'achievements': "Unable to generate achievements.",
                'first_job': "Unable to generate first job narrative.",
                'current_work': "Unable to generate current work description."
            }

@csrf_exempt
def get_user_hall_of_fame(request):
    """
    Retrieve user's Hall of Fame details by email with robust error handling
    """
    try:
        # Get email from query parameters
        email = request.GET.get('email', '').strip()
        if not email:
            return JsonResponse({
                'success': False, 
                'message': 'Email is required'
            }, status=400)
        
        # Load API key securely
        GOOGLE_API_KEY = os.environ.get('GOOGLE_API_KEY')
        if not GOOGLE_API_KEY:
            logger.error("Google API Key is not set in environment variables")
            return JsonResponse({
                'success': False, 
                'message': 'API configuration error'
            }, status=500)
        
        # Initialize Hall of Fame generator
        hof_generator = HallOfFameGenerator(GOOGLE_API_KEY)

        # Find user by email in MongoDB
        user = hof_generator.db.users.find_one({'email': email})
        if not user:
            return JsonResponse({
                'success': False, 
                'message': 'User not found'
            }, status=404)
        
        # Convert entire user document to JSON-serializable format
        serializable_user = convert_to_json_serializable(user)
        
        # Generate Hall of Fame details with comprehensive error handling
        hall_of_fame_details = hof_generator.get_user_hall_of_fame_details(user)
        
        return JsonResponse({
            'success': True,
            'hall_of_fame': hall_of_fame_details
        })
    
    except Exception as e:
        logger.error(f"Unexpected error in hall of fame view: {str(e)}")
        return JsonResponse({
            'success': False, 
            'message': 'An unexpected error occurred'
        }, status=500)