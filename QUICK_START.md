# Quick Start Guide - AI Job Assistant

## 🚀 30-Second Start

### Start Both Servers

**Terminal 1 - Backend:**

```bash
cd backend
python app.py
```

Wait for: `Running on http://127.0.0.1:5000`

**Terminal 2 - Frontend:**

```bash
cd frontend
cmd /c "npm start"
```

Wait for: `Compiled successfully!`

**Open Browser:** http://localhost:3000

---

## 📋 Feature Checklist

### ✅ What's Available

- **AI Resume Scoring**: 5-dimensional analysis with A+ to F grade
- **Job Classification**: Industry, level, requirements using NLP
- **Interview Prep**: 200+ questions + 5-day study plan
- **Skill Gap Analysis**: Learning roadmap with time estimates
- **Cover Letter Generator**: Multiple tones (professional, enthusiastic, creative, technical)
- **Match Analysis**: Resume-job compatibility scoring

### 🎯 7 Tabs in Analysis View

1. **Overview** - Match score and skills comparison
2. **AI Score** - Resume quality assessment
3. **Job Classification** - Job insights and requirements
4. **Skill Gaps** - Learning roadmap and recommendations
5. **Interview Prep** - Questions and study guide
6. **AI Recommendations** - Personalized suggestions
7. **Cover Letters** - Generated letters

---

## 🔍 Quick Test

1. Upload any resume (PDF/DOCX)
2. Paste a job description
3. Click "Analyze Match"
4. Navigate through all 7 tabs
5. Generate cover letter

Expected: All features work, no errors

---

## 🛠️ Troubleshooting

### Backend Won't Start

```bash
# Check Python version
python --version  # Should be 3.11+

# Reinstall dependencies
pip install -r requirements.txt
python -m spacy download en_core_web_sm
```

### Frontend Won't Start

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Or use cmd wrapper
cmd /c "npm start"
```

### Port Already in Use

```bash
# Backend (5000)
netstat -ano | findstr :5000
taskkill /PID [PID_NUMBER] /F

# Frontend (3000)
netstat -ano | findstr :3000
taskkill /PID [PID_NUMBER] /F
```

### Import Errors

```bash
# Verify all modules exist
cd backend
python -c "from ai_scoring_engine import AIResumeScoringEngine; print('✓')"
python -c "from nlp_job_classifier import NLPJobClassifier; print('✓')"
python -c "from ai_interview_prep import AIInterviewPrep; print('✓')"
python -c "from skill_gap_analyzer import SkillGapAnalyzer; print('✓')"
```

---

## 📊 API Quick Reference

### Get AI Score

```bash
curl -X POST http://localhost:5000/api/ai-score-resume \
  -H "Content-Type: application/json" \
  -d '{"session_id": "YOUR_SESSION_ID"}'
```

### Classify Job

```bash
curl -X POST http://localhost:5000/api/classify-job \
  -H "Content-Type: application/json" \
  -d '{"job_description": "...", "job_title": "Software Engineer"}'
```

### Get Interview Questions

```bash
curl -X POST http://localhost:5000/api/generate-interview-questions \
  -H "Content-Type: application/json" \
  -d '{"session_id": "YOUR_SESSION_ID", "job_role": "Software Engineer"}'
```

### Analyze Skill Gaps

```bash
curl -X POST http://localhost:5000/api/analyze-skill-gaps \
  -H "Content-Type: application/json" \
  -d '{"session_id": "YOUR_SESSION_ID"}'
```

---

## 📁 Project Structure

```
ai-job-assistant/
├── backend/
│   ├── app.py                      # Main Flask app with 5 new endpoints
│   ├── ai_scoring_engine.py        # ✨ NEW: 5-dimensional scoring
│   ├── nlp_job_classifier.py       # ✨ NEW: NLP classification
│   ├── ai_interview_prep.py        # ✨ NEW: Interview questions
│   ├── skill_gap_analyzer.py       # ✨ NEW: Skill gap analysis
│   ├── advanced_parser.py          # Resume parsing
│   ├── job_analyzer.py             # Job analysis
│   ├── cover_letter_generator.py   # Cover letters
│   ├── ai_recommendations.py       # Recommendations
│   ├── database.py                 # Database models
│   └── requirements.txt            # Python dependencies
│
└── frontend/
    └── src/
        ├── App.js                  # Main app (updated)
        └── components/
            ├── AIScoreCard.js      # ✨ NEW: Score display
            ├── JobClassification.js # ✨ NEW: Job insights
            ├── InterviewPrep.js    # ✨ NEW: Interview prep
            ├── SkillGapAnalysis.js # ✨ NEW: Skill gaps
            ├── AnalysisResults.js  # Updated: 7 tabs
            ├── ResumeUpload.js     # Resume upload
            ├── JobDescription.js   # Job input
            ├── CoverLetter.js      # Cover letters
            └── AIRecommendations.js # Recommendations
```

---

## 🎯 Key Metrics

- **Backend Modules**: 4 new AI modules (2,000+ lines)
- **Frontend Components**: 4 new React components (1,900+ lines)
- **API Endpoints**: 5 new AI endpoints
- **Interview Questions**: 200+ curated questions
- **Learning Resources**: 60+ resources across skills
- **Total Features**: 7 major AI features

---

## ✅ Verification Checklist

Run these checks to verify everything works:

### Backend

- [ ] Server starts without errors
- [ ] All AI modules import successfully
- [ ] Database creates successfully
- [ ] Health endpoint responds: http://localhost:5000/api/health

### Frontend

- [ ] Server starts and compiles successfully
- [ ] No console errors in browser
- [ ] All 4 new components render
- [ ] 7 tabs visible in analysis view

### Features

- [ ] Resume upload works
- [ ] Job analysis works
- [ ] AI scoring displays
- [ ] Job classification shows
- [ ] Interview questions generate
- [ ] Skill gaps analyze
- [ ] Cover letters generate

---

## 🎓 Educational Requirements Met

✅ **Resume Analysis**: AI scoring with 5 dimensions
✅ **NLP Classification**: Industry, level, requirements
✅ **Skill Recommendations**: Gap analysis + learning paths
✅ **Interview Preparation**: 200+ questions + study plans
✅ **Missing Sections**: Automatic detection and suggestions
✅ **Practice Questions**: Role-specific and behavioral

---

## 📞 Need Help?

1. Check README.md for full documentation
2. Verify both servers running (ports 3000 & 5000)
3. Check browser console for errors (F12)
4. Check terminal output for backend errors
5. Ensure all dependencies installed

---

**Status**: ✅ Ready to Use
**Version**: 2.0
**Last Updated**: 2025-01-26
