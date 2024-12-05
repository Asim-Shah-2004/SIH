from django.urls import path
from .views import rewrite_text,analyze_emotion

urlpatterns = [
    path('rewrite/', rewrite_text, name='rewrite_text'),
    path('analyze_emotion/', analyze_emotion, name='analyze_text_emotion'),
]