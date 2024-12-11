# urls.py
from django.urls import path
from .views import smart_search_view

urlpatterns = [
    path('smart-search/', smart_search_view, name='smart_search'),
]