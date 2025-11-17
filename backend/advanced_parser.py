import pdfplumber
import PyPDF2
from docx import Document
import re
import spacy
from typing import Dict, List, Any
import io

class UniversalResumeParser:
    def __init__(self):
        try:
            self.nlp = spacy.load("en_core_web_sm")
        except OSError:
            self.nlp = None
        self.skill_patterns = self._load_skill_patterns()

    def _load_skill_patterns(self):
        """Comprehensive skill database"""
        return {
            'programming': [
                'python', 'java', 'javascript', 'typescript', 'c++', 'c#', 'ruby', 'php', 'go', 'rust',
                'swift', 'kotlin', 'scala', 'r', 'matlab', 'perl', 'bash', 'shell'
            ],
            'web_frameworks': [
                'react', 'angular', 'vue', 'django', 'flask', 'spring', 'express', 'laravel', 'rails',
                'asp.net', 'node.js', 'next.js', 'nuxt.js', 'svelte'
            ],
            'databases': [
                'mysql', 'postgresql', 'mongodb', 'redis', 'oracle', 'sqlite', 'cassandra', 'dynamodb',
                'elasticsearch', 'firebase'
            ],
            'cloud_technologies': [
                'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'jenkins', 'ansible',
                'ci/cd', 'devops', 'microservices', 'serverless'
            ],
            'data_science': [
                'machine learning', 'deep learning', 'tensorflow', 'pytorch', 'keras', 'scikit-learn',
                'pandas', 'numpy', 'data analysis', 'data visualization', 'tableau', 'power bi',
                'big data', 'hadoop', 'spark', 'nlp', 'computer vision'
            ],
            'mobile': [
                'android', 'ios', 'react native', 'flutter', 'xamarin', 'ionic'
            ],
            'soft_skills': [
                'communication', 'leadership', 'teamwork', 'problem solving', 'critical thinking',
                'adaptability', 'time management', 'creativity', 'collaboration', 'analytical',
                'strategic planning', 'project management', 'agile', 'scrum'
            ]
        }

    def parse_resume(self, file_content, filename: str) -> Dict[str, Any]:
        """Main method to parse any resume format"""
        try:
            # Extract text based on file type
            if filename.lower().endswith('.pdf'):
                text = self._extract_text_from_pdf(file_content)
            elif filename.lower().endswith(('.docx', '.doc')):
                text = self._extract_text_from_docx(file_content)
            else:
                text = file_content.decode('utf-8') if isinstance(file_content, bytes) else file_content

            # Advanced analysis
            analysis = self._analyze_text(text)

            return {
                'success': True,
                'text': text,
                'analysis': analysis
            }

        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'text': '',
                'analysis': {}
            }

    def _extract_text_from_pdf(self, file_content) -> str:
        """Extract text from PDF using multiple methods for better accuracy"""
        text = ""

        try:
            # Method 1: pdfplumber (better for formatted text)
            with pdfplumber.open(io.BytesIO(file_content)) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
        except:
            pass

        # Method 2: PyPDF2 (fallback)
        if not text.strip():
            try:
                pdf_reader = PyPDF2.PdfReader(io.BytesIO(file_content))
                for page in pdf_reader.pages:
                    text += page.extract_text() + "\n"
            except:
                pass

        return text.strip()

    def _extract_text_from_docx(self, file_content) -> str:
        """Extract text from DOCX files"""
        try:
            doc = Document(io.BytesIO(file_content))
            return "\n".join([paragraph.text for paragraph in doc.paragraphs])
        except:
            return ""

    def _analyze_text(self, text: str) -> Dict[str, Any]:
        """Advanced text analysis using NLP"""
        if not text.strip():
            return {
                'skills': [],
                'experience': {},
                'education': [],
                'personal_info': {},
                'sections': [],
                'entities': {}
            }

        if self.nlp:
            doc = self.nlp(text)
        else:
            doc = None

        return {
            'skills': self._extract_skills_advanced(text),
            'experience': self._extract_experience(text),
            'education': self._extract_education(text),
            'personal_info': self._extract_personal_info(text),
            'sections': self._identify_sections(text),
            'entities': self._extract_entities(doc) if doc else {}
        }

    def _extract_skills_advanced(self, text: str) -> List[str]:
        """Advanced skill extraction using multiple methods"""
        skills_found = set()
        text_lower = text.lower()

        # Method 1: Pattern matching with comprehensive skill database
        for category, skill_list in self.skill_patterns.items():
            for skill in skill_list:
                # Use word boundaries for exact matching
                if re.search(r'\b' + re.escape(skill) + r'\b', text_lower):
                    skills_found.add(skill.title())

        # Method 2: NLP-based extraction
        if self.nlp:
            doc = self.nlp(text)
            for token in doc:
                if token.pos_ in ['NOUN', 'PROPN'] and len(token.text) > 2:
                    token_lower = token.text.lower()
                    for skill_list in self.skill_patterns.values():
                        if any(skill in token_lower for skill in skill_list):
                            skills_found.add(token.text.title())

        return list(skills_found)

    def _extract_experience(self, text: str) -> Dict[str, Any]:
        """Extract experience information"""
        experience = {
            'years': self._find_experience_years(text),
            'companies': self._extract_companies(text),
            'positions': self._extract_positions(text)
        }

        return experience

    def _find_experience_years(self, text: str) -> str:
        """Find total years of experience"""
        patterns = [
            r'(\d+)\+?\s*years?\s*(?:of)?\s*experience',
            r'experience\s*(?:in)?\s*(\d+)\+?\s*years',
            r'(\d+)-(\d+)\s*years?\s*experience'
        ]

        for pattern in patterns:
            matches = re.finditer(pattern, text, re.IGNORECASE)
            for match in matches:
                if match.groups():
                    return f"{match.group(1)} years"

        return "Not specified"

    def _extract_companies(self, text: str) -> List[str]:
        """Extract company names"""
        companies = []
        # Simple pattern for company names
        company_pattern = r'at\s+([A-Z][a-zA-Z\s]+?)(?=\s|\.|,)'
        matches = re.finditer(company_pattern, text)

        for match in matches:
            companies.append(match.group(1).strip())

        return list(set(companies))[:5]  # Return top 5

    def _extract_positions(self, text: str) -> List[str]:
        """Extract job positions"""
        positions = []
        common_positions = [
            'developer', 'engineer', 'manager', 'analyst', 'specialist',
            'consultant', 'architect', 'designer', 'administrator'
        ]

        for position in common_positions:
            pattern = r'(\w+\s+)?' + position + r'(\s+\w+)?'
            matches = re.finditer(pattern, text, re.IGNORECASE)
            for match in matches:
                positions.append(match.group().strip().title())

        return list(set(positions))[:5]

    def _extract_education(self, text: str) -> List[str]:
        """Extract education information"""
        education = []
        education_keywords = [
            'bachelor', "bachelor's", 'bs', 'b\.s', 'b\.sc',
            'master', "master's", 'ms', 'm\.s', 'm\.sc',
            'phd', 'ph\.d', 'doctorate',
            'degree', 'diploma', 'certification'
        ]

        # Find education sentences
        sentences = re.split(r'[.!?]+', text)
        for sentence in sentences:
            sentence_lower = sentence.lower()
            if any(edu in sentence_lower for edu in education_keywords):
                # Clean and add the sentence
                clean_sentence = re.sub(r'\s+', ' ', sentence).strip()
                if len(clean_sentence) < 100:  # Avoid too long sentences
                    education.append(clean_sentence)

        return education[:3]  # Return top 3 education entries

    def _extract_personal_info(self, text: str) -> Dict[str, str]:
        """Extract personal information"""
        # Email
        email_match = re.search(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', text)
        # Phone (various formats)
        phone_match = re.search(r'(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}', text)

        return {
            'email': email_match.group() if email_match else 'Not found',
            'phone': phone_match.group() if phone_match else 'Not found'
        }

    def _identify_sections(self, text: str) -> List[str]:
        """Identify resume sections"""
        sections_found = []
        common_sections = [
            'experience', 'education', 'skills', 'projects',
            'certifications', 'awards', 'publications', 'summary'
        ]

        for section in common_sections:
            if re.search(r'\b' + section + r'\b', text, re.IGNORECASE):
                sections_found.append(section.title())

        return sections_found

    def _extract_entities(self, doc) -> Dict[str, List[str]]:
        """Extract named entities using spaCy"""
        entities = {
            'PERSON': [],
            'ORG': [],
            'GPE': [],  # Locations
            'DATE': []
        }

        for ent in doc.ents:
            if ent.label_ in entities:
                entities[ent.label_].append(ent.text)

        # Remove duplicates
        for key in entities:
            entities[key] = list(set(entities[key]))

        return entities
