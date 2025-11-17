from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import json
import os

db = SQLAlchemy()

class UserSession(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    session_id = db.Column(db.String(100), unique=True, nullable=False)
    user_id = db.Column(db.String(100), nullable=False, default='anonymous')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Resume Data (Stored as JSON strings)
    resume_text = db.Column(db.Text)
    resume_skills = db.Column(db.Text)
    resume_experience = db.Column(db.Text)
    resume_education = db.Column(db.Text)
    resume_personal_info = db.Column(db.Text)
    resume_sections = db.Column(db.Text)
    resume_entities = db.Column(db.Text)
    resume_file_name = db.Column(db.String(255))

    # Job Data
    job_description = db.Column(db.Text)
    job_skills = db.Column(db.Text)
    job_experience_level = db.Column(db.String(100))
    job_analysis = db.Column(db.Text)  # Full job analysis JSON

    # Analysis Results
    match_score = db.Column(db.Integer)
    matching_skills = db.Column(db.Text)
    missing_skills = db.Column(db.Text)
    ai_recommendations = db.Column(db.Text)
    improvement_plan = db.Column(db.Text)

    # Cover Letters (Store multiple versions)
    cover_letters = db.Column(db.Text)  # JSON of different tone cover letters

    def to_dict(self):
        return {
            'id': self.id,
            'session_id': self.session_id,
            'user_id': self.user_id,
            'created_at': self.created_at.isoformat(),
            'resume_data': {
                'file_name': self.resume_file_name,
                'skills': json.loads(self.resume_skills) if self.resume_skills else [],
                'experience': json.loads(self.resume_experience) if self.resume_experience else {},
                'education': json.loads(self.resume_education) if self.resume_education else [],
                'personal_info': json.loads(self.resume_personal_info) if self.resume_personal_info else {},
                'sections': json.loads(self.resume_sections) if self.resume_sections else [],
                'entities': json.loads(self.resume_entities) if self.resume_entities else {}
            },
            'job_data': {
                'description': self.job_description,
                'skills': json.loads(self.job_skills) if self.job_skills else [],
                'experience_level': self.job_experience_level,
                'full_analysis': json.loads(self.job_analysis) if self.job_analysis else {}
            },
            'analysis_results': {
                'match_score': self.match_score,
                'matching_skills': json.loads(self.matching_skills) if self.matching_skills else [],
                'missing_skills': json.loads(self.missing_skills) if self.missing_skills else [],
                'ai_recommendations': json.loads(self.ai_recommendations) if self.ai_recommendations else [],
                'improvement_plan': json.loads(self.improvement_plan) if self.improvement_plan else {}
            },
            'cover_letters': json.loads(self.cover_letters) if self.cover_letters else {}
        }

def init_db(app):
    # Ensure the instance folder exists (use absolute path to avoid relative path issues)
    base_dir = os.path.abspath(os.path.dirname(__file__))
    instance_dir = os.path.join(base_dir, 'instance')
    os.makedirs(instance_dir, exist_ok=True)

    # Configure SQLite database using absolute path
    db_path = os.path.join(instance_dir, 'job_assistant.db')
    # Use forward slashes in the URI to be safe across platforms
    db_path_unix = db_path.replace('\\', '/')
    db_uri = 'sqlite:///' + db_path_unix
    app.config['SQLALCHEMY_DATABASE_URI'] = db_uri
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SQLALCHEMY_ECHO'] = True  # For debugging SQL queries

    db.init_app(app)

    with app.app_context():
        try:
            db.create_all()
            print("✅ Database tables created successfully!")
        except Exception as e:
            print(f"❌ Database error: {e}")
