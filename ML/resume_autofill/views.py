from django.views.decorators.csrf import csrf_exempt
import os
import json
import logging
import traceback
import pdfplumber
from django.http import JsonResponse
from django.core.files.storage import default_storage
from django.conf import settings
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser

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
    Extract the following comprehensive information from the resume text. 
    If certain details are missing, return null or an empty string.
    Return JSON strictly matching this structure:

    {{
        "personal_info": {{
            "full_name": "Complete full name",
            "email": "Professional email address",
            "phone": "Primary contact phone number",
            "linkedin": "LinkedIn profile URL (if available)",
            "github": "GitHub profile URL (if available)"
        }},
        "education": [
            {{
                "institution": "Name of educational institution",
                "degree": "Degree earned",
                "major": "Field of study (if specified)",
                "graduation_year": "Graduation year or 'ongoing' if still studying",
                "honors": "Honors or GPA (if mentioned)"
            }}
        ],
        "experience": [
            {{
                "company": "Company or organization name",
                "position": "Job title or role",
                "start_date": "Start date of employment",
                "end_date": "End date of employment (or 'Present' if current job)",
                "responsibilities": ["List of key responsibilities or achievements"],
                "location": "Location of work (optional)"
            }}
        ],
        "projects": [
            {{
                "name": "Project name",
                "description": "Detailed description of the project",
                "technologies": ["List of technologies used"],
                "start_date": "Project start date (if mentioned)",
                "end_date": "Project end date (if mentioned)",
                "key_achievements": ["Significant outcomes or impacts"]
            }}
        ],
        "achievements": [
            {{
                "title": "Achievement title",
                "description": "Details about the achievement",
                "date": "Year or date of achievement (if mentioned)"
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

    def clean_json_output(self, raw_output):
        """
        Ensure proper JSON structure and handle multiple chunk extractions.
        """
        try:
            parsed_results = json.loads(raw_output)
            
            # Initialize a comprehensive result structure
            final_result = {
                "personal_info": {},
                "education": [],
                "experience": [],
                "projects": [],
                "achievements": []
            }
            
            # Merge results from multiple chunks
            for result in parsed_results:
                # Merge personal info (take first non-empty result)
                if result.get("personal_info") and not final_result["personal_info"]:
                    final_result["personal_info"] = result["personal_info"]
                
                # Extend lists
                for key in ["education", "experience", "projects", "achievements"]:
                    if result.get(key):
                        final_result[key].extend(result[key])
            
            return final_result
        
        except json.JSONDecodeError as e:
            logger.error(f"JSON Decode Error: {e}")
            return {"error": "Failed to parse LLM output"}

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

            # Combine results and clean up
            combined_results = self.clean_json_output(json.dumps(extraction_results))
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
