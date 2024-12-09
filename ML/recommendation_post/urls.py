from django.urls import path
from .views import quantum_recommend_posts,generate_connection_interaction_strength,update_faiss_index

urlpatterns = [
    # Route for the Quantum Recommendation Posts API
    path('quantum_recommend_posts', quantum_recommend_posts, name='quantum_recommend_posts'),
    path('get_interaction/', generate_connection_interaction_strength, name='generate_connection_interaction_strength'),
    path('update_embedding/', update_faiss_index, name='update_faiss_index'),
]
