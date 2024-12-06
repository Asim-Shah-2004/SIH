from django.urls import path
from .views import get_user_recommendations,recommend_by_interests,recommend_by_location,recommend_by_profession,get_comprehensive_recommendations

urlpatterns = [
   path('recommendations/', get_user_recommendations, name='user_recommendations'),
   path('recommend_by_interests/', recommend_by_interests, name='recommend_by_interests'),
   path('recommend_by_location/', recommend_by_location, name='recommend_by_location'),
   path('recommend_by_profession/', recommend_by_profession, name='recommend_by_profession'),
   path('get_comprehensive_recommendations/', get_comprehensive_recommendations, name='get_comprehensive_recommendations')
]