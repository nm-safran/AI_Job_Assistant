// v2.0 - 7 Tab Interface with AI Analysis
import React, { useState, useEffect } from 'react';
import AIRecommendations from './AIRecommendations';
import AIScoreCard from './AIScoreCard';
import JobClassification from './JobClassification';
import InterviewPrep from './InterviewPrep';
import SkillGapAnalysis from './SkillGapAnalysis';

const TABS = ['overview', 'ai-score', 'job-analysis', 'skills', 'skill-gaps', 'interview', 'recommendations'];

const AnalysisResults = ({ resumeData, jobDescription, sessionId, onNext, onBack }) => {
  const [matchAnalysis, setMatchAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Debug: Log tabs to verify 7-tab version is loaded
  console.log('AnalysisResults v2.0 - Available tabs:', TABS);

  useEffect(() => {
    if (resumeData && jobDescription && sessionId) {
      analyzeMatch();
    }
  }, [resumeData, jobDescription, sessionId]);

  const analyzeMatch = async () => {
    setIsAnalyzing(true);
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
        setMatchAnalysis(data);
        // Don't auto-advance to next step - let user explore 7 tabs first
        // onNext(data);
      } else {
        alert('Error analyzing match: ' + data.error);
      }
    } catch (error) {
      console.error('Error analyzing match:', error);
      alert('Error analyzing match. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!matchAnalysis || isAnalyzing) {
    return (
      <div className="glass-card p-12 text-center">
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div className="absolute inset-0 border-4 border-charcoal-600 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-amber-500 rounded-full border-t-transparent animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center text-3xl">⚡</div>
        </div>
        <h3 className="text-2xl font-bold text-cream-50 mb-4">AI Deep Analysis in Progress</h3>
        <p className="text-charcoal-300 max-w-md mx-auto mb-8">
          Processing your resume against job requirements, calculating compatibility scores,
          and generating personalized recommendations...
        </p>
        <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
          <div className="glass-card p-4 text-center">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mx-auto mb-2 border border-amber-500/20">
              <span className="text-xl">🔍</span>
            </div>
            <p className="text-xs text-charcoal-300">Skill Matching</p>
          </div>
          <div className="glass-card p-4 text-center">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mx-auto mb-2 border border-amber-500/20">
              <span className="text-xl">📊</span>
            </div>
            <p className="text-xs text-charcoal-300">Gap Analysis</p>
          </div>
          <div className="glass-card p-4 text-center">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mx-auto mb-2 border border-amber-500/20">
              <span className="text-xl">💡</span>
            </div>
            <p className="text-xs text-charcoal-300">AI Insights</p>
          </div>
        </div>
      </div>
    );
  }

  const { match_analysis, interview_questions, missing_sections_suggestions } = matchAnalysis;

  return (
    <div className="space-y-6">
      {/* Header with Match Score */}
      <div className="glass-card p-8 border-amber-500/20">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-cream-50 mb-2">🎯 Analysis Complete</h2>
            <p className="text-charcoal-300 text-lg">Your profile has been matched against the position requirements</p>
          </div>
          <div className="text-center">
            <div className="relative inline-block">
              <div className="text-6xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent mb-2">
                {match_analysis.match_score}%
              </div>
              <div className="text-charcoal-400 font-medium">Match Score</div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6 bg-charcoal-700 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-amber-500 to-amber-600 h-3 rounded-full transition-all duration-1000 ease-out shadow-glow"
            style={{ width: `${match_analysis.match_score}%` }}
          ></div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="glass-card overflow-hidden">
        <div className="flex overflow-x-auto scrollbar-hide border-b border-charcoal-700">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative px-6 py-4 font-semibold text-sm transition-all duration-300 whitespace-nowrap border-b-2 ${activeTab === tab
                  ? 'border-amber-500 text-amber-400 bg-amber-500/5'
                  : 'border-transparent text-charcoal-400 hover:text-amber-400/70 hover:bg-charcoal-700/30'
                }`}
            >
              {tab === 'overview' && '📊 Overview'}
              {tab === 'ai-score' && '🎯 AI Score'}
              {tab === 'job-analysis' && '🔍 Job Analysis'}
              {tab === 'skills' && '🛠️ Skills Match'}
              {tab === 'skill-gaps' && '📈 Learning Path'}
              {tab === 'interview' && '💬 Interview Prep'}
              {tab === 'recommendations' && '🚀 AI Tips'}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-8">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Skills Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card-hover p-8 text-center group">
                  <div className="text-5xl font-extrabold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent mb-3">
                    {match_analysis.matching_skills.length}
                  </div>
                  <div className="text-cream-100 font-bold text-lg mb-2">Matching Skills</div>
                  <div className="text-charcoal-400 text-sm mt-2">✅ Skills that align perfectly</div>
                </div>

                <div className="glass-card-hover p-8 text-center group">
                  <div className="text-5xl font-extrabold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent mb-3">
                    {match_analysis.missing_skills.length}
                  </div>
                  <div className="text-cream-100 font-bold text-lg mb-2">Growth Areas</div>
                  <div className="text-charcoal-400 text-sm mt-2">📚 Skills to develop</div>
                </div>

                <div className="glass-card-hover p-8 text-center group">
                  <div className="text-5xl font-extrabold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent mb-3">
                    {match_analysis.resume_skills_count}
                  </div>
                  <div className="text-cream-100 font-bold text-lg mb-2">Total Skills</div>
                  <div className="text-charcoal-400 text-sm mt-2">🎯 In your profile</div>
                </div>
              </div>

              {/* Quick Assessment */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Assessment</h3>
                {match_analysis.match_score >= 70 ? (
                  <div className="text-green-600 bg-green-50 p-4 rounded-lg border border-green-200">
                    <strong>Strong Match! </strong>
                    Your skills align well with this position. Focus on highlighting your {match_analysis.matching_skills.slice(0, 3).join(', ')} experience.
                  </div>
                ) : match_analysis.match_score >= 40 ? (
                  <div className="text-yellow-600 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <strong>Moderate Match. </strong>
                    Consider developing {match_analysis.missing_skills.slice(0, 2).join(' and ')} to improve your fit for this role.
                  </div>
                ) : (
                  <div className="text-red-600 bg-red-50 p-4 rounded-lg border border-red-200">
                    <strong>Skill Gap Identified. </strong>
                    Focus on learning {match_analysis.missing_skills.slice(0, 3).join(', ')} to better match this position.
                  </div>
                )}
              </div>

              {/* Missing Sections Suggestions */}
              {missing_sections_suggestions && missing_sections_suggestions.length > 0 && (
                <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
                  <h3 className="text-xl font-semibold text-yellow-800 mb-4 flex items-center">
                    <span className="mr-2">📝</span>
                    Resume Improvement Suggestions
                  </h3>
                  <ul className="space-y-3">
                    {missing_sections_suggestions.map((suggestion, index) => (
                      <li key={index} className="text-yellow-700 flex items-start">
                        <span className="text-yellow-500 mr-2 mt-1">•</span>
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="space-y-8">
              {/* Matching Skills */}
              <div>
                <h3 className="text-xl font-bold text-cream-100 mb-4 flex items-center gap-2">
                  <span className="text-emerald-400">✅</span>
                  Your Matching Skills ({match_analysis.matching_skills.length})
                </h3>
                <div className="flex flex-wrap gap-3">
                  {match_analysis.matching_skills.map((skill, index) => (
                    <span key={index} className="badge-success px-4 py-2">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing Skills */}
              <div>
                <h3 className="text-xl font-bold text-cream-100 mb-4 flex items-center gap-2">
                  <span className="text-orange-400">📚</span>
                  Skills to Develop ({match_analysis.missing_skills.length})
                </h3>
                <div className="flex flex-wrap gap-3">
                  {match_analysis.missing_skills.map((skill, index) => (
                    <span key={index} className="badge-warning px-4 py-2">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}        {activeTab === 'ai-score' && (
            <AIScoreCard sessionId={sessionId} />
          )}

          {activeTab === 'job-analysis' && (
            <JobClassification sessionId={sessionId} />
          )}

          {activeTab === 'skill-gaps' && (
            <SkillGapAnalysis sessionId={sessionId} />
          )}

          {activeTab === 'interview' && (
            <InterviewPrep sessionId={sessionId} />
          )}

          {activeTab === 'recommendations' && (
            <AIRecommendations
              resumeData={resumeData}
              jobDescription={jobDescription}
              sessionId={sessionId}
            />
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center gap-4">
        <button
          onClick={onBack}
          className="btn-ghost"
        >
          ← Back
        </button>

        <button
          onClick={() => {
            window.scrollTo(0, 0);
            onNext(matchAnalysis);
          }}
          className="btn-primary flex items-center gap-2"
        >
          <span>✍️</span>
          Generate Cover Letter
          <span>→</span>
        </button>
      </div>
    </div>
  );
};

export default AnalysisResults;
