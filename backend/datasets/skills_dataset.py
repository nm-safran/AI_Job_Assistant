import json
import os

class SkillsDataset:
    def __init__(self):
        self.skills_data = self._load_skills_data()

    def _load_skills_data(self):
        """Load comprehensive skills dataset"""
        skills_data = {
            'programming_languages': {
                'Python': {'level': 'Advanced', 'category': 'Backend', 'demand': 'High'},
                'JavaScript': {'level': 'Intermediate', 'category': 'Frontend', 'demand': 'High'},
                'Java': {'level': 'Advanced', 'category': 'Enterprise', 'demand': 'High'},
                'TypeScript': {'level': 'Intermediate', 'category': 'Frontend', 'demand': 'High'},
                'C++': {'level': 'Advanced', 'category': 'Systems', 'demand': 'Medium'},
                'C#': {'level': 'Intermediate', 'category': 'Enterprise', 'demand': 'Medium'},
                'Go': {'level': 'Beginner', 'category': 'Backend', 'demand': 'High'},
                'Rust': {'level': 'Intermediate', 'category': 'Systems', 'demand': 'Medium'},
                'Swift': {'level': 'Intermediate', 'category': 'Mobile', 'demand': 'Medium'},
                'Kotlin': {'level': 'Intermediate', 'category': 'Mobile', 'demand': 'Medium'},
                'PHP': {'level': 'Intermediate', 'category': 'Web', 'demand': 'Medium'},
                'Ruby': {'level': 'Intermediate', 'category': 'Web', 'demand': 'Low'}
            },
            'frameworks': {
                'React': {'category': 'Frontend', 'prerequisites': ['JavaScript'], 'demand': 'High'},
                'Angular': {'category': 'Frontend', 'prerequisites': ['TypeScript'], 'demand': 'Medium'},
                'Vue': {'category': 'Frontend', 'prerequisites': ['JavaScript'], 'demand': 'Medium'},
                'Django': {'category': 'Backend', 'prerequisites': ['Python'], 'demand': 'High'},
                'Flask': {'category': 'Backend', 'prerequisites': ['Python'], 'demand': 'High'},
                'Spring Boot': {'category': 'Backend', 'prerequisites': ['Java'], 'demand': 'High'},
                'Express': {'category': 'Backend', 'prerequisites': ['JavaScript'], 'demand': 'High'},
                'Laravel': {'category': 'Backend', 'prerequisites': ['PHP'], 'demand': 'Medium'},
                'TensorFlow': {'category': 'AI/ML', 'prerequisites': ['Python'], 'demand': 'High'},
                'PyTorch': {'category': 'AI/ML', 'prerequisites': ['Python'], 'demand': 'High'}
            },
            'databases': {
                'MySQL': {'type': 'Relational', 'demand': 'High'},
                'PostgreSQL': {'type': 'Relational', 'demand': 'High'},
                'MongoDB': {'type': 'NoSQL', 'demand': 'High'},
                'Redis': {'type': 'Cache', 'demand': 'High'},
                'SQLite': {'type': 'Embedded', 'demand': 'Medium'},
                'Oracle': {'type': 'Relational', 'demand': 'Medium'},
                'Cassandra': {'type': 'NoSQL', 'demand': 'Low'},
                'Elasticsearch': {'type': 'Search', 'demand': 'Medium'}
            },
            'cloud_technologies': {
                'AWS': {'category': 'Cloud', 'demand': 'High'},
                'Azure': {'category': 'Cloud', 'demand': 'High'},
                'Google Cloud': {'category': 'Cloud', 'demand': 'High'},
                'Docker': {'category': 'Containerization', 'demand': 'High'},
                'Kubernetes': {'category': 'Orchestration', 'demand': 'High'},
                'Terraform': {'category': 'Infrastructure as Code', 'demand': 'High'},
                'Jenkins': {'category': 'CI/CD', 'demand': 'Medium'},
                'Ansible': {'category': 'Configuration Management', 'demand': 'Medium'}
            },
            'soft_skills': {
                'Communication': {'importance': 'Critical', 'category': 'Interpersonal'},
                'Teamwork': {'importance': 'Critical', 'category': 'Collaboration'},
                'Problem Solving': {'importance': 'Critical', 'category': 'Analytical'},
                'Leadership': {'importance': 'High', 'category': 'Management'},
                'Time Management': {'importance': 'High', 'category': 'Productivity'},
                'Adaptability': {'importance': 'High', 'category': 'Flexibility'},
                'Creativity': {'importance': 'Medium', 'category': 'Innovation'},
                'Critical Thinking': {'importance': 'High', 'category': 'Analytical'}
            }
        }
        return skills_data

    def get_skill_info(self, skill_name):
        """Get detailed information about a specific skill"""
        for category, skills in self.skills_data.items():
            if skill_name in skills:
                return {
                    'skill': skill_name,
                    'category': category,
                    'details': skills[skill_name]
                }
        return None

    def get_learning_resources(self, skill_name):
        """Get learning resources for a skill"""
        resources = {
            'Python': {
                'courses': ['Python for Everybody (Coursera)', 'Automate the Boring Stuff with Python'],
                'projects': ['Build a web scraper', 'Create a data analysis tool', 'Develop a Flask web app'],
                'practice': ['LeetCode Python problems', 'HackerRank Python challenges', 'Codewars katas']
            },
            'React': {
                'courses': ['React - The Complete Guide (Udemy)', 'Fullstack Open'],
                'projects': ['Build a todo app', 'Create a weather dashboard', 'Develop an e-commerce site'],
                'practice': ['Build reusable components', 'State management with Redux', 'React hooks practice']
            },
            'AWS': {
                'courses': ['AWS Certified Solutions Architect', 'AWS Cloud Practitioner Essentials'],
                'projects': ['Deploy a static website on S3', 'Create a serverless API with Lambda'],
                'practice': ['AWS Free Tier exercises', 'Build a three-tier architecture']
            },
            'JavaScript': {
                'courses': ['JavaScript Modern ES6+', 'Complete JavaScript Course'],
                'projects': ['Build a weather app', 'Create a todo application'],
                'practice': ['JavaScript30 challenges', 'Frontend Mentor projects']
            },
            'Machine Learning': {
                'courses': ['Machine Learning A-Z', 'Deep Learning Specialization'],
                'projects': ['Predict housing prices', 'Image classification'],
                'practice': ['Kaggle competitions', 'TensorFlow tutorials']
            }
        }

        return resources.get(skill_name, {
            'courses': [f'Online course for {skill_name}'],
            'projects': [f'Build a project using {skill_name}'],
            'practice': [f'Practice {skill_name} concepts']
        })

    def get_related_skills(self, skill_name):
        """Get skills that are commonly used together"""
        related_map = {
            'Python': ['Django', 'Flask', 'Pandas', 'NumPy', 'Machine Learning'],
            'JavaScript': ['React', 'Node.js', 'Express', 'TypeScript'],
            'React': ['JavaScript', 'HTML', 'CSS', 'Redux', 'TypeScript'],
            'AWS': ['Docker', 'Kubernetes', 'Terraform', 'Linux'],
            'Docker': ['Kubernetes', 'AWS', 'CI/CD', 'Linux'],
            'Machine Learning': ['Python', 'TensorFlow', 'PyTorch', 'Data Analysis']
        }

        return related_map.get(skill_name, [])
