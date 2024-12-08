from django.urls import path
from .views import quantum_recommend_posts,generate_connection_interaction_strength

urlpatterns = [
    # Route for the Quantum Recommendation Posts API
    path('quantum_recommend_posts', quantum_recommend_posts, name='quantum_recommend_posts'),
    path('get_interaction/', generate_connection_interaction_strength, name='generate_connection_interaction_strength'),
]
