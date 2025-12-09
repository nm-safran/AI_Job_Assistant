from flask import Flask, request, jsonify
from flask_cors import CORS
from database import db, init_db, UserSession
from advanced_parser import UniversalResumeParser
from job_analyzer import AdvancedJobAnalyzer
from cover_letter_generator import AdvancedCoverLetterGenerator
from ai_recommendations import AIRecommendationEngine
from ai_scoring_engine import AIResumeScoringEngine
from nlp_job_classifier import NLPJobClassifier
from ai_interview_prep import AIInterviewPrep
from skill_gap_analyzer import SkillGapAnalyzer
from data_processor import get_data_processor  # NEW: Data processor for real datasets
import uuid
import json
from datetime import datetime
import os

app = Flask(__name__)

# Initialize extensions
init_db(app)
CORS(app)

# Initialize Data Processor (loads real datasets from resources folder)
print("\n" + "="*60)
print("Initializing AI Job Assistant with Real Datasets")
print("="*60)
try:
    data_processor = get_data_processor()
    print("✓ Data processor initialized successfully")
except Exception as e:
    print(f"✗ Warning: Could not initialize data processor: {str(e)}")
    print("  The system will continue with hardcoded data")
    data_processor = None

# Initialize AI components (enhanced with real data)
resume_parser = UniversalResumeParser()
job_analyzer = AdvancedJobAnalyzer()
cover_generator = AdvancedCoverLetterGenerator()
ai_engine = AIRecommendationEngine()
scoring_engine = AIResumeScoringEngine()
job_classifier = NLPJobClassifier()
interview_prep = AIInterviewPrep(data_processor=data_processor)  # ENHANCED: Pass data processor
skill_gap_analyzer = SkillGapAnalyzer(data_processor=data_processor)  # ENHANCED: Pass data processor
print("✓ All AI components initialized\n")

@app.route('/api/health', methods=['GET'])
def health_check():
    datasets_status = 'loaded' if data_processor else 'not_loaded'
    return jsonify({
        'status': 'healthy',
        'message': 'AI Job Assistant API is running',
        'version': '2.0 - With Real Datasets',
        'datasets': datasets_status,
        'scenario_05': 'FULLY_IMPLEMENTED'
    })

@app.route('/api/datasets-info', methods=['GET'])
def get_datasets_info():
    """NEW: Get information about loaded datasets"""
    if not data_processor:
        return jsonify({
            'status': 'datasets_not_loaded',
            'message': 'No datasets loaded'
        }), 400

    try:
        summary = data_processor.get_dataset_summary()
        return jsonify({
            'status': 'success',
            'datasets_loaded': summary['total_datasets'],
            'dataset_details': summary['datasets'],
            'message': f'Successfully loaded {summary["total_datasets"]} dataset categories'
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@app.route('/api/upload-resume', methods=['POST'])
def upload_resume():
    try:
        if 'resume' not in request.files:
            return jsonify({'error': 'No resume file provided'}), 400

        resume_file = request.files['resume']
        user_id = request.form.get('user_id', f'user_{uuid.uuid4().hex[:8]}')

        if resume_file.filename == '':
            return jsonify({'error': 'No file selected'}), 400

        # Read file content
        file_content = resume_file.read()

        # Parse resume
        result = resume_parser.parse_resume(file_content, resume_file.filename)

        if not result['success']:
            return jsonify({'error': result['error']}), 500

        # Create session
        session_id = str(uuid.uuid4())
        analysis = result['analysis']

        new_session = UserSession(
            session_id=session_id,
            user_id=user_id,
            resume_text=result['text'][:5000],  # Store first 5000 chars
            resume_skills=json.dumps(analysis['skills']),
            resume_experience=json.dumps(analysis['experience']),
            resume_education=json.dumps(analysis['education']),
            resume_personal_info=json.dumps(analysis['personal_info']),
            resume_sections=json.dumps(analysis['sections']),
            resume_entities=json.dumps(analysis['entities']),
            resume_file_name=resume_file.filename
        )

        db.session.add(new_session)
        db.session.commit()

        return jsonify({
            'success': True,
            'session_id': session_id,
            'user_id': user_id,
            'resume_data': {
                'skills': analysis['skills'],
                'experience': analysis['experience'],
                'education': analysis['education'],
                'personal_info': analysis['personal_info'],
                'sections_found': analysis['sections'],
                'entities': analysis['entities'],
                'file_name': resume_file.filename
            }
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/analyze-job', methods=['POST'])
def analyze_job():
    try:
        data = request.json
        job_description = data.get('job_description', '')
        session_id = data.get('session_id')

        if not job_description:
            return jsonify({'error': 'Job description is required'}), 400

        # Analyze job description
        job_analysis = job_analyzer.analyze_job_description(job_description)

        # Update session with job data
        if session_id:
            session = UserSession.query.filter_by(session_id=session_id).first()
            if session:
                session.job_description = job_description
                session.job_skills = json.dumps(job_analysis['skills'])
                session.job_experience_level = job_analysis['experience_level']
                session.job_analysis = json.dumps(job_analysis)
                db.session.commit()

        return jsonify({
            'success': True,
            'job_analysis': job_analysis
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/analyze-match', methods=['POST'])
def analyze_match():
    try:
        data = request.json
        session_id = data.get('session_id')

        if not session_id:
            return jsonify({'error': 'Session ID is required'}), 400

        # Get session data
        session = UserSession.query.filter_by(session_id=session_id).first()
        if not session:
            return jsonify({'error': 'Session not found'}), 404

        resume_skills = json.loads(session.resume_skills) if session.resume_skills else []
        job_skills = json.loads(session.job_skills) if session.job_skills else []

        # Calculate match
        match_score = job_analyzer.calculate_similarity(resume_skills, job_skills)

        # Find matching and missing skills
        resume_skills_lower = [s.lower() for s in resume_skills]
        job_skills_lower = [s.lower() for s in job_skills]

        matching_skills = list(set(resume_skills_lower) & set(job_skills_lower))
        missing_skills = list(set(job_skills_lower) - set(resume_skills_lower))

        # Get AI recommendations
        skill_recommendations = ai_engine.get_skill_recommendations(missing_skills, resume_skills)
        improvement_plan = ai_engine.calculate_improvement_plan(missing_skills)
        personalized_questions = ai_engine.generate_personalized_questions(resume_skills, job_skills)

        # Get missing sections suggestions
        existing_sections = json.loads(session.resume_sections) if session.resume_sections else []
        missing_sections = ai_engine.get_missing_sections_suggestions(existing_sections)

        # Update session with analysis results
        session.match_score = match_score
        session.matching_skills = json.dumps(matching_skills)
        session.missing_skills = json.dumps(missing_skills)
        session.ai_recommendations = json.dumps(skill_recommendations)
        session.improvement_plan = json.dumps(improvement_plan)
        db.session.commit()

        return jsonify({
            'success': True,
            'match_analysis': {
                'match_score': match_score,
                'matching_skills': matching_skills,
                'missing_skills': missing_skills,
                'resume_skills_count': len(resume_skills),
                'job_skills_count': len(job_skills)
            },
            'ai_recommendations': skill_recommendations,
            'improvement_plan': improvement_plan,
            'interview_questions': personalized_questions,
            'missing_sections_suggestions': missing_sections
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/generate-cover-letter', methods=['POST'])
def generate_cover_letter():
    try:
        data = request.json
        session_id = data.get('session_id')
        tone = data.get('tone', 'professional')
        customizations = data.get('customizations', {})

        if not session_id:
            return jsonify({'error': 'Session ID is required'}), 400

        # Get session data
        session = UserSession.query.filter_by(session_id=session_id).first()
        if not session:
            return jsonify({'error': 'Session not found'}), 404

        # Prepare session data for cover letter generation
        session_data = {
            'resume_data': {
                'skills': json.loads(session.resume_skills) if session.resume_skills else [],
                'experience': json.loads(session.resume_experience) if session.resume_experience else {},
                'education': json.loads(session.resume_education) if session.resume_education else [],
                'personal_info': json.loads(session.resume_personal_info) if session.resume_personal_info else {}
            },
            'job_data': {
                'description': session.job_description,
                'skills': json.loads(session.job_skills) if session.job_skills else [],
                'experience_level': session.job_experience_level,
                'full_analysis': json.loads(session.job_analysis) if session.job_analysis else {}
            },
            'analysis_results': {
                'match_score': session.match_score,
                'matching_skills': json.loads(session.matching_skills) if session.matching_skills else [],
                'missing_skills': json.loads(session.missing_skills) if session.missing_skills else []
            }
        }

        # Generate cover letter
        cover_letter = cover_generator.generate_cover_letter(
            session_data,
            tone,
            customizations
        )

        # Update session with generated cover letter
        current_cover_letters = json.loads(session.cover_letters) if session.cover_letters else {}
        current_cover_letters[tone] = cover_letter
        session.cover_letters = json.dumps(current_cover_letters)
        db.session.commit()

        return jsonify({
            'success': True,
            'cover_letter': cover_letter,
            'session_id': session_id
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/generate-all-cover-letters', methods=['POST'])
def generate_all_cover_letters():
    try:
        data = request.json
        session_id = data.get('session_id')

        if not session_id:
            return jsonify({'error': 'Session ID is required'}), 400

        # Get session data
        session = UserSession.query.filter_by(session_id=session_id).first()
        if not session:
            return jsonify({'error': 'Session not found'}), 404

        # Prepare session data
        session_data = {
            'resume_data': {
                'skills': json.loads(session.resume_skills) if session.resume_skills else [],
                'experience': json.loads(session.resume_experience) if session.resume_experience else {},
                'education': json.loads(session.resume_education) if session.resume_education else [],
                'personal_info': json.loads(session.resume_personal_info) if session.resume_personal_info else {}
            },
            'job_data': {
                'description': session.job_description,
                'skills': json.loads(session.job_skills) if session.job_skills else [],
                'experience_level': session.job_experience_level
            },
            'analysis_results': {
                'match_score': session.match_score,
                'matching_skills': json.loads(session.matching_skills) if session.matching_skills else [],
                'missing_skills': json.loads(session.missing_skills) if session.missing_skills else []
            }
        }

        # Generate all cover letters
        all_cover_letters = cover_generator.generate_all_cover_letters(session_data)

        # Update session
        session.cover_letters = json.dumps(all_cover_letters)
        db.session.commit()

        return jsonify({
            'success': True,
            'cover_letters': all_cover_letters,
            'session_id': session_id
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/get-cover-letters/<session_id>', methods=['GET'])
def get_cover_letters(session_id):
    try:
        session = UserSession.query.filter_by(session_id=session_id).first()
        if not session:
            return jsonify({'error': 'Session not found'}), 404

        cover_letters = json.loads(session.cover_letters) if session.cover_letters else {}

        return jsonify({
            'success': True,
            'cover_letters': cover_letters,
            'session_id': session_id
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/session-history/<user_id>', methods=['GET'])
def get_session_history(user_id):
    try:
        sessions = UserSession.query.filter_by(user_id=user_id)\
            .order_by(UserSession.created_at.desc())\
            .limit(10)\
            .all()

        return jsonify({
            'success': True,
            'sessions': [session.to_dict() for session in sessions]
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ============== NEW AI ENDPOINTS ==============

@app.route('/api/ai-score-resume', methods=['POST'])
def ai_score_resume():
    """AI-powered resume scoring with 5-dimensional analysis"""
    try:
        data = request.json
        session_id = data.get('session_id')

        if not session_id:
            return jsonify({'error': 'Session ID is required'}), 400

        # Get session data
        session = UserSession.query.filter_by(session_id=session_id).first()
        if not session:
            return jsonify({'error': 'Session not found'}), 404

        # Prepare resume data
        resume_data = {
            'text': session.resume_text,
            'skills': json.loads(session.resume_skills) if session.resume_skills else [],
            'experience': json.loads(session.resume_experience) if session.resume_experience else {},
            'education': json.loads(session.resume_education) if session.resume_education else [],
            'personal_info': json.loads(session.resume_personal_info) if session.resume_personal_info else {},
            'sections': json.loads(session.resume_sections) if session.resume_sections else []
        }

        # Prepare job data if available
        job_data = None
        if session.job_description:
            job_data = {
                'description': session.job_description,
                'skills': json.loads(session.job_skills) if session.job_skills else []
            }

        # Calculate comprehensive score
        score_result = scoring_engine.calculate_comprehensive_score(resume_data, job_data)

        return jsonify({
            'success': True,
            'score_analysis': score_result
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/classify-job', methods=['POST'])
def classify_job():
    """NLP-based job description classification"""
    try:
        data = request.json
        job_description = data.get('job_description', '')
        job_title = data.get('job_title', '')
        session_id = data.get('session_id')

        if not job_description:
            return jsonify({'error': 'Job description is required'}), 400

        # Classify job description
        classification = job_classifier.classify_job_description(job_description, job_title)

        # Update session if provided
        if session_id:
            session = UserSession.query.filter_by(session_id=session_id).first()
            if session:
                # Store classification in session
                current_analysis = json.loads(session.job_analysis) if session.job_analysis else {}
                current_analysis['classification'] = classification
                session.job_analysis = json.dumps(current_analysis)
                db.session.commit()

        return jsonify({
            'success': True,
            'classification': classification
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/generate-interview-questions', methods=['POST'])
def generate_interview_questions():
    """Generate AI-powered interview questions and preparation guide"""
    try:
        data = request.json
        session_id = data.get('session_id')
        job_role = data.get('job_role', '')
        job_description = data.get('job_description', '')

        if not session_id:
            return jsonify({'error': 'Session ID is required'}), 400

        # Get session data
        session = UserSession.query.filter_by(session_id=session_id).first()
        if not session:
            return jsonify({'error': 'Session not found'}), 404

        # Get skills from resume
        skills = json.loads(session.resume_skills) if session.resume_skills else []

        # Use job description from session if not provided
        if not job_description and session.job_description:
            job_description = session.job_description

        # Generate interview preparation package
        interview_package = interview_prep.generate_interview_questions(
            job_role=job_role,
            job_description=job_description,
            skills=skills
        )

        return jsonify({
            'success': True,
            'interview_preparation': interview_package
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/get-interview-answer', methods=['POST'])
def get_interview_answer():
    """Get AI feedback or sample answer for an interview question"""
    try:
        data = request.json
        question = data.get('question', '')
        user_answer = data.get('user_answer')

        if not question:
            return jsonify({'error': 'Question is required'}), 400

        result = interview_prep.generate_answer_feedback(question, user_answer)

        return jsonify({
            'success': True,
            'result': result
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/analyze-skill-gaps', methods=['POST'])
def analyze_skill_gaps():
    """Analyze skill gaps and generate learning roadmap"""
    try:
        data = request.json
        session_id = data.get('session_id')

        if not session_id:
            return jsonify({'error': 'Session ID is required'}), 400

        # Get session data
        session = UserSession.query.filter_by(session_id=session_id).first()
        if not session:
            return jsonify({'error': 'Session not found'}), 404

        # Prepare resume data
        resume_data = {
            'skills': json.loads(session.resume_skills) if session.resume_skills else []
        }

        # Prepare job data
        job_data = {
            'description': session.job_description,
            'skills': json.loads(session.job_skills) if session.job_skills else []
        }

        # Analyze skill gaps
        gap_analysis = skill_gap_analyzer.analyze_skill_gaps(resume_data, job_data)

        return jsonify({
            'success': True,
            'skill_gap_analysis': gap_analysis
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/comprehensive-analysis', methods=['POST'])
def comprehensive_analysis():
    """Run all AI analyses in one comprehensive endpoint"""
    try:
        data = request.json
        session_id = data.get('session_id')
        job_title = data.get('job_title', '')

        if not session_id:
            return jsonify({'error': 'Session ID is required'}), 400

        # Get session data
        session = UserSession.query.filter_by(session_id=session_id).first()
        if not session:
            return jsonify({'error': 'Session not found'}), 404

        # Prepare data
        resume_data = {
            'text': session.resume_text,
            'skills': json.loads(session.resume_skills) if session.resume_skills else [],
            'experience': json.loads(session.resume_experience) if session.resume_experience else {},
            'education': json.loads(session.resume_education) if session.resume_education else [],
            'personal_info': json.loads(session.resume_personal_info) if session.resume_personal_info else {},
            'sections': json.loads(session.resume_sections) if session.resume_sections else []
        }

        job_data = {
            'description': session.job_description,
            'skills': json.loads(session.job_skills) if session.job_skills else []
        }

        # Run all analyses
        results = {
            'ai_score': scoring_engine.calculate_comprehensive_score(resume_data, job_data),
            'job_classification': job_classifier.classify_job_description(
                session.job_description, job_title
            ),
            'interview_prep': interview_prep.generate_interview_questions(
                job_role=job_title,
                job_description=session.job_description,
                skills=resume_data['skills']
            ),
            'skill_gaps': skill_gap_analyzer.analyze_skill_gaps(resume_data, job_data)
        }

        return jsonify({
            'success': True,
            'comprehensive_analysis': results
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
