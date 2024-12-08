import os
import random
import names
import pymongo
from faker import Faker
from bson import ObjectId
from datetime import datetime, timedelta
import numpy as np

# MongoDB Connection
MONGO_URL = "mongodb+srv://IPL_AUCTION_24:IPLAuction2024DontGuessAlsoUseVim@cluster0.ilknu4v.mongodb.net/SIH"
client = pymongo.MongoClient(MONGO_URL)
db = client['SIH']
users_collection = db['users4']
posts_collection = db['post4']

# Faker for Indian-specific data generation
fake = Faker('en_IN')

# Predefined Lists for Indian Context
INDIAN_CITIES = [
    'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 
    'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow'
]

INDIAN_STATES = [
    'Maharashtra', 'Delhi', 'Karnataka', 'Telangana', 'Tamil Nadu', 
    'West Bengal', 'Gujarat', 'Rajasthan', 'Uttar Pradesh'
]

PROFESSIONAL_ROLES = [
    'Software Engineer', 'Data Scientist', 'Product Manager', 
    'UX Designer', 'Machine Learning Engineer', 'Backend Developer', 
    'Frontend Developer', 'DevOps Engineer', 'Cloud Architect', 
    'Blockchain Developer', 'AI Researcher'
]

TECH_SKILLS = [
    'Python', 'JavaScript', 'React', 'Django', 'Machine Learning', 
    'AI', 'Cloud Computing', 'Docker', 'Kubernetes', 'TensorFlow', 
    'AWS', 'Node.js', 'SQL', 'MongoDB', 'GraphQL'
]

INDUSTRIES = [
    'Technology', 'Finance', 'Healthcare', 'E-commerce', 
    'Education', 'Fintech', 'Blockchain', 'AI/ML', 'StartUp'
]

INDIAN_UNIVERSITIES = [
    'IIT Delhi', 'IIT Bombay', 'IIT Madras', 'IIT Kanpur', 
    'IIT Kharagpur', 'IIT Roorkee', 'IIT Guwahati', 
    'BITS Pilani', 'Delhi University', 'Pune University', 
    'Anna University', 'Indian Institute of Science',
    'Jadavpur University', 'IIM Ahmedabad', 'IIM Bangalore'
]

def generate_simple_password(first_name):
    """Generate a simple, predictable password"""
    return f"{first_name.lower()}2024!"

def generate_indian_user():
    """Generate a comprehensive Indian professional user profile"""
    gender = random.choice(['male', 'female'])
    first_name = names.get_first_name(gender=gender)
    last_name = names.get_last_name()
    full_name = f"{first_name} {last_name}"
    
    city = random.choice(INDIAN_CITIES)
    state = random.choice(INDIAN_STATES)
    
    # Generate complex professional profile
    role = random.choice(PROFESSIONAL_ROLES)
    skills = random.sample(TECH_SKILLS, k=random.randint(3, 7))
    
    # Convert date to datetime for MongoDB compatibility
    def to_datetime(d):
        return datetime.combine(d, datetime.min.time())
    
    # Convert latitude and longitude to float to avoid Decimal encoding issue
    latitude = float(fake.latitude())
    longitude = float(fake.longitude())
    
    return {
        '_id': ObjectId(),
        'fullName': full_name,
        'email': f"{first_name.lower()}.{last_name.lower()}@{random.choice(['gmail.com', 'outlook.com', 'yahoo.com', 'company.com'])}",
        'password': generate_simple_password(first_name),
        'profilePhoto': f"https://randomuser.me/api/portraits/{gender}/{random.randint(1, 99)}.jpg",
        'phone': f"+91{random.randint(6000000000, 9999999999)}",
        'city': city,
        'state': state,
        'country': 'India',
        'education': [
            {
                'degree': random.choice(['B.Tech', 'M.Tech', 'MCA', 'MBA', 'MS']),
                'institution': random.choice(INDIAN_UNIVERSITIES),
                'yearOfGraduation': random.randint(2010, 2024)
            }
        ],
        'workExperience': [
            {
                'companyName': fake.company(),
                'role': role,
                'startDate': to_datetime(fake.date_between(start_date='-10y', end_date='now')),
                'endDate': to_datetime(fake.date_between(start_date='-2y', end_date='now')) if random.random() < 0.3 else None,
                'description': fake.catch_phrase()
            }
        ],
        'skills': skills,
        'interests': random.sample(INDUSTRIES, k=3),
        'bio': fake.text(max_nb_chars=200),
        'languages': random.sample(['English', 'Hindi', 'Tamil', 'Telugu', 'Marathi'], k=2),
        'location': {
            'latitude': latitude,
            'longitude': longitude
        },
        'connections': [],
        'receivedRequests': [],
        'sentRequests': [],
        'notifications': [],
        'certifications': [],
        'projects': []
    }

def generate_indian_post(users):
    """Generate a contextually rich social media post with direct interaction fields"""
    author = random.choice(users)
    
    # Post content generation with professional context
    post_types = [
        f"Excited to share my latest project in {random.choice(INDUSTRIES)}!",
        f"Thoughts on the future of {random.choice(TECH_SKILLS)} in our industry.",
        f"Just completed an amazing course on {random.choice(TECH_SKILLS)}.",
        "Reflecting on my professional journey...",
        f"Networking opportunities in {random.choice(INDIAN_CITIES)}"
    ]
    
    media_type = ['image', 'video'] if random.random() > 0.3 else [None]
    
    # Prepare users for interactions
    available_users = [u for u in users if u['_id'] != author['_id']]
    
    # Generate Likes
    num_likes = random.randint(5, 50)
    likes = random.sample(available_users, k=min(num_likes, len(available_users)))
    likes_data = [
        {
            'userId': user['_id'],
            'userName': user['fullName'],
            'userProfilePic': user.get('profilePhoto'),
            'timestamp': fake.date_time_between(start_date='-1y', end_date='now')
        } for user in likes
    ]
    
    # Generate Comments
    num_comments = random.randint(3, 20)
    comment_users = random.sample(available_users, k=min(num_comments, len(available_users)))
    comments_data = [
        {
            'userId': user['_id'],
            'userName': user['fullName'],
            'userProfilePic': user.get('profilePhoto'),
            'text': fake.sentence(),
            'timestamp': fake.date_time_between(start_date='-1y', end_date='now')
        } for user in comment_users
    ]
    
    # Generate Shares
    num_shares = random.randint(1, 10)
    share_users = random.sample(available_users, k=min(num_shares, len(available_users)))
    shares_data = [
        {
            'userId': user['_id'],
            'userName': user['fullName'],
            'userProfilePic': user.get('profilePhoto'),
            'timestamp': fake.date_time_between(start_date='-1y', end_date='now')
        } for user in share_users
    ]
    
    return {
        '_id': ObjectId(),
        'userId': author['_id'],
        'text': random.choice(post_types) + " " + fake.text(max_nb_chars=200),
        'media': [
            {
                'type': media_type,
                'url': f"https://example.com/{media_type}/{random.randint(1, 1000)}",
                'description': fake.sentence() if media_type else None
            }
        ] if media_type else [],
        'interaction_signals': {
            'likes': likes_data,
            'comments': comments_data,
            'shares': shares_data
        },
        'createdAt': datetime.combine(fake.date_between(start_date='-1y', end_date='now'), datetime.min.time())
    }

def generate_relationships(users):
    """Create connections and interactions between users"""
    for i, user in enumerate(users):
        # Create connections
        potential_connections = users[max(0, i-10):i] + users[i+1:min(len(users), i+11)]
        
        # Ensure we don't try to sample more connections than available
        max_connections = min(len(potential_connections), 15)
        min_connections = min(5, max_connections)
        
        # Randomize number of connections within available range
        num_connections = random.randint(min_connections, max_connections)
        
        # Avoid duplicate connections
        existing_connection_ids = {conn['_id'] for conn in user.get('connections', [])}
        potential_connections_filtered = [
            conn for conn in potential_connections if conn['_id'] not in existing_connection_ids
        ]
        
        # Create connections based on filtered potential connections
        connections = random.sample(potential_connections_filtered, k=num_connections)
        
        user['connections'] = [
            {
                '_id': conn['_id'],
                'fullName': conn['fullName'],
                'profilePhoto': conn.get('profilePhoto'),
                'bio': conn.get('bio'),
                'interaction_strength': random.uniform(0.1, 1.0)
            } for conn in connections
        ]
        
        # Simulate friend requests
        # Extract IDs of current connections
        connection_ids = {conn['_id'] for conn in connections}

        # Filter potential requests to exclude existing connections
        potential_requests = [
            u for u in potential_connections if u['_id'] not in connection_ids
        ]

        # Randomly select received and sent requests
        user['receivedRequests'] = random.sample(
            [{'userId': u['_id'], 'fullName': u['fullName']} for u in potential_requests],
            k=min(len(potential_requests), random.randint(0, 5))
        )
        user['sentRequests'] = random.sample(
            [{'userId': u['_id'], 'fullName': u['fullName']} for u in potential_requests],
            k=min(len(potential_requests), random.randint(0, 5))
        )

        # Notifications
        user['notifications'] = [
            {
                'type': random.choice(['like', 'comment', 'connection_request']),
                'message': fake.sentence(),
                'createdAt': datetime.now().isoformat()  # ISO format for datetime
            } for _ in range(random.randint(1, 5))
        ]

def seed_database(num_users=500, num_posts=1000):
    """Seed the database with generated data"""
    users_collection.delete_many({})
    posts_collection.delete_many({})
    
    # Generate Users
    users = [generate_indian_user() for _ in range(num_users)]
    users_collection.insert_many(users)
    
    generate_relationships(users)
    users_collection.bulk_write([
        pymongo.UpdateOne({'_id': user['_id']}, {'$set': user}) 
        for user in users
    ])
    
    # Generate Posts
    posts = [generate_indian_post(users) for _ in range(num_posts)]
    posts_collection.insert_many(posts)

    print(f"Generated {num_users} users and {num_posts} posts!")

if __name__ == "__main__":
    seed_database()