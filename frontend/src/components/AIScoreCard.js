import React, { useState, useEffect } from 'react';

const AIScoreCard = ({ sessionId }) => {
  const [scoreData, setScoreData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionId) {
      fetchAIScore();
    }
  }, [sessionId]);

  const fetchAIScore = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/ai-score-resume', {
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
        setScoreData(data.score_analysis);
      }
    } catch (error) {
      console.error('Error fetching AI score:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="glass-card p-8 text-center">
        <div className="relative w-16 h-16 mx-auto mb-4">
          <div className="absolute inset-0 border-4 border-charcoal-600 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-amber-500 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p className="text-charcoal-300">Calculating AI scores...</p>
      </div>
    );
  }

  if (!scoreData) {
    return (
      <div className="glass-card p-6 text-center border-amber-500/20">
        <p className="text-amber-400">No AI score data available. Please analyze your resume first.</p>
      </div>
    );
  }

  const getGradeColor = (grade) => {
    if (grade.startsWith('A')) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    if (grade.startsWith('B')) return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    if (grade.startsWith('C')) return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
    return 'text-red-400 bg-red-500/10 border-red-500/20';
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-amber-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getPriorityColor = (priority) => {
    if (priority === 'Critical') return 'bg-red-500/10 text-red-400 border-red-500/20';
    if (priority === 'High') return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
    if (priority === 'Medium') return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
  };

  return (
    <div className="space-y-6">
      {/* Header with Overall Score */}
      <div className="glass-card p-8 border-amber-500/20">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-cream-50 mb-2">🎯 AI Resume Score</h2>
            <p className="text-charcoal-300">Comprehensive analysis using advanced AI algorithms</p>
          </div>
          <div className="text-center mt-4 lg:mt-0">
            <div className="text-6xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent mb-2">{scoreData.overall_score}</div>
            <div className={`inline-block px-6 py-2 rounded-full border-2 ${getGradeColor(scoreData.grade)}`}>
              <span className="text-2xl font-bold">{scoreData.grade}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Scores */}
      <div className="glass-card p-8">
        <h3 className="text-xl font-bold text-cream-100 mb-6">📊 Detailed Score Breakdown</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* ATS Score */}
          <div className="glass-card-hover p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-charcoal-300">ATS Compatibility</span>
              <span className={`text-2xl font-bold ${getScoreColor(scoreData.scores.ats_score)}`}>
                {scoreData.scores.ats_score}
              </span>
            </div>
            <div className="w-full bg-charcoal-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${scoreData.scores.ats_score >= 80 ? 'bg-emerald-500' : scoreData.scores.ats_score >= 60 ? 'bg-amber-500' : scoreData.scores.ats_score >= 40 ? 'bg-orange-500' : 'bg-red-500'}`}
                style={{ width: `${scoreData.scores.ats_score}%` }}
              ></div>
            </div>
            <p className="text-xs text-charcoal-400 mt-2">System compatibility rating</p>
          </div>

          {/* Keyword Score */}
          <div className="glass-card-hover p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-charcoal-300">Keyword Optimization</span>
              <span className={`text-2xl font-bold ${getScoreColor(scoreData.scores.keyword_score)}`}>
                {scoreData.scores.keyword_score}
              </span>
            </div>
            <div className="w-full bg-charcoal-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${scoreData.scores.keyword_score >= 80 ? 'bg-emerald-500' : scoreData.scores.keyword_score >= 60 ? 'bg-amber-500' : scoreData.scores.keyword_score >= 40 ? 'bg-orange-500' : 'bg-red-500'}`}
                style={{ width: `${scoreData.scores.keyword_score}%` }}
              ></div>
            </div>
            <p className="text-xs text-charcoal-400 mt-2">Relevant keyword usage</p>
          </div>

          {/* Impact Score */}
          <div className="glass-card-hover p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-charcoal-300">Impact & Achievements</span>
              <span className={`text-2xl font-bold ${getScoreColor(scoreData.scores.impact_score)}`}>
                {scoreData.scores.impact_score}
              </span>
            </div>
            <div className="w-full bg-charcoal-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${scoreData.scores.impact_score >= 80 ? 'bg-emerald-500' : scoreData.scores.impact_score >= 60 ? 'bg-amber-500' : scoreData.scores.impact_score >= 40 ? 'bg-orange-500' : 'bg-red-500'}`}
                style={{ width: `${scoreData.scores.impact_score}%` }}
              ></div>
            </div>
            <p className="text-xs text-charcoal-400 mt-2">Measurable results shown</p>
          </div>

          {/* Completeness Score */}
          <div className="glass-card-hover p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-charcoal-300">Resume Completeness</span>
              <span className={`text-2xl font-bold ${getScoreColor(scoreData.scores.completeness_score)}`}>
                {scoreData.scores.completeness_score}
              </span>
            </div>
            <div className="w-full bg-charcoal-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${scoreData.scores.completeness_score >= 80 ? 'bg-emerald-500' : scoreData.scores.completeness_score >= 60 ? 'bg-amber-500' : scoreData.scores.completeness_score >= 40 ? 'bg-orange-500' : 'bg-red-500'}`}
                style={{ width: `${scoreData.scores.completeness_score}%` }}
              ></div>
            </div>
            <p className="text-xs text-charcoal-400 mt-2">Essential sections included</p>
          </div>

          {/* Professional Score */}
          <div className="glass-card-hover p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-charcoal-300">Professional Quality</span>
              <span className={`text-2xl font-bold ${getScoreColor(scoreData.scores.professional_score)}`}>
                {scoreData.scores.professional_score}
              </span>
            </div>
            <div className="w-full bg-charcoal-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${scoreData.scores.professional_score >= 80 ? 'bg-emerald-500' : scoreData.scores.professional_score >= 60 ? 'bg-amber-500' : scoreData.scores.professional_score >= 40 ? 'bg-orange-500' : 'bg-red-500'}`}
                style={{ width: `${scoreData.scores.professional_score}%` }}
              ></div>
            </div>
            <p className="text-xs text-charcoal-400 mt-2">Language and formatting</p>
          </div>
        </div>

        {/* Strengths */}
        {scoreData.strengths && scoreData.strengths.length > 0 && (
          <div className="glass-card p-6 mb-6">
            <h4 className="text-lg font-bold text-emerald-400 mb-4 flex items-center gap-2">
              <span>✅</span>
              Your Strengths
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {scoreData.strengths.map((strength, index) => (
                <div key={index} className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
                  <p className="text-emerald-300 text-sm">{strength}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Weaknesses */}
        {scoreData.weaknesses && scoreData.weaknesses.length > 0 && (
          <div className="mb-8">
            <h4 className="text-lg font-bold text-orange-400 mb-4 flex items-center gap-2">
              <span>⚠️</span>
              Areas for Improvement
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {scoreData.weaknesses.map((weakness, index) => (
                <div key={index} className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
                  <p className="text-orange-300 text-sm">{weakness}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Critical Issues */}
        {scoreData.critical_issues && scoreData.critical_issues.length > 0 && (
          <div className="mb-8">
            <h4 className="text-lg font-bold text-red-400 mb-4 flex items-center gap-2">
              <span>🚨</span>
              Critical Issues
            </h4>
            <div className="space-y-3">
              {scoreData.critical_issues.map((issue, index) => (
                <div key={index} className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                  <p className="text-red-300 font-medium">{issue}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {scoreData.recommendations && scoreData.recommendations.length > 0 && (
          <div>
            <h4 className="text-lg font-bold text-amber-400 mb-4 flex items-center gap-2">
              <span>💡</span>
              AI Recommendations
            </h4>
            <div className="space-y-3">
              {scoreData.recommendations.map((rec, index) => (
                <div key={index} className="glass-card-hover p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <h5 className="font-semibold text-cream-100">{rec.title}</h5>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(rec.priority)}`}>
                      {rec.priority}
                    </span>
                  </div>
                  <p className="text-charcoal-200 text-sm mb-2">{rec.suggestion}</p>
                  <div className="flex items-center text-xs text-charcoal-400">
                    <span className="mr-4">📈 Impact: <strong>{rec.expected_impact}</strong></span>
                    <span>⏱️ Effort: <strong>{rec.effort_required}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIScoreCard;
