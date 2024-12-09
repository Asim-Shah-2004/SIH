import json
import random
from faker import Faker
import uuid
import bcrypt
from pymongo import MongoClient

class IndianUserProfileGenerator:
    def __init__(self, num_users=1000):
        """
        Initialize the user profile generator
        
        Args:
            num_users (int): Number of user profiles to generate
        """
        self.fake = Faker('en_IN')  # Indian locale
        self.num_users = num_users
        
        # Comprehensive lists for generating diverse profiles
        self.roles = ['user']  # Changed to only 'user' role
        
        self.it_skills = [
            'Python', 'JavaScript', 'React', 'Node.js', 'Machine Learning', 
            'Data Analysis', 'Cloud Computing', 'Docker', 'Kubernetes', 
            'SQL', 'MongoDB', 'TensorFlow', 'AWS', 'Azure', 'Cybersecurity', 
            'Blockchain', 'Natural Language Processing', 'Deep Learning', 
            'Big Data', 'CI/CD', 'Agile Methodologies'
        ]
        
        self.non_it_skills = [
            'Project Management', 'Business Strategy', 'Sales', 'Marketing', 
            'Content Creation', 'Public Speaking', 'Financial Analysis', 
            'Customer Relations', 'Design Thinking', 'Strategic Planning', 
            'Negotiation', 'Leadership', 'Communication', 'Research', 
            'Problem Solving'
        ]
        
        self.interests = [
            'Technology', 'Artificial Intelligence', 'Startups', 'Innovation', 
            'Machine Learning', 'Entrepreneurship', 'Data Science', 'Coding', 
            'Open Source', 'Cloud Technology', 'Cybersecurity', 'Blockchain', 
            'Digital Marketing', 'Product Design', 'User Experience', 
            'Sustainable Technology', 'Robotics', 'Quantum Computing', 
            'Internet of Things', 'Mobile App Development'
        ]
        
        self.indian_cities = [
            'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 
            'Pune', 'Ahmedabad', 'Kolkata', 'Surat', 'Jaipur', 
            'Lucknow', 'Patna', 'Bhopal', 'Chandigarh', 'Trivandrum'
        ]
        
        self.institutions = [
            'IIT Bombay', 'IIT Delhi', 'IIT Madras', 'IIT Kanpur', 
            'IIT Kharagpur', 'IIT Roorkee', 'IIT Guwahati', 'BITS Pilani', 
            'NIT Surathkal', 'Delhi University', 'BHU', 'IIM Ahmedabad', 
            'IIM Bangalore', 'IIM Calcutta', 'IIIT Hyderabad'
        ]
    
    def generate_location(self, city):
        """
        Generate realistic location coordinates for Indian cities
        
        Args:
            city (str): Name of the city
        
        Returns:
            dict: Location coordinates
        """
        # Rough coordinates for major Indian cities
        city_coordinates = {
            'Mumbai': {'latitude': 19.0760, 'longitude': 72.8777},
            'Delhi': {'latitude': 28.6139, 'longitude': 77.2090},
            'Bangalore': {'latitude': 12.9716, 'longitude': 77.5946},
            'Hyderabad': {'latitude': 17.3850, 'longitude': 78.4867},
            'Chennai': {'latitude': 13.0827, 'longitude': 80.2707},
            'Pune': {'latitude': 18.5204, 'longitude': 73.8567},
            'Ahmedabad': {'latitude': 23.0225, 'longitude': 72.5714},
            'Kolkata': {'latitude': 22.5726, 'longitude': 88.3639},
            'Surat': {'latitude': 21.1702, 'longitude': 72.8311},
            'Jaipur': {'latitude': 26.9124, 'longitude': 75.7873},
            'Lucknow': {'latitude': 26.8467, 'longitude': 80.9462},
            'Patna': {'latitude': 25.5941, 'longitude': 85.1376},
            'Bhopal': {'latitude': 23.2599, 'longitude': 77.4126},
            'Chandigarh': {'latitude': 30.7333, 'longitude': 76.7794},
            'Trivandrum': {'latitude': 8.5241, 'longitude': 76.9366}
        }
        
        # Add slight random variation
        city_coord = city_coordinates.get(city, {'latitude': 20.5937, 'longitude': 78.9629})
        city_coord['latitude'] += random.uniform(-0.1, 0.1)
        city_coord['longitude'] += random.uniform(-0.1, 0.1)
        
        return city_coord
    
    def generate_hashed_password(self, password=None):
        """
        Generate a hashed password
        
        Args:
            password (str, optional): Password to hash. If None, generate a random password.
        
        Returns:
            str: Hashed password
        """
        if not password:
            password = self.fake.password(length=12, special_chars=True, digits=True, upper_case=True, lower_case=True)
        
        # Hash the password
        salt = bcrypt.gensalt()
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)
        return hashed_password.decode('utf-8')
    
    def generate_user_profile(self):
        """
        Generate a comprehensive user profile
        
        Returns:
            dict: User profile with multiple attributes
        """
        # Basic profile details
        email = self.fake.email()
        full_name = f"{self.fake.first_name()} {self.fake.last_name()}"
        phone = self.fake.phone_number()
        
        # Generate password
        password = self.generate_hashed_password()
        
        # Skills generation
        num_it_skills = random.randint(2, 5)
        num_non_it_skills = random.randint(1, 3)
        skills = (
            random.sample(self.it_skills, num_it_skills) + 
            random.sample(self.non_it_skills, num_non_it_skills)
        )
        
        # Interests generation
        num_interests = random.randint(3, 6)
        interests = random.sample(self.interests, num_interests)
        
        # Education generation
        institution = random.choice(self.institutions)
        graduation_year = random.randint(2010, 2023)
        degree = random.choice([
            'B.Tech', 'M.Tech', 'MBA', 'MCA', 'MS', 'B.Sc', 'M.Sc'
        ])
        
        # City selection
        city = random.choice(self.indian_cities)
        
        # Location details
        location = self.generate_location(city)
        
        # Projects and Certifications
        num_projects = random.randint(0, 3)
        projects = [
            {
                'title': f"Project {i+1}",
                'description': self.fake.sentence()
            } for i in range(num_projects)
        ]
        
        num_certifications = random.randint(0, 2)
        certifications = [
            {
                'name': f"Certification {i+1}",
                'issuer': self.fake.company()
            } for i in range(num_certifications)
        ]
        
        # Languages
        languages = random.sample(['English', 'Hindi', 'Tamil', 'Telugu', 'Marathi', 'Bengali', 'Gujarati'], 
                                   random.randint(1, 3))
        
        # Bio
        bio = self.fake.text(max_nb_chars=200)
        
        # Construct complete user profile
        user_profile = {
            'email': email,
            'fullName': full_name,
            'phone': phone,
            'password': password,
            'role': 'user',
            'skills': skills,
            'interests': interests,
            'education': [{
                'institution': institution,
                'degree': degree,
                'yearOfGraduation': graduation_year
            }],
            'address': city,
            'location': location,
            'projects': projects,
            'certifications': certifications,
            'languages': languages,
            'bio': bio,
            'connections': [],
            'receivedRequests': [],
            'sentRequests': [],
            'isUniversityGeneratedPassword': random.choice([True, False]),
            'notifications': [],
            'createdAt': self.fake.date_time_this_decade(),
            '__v': 0
        }
        
        return user_profile
    
    def generate_users(self):
        """
        Generate multiple user profiles
        
        Returns:
            list: List of user profiles
        """
        return [self.generate_user_profile() for _ in range(self.num_users)]
    
    def save_to_mongodb(self, connection_string='mongodb+srv://IPL_AUCTION_24:IPLAuction2024DontGuessAlsoUseVim@cluster0.ilknu4v.mongodb.net/SIH'):
        """
        Save generated users to MongoDB
        
        Args:
            connection_string (str): MongoDB connection string
        """
        client = MongoClient(connection_string)
        db = client['SIH']
        users_collection = db['users2']
        
        # Generate users
        users = self.generate_users()
        
        # Insert users
        result = users_collection.insert_many(users)
        print(f"Inserted {len(result.inserted_ids)} users")
    
    def export_to_json(self, filename='indian_user_profiles.json'):
        """
        Export generated users to a JSON file
        
        Args:
            filename (str): Output JSON filename
        """
        users = self.generate_users()
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(users, f, indent=2, ensure_ascii=False)
        print(f"Exported {len(users)} user profiles to {filename}")

# Usage example
if __name__ == "__main__":
    generator = IndianUserProfileGenerator(num_users=1000)
    generator.save_to_mongodb()  # Save directly to MongoDB
    # Or export to JSON
    # generator.export_to_json()