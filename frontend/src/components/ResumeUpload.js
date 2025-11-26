import React, { useCallback, useState } from 'react';

const ResumeUpload = ({ onUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = useCallback(async (file) => {
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('user_id', `user_${Date.now()}`);

    try {
      const response = await fetch('http://localhost:5000/api/upload-resume', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        onUpload(data.resume_data, data.session_id);
      } else {
        alert('Error uploading resume: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error uploading resume. Please try again.');
    } finally {
      setIsUploading(false);
    }
  }, [onUpload]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.type === 'application/pdf' || file.name.endsWith('.docx') || file.name.endsWith('.doc'))) {
      handleFileUpload(file);
    } else {
      alert('Please upload a PDF or DOCX file');
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Upload Your Resume</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Upload your resume in PDF or DOCX format. Our AI will analyze your skills, experience, and education to provide personalized job recommendations.
        </p>
      </div>

      <div
        className={`border-3 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${isDragging
            ? 'border-primary bg-blue-50 scale-105'
            : 'border-gray-300 bg-gray-50 hover:border-primary hover:bg-blue-50'
          } ${isUploading ? 'opacity-50' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isUploading && document.getElementById('resume-upload').click()}
      >
        {isUploading ? (
          <div className="flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mb-4"></div>
            <p className="text-lg text-gray-600">Analyzing your resume...</p>
            <p className="text-sm text-gray-500 mt-2">This may take a few seconds</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <svg className="w-20 h-20 text-gray-400 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-xl text-gray-700 mb-3 font-medium">
              Drag & drop your resume here
            </p>
            <p className="text-gray-500 mb-6">or</p>
            <button
              className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-secondary transition-colors font-medium text-lg"
              disabled={isUploading}
            >
              Browse Files
            </button>
            <p className="text-sm text-gray-500 mt-4">
              Supported formats: PDF, DOCX, DOC • Max size: 10MB
            </p>
          </div>
        )}

        <input
          id="resume-upload"
          type="file"
          className="hidden"
          accept=".pdf,.docx,.doc"
          onChange={handleFileSelect}
          disabled={isUploading}
        />
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <div className="text-center p-4">
          <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-blue-600 text-xl">🔍</span>
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">AI Analysis</h3>
          <p className="text-gray-600 text-sm">Advanced NLP extracts skills, experience, and education from your resume</p>
        </div>

        <div className="text-center p-4">
          <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-green-600 text-xl">🎯</span>
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">Smart Matching</h3>
          <p className="text-gray-600 text-sm">Compare your profile with job requirements and get match scores</p>
        </div>

        <div className="text-center p-4">
          <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-purple-600 text-xl">💡</span>
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">Personalized Tips</h3>
          <p className="text-gray-600 text-sm">Get AI-powered suggestions for skill improvement and interview prep</p>
        </div>
      </div>
    </div>
  );
};

export default ResumeUpload;
