from django.views.decorators.csrf import csrf_exempt
import os
import json
import logging
import traceback
import random
import pdfplumber
from django.http import JsonResponse
from django.core.files.storage import default_storage
from django.conf import settings
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from datetime import datetime

# Configure logging
logger = logging.getLogger(__name__)

class ResumeComprehensiveExtractor:
    def __init__(self):
        # Ensure Google API key is set
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            raise ValueError("Google API key is not set. Please check your .env file.")
        
        # Initialize the LLM
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-pro", 
            temperature=0.3, 
            max_tokens=2048,  
            api_key=api_key
        )
        
        # Create a JSON output parser
        self.json_parser = JsonOutputParser()
        
        # Comprehensive prompt template to extract multiple pieces of information
        self.prompt = PromptTemplate(
    template="""
    Extract detailed information from the resume text following this comprehensive schema:

    {{
        "fullName": "Full name as it appears on the resume",
        "email": "Professional email address",
        "phone": "Primary contact phone number",
        "city": "City of residence or work",
        "state": "State of residence or work",
        "country": "Country of residence or work (default to 'India' if not specified)",
        "bio": "Professional summary or objective statement",
        "about": "Detailed description of professional background",
        "website": "Personal website or professional portfolio URL",
        "skills": ["List of professional skills"],
        "interests": ["List of professional or personal interests"],
        "languages": ["List of languages known"],
        "education": [
            {{
                "degree": "Degree earned (B.Tech, M.Tech, etc.)",
                "department": "Field of study or academic department",
                "institution": "Name of educational institution",
                "graduationYear": "Year of graduation",
                "isVerified": "Always set to false in this context"
            }}
        ],
        "workExperience": [
            {{
                "companyName": "Name of company or organization",
                "role": "Job title or position",
                "startDate": "Start date of employment",
                "endDate": "End date of employment (or null if current job)",
                "description": "Brief description of responsibilities or achievements"
            }}
        ],
        "projects": [
            {{
                "title": "Project name",
                "description": "Detailed project description",
                "link": "Project URL or repository link (if available)"
            }}
        ],
        "certifications": [
            {{
                "name": "Certification name",
                "issuingOrganization": "Organization that issued the certification",
                "issueDate": "Date of certification"
            }}
        ]
    }}

    Resume Text: {resume_text}
    """,
    input_variables=["resume_text"]
)
        
        # Create the extraction chain
        self.extraction_chain = self.prompt | self.llm | self.json_parser

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

    def extract_pdf_text_in_chunks(self, pdf_path, max_chars=5000):
        """
        Extract text from a PDF in manageable chunks for LLM processing.
        """
        with pdfplumber.open(pdf_path) as pdf:
            full_text = ""
            for page in pdf.pages:
                full_text += (page.extract_text() or "") + "\n\n"
        
        # Split text into chunks
        return [full_text[i:i+max_chars] for i in range(0, len(full_text), max_chars)]

    def clean_and_merge_results(self, raw_outputs):
        """
        Clean and merge results from multiple chunk extractions.
        """
        try:
            # Initialize the comprehensive result structure
            final_result = {
                "fullName": None,
                "email": None,
                "phone": None,
                "city": None,
                "state": None,
                "country": "India",
                "bio": None,
                "about": None,
                "website": None,
                "skills": [],
                "interests": [],
                "languages": [],
                "education": [],
                "workExperience": [],
                "projects": [],
                "certifications": []
            }

            # Process each chunk's results
            for output in raw_outputs:
                # Merge scalar fields (take first non-null value)
                scalar_fields = [
                    "fullName", "email", "phone", "city", "state", 
                    "bio", "about", "website", "country"
                ]
                for field in scalar_fields:
                    if output.get(field) and not final_result[field]:
                        final_result[field] = output[field]

                # Merge list fields
                list_fields = [
                    "skills", "interests", "languages", 
                    "education", "workExperience", "projects", "certifications"
                ]
                for field in list_fields:
                    if output.get(field):
                        # Extend without duplicates
                        unique_items = [
                            item for item in output[field] 
                            if item not in final_result[field]
                        ]
                        final_result[field].extend(unique_items)

            # Post-processing
            # Limit lists to reasonable lengths
            final_result["skills"] = final_result["skills"][:10]
            final_result["interests"] = final_result["interests"][:5]
            final_result["languages"] = final_result["languages"][:4]
            final_result["education"] = final_result["education"][:3]
            final_result["workExperience"] = final_result["workExperience"][:5]
            final_result["projects"] = final_result["projects"][:5]
            final_result["certifications"] = final_result["certifications"][:5]

            # Default values for missing critical fields
            if not final_result["fullName"]:
                final_result["fullName"] = "Unknown"
            
            # Ensure dates are in correct format
            for exp in final_result["workExperience"]:
                try:
                    exp["startDate"] = datetime.strptime(exp["startDate"], "%Y-%m-%d") if exp.get("startDate") else None
                    exp["endDate"] = datetime.strptime(exp["endDate"], "%Y-%m-%d") if exp.get("endDate") else None
                except (ValueError, TypeError):
                    exp["startDate"] = None
                    exp["endDate"] = None

            # Add default values for missing but important fields
            final_result["createdAt"] = datetime.now()
            final_result["profilePhoto"] = None
            final_result["password"] = None  # Will be handled separately
            final_result["eventsRegistered"] = []
            final_result["connections"] = []
            final_result["receivedRequests"] = []
            final_result["sentRequests"] = []
            final_result["notifications"] = []
            final_result["chats"] = []
            final_result["donationHistory"] = []
            final_result["posts"] = []
            final_result["likes"] = []
            final_result["comments"] = []

            return final_result
        
        except Exception as e:
            logger.error(f"Error in cleaning results: {e}")
            logger.error(traceback.format_exc())
            return None

    def process_resume(self, pdf_file):
        """
        Process the uploaded PDF resume and extract comprehensive information.
        """
        # Save the uploaded file temporarily
        file_path = default_storage.save(
            os.path.join(settings.MEDIA_ROOT, 'resumes', pdf_file.name), 
            pdf_file
        )
        full_path = os.path.join(settings.MEDIA_ROOT, file_path)

        try:
            # Extract text from PDF
            resume_chunks = self.extract_pdf_text_in_chunks(full_path)

            # Log the first chunk for debugging
            logger.info(f"First Chunk of Resume Text (first 1000 chars):\n{resume_chunks[0][:1000]}...")

            # Use LLM to extract structured information
            extraction_results = []
            for chunk in resume_chunks:
                try:
                    result = self.extraction_chain.invoke({"resume_text": chunk})
                    extraction_results.append(result)
                except Exception as chain_error:
                    logger.error(f"Chain Extraction Error for chunk: {chain_error}")
                    extraction_results.append({"error": str(chain_error)})

            # Combine and clean results
            combined_results = self.clean_and_merge_results(extraction_results)
            
            logger.info(f"Combined Extraction Results: {combined_results}")
            return combined_results

        except Exception as e:
            # Log the full traceback for debugging
            logger.error(f"Error processing resume: {e}")
            logger.error(traceback.format_exc())
            return {"error": str(e)}
        
        finally:
            # Clean up the temporary file
            if os.path.exists(full_path):
                os.remove(full_path)

# Instantiate the extractor
resume_extractor = ResumeComprehensiveExtractor()

@csrf_exempt
def upload_resume(request):
    """
    Handle resume upload and extraction of comprehensive information.
    
    Expected: Multipart form-data with 'resume' file
    Returns: JSON with extracted resume information
    """
    if request.method == 'POST':
        # Check if file is present
        if 'resume' not in request.FILES:
            return JsonResponse({
                'error': 'No resume file uploaded'
            }, status=400)
        
        # Get the uploaded file
        resume_file = request.FILES['resume']
        
        # Validate file type (optional but recommended)
        if not resume_file.name.lower().endswith('.pdf'):
            return JsonResponse({
                'error': 'Only PDF files are allowed'
            }, status=400)
        
        # Process the resume
        try:
            extracted_info = resume_extractor.process_resume(resume_file)
            return JsonResponse(extracted_info, safe=False)
        
        except Exception as e:
            return JsonResponse({
                'error': f'Error processing resume: {str(e)}'
            }, status=500)
    
    # Handle non-POST requests
    return JsonResponse({
        'error': 'Only POST method is allowed'
    }, status=405)