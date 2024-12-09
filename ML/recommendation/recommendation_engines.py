from django.views.decorators.http import require_POST
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from pymongo import MongoClient
from bson import ObjectId
import json
from pymongo import MongoClient
from bson import ObjectId, json_util
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from gensim.models import Word2Vec
import networkx as nx
import random
from scipy.spatial.distance import pdist, squareform
from bson import json_util
import json
from geopy.geocoders import Nominatim

class ProfessionalNetworkRecommender:
            def __init__(self, users_collection, current_user):
                self.users_collection = users_collection
                self.current_user = current_user
            
            def _hashable_representation(self, obj):
                """
                Convert complex objects to hashable representations
                
                Args:
                    obj: Input object (can be dict, list, or primitive)
                
                Returns:
                    Hashable representation of the object
                """
                if isinstance(obj, dict):
                    # Convert dict to a sorted tuple of (key, hashable_value) pairs
                    return tuple(
                        (k, self._hashable_representation(v)) 
                        for k, v in sorted(obj.items())
                    )
                elif isinstance(obj, list):
                    # Convert list to a tuple of hashable representations
                    return tuple(self._hashable_representation(item) for item in obj)
                elif isinstance(obj, (str, int, float, bool, type(None))):
                    # Primitive types are already hashable
                    return obj
                else:
                    # For any other type, convert to string
                    return str(obj)
            
            def compute_professional_distance(self, user1, user2):
                """
                Compute professional distance between two users
                
                Args:
                    user1, user2: User dictionaries
                
                Returns:
                    Float representing professional similarity
                """
                distance_features = [
                    'role', 'skills', 'workExperience', 'education'
                ]
                
                total_features = len(distance_features)
                matched_features = 0
                
                for feature in distance_features:
                    # Convert to hashable representations
                    user1_feature = set(
                        self._hashable_representation(x) 
                        for x in user1.get(feature, [])
                    )
                    user2_feature = set(
                        self._hashable_representation(x) 
                        for x in user2.get(feature, [])
                    )
                    
                    if feature == 'role':
                        # Exact role match
                        matched_features += 1 if user1.get(feature) == user2.get(feature) else 0
                    else:
                        # Compute feature overlap
                        common_elements = len(user1_feature & user2_feature)
                        matched_features += common_elements / max(
                            len(user1_feature), 
                            len(user2_feature), 
                            1
                        )
                
                return matched_features / total_features
            
            def probabilistic_professional_network(self, similar_profession_users):
                """
                Create probabilistic professional network
                
                Args:
                    similar_profession_users: List of user dictionaries
                
                Returns:
                    List of recommended users
                """
                import numpy as np
                
                # Ensure we have enough users
                if len(similar_profession_users) < 2:
                    return similar_profession_users
                
                # Create similarity matrix
                similarity_matrix = np.zeros((len(similar_profession_users), len(similar_profession_users)))
                
                for i, user1 in enumerate(similar_profession_users):
                    for j, user2 in enumerate(similar_profession_users):
                        if i != j:
                            similarity_matrix[i, j] = self.compute_professional_distance(user1, user2)
                
                # Normalize similarity matrix
                row_sums = similarity_matrix.sum(axis=1)
                # Avoid division by zero
                row_sums[row_sums == 0] = 1
                random_walk_matrix = similarity_matrix / row_sums[:, np.newaxis]
                
                # Random walk recommendation
                initial_prob = np.ones(len(similar_profession_users)) / len(similar_profession_users)
                num_walks = min(10, len(similar_profession_users))
                
                recommendations = []
                for _ in range(num_walks):
                    current_prob = initial_prob.copy()
                    for _ in range(5):  # Walk 5 steps
                        current_prob = current_prob @ random_walk_matrix
                    
                    # Get top recommendations from this walk
                    top_indices = current_prob.argsort()[::-1][:3]
                    recommendations.extend([similar_profession_users[idx] for idx in top_indices])
                
                # Remove duplicates while preserving order
                unique_recommendations = []
                seen = set()
                for user in recommendations:
                    user_id = self._hashable_representation(user.get('_id', {}))
                    if user_id not in seen:
                        seen.add(user_id)
                        unique_recommendations.append(user)
                
                return unique_recommendations[:10]
            
            def recommend(self, limit=10):
                """
                Main recommendation method
                
                Args:
                    limit: Maximum number of recommendations
                
                Returns:
                    List of recommended users
                """
                # Find users in the same professional domain
                similar_profession_users = list(self.users_collection.find({
                    '_id': {'$ne': self.current_user['_id']},
                    'role': self.current_user['role']
                }))
                
                if len(similar_profession_users) <= 5:
                    # Simple sorting if few users
                    similar_profession_users.sort(
                        key=lambda x: len(
                            set(self._hashable_representation(skill) 
                                for skill in x.get('skills', []))
                            & 
                            set(self._hashable_representation(skill) 
                                for skill in self.current_user.get('skills', []))
                        ),
                        reverse=True
                    )
                    recommendations = similar_profession_users[:limit]
                else:
                    # Advanced probabilistic professional network recommendation
                    recommendations = self.probabilistic_professional_network(
                        similar_profession_users
                    )
                
                return recommendations

import math
def haversine_distance(loc1, loc2):
            """
            Calculate great circle distance between two geographic points
            
            Args:
                loc1 (dict): First location with latitude and longitude
                loc2 (dict): Second location with latitude and longitude
            
            Returns:
                float: Distance in kilometers
            """
            # Radius of the Earth in kilometers
            R = 6371.0
            
            def safe_get_coordinate(location, coord_type):
                """
                Safely extract coordinate value
                
                Args:
                    location (dict): Location dictionary
                    coord_type (str): 'latitude' or 'longitude'
                
                Returns:
                    float: Coordinate value
                """
                # Try multiple potential key formats
                possible_keys = [
                    coord_type, 
                    coord_type.lower(), 
                    f'{coord_type}Coordinate', 
                    f'{coord_type}_coordinate',
                    f'{coord_type}_coords'
                ]
                
                for key in possible_keys:
                    if key in location and isinstance(location[key], (int, float)):
                        return float(location[key])
                
                # If no valid coordinate found
                raise ValueError(f"Could not find valid {coord_type} coordinate")
            
            try:
                # Extract coordinates with flexible parsing
                lat1 = safe_get_coordinate(loc1, 'latitude')
                lon1 = safe_get_coordinate(loc1, 'longitude')
                lat2 = safe_get_coordinate(loc2, 'latitude')
                lon2 = safe_get_coordinate(loc2, 'longitude')
                
                # Convert to radians
                phi1 = math.radians(lat1)
                phi2 = math.radians(lat2)
                
                delta_phi = math.radians(lat2 - lat1)
                delta_lambda = math.radians(lon2 - lon1)
                
                # Haversine formula
                a = (math.sin(delta_phi / 2) ** 2 +
                    math.cos(phi1) * math.cos(phi2) *
                    math.sin(delta_lambda / 2) ** 2)
                
                c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
                
                # Calculate the distance
                distance = R * c
                
                return distance
            
            except (ValueError, TypeError) as e:
                # Provide detailed error information
                print(f"Location distance calculation error: {e}")
                print(f"Location 1: {loc1}")
                print(f"Location 2: {loc2}")
                raise ValueError(f"Invalid location data: {e}")
class LocationRecommender:
            def __init__(self, users_collection, current_user):
                self.users_collection = users_collection
                self.current_user = current_user
            
            

            def extract_location(self, user):
                """
                Extract location information, with support for text addresses
                """
                # Check for existing coordinate keys first
                location_keys = [
                    'location', 
                    'address', 
                    'geo', 
                    'coordinates', 
                    'position'
                ]
                
                for key in location_keys:
                    if key in user:
                        location = user[key]
                        
                        # If it's already a dict with coordinates, use existing method
                        if isinstance(location, dict):
                            coordinate_keys = [
                                ['latitude', 'longitude'],
                                ['lat', 'lon'],
                                ['lat', 'lng'],
                                ['coords', 'latitude', 'longitude']
                            ]
                            
                            for key_set in coordinate_keys:
                                try:
                                    return {
                                        'latitude': float(location[key_set[0]]),
                                        'longitude': float(location[key_set[1]])
                                    }
                                except (KeyError, ValueError, TypeError):
                                    continue
                        
                        # If it's a string address, try geocoding
                        elif isinstance(location, str):
                            geolocator = Nominatim(user_agent="location_recommender")
                            try:
                                geocode_result = geolocator.geocode(location)
                                if geocode_result:
                                    return {
                                        'latitude': geocode_result.latitude,
                                        'longitude': geocode_result.longitude
                                    }
                            except Exception:
                                continue
                
                # If no location found
                raise ValueError(f"No valid location found for user: {user.get('email', 'Unknown')}")
            
            def recommend_location_network(self, similar_location_users, limit=10):
                """
                Advanced location network recommendation
                
                Args:
                    similar_location_users (list): Users in similar location
                    limit (int): Maximum number of recommendations
                
                Returns:
                    list: Recommended users
                """
                import networkx as nx
                import numpy as np
                
                # Create graph of location network
                G = nx.Graph()
                
                # Add users as nodes
                for user in similar_location_users:
                    G.add_node(user['_id'])
                
                # Connect users based on proximity
                for i, u1 in enumerate(similar_location_users):
                    for j, u2 in enumerate(similar_location_users[i+1:], start=i+1):
                        try:
                            # Calculate distance between users
                            distance = haversine_distance(
                                self.extract_location(u1), 
                                self.extract_location(u2)
                            )
                            
                            # Add edge if within proximity (e.g., 50 km)
                            if distance <= 50:
                                G.add_edge(u1['_id'], u2['_id'], weight=1/distance)
                        except ValueError:
                            # Skip if location extraction fails
                            continue
                
                # Use network centrality for recommendations
                try:
                    centrality = nx.eigenvector_centrality(G)
                    
                    # Sort users by network centrality
                    ranked_users = sorted(
                        similar_location_users, 
                        key=lambda x: centrality.get(x['_id'], 0), 
                        reverse=True
                    )
                    
                    return ranked_users[:limit]
                
                except nx.PowerIterationFailedConvergence:
                    # Fallback to simple sorting if eigenvector centrality fails
                    return similar_location_users[:limit]
            
            def recommend(self, limit=10):
                """
                Main location recommendation method
                
                Args:
                    limit (int): Maximum number of recommendations
                
                Returns:
                    list: Recommended users
                """
                try:
                    # Extract current user's location
                    current_user_location = self.extract_location(self.current_user)
                    
                    # Find similar location users
                    similar_location_users = []
                    all_users = list(self.users_collection.find({
                        '_id': {'$ne': self.current_user['_id']}
                    }))
                    
                    # Filter users with valid locations
                    for user in all_users:
                        try:
                            user_location = self.extract_location(user)
                            distance = haversine_distance(current_user_location, user_location)
                            
                            # Add users within 100 km
                            if distance <= 100:
                                user['distance'] = distance
                                similar_location_users.append(user)
                        except ValueError:
                            # Skip users without valid location
                            continue
                    
                    # Sort by distance if few users
                    if len(similar_location_users) <= 5:
                        similar_location_users.sort(key=lambda x: x.get('distance', float('inf')))
                        recommendations = similar_location_users[:limit]
                    else:
                        # Use advanced network recommendation
                        recommendations = self.recommend_location_network(
                            similar_location_users, 
                            limit
                        )
                    
                    return recommendations
                
                except Exception as e:
                    print(f"Location recommendation error: {e}")
                    raise

class AdvancedInterestRecommender:
            def __init__(self, users_collection, current_user):
                self.users_collection = users_collection
                self.current_user = current_user
            
            def preprocess_interests(self, interests):
                # Advanced interest preprocessing using Word2Vec
                model = Word2Vec([interests], vector_size=100, window=5, min_count=1, workers=4)
                return model.wv
            
            def graph_based_interest_similarity(self, users):
                # Create a graph-based recommendation using NetworkX
                G = nx.Graph()
                
                # Add users as nodes
                for user in users:
                    G.add_node(user['_id'], interests=user.get('interests', []))
                
                # Connect users with similar interests
                for u1 in users:
                    for u2 in users:
                        if u1['_id'] != u2['_id']:
                            similarity = len(set(u1.get('interests', [])) & set(u2.get('interests', [])))
                            if similarity > 0:
                                G.add_edge(u1['_id'], u2['_id'], weight=similarity)
                
                # Use PageRank to determine importance
                pagerank = nx.pagerank(G)
                return pagerank
            
            def recommend(self, limit=10):
                # Get users with at least one common interest
                all_users = list(self.users_collection.find({
                    '_id': {'$ne': self.current_user['_id']},
                    'interests': {'$exists': True, '$ne': []}
                }))
                
                # Filter users with at least one common interest
                similar_interest_users = [
                    user for user in all_users 
                    if set(user.get('interests', [])) & set(self.current_user.get('interests', []))
                ]
                
                if len(similar_interest_users) <= 5:
                    # If few similar users, use graph-based recommendation
                    pagerank_scores = self.graph_based_interest_similarity(similar_interest_users)
                    recommendations = sorted(
                        similar_interest_users, 
                        key=lambda x: pagerank_scores.get(x['_id'], 0), 
                        reverse=True
                    )[:limit]
                else:
                    # For many similar users, use advanced vectorization
                    vectorizer = TfidfVectorizer()
                    interest_matrix = vectorizer.fit_transform([
                        ' '.join(user.get('interests', [])) for user in similar_interest_users
                    ])
                    
                    current_user_interests = vectorizer.transform([
                        ' '.join(self.current_user.get('interests', []))
                    ])
                    
                    # Compute cosine similarity and get top recommendations
                    similarity_scores = cosine_similarity(current_user_interests, interest_matrix)[0]
                    top_indices = np.argsort(similarity_scores)[::-1][:limit]
                    recommendations = [similar_interest_users[i] for i in top_indices]
                
                return recommendations
client = MongoClient('mongodb+srv://IPL_AUCTION_24:IPLAuction2024DontGuessAlsoUseVim@cluster0.ilknu4v.mongodb.net/SIH')
db = client['SIH']
users_collection = db['users2']
class UserRecommendationEngine:
            def __init__(self, current_user):
                self.current_user = current_user
                self.users_collection = users_collection
            
            def calculate_recommendation_score(self, candidate_user):
                score = 0
                weights = {
                    'interests': 0.25,
                    'skills': 0.20,
                    'education': 0.15,
                    'location': 0.15,
                    'career_stage': 0.15,
                    'network_proximity': 0.10
                }
                
                # Interests Matching
                shared_interests = len(set(self.current_user.get('interests', [])) & 
                                       set(candidate_user.get('interests', [])))
                interest_score = (shared_interests / max(len(self.current_user.get('interests', [])), 
                                                         len(candidate_user.get('interests', [])), 1)) * 100
                
                # Skills Overlap
                shared_skills = len(set(self.current_user.get('skills', [])) & 
                                     set(candidate_user.get('skills', [])))
                skills_score = (shared_skills / max(len(self.current_user.get('skills', [])), 
                                                    len(candidate_user.get('skills', [])), 1)) * 100
                
                # Education Similarity
                education_score = 0
                if self.current_user.get('education') and candidate_user.get('education'):
                    current_edu = self.current_user['education'][0]
                    candidate_edu = candidate_user['education'][0]
                    
                    if (current_edu.get('institution') == candidate_edu.get('institution')) or \
                       abs(current_edu.get('yearOfGraduation', 0) - candidate_edu.get('yearOfGraduation', 0)) <= 2:
                        education_score = 100
                
                # Location Score (simplified)
                location_score = 0
                if self.current_user.get('address') and candidate_user.get('address'):
                    if self.current_user['address'] == candidate_user['address']:
                        location_score = 100
                
                # Career Stage Alignment
                career_score = 0
                current_exp_len = len(self.current_user.get('workExperience', []))
                candidate_exp_len = len(candidate_user.get('workExperience', []))
                
                if abs(current_exp_len - candidate_exp_len) <= 1:
                    career_score = 100
                
                # Network Proximity
                network_score = 0
                mutual_connections = len(set(self.current_user.get('connections', [])) & 
                                         set(candidate_user.get('connections', [])))
                network_score = min(mutual_connections * 20, 100)
                
                # Weighted total score
                total_score = (
                    weights['interests'] * interest_score +
                    weights['skills'] * skills_score +
                    weights['education'] * education_score +
                    weights['location'] * location_score +
                    weights['career_stage'] * career_score +
                    weights['network_proximity'] * network_score
                )
                
                return total_score
            
            def get_recommendations(self, limit=10):
                # Exclude current user and existing connections
                excluded_ids = set(self.current_user.get('connections', []) + 
                                   [self.current_user['_id']])
                
                # Find potential candidates (same role)
                candidates = self.users_collection.find({
                    '_id': {'$nin': list(excluded_ids)},
                    'role': self.current_user['role']
                })
                
                
                # Score and rank candidates
                candidate_scores = []
                for candidate in candidates:
                    score = self.calculate_recommendation_score(candidate)
                    candidate_scores.append({
                        'user': candidate,
                        'score': score
                    })
                
                # Sort by recommendation score
                sorted_recommendations = sorted(
                    candidate_scores, 
                    key=lambda x: x['score'], 
                    reverse=True
                )
                
                # Return top recommendations
                return [rec['user'] for rec in sorted_recommendations[:limit]]