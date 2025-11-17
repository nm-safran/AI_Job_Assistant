import json
import random
from datetime import datetime
from datasets.skills_dataset import SkillsDataset

class AIRecommendationEngine:
    def __init__(self):
        self.skills_dataset = SkillsDataset()
        self.skill_resources = {
            'python': {
                'courses': ['Python for Everybody', 'Advanced Python Programming'],
                'projects': ['Build a web scraper', 'Create a data analysis tool'],
                'practice': ['LeetCode Python problems', 'HackerRank Python challenges']
            },
            'javascript': {
                'courses': ['JavaScript Modern ES6+', 'Complete JavaScript Course'],
                'projects': ['Build a weather app', 'Create a todo application'],
                'practice': ['JavaScript30 challenges', 'Frontend Mentor projects']
            },
            'react': {
                'courses': ['React - The Complete Guide', 'Advanced React Patterns'],
                'projects': ['E-commerce site', 'Social media dashboard'],
                'practice': ['Build reusable components', 'State management practice']
            },
            'machine learning': {
                'courses': ['Machine Learning A-Z', 'Deep Learning Specialization'],
                'projects': ['Predict housing prices', 'Image classification'],
                'practice': ['Kaggle competitions', 'TensorFlow tutorials']
            },
            'aws': {
                'courses': ['AWS Certified Solutions Architect', 'AWS Cloud Practitioner'],
                'projects': ['Deploy a static website', 'Create serverless API'],
                'practice': ['AWS Free Tier exercises', 'Build three-tier architecture']
            },
            'docker': {
                'courses': ['Docker Mastery', 'Kubernetes Fundamentals'],
                'projects': ['Containerize a web app', 'Multi-container application'],
                'practice': ['Dockerize existing projects', 'Learn Docker Compose']
            },
            'sql': {
                'courses': ['SQL for Data Science', 'Advanced SQL Queries'],
                'projects': ['Database design', 'Query optimization'],
                'practice': ['SQL practice problems', 'Database normalization']
            }
        }

        self.interview_questions_db = {
            'python': [
                "What are Python decorators and how do you use them?",
                "Explain the difference between list and tuple",
                "How does garbage collection work in Python?",
                "What are Python generators and when would you use them?"
            ],
            'javascript': [
                "Explain event bubbling in JavaScript",
                "What is the difference between let, const, and var?",
                "How do promises work in JavaScript?",
                "What is async/await and how does it work?"
            ],
            'react': [
                "What is Virtual DOM and how does it work?",
                "Explain React component lifecycle methods",
                "What are React hooks and why were they introduced?",
                "How do you optimize React application performance?"
            ],
            'machine learning': [
                "Explain the bias-variance tradeoff",
                "What is cross-validation and why is it important?",
                "How do you handle overfitting in machine learning models?",
                "Explain the difference between supervised and unsupervised learning"
            ],
            'aws': [
                "Explain the difference between EC2 and Lambda",
                "What is Auto Scaling and how does it work?",
                "How do you secure AWS resources?",
                "Explain VPC and its components"
            ]
        }

    def get_skill_recommendations(self, missing_skills, current_skills):
        recommendations = []

        for skill in missing_skills[:3]:  # Top 3 missing skills
            skill_lower = skill.lower()
            if skill_lower in self.skill_resources:
                resources = self.skill_resources[skill_lower]
                recommendations.append({
                    'skill': skill,
                    'level': 'Beginner to Advanced',
                    'courses': resources['courses'],
                    'projects': resources['projects'],
                    'practice': resources['practice'],
                    'timeline': '4-6 weeks to proficiency',
                    'priority': 'High' if skill_lower in ['python', 'javascript', 'react', 'aws'] else 'Medium'
                })
            else:
                # Generic recommendations for skills not in our database
                recommendations.append({
                    'skill': skill,
                    'level': 'Beginner to Advanced',
                    'courses': [f'Comprehensive {skill} Course', f'Advanced {skill} Techniques'],
                    'projects': [f'Build a project using {skill}', f'Implement {skill} in real scenario'],
                    'practice': [f'Practice {skill} concepts', f'{skill} coding challenges'],
                    'timeline': '4-8 weeks to proficiency',
                    'priority': 'Medium'
                })

        return recommendations

    def generate_personalized_questions(self, resume_skills, job_skills):
        questions = []

        # Add general behavioral questions
        general_questions = [
            "Tell me about a challenging project you worked on and how you overcame obstacles.",
            "Describe a time you had to learn a new technology quickly for a project.",
            "How do you handle disagreements with team members?",
            "Where do you see yourself in 5 years?",
            "What is your approach to problem-solving?",
            "Describe your experience with agile development methodologies.",
            "How do you stay updated with the latest technologies?",
            "Tell me about a time you failed and what you learned from it."
        ]
        questions.extend(general_questions)

        # Add skill-specific questions
        for skill in resume_skills:
            skill_lower = skill.lower()
            if skill_lower in self.interview_questions_db:
                questions.extend(self.interview_questions_db[skill_lower][:2])

        # Add job-specific questions for missing skills
        for skill in job_skills:
            skill_lower = skill.lower()
            if skill_lower not in [s.lower() for s in resume_skills] and skill_lower in self.interview_questions_db:
                questions.append(f"How would you approach learning {skill} quickly?")

        return questions[:10]  # Return top 10 questions

    def calculate_improvement_plan(self, missing_skills, timeframe='30 days'):
        plan = {
            'timeline': timeframe,
            'weekly_goals': [],
            'resources_needed': [],
            'expected_outcome': f"Gain proficiency in {len(missing_skills)} key skills",
            'priority_skills': [],
            'success_metrics': []
        }

        if missing_skills:
            # Identify priority skills
            high_priority = ['python', 'javascript', 'react', 'aws', 'docker', 'machine learning']
            plan['priority_skills'] = [skill for skill in missing_skills if any(hp in skill.lower() for hp in high_priority)]

            # Create weekly goals
            if len(missing_skills) >= 2:
                plan['weekly_goals'] = [
                    f"Week 1: Focus on {missing_skills[0]} fundamentals and complete beginner projects",
                    f"Week 2: Deep dive into {missing_skills[0]} advanced concepts and start portfolio project",
                    f"Week 3: Begin learning {missing_skills[1]} and integrate with existing knowledge",
                    f"Week 4: Complete portfolio projects and practice interview questions"
                ]
            else:
                plan['weekly_goals'] = [
                    f"Week 1-2: Master {missing_skills[0]} fundamentals and syntax",
                    f"Week 3: Build practical projects using {missing_skills[0]}",
                    f"Week 4: Advanced concepts and optimization techniques"
                ]

            # Recommend resources
            for skill in missing_skills[:2]:
                if skill.lower() in self.skill_resources:
                    plan['resources_needed'].extend(self.skill_resources[skill.lower()]['courses'][:1])

            # Success metrics
            plan['success_metrics'] = [
                "Complete at least 2 projects demonstrating new skills",
                "Score 80%+ on skill assessment tests",
                "Confidently answer technical interview questions",
                "Update resume with newly acquired skills"
            ]

        return plan

    def get_missing_sections_suggestions(self, existing_sections):
        all_sections = ['Experience', 'Education', 'Skills', 'Projects', 'Certifications', 'Summary']
        missing_sections = [section for section in all_sections if section not in existing_sections]

        suggestions = []
        for section in missing_sections:
            if section == 'Summary':
                suggestions.append("Add a professional summary to highlight your key achievements")
            elif section == 'Projects':
                suggestions.append("Include a projects section to showcase your practical experience")
            elif section == 'Certifications':
                suggestions.append("Add certifications to demonstrate specialized knowledge")

        return suggestions
