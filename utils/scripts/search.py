import os
from sqlalchemy import create_engine
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.agents import create_sql_agent
from langchain.agents.agent_toolkits import SQLDatabaseToolkit
from langchain.sql_database import SQLDatabase
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class SmartSearchEngine:
    def __init__(self, host, port, user, password, database, google_api_key):
        # Set Google API key from environment variable
        os.environ["GOOGLE_API_KEY"] = google_api_key
        
        # Create database connection string for PostgreSQL
        connection_string = f"postgresql://{user}:{password}@{host}:{port}/{database}"
        
        # Create SQLAlchemy engine and database connection
        self.engine = create_engine(connection_string)
        self.db = SQLDatabase(self.engine)
        
        # Initialize Google Gemini LLM
        self.llm = ChatGoogleGenerativeAI(model="gemini-pro")
        
        # Create SQL agent
        self.agent_executor = self._create_sql_agent()
    
    def _create_sql_agent(self):
        toolkit = SQLDatabaseToolkit(db=self.db, llm=self.llm)
        
        return create_sql_agent(
            llm=self.llm,
            toolkit=toolkit,
            verbose=True,  # Set to True for debugging
            handle_parsing_errors=True
        )
    
    def search(self, query):
        try:
            result = self.agent_executor.invoke({"input": query})
            return result.get('output', 'No results found')
        
        except Exception as e:
            return f"Error: {str(e)}"

def main():
    # Read credentials from .env file or replace with your actual credentials
    search_engine = SmartSearchEngine(
        host=os.getenv('DB_HOST', 'localhost'),
        port=os.getenv('DB_PORT', '5432'),
        user='sql2',
        password='sql2',
        database='sql2',
        google_api_key=" AIzaSyCUDF78iyPv8JKVdTKPCYMoM_HSL0UzFjA"
    )
    
    queries = [
        "tell me commented posts of michael_jackson"
    ]
    
    for query in queries:
        print(f"Query: {query}")
        print(search_engine.search(query))
        print("-" * 50)

if __name__ == "__main__":
    main()