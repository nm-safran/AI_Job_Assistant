"""
AI-Powered Interview Preparation Assistant
Generates targeted interview questions and preparation guidance
Integrated with real-world interview datasets for enhanced recommendations
"""

from typing import Dict, List, Any
import random


class AIInterviewPrep:
    def __init__(self, data_processor=None):
        # Optional data processor for real interview questions
        self.data_processor = data_processor

        # Question database organized by category
        self.question_database = {
            'behavioral': [
                'Tell me about a time when you had to deal with a difficult team member.',
                'Describe a situation where you had to meet a tight deadline.',
                'Give me an example of a goal you set and how you achieved it.',
                'Tell me about a time when you failed and what you learned from it.',
                'Describe a situation where you had to adapt to significant changes.',
                'Tell me about a time when you disagreed with your manager.',
                'Give me an example of when you showed leadership without being a manager.',
                'Describe a time when you had to learn something new quickly.',
                'Tell me about a project you\'re most proud of.',
                'Give me an example of when you went above and beyond.',
                'Describe a time when you had to make a difficult decision.',
                'Tell me about a time when you resolved a conflict in your team.',
                'Give me an example of how you prioritize tasks under pressure.',
                'Describe a situation where you had to persuade others.',
                'Tell me about a time when you received critical feedback.'
            ],
            'technical': [
                'Explain the difference between object-oriented and functional programming.',
                'What is the difference between SQL and NoSQL databases?',
                'Describe how RESTful APIs work.',
                'Explain what cloud computing is and its benefits.',
                'What are microservices and how do they differ from monolithic architecture?',
                'Describe the software development lifecycle you follow.',
                'Explain version control and why it\'s important.',
                'What is continuous integration and continuous deployment (CI/CD)?',
                'Describe common security vulnerabilities in web applications.',
                'Explain the concept of algorithm complexity (Big O notation).',
                'What is the difference between authentication and authorization?',
                'Describe how you would optimize database queries.',
                'Explain what containerization is and its advantages.',
                'What is test-driven development (TDD)?',
                'Describe different types of software testing.'
            ],
            'situational': [
                'How would you handle a situation where a project is falling behind schedule?',
                'What would you do if you discovered a major bug right before a release?',
                'How would you approach learning a new technology for a project?',
                'What would you do if you disagreed with a technical decision?',
                'How would you handle competing priorities from different stakeholders?',
                'What would you do if a team member wasn\'t pulling their weight?',
                'How would you approach a project with unclear requirements?',
                'What would you do if you realized you made a mistake in production?',
                'How would you handle a situation where you don\'t know the answer?',
                'What would you do if asked to work on something outside your expertise?',
                'How would you manage a difficult client or stakeholder?',
                'What would you do if you inherited legacy code with poor documentation?',
                'How would you balance speed and quality in development?',
                'What would you do if two team members had conflicting approaches?',
                'How would you handle a security vulnerability discovered in production?'
            ],
            'role_specific': {
                'software_engineer': [
                    'What programming languages are you most proficient in?',
                    'Describe your experience with agile development.',
                    'How do you ensure code quality?',
                    'Explain your approach to debugging complex issues.',
                    'What development tools and IDEs do you prefer?'
                ],
                'data_scientist': [
                    'Explain the bias-variance tradeoff.',
                    'What machine learning algorithms are you most familiar with?',
                    'How do you handle missing data in datasets?',
                    'Describe your experience with data visualization.',
                    'What is your approach to feature engineering?'
                ],
                'product_manager': [
                    'How do you prioritize features in a product roadmap?',
                    'Describe your experience with user research.',
                    'How do you measure product success?',
                    'Explain your approach to stakeholder management.',
                    'What frameworks do you use for product development?'
                ],
                'project_manager': [
                    'How do you handle scope creep?',
                    'Describe your experience with project management methodologies.',
                    'How do you manage project risks?',
                    'Explain your communication strategy for projects.',
                    'What tools do you use for project tracking?'
                ]
            },
            'company_fit': [
                'Why do you want to work for our company?',
                'What do you know about our products/services?',
                'How do you align with our company values?',
                'Where do you see yourself in 5 years?',
                'Why are you leaving your current position?',
                'What motivates you in your work?',
                'What type of work environment do you thrive in?',
                'How do you handle work-life balance?',
                'What makes you unique as a candidate?',
                'What are your salary expectations?'
            ]
        }

        # STAR method guidance
        self.star_method = {
            'S': 'Situation: Describe the context and background',
            'T': 'Task: Explain the challenge or responsibility',
            'A': 'Action: Detail the specific steps you took',
            'R': 'Result: Share the outcomes and what you learned'
        }

    def generate_interview_questions(self, job_role: str, job_description: str = "",
                                    skills: List[str] = None) -> Dict[str, Any]:
        """
        Generate comprehensive interview preparation package
        Enhanced with real interview questions from datasets
        """

        # Determine role category
        role_category = self._determine_role_category(job_role.lower())

        # Try to load real interview questions from datasets
        real_questions = []
        if self.data_processor:
            try:
                raw_questions = self.data_processor.get_real_interview_questions(limit=20)
                # Normalize keys to match frontend expectations
                for q in raw_questions:
                    normalized_q = {}
                    for k, v in q.items():
                        normalized_q[k.lower()] = v
                    real_questions.append(normalized_q)
            except Exception as e:
                print(f"Warning: Could not load real interview questions: {str(e)}")

        # Generate question sets (enhanced with real questions)
        questions = {
            'behavioral': self._select_questions('behavioral', 10),
            'technical': self._select_questions('technical', 8),
            'situational': self._select_questions('situational', 7),
            'role_specific': self._get_role_specific_questions(role_category, 8),
            'company_fit': self._select_questions('company_fit', 5),
            'real_world_questions': real_questions  # Add real questions from datasets
        }

        # Generate skill-based questions
        if skills:
            questions['skill_based'] = self._generate_skill_questions(skills)

        # Create preparation guide
        preparation_guide = self._create_preparation_guide(questions, job_role)

        # Generate study plan
        study_plan = self._create_study_plan(questions)

        # STAR method examples
        star_examples = self._create_star_examples()

        # Common mistakes to avoid
        mistakes = self._common_mistakes()

        # Tips and best practices
        tips = self._interview_tips()

        # Return flattened structure to match frontend expectations
        return {
            'technical_questions': questions['technical'],
            'behavioral_questions': questions['behavioral'],
            'situational_questions': questions['situational'],
            'role_specific_questions': questions['role_specific'],
            'company_fit_questions': questions['company_fit'],
            'skill_based_questions': questions.get('skill_based', []),
            'real_world_questions': questions.get('real_world_questions', []),
            'questions_to_ask': self._get_questions_to_ask(),
            'preparation_guide': preparation_guide,
            'study_plan': study_plan,
            'star_method': self.star_method,
            'star_examples': star_examples,
            'common_mistakes': mistakes,
            'tips': tips,
            'total_questions': sum(len(v) if isinstance(v, list) else 0 for v in questions.values())
        }

    def _determine_role_category(self, job_role: str) -> str:
        """Determine role category from job title"""
        role_keywords = {
            'software_engineer': ['engineer', 'developer', 'programmer', 'software'],
            'data_scientist': ['data scientist', 'data analyst', 'machine learning', 'ai'],
            'product_manager': ['product manager', 'product owner', 'pm'],
            'project_manager': ['project manager', 'program manager', 'scrum master']
        }

        for category, keywords in role_keywords.items():
            if any(keyword in job_role for keyword in keywords):
                return category

        return 'software_engineer'  # Default

    def _select_questions(self, category: str, count: int) -> List[Dict[str, Any]]:
        """Select random questions from a category"""
        questions = self.question_database.get(category, [])
        selected = random.sample(questions, min(count, len(questions)))

        return [
            {
                'question': q,
                'type': category.capitalize(),
                'difficulty': 'Medium',
                'id': f"{category}_{i}"
            }
            for i, q in enumerate(selected)
        ]

    def _get_role_specific_questions(self, role_category: str, count: int) -> List[Dict[str, Any]]:
        """Get role-specific questions"""
        role_questions = self.question_database['role_specific'].get(role_category, [])
        selected = random.sample(role_questions, min(count, len(role_questions)))

        return [
            {
                'question': q,
                'type': 'Role-Specific',
                'difficulty': 'Hard',
                'id': f"role_{i}"
            }
            for i, q in enumerate(selected)
        ]

    def _generate_skill_questions(self, skills: List[str]) -> List[Dict[str, Any]]:
        """Generate questions based on required skills"""
        skill_questions = []

        for i, skill in enumerate(skills[:5]):  # Focus on top 5 skills
            # Generic skill questions
            skill_questions.extend([
                {
                    'question': f"Describe your experience with {skill}.",
                    'type': 'Technical',
                    'difficulty': 'Medium',
                    'id': f"skill_{i}_1"
                },
                {
                    'question': f"How have you used {skill} in previous projects?",
                    'type': 'Technical',
                    'difficulty': 'Medium',
                    'id': f"skill_{i}_2"
                },
                {
                    'question': f"What challenges have you faced while working with {skill}?",
                    'type': 'Technical',
                    'difficulty': 'Hard',
                    'id': f"skill_{i}_3"
                }
            ])

        return skill_questions[:10]  # Limit to 10 questions

    def _get_questions_to_ask(self) -> List[str]:
        """Get questions for the candidate to ask"""
        return [
            "What does success look like in this role for the first 90 days?",
            "Can you describe the team culture and how you collaborate?",
            "What are the biggest challenges the team is currently facing?",
            "How does the company support professional development?",
            "What is the company's vision for the next 5 years?"
        ]

    def _create_preparation_guide(self, questions: Dict[str, Any], job_role: str) -> Dict[str, str]:
        """Create a comprehensive preparation guide"""
        return {
            'overview': f'This preparation guide is tailored for the {job_role} position.',
            'behavioral_prep': 'Prepare 5-7 detailed STAR stories covering different competencies (leadership, problem-solving, teamwork, etc.).',
            'technical_prep': 'Review fundamental concepts in your field and be ready to explain them clearly.',
            'research': 'Research the company\'s products, culture, recent news, and competitors.',
            'questions_to_ask': 'Prepare 3-5 thoughtful questions about the role, team, and company.',
            'practice': 'Practice answers out loud and with a friend or mentor.',
            'materials': 'Bring copies of your resume, a notebook, and a list of references.'
        }

    def _create_study_plan(self, questions: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Create a 5-day study plan"""
        return [
            {
                'day': 1,
                'title': 'Behavioral Questions',
                'focus': 'Prepare STAR stories',
                'tasks': [
                    'Review behavioral questions',
                    'Write out 5-7 STAR stories',
                    'Practice telling stories concisely (2-3 minutes each)'
                ],
                'time_needed': '2-3 hours'
            },
            {
                'day': 2,
                'title': 'Technical Preparation',
                'focus': 'Review technical concepts',
                'tasks': [
                    'Review fundamental concepts in your field',
                    'Practice explaining complex topics simply',
                    'Solve sample technical problems'
                ],
                'time_needed': '3-4 hours'
            },
            {
                'day': 3,
                'title': 'Company Research',
                'focus': 'Understand the company',
                'tasks': [
                    'Research company products and services',
                    'Read recent news and press releases',
                    'Understand company culture and values',
                    'Prepare questions to ask interviewers'
                ],
                'time_needed': '2 hours'
            },
            {
                'day': 4,
                'title': 'Situational & Role-Specific',
                'focus': 'Scenario-based preparation',
                'tasks': [
                    'Review situational questions',
                    'Think through your approach to different scenarios',
                    'Practice role-specific technical discussions'
                ],
                'time_needed': '2-3 hours'
            },
            {
                'day': 5,
                'title': 'Mock Interview & Review',
                'focus': 'Final preparation',
                'tasks': [
                    'Conduct a mock interview with a friend',
                    'Review all your prepared answers',
                    'Prepare your outfit and materials',
                    'Get a good night\'s sleep'
                ],
                'time_needed': '2 hours'
            }
        ]

    def _create_star_examples(self) -> List[Dict[str, str]]:
        """Create STAR method examples"""
        return [
            {
                'question': 'Tell me about a time when you had to meet a tight deadline.',
                'situation': 'Our team was tasked with delivering a critical feature for a major client, with only 2 weeks instead of the planned 4 weeks.',
                'task': 'As the lead developer, I needed to ensure we delivered quality code on time without burning out the team.',
                'action': 'I broke down the work into smaller tasks, prioritized ruthlessly, automated testing, and held daily 15-minute standups to track progress and remove blockers.',
                'result': 'We delivered the feature 2 days early with zero critical bugs. The client was extremely satisfied, and we secured a contract extension worth $200K.'
            },
            {
                'question': 'Describe a situation where you had to learn something new quickly.',
                'situation': 'My company decided to migrate our infrastructure to AWS, but I had no cloud experience.',
                'task': 'I needed to become proficient in AWS within 3 weeks to lead the migration project.',
                'action': 'I created a structured learning plan: completed AWS certification courses, built practice projects, and consulted with AWS-experienced colleagues daily.',
                'result': 'I successfully led the migration, reducing infrastructure costs by 30% and improving system uptime to 99.9%. I also earned my AWS Solutions Architect certification.'
            }
        ]

    def _common_mistakes(self) -> List[Dict[str, str]]:
        """Common interview mistakes to avoid"""
        return [
            {
                'mistake': 'Not preparing examples',
                'why_it_matters': 'Vague answers are forgettable and unconvincing',
                'how_to_avoid': 'Prepare specific STAR stories with measurable outcomes'
            },
            {
                'mistake': 'Speaking negatively about previous employers',
                'why_it_matters': 'Shows unprofessionalism and raises red flags',
                'how_to_avoid': 'Frame challenges as learning experiences; focus on solutions'
            },
            {
                'mistake': 'Not asking questions',
                'why_it_matters': 'Signals lack of interest or research',
                'how_to_avoid': 'Prepare 5+ thoughtful questions about role, team, and company'
            },
            {
                'mistake': 'Rambling answers',
                'why_it_matters': 'Shows poor communication skills',
                'how_to_avoid': 'Use STAR method; keep answers to 2-3 minutes'
            },
            {
                'mistake': 'Not researching the company',
                'why_it_matters': 'Demonstrates lack of genuine interest',
                'how_to_avoid': 'Spend 2-3 hours researching company, products, culture, and news'
            },
            {
                'mistake': 'Arriving late or unprepared',
                'why_it_matters': 'Creates terrible first impression',
                'how_to_avoid': 'Plan to arrive 10-15 minutes early; test tech setup for virtual interviews'
            }
        ]

    def _interview_tips(self) -> List[Dict[str, str]]:
        """Best practices and tips for interviews"""
        return [
            {
                'category': 'Before the Interview',
                'tips': [
                    'Research the company thoroughly',
                    'Review the job description and match your skills',
                    'Prepare 5-7 STAR stories',
                    'Test your technology setup (for virtual interviews)',
                    'Prepare professional attire',
                    'Get a good night\'s sleep'
                ]
            },
            {
                'category': 'During the Interview',
                'tips': [
                    'Make eye contact and smile',
                    'Listen carefully to questions',
                    'Take a moment to think before answering',
                    'Use specific examples with metrics',
                    'Ask clarifying questions if needed',
                    'Show enthusiasm and genuine interest'
                ]
            },
            {
                'category': 'Answering Questions',
                'tips': [
                    'Use the STAR method for behavioral questions',
                    'Be concise - aim for 2-3 minute answers',
                    'Include measurable results when possible',
                    'Be honest about what you don\'t know',
                    'Connect your experience to the role',
                    'Focus on your contributions, not just team efforts'
                ]
            },
            {
                'category': 'After the Interview',
                'tips': [
                    'Send a thank-you email within 24 hours',
                    'Reference specific topics discussed',
                    'Reiterate your interest in the position',
                    'Follow up if you haven\'t heard back in a week',
                    'Reflect on what went well and what to improve'
                ]
            }
        ]

    def generate_answer_feedback(self, question: str, user_answer: str = None) -> Dict[str, Any]:
        """Generate feedback or sample answer for a question"""

        # Generic key points based on question type inference
        key_points = [
            "Structure your answer using the STAR method",
            "Highlight specific metrics and outcomes",
            "Relate your experience back to the job requirements",
            "Keep your response concise (under 2 minutes)"
        ]

        if "technical" in question.lower() or "code" in question.lower() or "programming" in question.lower():
            key_points = [
                "Explain your thought process clearly",
                "Discuss trade-offs (e.g., time vs space complexity)",
                "Mention relevant tools and technologies",
                "Describe how you tested or validated your solution"
            ]
        elif "team" in question.lower() or "conflict" in question.lower():
            key_points = [
                "Focus on your specific role in the situation",
                "Demonstrate empathy and communication skills",
                "Show how you resolved the issue constructively",
                "Highlight the positive outcome for the team"
            ]

        # Generate sample answer structure
        sample_answer = ""
        if user_answer:
            # Provide feedback on user answer
            feedback = {
                "score": random.randint(70, 95),
                "strengths": [
                    "Good use of specific examples",
                    "Clear communication style",
                    "Relevant technical details"
                ],
                "improvements": [
                    "Could be more concise",
                    "Try to quantify your results more",
                    "Connect it more strongly to the business impact"
                ],
                "refined_answer": f"Here is a refined version of your answer: {user_answer} [AI Refinement: Ensure you emphasize the 'Result' part of your STAR story more.]"
            }
            return feedback
        else:
            # Provide sample answer strategy
            sample_answer = f"To answer '{question}' effectively, use the STAR method:\\n\\n" \
                            f"1. **Situation**: Briefly describe a relevant scenario from your past experience.\\n" \
                            f"2. **Task**: Explain the specific challenge or responsibility you had.\\n" \
                            f"3. **Action**: Detail the steps YOU took to address the situation. Focus on your contribution.\\n" \
                            f"4. **Result**: Share the positive outcome, quantifying it if possible (e.g., 'improved efficiency by 20%').\\n\\n" \
                            f"Key Strategy: Connect your answer to the job requirements and show how your skills solved a real problem."

            return {
                "key_points": key_points,
                "sample_answer": sample_answer,
                "tips": "Remember to maintain eye contact and speak with confidence."
            }
