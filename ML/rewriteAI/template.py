
from langchain_core.prompts import PromptTemplate
def _define_rewriting_styles():
        """Define comprehensive and nuanced rewriting styles"""
        return {
            # Professional Spectrum
            'professional_80': {
                'template': PromptTemplate.from_template(
                    "Rewrite in a highly formal, corporate professional tone with precise language:\n\n{post}"
                ),
                'description': "Extremely formal, corporate communication style",
                'keywords': ['very professional', 'corporate', 'executive', 'formal', 'precise']
            },
            'professional_standard': {
                'template': PromptTemplate.from_template(
                    "Rewrite in a clear, professional business communication style:\n\n{post}"
                ),
                'description': "Standard professional communication",
                'keywords': ['professional', 'business', 'clear', 'standard']
         },
            'professional_casual': {
                'template': PromptTemplate.from_template(
                    "Rewrite in a relaxed, approachable professional tone:\n\n{post}"
                ),
                'description': "Friendly yet professional communication",
                'keywords': ['casual professional', 'approachable', 'friendly business']
            },
            
            # Emotional and Cultural Styles
            'emotional_passionate': {
                'template': PromptTemplate.from_template(
                    "Rewrite with intense emotional depth and passionate expression:\n\n{post}"
                ),
                'description': "Highly emotional and expressive communication",
                'keywords': ['passionate', 'emotional', 'intense', 'heartfelt']
            },
            'emotional_subtle': {
                'template': PromptTemplate.from_template(
                    "Rewrite with nuanced, understated emotional undertones:\n\n{post}"
                ),
                'description': "Subtle and refined emotional expression",
                'keywords': ['subtle emotion', 'understated', 'refined']
            },
            
            # Language and Cultural Mixtures
            'multilingual_hindi_english': {
                'template': PromptTemplate.from_template(
                    "Rewrite blending Hindi and English:\n\n{post}"
                ),
                'description': "Bilingual communication mixing Hindi and English",
                'keywords': ['hinglish', 'hindi-english', 'bilingual']
            },
            'multilingual_gujarati_english': {
                'template': PromptTemplate.from_template(
                    "Rewrite incorporating Gujarati linguistic nuances with English:\n\n{post}"
                ),
                'description': "Bilingual communication mixing Gujarati and English",
                'keywords': ['gujarati-english', 'bilingual', 'regional']
            },
            'multilingual_marathi_english': {
                'template': PromptTemplate.from_template(
                    "Rewrite blending Marathi and English, preserving cultural context:\n\n{post}"
                ),
                'description': "Bilingual communication mixing Marathi and English",
                'keywords': ['marathi-english', 'bilingual', 'maharashtrian']
            },
            
            # Tonal Variations
            'casual_joking': {
                'template': PromptTemplate.from_template(
                    "Rewrite with a light-hearted, humorous tone, adding playful jokes:\n\n{post}"
                ),
                'description': "Conversational style with humor and jokes",
                'keywords': ['casual', 'humorous', 'joking', 'funny']
            },
            'serious_academic': {
                'template': PromptTemplate.from_template(
                    "Rewrite in a scholarly, analytical, and serious academic tone:\n\n{post}"
                ),
                'description': "Scholarly and serious academic communication",
                'keywords': ['academic', 'serious', 'scholarly', 'analytical']
            },
            
            # Emotional States
            'emotion_anger': {
                'template': PromptTemplate.from_template(
                    "Rewrite expressing controlled yet intense frustration and anger:\n\n{post}"
                ),
                'description': "Communication expressing anger and frustration",
                'keywords': ['angry', 'frustrated', 'intense emotion']
            },
            'emotion_sympathetic': {
                'template': PromptTemplate.from_template(
                    "Rewrite with deep empathy, compassion, and understanding:\n\n{post}"
                ),
                'description': "Compassionate and empathetic communication",
                'keywords': ['sympathetic', 'empathetic', 'compassionate']
            },
            
            # Fallback Default Styles
            'casual': {
                'template': PromptTemplate.from_template(
                    "Rewrite in a relaxed, conversational, everyday tone:\n\n{post}"
                ),
                'description': "Informal, friendly, everyday communication",
                'keywords': ['casual', 'conversational', 'relaxed', 'friendly']
            },
            'strategic_persuasion': {
    'template': PromptTemplate.from_template(
        "Rewrite in a strategic, persuasive corporate tone to influence decision-makers:\n\n{post}"
    ),
    'description': "Persuasive communication tailored for executives or leadership.",
    'keywords': ['strategic', 'persuasive', 'corporate', 'executive', 'influential']
},
'investor_focused': {
    'template': PromptTemplate.from_template(
        "Rewrite with a focus on financial stakeholders, emphasizing ROI and data insights:\n\n{post}"
    ),
    'description': "Financially-focused communication for investors.",
    'keywords': ['financial', 'ROI', 'data-driven', 'investors']
},
'confident_leadership': {
    'template': PromptTemplate.from_template(
        "Rewrite in a confident, authoritative tone suited for leadership communication:\n\n{post}"
    ),
    'description': "Authoritative and inspiring communication for leaders.",
    'keywords': ['leadership', 'confident', 'authoritative', 'inspiring']
},
'visionary_futuristic': {
    'template': PromptTemplate.from_template(
        "Rewrite with a visionary and futuristic tone, emphasizing innovation:\n\n{post}"
    ),
    'description': "Inspirational communication focused on future possibilities.",
    'keywords': ['visionary', 'futuristic', 'innovative', 'inspirational']
},
'process_oriented': {
    'template': PromptTemplate.from_template(
        "Rewrite in a precise and detailed tone, emphasizing processes and workflows:\n\n{post}"
    ),
    'description': "Communication focusing on detailed processes and workflows.",
    'keywords': ['process', 'workflow', 'precise', 'structured']
},
'technical_formal': {
    'template': PromptTemplate.from_template(
        "Rewrite with a highly technical and formal tone, maintaining clarity:\n\n{post}"
    ),
    'description': "Formal and detailed technical communication.",
    'keywords': ['technical', 'formal', 'detailed', 'clarity']
},
'crisis_management': {
    'template': PromptTemplate.from_template(
        "Rewrite in a calm, reassuring tone suitable for crisis management:\n\n{post}"
    ),
    'description': "Communication designed to manage crises with composure.",
    'keywords': ['crisis', 'reassuring', 'calm', 'management']
},
'employee_engagement': {
    'template': PromptTemplate.from_template(
        "Rewrite with an engaging tone, focused on motivating employees:\n\n{post}"
    ),
    'description': "Motivational communication aimed at employee engagement.",
    'keywords': ['engaging', 'motivational', 'employees', 'positive']
},
'diverse_inclusive': {
    'template': PromptTemplate.from_template(
        "Rewrite with a focus on diversity and inclusion, maintaining respect and equity:\n\n{post}"
    ),
    'description': "Communication emphasizing diversity and inclusivity.",
    'keywords': ['diverse', 'inclusive', 'equity', 'respect']
},
'neutral_informative': {
    'template': PromptTemplate.from_template(
        "Rewrite in a neutral, informative tone, avoiding bias or emotional language:\n\n{post}"
    ),
    'description': "Clear and unbiased informative communication.",
    'keywords': ['neutral', 'informative', 'unbiased', 'clear']
},
'playful_creative': {
    'template': PromptTemplate.from_template(
        "Rewrite with a creative and playful tone, adding a touch of whimsy:\n\n{post}"
    ),
    'description': "Imaginative communication with a playful twist.",
    'keywords': ['creative', 'playful', 'imaginative', 'whimsical']
},
'sales_promotional': {
    'template': PromptTemplate.from_template(
        "Rewrite in a persuasive tone optimized for sales and promotions:\n\n{post}"
    ),
    'description': "Sales-focused communication designed to promote products or services.",
    'keywords': ['sales', 'promotional', 'persuasive', 'marketing']
},
'scientific_precise': {
    'template': PromptTemplate.from_template(
        "Rewrite in a scientific tone with precise terminology and data-backed claims:\n\n{post}"
    ),
    'description': "Communication focusing on scientific accuracy and precision.",
    'keywords': ['scientific', 'precise', 'data-backed', 'analytical']
},
'empathetic_leadership': {
    'template': PromptTemplate.from_template(
        "Rewrite with empathetic language to inspire and support your team:\n\n{post}"
    ),
    'description': "Supportive and empathetic leadership communication.",
    'keywords': ['empathetic', 'supportive', 'leadership', 'inspiring']
},
'youthful_energetic': {
    'template': PromptTemplate.from_template(
        "Rewrite with a youthful, energetic tone to appeal to younger audiences:\n\n{post}"
    ),
    'description': "Energetic communication aimed at younger audiences.",
    'keywords': ['youthful', 'energetic', 'vibrant', 'fun']
},
'calm_apologetic': {
    'template': PromptTemplate.from_template(
        "Rewrite with a calm and sincere apologetic tone:\n\n{post}"
    ),
    'description': "Sincere and calm tone for apologies.",
    'keywords': ['calm', 'apologetic', 'sincere', 'reassuring']
},
'festive_celebratory': {
    'template': PromptTemplate.from_template(
        "Rewrite with a joyful and celebratory tone for festive occasions:\n\n{post}"
    ),
    'description': "Upbeat communication for festive celebrations.",
    'keywords': ['festive', 'celebratory', 'joyful', 'upbeat']
},
'legal_formal': {
    'template': PromptTemplate.from_template(
        "Rewrite with formal legal terminology and precise phrasing:\n\n{post}"
    ),
    'description': "Formal and precise legal communication.",
    'keywords': ['legal', 'formal', 'precise', 'terminology']
},
'patient_explanatory': {
    'template': PromptTemplate.from_template(
        "Rewrite in a patient, explanatory tone suitable for complex topics:\n\n{post}"
    ),
    'description': "Patient and clear communication for explaining complex ideas.",
    'keywords': ['patient', 'explanatory', 'clear', 'educational']
},
'aspirational_dreamy': {
    'template': PromptTemplate.from_template(
        "Rewrite with an aspirational and dreamy tone to inspire imagination:\n\n{post}"
    ),
    'description': "Imaginative and inspirational communication.",
    'keywords': ['aspirational', 'dreamy', 'imaginative', 'inspirational']
},
'mentorship_guidance': {
    'template': PromptTemplate.from_template(
        "Rewrite in a warm and supportive tone, offering guidance and mentorship:\n\n{post}"
    ),
    'description': "Communication focused on providing advice and guidance to students.",
    'keywords': ['mentorship', 'guidance', 'supportive', 'advisory']
},
'career_advice': {
    'template': PromptTemplate.from_template(
        "Rewrite with a professional tone offering actionable career advice:\n\n{post}"
    ),
    'description': "Focused on helping students with career-related queries.",
    'keywords': ['career', 'advice', 'professional', 'actionable']
},
'networking_formal': {
    'template': PromptTemplate.from_template(
        "Rewrite with a professional tone to foster formal networking connections:\n\n{post}"
    ),
    'description': "Facilitating formal professional networking between alumni and students.",
    'keywords': ['networking', 'formal', 'connections', 'professional']
},
'networking_casual': {
    'template': PromptTemplate.from_template(
        "Rewrite in a friendly tone encouraging casual networking and relationship building:\n\n{post}"
    ),
    'description': "Fostering casual and approachable networking interactions.",
    'keywords': ['networking', 'casual', 'friendly', 'approachable']
},
'collaboration_initiative': {
    'template': PromptTemplate.from_template(
        "Rewrite in a proactive tone encouraging collaboration on projects or initiatives:\n\n{post}"
    ),
    'description': "Encouraging collaboration on professional or academic projects.",
    'keywords': ['collaboration', 'initiatives', 'projects', 'teamwork']
},
'inspirational_experience': {
    'template': PromptTemplate.from_template(
        "Rewrite in an inspirational tone sharing personal experiences and success stories:\n\n{post}"
    ),
    'description': "Motivating communication by sharing alumni success stories.",
    'keywords': ['inspirational', 'experience', 'motivational', 'success stories']
},
'resume_review': {
    'template': PromptTemplate.from_template(
        "Rewrite with a focus on providing feedback for resumes or portfolios:\n\n{post}"
    ),
    'description': "Professional tone offering constructive feedback on resumes.",
    'keywords': ['resume', 'portfolio', 'feedback', 'constructive']
},
'interview_preparation': {
    'template': PromptTemplate.from_template(
        "Rewrite in a professional tone offering interview preparation tips:\n\n{post}"
    ),
    'description': "Focused on helping students prepare for interviews effectively.",
    'keywords': ['interview', 'preparation', 'professional', 'guidance']
},
'alumni_event_invitation': {
    'template': PromptTemplate.from_template(
        "Rewrite in a formal and inviting tone for alumni events or reunions:\n\n{post}"
    ),
    'description': "Formal invitations for alumni to attend events or reunions.",
    'keywords': ['event', 'invitation', 'formal', 'reunion']
},
'alumni_mentorship_request': {
    'template': PromptTemplate.from_template(
        "Rewrite in a polite and respectful tone for requesting mentorship:\n\n{post}"
    ),
    'description': "Requests for alumni to mentor students, phrased politely.",
    'keywords': ['mentorship', 'request', 'polite', 'respectful']
},
'student_guidance_request': {
    'template': PromptTemplate.from_template(
        "Rewrite in a curious and enthusiastic tone requesting guidance from alumni:\n\n{post}"
    ),
    'description': "Student requests for career or academic guidance from alumni.",
    'keywords': ['guidance', 'student', 'enthusiastic', 'curious']
},
'technical_advice': {
    'template': PromptTemplate.from_template(
        "Rewrite with a technical tone offering expertise in a specific domain:\n\n{post}"
    ),
    'description': "Alumni offering domain-specific technical advice to students.",
    'keywords': ['technical', 'advice', 'domain-specific', 'expertise']
},
'achievement_announcement': {
    'template': PromptTemplate.from_template(
        "Rewrite in an enthusiastic tone to announce achievements or milestones:\n\n{post}"
    ),
    'description': "Sharing milestones or achievements with the alumni community.",
    'keywords': ['achievement', 'announcement', 'enthusiastic', 'milestone']
},
'job_referral': {
    'template': PromptTemplate.from_template(
        "Rewrite in a professional tone seeking or offering job referrals:\n\n{post}"
    ),
    'description': "Communication focused on job referrals between alumni and students.",
    'keywords': ['job', 'referral', 'professional', 'opportunity']
},
'industry_insights': {
    'template': PromptTemplate.from_template(
        "Rewrite in an informative tone offering insights about industry trends:\n\n{post}"
    ),
    'description': "Sharing valuable industry trends or insights with students.",
    'keywords': ['industry', 'insights', 'informative', 'trends']
},
'alumni_testimonial': {
    'template': PromptTemplate.from_template(
        "Rewrite in a reflective tone sharing testimonials about the institution:\n\n{post}"
    ),
    'description': "Testimonials by alumni reflecting on their experiences at the institution.",
    'keywords': ['testimonial', 'reflective', 'alumni', 'institution']
},
'fundraising_campaign': {
    'template': PromptTemplate.from_template(
        "Rewrite in an encouraging tone appealing for alumni contributions:\n\n{post}"
    ),
    'description': "Appealing to alumni for donations or fundraising campaigns.",
    'keywords': ['fundraising', 'donations', 'encouraging', 'campaign']
},
'success_story_highlight': {
    'template': PromptTemplate.from_template(
        "Rewrite in a celebratory tone highlighting a successful alumni story:\n\n{post}"
    ),
    'description': "Celebrating and sharing notable alumni successes.",
    'keywords': ['success', 'highlight', 'celebratory', 'alumni']
},
'student_introduction': {
    'template': PromptTemplate.from_template(
        "Rewrite in a polite and enthusiastic tone introducing a student to an alumni:\n\n{post}"
    ),
    'description': "Introducing students to alumni for mentorship or networking.",
    'keywords': ['introduction', 'student', 'polite', 'enthusiastic']
},
'alumni_connect_general': {
    'template': PromptTemplate.from_template(
        "Rewrite in a warm and approachable tone to encourage alumni-student interaction:\n\n{post}"
    ),
    'description': "General communication fostering alumni-student relationships.",
    'keywords': ['connect', 'alumni', 'student', 'interaction']
}


        }