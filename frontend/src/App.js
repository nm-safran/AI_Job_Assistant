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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🤖 AI Job Application Assistant
          </h1>
          <p className="text-lg text-gray-600">
            Smart resume analysis, job matching, and cover letter generation
          </p>
        </header>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          {[1, 2, 3, 4].map(step => (
            <div key={step} className="flex items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 font-semibold transition-all ${currentStep >= step
                ? 'bg-primary text-white border-primary'
                : 'bg-white text-gray-400 border-gray-300'
                }`}>
                {step}
              </div>
              {step < 4 && (
                <div className={`w-16 h-1 mx-2 transition-all ${currentStep > step ? 'bg-primary' : 'bg-gray-300'
                  }`}></div>
              )}
            </div>
          ))}
        </div>

        {/* Step Labels */}
        <div className="flex justify-center mb-8 text-sm font-medium text-gray-600">
          <div className="w-24 text-center">Upload Resume</div>
          <div className="w-24 text-center">Job Analysis</div>
          <div className="w-24 text-center">AI Analysis</div>
          <div className="w-24 text-center">Cover Letter</div>
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
