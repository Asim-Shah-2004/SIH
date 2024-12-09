from django.urls import path
from .views import quantum_recommend_posts,generate_connection_interaction_strength,update_faiss_index,get_user_connections,get_post_details

urlpatterns = [
    # Route for the Quantum Recommendation Posts API
    path('quantum_recommend_posts', quantum_recommend_posts, name='quantum_recommend_posts'),
    path('get_interaction/', generate_connection_interaction_strength, name='generate_connection_interaction_strength'),
    path('update_embedding/', update_faiss_index, name='update_faiss_index'),
    path('get_connection/',get_user_connections, name='get_user_connections'),
    path('get_post_detailss/',get_post_details, name='get_post_details'),
]
