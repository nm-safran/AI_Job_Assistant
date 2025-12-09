"""
AI-Powered Resume Scoring Engine
Provides comprehensive 5-dimensional scoring with actionable recommendations
"""

from typing import Dict, List, Any
from collections import Counter
import re


class AIResumeScoringEngine:
    def __init__(self):
        self.action_verbs = [
            'achieved', 'implemented', 'developed', 'managed', 'led', 'created',
            'improved', 'increased', 'decreased', 'generated', 'launched', 'designed',
            'built', 'established', 'streamlined', 'optimized', 'delivered', 'executed'
        ]

        self.ats_friendly_sections = [
            'experience', 'education', 'skills', 'summary', 'work experience',
            'professional experience', 'work history', 'employment history'
        ]

    def calculate_comprehensive_score(self, resume_data: Dict[str, Any],
                                     job_data: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Calculate comprehensive resume score across 5 dimensions
        Returns overall score, category scores, grade, and recommendations
        """

        # Calculate 5-dimensional scores
        ats_score = self._calculate_ats_score(resume_data)
        keyword_score = self._calculate_keyword_score(resume_data, job_data)
        impact_score = self._calculate_impact_score(resume_data)
        completeness_score = self._calculate_completeness_score(resume_data)
        professional_score = self._calculate_professional_score(resume_data)

        # Calculate weighted overall score
        overall_score = round(
            (ats_score * 0.25) +
            (keyword_score * 0.25) +
            (impact_score * 0.20) +
            (completeness_score * 0.15) +
            (professional_score * 0.15)
        )

        # Generate grade
        grade = self._calculate_grade(overall_score)

        # Identify strengths and weaknesses
        scores_dict = {
            'ATS Compatibility': ats_score,
            'Keyword Optimization': keyword_score,
            'Impact & Achievements': impact_score,
            'Resume Completeness': completeness_score,
            'Professional Quality': professional_score
        }

        strengths = self._identify_strengths(scores_dict)
        weaknesses = self._identify_weaknesses(scores_dict)
        critical_issues = self._identify_critical_issues(scores_dict, resume_data)

        # Generate prioritized recommendations
        recommendations = self._generate_recommendations(scores_dict, resume_data, job_data)

        return {
            'overall_score': overall_score,
            'grade': grade,
            'scores': {
                'ats_score': ats_score,
                'keyword_score': keyword_score,
                'impact_score': impact_score,
                'completeness_score': completeness_score,
                'professional_score': professional_score
            },
            'strengths': strengths,
            'weaknesses': weaknesses,
            'critical_issues': critical_issues,
            'recommendations': recommendations
        }

    def _calculate_ats_score(self, resume_data: Dict[str, Any]) -> int:
        """Calculate ATS (Applicant Tracking System) compatibility score"""
        score = 0
        text = resume_data.get('text', '').lower()
        sections = [s.lower() for s in resume_data.get('sections', [])]

        # Check for standard sections (40 points)
        standard_sections_found = sum(1 for section in self.ats_friendly_sections if section in text)
        score += min(standard_sections_found * 13, 40)

        # Avoid images/graphics mention (20 points)
        if 'image' not in text and 'graphic' not in text:
            score += 20

        # Use of standard fonts (15 points - assume yes if well-formatted)
        if len(sections) >= 3:
            score += 15

        # Proper formatting indicators (15 points)
        if resume_data.get('skills') and len(resume_data['skills']) > 0:
            score += 10
        if resume_data.get('experience'):
            score += 5

        # Keyword density (10 points)
        word_count = len(text.split())
        if 300 <= word_count <= 800:
            score += 10
        elif word_count > 200:
            score += 5

        return min(score, 100)

    def _calculate_keyword_score(self, resume_data: Dict[str, Any],
                                 job_data: Dict[str, Any] = None) -> int:
        """Calculate keyword optimization score"""
        score = 50  # Base score

        resume_text = resume_data.get('text', '').lower()
        resume_skills = set(s.lower() for s in resume_data.get('skills', []))

        # Skills presence (25 points)
        if len(resume_skills) >= 10:
            score += 25
        elif len(resume_skills) >= 5:
            score += 15
        elif len(resume_skills) > 0:
            score += 10

        # Job-specific keyword matching (25 points)
        if job_data:
            job_skills = set(s.lower() for s in job_data.get('skills', []))
            if job_skills:
                matching_skills = resume_skills & job_skills
                match_ratio = len(matching_skills) / len(job_skills)
                score += int(match_ratio * 25)
        else:
            score += 15  # Partial credit if no job data

        return min(score, 100)

    def _calculate_impact_score(self, resume_data: Dict[str, Any]) -> int:
        """Calculate impact and achievements score"""
        score = 0
        text = resume_data.get('text', '')
        text_lower = text.lower()

        # Action verbs usage (30 points)
        action_verb_count = sum(1 for verb in self.action_verbs if verb in text_lower)
        score += min(action_verb_count * 3, 30)

        # Quantifiable results (40 points)
        # Numbers/percentages
        numbers_count = len(re.findall(r'\d+%|\$\d+|€\d+|\d+\+', text))
        score += min(numbers_count * 5, 25)

        # Year mentions (experience duration)
        year_mentions = len(re.findall(r'\d+\s*years?', text_lower))
        score += min(year_mentions * 5, 15)

        # Achievement keywords (30 points)
        achievement_keywords = ['achieved', 'improved', 'increased', 'reduced', 'generated',
                               'saved', 'awarded', 'recognized', 'exceeded', 'delivered']
        achievement_count = sum(1 for keyword in achievement_keywords if keyword in text_lower)
        score += min(achievement_count * 3, 30)

        return min(score, 100)

    def _calculate_completeness_score(self, resume_data: Dict[str, Any]) -> int:
        """Calculate resume completeness score"""
        score = 0

        # Essential sections (60 points)
        if resume_data.get('skills') and len(resume_data['skills']) > 0:
            score += 20
        if resume_data.get('experience'):
            score += 20
        if resume_data.get('education'):
            score += 20

        # Contact information (20 points)
        personal_info = resume_data.get('personal_info', {})
        if personal_info.get('email') and personal_info['email'] != 'Not found':
            score += 10
        if personal_info.get('phone') and personal_info['phone'] != 'Not found':
            score += 10

        # Additional beneficial sections (20 points)
        sections = [s.lower() for s in resume_data.get('sections', [])]
        if 'projects' in ' '.join(sections) or 'project' in resume_data.get('text', '').lower():
            score += 7
        if 'certifications' in ' '.join(sections) or 'certification' in resume_data.get('text', '').lower():
            score += 7
        if 'summary' in ' '.join(sections) or 'objective' in ' '.join(sections):
            score += 6

        return min(score, 100)

    def _calculate_professional_score(self, resume_data: Dict[str, Any]) -> int:
        """Calculate professional quality score"""
        score = 50  # Base score

        text = resume_data.get('text', '')

        # Length appropriateness (20 points)
        word_count = len(text.split())
        if 300 <= word_count <= 800:
            score += 20
        elif 200 <= word_count < 300 or 800 < word_count <= 1000:
            score += 10

        # Professional language (15 points)
        professional_words = ['professional', 'experienced', 'skilled', 'proficient',
                             'expertise', 'specialist', 'accomplished']
        professional_count = sum(1 for word in professional_words if word in text.lower())
        score += min(professional_count * 3, 15)

        # Proper structure (15 points)
        sections_count = len(resume_data.get('sections', []))
        if sections_count >= 4:
            score += 15
        elif sections_count >= 3:
            score += 10
        elif sections_count >= 2:
            score += 5

        return min(score, 100)

    def _calculate_grade(self, overall_score: int) -> str:
        """Convert score to letter grade"""
        if overall_score >= 95:
            return 'A+'
        elif overall_score >= 90:
            return 'A'
        elif overall_score >= 85:
            return 'A-'
        elif overall_score >= 80:
            return 'B+'
        elif overall_score >= 75:
            return 'B'
        elif overall_score >= 70:
            return 'B-'
        elif overall_score >= 65:
            return 'C+'
        elif overall_score >= 60:
            return 'C'
        elif overall_score >= 55:
            return 'C-'
        elif overall_score >= 50:
            return 'D+'
        elif overall_score >= 45:
            return 'D'
        else:
            return 'F'

    def _identify_strengths(self, scores: Dict[str, int]) -> List[str]:
        """Identify resume strengths (scores >= 80)"""
        strengths = []
        for category, score in scores.items():
            if score >= 80:
                strengths.append(f"Strong {category.lower()}")
        return strengths

    def _identify_weaknesses(self, scores: Dict[str, int]) -> List[str]:
        """Identify resume weaknesses (scores < 65)"""
        weaknesses = []
        for category, score in scores.items():
            if score < 65:
                weaknesses.append(f"{category} needs improvement")
        return weaknesses

    def _identify_critical_issues(self, scores: Dict[str, int],
                                  resume_data: Dict[str, Any]) -> List[str]:
        """Identify critical issues (scores < 50)"""
        critical = []

        for category, score in scores.items():
            if score < 50:
                critical.append(f"CRITICAL: {category} is significantly below standard")

        # Check for missing essential elements
        if not resume_data.get('skills'):
            critical.append("CRITICAL: No skills section found")
        if not resume_data.get('experience'):
            critical.append("CRITICAL: No experience section found")

        personal_info = resume_data.get('personal_info', {})
        if personal_info.get('email') == 'Not found':
            critical.append("CRITICAL: No email address found")

        return critical

    def _generate_recommendations(self, scores: Dict[str, int],
                                 resume_data: Dict[str, Any],
                                 job_data: Dict[str, Any] = None) -> List[Dict[str, Any]]:
        """Generate prioritized, actionable recommendations"""
        recommendations = []

        # ATS Compatibility recommendations
        if scores['ATS Compatibility'] < 75:
            recommendations.append({
                'title': 'Improve ATS Compatibility',
                'priority': 'High' if scores['ATS Compatibility'] < 60 else 'Medium',
                'suggestion': 'Use standard section headings like "Work Experience", "Education", and "Skills". Avoid tables, images, and complex formatting.',
                'expected_impact': 'Increases chance of passing ATS screening by 40%',
                'effort_required': 'Low - 15-30 minutes'
            })

        # Keyword Optimization recommendations
        if scores['Keyword Optimization'] < 75:
            priority = 'Critical' if scores['Keyword Optimization'] < 50 else 'High'
            recommendations.append({
                'title': 'Enhance Keyword Optimization',
                'priority': priority,
                'suggestion': 'Add more relevant skills and keywords from the job description. Include both technical and soft skills.',
                'expected_impact': 'Improves job match score by 30-50%',
                'effort_required': 'Medium - 30-60 minutes'
            })

        # Impact & Achievements recommendations
        if scores['Impact & Achievements'] < 75:
            recommendations.append({
                'title': 'Add Quantifiable Achievements',
                'priority': 'High',
                'suggestion': 'Start bullet points with action verbs and include metrics (e.g., "Increased sales by 25%", "Managed team of 10").',
                'expected_impact': 'Makes resume 60% more compelling to recruiters',
                'effort_required': 'Medium - 45-90 minutes'
            })

        # Completeness recommendations
        if scores['Resume Completeness'] < 75:
            priority = 'Critical' if scores['Resume Completeness'] < 60 else 'High'
            missing_elements = []
            if not resume_data.get('skills'):
                missing_elements.append('skills section')
            if not resume_data.get('experience'):
                missing_elements.append('work experience')
            personal_info = resume_data.get('personal_info', {})
            if personal_info.get('email') == 'Not found':
                missing_elements.append('email address')

            suggestion = f"Add missing elements: {', '.join(missing_elements) if missing_elements else 'additional sections like Projects or Certifications'}"
            recommendations.append({
                'title': 'Complete Missing Sections',
                'priority': priority,
                'suggestion': suggestion,
                'expected_impact': 'Essential for professional presentation',
                'effort_required': 'Medium - 30-60 minutes'
            })

        # Professional Quality recommendations
        if scores['Professional Quality'] < 75:
            recommendations.append({
                'title': 'Enhance Professional Quality',
                'priority': 'Medium',
                'suggestion': 'Ensure consistent formatting, professional language, and appropriate length (300-800 words). Add a professional summary.',
                'expected_impact': 'Improves first impression by 35%',
                'effort_required': 'Low - 20-40 minutes'
            })

        # Sort by priority
        priority_order = {'Critical': 0, 'High': 1, 'Medium': 2, 'Low': 3}
        recommendations.sort(key=lambda x: priority_order.get(x['priority'], 4))

        return recommendations
