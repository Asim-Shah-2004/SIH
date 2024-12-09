from django.shortcuts import render

# Create your views here.
import os
import json
import logging
import traceback
import pymongo
import pdfplumber
import uuid
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.core.files.storage import default_storage
from django.conf import settings
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from sentence_transformers import SentenceTransformer  # HuggingFace embeddings
from dotenv import load_dotenv
from datetime import datetime

# Load environment variables
load_dotenv()

# Configure logging
logger = logging.getLogger(__name__)
mongo_url = os.getenv("MONGO_URL")
class PDFAnalyzer:
    def __init__(self):
        # MongoDB Connection
        try:
            mongo_url = os.getenv("MONGO_URL")
            self.mongo_client = pymongo.MongoClient(mongo_url)
            self.db = self.mongo_client['SIH']
            self.pdf_collection = self.db['pdf_documents']
            self.analysis_collection = self.db['pdf_analyses']
        except Exception as e:
            logger.error(f"MongoDB Connection Error: {e}")
            raise

        # Google Generative AI Initialization
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            raise ValueError("Google API key is not set. Please check your .env file.")

        try:
            self.llm = ChatGoogleGenerativeAI(
                model="gemini-pro",
                temperature=0.3,
                max_tokens=2048,
                api_key=api_key
            )
        except Exception as e:
            raise ValueError(f"Failed to initialize LLM: {str(e)}")

        # HuggingFace Embeddings 
        try:
            self.embeddings = SentenceTransformer('all-MiniLM-L6-v2')  # Free, lightweight model
        except Exception as e:
            raise ValueError(f"Failed to initialize embeddings: {str(e)}")

        # JSON Output Parser
        self.json_parser = JsonOutputParser()

    def extract_pdf_text(self, pdf_path):
        """
        Extract all text from a PDF file using pdfplumber.
        """
        with pdfplumber.open(pdf_path) as pdf:
            full_text = ""
            for page in pdf.pages:
                page_text = page.extract_text() or ""
                full_text += page_text + "\n\n"
            return full_text

    def generate_comprehensive_analysis(self, pdf_text):
        """
        Generate a comprehensive analysis of the PDF content.
        """
        analysis_prompt = PromptTemplate(
            template="""
            Perform a comprehensive analysis of the following document:

            Document Text: {document_text}

            Provide a detailed JSON analysis with the following sections:
            1. Document Type Identification
            2. Key Insights
            3. Strengths
            4. Areas of Improvement
            5. Potential Use Cases
            6. Detailed Recommendations
            7. Overall Assessment

            Return a structured JSON with these insights:
            {{
                "document_type": "Specific type of document",
                "key_insights": ["List of critical observations"],
                "strengths": ["Positive aspects of the document"],
                "improvement_areas": ["Suggested improvements"],
                "potential_use_cases": ["Possible applications"],
                "recommendations": ["Specific actionable recommendations"],
                "overall_assessment": {{
                    "quality_score": "Numeric score out of 10",
                    "summary": "Concise overall evaluation"
                }}
            }}
            """,
            input_variables=["document_text"]
        )

        # Create analysis chain
        analysis_chain = analysis_prompt | self.llm | self.json_parser

        try:
            # Generate analysis
            analysis_result = analysis_chain.invoke({"document_text": pdf_text})
            return analysis_result
        except Exception as e:
            logger.error(f"Analysis Generation Error: {e}")
            return {"error": str(e)}

    def store_pdf(self, pdf_file, user_id):
        """
        Store PDF and generate embeddings
        """
        # Generate unique ID for the PDF
        pdf_id = str(uuid.uuid4())

        # Save PDF to storage
        file_path = default_storage.save(
            os.path.join(settings.MEDIA_ROOT, 'pdfs', f"{pdf_id}_{pdf_file.name}"),
            pdf_file
        )
        full_path = os.path.join(settings.MEDIA_ROOT, file_path)

        try:
            # Extract text
            pdf_text = self.extract_pdf_text(full_path)

            # Generate embeddings (HuggingFace converts to numpy array automatically)
            text_embeddings = self.embeddings.encode(pdf_text).tolist()

            # Store in MongoDB
            pdf_doc = {
                "_id": pdf_id,
                "user_id": user_id,
                "filename": pdf_file.name,
                "file_path": full_path,
                "text_content": pdf_text,
                "embeddings": text_embeddings,  # Store full embedding list
                "uploaded_at": datetime.now()
            }

            # Insert document
            self.pdf_collection.insert_one(pdf_doc)

            return pdf_id

        except Exception as e:
            logger.error(f"PDF Storage Error: {e}")
            return None
        
    def query_pdf(self, pdf_id, query):
        """
        Query a stored PDF using semantic search
        """
        # Retrieve PDF document
        pdf_doc = self.pdf_collection.find_one({"_id": pdf_id})
        if not pdf_doc:
            return {"error": "PDF not found"}

        # Embed the query
        query_embedding = self.embeddings.encode(query).tolist()

        # Perform similarity search (simple cosine similarity)
        similarity_score = self._cosine_similarity(
            query_embedding, 
            pdf_doc['embeddings']
        )

        # Generate response based on query and document
        query_prompt = PromptTemplate(
            template="""
            Document Context: {document_text}
            User Query: {user_query}

            Provide a detailed, context-aware response that:
            1. Directly answers the query
            2. References specific parts of the document
            3. Provides additional insights if possible

            Response Format:
            {{
                "answer": "Comprehensive answer to the query",
                "relevant_excerpts": ["Relevant text snippets from the document"],
                "additional_insights": ["Extra context or related information"]
            }}
            """,
            input_variables=["document_text", "user_query"]
        )

        query_chain = query_prompt | self.llm | self.json_parser

        try:
            query_result = query_chain.invoke({
                "document_text": pdf_doc['text_content'],
                "user_query": query
            })

            # Add similarity score
            query_result['similarity_score'] = similarity_score

            return query_result

        except Exception as e:
            logger.error(f"PDF Query Error: {e}")
            return {"error": str(e)}

    def _cosine_similarity(self, vec1, vec2):
        """
        Simple cosine similarity calculation
        """
        import numpy as np
        return np.dot(vec1, vec2) / (np.linalg.norm(vec1) * np.linalg.norm(vec2))

# Instantiate PDF Analyzer
pdf_analyzer = PDFAnalyzer()

@csrf_exempt
def upload_pdf(request):
    """
    Upload PDF and perform initial analysis
    """
    if request.method == 'POST':
        # Handle multipart form data
        try:
            pdf_file = request.FILES.get('pdf')
            user_id = request.POST.get('user_id')

            if not pdf_file or not user_id:
                return JsonResponse({
                    'error': 'Missing PDF file or user ID'
                }, status=400)

            # Validate file type
            if not pdf_file.name.lower().endswith('.pdf'):
                return JsonResponse({
                    'error': 'Only PDF files are allowed'
                }, status=400)

            # Store PDF and generate ID
            pdf_id = pdf_analyzer.store_pdf(pdf_file, user_id)
            
            if not pdf_id:
                return JsonResponse({
                    'error': 'Failed to store PDF'
                }, status=500)

            # Perform comprehensive analysis
            full_path = os.path.join(settings.MEDIA_ROOT, 'pdfs', f"{pdf_id}_{pdf_file.name}")
            pdf_text = pdf_analyzer.extract_pdf_text(full_path)
            analysis = pdf_analyzer.generate_comprehensive_analysis(pdf_text)

            # Store analysis in MongoDB
            analysis_doc = {
                "pdf_id": pdf_id,
                "user_id": user_id,
                "analysis": analysis,
                "analyzed_at": datetime.now()
            }
            pdf_analyzer.analysis_collection.insert_one(analysis_doc)

            return JsonResponse({
                'pdf_id': pdf_id,
                'analysis': analysis
            })

        except Exception as e:
            logger.error(f"Upload Error: {traceback.format_exc()}")
            return JsonResponse({
                'error': f'Error processing PDF: {str(e)}'
            }, status=500)

    return JsonResponse({
        'error': 'Only POST method is allowed'
    }, status=405)

@csrf_exempt
def query_pdf(request):
    """
    Query a previously uploaded PDF
    """
    if request.method == 'POST':
        # Parse JSON input 
        try:
            body = json.loads(request.body)
            pdf_id = body.get('pdf_id')
            query = body.get('query')
        except json.JSONDecodeError:
            return JsonResponse({
                'error': 'Invalid JSON input'
            }, status=400)

        if not pdf_id or not query:
            return JsonResponse({
                'error': 'Missing PDF ID or query'
            }, status=400)

        try:
            # Query the PDF
            query_result = pdf_analyzer.query_pdf(pdf_id, query)
            return JsonResponse(query_result)

        except Exception as e:
            logger.error(f"Query Error: {traceback.format_exc()}")
            return JsonResponse({
                'error': f'Error querying PDF: {str(e)}'
            }, status=500)

    return JsonResponse({
        'error': 'Only POST method is allowed'
    }, status=405)