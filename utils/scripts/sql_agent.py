import os
import pymysql
from sqlalchemy import create_engine
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.agents import create_sql_agent
from langchain.agents.agent_toolkits import SQLDatabaseToolkit
from langchain.sql_database import SQLDatabase

class SmartSearchEngine:
    def __init__(self, host, user, password, database, google_api_key):
        os.environ["GOOGLE_API_KEY"] = google_api_key
        
        connection_string = f"mysql+pymysql://{user}:{password}@{host}/{database}"
        
        self.engine = create_engine(connection_string)
        self.db = SQLDatabase(self.engine)
        
        self.llm = ChatGoogleGenerativeAI(model="gemini-pro")
        
        self.agent_executor = self._create_sql_agent()
    
    def _create_sql_agent(self):
        toolkit = SQLDatabaseToolkit(db=self.db, llm=self.llm)
        
        return create_sql_agent(
            llm=self.llm,
            toolkit=toolkit,
            verbose=False,
            handle_parsing_errors=True
        )
    
    def search(self, query):
        try:
            result = self.agent_executor.invoke({"input": query})
            return result.get('output', 'No results found')
        
        except Exception as e:
            return f"Error: {str(e)}"

def main():
    search_engine = SmartSearchEngine(
        host='',
        user='',
        password='',
        database='',
        google_api_key=''
    )
    
    queries = [
        "give what is the position of murphy diane",
    ]
    
    for query in queries:
        print(search_engine.search(query))

if __name__ == "__main__":
    main()