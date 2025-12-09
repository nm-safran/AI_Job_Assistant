import React, { useState } from 'react';

const JobDescription = ({ jobDescription, onChange, sessionId, onNext, onBack }) => {
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeJobDescription = async () => {
    if (!jobDescription.trim()) {
      alert('Please enter a job description');
      return null;
    }

    setIsAnalyzing(true);
    try {
      const response = await fetch('http://localhost:5000/api/analyze-job', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          job_description: jobDescription,
          session_id: sessionId
        }),
      });

      const data = await response.json();

      if (data.success) {
        setAnalysis(data.job_analysis);
        return data.job_analysis;
      } else {
        alert('Error analyzing job description: ' + data.error);
        return null;
      }
    } catch (error) {
      console.error('Error analyzing job description:', error);
      alert('Error analyzing job description. Please try again.');
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleNext = async () => {
    if (!jobDescription.trim()) {
      alert('Please enter a job description');
      return;
    }

    // Always analyze before proceeding to ensure backend session is updated
    // This fixes the issue where tabs like "Skills Match" and "Job Analysis" were empty
    const result = await analyzeJobDescription();

    if (result) {
      onNext(jobDescription);
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-card p-8">
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-cream-50 mb-3">
            Paste Job Description
          </h3>
          <p className="text-charcoal-300">
            Add the complete job posting. Our AI will extract requirements, skills, and responsibilities.
          </p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-cream-100 mb-3">
            Job Description *
          </label>
          <textarea
            value={jobDescription}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Paste the full job description here...\n\nInclude:\n• Job title and company\n• Required skills and qualifications\n• Responsibilities\n• Experience level\n• Education requirements"
            className="input-field h-96 resize-none font-mono text-sm"
            disabled={isAnalyzing}
          />
          <div className="flex justify-between items-center mt-3">
            <div className="flex items-center gap-4 text-xs text-charcoal-400">
              <span className="flex items-center gap-1">
                <span className="text-amber-400">▪</span>
                {jobDescription.length} chars
              </span>
              <span className="flex items-center gap-1">
                <span className="text-amber-400">▪</span>
                {jobDescription.split(/\s+/).filter(word => word.length > 0).length} words
              </span>
            </div>
            <button
              onClick={() => analyzeJobDescription()}
              disabled={!jobDescription.trim() || isAnalyzing}
              className="btn-secondary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? '⚡ Analyzing...' : '⚡ Quick Analysis'}
            </button>
          </div>
        </div>

        {analysis && (
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold text-cream-50 mb-6 flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center border border-amber-500/30">
                📊
              </span>
              Quick Analysis Preview
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-cream-100 mb-3 text-sm uppercase tracking-wider">Required Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.skills.map((skill, index) => (
                    <span key={index} className="badge-amber">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-cream-100 mb-2 text-sm uppercase tracking-wider">Experience Level</h4>
                  <p className="text-charcoal-200 bg-charcoal-700/30 px-4 py-2 rounded-lg border border-charcoal-600">
                    {analysis.experience_level}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-cream-100 mb-2 text-sm uppercase tracking-wider">Education Requirements</h4>
                  <div className="space-y-2">
                    {analysis.education_requirements.length > 0 ? (
                      analysis.education_requirements.map((edu, index) => (
                        <p key={index} className="text-charcoal-200 text-sm bg-charcoal-700/30 px-4 py-2 rounded-lg border border-charcoal-600">
                          {edu}
                        </p>
                      ))
                    ) : (
                      <p className="text-charcoal-400 text-sm">Not specified</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {analysis.key_responsibilities.length > 0 && (
              <div className="col-span-full mt-2">
                <h4 className="font-semibold text-cream-100 mb-3 text-sm uppercase tracking-wider">Key Responsibilities</h4>
                <ul className="space-y-2">
                  {analysis.key_responsibilities.slice(0, 3).map((responsibility, index) => (
                    <li key={index} className="text-charcoal-200 text-sm bg-charcoal-700/30 px-4 py-3 rounded-lg border border-charcoal-600 flex items-start gap-2">
                      <span className="text-amber-400 mt-0.5">▸</span>
                      {responsibility}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
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
          onClick={handleNext}
          disabled={!jobDescription.trim() || isAnalyzing}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isAnalyzing ? 'Processing...' : 'Continue to Analysis →'}
        </button>
      </div>

      {/* Tips */}
      <div className="glass-card p-5 border-amber-500/20">
        <h4 className="font-semibold text-amber-400 mb-2 flex items-center gap-2">
          <span>💡</span>
          <span>Pro Tip</span>
        </h4>
        <p className="text-charcoal-300 text-sm leading-relaxed">
          Include the complete job posting with all requirements, responsibilities, and qualifications.
          More detail = better AI analysis and personalized recommendations.
        </p>
      </div>
    </div>
  );
};

export default JobDescription;
