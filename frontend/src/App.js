import React, { useState } from 'react';
import ResumeUpload from './components/ResumeUpload';
import JobDescription from './components/JobDescription';
import AnalysisResults from './components/AnalysisResults';
import CoverLetter from './components/CoverLetter';

console.log('🎯 CareerForge AI - Advanced Job Assistant Loaded');

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

  const steps = [
    { id: 1, label: 'Resume', icon: '📋', desc: 'Upload' },
    { id: 2, label: 'Position', icon: '🎯', desc: 'Define' },
    { id: 3, label: 'Analysis', icon: '⚡', desc: 'Review' },
    { id: 4, label: 'Cover Letter', icon: '📝', desc: 'Generate' }
  ];

  return (
    <div className="min-h-screen bg-charcoal-900 relative overflow-hidden">
      {/* Ambient Background Effects */}
      <div className="fixed inset-0 bg-mesh-gradient pointer-events-none"></div>
      <div className="fixed top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="fixed bottom-0 left-0 w-96 h-96 bg-amber-600/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="relative z-10 flex min-h-screen">
        {/* Sidebar Navigation */}
        <aside className="w-72 border-r border-charcoal-700/50 backdrop-blur-xl bg-charcoal-800/30 p-6 flex flex-col animate-slide-in-left">
          {/* Logo & Branding */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-xl">
                ⚡
              </div>
              <div>
                <h1 className="text-xl font-bold text-cream-50">CareerForge</h1>
                <p className="text-xs text-charcoal-400">AI Job Assistant</p>
              </div>
            </div>
          </div>

          {/* Navigation Steps */}
          <nav className="flex-1 space-y-2">
            {steps.map((step) => (
              <button
                key={step.id}
                onClick={() => {
                  if (step.id === 1) setCurrentStep(1);
                  else if (step.id === 2 && resumeData) setCurrentStep(2);
                  else if (step.id === 3 && jobDescription) setCurrentStep(3);
                  else if (step.id === 4 && analysisResults) setCurrentStep(4);
                }}
                disabled={
                  (step.id === 2 && !resumeData) ||
                  (step.id === 3 && !jobDescription) ||
                  (step.id === 4 && !analysisResults)
                }
                className={`w-full ${currentStep === step.id
                    ? 'nav-link-active'
                    : currentStep > step.id
                      ? 'nav-link text-amber-400/70'
                      : 'nav-link opacity-50 cursor-not-allowed'
                  }`}
              >
                <span className="text-2xl">{step.icon}</span>
                <div className="flex-1 text-left">
                  <div className="font-semibold">{step.label}</div>
                  <div className="text-xs text-charcoal-400">{step.desc}</div>
                </div>
                {currentStep > step.id && (
                  <span className="text-emerald-400">✓</span>
                )}
              </button>
            ))}
          </nav>

          {/* Reset Button */}
          {currentStep > 1 && (
            <button
              onClick={resetApp}
              className="mt-6 w-full glass-card px-4 py-3 text-sm font-medium text-cream-200 hover:text-amber-400 hover:border-amber-500/30 transition-all duration-200"
            >
              ↻ Start Over
            </button>
          )}

          {/* Footer Info */}
          <div className="mt-6 pt-6 border-t border-charcoal-700/50">
            <div className="flex items-center gap-2 text-xs text-charcoal-400">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              <span>System Online</span>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto px-8 py-10">
            {/* Header */}
            <header className="mb-10 animate-fade-in">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cream-50 via-amber-200 to-amber-400 bg-clip-text text-transparent">
                    {steps[currentStep - 1].label}
                  </h2>
                  <p className="text-charcoal-400">
                    Step {currentStep} of {steps.length}
                  </p>
                </div>

                {/* Progress Indicator */}
                <div className="flex items-center gap-2">
                  {steps.map((step, idx) => (
                    <div
                      key={step.id}
                      className={`h-1.5 rounded-full transition-all duration-500 ${idx + 1 <= currentStep
                          ? 'w-12 bg-gradient-to-r from-amber-500 to-amber-600'
                          : 'w-8 bg-charcoal-700'
                        }`}
                    ></div>
                  ))}
                </div>
              </div>
            </header>

            {/* Step Content */}
            <div className="animate-scale-in">
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
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
