import React, { useState, useEffect } from 'react';
import RealQuestionsDisplay from './RealQuestionsDisplay';

const InterviewPrep = ({ sessionId }) => {
  const [interviewData, setInterviewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('questions');
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  useEffect(() => {
    if (sessionId) {
      fetchInterviewQuestions();
    }
  }, [sessionId]);

  const fetchInterviewQuestions = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/generate-interview-questions', {
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
        setInterviewData(data.interview_preparation);
      }
    } catch (error) {
      console.error('Error fetching interview questions:', error);
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
        <p className="text-charcoal-300">Generating personalized interview questions...</p>
      </div>
    );
  }

  if (!interviewData) {
    return (
      <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6 text-center">
        <p className="text-yellow-800">No interview prep data available. Please analyze your resume first.</p>
      </div>
    );
  }

  const allQuestions = [
    ...(interviewData.technical_questions || []).map(q => ({ ...q, type: 'Technical' })),
    ...(interviewData.behavioral_questions || []).map(q => ({ ...q, type: 'Behavioral' })),
    ...(interviewData.system_design_questions || []).map(q => ({ ...q, type: 'System Design' })),
    ...(interviewData.role_specific_questions || []).map(q => ({ ...q, type: 'Role-Specific' }))
  ];

  const getTypeColor = (type) => {
    if (type === 'Technical') return 'bg-blue-100 text-blue-800 border-blue-300';
    if (type === 'Behavioral') return 'bg-green-100 text-green-800 border-green-300';
    if (type === 'System Design') return 'bg-purple-100 text-purple-800 border-purple-300';
    return 'bg-orange-100 text-orange-800 border-orange-300';
  };

  const getDifficultyColor = (difficulty) => {
    if (difficulty === 'Beginner') return 'text-green-600';
    if (difficulty === 'Intermediate') return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="glass-card overflow-hidden">
      {/* Header */}
      <div className="p-8">
        <h2 className="text-3xl font-bold text-cream-50 mb-2">💬 AI Interview Preparation</h2>
        <p className="text-charcoal-300">Personalized questions tailored to your profile and job requirements</p>
        <div className="mt-4 flex items-center space-x-6">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-amber-400 mr-2">{allQuestions.length}</span>
            <span className="text-charcoal-400">Total Questions</span>
          </div>
          {interviewData.preparation_plan && (
            <div className="flex items-center">
              <span className="text-2xl font-bold text-amber-400 mr-2">
                {interviewData.preparation_plan.total_days || 5}
              </span>
              <span className="text-charcoal-400">Day Plan</span>
            </div>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-charcoal-700">
        <div className="flex overflow-x-auto">
          {['questions', 'plan', 'tips'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${activeTab === tab
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-charcoal-400 hover:text-cream-100'
                }`}
            >
              {tab === 'questions' && '❓ Practice Questions'}
              {tab === 'plan' && '📅 Study Plan'}
              {tab === 'tips' && '💡 Interview Tips'}
            </button>
          ))}
        </div>
      </div>

      <div className="p-8">
        {/* Questions Tab */}
        {activeTab === 'questions' && (
          <div className="space-y-6">
            {/* Question Type Filter */}
            <div className="glass-card p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Filter by Type:</h3>
              <div className="flex flex-wrap gap-2">
                {['All', 'Technical', 'Behavioral', 'System Design', 'Role-Specific'].map(type => (
                  <button
                    key={type}
                    className="px-4 py-2 rounded-lg border-2 border-charcoal-700 text-sm font-medium hover:bg-amber-500 hover:text-charcoal-900 hover:border-amber-500 transition-colors"
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-4">
              {allQuestions.map((question, index) => (
                <div
                  key={index}
                  className="glass-card-hover rounded-xl p-6 hover:shadow-glow transition-shadow cursor-pointer"
                  onClick={() => setSelectedQuestion(selectedQuestion === index ? null : index)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start flex-1">
                      <div className="bg-amber-500 text-charcoal-900 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 flex-shrink-0 mt-1">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border mr-2 ${getTypeColor(question.type)}`}>
                            {question.type}
                          </span>
                          {question.difficulty && (
                            <span className={`text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
                              ● {question.difficulty}
                            </span>
                          )}
                        </div>
                        <p className="text-cream-100 font-medium text-lg">{question.question}</p>

                        {selectedQuestion === index && (
                          <div className="mt-4 space-y-4">
                            {question.answer_tips && (
                              <div className="glass-card p-4">
                                <h5 className="text_sm font-bold text-amber-400 mb-2 flex items-center">
                                  <span className="mr-2">💡</span>
                                  Answer Tips
                                </h5>
                                <p className="text-charcoal-300 text-sm">{question.answer_tips}</p>
                              </div>
                            )}

                            {question.key_points && question.key_points.length > 0 && (
                              <div className="glass-card p-4">
                                <h5 className="text-sm font-bold text-emerald-400 mb-2 flex items-center">
                                  <span className="mr-2">📌</span>
                                  Key Points to Cover
                                </h5>
                                <ul className="space-y-1">
                                  {question.key_points.map((point, i) => (
                                    <li key={i} className="text-charcoal-300 text-sm flex items-start">
                                      <span className="text-emerald-400 mr-2">•</span>
                                      {point}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            <div className="flex space-x-3">
                              <button className="px-4 py-2 btn-primary text-sm font-medium">
                                🎤 Practice Answer
                              </button>
                              <button className="px-4 py-2 border border-charcoal-700 text-cream-100 rounded-lg hover:bg-charcoal-800/40 transition-colors text-sm font-medium">
                                📝 Save Question
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <button className="ml-4 text-gray-400 hover:text-gray-600">
                      {selectedQuestion === index ? '▲' : '▼'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Questions to Ask */}
            {interviewData.questions_to_ask && interviewData.questions_to_ask.length > 0 && (
              <div className="glass-card p-6 border border-amber-500/20 mt-8">
                <h3 className="text-xl font-bold text-cream-100 mb-4 flex items-center">
                  <span className="mr-2">🙋</span>
                  Smart Questions to Ask the Interviewer
                </h3>
                <p className="text-charcoal-300 text-sm mb-4">
                  Asking thoughtful questions shows your genuine interest and research.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {interviewData.questions_to_ask.map((question, index) => (
                    <div key={index} className="glass-card-hover rounded-lg p-4">
                      <p className="text-cream-100 text-sm font-medium">{question}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Real Interview Questions from Kaggle Datasets */}
            {interviewData.real_world_questions && interviewData.real_world_questions.length > 0 && (
              <div className="mt-8">
                <RealQuestionsDisplay
                  questions={interviewData.real_world_questions}
                  category="Real Dataset"
                />
              </div>
            )}
          </div>
        )}

        {/* Preparation Plan Tab */}
        {activeTab === 'plan' && interviewData.preparation_plan && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
              <h3 className="text-2xl font-bold text-blue-900 mb-2">
                {interviewData.preparation_plan.total_days}-Day Interview Prep Plan
              </h3>
              <p className="text-blue-700">
                Follow this structured plan to maximize your interview readiness
              </p>
            </div>

            {interviewData.preparation_plan.daily_schedule &&
              interviewData.preparation_plan.daily_schedule.map((day, index) => (
                <div key={index} className="border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start">
                    <div className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center text-lg font-bold mr-4 flex-shrink-0">
                      {day.day}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-gray-800 mb-2">{day.focus}</h4>
                      {day.activities && (
                        <ul className="space-y-2 mb-3">
                          {day.activities.map((activity, i) => (
                            <li key={i} className="text-gray-700 text-sm flex items-start">
                              <span className="text-primary mr-2 mt-1">●</span>
                              {activity}
                            </li>
                          ))}
                        </ul>
                      )}
                      {day.topics && day.topics.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {day.topics.map((topic, i) => (
                            <span key={i} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                              {topic}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

            {interviewData.preparation_plan.resources &&
              interviewData.preparation_plan.resources.length > 0 && (
                <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
                  <h4 className="font-semibold text-yellow-800 mb-3 flex items-center">
                    <span className="mr-2">📚</span>
                    Recommended Resources
                  </h4>
                  <ul className="space-y-2">
                    {interviewData.preparation_plan.resources.map((resource, index) => (
                      <li key={index} className="text-yellow-700 text-sm flex items-start">
                        <span className="text-yellow-500 mr-2 mt-1">•</span>
                        {resource}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
          </div>
        )}

        {/* Tips Tab */}
        {activeTab === 'tips' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* STAR Method */}
              <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200">
                <h3 className="text-lg font-bold text-green-800 mb-3 flex items-center">
                  <span className="mr-2">⭐</span>
                  STAR Method
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="font-semibold text-green-900 text-sm">Situation</div>
                    <p className="text-green-700 text-xs mt-1">Set the context for your story</p>
                  </div>
                  <div>
                    <div className="font-semibold text-green-900 text-sm">Task</div>
                    <p className="text-green-700 text-xs mt-1">Describe your responsibility</p>
                  </div>
                  <div>
                    <div className="font-semibold text-green-900 text-sm">Action</div>
                    <p className="text-green-700 text-xs mt-1">Explain what you did</p>
                  </div>
                  <div>
                    <div className="font-semibold text-green-900 text-sm">Result</div>
                    <p className="text-green-700 text-xs mt-1">Share the outcomes</p>
                  </div>
                </div>
              </div>

              {/* General Tips */}
              <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
                <h3 className="text-lg font-bold text-blue-800 mb-3 flex items-center">
                  <span className="mr-2">💡</span>
                  General Interview Tips
                </h3>
                <ul className="space-y-2">
                  <li className="text-blue-700 text-sm flex items-start">
                    <span className="text-blue-500 mr-2">✓</span>
                    Research the company thoroughly
                  </li>
                  <li className="text-blue-700 text-sm flex items-start">
                    <span className="text-blue-500 mr-2">✓</span>
                    Prepare specific examples from your experience
                  </li>
                  <li className="text-blue-700 text-sm flex items-start">
                    <span className="text-blue-500 mr-2">✓</span>
                    Practice out loud, not just in your head
                  </li>
                  <li className="text-blue-700 text-sm flex items-start">
                    <span className="text-blue-500 mr-2">✓</span>
                    Ask clarifying questions when needed
                  </li>
                  <li className="text-blue-700 text-sm flex items-start">
                    <span className="text-blue-500 mr-2">✓</span>
                    Follow up with a thank-you email
                  </li>
                </ul>
              </div>

              {/* Technical Interview Tips */}
              <div className="bg-purple-50 rounded-xl p-6 border-2 border-purple-200">
                <h3 className="text-lg font-bold text-purple-800 mb-3 flex items-center">
                  <span className="mr-2">💻</span>
                  Technical Interview Tips
                </h3>
                <ul className="space-y-2">
                  <li className="text-purple-700 text-sm flex items-start">
                    <span className="text-purple-500 mr-2">✓</span>
                    Think out loud during problem-solving
                  </li>
                  <li className="text-purple-700 text-sm flex items-start">
                    <span className="text-purple-500 mr-2">✓</span>
                    Clarify requirements before coding
                  </li>
                  <li className="text-purple-700 text-sm flex items-start">
                    <span className="text-purple-500 mr-2">✓</span>
                    Start with a brute force solution
                  </li>
                  <li className="text-purple-700 text-sm flex items-start">
                    <span className="text-purple-500 mr-2">✓</span>
                    Optimize and explain trade-offs
                  </li>
                  <li className="text-purple-700 text-sm flex items-start">
                    <span className="text-purple-500 mr-2">✓</span>
                    Test your code with examples
                  </li>
                </ul>
              </div>

              {/* Body Language */}
              <div className="bg-orange-50 rounded-xl p-6 border-2 border-orange-200">
                <h3 className="text-lg font-bold text-orange-800 mb-3 flex items-center">
                  <span className="mr-2">🤝</span>
                  Body Language & Presence
                </h3>
                <ul className="space-y-2">
                  <li className="text-orange-700 text-sm flex items-start">
                    <span className="text-orange-500 mr-2">✓</span>
                    Maintain good eye contact
                  </li>
                  <li className="text-orange-700 text-sm flex items-start">
                    <span className="text-orange-500 mr-2">✓</span>
                    Smile and show enthusiasm
                  </li>
                  <li className="text-orange-700 text-sm flex items-start">
                    <span className="text-orange-500 mr-2">✓</span>
                    Sit up straight with confidence
                  </li>
                  <li className="text-orange-700 text-sm flex items-start">
                    <span className="text-orange-500 mr-2">✓</span>
                    Listen actively and take notes
                  </li>
                  <li className="text-orange-700 text-sm flex items-start">
                    <span className="text-orange-500 mr-2">✓</span>
                    Be authentic and professional
                  </li>
                </ul>
              </div>
            </div>

            {/* Common Mistakes */}
            <div className="bg-red-50 rounded-xl p-6 border-2 border-red-200">
              <h3 className="text-lg font-bold text-red-800 mb-4 flex items-center">
                <span className="mr-2">⚠️</span>
                Common Mistakes to Avoid
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="text-red-700 text-sm flex items-start">
                  <span className="text-red-500 mr-2">✗</span>
                  Speaking negatively about previous employers
                </div>
                <div className="text-red-700 text-sm flex items-start">
                  <span className="text-red-500 mr-2">✗</span>
                  Not preparing questions for the interviewer
                </div>
                <div className="text-red-700 text-sm flex items-start">
                  <span className="text-red-500 mr-2">✗</span>
                  Giving vague, generic answers
                </div>
                <div className="text-red-700 text-sm flex items-start">
                  <span className="text-red-500 mr-2">✗</span>
                  Interrupting the interviewer
                </div>
                <div className="text-red-700 text-sm flex items-start">
                  <span className="text-red-500 mr-2">✗</span>
                  Focusing too much on salary initially
                </div>
                <div className="text-red-700 text-sm flex items-start">
                  <span className="text-red-500 mr-2">✗</span>
                  Arriving late or unprepared
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewPrep;
