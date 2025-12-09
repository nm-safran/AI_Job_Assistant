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
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Calculating AI scores...</p>
      </div>
    );
  }

  if (!scoreData) {
    return (
      <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6 text-center">
        <p className="text-yellow-800">No AI score data available. Please analyze your resume first.</p>
      </div>
    );
  }

  const getGradeColor = (grade) => {
    if (grade.startsWith('A')) return 'text-green-600 bg-green-50 border-green-200';
    if (grade.startsWith('B')) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (grade.startsWith('C')) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPriorityColor = (priority) => {
    if (priority === 'Critical') return 'bg-red-100 text-red-800 border-red-300';
    if (priority === 'High') return 'bg-orange-100 text-orange-800 border-orange-300';
    if (priority === 'Medium') return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-blue-100 text-blue-800 border-blue-300';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header with Overall Score */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-8">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">🎯 AI Resume Score</h2>
            <p className="text-purple-100">Comprehensive analysis using advanced AI algorithms</p>
          </div>
          <div className="text-center mt-4 lg:mt-0">
            <div className="text-6xl font-bold mb-2">{scoreData.overall_score}</div>
            <div className={`inline-block px-6 py-2 rounded-full border-2 ${getGradeColor(scoreData.grade)}`}>
              <span className="text-2xl font-bold">{scoreData.grade}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Scores */}
      <div className="p-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6">📊 Detailed Score Breakdown</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* ATS Score */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-600">ATS Compatibility</span>
              <span className={`text-2xl font-bold ${getScoreColor(scoreData.scores.ats_score)}`}>
                {scoreData.scores.ats_score}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${scoreData.scores.ats_score >= 80 ? 'bg-green-500' : scoreData.scores.ats_score >= 60 ? 'bg-blue-500' : scoreData.scores.ats_score >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                style={{ width: `${scoreData.scores.ats_score}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">System compatibility rating</p>
          </div>

          {/* Keyword Score */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-600">Keyword Optimization</span>
              <span className={`text-2xl font-bold ${getScoreColor(scoreData.scores.keyword_score)}`}>
                {scoreData.scores.keyword_score}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${scoreData.scores.keyword_score >= 80 ? 'bg-green-500' : scoreData.scores.keyword_score >= 60 ? 'bg-blue-500' : scoreData.scores.keyword_score >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                style={{ width: `${scoreData.scores.keyword_score}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Relevant keyword usage</p>
          </div>

          {/* Impact Score */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-600">Impact & Achievements</span>
              <span className={`text-2xl font-bold ${getScoreColor(scoreData.scores.impact_score)}`}>
                {scoreData.scores.impact_score}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${scoreData.scores.impact_score >= 80 ? 'bg-green-500' : scoreData.scores.impact_score >= 60 ? 'bg-blue-500' : scoreData.scores.impact_score >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                style={{ width: `${scoreData.scores.impact_score}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Measurable results shown</p>
          </div>

          {/* Completeness Score */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-600">Resume Completeness</span>
              <span className={`text-2xl font-bold ${getScoreColor(scoreData.scores.completeness_score)}`}>
                {scoreData.scores.completeness_score}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${scoreData.scores.completeness_score >= 80 ? 'bg-green-500' : scoreData.scores.completeness_score >= 60 ? 'bg-blue-500' : scoreData.scores.completeness_score >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                style={{ width: `${scoreData.scores.completeness_score}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Essential sections included</p>
          </div>

          {/* Professional Score */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-600">Professional Quality</span>
              <span className={`text-2xl font-bold ${getScoreColor(scoreData.scores.professional_score)}`}>
                {scoreData.scores.professional_score}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${scoreData.scores.professional_score >= 80 ? 'bg-green-500' : scoreData.scores.professional_score >= 60 ? 'bg-blue-500' : scoreData.scores.professional_score >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                style={{ width: `${scoreData.scores.professional_score}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Language and formatting</p>
          </div>
        </div>

        {/* Strengths */}
        {scoreData.strengths && scoreData.strengths.length > 0 && (
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
              <span className="mr-2">✅</span>
              Your Strengths
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {scoreData.strengths.map((strength, index) => (
                <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 text-sm">{strength}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Weaknesses */}
        {scoreData.weaknesses && scoreData.weaknesses.length > 0 && (
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-red-800 mb-4 flex items-center">
              <span className="mr-2">⚠️</span>
              Areas for Improvement
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {scoreData.weaknesses.map((weakness, index) => (
                <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800 text-sm">{weakness}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Critical Issues */}
        {scoreData.critical_issues && scoreData.critical_issues.length > 0 && (
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-red-900 mb-4 flex items-center">
              <span className="mr-2">🚨</span>
              Critical Issues
            </h4>
            <div className="space-y-3">
              {scoreData.critical_issues.map((issue, index) => (
                <div key={index} className="bg-red-100 border-2 border-red-300 rounded-lg p-4">
                  <p className="text-red-900 font-medium">{issue}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {scoreData.recommendations && scoreData.recommendations.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
              <span className="mr-2">💡</span>
              AI Recommendations
            </h4>
            <div className="space-y-4">
              {scoreData.recommendations.map((rec, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <h5 className="font-semibold text-gray-800">{rec.title}</h5>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(rec.priority)}`}>
                      {rec.priority}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm mb-2">{rec.suggestion}</p>
                  <div className="flex items-center text-xs text-gray-500">
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
