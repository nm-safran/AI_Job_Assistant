import React, { useState, useEffect } from 'react';

const JobClassification = ({ sessionId }) => {
  const [classification, setClassification] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionId) {
      fetchJobClassification();
    }
  }, [sessionId]);

  const fetchJobClassification = async () => {
    setLoading(true);
    try {
      // First get the session data to get job description
      const sessionResponse = await fetch(`http://localhost:5000/api/session-history/${sessionId}`);
      const sessionData = await sessionResponse.json();

      if (!sessionData.success || !sessionData.sessions || sessionData.sessions.length === 0) {
        console.error('No session data found');
        setLoading(false);
        return;
      }

      const session = sessionData.sessions[0];

      // Now classify the job
      const response = await fetch('http://localhost:5000/api/classify-job', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId,
          job_description: session.job_description || '',
          job_title: ''
        }),
      });

      const data = await response.json();
      if (data.success) {
        setClassification(data.classification);
      }
    } catch (error) {
      console.error('Error fetching job classification:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Analyzing job description with NLP...</p>
      </div>
    );
  }

  if (!classification) {
    return (
      <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6 text-center">
        <p className="text-yellow-800">No job classification data available. Please ensure you've entered a job description.</p>
      </div>
    );
  }

  const getLevelColor = (level) => {
    if (level.includes('Entry')) return 'bg-green-100 text-green-800 border-green-300';
    if (level.includes('Mid')) return 'bg-blue-100 text-blue-800 border-blue-300';
    if (level.includes('Senior')) return 'bg-purple-100 text-purple-800 border-purple-300';
    return 'bg-orange-100 text-orange-800 border-orange-300';
  };

  const getSentimentColor = (sentiment) => {
    if (sentiment === 'Positive') return 'text-green-600';
    if (sentiment === 'Neutral') return 'text-gray-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-8">
        <h2 className="text-3xl font-bold mb-2">🔍 NLP Job Analysis</h2>
        <p className="text-indigo-100">Advanced AI-powered job description classification</p>
      </div>

      <div className="p-8 space-y-8">
        {/* Industry & Level */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border-2 border-indigo-200 rounded-xl p-6 bg-indigo-50">
            <h3 className="text-sm font-medium text-indigo-600 mb-2">INDUSTRY CLASSIFICATION</h3>
            <div className="text-2xl font-bold text-indigo-900 mb-2">{classification.industry}</div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-indigo-700">Confidence:</span>
              <span className="text-lg font-semibold text-indigo-800">{classification.confidence}%</span>
            </div>
            <div className="w-full bg-indigo-200 rounded-full h-2 mt-2">
              <div
                className="bg-indigo-600 h-2 rounded-full"
                style={{ width: `${classification.confidence}%` }}
              ></div>
            </div>
          </div>

          <div className="border-2 border-purple-200 rounded-xl p-6 bg-purple-50">
            <h3 className="text-sm font-medium text-purple-600 mb-2">EXPERIENCE LEVEL</h3>
            <div className={`inline-block px-4 py-2 rounded-lg border-2 ${getLevelColor(classification.job_level)} text-lg font-bold mb-2`}>
              {classification.job_level}
            </div>
            {classification.years_of_experience && (
              <div className="text-sm text-purple-700 mt-2">
                Required: <strong>{classification.years_of_experience}</strong>
              </div>
            )}
          </div>
        </div>

        {/* Related Industries */}
        {classification.related_industries && classification.related_industries.length > 0 && (
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">🏢</span>
              Related Industries
            </h3>
            <div className="flex flex-wrap gap-2">
              {classification.related_industries.map((industry, index) => (
                <span key={index} className="bg-white border border-gray-300 text-gray-700 px-3 py-1 rounded-full text-sm">
                  {industry}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Requirements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Must-Have Requirements */}
          {classification.requirements?.must_have && classification.requirements.must_have.length > 0 && (
            <div className="border-2 border-red-200 rounded-xl p-6 bg-red-50">
              <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center">
                <span className="mr-2">⭐</span>
                Must-Have Requirements
              </h3>
              <ul className="space-y-2">
                {classification.requirements.must_have.map((req, index) => (
                  <li key={index} className="text-red-700 text-sm flex items-start">
                    <span className="text-red-500 mr-2 mt-0.5">•</span>
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Nice-to-Have Requirements */}
          {classification.requirements?.nice_to_have && classification.requirements.nice_to_have.length > 0 && (
            <div className="border-2 border-blue-200 rounded-xl p-6 bg-blue-50">
              <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                <span className="mr-2">💎</span>
                Nice-to-Have Requirements
              </h3>
              <ul className="space-y-2">
                {classification.requirements.nice_to_have.map((req, index) => (
                  <li key={index} className="text-blue-700 text-sm flex items-start">
                    <span className="text-blue-500 mr-2 mt-0.5">•</span>
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Technical & Soft Skills */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {classification.technical_skills && classification.technical_skills.length > 0 && (
            <div className="bg-green-50 rounded-xl p-6 border border-green-200">
              <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
                <span className="mr-2">💻</span>
                Technical Skills Required
              </h3>
              <div className="flex flex-wrap gap-2">
                {classification.technical_skills.map((skill, index) => (
                  <span key={index} className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {classification.soft_skills && classification.soft_skills.length > 0 && (
            <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
              <h3 className="text-lg font-semibold text-yellow-800 mb-4 flex items-center">
                <span className="mr-2">🤝</span>
                Soft Skills Required
              </h3>
              <div className="flex flex-wrap gap-2">
                {classification.soft_skills.map((skill, index) => (
                  <span key={index} className="bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Key Highlights */}
        {classification.key_highlights && classification.key_highlights.length > 0 && (
          <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
            <h3 className="text-lg font-semibold text-purple-800 mb-4 flex items-center">
              <span className="mr-2">✨</span>
              Key Highlights
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {classification.key_highlights.map((highlight, index) => (
                <div key={index} className="bg-white border border-purple-200 rounded-lg p-3">
                  <p className="text-purple-700 text-sm">{highlight}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Work Arrangement & Company Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {classification.work_arrangement && (
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-2xl mb-2">🏠</div>
              <div className="font-semibold text-blue-900">{classification.work_arrangement}</div>
              <div className="text-xs text-blue-700 mt-1">Work Arrangement</div>
            </div>
          )}

          {classification.company_type && (
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-2xl mb-2">🏢</div>
              <div className="font-semibold text-green-900">{classification.company_type}</div>
              <div className="text-xs text-green-700 mt-1">Company Type</div>
            </div>
          )}

          {classification.complexity_score && (
            <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="text-2xl mb-2">📊</div>
              <div className="font-semibold text-orange-900">{classification.complexity_score}/10</div>
              <div className="text-xs text-orange-700 mt-1">Job Complexity</div>
            </div>
          )}
        </div>

        {/* Sentiment Analysis */}
        {classification.sentiment && (
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">😊</span>
              Job Posting Analysis
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                <span className="text-gray-700">Overall Sentiment:</span>
                <span className={`font-bold ${getSentimentColor(classification.sentiment.overall)}`}>
                  {classification.sentiment.overall}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                <span className="text-gray-700">Tone:</span>
                <span className="font-semibold text-gray-800">{classification.sentiment.tone}</span>
              </div>
            </div>
            {classification.sentiment.urgency_level && (
              <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Urgency Level:</span>
                  <span className="font-semibold text-gray-800">{classification.sentiment.urgency_level}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobClassification;
