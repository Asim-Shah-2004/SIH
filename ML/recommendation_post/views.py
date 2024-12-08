from django.shortcuts import render
from django.http import JsonResponse
from pymongo import MongoClient
from bson import ObjectId
import numpy as np
import networkx as nx
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from scipy.stats import entropy
from datetime import datetime, timedelta
from django.views.decorators.csrf import csrf_exempt
import random
import os
import json
class MongoJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        if isinstance(obj, datetime):
            return obj.isoformat()
        return super().default(obj)

class QuantumRecommendationEngine:
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
            self.interactions_collection = self.db['interactions']  # New collection for tracking interactions
        except Exception as e:
            print(f"MongoDB Connection Error: {e}")
            raise
        
        # Quantum-inspired recommendation components
        self.social_graph = None
        self.interaction_entropy_map = {}
        self.global_vectorizer = None
    
    def _prepare_global_vectorizer(self):
        """
        Prepare a global TF-IDF vectorizer with all available text
        """
        # Collect all post texts
        all_texts = [post.get('text', '') for post in self.posts_collection.find({})]
        
        # Ensure at least one text exists
        if not all_texts:
            all_texts = ['default text']
        
        # Clean and filter texts
        all_texts = [text for text in all_texts if text and isinstance(text, str)]
        
        # Create and fit vectorizer
        self.global_vectorizer = TfidfVectorizer(stop_words='english')
        self.global_vectorizer.fit(all_texts)
    
    def _quantum_similarity_scoring(self, current_user, potential_post):
        """
        Quantum-inspired similarity scoring with robust feature extraction
        """
        # Ensure global vectorizer is prepared
        if self.global_vectorizer is None:
            self._prepare_global_vectorizer()
        
        # Validate inputs
        if not current_user or not potential_post:
            return 0
        
        # Fetch current user's posts
        current_user_posts = list(self.posts_collection.find({'userId': current_user['_id']}))
        
        # Prepare texts
        user_texts = [str(post.get('text', '')) for post in current_user_posts if post.get('text')]
        post_text = str(potential_post.get('text', ''))
        
        # Handle case with no user texts or empty post text
        if not user_texts or not post_text.strip():
            return 0
        
        try:
            # Transform texts using vectorizer
            user_features = self.global_vectorizer.transform(user_texts)
            post_features = self.global_vectorizer.transform([post_text])
            
            # Ensure user features is not empty
            if user_features.shape[0] == 0:
                return 0
            
            # Compute mean user features, handling potential shape issues
            user_mean_features = np.asarray(user_features.mean(axis=0)).reshape(1, -1)
            
            # Compute cosine similarity
            text_similarity = cosine_similarity(user_mean_features, post_features)[0][0]
        except Exception as e:
            print(f"Detailed Similarity computation error: {e}")
            text_similarity = 0
        
        # Social graph proximity
        if not self.social_graph:
            self._construct_social_influence_network()
        
        # Compute path length and centrality in social graph
        try:
            # Check if source and target exist in graph
            if current_user['_id'] in self.social_graph and potential_post['userId'] in self.social_graph:
                path_length = nx.shortest_path_length(
                    self.social_graph, 
                    source=current_user['_id'], 
                    target=potential_post['userId']
                )
            else:
                path_length = len(self.social_graph.nodes)  # Maximum possible distance
        except nx.NetworkXNoPath:
            path_length = len(self.social_graph.nodes)  # Maximum possible distance
        
        # Social graph proximity score (inverse of path length)
        social_proximity_score = 1 / (path_length + 1)
        
        # Interaction entropy influence
        if current_user['_id'] not in self.interaction_entropy_map:
            self.interaction_entropy_map[current_user['_id']] = self._compute_interaction_entropy(current_user['_id'])
        
        user_entropy = self.interaction_entropy_map[current_user['_id']]
        
        # Temporal decay with exponential falloff
        post_age = (datetime.now() - potential_post.get('createdAt', datetime.now())).days
        temporal_relevance = np.exp(-0.1 * post_age)
        
        # Quantum-inspired scoring: non-linear combination with entropy-based randomness
        quantum_score = (
            0.4 * text_similarity + 
            0.3 * social_proximity_score + 
            0.2 * temporal_relevance + 
            0.1 * (user_entropy + random.random())  # Add controlled randomness
        )
        
        return quantum_score
    
    def _construct_social_influence_network(self):
        """
        Create a complex social graph that captures multidimensional relationships
        Using networkx to model sophisticated social interactions
        """
        G = nx.DiGraph()
        
        # Gather all users and their interactions
        users = list(self.users_collection.find({}))
        
        for user in users:
            G.add_node(user['_id'], attributes=user)
            
            # Add connections with weighted edges
            for connection in user.get('connections', []):
                # Multiple edge attributes to capture relationship complexity
                try:
                    G.add_edge(
                        user['_id'], 
                        connection['_id'], 
                        weight=connection.get('interaction_strength', 1),
                        interaction_type=connection.get('type', 'generic'),
                        timestamp=connection.get('last_interaction')
                    )
                except Exception as e:
                    print(f"Error adding connection to graph: {e}")
        
        self.social_graph = G
        return G
    
    def _compute_interaction_entropy(self, user_id):
        """
        Measure the randomness and unpredictability of user interactions
        Higher entropy suggests more diverse and exploratory behavior
        """
        user_posts = list(self.posts_collection.find({'userId': user_id}))
        
        # Collect interaction types
        interaction_types = []
        for post in user_posts:
            interaction_types.extend([
                'like' if post.get('likes') and len(post.get('likes', [])) > 0 else 'no_like',
                'comment' if post.get('comments') and len(post.get('comments', [])) > 0 else 'no_comment'
            ])
        
        # Handle case with no interactions
        if not interaction_types:
            return 0
        
        # Compute Shannon entropy to measure interaction diversity
        interaction_counts = {}
        for itype in interaction_types:
            interaction_counts[itype] = interaction_counts.get(itype, 0) + 1
        
        probabilities = [count/len(interaction_types) for count in interaction_counts.values()]
        return entropy(probabilities)
    def _compute_interaction_priority(self, post, current_user):
        """
        Compute priority score based on recent interactions with the post
        Includes likes, comments, shares, and interaction recency
        """
        interaction_signals = {
            'likes': [],
            'comments': [],
            'shares': []
        }
        
        # Fetch interactions for this specific post
        interactions = list(self.interactions_collection.find({
            'postId': post['_id'],
            'interactionType': {'$in': ['like', 'comment', 'share']}
        }))
        
        for interaction in interactions:
            interaction_user = self.users_collection.find_one({'_id': interaction['userId']})
            
            # Classify interaction type and extract user details
            interaction_details = {
                'userId': str(interaction['userId']),
                'userName': interaction_user.get('fullName', 'Unknown'),
                'userProfilePic': interaction_user.get('profilePhoto'),
                'timestamp': interaction.get('timestamp', datetime.now()),
                'type': interaction.get('interactionType')
            }
            
            # Categorize interactions
            if interaction['interactionType'] == 'like':
                interaction_signals['likes'].append(interaction_details)
            elif interaction['interactionType'] == 'comment':
                interaction_signals['comments'].append(interaction_details)
            elif interaction['interactionType'] == 'share':
                interaction_signals['shares'].append(interaction_details)
        
        # Compute interaction priority
        priority_score = 0
        connection_interaction_multiplier = 1.5  # Higher priority for connections
        
        # Likes priority
        for like in interaction_signals['likes']:
            is_connection = any(
                str(conn.get('_id', '')) == like['userId'] 
                for conn in current_user.get('connections', [])
            )
            priority_score += (2 if is_connection else 1)
        
        # Comments priority (higher weight)
        for comment in interaction_signals['comments']:
            is_connection = any(
                str(conn.get('_id', '')) == comment['userId'] 
                for conn in current_user.get('connections', [])
            )
            priority_score += (3 if is_connection else 1.5)
        
        # Shares priority (highest weight)
        for share in interaction_signals['shares']:
            is_connection = any(
                str(conn.get('_id', '')) == share['userId'] 
                for conn in current_user.get('connections', [])
            )
            priority_score += (4 if is_connection else 2)
        
        # Temporal decay for interactions
        recency_factor = np.exp(-0.1 * (datetime.now() - post.get('createdAt', datetime.now())).days)
        priority_score *= recency_factor
        
        return {
            'priority_score': priority_score,
            'interaction_signals': interaction_signals
        }
    def advanced_quantum_recommendation(self, current_user):
        """
        Hyper-advanced recommendation using quantum-inspired multi-dimensional scoring
        Incorporates detailed interaction signals and complex social dynamics
        """
        # Get user's connections
        user_connections = current_user.get('connections', [])
        connection_ids = [conn['_id'] for conn in user_connections if isinstance(conn, dict) and '_id' in conn]
        
        # Find posts from user's connections first
        connection_posts = list(self.posts_collection.find({
            'userId': {'$in': connection_ids},
            '_id': {'$ne': current_user['_id']}
        }))
        
        # Find posts from outside user's immediate network
        other_posts = list(self.posts_collection.find({
            'userId': {'$nin': connection_ids + [current_user['_id']]}
        }))
        
        # Comprehensive post scoring and processing
        all_scored_posts = []
        
        # Process connection posts with priority
        for post in connection_posts:
            try:
                # Compute quantum similarity score
                quantum_score = self._quantum_similarity_scoring(current_user, post)
                
                # Compute interaction priority
                interaction_data = self._compute_interaction_priority(post, current_user)
                
                # Find connection details
                post_author_id = str(post['userId'])
                author_details = self.users_collection.find_one({'_id': post['userId']})
                
                # Construct comprehensive post data
                comprehensive_post = {
                    'post': post,
                    'quantum_score': quantum_score,
                    'interaction_priority': interaction_data['priority_score'],
                    'interaction_signals': interaction_data['interaction_signals'],
                    'is_connection_post': True,
                    'connection_info': {
                        '_id': post_author_id,
                        'name': author_details.get('fullName'),
                        'email': author_details.get('email'),
                        'profile_picture': author_details.get('profilePhoto'),
                        'occupation': author_details.get('workExperience')
                    }
                }
                
                all_scored_posts.append(comprehensive_post)
            
            except Exception as e:
                print(f"Processing error for connection post {post.get('_id')}: {e}")
        
        # Process other posts
        for post in other_posts:
            try:
                # Compute quantum similarity score
                quantum_score = self._quantum_similarity_scoring(current_user, post)
                
                # Compute interaction priority
                interaction_data = self._compute_interaction_priority(post, current_user)
                
                # Find author details
                author_details = self.users_collection.find_one({'_id': post['userId']})
                
                # Construct comprehensive post data
                comprehensive_post = {
                    'post': post,
                    'quantum_score': quantum_score,
                    'interaction_priority': interaction_data['priority_score'],
                    'interaction_signals': interaction_data['interaction_signals'],
                    'is_connection_post': False,
                    'connection_info': {
                        '_id': str(post['userId']),
                        'name': author_details.get('fullName'),
                        'email': author_details.get('email'),
                        'profile_picture': author_details.get('profilePhoto'),
                        'occupation': author_details.get('workExperience')
                    }
                }
                
                all_scored_posts.append(comprehensive_post)
            
            except Exception as e:
                print(f"Processing error for other post {post.get('_id')}: {e}")
        
        # Advanced multi-dimensional sorting
        all_scored_posts.sort(
            key=lambda x: (
                x.get('is_connection_post', False),  # Priority to connection posts
                x.get('interaction_priority', 0),    # High interaction priority
                x.get('quantum_score', 0)            # Quantum similarity score
            ), 
            reverse=True
        )
        
        # Prepare refined recommendation output
        recommended_posts = []
        for post_data in all_scored_posts:
            recommendation = {
                'post_id': str(post_data['post']['_id']),
                'text': post_data['post'].get('text', ''),
                'author_id': str(post_data['post']['userId']),
                'quantum_score': post_data['quantum_score'],
                'interaction_priority': post_data['interaction_priority'],
                'is_connection_post': post_data['is_connection_post'],
                'connection_info': post_data['connection_info'],
                'interaction_signals': {
                    'likes': [
                        {
                            'user_id': like['userId'],
                            'user_name': like['userName'],
                            'profile_picture': like['userProfilePic'],
                            'timestamp': like['timestamp']
                        } for like in post_data['interaction_signals']['likes']
                    ],
                    'comments': [
                        {
                            'user_id': comment['userId'],
                            'user_name': comment['userName'],
                            'profile_picture': comment['userProfilePic'],
                            'timestamp': comment['timestamp']
                        } for comment in post_data['interaction_signals']['comments']
                    ],
                    'shares': [
                        {
                            'user_id': share['userId'],
                            'user_name': share['userName'],
                            'profile_picture': share['userProfilePic'],
                            'timestamp': share['timestamp']
                        } for share in post_data['interaction_signals']['shares']
                    ]
                }
            }
            recommended_posts.append(recommendation)
        
        return recommended_posts
# Modified quantum_recommend_posts view
def quantum_recommend_posts(request):
    """Django view for quantum post recommendations"""
    if request.method == 'GET':
        # Use email for user lookup
        # Strip any whitespace or newline characters
        user_email = request.GET.get('email', '').strip()
        
        print(f"Received email: {user_email}")

        # Validate email
        if not user_email:
            return JsonResponse({
                'error': 'Email is required'
            }, status=400)

        # Get MongoDB URL from environment variable
        mongo_url = os.getenv("MONGO_URL")

        try:
            # Create recommendation engine with optional mongo_url
            recommender = QuantumRecommendationEngine(mongo_url)
            
            # Find user by email
            current_user = recommender.users_collection.find_one({"email": user_email})
            
            if not current_user:
                return JsonResponse({
                    'error': 'User not found'
                }, status=404)
            
            # Get quantum recommendations
            recommendations = recommender.advanced_quantum_recommendation(current_user)
            
            # Use custom JSON encoder to handle ObjectId serialization
            return JsonResponse({
                'recommendations': json.loads(json.dumps(recommendations, cls=MongoJSONEncoder))
            })
        
        except Exception as e:
            print(f"Error in quantum recommendations: {e}")
            return JsonResponse({
                'error': 'An error occurred while fetching recommendations'
            }, status=500)
        




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