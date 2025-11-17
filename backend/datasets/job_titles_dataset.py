class JobTitlesDataset:
    def __init__(self):
        self.job_titles = {
            'software_development': [
                'Software Engineer', 'Full Stack Developer', 'Frontend Developer',
                'Backend Developer', 'DevOps Engineer', 'Mobile Developer',
                'Software Architect', 'Technical Lead', 'Principal Engineer'
            ],
            'data_science': [
                'Data Scientist', 'Machine Learning Engineer', 'Data Analyst',
                'Business Intelligence Analyst', 'Data Engineer', 'AI Specialist'
            ],
            'cloud_engineering': [
                'Cloud Engineer', 'AWS Solutions Architect', 'DevOps Engineer',
                'Site Reliability Engineer', 'Cloud Security Engineer'
            ],
            'management': [
                'Engineering Manager', 'Technical Project Manager', 'CTO',
                'VP of Engineering', 'Product Manager'
            ]
        }

    def get_job_titles_by_category(self, category):
        return self.job_titles.get(category, [])

    def suggest_job_titles(self, skills):
        """Suggest job titles based on skills"""
        suggestions = []

        if any(skill in ['python', 'java', 'javascript'] for skill in skills):
            suggestions.extend(['Software Engineer', 'Full Stack Developer'])

        if any(skill in ['machine learning', 'data analysis', 'python'] for skill in skills):
            suggestions.extend(['Data Scientist', 'Machine Learning Engineer'])

        if any(skill in ['aws', 'azure', 'docker', 'kubernetes'] for skill in skills):
            suggestions.extend(['Cloud Engineer', 'DevOps Engineer'])

        return list(set(suggestions))
