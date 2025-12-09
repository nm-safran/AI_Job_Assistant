import React, { useState, useEffect } from 'react';
import RealCoursesDisplay from './RealCoursesDisplay';

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
      <div className="glass-card p-8 text-center">
        <div className="relative w-12 h-12 mx-auto mb-4">
          <div className="absolute inset-0 border-4 border-charcoal-600 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-amber-500 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p className="text-charcoal-300">Analyzing skill gaps and generating learning path...</p>
      </div>
    );
  }

  if (!skillGapData) {
    return (
      <div className="glass-card p-6 text-center border border-orange-500/20">
        <p className="text-orange-400">No skill gap analysis available. Please analyze your resume and job description first.</p>
      </div>
    );
  }

  const getReadinessColor = (score) => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 60) return 'bg-amber-500';
    if (score >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getReadinessTextColor = (score) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-amber-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getPriorityColor = (priority) => {
    if (priority === 'Critical' || priority === 'High') return 'bg-red-500/10 text-red-400 border-red-500/20';
    if (priority === 'Medium') return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
  };

  return (
    <div className="glass-card overflow-hidden">
      {/* Header */}
      <div className="p-8">
        <h2 className="text-3xl font-bold text-cream-50 mb-2">📈 Skill Gap Analysis</h2>
        <p className="text-charcoal-300">Personalized learning roadmap to bridge the gap</p>
      </div>

      <div className="p-8 space-y-8">
        {/* Overall Metrics */}
        {skillGapData.gap_metrics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="glass-card-hover text-center p-6 border border-emerald-500/20">
              <div className="text-4xl font-bold text-emerald-400 mb-2">
                {skillGapData.gap_metrics.overall_match_percentage}%
              </div>
              <div className="text-cream-100 font-medium">Overall Match</div>
              <div className="text-charcoal-400 text-xs mt-1">Current skill alignment</div>
            </div>

            <div className="glass-card-hover text-center p-6 border border-amber-500/20">
              <div className="text-4xl font-bold text-amber-400 mb-2">
                {skillGapData.gap_metrics.total_gaps || skillGapData.prioritized_skills?.length || 0}
              </div>
              <div className="text-cream-100 font-medium">Skill Gaps</div>
              <div className="text-charcoal-400 text-xs mt-1">Skills to develop</div>
            </div>

            <div className="glass-card-hover text-center p-6 border border-red-500/20">
              <div className="text-4xl font-bold text-red-400 mb-2">
                {skillGapData.gap_metrics.critical_gaps || 0}
              </div>
              <div className="text-cream-100 font-medium">Critical Gaps</div>
              <div className="text-charcoal-400 text-xs mt-1">High priority items</div>
            </div>

            <div className="glass-card-hover text-center p-6 border border-emerald-500/20">
              <div className="text-4xl font-bold text-emerald-400 mb-2">
                {skillGapData.learning_roadmap?.estimated_weeks || 0}
              </div>
              <div className="text-cream-100 font-medium">Weeks to Learn</div>
              <div className="text-charcoal-400 text-xs mt-1">Estimated timeline</div>
            </div>
          </div>
        )}

        {/* Prioritized Skills */}
        {skillGapData.prioritized_skills && skillGapData.prioritized_skills.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold text-cream-100 mb-6 flex items-center">
              <span className="mr-3">🎯</span>
              Skills You Need to Develop
            </h3>

            <div className="space-y-4">
              {skillGapData.prioritized_skills.map((skill, index) => (
                <div
                  key={index}
                  className="glass-card-hover p-6"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                    <div className="flex items-center mb-3 lg:mb-0">
                      <div className="bg-amber-500 text-charcoal-900 rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold mr-4">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-cream-100">{skill.skill}</h4>
                        {skill.category && (
                          <span className="text-sm text-charcoal-400">{skill.category}</span>
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
                        <div className="text-xs text-charcoal-400">Readiness</div>
                      </div>
                    </div>
                  </div>

                  {/* Readiness Progress Bar */}
                  <div className="mb-4">
                    <div className="w-full bg-charcoal-700 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full ${getReadinessColor(skill.readiness_score)}`}
                        style={{ width: `${skill.readiness_score}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Reason & Learning Path */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {skill.reason && (
                      <div className="glass-card p-4 border border-orange-500/20">
                        <h5 className="text-sm font-semibold text-orange-400 mb-2 flex items-center">
                          <span className="mr-2">📝</span>
                          Why This Skill?
                        </h5>
                        <p className="text-charcoal-200 text-sm">{skill.reason}</p>
                      </div>
                    )}

                    {skill.learning_path && (
                      <div className="glass-card p-4 border border-amber-500/20">
                        <h5 className="text-sm font-semibold text-amber-400 mb-2 flex items-center">
                          <span className="mr-2">🎓</span>
                          Learning Path
                        </h5>
                        <p className="text-charcoal-200 text-sm">{skill.learning_path}</p>
                      </div>
                    )}
                  </div>

                  {/* Resources & Timeline */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {skill.resources && skill.resources.length > 0 && (
                      <div>
                        <h5 className="text-sm font-semibold text-cream-100 mb-2 flex items-center">
                          <span className="mr-2">📚</span>
                          Recommended Resources
                        </h5>
                        <ul className="space-y-1">
                          {skill.resources.map((resource, i) => (
                            <li key={i} className="text-charcoal-200 text-sm flex items-start">
                              <span className="text-amber-400 mr-2 mt-0.5">•</span>
                              {resource}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {skill.estimated_time && (
                      <div className="glass-card flex items-center justify-center p-4 border border-emerald-500/20">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-emerald-400 mb-1">
                            {skill.estimated_time}
                          </div>
                          <div className="text-sm text-charcoal-300 font-medium">Estimated Learning Time</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Real Courses from Kaggle Datasets */}
                  {skill.real_courses && skill.real_courses.length > 0 && (
                    <RealCoursesDisplay courses={skill.real_courses} skill={skill.skill} />
                  )}

                  {/* Market Data */}
                  {skill.market_demand && (
                    <div className="mt-4 grid grid-cols-3 gap-3">
                      <div className="glass-card-hover text-center p-3">
                        <div className="text-sm text-charcoal-300 font-medium">Market Demand</div>
                        <div className="text-lg font-bold text-amber-400">{skill.market_demand}</div>
                      </div>
                      {skill.salary_impact && (
                        <div className="glass-card-hover text-center p-3">
                          <div className="text-sm text-charcoal-300 font-medium">Salary Impact</div>
                          <div className="text-lg font-bold text-emerald-400">{skill.salary_impact}</div>
                        </div>
                      )}
                      {skill.growth_trend && (
                        <div className="glass-card-hover text-center p-3">
                          <div className="text-sm text-charcoal-300 font-medium">Growth Trend</div>
                          <div className="text-lg font-bold text-amber-400">{skill.growth_trend}</div>
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
            <h3 className="text-2xl font-bold text-cream-100 mb-6 flex items-center">
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
                    ? 'bg-amber-500 text-charcoal-900 shadow-glow scale-105'
                    : 'glass-card-hover text-cream-100'
                    }`}
                >
                  Phase {phase.phase}: {phase.phase_name}
                </button>
              ))}
            </div>

            {/* Active Phase Details */}
            {skillGapData.learning_roadmap.phases[activePhase] && (
              <div className="glass-card p-8 border border-amber-500/20">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-2xl font-bold text-cream-100">
                    Phase {skillGapData.learning_roadmap.phases[activePhase].phase}: {' '}
                    {skillGapData.learning_roadmap.phases[activePhase].phase_name}
                  </h4>
                  <span className="bg-amber-500 text-charcoal-900 px-4 py-2 rounded-full font-bold">
                    {skillGapData.learning_roadmap.phases[activePhase].duration}
                  </span>
                </div>

                <p className="text-charcoal-200 mb-6 text-lg">
                  {skillGapData.learning_roadmap.phases[activePhase].description}
                </p>

                {/* Skills in Phase */}
                {skillGapData.learning_roadmap.phases[activePhase].skills && (
                  <div className="mb-6">
                    <h5 className="font-semibold text-cream-100 mb-3 flex items-center">
                      <span className="mr-2">🎯</span>
                      Skills to Master
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {skillGapData.learning_roadmap.phases[activePhase].skills.map((skill, i) => (
                        <span
                          key={i}
                          className="bg-amber-500/10 border border-amber-500/20 text-amber-400 px-4 py-2 rounded-full font-medium"
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
                    <h5 className="font-semibold text-cream-100 mb-4 flex items-center">
                      <span className="mr-2">🏆</span>
                      Weekly Milestones
                    </h5>
                    <div className="space-y-3">
                      {skillGapData.learning_roadmap.phases[activePhase].milestones.map((milestone, i) => (
                        <div key={i} className="glass-card-hover flex items-start p-4">
                          <div className="bg-amber-500 text-charcoal-900 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 flex-shrink-0">
                            W{i + 1}
                          </div>
                          <p className="text-charcoal-200 flex-1">{milestone}</p>
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
            <div className="glass-card p-6 border border-emerald-500/20">
              <h4 className="text-xl font-bold text-emerald-400 mb-4 flex items-center">
                <span className="mr-2">⚡</span>
                Quick Wins (Start Here!)
              </h4>
              <p className="text-charcoal-200 text-sm mb-4">
                These skills are easier to learn and will boost your profile quickly.
              </p>
              <ul className="space-y-2">
                {skillGapData.quick_wins.map((win, index) => (
                  <li key={index} className="text-charcoal-200 flex items-start">
                    <span className="text-emerald-400 mr-2 mt-1">✓</span>
                    {win}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {skillGapData.long_term_goals && skillGapData.long_term_goals.length > 0 && (
            <div className="glass-card p-6 border border-amber-500/20">
              <h4 className="text-xl font-bold text-amber-400 mb-4 flex items-center">
                <span className="mr-2">🎯</span>
                Long-term Goals
              </h4>
              <p className="text-charcoal-200 text-sm mb-4">
                These advanced skills will significantly boost your career prospects.
              </p>
              <ul className="space-y-2">
                {skillGapData.long_term_goals.map((goal, index) => (
                  <li key={index} className="text-charcoal-200 flex items-start">
                    <span className="text-amber-400 mr-2 mt-1">◉</span>
                    {goal}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Success Metrics */}
        {skillGapData.learning_roadmap?.success_metrics && (
          <div className="glass-card p-6 border border-amber-500/20">
            <h4 className="text-xl font-bold text-amber-400 mb-4 flex items-center">
              <span className="mr-2">📊</span>
              Success Metrics
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {skillGapData.learning_roadmap.success_metrics.map((metric, index) => (
                <div key={index} className="glass-card-hover p-3">
                  <p className="text-charcoal-200 text-sm">{metric}</p>
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
