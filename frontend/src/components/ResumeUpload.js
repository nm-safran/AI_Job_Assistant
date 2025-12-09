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
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr] items-start">
        {/* Main Upload Card */}
        <div className="glass-card p-8 lg:p-10 h-full">
          <div className="text-center mb-6 lg:mb-8">
            <h3 className="text-2xl font-bold text-cream-50 mb-2 lg:mb-3">
              Upload Your Resume
            </h3>
            <p className="text-charcoal-300 max-w-xl mx-auto">
              Drop your PDF or DOCX file here. Our AI will extract and analyze your professional profile in seconds.
            </p>
          </div>

          <div
            className={`relative border-2 border-dashed rounded-2xl p-10 lg:p-12 text-center cursor-pointer transition-all duration-300 min-h-[320px] max-h-[420px] flex flex-col justify-center ${isDragging
              ? 'border-amber-500 bg-amber-500/5 scale-[1.01] shadow-glow'
              : 'border-charcoal-600 bg-charcoal-800/20 hover:border-amber-600/50 hover:bg-charcoal-800/40'
              } ${isUploading ? 'pointer-events-none opacity-60' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !isUploading && document.getElementById('resume-upload').click()}
          >
            {isUploading ? (
              <div className="flex flex-col items-center justify-center gap-3">
                <div className="relative w-16 h-16 lg:w-20 lg:h-20">
                  <div className="absolute inset-0 border-4 border-charcoal-600 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-amber-500 rounded-full border-t-transparent animate-spin"></div>
                </div>
                <p className="text-lg lg:text-xl text-cream-100 font-semibold">Processing Resume</p>
                <p className="text-sm text-charcoal-400">Extracting your professional data...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-4">
                {/* Upload Icon */}
                <div className="relative">
                  <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/20 flex items-center justify-center border border-amber-500/30">
                    <svg className="w-9 h-9 lg:w-10 lg:h-10 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-xs font-bold text-charcoal-900">
                    +
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-xl text-cream-100 font-semibold">
                    Drop your resume here
                  </p>
                  <p className="text-charcoal-400 text-sm">or click to browse</p>
                </div>

                <button className="btn-primary">
                  Select File
                </button>

                <div className="flex flex-wrap items-center justify-center gap-4 lg:gap-6 text-sm text-charcoal-400">
                  <span className="flex items-center gap-2">
                    <span className="text-amber-400">✓</span> PDF
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="text-amber-400">✓</span> DOCX
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="text-amber-400">✓</span> Max 10MB
                  </span>
                </div>
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
        </div>

        {/* Features */}
        <div className="space-y-4">
          <div className="glass-card-hover p-5 lg:p-6 group h-full">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/20 flex items-center justify-center mb-4 border border-amber-500/30 group-hover:shadow-glow transition-all duration-300">
              <span className="text-2xl">⚡</span>
            </div>
            <h4 className="font-bold text-cream-100 mb-2 text-lg">Instant Parsing</h4>
            <p className="text-charcoal-300 text-sm leading-relaxed">
              Advanced NLP engine extracts skills, experience, and education in real-time
            </p>
          </div>

          <div className="glass-card-hover p-5 lg:p-6 group h-full">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/20 flex items-center justify-center mb-4 border border-amber-500/30 group-hover:shadow-glow transition-all duration-300">
              <span className="text-2xl">🎯</span>
            </div>
            <h4 className="font-bold text-cream-100 mb-2 text-lg">Smart Analysis</h4>
            <p className="text-charcoal-300 text-sm leading-relaxed">
              AI-powered matching scores and gap analysis for targeted positions
            </p>
          </div>

          <div className="glass-card-hover p-5 lg:p-6 group h-full">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/20 flex items-center justify-center mb-4 border border-amber-500/30 group-hover:shadow-glow transition-all duration-300">
              <span className="text-2xl">🔒</span>
            </div>
            <h4 className="font-bold text-cream-100 mb-2 text-lg">Privacy First</h4>
            <p className="text-charcoal-300 text-sm leading-relaxed">
              Your data stays secure. All processing happens locally on our servers
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeUpload;
