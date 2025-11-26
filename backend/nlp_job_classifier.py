"""
NLP-Based Job Description Classifier
Uses NLP to analyze job descriptions, classify industries, detect requirements, and provide insights
"""

from typing import Dict, List, Any, Tuple
import re
from collections import Counter


class NLPJobClassifier:
    def __init__(self):
        # Industry classification keywords
        self.industry_keywords = {
            'Technology/Software': [
                'software', 'developer', 'engineer', 'programming', 'coding', 'tech',
                'api', 'cloud', 'devops', 'full stack', 'frontend', 'backend', 'mobile',
                'web development', 'agile', 'scrum', 'database', 'sql', 'python', 'java'
            ],
            'Data Science/AI': [
                'data scientist', 'machine learning', 'ai', 'artificial intelligence',
                'deep learning', 'neural network', 'nlp', 'data analysis', 'analytics',
                'big data', 'statistics', 'predictive modeling', 'tensorflow', 'pytorch'
            ],
            'Finance/Banking': [
                'finance', 'banking', 'investment', 'financial', 'accounting', 'audit',
                'risk management', 'portfolio', 'trading', 'equity', 'hedge fund', 'fintech'
            ],
            'Healthcare/Medical': [
                'healthcare', 'medical', 'clinical', 'patient', 'hospital', 'nursing',
                'doctor', 'pharmaceutical', 'health', 'medicine', 'therapy', 'diagnosis'
            ],
            'Marketing/Sales': [
                'marketing', 'sales', 'advertising', 'brand', 'campaign', 'seo', 'sem',
                'digital marketing', 'social media', 'content marketing', 'lead generation',
                'crm', 'customer acquisition', 'revenue growth'
            ],
            'Consulting': [
                'consulting', 'consultant', 'advisory', 'strategy', 'management consulting',
                'business analyst', 'process improvement', 'transformation', 'change management'
            ],
            'Product Management': [
                'product manager', 'product owner', 'roadmap', 'product strategy',
                'user experience', 'ux', 'product development', 'product lifecycle'
            ],
            'Operations/Logistics': [
                'operations', 'logistics', 'supply chain', 'procurement', 'inventory',
                'warehouse', 'distribution', 'fulfillment', 'vendor management'
            ],
            'Human Resources': [
                'hr', 'human resources', 'recruitment', 'talent acquisition', 'hiring',
                'employee relations', 'compensation', 'benefits', 'onboarding', 'training'
            ],
            'Design/Creative': [
                'designer', 'ui', 'ux', 'graphic design', 'visual design', 'creative',
                'illustrator', 'photoshop', 'figma', 'sketch', 'branding', 'typography'
            ]
        }

        # Job level indicators
        self.level_keywords = {
            'Entry Level': [
                'entry level', 'junior', 'associate', 'graduate', 'trainee', '0-2 years',
                'early career', 'recent graduate', 'entry-level'
            ],
            'Mid Level': [
                'mid level', 'intermediate', '3-5 years', '2-4 years', 'experienced',
                'mid-level', 'professional'
            ],
            'Senior Level': [
                'senior', 'lead', 'principal', '5+ years', '7+ years', 'expert',
                'specialist', 'staff', 'advanced'
            ],
            'Management': [
                'manager', 'director', 'head of', 'vp', 'vice president', 'chief',
                'team lead', 'supervisor', 'executive', 'leadership'
            ],
            'Executive': [
                'ceo', 'cto', 'cfo', 'coo', 'c-level', 'president', 'executive director',
                'chief executive', 'chief technology', 'chief financial'
            ]
        }

        # Requirement categories
        self.requirement_types = {
            'technical_skills': [
                'programming', 'coding', 'languages', 'frameworks', 'tools', 'technologies',
                'software', 'systems', 'database', 'cloud', 'apis'
            ],
            'soft_skills': [
                'communication', 'leadership', 'teamwork', 'problem solving', 'analytical',
                'collaboration', 'presentation', 'interpersonal', 'adaptability'
            ],
            'education': [
                'degree', 'bachelor', 'master', 'phd', 'mba', 'certification', 'diploma',
                'university', 'college', 'education'
            ],
            'experience': [
                'years of experience', 'work experience', 'professional experience',
                'proven track record', 'background in', 'experience with'
            ]
        }

    def classify_job_description(self, job_description: str, job_title: str = "") -> Dict[str, Any]:
        """
        Comprehensive NLP-based job description classification
        """
        text = job_description.lower()
        title_lower = job_title.lower()

        # 1. Industry Classification
        industry_scores = self._classify_industry(text, title_lower)
        primary_industry = max(industry_scores.items(), key=lambda x: x[1])[0] if industry_scores else 'General'

        # 2. Job Level Detection
        job_level = self._detect_job_level(text, title_lower)

        # 3. Extract Requirements
        requirements = self._extract_requirements(job_description)

        # 4. Identify Key Skills
        key_skills = self._identify_key_skills(text)

        # 5. Analyze Job Complexity
        complexity = self._analyze_complexity(requirements, key_skills)

        # 6. Extract Must-Have vs Nice-to-Have
        must_have, nice_to_have = self._categorize_requirements(job_description)

        # 7. Detect Work Arrangement
        work_arrangement = self._detect_work_arrangement(text)

        # 8. Sentiment Analysis
        sentiment = self._analyze_sentiment(text)

        # 9. Compensation Indicators
        compensation_info = self._extract_compensation_info(text)

        return {
            'industry_classification': {
                'primary_industry': primary_industry,
                'confidence_scores': industry_scores,
                'secondary_industries': self._get_secondary_industries(industry_scores)
            },
            'job_level': job_level,
            'requirements': requirements,
            'key_skills': key_skills,
            'complexity': complexity,
            'must_have_requirements': must_have,
            'nice_to_have_requirements': nice_to_have,
            'work_arrangement': work_arrangement,
            'sentiment_analysis': sentiment,
            'compensation_info': compensation_info,
            'insights': self._generate_insights(primary_industry, job_level, complexity, key_skills)
        }

    def _classify_industry(self, text: str, title: str) -> Dict[str, int]:
        """Classify job into industry categories"""
        industry_scores = {}

        for industry, keywords in self.industry_keywords.items():
            score = 0
            for keyword in keywords:
                # Count occurrences in job description
                score += text.count(keyword) * 2
                # Higher weight for title matches
                score += title.count(keyword) * 5

            if score > 0:
                industry_scores[industry] = score

        return industry_scores

    def _detect_job_level(self, text: str, title: str) -> str:
        """Detect seniority level of the position"""
        level_scores = {}

        for level, keywords in self.level_keywords.items():
            score = 0
            for keyword in keywords:
                score += text.count(keyword) * 2
                score += title.count(keyword) * 5

            if score > 0:
                level_scores[level] = score

        if not level_scores:
            return 'Mid Level'  # Default

        return max(level_scores.items(), key=lambda x: x[1])[0]

    def _extract_requirements(self, job_description: str) -> Dict[str, List[str]]:
        """Extract different types of requirements"""
        requirements = {
            'technical_skills': [],
            'soft_skills': [],
            'education': [],
            'experience': [],
            'certifications': []
        }

        text_lower = job_description.lower()

        # Extract technical skills
        tech_patterns = [
            r'(?:experience with|proficiency in|knowledge of)\s+([^.;]+)',
            r'(?:skills?:)\s*([^.;]+)',
            r'(?:required|must have):?\s*([^.;]+)'
        ]
        for pattern in tech_patterns:
            matches = re.findall(pattern, text_lower)
            for match in matches:
                items = [item.strip() for item in re.split(r'[,;]', match) if len(item.strip()) > 2]
                requirements['technical_skills'].extend(items[:5])  # Limit to avoid noise

        # Extract education requirements
        education_patterns = [
            r'(bachelor[\'s]*|master[\'s]*|phd|mba|degree)\s+(?:in\s+)?([^.;]+)',
            r'([^.;]*(?:degree|certification)[^.;]*)'
        ]
        for pattern in education_patterns:
            matches = re.findall(pattern, text_lower)
            for match in matches:
                edu_text = ' '.join(match) if isinstance(match, tuple) else match
                if 5 < len(edu_text) < 100:
                    requirements['education'].append(edu_text.strip())

        # Extract experience requirements
        exp_patterns = [
            r'(\d+[\+]?\s*(?:years?|yrs?)(?:\s+of)?\s+(?:experience|work)[^.;]*)',
            r'(proven (?:track record|experience)[^.;]*)'
        ]
        for pattern in exp_patterns:
            matches = re.findall(pattern, text_lower)
            requirements['experience'].extend([m.strip() for m in matches[:3]])

        # Extract certifications
        cert_keywords = ['certification', 'certified', 'license', 'accreditation']
        for keyword in cert_keywords:
            pattern = f'([^.;]*{keyword}[^.;]*)'
            matches = re.findall(pattern, text_lower)
            requirements['certifications'].extend([m.strip() for m in matches[:3]])

        # Clean up and deduplicate
        for key in requirements:
            requirements[key] = list(set(requirements[key]))[:5]  # Max 5 per category

        return requirements

    def _identify_key_skills(self, text: str) -> List[str]:
        """Identify most important skills from job description"""
        # Common professional skills
        skill_keywords = [
            'python', 'java', 'javascript', 'react', 'angular', 'node.js', 'sql', 'aws',
            'docker', 'kubernetes', 'git', 'agile', 'scrum', 'leadership', 'communication',
            'problem solving', 'analytical', 'project management', 'data analysis',
            'machine learning', 'api', 'rest', 'microservices', 'ci/cd', 'devops'
        ]

        found_skills = []
        for skill in skill_keywords:
            if skill in text:
                count = text.count(skill)
                found_skills.append((skill, count))

        # Sort by frequency and return top skills
        found_skills.sort(key=lambda x: x[1], reverse=True)
        return [skill for skill, _ in found_skills[:10]]

    def _analyze_complexity(self, requirements: Dict[str, List[str]],
                           skills: List[str]) -> Dict[str, Any]:
        """Analyze job complexity based on requirements and skills"""
        # Count total requirements
        total_requirements = sum(len(v) for v in requirements.values())

        # Count technical skills
        tech_skill_count = len(skills)

        # Determine complexity level
        if total_requirements >= 15 or tech_skill_count >= 8:
            complexity_level = 'High'
            description = 'This role requires extensive experience and a broad skill set'
        elif total_requirements >= 8 or tech_skill_count >= 5:
            complexity_level = 'Medium'
            description = 'This role requires solid experience and multiple skills'
        else:
            complexity_level = 'Low'
            description = 'This role has standard requirements suitable for various experience levels'

        return {
            'level': complexity_level,
            'description': description,
            'total_requirements': total_requirements,
            'technical_skills_required': tech_skill_count
        }

    def _categorize_requirements(self, job_description: str) -> Tuple[List[str], List[str]]:
        """Separate must-have from nice-to-have requirements"""
        must_have = []
        nice_to_have = []

        text_lower = job_description.lower()

        # Must-have patterns
        must_have_patterns = [
            r'(?:required|must have|mandatory|essential)(?::|\s)+([^.;]+)',
            r'(?:you (?:must|need to|should) have)(?::|\s)+([^.;]+)'
        ]

        for pattern in must_have_patterns:
            matches = re.findall(pattern, text_lower)
            for match in matches:
                items = [item.strip() for item in re.split(r'[,;]', match)]
                must_have.extend([item for item in items if 5 < len(item) < 100][:3])

        # Nice-to-have patterns
        nice_patterns = [
            r'(?:nice to have|preferred|bonus|plus|advantage)(?::|\s)+([^.;]+)',
            r'(?:ideal candidate (?:will|would))(?::|\s)+([^.;]+)'
        ]

        for pattern in nice_patterns:
            matches = re.findall(pattern, text_lower)
            for match in matches:
                items = [item.strip() for item in re.split(r'[,;]', match)]
                nice_to_have.extend([item for item in items if 5 < len(item) < 100][:3])

        return must_have[:5], nice_to_have[:5]

    def _detect_work_arrangement(self, text: str) -> Dict[str, Any]:
        """Detect work arrangement (remote, hybrid, on-site)"""
        remote_keywords = ['remote', 'work from home', 'wfh', 'distributed', 'anywhere']
        hybrid_keywords = ['hybrid', 'flexible', 'combination of remote and office']
        onsite_keywords = ['on-site', 'onsite', 'in-office', 'office-based']

        remote_count = sum(text.count(keyword) for keyword in remote_keywords)
        hybrid_count = sum(text.count(keyword) for keyword in hybrid_keywords)
        onsite_count = sum(text.count(keyword) for keyword in onsite_keywords)

        if remote_count > hybrid_count and remote_count > onsite_count:
            arrangement = 'Remote'
        elif hybrid_count > onsite_count:
            arrangement = 'Hybrid'
        elif onsite_count > 0:
            arrangement = 'On-site'
        else:
            arrangement = 'Not specified'

        return {
            'type': arrangement,
            'confidence': 'High' if max(remote_count, hybrid_count, onsite_count) >= 2 else 'Low'
        }

    def _analyze_sentiment(self, text: str) -> Dict[str, Any]:
        """Analyze sentiment and tone of job description"""
        # Positive words
        positive_words = [
            'exciting', 'opportunity', 'growth', 'innovative', 'dynamic', 'collaborative',
            'rewarding', 'competitive', 'excellent', 'great', 'amazing', 'fantastic'
        ]

        # Negative/demanding words
        demanding_words = [
            'demanding', 'challenging', 'high-pressure', 'fast-paced', 'intense',
            'strict', 'rigorous', 'heavy workload'
        ]

        # Inclusive words
        inclusive_words = [
            'diverse', 'inclusive', 'equal opportunity', 'welcoming', 'supportive',
            'work-life balance', 'flexible'
        ]

        positive_count = sum(text.count(word) for word in positive_words)
        demanding_count = sum(text.count(word) for word in demanding_words)
        inclusive_count = sum(text.count(word) for word in inclusive_words)

        # Determine overall tone
        if positive_count >= 3:
            tone = 'Positive and inviting'
        elif demanding_count >= 2:
            tone = 'Demanding and high-expectation'
        else:
            tone = 'Neutral and professional'

        return {
            'tone': tone,
            'positive_language': positive_count > 0,
            'inclusive_language': inclusive_count > 0,
            'work_culture_indicators': {
                'positive_mentions': positive_count,
                'demanding_mentions': demanding_count,
                'inclusive_mentions': inclusive_count
            }
        }

    def _extract_compensation_info(self, text: str) -> Dict[str, Any]:
        """Extract compensation and benefits information"""
        compensation = {
            'salary_mentioned': False,
            'salary_range': None,
            'benefits': []
        }

        # Salary patterns
        salary_patterns = [
            r'\$\s*(\d+(?:,\d{3})*(?:k|K)?)\s*(?:-|to)\s*\$?\s*(\d+(?:,\d{3})*(?:k|K)?)',
            r'(\d+(?:,\d{3})*)\s*(?:-|to)\s*(\d+(?:,\d{3})*)\s*(?:per year|annually)'
        ]

        for pattern in salary_patterns:
            match = re.search(pattern, text)
            if match:
                compensation['salary_mentioned'] = True
                compensation['salary_range'] = f"${match.group(1)} - ${match.group(2)}"
                break

        # Benefits keywords
        benefit_keywords = [
            'health insurance', '401k', 'dental', 'vision', 'pto', 'paid time off',
            'stock options', 'equity', 'bonus', 'retirement', 'parental leave',
            'professional development', 'training', 'gym membership'
        ]

        found_benefits = [benefit for benefit in benefit_keywords if benefit in text]
        compensation['benefits'] = found_benefits[:5]

        return compensation

    def _get_secondary_industries(self, industry_scores: Dict[str, int]) -> List[str]:
        """Get secondary industries beyond the primary one"""
        if len(industry_scores) <= 1:
            return []

        sorted_industries = sorted(industry_scores.items(), key=lambda x: x[1], reverse=True)
        return [industry for industry, _ in sorted_industries[1:3]]  # Get 2nd and 3rd

    def _generate_insights(self, industry: str, level: str,
                          complexity: Dict[str, Any], skills: List[str]) -> List[str]:
        """Generate actionable insights about the job"""
        insights = []

        # Industry insight
        insights.append(f"This is a {industry} position, which typically values {self._get_industry_values(industry)}")

        # Level insight
        insights.append(f"As a {level} role, candidates should demonstrate {self._get_level_expectations(level)}")

        # Complexity insight
        insights.append(f"Job complexity is {complexity['level'].lower()} with {complexity['total_requirements']} total requirements")

        # Skills insight
        if len(skills) >= 5:
            insights.append(f"Top required skills include: {', '.join(skills[:5])}")

        return insights

    def _get_industry_values(self, industry: str) -> str:
        """Get typical values for an industry"""
        industry_values = {
            'Technology/Software': 'innovation, problem-solving, and technical expertise',
            'Data Science/AI': 'analytical thinking, statistical knowledge, and machine learning skills',
            'Finance/Banking': 'attention to detail, risk management, and financial acumen',
            'Healthcare/Medical': 'patient care, medical knowledge, and regulatory compliance',
            'Marketing/Sales': 'creativity, customer focus, and revenue generation',
            'Consulting': 'strategic thinking, client management, and communication skills'
        }
        return industry_values.get(industry, 'professional expertise and domain knowledge')

    def _get_level_expectations(self, level: str) -> str:
        """Get typical expectations for a job level"""
        level_expectations = {
            'Entry Level': 'foundational knowledge and eagerness to learn',
            'Mid Level': '3-5 years of relevant experience and proven capabilities',
            'Senior Level': 'deep expertise, leadership potential, and strategic thinking',
            'Management': 'people management skills, strategic planning, and team leadership',
            'Executive': 'vision-setting, organization-wide impact, and executive presence'
        }
        return level_expectations.get(level, 'appropriate professional experience')
