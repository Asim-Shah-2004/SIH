
# Create your views here.
# urls.py
from django.urls import path
from  .views import get_user_hall_of_fame

urlpatterns = [
   path('hall-of-fame/', get_user_hall_of_fame, name='get_user_hall_of_fame'),
]
