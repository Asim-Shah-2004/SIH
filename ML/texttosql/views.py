# views.py
import os
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from sqlalchemy import create_engine
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.agents import create_sql_agent
from langchain.agents.agent_toolkits import SQLDatabaseToolkit
from langchain.sql_database import SQLDatabase
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class SmartSearchEngine:
    def __init__(self):
        # Directly fetch credentials from environment variables
        self.host = os.getenv('DB_HOST', 'localhost')
        self.port = os.getenv('DB_PORT', '5432')
        self.user = os.getenv('DB_USER')
        self.password = os.getenv('DB_PASSWORD')
        self.database = os.getenv('DB_NAME')
        self.google_api_key = os.getenv('GOOGLE_API_KEY')

        # Validate required environment variables
        if not all([self.host, self.port, self.user, self.password, self.database, self.google_api_key]):
            raise ValueError("Missing required environment variables for database connection")

        # Create database connection string for PostgreSQL
        connection_string = f"postgresql://{self.user}:{self.password}@{self.host}:{self.port}/{self.database}"
        
        # Create SQLAlchemy engine and database connection
        self.engine = create_engine(connection_string)
        self.db = SQLDatabase(self.engine)
        
        # Initialize Google Gemini LLM
        os.environ["GOOGLE_API_KEY"] = self.google_api_key
        self.llm = ChatGoogleGenerativeAI(model="gemini-pro")
        
        # Create SQL agent
        self.agent_executor = self._create_sql_agent()

    def _create_sql_agent(self):
        toolkit = SQLDatabaseToolkit(db=self.db, llm=self.llm)
        return create_sql_agent(
            llm=self.llm, 
            toolkit=toolkit, 
            verbose=True, 
            handle_parsing_errors=True
        )

    def search(self, query):
        try:
            result = self.agent_executor.invoke({"input": query})
            return result.get('output', 'No results found')
        except Exception as e:
            return f"Error: {str(e)}"
import json
@csrf_exempt
def smart_search_view(request):
    if request.method == 'POST':
        body = json.loads(request.body)
        query = body.get('query', '')
        print("query is",query)
        if not query:
            return JsonResponse({'error': 'No query provided'}, status=400)
        
        try:
            search_engine = SmartSearchEngine()
            result = search_engine.search(query)
            
            return JsonResponse({
                'query': query,
                'result': result
            })
        except ValueError as ve:
            return JsonResponse({'error': str(ve)}, status=500)
        except Exception as e:
            return JsonResponse({'error': 'An unexpected error occurred'}, status=500)
    
    return JsonResponse({'error': 'Only POST method is allowed'}, status=405)