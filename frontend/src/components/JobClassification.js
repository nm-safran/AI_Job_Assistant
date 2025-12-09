import React, { useState, useEffect } from 'react';

const JobClassification = ({ sessionId, jobDescription }) => {
  const [classification, setClassification] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionId) {
      fetchJobClassification();
    }
  }, [sessionId, jobDescription]);

  const fetchJobClassification = async () => {
    setLoading(true);
    try {
      // Use the passed jobDescription or fallback to empty string
      const descriptionToAnalyze = jobDescription || '';

      if (!descriptionToAnalyze) {
        console.error('No job description provided');
        setLoading(false);
        return;
      }

      // Now classify the job
      const response = await fetch('http://localhost:5000/api/classify-job', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId,
          job_description: descriptionToAnalyze,
          job_title: ''
        }),
      });

      const data = await response.json();
      if (data.success) {
        const raw = data.classification;

        // Map backend data to frontend expected structure
        const formatted = {
          industry: raw.industry_classification?.primary_industry || 'General',
          confidence: 85, // Placeholder as backend returns raw scores
          job_level: raw.job_level,
          years_of_experience: raw.requirements?.experience?.[0] || 'Not specified',
          related_industries: raw.industry_classification?.secondary_industries || [],
          requirements: {
            must_have: raw.must_have_requirements || [],
            nice_to_have: raw.nice_to_have_requirements || []
          },
          technical_skills: raw.requirements?.technical_skills || [],
          soft_skills: raw.requirements?.soft_skills || [],
          key_highlights: raw.insights || [],
          work_arrangement: raw.work_arrangement?.type || 'Not specified',
          company_type: 'Private', // Placeholder
          complexity_score: Math.min(10, raw.complexity?.total_requirements || 5),
          sentiment: {
            overall: raw.sentiment_analysis?.positive_language ? 'Positive' : 'Neutral',
            tone: raw.sentiment_analysis?.tone || 'Professional',
            urgency_level: raw.sentiment_analysis?.work_culture_indicators?.demanding_mentions > 0 ? 'High' : 'Normal'
          }
        };

        setClassification(formatted);
      }
    } catch (error) {
      console.error('Error fetching job classification:', error);
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
        <p className="text-charcoal-300">Analyzing job description with NLP...</p>
      </div>
    );
  }

  if (!classification) {
    return (
      <div className="glass-card p-6 text-center border border-orange-500/20">
        <p className="text-orange-400">No job classification data available. Please ensure you've entered a job description.</p>
      </div>
    );
  }

  const getLevelColor = (level) => {
    if (level.includes('Entry')) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    if (level.includes('Mid')) return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    if (level.includes('Senior')) return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
    return 'bg-red-500/10 text-red-400 border-red-500/20';
  };

  const getSentimentColor = (sentiment) => {
    if (sentiment === 'Positive') return 'text-emerald-400';
    if (sentiment === 'Neutral') return 'text-charcoal-300';
    return 'text-red-400';
  };

  return (
    <div className="glass-card overflow-hidden">
      {/* Header */}
      <div className="p-8">
        <h2 className="text-3xl font-bold text-cream-50 mb-2">🔍 NLP Job Analysis</h2>
        <p className="text-charcoal-300">Advanced AI-powered job description classification</p>
      </div>

      <div className="p-8 space-y-8">
        {/* Industry & Level */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card-hover p-6">
            <h3 className="text-sm font-bold text-amber-400 mb-2">INDUSTRY CLASSIFICATION</h3>
            <div className="text-2xl font-bold text-cream-100 mb-2">{classification.industry}</div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-charcoal-300">Confidence:</span>
              <span className="text-lg font-semibold text-amber-400">{classification.confidence}%</span>
            </div>
            <div className="w-full bg-charcoal-700 rounded-full h-2 mt-2">
              <div
                className="bg-amber-500 h-2 rounded-full"
                style={{ width: `${classification.confidence}%` }}
              ></div>
            </div>
          </div>

          <div className="glass-card-hover p-6">
            <h3 className="text-sm font-bold text-amber-400 mb-2">EXPERIENCE LEVEL</h3>
            <div className={`inline-block px-4 py-2 rounded-lg border-2 ${getLevelColor(classification.job_level)} text-lg font-bold mb-2`}>
              {classification.job_level}
            </div>
            {classification.years_of_experience && (
              <div className="text-sm text-charcoal-300 mt-2">
                Required: <strong>{classification.years_of_experience}</strong>
              </div>
            )}
          </div>
        </div>

        {/* Related Industries */}
        {classification.related_industries && classification.related_industries.length > 0 && (
          <div className="glass-card p-6">
            <h3 className="text-lg font-bold text-cream-100 mb-4 flex items-center">
              <span className="mr-2">🏢</span>
              Related Industries
            </h3>
            <div className="flex flex-wrap gap-2">
              {classification.related_industries.map((industry, index) => (
                <span key={index} className="bg-charcoal-800/40 border border-charcoal-700 text-cream-100 px-3 py-1 rounded-full text-sm">
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
            <div className="glass-card p-6 border border-red-500/20">
              <h3 className="text-lg font-bold text-red-400 mb-4 flex items-center">
                <span className="mr-2">⭐</span>
                Must-Have Requirements
              </h3>
              <ul className="space-y-2">
                {classification.requirements.must_have.map((req, index) => (
                  <li key={index} className="text-charcoal-200 text-sm flex items-start">
                    <span className="text-red-400 mr-2 mt-0.5">•</span>
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Nice-to-Have Requirements */}
          {classification.requirements?.nice_to_have && classification.requirements.nice_to_have.length > 0 && (
            <div className="glass-card p-6 border border-amber-500/20">
              <h3 className="text-lg font-bold text-amber-400 mb-4 flex items-center">
                <span className="mr-2">💎</span>
                Nice-to-Have Requirements
              </h3>
              <ul className="space-y-2">
                {classification.requirements.nice_to_have.map((req, index) => (
                  <li key={index} className="text-charcoal-200 text-sm flex items-start">
                    <span className="text-amber-400 mr-2 mt-0.5">•</span>
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
            <div className="glass-card p-6 border border-emerald-500/20">
              <h3 className="text-lg font-bold text-emerald-400 mb-4 flex items-center">
                <span className="mr-2">💻</span>
                Technical Skills Required
              </h3>
              <div className="flex flex-wrap gap-2">
                {classification.technical_skills.map((skill, index) => (
                  <span key={index} className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-sm font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {classification.soft_skills && classification.soft_skills.length > 0 && (
            <div className="glass-card p-6 border border-orange-500/20">
              <h3 className="text-lg font-bold text-orange-400 mb-4 flex items-center">
                <span className="mr-2">🤝</span>
                Soft Skills Required
              </h3>
              <div className="flex flex-wrap gap-2">
                {classification.soft_skills.map((skill, index) => (
                  <span key={index} className="bg-orange-500/10 text-orange-400 border border-orange-500/20 px-3 py-1 rounded-full text-sm font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Key Highlights */}
        {classification.key_highlights && classification.key_highlights.length > 0 && (
          <div className="glass-card p-6 border border-amber-500/20">
            <h3 className="text-lg font-bold text-amber-400 mb-4 flex items-center">
              <span className="mr-2">✨</span>
              Key Highlights
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {classification.key_highlights.map((highlight, index) => (
                <div key={index} className="glass-card-hover p-3">
                  <p className="text-charcoal-200 text-sm">{highlight}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Work Arrangement & Company Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {classification.work_arrangement && (
            <div className="glass-card-hover text-center p-4">
              <div className="text-2xl mb-2">🏠</div>
              <div className="font-bold text-cream-100">{classification.work_arrangement}</div>
              <div className="text-xs text-charcoal-400 mt-1">Work Arrangement</div>
            </div>
          )}

          {classification.company_type && (
            <div className="glass-card-hover text-center p-4">
              <div className="text-2xl mb-2">🏢</div>
              <div className="font-bold text-cream-100">{classification.company_type}</div>
              <div className="text-xs text-charcoal-400 mt-1">Company Type</div>
            </div>
          )}

          {classification.complexity_score && (
            <div className="glass-card-hover text-center p-4">
              <div className="text-2xl mb-2">📊</div>
              <div className="font-bold text-cream-100">{classification.complexity_score}/10</div>
              <div className="text-xs text-charcoal-400 mt-1">Job Complexity</div>
            </div>
          )}
        </div>

        {/* Sentiment Analysis */}
        {classification.sentiment && (
          <div className="glass-card p-6">
            <h3 className="text-lg font-bold text-cream-100 mb-4 flex items-center">
              <span className="mr-2">😊</span>
              Job Posting Analysis
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="glass-card-hover flex items-center justify-between p-4">
                <span className="text-charcoal-300">Overall Sentiment:</span>
                <span className={`font-bold ${getSentimentColor(classification.sentiment.overall)}`}>
                  {classification.sentiment.overall}
                </span>
              </div>
              <div className="glass-card-hover flex items-center justify-between p-4">
                <span className="text-charcoal-300">Tone:</span>
                <span className="font-semibold text-cream-100">{classification.sentiment.tone}</span>
              </div>
            </div>
            {classification.sentiment.urgency_level && (
              <div className="glass-card-hover mt-4 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-charcoal-300">Urgency Level:</span>
                  <span className="font-semibold text-cream-100">{classification.sentiment.urgency_level}</span>
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
