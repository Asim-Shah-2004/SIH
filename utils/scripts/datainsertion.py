import os
import random
from datetime import datetime, timedelta
from faker import Faker
from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, ForeignKey, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from dotenv import load_dotenv
from sqlalchemy import Column, Integer, String, Text, DateTime, Float, ForeignKey, JSON

# Load environment variables
load_dotenv()

# Create a base class for declarative models
Base = declarative_base()

# Enhanced User Model
class User(Base):
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    position = Column(String(100))
    department = Column(String(100))
    skills = Column(JSON)
    interests = Column(JSON)
    hire_date = Column(DateTime, default=datetime.now)
    
    # Relationships
    posts = relationship("Post", back_populates="user")
    connections = relationship("Connection", back_populates="user")

# Enhanced Post Model
class Post(Base):
    __tablename__ = 'posts'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    title = Column(String(200), nullable=False)
    content = Column(Text)
    created_at = Column(DateTime, default=datetime.now)
    media = Column(JSON)
    
    # Relationships
    user = relationship("User", back_populates="posts")
    likes = relationship("Like", back_populates="post")
    comments = relationship("Comment", back_populates="post")
    reactions = relationship("Reaction", back_populates="post")

# New Models for Social Interactions
class Connection(Base):
    __tablename__ = 'connections'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    connected_user_id = Column(Integer, nullable=False)
    interaction_strength = Column(Float)
    
    user = relationship("User", back_populates="connections")

class Like(Base):
    __tablename__ = 'likes'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, nullable=False)
    post_id = Column(Integer, ForeignKey('posts.id'), nullable=False)
    created_at = Column(DateTime, default=datetime.now)
    
    post = relationship("Post", back_populates="likes")

class Comment(Base):
    __tablename__ = 'comments'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, nullable=False)
    post_id = Column(Integer, ForeignKey('posts.id'), nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.now)
    
    post = relationship("Post", back_populates="comments")

class Reaction(Base):
    __tablename__ = 'reactions'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, nullable=False)
    post_id = Column(Integer, ForeignKey('posts.id'), nullable=False)
    reaction_type = Column(String(20))
    created_at = Column(DateTime, default=datetime.now)
    
    post = relationship("Post", back_populates="reactions")

class DatabaseSeeder:
    def __init__(self, host, port, user, password, database):
        # Create database connection string for PostgreSQL
        connection_string = f"postgresql://{user}:{password}@{host}:{port}/{database}"
        
        # Create SQLAlchemy engine
        self.engine = create_engine(connection_string)
        
        # Drop existing tables and create new ones
        Base.metadata.drop_all(self.engine)
        Base.metadata.create_all(self.engine)
        
        # Create a session
        Session = sessionmaker(bind=self.engine)
        self.session = Session()
        
        # Initialize Faker
        self.fake = Faker()

    def generate_users(self, num_users=50):
        skills_pool = [
            "Python", "Machine Learning", "Data Science", "Cloud Computing", 
            "Kubernetes", "React", "Node.js", "AWS", "Docker", "SQL"
        ]
        interests_pool = [
            "Technology", "Fintech", "E-commerce", "AI", "Blockchain", 
            "Startups", "Digital Marketing", "Software Development"
        ]
        departments = ["IT", "Sales", "Marketing", "HR", "Finance", "Engineering"]
        positions = ["Manager", "Specialist", "Engineer", "Analyst", "Director"]

        users = []
        for _ in range(num_users):
            first_name = self.fake.first_name()
            last_name = self.fake.last_name()
            user = User(
                username=f"{first_name.lower()}_{last_name.lower()}",
                email=f"{first_name.lower()}.{last_name.lower()}@company.com",
                first_name=first_name,
                last_name=last_name,
                position=f"{random.choice(positions)} of {random.choice(departments)}",
                department=random.choice(departments),
                skills=random.sample(skills_pool, k=random.randint(3, 7)),
                interests=random.sample(interests_pool, k=random.randint(2, 5)),
                hire_date=self.fake.date_between(start_date='-5y', end_date='now')
            )
            users.append(user)
            self.session.add(user)
        
        self.session.commit()
        return users

    def generate_posts(self, users, num_posts_per_user=3):
        media_types = ["image", "video", "document"]
        posts = []
        for user in users:
            for _ in range(num_posts_per_user):
                post = Post(
                    user=user,
                    title=self.fake.sentence(nb_words=6),
                    content=self.fake.paragraph(nb_sentences=3),
                    created_at=self.fake.date_time_between(start_date='-1y', end_date='now'),
                    media=[{
                        "type": random.sample(media_types, k=random.randint(1, 2)),
                        "url": self.fake.url(),
                        "description": self.fake.sentence()
                    }]
                )
                posts.append(post)
                self.session.add(post)
        
        self.session.commit()
        return posts

    def generate_connections(self, users, max_connections_per_user=10):
        connections = []
        for user in users:
            possible_connections = [u for u in users if u.id != user.id]
            num_connections = min(len(possible_connections), random.randint(3, max_connections_per_user))
            connected_users = random.sample(possible_connections, num_connections)
            
            for connected_user in connected_users:
                connection = Connection(
                    user=user,
                    connected_user_id=connected_user.id,
                    interaction_strength=round(random.uniform(0.1, 1.0), 2)
                )
                connections.append(connection)
                self.session.add(connection)
        
        self.session.commit()
        return connections

    def generate_interactions(self, users, posts):
        reaction_types = ['like', 'love', 'wow', 'sad', 'angry']
        
        # Generate Likes
        for post in posts:
            num_likes = random.randint(1, 10)
            like_users = random.sample(users, num_likes)
            for user in like_users:
                like = Like(user_id=user.id, post=post)
                self.session.add(like)
        
        # Generate Comments
        for post in posts:
            num_comments = random.randint(0, 5)
            comment_users = random.sample(users, num_comments)
            for user in comment_users:
                comment = Comment(
                    user_id=user.id, 
                    post=post, 
                    content=self.fake.sentence(nb_words=10)
                )
                self.session.add(comment)
        
        # Generate Reactions
        for post in posts:
            num_reactions = random.randint(0, 7)
            reaction_users = random.sample(users, num_reactions)
            for user in reaction_users:
                reaction = Reaction(
                    user_id=user.id, 
                    post=post, 
                    reaction_type=random.choice(reaction_types)
                )
                self.session.add(reaction)
        
        self.session.commit()

    def seed_database(self):
        print("Generating users...")
        users = self.generate_users()
        
        print("Generating posts...")
        posts = self.generate_posts(users)
        
        print("Generating connections...")
        self.generate_connections(users)
        
        print("Generating interactions...")
        self.generate_interactions(users, posts)
        
        print("Database seeded successfully!")

def main():
    # Database connection parameters (replace with your actual credentials)
    seeder = DatabaseSeeder(
        host=os.getenv('DB_HOST', 'localhost'),
        port=os.getenv('DB_PORT', '5432'),
        user=os.getenv('DB_USER','sql2'),
        password=os.getenv('DB_PASSWORD','sql2'),
        database=os.getenv('DB_NAME','sql2')
    )
    
    # Seed the database
    seeder.seed_database()

if __name__ == "__main__":
    main()