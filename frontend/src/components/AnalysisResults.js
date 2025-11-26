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
        onNext(data);
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
      <div className="bg-white rounded-xl shadow-lg p-12 text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-6"></div>
        <h3 className="text-2xl font-bold text-gray-800 mb-4">AI Analysis in Progress</h3>
        <p className="text-gray-600 max-w-md mx-auto">
          Our AI is analyzing your resume against the job requirements, calculating skill matches,
          and preparing personalized recommendations...
        </p>
        <div className="mt-6 grid grid-cols-3 gap-4 max-w-md mx-auto">
          <div className="text-center">
            <div className="bg-blue-100 rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-2">
              <span className="text-blue-600">🔍</span>
            </div>
            <p className="text-xs text-gray-600">Skill Matching</p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-2">
              <span className="text-green-600">📊</span>
            </div>
            <p className="text-xs text-gray-600">Gap Analysis</p>
          </div>
          <div className="text-center">
            <div className="bg-purple-100 rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-2">
              <span className="text-purple-600">💡</span>
            </div>
            <p className="text-xs text-gray-600">AI Recommendations</p>
          </div>
        </div>
      </div>
    );
  }

  const { match_analysis, interview_questions, missing_sections_suggestions } = matchAnalysis;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header with Match Score */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-8">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">🎯 Comprehensive AI Analysis Complete!</h2>
            <p className="text-blue-100 text-lg">✨ Explore 7 detailed analysis tabs below</p>
          </div>
          <div className="text-center mt-4 lg:mt-0">
            <div className="text-5xl font-bold mb-2">{match_analysis.match_score}%</div>
            <div className="text-blue-100 font-medium">Overall Match Score</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6 bg-blue-400 bg-opacity-30 rounded-full h-3">
          <div
            className="bg-white h-3 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${match_analysis.match_score}%` }}
          ></div>
        </div>
      </div>

      {/* Instruction Banner */}
      <div className="px-4 py-3 bg-blue-50 border-b-2 border-blue-200">
        <p className="text-center text-sm font-semibold text-blue-800">
          👇 Click on each tab to explore different AI analyses (7 tabs available)
        </p>
      </div>

      {/* Tab Navigation - PROMINENTLY STYLED */}
      <div className="border-b-2 border-gray-300 bg-gray-50">
        <div className="flex overflow-x-auto">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 font-bold text-sm border-b-4 transition-all whitespace-nowrap ${activeTab === tab
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-gray-600 hover:text-blue-500 hover:bg-gray-100'
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
      </div>

      {/* Tab Content */}
      <div className="p-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Skills Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-green-50 rounded-xl border border-green-200">
                <div className="text-3xl font-bold text-green-600 mb-2">{match_analysis.matching_skills.length}</div>
                <div className="text-green-800 font-medium">Matching Skills</div>
                <div className="text-green-600 text-sm mt-2">Skills you have that match the job</div>
              </div>

              <div className="text-center p-6 bg-red-50 rounded-xl border border-red-200">
                <div className="text-3xl font-bold text-red-600 mb-2">{match_analysis.missing_skills.length}</div>
                <div className="text-red-800 font-medium">Missing Skills</div>
                <div className="text-red-600 text-sm mt-2">Skills needed for this job</div>
              </div>

              <div className="text-center p-6 bg-blue-50 rounded-xl border border-blue-200">
                <div className="text-3xl font-bold text-blue-600 mb-2">{match_analysis.resume_skills_count}</div>
                <div className="text-blue-800 font-medium">Total Skills</div>
                <div className="text-blue-600 text-sm mt-2">Skills identified in your resume</div>
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
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <span className="text-green-500 mr-2">✅</span>
                Your Matching Skills ({match_analysis.matching_skills.length})
              </h3>
              <div className="flex flex-wrap gap-3">
                {match_analysis.matching_skills.map((skill, index) => (
                  <span key={index} className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-medium text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Skills */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <span className="text-red-500 mr-2">📚</span>
                Skills to Develop ({match_analysis.missing_skills.length})
              </h3>
              <div className="flex flex-wrap gap-3">
                {match_analysis.missing_skills.map((skill, index) => (
                  <span key={index} className="bg-red-100 text-red-800 px-4 py-2 rounded-full font-medium text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ai-score' && (
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

      {/* Navigation */}
      <div className="px-8 py-6 border-t-2 border-gray-300 bg-gray-50">
        <div className="flex justify-between items-center">
          <button
            onClick={onBack}
            className="bg-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-400 transition-colors font-medium shadow"
          >
            ← Back to Job Description
          </button>

          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Explore all 7 tabs above ☝️</p>
            <button
              onClick={() => {
                window.scrollTo(0, 0);
                onNext();
              }}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-bold shadow-lg"
            >
              Generate Cover Letter →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResults;
