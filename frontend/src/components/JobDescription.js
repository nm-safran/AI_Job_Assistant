import React, { useState } from 'react';

const JobDescription = ({ jobDescription, onChange, sessionId, onNext, onBack }) => {
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeJobDescription = async () => {
    if (!jobDescription.trim()) {
      alert('Please enter a job description');
      return;
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
      } else {
        alert('Error analyzing job description: ' + data.error);
      }
    } catch (error) {
      console.error('Error analyzing job description:', error);
      alert('Error analyzing job description. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleNext = () => {
    if (!jobDescription.trim()) {
      alert('Please enter a job description');
      return;
    }
    onNext(jobDescription);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Job Description Analysis</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Paste the job description you're interested in. Our AI will analyze the requirements and extract key skills.
        </p>
      </div>

      <div className="mb-8">
        <label className="block text-lg font-medium text-gray-700 mb-4">
          Job Description *
        </label>
        <textarea
          value={jobDescription}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste the complete job description here. Include requirements, responsibilities, and qualifications..."
          className="w-full h-80 p-6 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-gray-700 placeholder-gray-400 text-lg"
          disabled={isAnalyzing}
        />
        <div className="flex justify-between items-center mt-2">
          <span className="text-sm text-gray-500">
            {jobDescription.length} characters • {jobDescription.split(/\s+/).filter(word => word.length > 0).length} words
          </span>
          <button
            onClick={analyzeJobDescription}
            disabled={!jobDescription.trim() || isAnalyzing}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition-colors text-sm font-medium"
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze JD'}
          </button>
        </div>
      </div>

      {analysis && (
        <div className="mb-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <span className="bg-blue-100 p-2 rounded-lg mr-3">📊</span>
            Job Analysis Results
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-700 mb-3">Required Skills</h4>
              <div className="flex flex-wrap gap-2">
                {analysis.skills.map((skill, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Experience Level</h4>
                <p className="text-gray-600 bg-white px-3 py-2 rounded-lg border">
                  {analysis.experience_level}
                </p>
              </div>

              <div>
                <h4 className="font-medium text-gray-700 mb-2">Education Requirements</h4>
                <div className="space-y-1">
                  {analysis.education_requirements.length > 0 ? (
                    analysis.education_requirements.map((edu, index) => (
                      <p key={index} className="text-gray-600 text-sm bg-white px-3 py-1 rounded border">
                        {edu}
                      </p>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">Not specified</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {analysis.key_responsibilities.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium text-gray-700 mb-2">Key Responsibilities</h4>
              <ul className="space-y-2">
                {analysis.key_responsibilities.slice(0, 3).map((responsibility, index) => (
                  <li key={index} className="text-gray-600 text-sm bg-white px-3 py-2 rounded border flex items-start">
                    <span className="text-blue-500 mr-2 mt-1">•</span>
                    {responsibility}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="flex justify-between items-center pt-6 border-t border-gray-200">
        <button
          onClick={onBack}
          className="bg-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-400 transition-colors font-medium"
        >
          ← Back
        </button>

        <button
          onClick={handleNext}
          disabled={!jobDescription.trim()}
          className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-secondary transition-colors font-medium disabled:bg-gray-400"
        >
          Continue to Analysis →
        </button>
      </div>

      {/* Tips */}
      <div className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <h4 className="font-medium text-yellow-800 mb-2 flex items-center">
          <span className="mr-2">💡</span>
          Pro Tip
        </h4>
        <p className="text-yellow-700 text-sm">
          For best results, include the complete job description with requirements, responsibilities, and qualifications.
          The more detailed the description, the better our AI can analyze skill matches.
        </p>
      </div>
    </div>
  );
};

export default JobDescription;
