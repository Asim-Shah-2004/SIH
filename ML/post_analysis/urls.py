from django.urls import path
from .views import analyze_sentiment

urlpatterns = [
    path('post/analyze/', analyze_sentiment, name='analyze_sentiment'),
]   