import React, { useState } from 'react';
import ResumeUpload from './components/ResumeUpload';
import JobDescription from './components/JobDescription';
import AnalysisResults from './components/AnalysisResults';
import CoverLetter from './components/CoverLetter';
import AIScoreCard from './components/AIScoreCard';
import JobClassification from './components/JobClassification';
import InterviewPrep from './components/InterviewPrep';
import SkillGapAnalysis from './components/SkillGapAnalysis';

// Version marker to verify latest code is loaded
console.log('🚀 AI Job Assistant v2.0 - 7 Tab Interface Loaded Successfully!');

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [resumeData, setResumeData] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [analysisResults, setAnalysisResults] = useState(null);

  const handleResumeUpload = (data, session) => {
    setResumeData(data);
    setSessionId(session);
    setCurrentStep(2);
  };

  const handleJobAnalysis = (jobData) => {
    setJobDescription(jobData);
    setCurrentStep(3);
  };

  const handleAnalysisComplete = (results) => {
    setAnalysisResults(results);
    setCurrentStep(4);
  };

  const resetApp = () => {
    setCurrentStep(1);
    setResumeData(null);
    setJobDescription('');
    setSessionId(null);
    setAnalysisResults(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 animate-fade-in">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Enhanced Header */}
        <header className="text-center mb-12 animate-slide-up">
          <div className="inline-block mb-4">
            <div className="text-6xl mb-4 animate-bounce">🤖</div>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            AI Job Application Assistant
          </h1>
          <p className="text-xl text-gray-700 font-medium max-w-2xl mx-auto">
            ✨ Smart resume analysis • 🎯 Job matching • 📝 AI-powered cover letters
          </p>
          <div className="mt-6 flex justify-center gap-4 flex-wrap">
            <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold shadow-sm">AI-Powered</span>
            <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold shadow-sm">7-Tab Analysis</span>
            <span className="px-4 py-2 bg-pink-100 text-pink-700 rounded-full text-sm font-semibold shadow-sm">Instant Results</span>
          </div>
        </header>

        {/* Enhanced Progress Steps */}
        <div className="mb-12 animate-scale-in">
          <div className="flex justify-center mb-4">
            {[1, 2, 3, 4].map(step => (
              <div key={step} className="flex items-center">
                <div className="relative">
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${currentStep >= step
                        ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg scale-110'
                        : 'bg-white text-gray-400 border-2 border-gray-300'
                      }`}
                  >
                    {currentStep > step ? '✓' : step}
                  </div>
                  {currentStep === step && (
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-30 blur animate-pulse"></div>
                  )}
                </div>
                {step < 4 && (
                  <div className="relative w-20 h-1 mx-2">
                    <div className="absolute inset-0 bg-gray-300 rounded"></div>
                    <div
                      className={`absolute inset-0 rounded transition-all duration-500 ${currentStep > step ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'w-0'
                        }`}
                    ></div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Step Labels with Icons */}
          <div className="flex justify-center text-sm">
            {[
              { label: 'Upload Resume', icon: '📄' },
              { label: 'Job Details', icon: '💼' },
              { label: 'AI Analysis', icon: '🤖' },
              { label: 'Cover Letter', icon: '✍️' }
            ].map((item, idx) => (
              <div
                key={idx}
                className={`w-32 text-center transition-all duration-300 ${currentStep === idx + 1
                    ? 'text-purple-700 font-bold scale-105'
                    : 'text-gray-500'
                  }`}
              >
                <div className="text-xl mb-1">{item.icon}</div>
                <div>{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="max-w-6xl mx-auto">
          {currentStep === 1 && (
            <ResumeUpload onUpload={handleResumeUpload} />
          )}

          {currentStep === 2 && (
            <JobDescription
              jobDescription={jobDescription}
              onChange={setJobDescription}
              sessionId={sessionId}
              onNext={handleJobAnalysis}
              onBack={() => setCurrentStep(1)}
            />
          )}

          {currentStep === 3 && (
            <AnalysisResults
              resumeData={resumeData}
              jobDescription={jobDescription}
              sessionId={sessionId}
              onNext={handleAnalysisComplete}
              onBack={() => setCurrentStep(2)}
            />
          )}

          {currentStep === 4 && (
            <CoverLetter
              resumeData={resumeData}
              jobDescription={jobDescription}
              sessionId={sessionId}
              analysisResults={analysisResults}
              onBack={() => setCurrentStep(3)}
              onReset={resetApp}
            />
          )}
        </div>

        {/* Footer */}
        <footer className="text-center mt-12 text-gray-500 text-sm">
          <p>AI Job Application Assistant • Built with React & Flask • All processing happens locally</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
