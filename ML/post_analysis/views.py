from django.shortcuts import render

# Create your views here.
# backend/sentiment_app/views.py
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
import json

from .services import ComprehensiveSentimentAnalyzer
from dotenv import load_dotenv
load_dotenv()  # This will load variables from .env file
@csrf_exempt
@require_POST
def analyze_sentiment(request):
    try:
        # Parse incoming JSON data
        data = json.loads(request.body)
        post_content = data.get('post', '')

        if not post_content:
            return JsonResponse({
                'error': 'No post content provided'
            }, status=400)

        # Instantiate sentiment analyzer
        analyzer = ComprehensiveSentimentAnalyzer()
        
        # Perform sentiment analysis
        result = analyzer.analyze_sentiment(post_content)

        return JsonResponse(result)

    except Exception as e:
        return JsonResponse({
            'error': str(e)
        }, status=500)