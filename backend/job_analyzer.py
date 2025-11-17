import spacy
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from typing import List, Dict, Any

class AdvancedJobAnalyzer:
    def __init__(self):
        try:
            self.nlp = spacy.load("en_core_web_sm")
        except OSError:
            self.nlp = None
        self.skill_categories = self._load_skill_categories()

    def _load_skill_categories(self):
        return {
            'programming_languages': [
                'python', 'java', 'javascript', 'typescript', 'c++', 'c#', 'ruby', 'go', 'rust',
                'swift', 'kotlin', 'scala', 'r', 'php', 'perl'
            ],
            'frameworks': [
                'react', 'angular', 'vue', 'django', 'flask', 'spring', 'express', 'laravel',
                'rails', 'asp.net', 'node.js', 'tensorflow', 'pytorch', 'keras'
            ],
            'databases': [
                'mysql', 'postgresql', 'mongodb', 'redis', 'oracle', 'sqlite', 'cassandra',
                'dynamodb', 'elasticsearch'
            ],
            'cloud_tools': [
                'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'jenkins',
                'ansible', 'git', 'github', 'gitlab'
            ],
            'soft_skills': [
                'communication', 'leadership', 'teamwork', 'problem solving', 'critical thinking',
                'adaptability', 'time management', 'creativity', 'collaboration'
            ]
        }

    def analyze_job_description(self, job_text: str) -> Dict[str, Any]:
        """Comprehensive job description analysis"""
        if not job_text.strip():
            return {
                'skills': [],
                'experience_level': 'Not specified',
                'education_requirements': [],
                'key_responsibilities': [],
                'salary_indicators': {},
                'company_culture': [],
                'skill_categories': {}
            }

        return {
            'skills': self._extract_skills(job_text),
            'experience_level': self._determine_experience_level(job_text),
            'education_requirements': self._extract_education_requirements(job_text),
            'key_responsibilities': self._extract_responsibilities(job_text),
            'salary_indicators': self._extract_salary_indicators(job_text),
            'company_culture': self._analyze_company_culture(job_text),
            'skill_categories': self._categorize_skills(job_text)
        }

    def _extract_skills(self, text: str) -> List[str]:
        """Extract skills from job description"""
        skills_found = set()
        text_lower = text.lower()

        # Extract from all categories
        for category, skills in self.skill_categories.items():
            for skill in skills:
                if re.search(r'\b' + re.escape(skill) + r'\b', text_lower):
                    skills_found.add(skill.title())

        return list(skills_found)

    def _determine_experience_level(self, text: str) -> str:
        """Determine required experience level"""
        text_lower = text.lower()

        senior_keywords = ['senior', 'lead', 'principal', 'architect', '5+ years', '8+ years', '10+ years']
        mid_keywords = ['mid-level', 'mid level', '3+ years', '2-5 years', 'experienced']
        junior_keywords = ['junior', 'entry level', 'graduate', '0-2 years', '1-3 years']

        if any(keyword in text_lower for keyword in senior_keywords):
            return "Senior (5+ years)"
        elif any(keyword in text_lower for keyword in mid_keywords):
            return "Mid-Level (2-5 years)"
        elif any(keyword in text_lower for keyword in junior_keywords):
            return "Entry-Level (0-2 years)"
        else:
            return "Not specified"

    def _extract_education_requirements(self, text: str) -> List[str]:
        """Extract education requirements"""
        education = []
        degree_patterns = [
            r"bachelor'?s?'?\s+degree",
            r"master'?s?'?\s+degree",
            r"ph\.?d\.?",
            r"degree in [A-Za-z\s]+",
            r"b\.?s\.?\/?b\.?a\.?",
            r"m\.?s\.?\/?m\.?a\.?"
        ]

        for pattern in degree_patterns:
            matches = re.finditer(pattern, text, re.IGNORECASE)
            for match in matches:
                education.append(match.group().title())

        return list(set(education))

    def _extract_responsibilities(self, text: str) -> List[str]:
        """Extract key responsibilities"""
        responsibilities = []

        # Look for responsibility sections
        lines = text.split('\n')
        in_responsibility_section = False

        for line in lines:
            line_lower = line.lower().strip()

            # Detect responsibility section headers
            if any(keyword in line_lower for keyword in ['responsibilities', 'duties', 'what you will do']):
                in_responsibility_section = True
                continue
            elif in_responsibility_section and line.strip() and len(line.strip()) > 10:
                responsibilities.append(line.strip())

            # Reset if we hit another major section
            if any(section in line_lower for section in ['requirements', 'qualifications', 'education']):
                in_responsibility_section = False

        return responsibilities[:8]  # Return top 8 responsibilities

    def _extract_salary_indicators(self, text: str) -> Dict[str, str]:
        """Extract salary information if available"""
        salary_patterns = [
            r'\$(\d{2,3}),?(\d{3})?\s*-\s*\$(\d{2,3}),?(\d{3})?',
            r'(\d{2,3})k\s*-\s*(\d{2,3})k',
            r'salary[\s:]*\$?(\d+(?:,\d{3})*)'
        ]

        for pattern in salary_patterns:
            matches = re.finditer(pattern, text, re.IGNORECASE)
            for match in matches:
                return {'salary_range': match.group()}

        return {'salary_range': 'Not specified'}

    def _analyze_company_culture(self, text: str) -> List[str]:
        """Analyze company culture keywords"""
        culture_keywords = {
            'fast-paced': ['fast-paced', 'dynamic', 'rapidly growing'],
            'collaborative': ['collaborative', 'team-oriented', 'cross-functional'],
            'innovative': ['innovative', 'cutting-edge', 'forward-thinking'],
            'remote_friendly': ['remote', 'work from home', 'flexible location'],
            'learning': ['learning', 'growth', 'development', 'training']
        }

        culture_aspects = []
        text_lower = text.lower()

        for aspect, keywords in culture_keywords.items():
            if any(keyword in text_lower for keyword in keywords):
                culture_aspects.append(aspect.replace('_', ' ').title())

        return culture_aspects

    def _categorize_skills(self, text: str) -> Dict[str, List[str]]:
        """Categorize skills found in job description"""
        categorized_skills = {category: [] for category in self.skill_categories.keys()}
        text_lower = text.lower()

        for category, skills in self.skill_categories.items():
            for skill in skills:
                if re.search(r'\b' + re.escape(skill) + r'\b', text_lower):
                    categorized_skills[category].append(skill.title())

        # Remove empty categories
        return {k: v for k, v in categorized_skills.items() if v}

    def calculate_similarity(self, resume_skills: List[str], job_skills: List[str]) -> float:
        """Calculate similarity between resume and job skills"""
        if not resume_skills or not job_skills:
            return 0.0

        # Convert to TF-IDF vectors
        all_skills = [' '.join(resume_skills), ' '.join(job_skills)]
        vectorizer = TfidfVectorizer().fit_transform(all_skills)
        vectors = vectorizer.toarray()

        # Calculate cosine similarity
        similarity = cosine_similarity(vectors[0:1], vectors[1:2])[0][0]

        return round(similarity * 100, 2)
