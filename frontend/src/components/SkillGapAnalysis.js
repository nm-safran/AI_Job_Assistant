import React, { useState, useEffect } from 'react';

const SkillGapAnalysis = ({ sessionId }) => {
  const [skillGapData, setSkillGapData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activePhase, setActivePhase] = useState(0);

  useEffect(() => {
    if (sessionId) {
      fetchSkillGapAnalysis();
    }
  }, [sessionId]);

  const fetchSkillGapAnalysis = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/analyze-skill-gaps', {
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
        setSkillGapData(data.skill_gap_analysis);
      }
    } catch (error) {
      console.error('Error fetching skill gap analysis:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Analyzing skill gaps and generating learning path...</p>
      </div>
    );
  }

  if (!skillGapData) {
    return (
      <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6 text-center">
        <p className="text-yellow-800">No skill gap analysis available. Please analyze your resume and job description first.</p>
      </div>
    );
  }

  const getReadinessColor = (score) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-blue-500';
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getReadinessTextColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPriorityColor = (priority) => {
    if (priority === 'Critical' || priority === 'High') return 'bg-red-100 text-red-800 border-red-300';
    if (priority === 'Medium') return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-blue-100 text-blue-800 border-blue-300';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-8">
        <h2 className="text-3xl font-bold mb-2">📈 Skill Gap Analysis</h2>
        <p className="text-orange-100">Personalized learning roadmap to bridge the gap</p>
      </div>

      <div className="p-8 space-y-8">
        {/* Overall Metrics */}
        {skillGapData.gap_metrics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-blue-50 rounded-xl border-2 border-blue-200">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {skillGapData.gap_metrics.overall_match_percentage}%
              </div>
              <div className="text-blue-800 font-medium">Overall Match</div>
              <div className="text-blue-600 text-xs mt-1">Current skill alignment</div>
            </div>

            <div className="text-center p-6 bg-red-50 rounded-xl border-2 border-red-200">
              <div className="text-4xl font-bold text-red-600 mb-2">
                {skillGapData.gap_metrics.total_gaps || skillGapData.prioritized_skills?.length || 0}
              </div>
              <div className="text-red-800 font-medium">Skill Gaps</div>
              <div className="text-red-600 text-xs mt-1">Skills to develop</div>
            </div>

            <div className="text-center p-6 bg-orange-50 rounded-xl border-2 border-orange-200">
              <div className="text-4xl font-bold text-orange-600 mb-2">
                {skillGapData.gap_metrics.critical_gaps || 0}
              </div>
              <div className="text-orange-800 font-medium">Critical Gaps</div>
              <div className="text-orange-600 text-xs mt-1">High priority items</div>
            </div>

            <div className="text-center p-6 bg-green-50 rounded-xl border-2 border-green-200">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {skillGapData.learning_roadmap?.estimated_weeks || 0}
              </div>
              <div className="text-green-800 font-medium">Weeks to Learn</div>
              <div className="text-green-600 text-xs mt-1">Estimated timeline</div>
            </div>
          </div>
        )}

        {/* Prioritized Skills */}
        {skillGapData.prioritized_skills && skillGapData.prioritized_skills.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <span className="mr-3">🎯</span>
              Skills You Need to Develop
            </h3>

            <div className="space-y-4">
              {skillGapData.prioritized_skills.map((skill, index) => (
                <div
                  key={index}
                  className="border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                    <div className="flex items-center mb-3 lg:mb-0">
                      <div className="bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold mr-4">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-gray-800">{skill.skill}</h4>
                        {skill.category && (
                          <span className="text-sm text-gray-600">{skill.category}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getPriorityColor(skill.priority)}`}>
                        {skill.priority} Priority
                      </span>
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${getReadinessTextColor(skill.readiness_score)}`}>
                          {skill.readiness_score}%
                        </div>
                        <div className="text-xs text-gray-500">Readiness</div>
                      </div>
                    </div>
                  </div>

                  {/* Readiness Progress Bar */}
                  <div className="mb-4">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full ${getReadinessColor(skill.readiness_score)}`}
                        style={{ width: `${skill.readiness_score}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Reason & Learning Path */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {skill.reason && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <h5 className="text-sm font-semibold text-yellow-800 mb-2 flex items-center">
                          <span className="mr-2">📝</span>
                          Why This Skill?
                        </h5>
                        <p className="text-yellow-700 text-sm">{skill.reason}</p>
                      </div>
                    )}

                    {skill.learning_path && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h5 className="text-sm font-semibold text-blue-800 mb-2 flex items-center">
                          <span className="mr-2">🎓</span>
                          Learning Path
                        </h5>
                        <p className="text-blue-700 text-sm">{skill.learning_path}</p>
                      </div>
                    )}
                  </div>

                  {/* Resources & Timeline */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {skill.resources && skill.resources.length > 0 && (
                      <div>
                        <h5 className="text-sm font-semibold text-gray-800 mb-2 flex items-center">
                          <span className="mr-2">📚</span>
                          Recommended Resources
                        </h5>
                        <ul className="space-y-1">
                          {skill.resources.map((resource, i) => (
                            <li key={i} className="text-gray-700 text-sm flex items-start">
                              <span className="text-primary mr-2 mt-0.5">•</span>
                              {resource}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {skill.estimated_time && (
                      <div className="flex items-center justify-center p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-green-600 mb-1">
                            {skill.estimated_time}
                          </div>
                          <div className="text-sm text-green-800 font-medium">Estimated Learning Time</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Market Data */}
                  {skill.market_demand && (
                    <div className="mt-4 grid grid-cols-3 gap-3">
                      <div className="text-center p-3 bg-purple-50 border border-purple-200 rounded-lg">
                        <div className="text-sm text-purple-600 font-medium">Market Demand</div>
                        <div className="text-lg font-bold text-purple-800">{skill.market_demand}</div>
                      </div>
                      {skill.salary_impact && (
                        <div className="text-center p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="text-sm text-green-600 font-medium">Salary Impact</div>
                          <div className="text-lg font-bold text-green-800">{skill.salary_impact}</div>
                        </div>
                      )}
                      {skill.growth_trend && (
                        <div className="text-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="text-sm text-blue-600 font-medium">Growth Trend</div>
                          <div className="text-lg font-bold text-blue-800">{skill.growth_trend}</div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Learning Roadmap */}
        {skillGapData.learning_roadmap && skillGapData.learning_roadmap.phases && (
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <span className="mr-3">🗺️</span>
              Your Learning Roadmap
            </h3>

            {/* Phase Selector */}
            <div className="flex flex-wrap gap-3 mb-6">
              {skillGapData.learning_roadmap.phases.map((phase, index) => (
                <button
                  key={index}
                  onClick={() => setActivePhase(index)}
                  className={`px-6 py-3 rounded-lg font-medium transition-all ${activePhase === index
                    ? 'bg-primary text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  Phase {phase.phase}: {phase.phase_name}
                </button>
              ))}
            </div>

            {/* Active Phase Details */}
            {skillGapData.learning_roadmap.phases[activePhase] && (
              <div className="border-2 border-primary rounded-xl p-8 bg-gradient-to-br from-blue-50 to-purple-50">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-2xl font-bold text-gray-800">
                    Phase {skillGapData.learning_roadmap.phases[activePhase].phase}: {' '}
                    {skillGapData.learning_roadmap.phases[activePhase].phase_name}
                  </h4>
                  <span className="bg-primary text-white px-4 py-2 rounded-full font-bold">
                    {skillGapData.learning_roadmap.phases[activePhase].duration}
                  </span>
                </div>

                <p className="text-gray-700 mb-6 text-lg">
                  {skillGapData.learning_roadmap.phases[activePhase].description}
                </p>

                {/* Skills in Phase */}
                {skillGapData.learning_roadmap.phases[activePhase].skills && (
                  <div className="mb-6">
                    <h5 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <span className="mr-2">🎯</span>
                      Skills to Master
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {skillGapData.learning_roadmap.phases[activePhase].skills.map((skill, i) => (
                        <span
                          key={i}
                          className="bg-white border-2 border-primary text-primary px-4 py-2 rounded-full font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Milestones */}
                {skillGapData.learning_roadmap.phases[activePhase].milestones && (
                  <div>
                    <h5 className="font-semibold text-gray-800 mb-4 flex items-center">
                      <span className="mr-2">🏆</span>
                      Weekly Milestones
                    </h5>
                    <div className="space-y-3">
                      {skillGapData.learning_roadmap.phases[activePhase].milestones.map((milestone, i) => (
                        <div key={i} className="flex items-start bg-white rounded-lg p-4 border border-gray-200">
                          <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 flex-shrink-0">
                            W{i + 1}
                          </div>
                          <p className="text-gray-700 flex-1">{milestone}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Quick Wins & Long-term Goals */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {skillGapData.quick_wins && skillGapData.quick_wins.length > 0 && (
            <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200">
              <h4 className="text-xl font-bold text-green-800 mb-4 flex items-center">
                <span className="mr-2">⚡</span>
                Quick Wins (Start Here!)
              </h4>
              <p className="text-green-700 text-sm mb-4">
                These skills are easier to learn and will boost your profile quickly.
              </p>
              <ul className="space-y-2">
                {skillGapData.quick_wins.map((win, index) => (
                  <li key={index} className="text-green-700 flex items-start">
                    <span className="text-green-500 mr-2 mt-1">✓</span>
                    {win}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {skillGapData.long_term_goals && skillGapData.long_term_goals.length > 0 && (
            <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
              <h4 className="text-xl font-bold text-blue-800 mb-4 flex items-center">
                <span className="mr-2">🎯</span>
                Long-term Goals
              </h4>
              <p className="text-blue-700 text-sm mb-4">
                These advanced skills will significantly boost your career prospects.
              </p>
              <ul className="space-y-2">
                {skillGapData.long_term_goals.map((goal, index) => (
                  <li key={index} className="text-blue-700 flex items-start">
                    <span className="text-blue-500 mr-2 mt-1">◉</span>
                    {goal}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Success Metrics */}
        {skillGapData.learning_roadmap?.success_metrics && (
          <div className="bg-purple-50 rounded-xl p-6 border-2 border-purple-200">
            <h4 className="text-xl font-bold text-purple-800 mb-4 flex items-center">
              <span className="mr-2">📊</span>
              Success Metrics
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {skillGapData.learning_roadmap.success_metrics.map((metric, index) => (
                <div key={index} className="bg-white border border-purple-200 rounded-lg p-3">
                  <p className="text-purple-700 text-sm">{metric}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillGapAnalysis;
