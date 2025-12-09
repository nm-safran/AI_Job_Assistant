import React, { useState, useEffect } from 'react';

const AIRecommendations = ({ resumeData, jobDescription, sessionId }) => {
  const [recommendations, setRecommendations] = useState(null);
  const [activeTab, setActiveTab] = useState('skills');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (sessionId) {
      fetchAIRecommendations();
    }
  }, [sessionId]);

  const fetchAIRecommendations = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/analyze-match', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId
        }),
      });

      const data = await response.json();

      if (data.success) {
        setRecommendations(data);
      }
    } catch (error) {
      console.error('Error fetching AI recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-gray-600">Loading AI recommendations...</p>
      </div>
    );
  }

  if (!recommendations) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No recommendations available yet.</p>
      </div>
    );
  }

  const { ai_recommendations, improvement_plan, interview_questions } = recommendations;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">🚀 AI-Powered Recommendations</h2>
        <p className="text-gray-600">Personalized suggestions to improve your job match</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200">
        {[
          { key: 'skills', name: 'Skill Development', icon: '🛠️' },
          { key: 'plan', name: 'Learning Plan', icon: '📅' },
          { key: 'interview', name: 'Interview Prep', icon: '💬' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center px-6 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === tab.key
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
          >
            <span className="mr-2 text-lg">{tab.icon}</span>
            {tab.name}
          </button>
        ))}
      </div>

      {/* Skills Development Tab */}
      {activeTab === 'skills' && (
        <div className="space-y-6">
          <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
            <h3 className="text-xl font-semibold text-blue-800 mb-4 flex items-center">
              <span className="mr-2">🎯</span>
              Skill Gap Analysis
            </h3>
            <p className="text-blue-700">
              Based on the job requirements, here are the key skills you should focus on developing:
            </p>
          </div>

          {ai_recommendations && ai_recommendations.length > 0 ? (
            <div className="grid gap-6">
              {ai_recommendations.map((rec, index) => (
                <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                    <div className="flex items-center mb-3 lg:mb-0">
                      <div className={`w-3 h-3 rounded-full mr-3 ${rec.priority === 'High' ? 'bg-red-500' : 'bg-yellow-500'
                        }`}></div>
                      <h4 className="text-lg font-semibold text-gray-800">{rec.skill}</h4>
                      <span className="ml-3 bg-gray-100 text-gray-600 px-2 py-1 rounded text-sm">
                        {rec.level}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">Priority:</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${rec.priority === 'High'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {rec.priority}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <h5 className="font-medium text-gray-700 mb-2 flex items-center">
                        <span className="text-blue-500 mr-2">📚</span>
                        Recommended Courses
                      </h5>
                      <ul className="space-y-1">
                        {rec.courses.map((course, i) => (
                          <li key={i} className="text-sm text-gray-600 flex items-start">
                            <span className="text-gray-400 mr-2 mt-1">•</span>
                            {course}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h5 className="font-medium text-gray-700 mb-2 flex items-center">
                        <span className="text-green-500 mr-2">💼</span>
                        Practice Projects
                      </h5>
                      <ul className="space-y-1">
                        {rec.projects.map((project, i) => (
                          <li key={i} className="text-sm text-gray-600 flex items-start">
                            <span className="text-gray-400 mr-2 mt-1">•</span>
                            {project}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h5 className="font-medium text-gray-700 mb-2 flex items-center">
                        <span className="text-purple-500 mr-2">🎯</span>
                        Practice Areas
                      </h5>
                      <ul className="space-y-1">
                        {rec.practice.map((practice, i) => (
                          <li key={i} className="text-sm text-gray-600 flex items-start">
                            <span className="text-gray-400 mr-2 mt-1">•</span>
                            {practice}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <span className="text-sm text-gray-500">
                      Timeline: <strong>{rec.timeline}</strong>
                    </span>
                    <button
                      onClick={() => alert(`Learning resources for ${rec.skill} would open here`)}
                      className="text-primary hover:text-secondary text-sm font-medium"
                    >
                      View Detailed Resources →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No specific skill recommendations available.</p>
            </div>
          )}
        </div>
      )}

      {/* Learning Plan Tab */}
      {activeTab === 'plan' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-2 lg:mb-0">
                📅 Personalized Learning Plan
              </h3>
              <div className="bg-white px-3 py-1 rounded-full border border-green-200">
                <span className="text-green-600 font-medium">{improvement_plan.timeline}</span>
              </div>
            </div>
            <p className="text-gray-600">
              {improvement_plan.expected_outcome}
            </p>
          </div>

          {improvement_plan.weekly_goals && improvement_plan.weekly_goals.length > 0 ? (
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800 text-lg">Weekly Breakdown</h4>
              {improvement_plan.weekly_goals.map((goal, index) => (
                <div key={index} className="flex items-start space-x-4 bg-white p-4 rounded-lg border border-gray-200">
                  <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">
                    W{index + 1}
                  </div>
                  <p className="text-gray-700 flex-1">{goal}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No learning plan available for this analysis.</p>
            </div>
          )}

          {improvement_plan.resources_needed && improvement_plan.resources_needed.length > 0 && (
            <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
              <h4 className="font-semibold text-yellow-800 mb-3 flex items-center">
                <span className="mr-2">📋</span>
                Required Resources
              </h4>
              <ul className="space-y-2">
                {improvement_plan.resources_needed.map((resource, index) => (
                  <li key={index} className="text-yellow-700 flex items-start">
                    <span className="text-yellow-500 mr-2 mt-1">•</span>
                    {resource}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {improvement_plan.success_metrics && improvement_plan.success_metrics.length > 0 && (
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
                <span className="mr-2">🎯</span>
                Success Metrics
              </h4>
              <ul className="space-y-2">
                {improvement_plan.success_metrics.map((metric, index) => (
                  <li key={index} className="text-blue-700 flex items-start">
                    <span className="text-blue-500 mr-2 mt-1">✓</span>
                    {metric}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Interview Preparation Tab */}
      {activeTab === 'interview' && (
        <div className="space-y-6">
          <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
            <h3 className="text-xl font-semibold text-purple-800 mb-2">
              💬 Personalized Interview Preparation
            </h3>
            <p className="text-purple-700">
              Practice these questions tailored to your skills and the job requirements
            </p>
          </div>

          {interview_questions && interview_questions.length > 0 ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold text-gray-800 text-lg">
                  Practice Questions ({interview_questions.length})
                </h4>
                <span className="text-sm text-gray-500">
                  Based on your profile and job requirements
                </span>
              </div>

              {interview_questions.map((question, index) => (
                <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex items-start">
                    <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-800 mb-3">{question}</p>
                      <div className="flex space-x-3">
                        <button
                          onClick={() => alert('Practice answering this question')}
                          className="text-primary hover:text-secondary text-sm font-medium"
                        >
                          💬 Practice Answer
                        </button>
                        <button
                          onClick={() => alert('View tips for this question')}
                          className="text-gray-500 hover:text-gray-700 text-sm font-medium"
                        >
                          💡 Answer Tips
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No interview questions generated for this analysis.</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h5 className="font-semibold text-green-800 mb-2 flex items-center">
                <span className="mr-2">⭐</span>
                STAR Method Tip
              </h5>
              <p className="text-green-700 text-sm">
                Structure your answers using Situation, Task, Action, Result to provide comprehensive responses.
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h5 className="font-semibold text-blue-800 mb-2 flex items-center">
                <span className="mr-2">🎯</span>
                Preparation Strategy
              </h5>
              <p className="text-blue-700 text-sm">
                Practice answering 3-5 questions daily and record yourself to improve delivery.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIRecommendations;
