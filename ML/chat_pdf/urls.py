from django.urls import path
from . import views

urlpatterns = [
    path('upload-pdf/', views.upload_pdf, name='upload_pdf'),
    path('query-pdf/', views.query_pdf, name='query_pdf'),
]