import os
import io
import json
import numpy as np
import faiss
import pickle
from sentence_transformers import SentenceTransformer
from django.http import JsonResponse
from pymongo import MongoClient
from bson import Binary, ObjectId
from datetime import datetime, timedelta
from django.views.decorators.csrf import csrf_exempt

class MongoJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        if isinstance(obj, datetime):
            return obj.isoformat()
        return super().default(obj)

class PersistentFAISSRecommendationEngine:
    def __init__(self, mongo_url=None, max_recommendations=5):
        # MongoDB Connection
        if not mongo_url:
            mongo_url = os.getenv("MONGO_URL")
        
        try:
            # MongoDB Connection
            self.client = MongoClient(mongo_url)
            self.db = self.client['SIH07']
            self.users_collection = self.db['users']
            self.posts_collection = self.db['posts']
            self.index_collection = self.db['faiss_indices']  # New collection for index storage
            
            # Embedding Model
            self.embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
            self.max_recommendations = max_recommendations
            
            # Prepare or Load FAISS Index
            self._manage_faiss_index()
        
        except Exception as e:
            print(f"Initialization Error: {e}")
            raise
    
    def _serialize_faiss_index(self, index):
        """
        Serialize FAISS index to a binary format
        """
        # Create a temporary file
        import tempfile
        
        # Use a temporary file to write the index
        with tempfile.NamedTemporaryFile(delete=False) as tmp_file:
            faiss.write_index(index, tmp_file.name)
        
        # Read the file contents
        with open(tmp_file.name, 'rb') as f:
            serialized_index = f.read()
        
        # Clean up the temporary file
        import os
        os.unlink(tmp_file.name)
        
        return serialized_index

    def _deserialize_faiss_index(self, serialized_index):
        """
        Deserialize FAISS index from binary format
        """
        # Create a temporary file
        import tempfile
        
        # Write serialized index to a temporary file
        with tempfile.NamedTemporaryFile(delete=False, mode='wb') as tmp_file:
            tmp_file.write(serialized_index)
        
        # Read the index from the temporary file
        index = faiss.read_index(tmp_file.name)
        
        # Clean up the temporary file
        import os
        os.unlink(tmp_file.name)
        
        return index
    
    def _manage_faiss_index(self):
        """
        Manage FAISS index: check existing, update if needed, or create new
        """
        # Look for existing index
        existing_index = self.index_collection.find_one({
            'type': 'post_semantic_index'
        })
        
        current_time = datetime.now()
        
        if existing_index:
            # Check index age
            index_age = current_time - existing_index.get('created_at', current_time)
            
            # Recreate index if older than 7 days
            if index_age > timedelta(days=7):
                self._rebuild_faiss_index()
                return
            
            # Deserialize and load existing index
            try:
                self.faiss_index = self._deserialize_faiss_index(existing_index['index_data'])
                self.post_ids = existing_index['post_ids']
                return
            except Exception as e:
                print(f"Error loading existing index: {e}")
                # Fall back to rebuilding
        
        # Build new index if no valid existing index
        self._rebuild_faiss_index()
    
    def _rebuild_faiss_index(self, incremental=False):
        """
        Rebuild the FAISS index from scratch or incrementally
        
        :param incremental: If True, only add new posts since last index creation
        """
        # Fetch base query for posts
        query = {'text': {'$exists': True, '$ne': ''}}
        
        # If incremental, only fetch posts after last index creation
        if incremental:
            last_index = self.index_collection.find_one({'type': 'post_semantic_index'})
            if last_index and 'created_at' in last_index:
                query['createdAt'] = {'$gt': last_index['created_at']}
        
        # Fetch posts (limit increased for safety)
        posts = list(self.posts_collection.find(query).limit(20000))
        
        # If no new posts and incremental, return early
        if not posts and incremental:
            return False
        
        # Extract and embed texts
        texts = [post.get('text', '') for post in posts]
        embeddings = self.embedding_model.encode(texts)
        
        # If not incremental or first build, create a new index
        if not hasattr(self, 'faiss_index') or not incremental:
            dimension = embeddings.shape[1]
            index = faiss.IndexFlatL2(dimension)
            existing_post_ids = []
        else:
            # For incremental updates, use existing index
            index = self.faiss_index
            existing_post_ids = self.post_ids
        
        # Convert embeddings to float32 for FAISS
        embeddings_float32 = embeddings.astype('float32')
        
        # Add new embeddings to index
        index.add(embeddings_float32)
        
        # Combine post IDs
        all_post_ids = existing_post_ids + [str(post['_id']) for post in posts]
        
        # Serialize and store index in MongoDB
        serialized_index = self._serialize_faiss_index(index)
        
        # Store updated index in MongoDB
        self.index_collection.update_one(
            {'type': 'post_semantic_index'},
            {'$set': {
                'index_data': Binary(serialized_index),
                'post_ids': all_post_ids,
                'created_at': datetime.now(),
                'total_posts': len(all_post_ids)
            }},
            upsert=True
        )
        
        # Set instance variables
        self.faiss_index = index
        self.post_ids = all_post_ids
        
        return True
    
    def _compute_interaction_score(self, post):
        """
        Compute a quick interaction score
        """
        likes = len(post.get('likes', []))
        comments = len(post.get('comments', []))
        
        # Temporal decay
        post_age = (datetime.now() - post.get('createdAt', datetime.now())).days
        recency_factor = max(0, 1 - (post_age * 0.1))
        
        return (likes * 2 + comments * 3) * recency_factor
    
    def semantic_recommendations(self, current_user):
        """
        Generate semantic recommendations using persistent FAISS index
        with connection and interaction details
        """
        try:
            # Create a dictionary of connections for easy lookup
            current_user_connections = {
                str(conn['_id']): conn for conn in current_user.get('connections', [])
            }
            
            # Get user's text for semantic search
            user_posts = list(self.posts_collection.find({'userId': current_user['_id']}))
            if not user_posts:
                return []
            
            # Use first post or combined text for user embedding
            user_text = ' '.join([post.get('text', '') for post in user_posts])
            user_embedding = self.embedding_model.encode([user_text])[0]
            
            # Convert to float32
            user_embedding = user_embedding.astype('float32').reshape(1, -1)
            
            # Search FAISS index
            k = min(self.max_recommendations * 3, len(self.post_ids))
            distances, indices = self.faiss_index.search(user_embedding, k)
            
            # Helper function to process user interactions
            def process_user_interactions(user_id):
                # Convert user_id to string for dictionary lookup
                user_id_str = str(user_id)
                
                # Find the user
                user = self.users_collection.find_one({'_id': user_id})
                if not user:
                    return None
                
                # Check connection status and get interaction strength
                connection_info = None
                if user_id_str in current_user_connections:
                    connection_info = {
                        'is_connection': True,
                        'interaction_strength': current_user_connections[user_id_str].get('interaction_strength', 0)
                    }
                else:
                    connection_info = {
                        'is_connection': False,
                        'interaction_strength': 0  # Set to 0 for sorting purposes
                    }
                
                return {
                    'userId': str(user['_id']),
                    'fullName': user.get('fullName', 'Unknown'),
                    'email': user.get('email', ''),
                    'profilePhoto': user.get('profilePhoto', ''),
                    **connection_info
                }
            
            # Sorting function for interactions
            def sort_interactions(interactions):
                # Sort by:
                # 1. Connection status (connected first)
                # 2. Interaction strength (descending)
                return sorted(
                    interactions, 
                    key=lambda x: (-x['is_connection'], -x.get('interaction_strength', 0))
                )
            author_cache = {}
            def get_author_details(user_id):
                """
                Retrieve author details efficiently using a cache
                """
                user_id_str = str(user_id)
                if user_id_str not in author_cache:
                    author = self.users_collection.find_one({'_id': ObjectId(user_id)})
                    if author:
                        author_cache[user_id_str] = {
                            'fullName': author.get('fullName', 'Unknown'),
                            'profilePhoto': author.get('profilePhoto', '')
                        }
                    else:
                        author_cache[user_id_str] = {
                            'fullName': 'Unknown',
                            'profilePhoto': ''
                        }
                return author_cache[user_id_str]
            # Process recommendations
            recommendations = []
            seen_post_ids = set()
            
            for dist, idx in zip(distances[0], indices[0]):
                if idx >= len(self.post_ids):
                    continue
                
                post_id = self.post_ids[idx]
                if post_id in seen_post_ids:
                    continue
                
                # Fetch full post details
                post = self.posts_collection.find_one({'_id': ObjectId(post_id)})
                
                if not post or post['userId'] == current_user['_id']:
                    continue
                author_details = get_author_details(post['userId'])
                # Process likes with connection info
                likes_details = []
                for like_user_id in post.get('likes', []):
                    try:
                        like_user_info = process_user_interactions(like_user_id)
                        if like_user_info:
                            likes_details.append(like_user_info)
                    except Exception as e:
                        print(f"Error processing like user {like_user_id}: {e}")
                likes_details = sort_interactions(likes_details)
                
                # Process comments with connection info
                comments_details = []
                for comment in post.get('comments', []):
                    try:
                        comment_user_info = process_user_interactions(comment['userId'])
                        if comment_user_info:
                            comment_details = {
                                **comment_user_info,
                                'text': comment.get('text', ''),
                                'timestamp': comment.get('createdAt', '')
                            }
                            comments_details.append(comment_details)
                    except Exception as e:
                        print(f"Error processing comment user {comment['userId']}: {e}")
                comments_details = sort_interactions(comments_details)
                
                # Compute recommendation score
                semantic_score = 1.0 / (1.0 + dist)  # Convert distance to similarity
                interaction_score = self._compute_interaction_score(post)
                
                recommendation = {
                    'postId': str(post['_id']),
                    'text': post.get('text', ''),
                    'authorId': str(post['userId']),
                    'fullName': author_details['fullName'],
                    'profilePhoto': author_details['profilePhoto'],
                    'total_score': semantic_score * 1 + interaction_score * 0.3,
                    'media': post.get('media', []),
                    'likes': {
                        'total': len(likes_details),
                        'details': likes_details
                    },
                    'comments': {
                        'total': len(comments_details),
                        'details': comments_details
                    },
                    'timestamp': post.get('createdAt')
                }
                
                # Optionally, process reactions and shares similarly if they exist
                
                recommendations.append(recommendation)
                seen_post_ids.add(post_id)
                
                if len(recommendations) >= self.max_recommendations:
                    break
            
            # Sort recommendations by total score
            recommendations.sort(key=lambda x: x['total_score'], reverse=True)
            return recommendations[:self.max_recommendations]
        
        except Exception as e:
            print(f"Recommendation Error: {e}")
            return []

def quantum_recommend_posts(request):
    """
    Django view for persistent FAISS-powered semantic recommendations
    """
    if request.method == 'GET':
        # User email lookup
        user_email = request.GET.get('email', '').strip()
        
        if not user_email:
            return JsonResponse({
                'error': 'Email is required'
            }, status=400)

        # Get MongoDB URL from environment variable
        mongo_url = os.getenv("MONGO_URL")

        try:
            # Create recommendation engine
            recommender = PersistentFAISSRecommendationEngine(mongo_url, max_recommendations=5)
            
            # Find user by email
            current_user = recommender.users_collection.find_one({"email": user_email})
            
            if not current_user:
                return JsonResponse({
                    'error': 'User not found'
                }, status=404)
            
            # Get semantic recommendations
            recommendations = recommender.semantic_recommendations(current_user)
            
            # Use custom JSON encoder to handle ObjectId serialization
            return JsonResponse({
                'recommendations': json.loads(json.dumps(recommendations, cls=MongoJSONEncoder))
            })
        
        except Exception as e:
            print(f"Error in recommendations: {e}")
            return JsonResponse({
                'error': 'An error occurred while fetching recommendations'
            }, status=500)

@csrf_exempt
def update_faiss_index(request):
    """
    Route to trigger FAISS index update
    """
    if request.method == 'POST':
        try:
            # Get MongoDB URL from environment variable
            mongo_url = os.getenv("MONGO_URL")
            
            # Create recommendation engine
            recommender = PersistentFAISSRecommendationEngine(mongo_url)
            
            # Rebuild the index
            recommender._rebuild_faiss_index()
            
            return JsonResponse({
                'status': 'success',
                'message': 'FAISS index updated successfully'
            })
        
        except Exception as e:
            print(f"Error updating index: {e}")
            return JsonResponse({
                'status': 'error',
                'message': str(e)
            }, status=500)
    
    return JsonResponse({
        'error': 'Only POST method is allowed'
    }, status=405)


class MongoJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        if isinstance(obj, datetime):
            return obj.isoformat()
        return super().default(obj)

class QuantumInteractionStrengthCalculator:
    def __init__(self, mongo_url=None):
        # MongoDB Connection
        if not mongo_url:
            mongo_url = os.getenv("MONGO_URL", 
                "mongodb+srv://IPL_AUCTION_24:IPLAuction2024DontGuessAlsoUseVim@cluster0.ilknu4v.mongodb.net/SIH")
        
        try:
            client = MongoClient(mongo_url)
            self.db = client['SIH']
            self.users_collection = self.db['users3']
            self.posts_collection = self.db['post3']
            self.interactions_collection = self.db['interaction_strengths']
        except Exception as e:
            print(f"MongoDB Connection Error: {e}")
            raise
    def _calculate_professional_proximity(self, source_data, target_data):
        """
        Calculate professional closeness based on work experience and education
        """
        work_exp_score = 0
        education_score = 0
        
        # Compare work experiences
        for source_work in source_data.get('workExperience', []):
            for target_work in target_data.get('workExperience', []):
                # Check for similar roles, companies, or industries
                if (source_work.get('companyName') == target_work.get('companyName') or
                    self._are_roles_similar(source_work.get('role', ''), target_work.get('role', ''))):
                    work_exp_score += 0.5
        
        # Compare educational background
        for source_edu in source_data.get('education', []):
            for target_edu in target_data.get('education', []):
                if (source_edu.get('institution') == target_edu.get('institution') or
                    source_edu.get('degree') == target_edu.get('degree')):
                    education_score += 0.3
        
        return min(work_exp_score + education_score, 1.0)
    def _calculate_skill_resonance(self, source_user, target_user):
        """
        Calculate skill overlap and complementarity
        """
        source_skills = set(source_user.get('skills', []))
        target_skills = set(target_user.get('skills', []))
        
        # Calculate Jaccard similarity
        intersection = len(source_skills.intersection(target_skills))
        union = len(source_skills.union(target_skills))
        
        skill_similarity = intersection / union if union > 0 else 0
        
        # Bonus for complementary skills
        complementary_bonus = 0.2 if any(
            self._are_skills_complementary(s, t) 
            for s in source_skills 
            for t in target_skills
        ) else 0
        
        return min(skill_similarity + complementary_bonus, 1.0)
    def _are_skills_complementary(self, skill1, skill2):
        """
        Detect complementary skills
        """
        complementary_skill_pairs = [
            ('python', 'data science'),
            ('frontend', 'backend'),
            ('design', 'marketing'),
            ('machine learning', 'software engineering')
        ]
        
        return any(
            (skill1.lower() in pair[0] and skill2.lower() in pair[1]) or
            (skill1.lower() in pair[1] and skill2.lower() in pair[0])
            for pair in complementary_skill_pairs
        )
    def _calculate_social_graph_connectivity(self, source_user, target_user):
        """
        Analyze shared connections and network proximity
        """
        source_connections = set(conn['_id'] for conn in source_user.get('connections', []))
        target_connections = set(conn['_id'] for conn in target_user.get('connections', []))
        
        # Calculate shared connections
        shared_connections = len(source_connections.intersection(target_connections))
        
        # Normalize based on total connections
        total_connections = len(source_connections.union(target_connections))
        
        return min(shared_connections / (total_connections + 1), 1.0)
    
    def _calculate_content_interaction(self, source_user_id, target_user_id):
        """
        Measure interactions through posts, comments, likes
        """
        # Fetch posts and interactions
        source_posts = list(self.posts_collection.find({'userId': source_user_id}))
        target_posts = list(self.posts_collection.find({'userId': target_user_id}))
        
        # Count mutual interactions
        interaction_count = 0
        
        for source_post in source_posts:
            # Check if target user liked or commented
            if any(like.get('userId') == target_user_id for like in source_post.get('likes', [])):
                interaction_count += 0.3
            
            if any(comment.get('userId') == target_user_id for comment in source_post.get('comments', [])):
                interaction_count += 0.5
        
        return min(interaction_count, 1.0)
    
    def _calculate_geographic_proximity(self, source_user, target_user):
        """
        Calculate geographic closeness using Haversine formula
        """
        from math import radians, sin, cos, sqrt, atan2
        
        def haversine_distance(lat1, lon1, lat2, lon2):
            R = 6371  # Earth's radius in kilometers
            
            # Convert to radians
            lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
            
            # Haversine formula
            dlat = lat2 - lat1
            dlon = lon2 - lon1
            
            a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
            c = 2 * atan2(sqrt(a), sqrt(1-a))
            
            return R * c
        
        # Check location data
        source_location = source_user.get('location', {})
        target_location = target_user.get('location', {})
        
        if not (source_location and target_location):
            return 0
        
        # Calculate distance
        distance = haversine_distance(
            source_location.get('latitude', 0),
            source_location.get('longitude', 0),
            target_location.get('latitude', 0),
            target_location.get('longitude', 0)
        )
        
        # Convert distance to proximity score
        # Closer distances get higher scores
        proximity_score = max(1 - (distance / 10000), 0)  # Assuming max relevant distance is 10000 km
        
        return proximity_score
    
    def _calculate_temporal_engagement(self, source_user_id, target_user_id):
        """
        Analyze engagement patterns over time
        """
        from datetime import datetime, timedelta
        
        # Fetch posts and interactions
        source_posts = list(self.posts_collection.find({'userId': source_user_id}))
        
        # Time-based engagement analysis
        recent_interactions = []
        now = datetime.now()
        
        for post in source_posts:
            # Check for interactions by target user
            likes = [like for like in post.get('likes', []) if like.get('userId') == target_user_id]
            comments = [comment for comment in post.get('comments', []) if comment.get('userId') == target_user_id]
            
            for interaction in likes + comments:
                interaction_time = interaction.get('createdAt', now)
                time_diff = (now - interaction_time).days
                
                # Decay function - more recent interactions matter more
                recent_weight = max(1 - (time_diff / 365), 0)
                recent_interactions.append(recent_weight)
        
        # Calculate temporal engagement score
        return sum(recent_interactions) / (len(recent_interactions) + 1)
    
    def _calculate_serendipity_factor(self):
        """
        Introduce an element of unexpected connection
        """
        import random
        
        # Controlled randomness
        # High chance of low value, small chance of high value
        serendipity = random.betavariate(0.5, 2)
        return serendipity
    def _are_roles_similar(self, role1, role2):
        """
        Advanced role similarity detection using semantic matching
        """
        # This is a placeholder - in a real-world scenario, 
        # you'd use more sophisticated NLP techniques
        common_keywords = [
            'manager', 'developer', 'engineer', 'lead', 
            'senior', 'junior', 'director', 'analyst'
        ]
        
        if not role1 or not role2:
            return False
        
        role1_lower = role1.lower()
        role2_lower = role2.lower()
        
        # Basic keyword matching
        for keyword in common_keywords:
            if keyword in role1_lower and keyword in role2_lower:
                return True
        
        return False
    def calculate_interaction_strength(self, source_user_id, target_user_id):
        """
        Quantum-inspired multi-dimensional interaction strength calculation
        
        Handles ObjectId inputs by converting to string
        """
        try:
            # Convert to ObjectId
            source_user_id = ObjectId(str(source_user_id))
            target_user_id = ObjectId(str(target_user_id))
            
            # Fetch full user documents
            source_user = self.users_collection.find_one({'_id': source_user_id})
            target_user = self.users_collection.find_one({'_id': target_user_id})
            
            if not source_user or not target_user:
                print(f"User not found: Source {source_user_id}, Target {target_user_id}")
                return 0
            
            # Safely extract user data
            source_data = {
                'workExperience': source_user.get('workExperience', []),
                'education': source_user.get('education', []),
                'skills': source_user.get('skills', []),
                'location': source_user.get('location', {}),
                'connections': source_user.get('connections', [])
            }
            
            target_data = {
                'workExperience': target_user.get('workExperience', []),
                'education': target_user.get('education', []),
                'skills': target_user.get('skills', []),
                'location': target_user.get('location', {}),
                'connections': target_user.get('connections', [])
            }
            
            # 1. Professional Proximity Score
            professional_proximity = self._calculate_professional_proximity(source_data, target_data)
            
            # 2. Skill Resonance
            skill_resonance = self._calculate_skill_resonance(source_data, target_data)
            
            # 3. Social Graph Connectivity
            social_connectivity = self._calculate_social_graph_connectivity(source_data, target_data)
            
            # 4. Content Interaction Intensity
            content_interaction = self._calculate_content_interaction(str(source_user_id), str(target_user_id))
            
            # 5. Geographic Relevance
            geographic_relevance = self._calculate_geographic_proximity(source_data, target_data)
            
            # 6. Temporal Engagement Pattern
            temporal_engagement = self._calculate_temporal_engagement(str(source_user_id), str(target_user_id))
            
            # 7. Probabilistic Serendipity Factor
            serendipity_factor = self._calculate_serendipity_factor()
            
            # Quantum-inspired Non-linear Combination
            interaction_strength = (
                0.25 * professional_proximity +
                0.20 * skill_resonance +
                0.15 * social_connectivity +
                0.15 * content_interaction +
                0.10 * geographic_relevance +
                0.10 * temporal_engagement +
                0.05 * serendipity_factor
            )
            
            # Normalize and scale
            final_score = min(max(interaction_strength * 10, 0), 100)
            
            print(f"Interaction Strength Breakdown:")
            print(f"Professional Proximity: {professional_proximity}")
            print(f"Skill Resonance: {skill_resonance}")
            print(f"Social Connectivity: {social_connectivity}")
            print(f"Content Interaction: {content_interaction}")
            print(f"Geographic Relevance: {geographic_relevance}")
            print(f"Temporal Engagement: {temporal_engagement}")
            print(f"Serendipity Factor: {serendipity_factor}")
            print(f"Final Score: {final_score}")
            
            return final_score
        
        except Exception as e:
            print(f"Detailed Interaction Strength Calculation Error: {e}")
            return 0
    
    def store_interaction_strength(self, source_user_id, target_user_id, interaction_strength):
        """
        Store interaction strength in the database
        """
        try:
            # Convert to ObjectId
            source_user_id = ObjectId(str(source_user_id))
            target_user_id = ObjectId(str(target_user_id))
            
            # Prepare interaction document
            interaction_doc = {
                'source_user_id': source_user_id,
                'target_user_id': target_user_id,
                'interaction_strength': interaction_strength,
                'created_at': datetime.now(),
                'last_updated': datetime.now()
            }
            
            # Check if interaction already exists
            existing_interaction = self.interactions_collection.find_one({
                'source_user_id': source_user_id,
                'target_user_id': target_user_id
            })
            
            if existing_interaction:
                # Update existing interaction
                self.interactions_collection.update_one(
                    {
                        'source_user_id': source_user_id,
                        'target_user_id': target_user_id
                    },
                    {'$set': {
                        'interaction_strength': interaction_strength,
                        'last_updated': datetime.now()
                    }}
                )
                print(f"Updated interaction strength between {source_user_id} and {target_user_id}")
            else:
                # Insert new interaction
                self.interactions_collection.insert_one(interaction_doc)
                print(f"Stored new interaction strength between {source_user_id} and {target_user_id}")
            
            return True
        except Exception as e:
            print(f"Error storing interaction strength: {e}")
            return False
    
    def get_stored_interaction_strength(self, source_user_id, target_user_id):
        """
        Retrieve stored interaction strength
        """
        try:
            # Convert to ObjectId
            source_user_id = ObjectId(str(source_user_id))
            target_user_id = ObjectId(str(target_user_id))
            
            # Find the interaction
            interaction = self.interactions_collection.find_one({
                'source_user_id': source_user_id,
                'target_user_id': target_user_id
            })
            
            if interaction:
                return interaction.get('interaction_strength', 0)
            
            return 0
        except Exception as e:
            print(f"Error retrieving interaction strength: {e}")
            return 0

    # ... (rest of the existing methods remain the same)

# New Django views
@csrf_exempt
def generate_connection_interaction_strength(request):
    """
    Django view to generate and store interaction strength when a connection is made
    """
    if request.method == 'POST':
        try:
            # Parse JSON data
            data = json.loads(request.body)
            source_user_id = data.get('source_user_id')
            target_user_id = data.get('target_user_id')
            
            # Validate input
            if not source_user_id or not target_user_id:
                return JsonResponse({
                    'error': 'Source and target user IDs are required'
                }, status=400)
            
            # Create interaction strength calculator
            calculator = QuantumInteractionStrengthCalculator()
            
            # Calculate interaction strength
            interaction_strength = calculator.calculate_interaction_strength(
                source_user_id, 
                target_user_id
            )
            
            # Store interaction strength
            success = calculator.store_interaction_strength(
                source_user_id, 
                target_user_id, 
                interaction_strength
            )
            
            if success:
                return JsonResponse({
                    'interaction_strength': interaction_strength,
                    'message': 'Interaction strength calculated and stored successfully'
                })
            else:
                return JsonResponse({
                    'error': 'Failed to store interaction strength'
                }, status=500)
        
        except json.JSONDecodeError:
            return JsonResponse({
                'error': 'Invalid JSON'
            }, status=400)
        except Exception as e:
            print(f"Error in connection interaction strength generation: {e}")
            return JsonResponse({
                'error': 'An unexpected error occurred'
            }, status=500)
    
    return JsonResponse({
        'error': 'Method not allowed'
    }, status=405)



@csrf_exempt
def get_user_connections(request):
    """
    Django view to retrieve detailed connection information for a user
    """
    if request.method == 'GET':
        try:
            # Get user ID from query parameters
            user_id = request.GET.get('user_id')
            print(user_id)
            if not user_id:
                return JsonResponse({
                    'error': 'User ID is required'
                }, status=400)
            
            # Convert to ObjectId if needed
            try:
                user_id = ObjectId(user_id)
            except:
                return JsonResponse({
                    'error': 'Invalid user ID format'
                }, status=400)
            
            # MongoDB Connection (assuming same connection as other methods)
            client = MongoClient(os.getenv("MONGO_URL"))
            db = client['SIH']
            users_collection = db['users3']
            
            # Find the user
            user = users_collection.find_one({'_id': user_id})
            
            if not user:
                return JsonResponse({
                    'error': 'User not found'
                }, status=404)
            
            # Prepare connections details
            connection_details = []
            
            # Check if connections exist
            if user.get('connections'):
                print("user connections are:",user['connections'])
                for connection in user['connections']:
                    
                    
                    connection_info = {
                        'name': connection.get('fullName', 0),
                        'interaction_strength': connection.get('interaction_strength', 0),
                        
                    }
                    
                    connection_details.append(connection_info)
            
            
            return JsonResponse({
                'total_connections': len(connection_details),
                'connections': connection_details
            })
        
        except Exception as e:
            print(f"Error retrieving user connections: {e}")
            return JsonResponse({
                'error': 'An unexpected error occurred'
            }, status=500)
    
    return JsonResponse({
        'error': 'Method not allowed'
    }, status=405)


@csrf_exempt
def get_post_details(request):
    """
    Django view to retrieve comprehensive post details including 
    likes, comments, reactions, shares, and connection details
    Sorted by connection status and interaction strength
    """
    if request.method == 'GET':
        try:
            # Get post ID from query parameters
            post_id = request.GET.get('post_id')
            
            # Validate post ID
            if not post_id:
                return JsonResponse({
                    'error': 'Post ID is required'
                }, status=400)
            
            # Convert to ObjectId
            try:
                post_id = ObjectId(post_id)
            except:
                return JsonResponse({
                    'error': 'Invalid post ID format'
                }, status=400)
            
            # MongoDB Connection
            client = MongoClient(os.getenv("MONGO_URL"))
            db = client['SIH']
            posts_collection = db['post3']
            users_collection = db['users3']
            
            # Find the post
            post = posts_collection.find_one({'_id': post_id})
            if not post:
                return JsonResponse({
                    'error': 'Post not found'
                }, status=404)
            
            # Get post owner details
            try:
                post_owner = users_collection.find_one({'_id': post['userId']})
                owner_info = {
                    'user_id': str(post_owner['_id']),
                    'name': post_owner.get('fullName', 'Unknown'),
                    'email': post_owner.get('email', '')
                }
                
                # Create a dictionary of connections for easy lookup
                owner_connections = {
                    str(conn['_id']): conn for conn in post_owner.get('connections', [])
                }
            except:
                owner_info = {
                    'user_id': '',
                    'name': 'Unknown',
                    'email': ''
                }
                owner_connections = {}
            
            # Helper function to process user interactions
            def process_user_interactions(user_id):
                # Convert user_id to string for dictionary lookup
                user_id_str = str(user_id)
                
                # Find the user
                user = users_collection.find_one({'_id': user_id})
                if not user:
                    return None
                
                # Check connection status and get interaction strength
                connection_info = None
                if user_id_str in owner_connections:
                    connection_info = {
                        'is_connection': True,
                        'interaction_strength': owner_connections[user_id_str].get('interaction_strength', 0)
                    }
                else:
                    connection_info = {
                        'is_connection': False,
                        'interaction_strength': 0  # Set to 0 for sorting purposes
                    }
                
                return {
                    'user_id': str(user['_id']),
                    'name': user.get('fullName', 'Unknown'),
                    'email': user.get('email', ''),
                    **connection_info
                }
            
            # Sorting function for interactions
            def sort_interactions(interactions):
                # Sort by:
                # 1. Connection status (connected first)
                # 2. Interaction strength (descending)
                return sorted(
                    interactions, 
                    key=lambda x: (-x['is_connection'], -x.get('interaction_strength', 0))
                )
            
            # Process likes
            likes_details = []
            for like_user_id in post.get('likes', []):
                try:
                    like_user_info = process_user_interactions(like_user_id)
                    if like_user_info:
                        likes_details.append(like_user_info)
                except Exception as e:
                    print(f"Error processing like user {like_user_id}: {e}")
            likes_details = sort_interactions(likes_details)
            
            # Process comments
            comments_details = []
            for comment in post.get('comments', []):
                try:
                    comment_user_info = process_user_interactions(comment['userId'])
                    if comment_user_info:
                        comment_details = {
                            **comment_user_info,
                            'text': comment.get('text', ''),
                            'created_at': comment.get('createdAt', '')
                        }
                        comments_details.append(comment_details)
                except Exception as e:
                    print(f"Error processing comment user {comment['userId']}: {e}")
            comments_details = sort_interactions(comments_details)
            
            # Process reactions
            reactions_details = []
            for reaction in post.get('reactions', []):
                try:
                    reaction_user_info = process_user_interactions(reaction['userId'])
                    if reaction_user_info:
                        reaction_details = {
                            **reaction_user_info,
                            'reaction_type': reaction.get('type', '')
                        }
                        reactions_details.append(reaction_details)
                except Exception as e:
                    print(f"Error processing reaction user {reaction['userId']}: {e}")
            reactions_details = sort_interactions(reactions_details)
            
            # Process shares
            shares_details = []
            for share_user_id in post.get('shares', []):
                try:
                    share_user_info = process_user_interactions(share_user_id)
                    if share_user_info:
                        shares_details.append(share_user_info)
                except Exception as e:
                    print(f"Error processing share user {share_user_id}: {e}")
            shares_details = sort_interactions(shares_details)
            
            # Prepare response
            response_data = {
                'post_id': str(post['_id']),
                'owner': owner_info,
                'total_likes': len(likes_details),
                'likes': likes_details,
                'total_comments': len(comments_details),
                'comments': comments_details,
                'total_reactions': len(reactions_details),
                'reactions': reactions_details,
                'total_shares': len(shares_details),
                'shares': shares_details
            }
            
            return JsonResponse(response_data)
        
        except Exception as e:
            print(f"Error retrieving post details: {e}")
            return JsonResponse({
                'error': 'An unexpected error occurred'
            }, status=500)
    
    return JsonResponse({
        'error': 'Method not allowed'
    }, status=405)