#!/usr/bin/env python
"""
Integration Test Script
Tests all components of the AI Job Assistant with real datasets
"""

import sys
import os
from pathlib import Path

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

def test_data_processor():
    """Test data processor initialization and loading"""
    print("\n" + "="*60)
    print("TEST 1: Data Processor Initialization")
    print("="*60)

    try:
        from data_processor import DataProcessor
        processor = DataProcessor()

        # Get summary
        summary = processor.get_dataset_summary()
        print(f"✓ Data processor initialized")
        print(f"✓ Total datasets loaded: {summary['total_datasets']}")

        for name, info in summary['datasets'].items():
            print(f"  - {name}: {info['records']} records, {info['columns']} columns")

        return processor
    except Exception as e:
        print(f"✗ Data processor test failed: {str(e)}")
        return None

def test_skill_gap_analyzer(processor):
    """Test skill gap analyzer with real data"""
    print("\n" + "="*60)
    print("TEST 2: Skill Gap Analyzer (with Real Data)")
    print("="*60)

    try:
        from skill_gap_analyzer import SkillGapAnalyzer

        analyzer = SkillGapAnalyzer(data_processor=processor)

        # Test data
        resume_skills = ['Python', 'SQL', 'Tableau']
        job_skills = ['Python', 'React', 'AWS', 'SQL', 'Docker']

        resume_data = {'skills': resume_skills, 'description': 'Software developer with Python experience'}
        job_data = {
            'skills': job_skills,
            'description': 'Looking for React developer with AWS and Docker skills'
        }

        result = analyzer.analyze_skill_gaps(resume_data, job_data)

        print(f"✓ Skill gap analysis completed")
        print(f"✓ Missing skills: {len(result['missing_skills'])} - {result['missing_skills']}")
        print(f"✓ Matching skills: {len(result['matching_skills'])} - {result['matching_skills']}")
        print(f"✓ Readiness score: {result['readiness_score']}%")

        # Check for real courses in learning paths
        learning_paths = result['learning_paths']
        if learning_paths:
            first_path = learning_paths[0]
            print(f"✓ First learning path: {first_path['skill']}")
            if 'real_courses' in first_path and first_path['real_courses']:
                print(f"  ✅ Real courses found: {len(first_path['real_courses'])} courses")
                for course in first_path['real_courses'][:2]:
                    print(f"     - {course.get('title', 'N/A')} ({course.get('source', 'N/A')})")
            else:
                print(f"  ⚠ No real courses in this path (fallback to hardcoded)")

        return True
    except Exception as e:
        print(f"✗ Skill gap analyzer test failed: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

def test_interview_prep(processor):
    """Test interview prep with real data"""
    print("\n" + "="*60)
    print("TEST 3: Interview Prep (with Real Questions)")
    print("="*60)

    try:
        from ai_interview_prep import AIInterviewPrep

        prep = AIInterviewPrep(data_processor=processor)

        # Generate interview questions
        questions = prep.generate_interview_questions(
            job_role='Data Scientist',
            job_description='Looking for data scientist with Python and ML skills',
            skills=['Python', 'Machine Learning', 'SQL']
        )

        print(f"✓ Interview prep generated")
        print(f"✓ Total question categories: {len([k for k in questions.keys() if isinstance(questions[k], list)])}")

        # Count total questions
        total_questions = 0
        for category, items in questions.items():
            if isinstance(items, list):
                total_questions += len(items)
                print(f"  - {category}: {len(items)} questions")

        print(f"✓ Total questions available: {total_questions}")

        # Check for real world questions
        if 'real_world_questions' in questions:
            real_questions = questions['real_world_questions']
            if real_questions:
                print(f"✅ Real interview questions found: {len(real_questions)}")
                for q in real_questions[:2]:
                    print(f"   - {q.get('Question', 'N/A')[:60]}...")
            else:
                print(f"⚠ Real interview questions not found in datasets")

        return True
    except Exception as e:
        print(f"✗ Interview prep test failed: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

def test_resume_parser():
    """Test resume parser"""
    print("\n" + "="*60)
    print("TEST 4: Resume Parser")
    print("="*60)

    try:
        from advanced_parser import UniversalResumeParser

        parser = UniversalResumeParser()

        # Test with sample text
        sample_resume = """
        John Doe
        john@example.com | (555) 123-4567

        SKILLS
        Python, JavaScript, React, AWS, SQL, Docker

        EXPERIENCE
        Software Engineer at Tech Company (2020-2024)
        - Developed Python applications
        - Built React frontends

        EDUCATION
        Bachelor of Science in Computer Science (2020)
        University Name
        """

        result = parser.parse_resume(sample_resume.encode(), 'test.txt')

        print(f"✓ Resume parsing completed")
        print(f"✓ Skills extracted: {len(result['analysis']['skills'])} - {result['analysis']['skills'][:3]}")
        print(f"✓ Experience found: {len(result['analysis']['experience'])} entries")
        print(f"✓ Education found: {len(result['analysis']['education'])} entries")
        print(f"✓ Contact info found: {bool(result['analysis']['personal_info'])}")

        return True
    except Exception as e:
        print(f"✗ Resume parser test failed: {str(e)}")
        return False

def test_job_analyzer():
    """Test job analyzer"""
    print("\n" + "="*60)
    print("TEST 5: Job Analyzer & NLP Classification")
    print("="*60)

    try:
        from job_analyzer import AdvancedJobAnalyzer
        from nlp_job_classifier import NLPJobClassifier

        analyzer = AdvancedJobAnalyzer()
        classifier = NLPJobClassifier()

        sample_job = """
        Senior Python Developer
        Location: Remote

        We are looking for an experienced Python developer with 5+ years experience.

        Required Skills:
        - Python
        - Django or Flask
        - PostgreSQL
        - AWS
        - Docker

        Nice to Have:
        - Kubernetes
        - React

        Education:
        Bachelor's degree in Computer Science or related field
        """

        # Analyze job
        analysis = analyzer.analyze_job_description(sample_job)
        print(f"✓ Job analysis completed")
        print(f"✓ Skills found: {len(analysis['skills'])} - {analysis['skills'][:5]}")
        print(f"✓ Experience level: {analysis['experience_level']}")
        print(f"✓ Education requirements: {analysis['education_requirements']}")

        # Classify job
        classification = classifier.classify_job_description(sample_job, "Python Developer")
        print(f"✓ Job classification completed")
        print(f"✓ Primary industry: {classification.get('primary_industry', 'N/A')}")
        print(f"✓ Experience level: {classification.get('experience_level', 'N/A')}")

        return True
    except Exception as e:
        print(f"✗ Job analyzer test failed: {str(e)}")
        return False

def test_scoring_engine():
    """Test AI scoring engine"""
    print("\n" + "="*60)
    print("TEST 6: AI Resume Scoring Engine")
    print("="*60)

    try:
        from ai_scoring_engine import AIResumeScoringEngine

        engine = AIResumeScoringEngine()

        # Sample data
        resume_data = {
            'skills': ['Python', 'SQL', 'Django'],
            'experience': [
                {'company': 'Tech Co', 'duration': 3, 'achievements': 'Developed Python API, increased performance by 40%'}
            ],
            'education': [{'degree': "Bachelor's", 'field': 'Computer Science'}],
            'personal_info': {'email': 'test@example.com', 'phone': '555-1234'},
            'sections': ['Experience', 'Education', 'Skills', 'Contact'],
            'text': 'Sample resume text'
        }

        job_data = {
            'skills': ['Python', 'SQL', 'Django', 'AWS'],
            'description': 'Looking for Python developer'
        }

        score = engine.calculate_comprehensive_score(resume_data, job_data)

        print(f"✓ Resume scoring completed")
        print(f"✓ Overall score: {score['overall_score']}/100")
        print(f"✓ Grade: {score['grade']}")
        print(f"✓ ATS Score: {score['ats_score']:.1f}%")
        print(f"✓ Keyword Score: {score['keyword_score']:.1f}%")
        print(f"✓ Impact Score: {score['impact_score']:.1f}%")

        return True
    except Exception as e:
        print(f"✗ Scoring engine test failed: {str(e)}")
        return False

def main():
    """Run all tests"""
    print("\n" + "█"*60)
    print("█  AI Job Assistant - Integration Test Suite  █".ljust(60) + "█")
    print("█"*60)

    # Test data processor first
    processor = test_data_processor()

    tests = [
        ('Resume Parser', test_resume_parser),
        ('Job Analyzer', test_job_analyzer),
        ('Scoring Engine', test_scoring_engine),
        ('Skill Gap Analyzer', lambda: test_skill_gap_analyzer(processor)),
        ('Interview Prep', lambda: test_interview_prep(processor)),
    ]

    results = {}
    for test_name, test_func in tests:
        try:
            results[test_name] = test_func()
        except Exception as e:
            print(f"\n✗ Test failed with exception: {str(e)}")
            results[test_name] = False

    # Summary
    print("\n" + "="*60)
    print("TEST SUMMARY")
    print("="*60)

    passed = sum(1 for v in results.values() if v)
    total = len(results)

    for test_name, result in results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status}  - {test_name}")

    print(f"\nTotal: {passed}/{total} tests passed")

    if passed == total:
        print("\n🎉 ALL TESTS PASSED! System is ready for production.")
    else:
        print(f"\n⚠️  {total - passed} test(s) failed. Check logs above.")

    print("\n" + "="*60)
    print("NEXT STEPS:")
    print("="*60)
    print("1. Start backend: python app.py")
    print("2. Start frontend: npm start")
    print("3. Open http://localhost:3000")
    print("4. Test with a real resume")
    print("="*60 + "\n")

if __name__ == "__main__":
    main()
