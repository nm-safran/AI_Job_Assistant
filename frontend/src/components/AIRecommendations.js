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
      <div className="glass-card p-8 text-center">
        <div className="relative w-12 h-12 mx-auto mb-4">
          <div className="absolute inset-0 border-4 border-charcoal-600 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-amber-500 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p className="text-charcoal-300">Loading AI recommendations...</p>
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
      <div className="glass-card p-8 text-center">
        <h2 className="text-2xl font-bold text-cream-50 mb-2">🚀 AI-Powered Recommendations</h2>
        <p className="text-charcoal-300">Personalized suggestions to improve your job match</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-charcoal-700">
        {[
          { key: 'skills', name: 'Skill Development', icon: '🛠️' },
          { key: 'plan', name: 'Learning Plan', icon: '📅' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center px-6 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === tab.key
              ? 'border-amber-500 text-amber-400'
              : 'border-transparent text-charcoal-400 hover:text-cream-100'
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
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold text-cream-100 mb-4 flex items-center">
              <span className="mr-2">🎯</span>
              Skill Gap Analysis
            </h3>
            <p className="text-charcoal-200">
              Based on the job requirements, here are the key skills you should focus on developing:
            </p>
          </div>

          {ai_recommendations && ai_recommendations.length > 0 ? (
            <div className="grid gap-6">
              {ai_recommendations.map((rec, index) => (
                <div key={index} className="glass-card-hover p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                    <div className="flex items-center mb-3 lg:mb-0">
                      <div className={`w-3 h-3 rounded-full mr-3 ${rec.priority === 'High' ? 'bg-red-500' : 'bg-amber-500'
                        }`}></div>
                      <h4 className="text-lg font-semibold text-cream-100">{rec.skill}</h4>
                      <span className="ml-3 bg-charcoal-800/40 text-charcoal-300 px-2 py-1 rounded text-sm border border-charcoal-700">
                        {rec.level}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-charcoal-400">Priority:</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium border ${rec.priority === 'High'
                        ? 'bg-red-500/10 text-red-400 border-red-500/20'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}>
                        {rec.priority}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <h5 className="font-medium text-cream-100 mb-2 flex items-center">
                        <span className="text-amber-400 mr-2">📚</span>
                        Recommended Courses
                      </h5>
                      <ul className="space-y-1">
                        {rec.courses.map((course, i) => (
                          <li key={i} className="text-sm text-charcoal-200 flex items-start">
                            <span className="text-charcoal-500 mr-2 mt-1">•</span>
                            {course}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h5 className="font-medium text-cream-100 mb-2 flex items-center">
                        <span className="text-emerald-400 mr-2">💼</span>
                        Practice Projects
                      </h5>
                      <ul className="space-y-1">
                        {rec.projects.map((project, i) => (
                          <li key={i} className="text-sm text-charcoal-200 flex items-start">
                            <span className="text-charcoal-500 mr-2 mt-1">•</span>
                            {project}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h5 className="font-medium text-cream-100 mb-2 flex items-center">
                        <span className="text-amber-400 mr-2">🎯</span>
                        Practice Areas
                      </h5>
                      <ul className="space-y-1">
                        {rec.practice.map((practice, i) => (
                          <li key={i} className="text-sm text-charcoal-200 flex items-start">
                            <span className="text-charcoal-500 mr-2 mt-1">•</span>
                            {practice}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-charcoal-700">
                    <span className="text-sm text-charcoal-400">
                      Timeline: <strong>{rec.timeline}</strong>
                    </span>
                    <button
                      onClick={() => alert(`Learning resources for ${rec.skill} would open here`)}
                      className="btn-ghost text-sm font-medium"
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
          <div className="glass-card p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
              <h3 className="text-xl font-bold text-cream-100 mb-2 lg:mb-0">
                📅 Personalized Learning Plan
              </h3>
              <div className="bg-charcoal-800/40 px-3 py-1 rounded-full border border-charcoal-700">
                <span className="text-amber-400 font-medium">{improvement_plan.timeline}</span>
              </div>
            </div>
            <p className="text-charcoal-300">
              {improvement_plan.expected_outcome}
            </p>
          </div>

          {improvement_plan.weekly_goals && improvement_plan.weekly_goals.length > 0 ? (
            <div className="space-y-4">
              <h4 className="font-bold text-cream-100 text-lg">Weekly Breakdown</h4>
              {improvement_plan.weekly_goals.map((goal, index) => (
                <div key={index} className="flex items-start space-x-4 glass-card-hover p-4 rounded-lg">
                  <div className="bg-amber-500 text-charcoal-900 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">
                    W{index + 1}
                  </div>
                  <p className="text-charcoal-200 flex-1">{goal}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No learning plan available for this analysis.</p>
            </div>
          )}

          {improvement_plan.resources_needed && improvement_plan.resources_needed.length > 0 && (
            <div className="glass-card p-6">
              <h4 className="font-bold text-amber-400 mb-3 flex items-center">
                <span className="mr-2">📋</span>
                Required Resources
              </h4>
              <ul className="space-y-2">
                {improvement_plan.resources_needed.map((resource, index) => (
                  <li key={index} className="text-charcoal-200 flex items-start">
                    <span className="text-amber-400 mr-2 mt-1">•</span>
                    {resource}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {improvement_plan.success_metrics && improvement_plan.success_metrics.length > 0 && (
            <div className="glass-card p-6">
              <h4 className="font-bold text-emerald-400 mb-3 flex items-center">
                <span className="mr-2">🎯</span>
                Success Metrics
              </h4>
              <ul className="space-y-2">
                {improvement_plan.success_metrics.map((metric, index) => (
                  <li key={index} className="text-charcoal-200 flex items-start">
                    <span className="text-emerald-400 mr-2 mt-1">✓</span>
                    {metric}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}


    </div>
  );
};

export default AIRecommendations;
