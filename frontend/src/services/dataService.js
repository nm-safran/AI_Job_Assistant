// Data Service - Central API communication for frontend
// Handles all backend API calls and data transformations

const API_BASE = 'http://localhost:5000/api';

// Generic fetch with error handling
const apiCall = async (endpoint, method = 'GET', body = null) => {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE}${endpoint}`, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'API call failed');
    }

    return { success: true, data };
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    return { success: false, error: error.message };
  }
};

// Get dataset information (verify data loaded)
export const getDatasetInfo = async () => {
  return apiCall('/datasets-info');
};

// Health check with system status
export const healthCheck = async () => {
  return apiCall('/health');
};

// Upload resume
export const uploadResume = async (formData) => {
  try {
    const response = await fetch(`${API_BASE}/upload-resume`, {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    return { success: data.success !== false, data };
  } catch (error) {
    console.error('Resume upload error:', error);
    return { success: false, error: error.message };
  }
};

// Analyze match between resume and job
export const analyzeMatch = async (sessionId) => {
  return apiCall('/analyze-match', 'POST', { session_id: sessionId });
};

// Generate interview questions (now with real data)
export const generateInterviewQuestions = async (sessionId) => {
  return apiCall('/generate-interview-questions', 'POST', { session_id: sessionId });
};

// Analyze skill gaps (now with real courses)
export const analyzeSkillGaps = async (sessionId) => {
  return apiCall('/analyze-skill-gaps', 'POST', { session_id: sessionId });
};

// Generate cover letter
export const generateCoverLetter = async (sessionId) => {
  return apiCall('/generate-cover-letter', 'POST', { session_id: sessionId });
};

// Get real interview questions by category
export const getRealInterviewQuestions = async (category = 'all') => {
  return apiCall('/get-real-interview-questions', 'POST', { category });
};

// Get real courses for a skill
export const getCoursesForSkill = async (skill) => {
  return apiCall('/get-courses-for-skill', 'POST', { skill });
};

// Get real projects for skill practice
export const getProjectIdeas = async (skill = null) => {
  return apiCall('/get-project-ideas', 'POST', { skill });
};

// Get salary data by skill
export const getSalaryBySkill = async (skill) => {
  return apiCall('/get-salary-by-skill', 'POST', { skill });
};

// Transform raw interview data to display format
export const transformInterviewData = (rawData) => {
  if (!rawData) return null;

  const technicalQuestions = rawData.technical_questions || [];
  const behavioralQuestions = rawData.behavioral_questions || [];
  const systemDesignQuestions = rawData.system_design_questions || [];
  const roleSpecificQuestions = rawData.role_specific_questions || [];
  const realWorldQuestions = rawData.real_world_questions || [];

  return {
    ...rawData,
    allQuestions: [
      ...technicalQuestions.map(q => ({ ...q, type: 'Technical', source: 'AI Generated' })),
      ...behavioralQuestions.map(q => ({ ...q, type: 'Behavioral', source: 'AI Generated' })),
      ...systemDesignQuestions.map(q => ({ ...q, type: 'System Design', source: 'AI Generated' })),
      ...roleSpecificQuestions.map(q => ({ ...q, type: 'Role-Specific', source: 'AI Generated' })),
      ...realWorldQuestions.map(q => ({ ...q, type: realWorldQuestions[0]?.type || 'Real-World', source: '📊 Real Dataset' })),
    ],
    totalQuestions: (
      technicalQuestions.length +
      behavioralQuestions.length +
      systemDesignQuestions.length +
      roleSpecificQuestions.length +
      realWorldQuestions.length
    ),
    realDataQuestionsCount: realWorldQuestions.length,
  };
};

// Transform skill gap data with real courses
export const transformSkillGapData = (rawData) => {
  if (!rawData) return null;

  const prioritizedSkills = rawData.prioritized_skills || [];

  // Enhance each skill with real course information if available
  const enhancedSkills = prioritizedSkills.map(skill => {
    const realCourses = skill.real_courses || [];
    const realCoursesCount = realCourses.length;

    return {
      ...skill,
      realCourses,
      realCoursesCount,
      hasRealData: realCoursesCount > 0,
    };
  });

  return {
    ...rawData,
    prioritized_skills: enhancedSkills,
  };
};

// Format course data for display
export const formatCourseForDisplay = (course) => {
  if (!course) return null;

  return {
    title: course.Course_Name || course.course_name || course.title || 'Unknown Course',
    platform: course.Course_Provider || course.provider || 'Unknown Platform',
    level: course.Level || course.level || 'Beginner',
    duration: course.Duration || course.duration || 'Self-paced',
    rating: course.Rating || course.rating || 'N/A',
    price: course.Price || course.price || 'Free',
    url: course.url || course.Course_URL || '#',
    students: course.Number_of_Students || course.students || '—',
  };
};

// Format project data for display
export const formatProjectForDisplay = (project) => {
  if (!project) return null;

  return {
    title: project.Repository_Name || project.name || 'Unknown Project',
    description: project.Description || project.description || 'No description',
    language: project.Language || project.language || 'Unknown',
    stars: project.Stars || project.stars || 0,
    url: project.Repository_URL || project.url || '#',
    difficulty: project.Difficulty || project.difficulty || 'Medium',
    topics: project.Topics ? project.Topics.split(',').map(t => t.trim()) : [],
  };
};

// Batch load all dataset info at startup
export const loadSystemInfo = async () => {
  const healthResult = await healthCheck();
  const datasetResult = await getDatasetInfo();

  return {
    system: healthResult.data,
    datasets: datasetResult.data,
  };
};

export default {
  getDatasetInfo,
  healthCheck,
  uploadResume,
  analyzeMatch,
  generateInterviewQuestions,
  analyzeSkillGaps,
  generateCoverLetter,
  getRealInterviewQuestions,
  getCoursesForSkill,
  getProjectIdeas,
  getSalaryBySkill,
  transformInterviewData,
  transformSkillGapData,
  formatCourseForDisplay,
  formatProjectForDisplay,
  loadSystemInfo,
};
