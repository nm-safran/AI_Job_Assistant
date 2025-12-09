# AI Job Assistant - Component Reference

## 🎯 Quick Component Guide

### 1. AIScoreCard Component

**Location:** `src/components/AIScoreCard.js`

**Purpose:** Display comprehensive 5-dimensional resume scoring with AI-powered recommendations.

**Features:**

- Overall score (0-100) with letter grade (A+ to D)
- 5 detailed score categories with progress bars
- Visual color coding (green/blue/yellow/red)
- Strengths and weaknesses sections
- Critical issues highlighting
- Prioritized recommendations with impact/effort metrics

**API Endpoint:** `POST /api/ai-score-resume`

**Visual Elements:**

- Purple gradient header
- Score breakdown cards
- Color-coded progress bars
- Priority badges (Critical/High/Medium/Low)

**Key Metrics Displayed:**

1. ATS Compatibility (0-100)
2. Keyword Optimization (0-100)
3. Impact & Achievements (0-100)
4. Resume Completeness (0-100)
5. Professional Quality (0-100)

---

### 2. JobClassification Component

**Location:** `src/components/JobClassification.js`

**Purpose:** NLP-powered job description analysis with industry classification.

**Features:**

- Industry classification with confidence percentage
- Job level detection (Entry/Mid/Senior/Leadership)
- Related industries suggestions
- Must-have vs Nice-to-have requirements
- Technical and soft skills extraction
- Work arrangement detection
- Company type identification
- Job complexity scoring (0-10)
- Sentiment analysis

**API Endpoint:** `POST /api/classify-job`

**Visual Elements:**

- Indigo gradient header
- Industry confidence meter
- Level badges with color coding
- Requirements split view
- Skill tags
- Sentiment indicators

**Classification Categories:**

- 10+ industries (Technology, Healthcare, Finance, etc.)
- 4 job levels
- 3 work arrangements (Remote/Hybrid/On-site)
- Multiple company types

---

### 3. InterviewPrep Component

**Location:** `src/components/InterviewPrep.js`

**Purpose:** Personalized interview preparation with 200+ questions and study plans.

**Features:**

- 200+ categorized interview questions
- Question filtering by type
- Expandable question cards with tips
- 5-day preparation plan
- STAR method guide
- Interview tips and best practices
- Common mistakes to avoid
- Questions to ask the interviewer

**API Endpoint:** `POST /api/generate-interview-questions`

**Visual Elements:**

- Green gradient header
- 3-tab navigation (Questions/Plan/Tips)
- Question type badges
- Difficulty indicators
- Expandable cards with answer tips
- Daily plan cards

**Question Categories:**

1. Technical (Beginner/Intermediate/Advanced)
2. Behavioral (STAR method)
3. System Design
4. Role-Specific

**Study Plan:**

- Day-by-day breakdown
- Focus areas per day
- Activities and topics
- Resource recommendations

---

### 4. SkillGapAnalysis Component

**Location:** `src/components/SkillGapAnalysis.js`

**Purpose:** Skill gap identification with personalized learning roadmap.

**Features:**

- Overall match percentage
- Skill gap count with criticality
- Readiness scores (0-100)
- Prioritized skill list
- Learning resources per skill
- Multi-phase learning roadmap
- Week-by-week milestones
- Market demand data
- Salary impact predictions
- Quick wins identification
- Long-term goals

**API Endpoint:** `POST /api/analyze-skill-gaps`

**Visual Elements:**

- Orange gradient header
- 4-metric dashboard
- Skill cards with readiness bars
- Priority indicators
- Phase-based roadmap
- Market data cards

**Metrics Displayed:**

- Overall Match %
- Total Gaps Count
- Critical Gaps
- Estimated Weeks to Learn

**Learning Roadmap:**

- Multiple phases (typically 3-4)
- Skills grouped by phase
- Weekly milestones
- Success metrics

---

### 5. AnalysisResults Component

**Location:** `src/components/AnalysisResults.js`

**Purpose:** Main analysis hub with 7 comprehensive tabs.

**Features:**

- Match score visualization
- 7-tab navigation system
- Integration of all AI components
- Skills comparison
- Overview dashboard

**Tabs:**

1. 📊 Overview - Quick assessment and metrics
2. 🎯 AI Score - AIScoreCard component
3. 🔍 Job Analysis - JobClassification component
4. 🛠️ Skills Match - Matching vs missing skills
5. 📈 Learning Path - SkillGapAnalysis component
6. 💬 Interview Prep - InterviewPrep component
7. 🚀 AI Tips - AIRecommendations component

**Visual Elements:**

- Blue/Purple gradient header
- Match score badge
- Progress bar animation
- Tab navigation
- Integrated components

---

### 6. ResumeUpload Component

**Location:** `src/components/ResumeUpload.js`

**Purpose:** Drag & drop resume upload with file validation.

**Features:**

- Drag and drop support
- Click to upload
- File type validation (PDF, DOCX)
- Upload progress indicator
- Automatic parsing

**API Endpoint:** `POST /api/upload-resume`

**Supported Formats:**

- PDF
- DOCX
- DOC

---

### 7. JobDescription Component

**Location:** `src/components/JobDescription.js`

**Purpose:** Job description text input and analysis.

**Features:**

- Large text area for job posting
- Character count
- Analysis trigger
- Back navigation

**API Endpoint:** `POST /api/analyze-job`

---

### 8. CoverLetter Component

**Location:** `src/components/CoverLetter.js`

**Purpose:** AI-generated cover letter with editing.

**Features:**

- Multiple cover letter generation
- Editable text
- Download/copy functionality
- Style variations

**API Endpoint:** `POST /api/generate-cover-letter`

---

### 9. AIRecommendations Component

**Location:** `src/components/AIRecommendations.js`

**Purpose:** Original AI recommendations with learning plans.

**Features:**

- Skill development recommendations
- Courses and projects
- Learning timeline
- Practice areas
- Weekly goals

**API Endpoint:** `POST /api/analyze-match`

---

## 🎨 Common Visual Patterns

### Header Patterns

```javascript
// Gradient Header
<div className="bg-gradient-to-r from-{color}-500 to-{color}-600 text-white p-8">
```

### Score Display

```javascript
// Large Score Number
<div className="text-6xl font-bold mb-2">{score}</div>

// Progress Bar
<div className="w-full bg-gray-200 rounded-full h-3">
  <div className="bg-{color}-500 h-3 rounded-full" style={{ width: `${score}%` }}></div>
</div>
```

### Card Pattern

```javascript
<div className="border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
```

### Badge Pattern

```javascript
<span className="bg-{color}-100 text-{color}-800 px-3 py-1 rounded-full text-xs font-medium border border-{color}-300">
```

---

## 🔄 Data Flow

```
User Upload Resume
      ↓
  session_id generated
      ↓
User Enter Job Description
      ↓
All AI Analysis Components Fetch Data
      ↓
├── AIScoreCard: ai-score-resume
├── JobClassification: classify-job
├── InterviewPrep: generate-interview-questions
└── SkillGapAnalysis: analyze-skill-gaps
      ↓
Display in 7 Tabs
```

---

## 📊 State Management

### Session State (App.js)

```javascript
- currentStep: 1-4
- resumeData: parsed resume object
- jobDescription: string
- sessionId: unique identifier
- analysisResults: match analysis object
```

### Component State (Each AI Component)

```javascript
- loading: boolean
- data: component-specific data
- activeTab/activePhase: navigation state
- selectedQuestion: expanded state
```

---

## 🎯 Color Coding System

### Score Ranges

- **Green (80-100)**: Excellent
- **Blue (60-79)**: Good
- **Yellow (40-59)**: Needs Improvement
- **Red (0-39)**: Critical

### Priority Levels

- **Red**: Critical/High
- **Yellow**: Medium
- **Blue**: Low

### Sentiment

- **Green**: Positive
- **Gray**: Neutral
- **Red**: Negative

---

## 📱 Responsive Breakpoints

```css
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
```

### Grid Responsiveness

```javascript
grid-cols-1 md:grid-cols-2 lg:grid-cols-3
```

---

## 🔧 Component Usage Examples

### Using AIScoreCard

```javascript
import AIScoreCard from "./components/AIScoreCard";

<AIScoreCard sessionId="session_123456" />;
```

### Using JobClassification

```javascript
import JobClassification from "./components/JobClassification";

<JobClassification sessionId="session_123456" />;
```

### Using InterviewPrep

```javascript
import InterviewPrep from "./components/InterviewPrep";

<InterviewPrep sessionId="session_123456" />;
```

### Using SkillGapAnalysis

```javascript
import SkillGapAnalysis from "./components/SkillGapAnalysis";

<SkillGapAnalysis sessionId="session_123456" />;
```

---

## 🚨 Error States

All components handle:

1. **Loading State**: Spinner with message
2. **Error State**: User-friendly error message
3. **Empty State**: Helpful "no data" message
4. **Network Error**: Try again prompt

---

## 💡 Best Practices

1. **Always pass sessionId** to AI components
2. **Check loading state** before rendering data
3. **Use color-coded indicators** for quick insights
4. **Implement proper error boundaries**
5. **Optimize re-renders** with proper keys

---

**Last Updated:** November 25, 2025
