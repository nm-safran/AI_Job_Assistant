"""
Data Processor Module
Loads and processes all Kaggle datasets into memory for fast access
"""

import pandas as pd
import os
import json
from typing import Dict, List, Any, Set
from pathlib import Path

class DataProcessor:
    """
    Loads and processes all available datasets from resources folder
    Provides efficient access to real-world data for enhanced recommendations
    """

    def __init__(self, resources_path: str = None):
        """Initialize data processor and load all datasets"""
        if resources_path is None:
            # Get absolute path to resources folder
            base_dir = Path(__file__).parent.parent  # Go up to project root
            resources_path = os.path.join(base_dir, "resources")

        self.resources_path = resources_path
        self.datasets = {}
        self.load_all_datasets()

    def load_all_datasets(self):
        """Load all available datasets from resources folder"""
        print(f"Loading datasets from: {self.resources_path}")

        # Load job skills data
        self.load_job_skills_data()

        # Load resume data
        self.load_resume_data()

        # Load salary data
        self.load_salary_data()

        # Load interview questions
        self.load_interview_questions()

        # Load learning paths data (courses, projects)
        self.load_learning_paths_data()

        # Load tech skills data
        self.load_tech_skills_data()

        print(f"Successfully loaded {len(self.datasets)} dataset categories")

    def load_job_skills_data(self):
        """Load Glassdoor jobs dataset"""
        try:
            jobs_file = os.path.join(self.resources_path, "job_skills", "glassdoor_jobs.csv")
            if os.path.exists(jobs_file):
                df = pd.read_csv(jobs_file, on_bad_lines='skip')
                self.datasets['glassdoor_jobs'] = df
                print(f"✓ Loaded Glassdoor jobs: {len(df)} records")
            else:
                print(f"⚠ Glassdoor jobs file not found: {jobs_file}")
        except Exception as e:
            print(f"✗ Error loading Glassdoor jobs: {str(e)}")

    def load_resume_data(self):
        """Load resume dataset"""
        try:
            resume_file = os.path.join(self.resources_path, "resumes", "resume_dataset.csv")
            if os.path.exists(resume_file):
                df = pd.read_csv(resume_file, on_bad_lines='skip')
                self.datasets['resumes'] = df
                print(f"✓ Loaded resumes: {len(df)} records")
            else:
                print(f"⚠ Resume file not found: {resume_file}")
        except Exception as e:
            print(f"✗ Error loading resumes: {str(e)}")

    def load_salary_data(self):
        """Load salary dataset"""
        try:
            salary_file = os.path.join(self.resources_path, "salary_data", "salary_dataset.csv")
            if os.path.exists(salary_file):
                df = pd.read_csv(salary_file, on_bad_lines='skip')
                self.datasets['salary_data'] = df
                print(f"✓ Loaded salary data: {len(df)} records")
            else:
                print(f"⚠ Salary file not found: {salary_file}")
        except Exception as e:
            print(f"✗ Error loading salary data: {str(e)}")

    def load_interview_questions(self):
        """Load interview questions datasets"""
        try:
            # Load new interview questions
            ai_questions_file = os.path.join(
                self.resources_path,
                "interview_prep",
                "new_interview_questions.csv"
            )
            if os.path.exists(ai_questions_file):
                df = pd.read_csv(ai_questions_file, on_bad_lines='skip')
                self.datasets['ai_interview_questions'] = df
                print(f"✓ Loaded AI interview questions: {len(df)} records")

            # Load software questions
            software_questions_file = os.path.join(
                self.resources_path,
                "interview_prep",
                "Software Questions.csv"
            )
            if os.path.exists(software_questions_file):
                df = pd.read_csv(software_questions_file, on_bad_lines='skip')
                self.datasets['software_interview_questions'] = df
                print(f"✓ Loaded software interview questions: {len(df)} records")
        except Exception as e:
            print(f"✗ Error loading interview questions: {str(e)}")

    def load_learning_paths_data(self):
        """Load courses and project datasets"""
        try:
            # Load Coursera courses
            coursera_file = os.path.join(
                self.resources_path,
                "Skill_Gap_Analysis",
                "coursera_courses.csv"
            )
            if os.path.exists(coursera_file):
                df = pd.read_csv(coursera_file, on_bad_lines='skip')
                self.datasets['coursera_courses'] = df
                print(f"✓ Loaded Coursera courses: {len(df)} records")

            # Load Udemy courses
            udemy_file = os.path.join(
                self.resources_path,
                "Skill_Gap_Analysis",
                "udemy_courses.csv"
            )
            if os.path.exists(udemy_file):
                df = pd.read_csv(udemy_file, on_bad_lines='skip')
                self.datasets['udemy_courses'] = df
                print(f"✓ Loaded Udemy courses: {len(df)} records")

            # Load GitHub projects
            github_file = os.path.join(
                self.resources_path,
                "Skill_Gap_Analysis",
                "github_projects.csv"
            )
            if os.path.exists(github_file):
                df = pd.read_csv(github_file, on_bad_lines='skip')
                self.datasets['github_projects'] = df
                print(f"✓ Loaded GitHub projects: {len(df)} records")
        except Exception as e:
            print(f"✗ Error loading learning paths data: {str(e)}")

    def load_tech_skills_data(self):
        """Load Stack Overflow survey data"""
        try:
            stackoverflow_file = os.path.join(
                self.resources_path,
                "tech_skills",
                "stackoverflow_survey.csv"
            )
            if os.path.exists(stackoverflow_file):
                df = pd.read_csv(stackoverflow_file, on_bad_lines='skip')
                self.datasets['stackoverflow_survey'] = df
                print(f"✓ Loaded Stack Overflow survey: {len(df)} records")
            else:
                print(f"⚠ Stack Overflow file not found: {stackoverflow_file}")
        except Exception as e:
            print(f"✗ Error loading Stack Overflow data: {str(e)}")

    # ============================================
    # Methods to extract real data for features
    # ============================================

    def get_job_salary_range(self, job_title: str) -> Dict[str, Any]:
        """
        Get salary range for a job title from Glassdoor data

        Args:
            job_title: Job title to search for

        Returns:
            Dictionary with min, max, and average salary
        """
        if 'glassdoor_jobs' not in self.datasets:
            return {'error': 'Glassdoor data not loaded'}

        df = self.datasets['glassdoor_jobs']

        # Fuzzy match job titles
        matching_jobs = df[
            df['Job Title'].str.lower().str.contains(job_title.lower(), na=False)
        ]

        if len(matching_jobs) == 0:
            return {
                'status': 'no_match',
                'message': f'No jobs found for: {job_title}'
            }

        # Extract salary info
        salaries = []
        if 'avg_salary' in matching_jobs.columns:
            salaries = matching_jobs['avg_salary'].dropna().tolist()

        if not salaries:
            return {
                'status': 'no_salary_data',
                'message': 'No salary data available'
            }

        return {
            'status': 'success',
            'job_title': job_title,
            'min_salary': min(salaries),
            'max_salary': max(salaries),
            'avg_salary': sum(salaries) / len(salaries),
            'job_count': len(matching_jobs)
        }

    def get_real_interview_questions(self, category: str = None, limit: int = 10) -> List[Dict]:
        """
        Get real interview questions from datasets

        Args:
            category: Optional category filter (AI, Software, etc.)
            limit: Number of questions to return

        Returns:
            List of interview questions with answers
        """
        questions = []

        # Get AI interview questions
        if 'ai_interview_questions' in self.datasets:
            df = self.datasets['ai_interview_questions']
            if category:
                df = df[df['Category'].str.lower().str.contains(category.lower(), na=False)]
            questions.extend(df.head(limit // 2).to_dict('records'))

        # Get software interview questions
        if 'software_interview_questions' in self.datasets:
            df = self.datasets['software_interview_questions']
            if category:
                df = df[df['Category'].str.lower().str.contains(category.lower(), na=False)]
            questions.extend(df.head(limit // 2).to_dict('records'))

        return questions[:limit]

    def get_courses_for_skill(self, skill: str, limit: int = 5) -> List[Dict]:
        """
        Get real courses for a specific skill from Coursera/Udemy

        Args:
            skill: Skill name (e.g., 'Python', 'React')
            limit: Number of courses to return

        Returns:
            List of course recommendations
        """
        courses = []

        # Search in Coursera
        if 'coursera_courses' in self.datasets:
            df = self.datasets['coursera_courses']
            skill_courses = df[
                df['Course Name'].str.lower().str.contains(skill.lower(), na=False) |
                df['Skills'].str.lower().str.contains(skill.lower(), na=False)
            ]
            for _, row in skill_courses.head(limit // 2).iterrows():
                courses.append({
                    'source': 'Coursera',
                    'title': row.get('Course Name', 'N/A'),
                    'university': row.get('University', 'N/A'),
                    'difficulty': row.get('Difficulty Level', 'N/A'),
                    'rating': row.get('Course Rating', 0),
                    'url': row.get('Course URL', '#')
                })

        # Search in Udemy
        if 'udemy_courses' in self.datasets:
            df = self.datasets['udemy_courses']
            skill_courses = df[
                df['course_title'].str.lower().str.contains(skill.lower(), na=False)
            ]
            for _, row in skill_courses.head(limit // 2).iterrows():
                courses.append({
                    'source': 'Udemy',
                    'title': row.get('course_title', 'N/A'),
                    'price': row.get('price', 'Free'),
                    'subscribers': row.get('num_subscribers', 0),
                    'level': row.get('level', 'All Levels'),
                    'url': row.get('url', '#')
                })

        return courses[:limit]

    def get_project_ideas(self, skill: str, limit: int = 5) -> List[Dict]:
        """
        Get GitHub project ideas for a skill

        Args:
            skill: Skill to find projects for
            limit: Number of projects to return

        Returns:
            List of project ideas
        """
        if 'github_projects' not in self.datasets:
            return []

        df = self.datasets['github_projects']

        # Filter by language/skill
        projects = df[
            (df['language'].str.lower() == skill.lower()) |
            (df['language'].str.contains(skill, case=False, na=False))
        ].head(limit)

        result = []
        for _, row in projects.iterrows():
            result.append({
                'name': row.get('repositories', 'N/A'),
                'stars': row.get('stars_count', 0),
                'forks': row.get('forks_count', 0),
                'language': row.get('language', 'N/A'),
                'difficulty': 'High' if row.get('stars_count', 0) > 500 else 'Medium' if row.get('stars_count', 0) > 100 else 'Low'
            })

        return result

    def get_salary_by_skill(self, skill: str) -> Dict[str, Any]:
        """
        Get average salary associated with a skill

        Args:
            skill: Skill name

        Returns:
            Salary information for the skill
        """
        if 'salary_data' not in self.datasets:
            return {'status': 'no_data'}

        df = self.datasets['salary_data']

        # Check if skill column exists (depends on dataset structure)
        skill_lower = skill.lower()

        # Try multiple possible column names
        skill_columns = [col for col in df.columns if skill_lower in col.lower()]

        if not skill_columns:
            return {'status': 'skill_not_found', 'skill': skill}

        # Get average salary where skill is 1 or True
        matching = df[df[skill_columns[0]] > 0] if len(skill_columns) > 0 else None

        if matching is None or len(matching) == 0:
            return {'status': 'no_matches'}

        avg_salary = matching['Avg Salary(K)'].mean() if 'Avg Salary(K)' in matching.columns else 0

        return {
            'status': 'success',
            'skill': skill,
            'avg_salary_k': round(avg_salary, 2),
            'job_count': len(matching),
            'salary_range': {
                'min': matching['Lower Salary'].min() if 'Lower Salary' in matching.columns else 0,
                'max': matching['Upper Salary'].max() if 'Upper Salary' in matching.columns else 0
            }
        }

    def get_dataset_summary(self) -> Dict[str, Any]:
        """Get summary of loaded datasets"""
        summary = {
            'total_datasets': len(self.datasets),
            'datasets': {}
        }

        for name, df in self.datasets.items():
            summary['datasets'][name] = {
                'records': len(df),
                'columns': len(df.columns),
                'column_names': df.columns.tolist()
            }

        return summary


# Initialize global instance for use across the app
_data_processor = None

def get_data_processor(resources_path: str = None) -> DataProcessor:
    """Get or create the global DataProcessor instance"""
    global _data_processor
    if _data_processor is None:
        _data_processor = DataProcessor(resources_path)
    return _data_processor


if __name__ == "__main__":
    # Test the data processor
    processor = DataProcessor()
    print("\n" + "="*50)
    print("Dataset Summary:")
    print("="*50)
    summary = processor.get_dataset_summary()
    print(json.dumps(summary, indent=2))

    print("\n" + "="*50)
    print("Example: Get courses for Python")
    print("="*50)
    courses = processor.get_courses_for_skill("Python", limit=3)
    for course in courses:
        print(json.dumps(course, indent=2))

    print("\n" + "="*50)
    print("Example: Get interview questions")
    print("="*50)
    questions = processor.get_real_interview_questions(limit=3)
    for q in questions:
        print(json.dumps(q, indent=2, default=str))
