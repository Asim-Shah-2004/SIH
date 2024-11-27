import os
import pymysql
from sqlalchemy import create_engine, text
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.agents import create_sql_agent
from langchain.agents.agent_toolkits import SQLDatabaseToolkit
from langchain.sql_database import SQLDatabase
from langchain.prompts import PromptTemplate
import pandas as pd

class SmartSearchEngine:
    def __init__(self, host, user, password, database, google_api_key):
        """
        Initialize the Smart Search Engine
        
        :param host: MySQL database host
        :param user: MySQL database username
        :param password: MySQL database password
        :param database: Database name
        :param google_api_key: Google API key for Gemini
        """
        # Set Google API Key
        os.environ["GOOGLE_API_KEY"] = google_api_key
        
        # Create database connection string
        connection_string = f"mysql+pymysql://{user}:{password}@{host}/{database}"
        
        # Create database engine and SQLDatabase object
        self.engine = create_engine(connection_string)
        self.db = SQLDatabase(self.engine)
        
        # Initialize Gemini LLM
        self.llm = ChatGoogleGenerativeAI(model="gemini-pro")
        
        # Create custom system prompt with database context
        self.system_prompt = self._create_system_prompt()
        
        # Create SQL Agent
        self.agent_executor = self._create_sql_agent()
    
    def _create_system_prompt(self):
        """
        Create a detailed system prompt that includes database schema and relationships
        
        :return: Formatted system prompt string
        """
        try:
            # Retrieve database schema information
            inspector = self.engine.dialect.Inspector.from_engine(self.engine)
            schema_info = []
            
            # Collect table schemas
            for table_name in inspector.get_table_names():
                columns = [
                    f"{col['name']} ({col['type']})" 
                    for col in inspector.get_columns(table_name)
                ]
                
                # Collect foreign key relationships
                foreign_keys = inspector.get_foreign_keys(table_name)
                relationships = [
                    f"Foreign Key: {fk['constrained_columns'][0]} references {fk['referred_table']}({fk['referred_columns'][0]})"
                    for fk in foreign_keys
                ]
                
                schema_info.append(f"""
Table: {table_name}
Columns: {', '.join(columns)}
{f'Relationships: {chr(10)}' + chr(10).join(relationships) if relationships else 'No direct relationships'}
                """)
            
            return f"""
You are an advanced SQL query generator and explainer. Your task is to:
1. Understand user's natural language query
2. Generate precise and efficient SQL query
3. Provide clear explanation of the query

Database Schema and Relationships:
{chr(10).join(schema_info)}

Guidelines:
- Use optimal JOINs when querying related tables
- Avoid unnecessary complex subqueries
- Prioritize performance and readability
- Handle edge cases and potential NULL values
"""
        except Exception as e:
            return f"Error generating system prompt: {str(e)}"
    
    def _create_sql_agent(self):
        """
        Create SQL agent with custom configuration
        
        :return: Configured agent executor
        """
        toolkit = SQLDatabaseToolkit(db=self.db, llm=self.llm)
        
        return create_sql_agent(
            llm=self.llm,
            toolkit=toolkit,
            verbose=True,
            handle_parsing_errors=True
        )
    
    def search(self, query):
        """
        Execute smart search based on natural language query
        
        :param query: User's natural language query
        :return: Dictionary with query results and explanation
        """
        try:
            # Execute agent with the query
            result = self.agent_executor.invoke({"input": query})
            
            # Extract SQL query and results
            sql_query = result.get('intermediate_steps', [{}])[-1].get('action_input', 'No query generated')
            query_results = result.get('output', 'No results found')
            
            # Convert results to DataFrame for better readability
            try:
                results_df = pd.read_sql(sql_query, self.engine)
            except Exception:
                results_df = query_results
            
            return {
                "query": sql_query,
                "results": results_df,
                "results_html": results_df.to_html(index=False) if isinstance(results_df, pd.DataFrame) else query_results,
                "explanation": f"Query interpreted and executed successfully for: {query}"
            }
        
        except Exception as e:
            return {
                "error": str(e),
                "explanation": "Failed to process the query. Please try a different phrasing."
            }
    
    def list_tables(self):
        """
        List all tables in the database
        
        :return: List of table names
        """
        try:
            inspector = self.engine.dialect.Inspector.from_engine(self.engine)
            return inspector.get_table_names()
        except Exception as e:
            return f"Error listing tables: {str(e)}"
    
    def describe_table(self, table_name):
        """
        Get detailed information about a specific table
        
        :param table_name: Name of the table to describe
        :return: Dictionary with table schema details
        """
        try:
            inspector = self.engine.dialect.Inspector.from_engine(self.engine)
            columns = inspector.get_columns(table_name)
            primary_keys = inspector.get_primary_keys(table_name)
            foreign_keys = inspector.get_foreign_keys(table_name)
            
            return {
                "columns": [
                    {
                        "name": col['name'],
                        "type": str(col['type']),
                        "nullable": col['nullable'],
                        "primary_key": col['name'] in primary_keys,
                        "default": col.get('default', None)
                    } for col in columns
                ],
                "foreign_keys": [
                    {
                        "column": fk['constrained_columns'][0],
                        "referenced_table": fk['referred_table'],
                        "referenced_column": fk['referred_columns'][0]
                    } for fk in foreign_keys
                ]
            }
        except Exception as e:
            return f"Error describing table {table_name}: {str(e)}"

# Example Usage
def main():
    # Database configuration
    DB_CONFIG = {
        'host': 'localhost',
        'user': 'root',
        'password': 'your_password',
        'database': 'classicmodels',
        'google_api_key': 'YOUR_GOOGLE_API_KEY'
    }
    
    # Create Smart Search Engine
    search_engine = SmartSearchEngine(
        host='localhost',
        user='root',
        password='',
        database='classicmodels',
        google_api_key=''
    )
    
    # Example: List all tables
    print("Tables in the database:")
    print(search_engine.list_tables())
    
    # Example: Describe a specific table
    print("\nTable Description for 'customers':")
    print(search_engine.describe_table('customers'))
    
    # Example queries
    queries = [
        "how many cars are there",
    ]
    
    # Run example queries
    for query in queries:
        result = search_engine.search(query)
        print(f"\nQuery: {query}")
        print(f"SQL: {result.get('query', 'N/A')}")
        print(f"Results:\n{result.get('results', 'N/A')}")
        print(f"Explanation: {result.get('explanation', 'N/A')}")

if __name__ == "__main__":
    main()