import React, { useState, useEffect } from 'react';

const CoverLetter = ({ resumeData, jobDescription, sessionId, analysisResults, onBack, onReset }) => {
  const [coverLetters, setCoverLetters] = useState({});
  const [activeTone, setActiveTone] = useState('professional');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingAll, setGeneratingAll] = useState(false);
  const [customizations, setCustomizations] = useState({
    highlight_achievements: true,
    include_skills: true,
    company_research: true,
    personal_touch: true
  });

  // Load existing cover letters for this session
  useEffect(() => {
    if (sessionId) {
      loadCoverLetters();
    }
  }, [sessionId]);

  const loadCoverLetters = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/get-cover-letters/${sessionId}`);
      const data = await response.json();

      if (data.success && Object.keys(data.cover_letters).length > 0) {
        setCoverLetters(data.cover_letters);
        setActiveTone(Object.keys(data.cover_letters)[0]);
      }
    } catch (error) {
      console.error('Error loading cover letters:', error);
    }
  };

  const generateCoverLetter = async (tone = 'professional') => {
    setIsGenerating(true);
    try {
      const response = await fetch('http://localhost:5000/api/generate-cover-letter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId,
          tone: tone,
          customizations: customizations
        }),
      });

      const data = await response.json();

      if (data.success) {
        setCoverLetters(prev => ({
          ...prev,
          [tone]: data.cover_letter
        }));
        setActiveTone(tone);
      } else {
        alert('Error generating cover letter: ' + data.error);
      }
    } catch (error) {
      console.error('Error generating cover letter:', error);
      alert('Error generating cover letter. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateAllCoverLetters = async () => {
    setGeneratingAll(true);
    try {
      const response = await fetch('http://localhost:5000/api/generate-all-cover-letters', {
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
        setCoverLetters(data.cover_letters);
        setActiveTone('professional');
      } else {
        alert('Error generating cover letters: ' + data.error);
      }
    } catch (error) {
      console.error('Error generating all cover letters:', error);
      alert('Error generating cover letters. Please try again.');
    } finally {
      setGeneratingAll(false);
    }
  };

  const downloadCoverLetter = (tone) => {
    const content = coverLetters[tone]?.content;
    if (!content) return;

    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `cover_letter_${tone}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const downloadAllCoverLetters = () => {
    Object.keys(coverLetters).forEach(tone => {
      downloadCoverLetter(tone);
    });
  };

  const copyToClipboard = (tone) => {
    const content = coverLetters[tone]?.content;
    if (!content) return;

    navigator.clipboard.writeText(content);
    alert(`✅ Cover letter (${tone}) copied to clipboard!`);
  };

  const tones = [
    { key: 'professional', name: 'Professional', icon: '💼', description: 'Formal and business-appropriate' },
    { key: 'enthusiastic', name: 'Enthusiastic', icon: '🚀', description: 'Energetic and passionate' },
    { key: 'technical', name: 'Technical', icon: '⚙️', description: 'Focus on technical skills' },
    { key: 'conversational', name: 'Conversational', icon: '💬', description: 'Friendly and approachable' },
    { key: 'formal', name: 'Formal', icon: '🎩', description: 'Very traditional and proper' },
    { key: 'creative', name: 'Creative', icon: '🎨', description: 'Innovative and original' }
  ];

  const getToneDisplayName = (toneKey) => {
    const tone = tones.find(t => t.key === toneKey);
    return tone ? tone.name : toneKey;
  };

  return (
    <div className="glass-card p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-cream-50 mb-4">✍️ AI Cover Letter Generator</h2>
        <p className="text-charcoal-300 max-w-2xl mx-auto">
          Generate personalized cover letters in different tones based on your resume and the job requirements.
        </p>
      </div>

      {/* Tone Selection */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-cream-100 mb-4">Select Tone Style</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {tones.map(tone => (
            <button
              key={tone.key}
              onClick={() => setActiveTone(tone.key)}
              className={`p-4 rounded-xl border-2 text-center transition-all hover:shadow-glow ${activeTone === tone.key
                ? 'border-amber-500 bg-amber-500/10 shadow-glow'
                : 'border-charcoal-700 bg-charcoal-800/40 hover:border-amber-500'
                }`}
            >
              <div className="text-2xl mb-2">{tone.icon}</div>
              <div className="font-medium text-cream-200 text-sm mb-1">{tone.name}</div>
              <div className="text-xs text-charcoal-400">{tone.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Customization Options */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-bold text-cream-100 mb-4">Customization Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(customizations).map(([key, value]) => (
            <label key={key} className="flex items-center space-x-3 p-3 glass-card-hover rounded-lg cursor-pointer">
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => setCustomizations(prev => ({
                  ...prev,
                  [key]: e.target.checked
                }))}
                className="rounded text-amber-500 focus:ring-amber-500 bg-charcoal-700 border-charcoal-600"
              />
              <span className="text-cream-200 capitalize">
                {key.replace(/_/g, ' ')}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => generateCoverLetter(activeTone)}
          disabled={isGenerating || generatingAll}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-charcoal-900 border-t-transparent"></div>
              Generating...
            </>
          ) : (
            `Generate ${getToneDisplayName(activeTone)}`
          )}
        </button>

        <button
          onClick={generateAllCoverLetters}
          disabled={generatingAll || isGenerating}
          className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {generatingAll ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-amber-500 border-t-transparent"></div>
              Generating All...
            </>
          ) : (
            'Generate All Tones'
          )}
        </button>

        {Object.keys(coverLetters).length > 0 && (
          <button
            onClick={downloadAllCoverLetters}
            className="btn-secondary flex items-center gap-2"
          >
            📥 Download All
          </button>
        )}
      </div>

      {/* Cover Letter Display */}
      <div className="glass-card p-6 mb-8">
        {isGenerating || generatingAll ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-charcoal-300 text-lg mb-2">AI is crafting your perfect cover letter...</p>
            <p className="text-charcoal-400">This may take a few moments</p>
          </div>
        ) : coverLetters[activeTone] ? (
          <div>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-cream-100">
                  {getToneDisplayName(activeTone)} Cover Letter
                </h3>
                <p className="text-charcoal-400 text-sm">
                  Generated: {new Date(coverLetters[activeTone].generated_at).toLocaleString()}
                </p>
              </div>

              <div className="flex space-x-3 mt-3 lg:mt-0">
                <button
                  onClick={() => copyToClipboard(activeTone)}
                  className="btn-ghost text-sm font-medium flex items-center"
                >
                  📋 Copy
                </button>
                <button
                  onClick={() => downloadCoverLetter(activeTone)}
                  className="btn-secondary text-sm font-medium flex items-center"
                >
                  📥 Download
                </button>
              </div>
            </div>

            <div className="prose max-w-none">
              <textarea
                value={coverLetters[activeTone].content}
                onChange={(e) => {
                  // Allow minor edits
                  setCoverLetters(prev => ({
                    ...prev,
                    [activeTone]: {
                      ...prev[activeTone],
                      content: e.target.value
                    }
                  }));
                }}
                className="w-full h-96 p-6 input-field rounded-xl resize-none font-mono text-sm leading-relaxed"
                spellCheck="false"
              />
            </div>

            <div className="flex justify-between items-center mt-4 pt-4 border-t border-charcoal-700">
              <span className="text-sm text-charcoal-400">
                Word count: <strong>{coverLetters[activeTone].word_count}</strong> •
                Tone: <strong>{getToneDisplayName(activeTone)}</strong>
              </span>
              <span className="text-xs text-charcoal-500">
                Feel free to edit the generated content
              </span>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-charcoal-300">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-lg mb-2">No cover letter generated yet</p>
            <p className="text-sm">Select a tone and click generate to create your first cover letter</p>
          </div>
        )}
      </div>

      {/* Generated Letters Preview */}
      {
        Object.keys(coverLetters).length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-bold text-cream-100 mb-4">Generated Letters</h3>
            <div className="flex flex-wrap gap-3">
              {Object.keys(coverLetters).map(tone => (
                <button
                  key={tone}
                  onClick={() => setActiveTone(tone)}
                  className={`px-4 py-2 rounded-lg border transition-colors flex items-center space-x-2 ${activeTone === tone
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500'
                    : 'bg-charcoal-800/40 text-cream-100 border-charcoal-700 hover:border-amber-500'
                    }`}
                >
                  <span>{tones.find(t => t.key === tone)?.icon}</span>
                  <span>{getToneDisplayName(tone)}</span>
                </button>
              ))}
            </div>
          </div>
        )
      }

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0">
        <div className="space-x-4">
          <button
            onClick={onBack}
            className="btn-ghost px-8 py-3"
          >
            ← Back to Analysis
          </button>

          <button
            onClick={onReset}
            className="btn-secondary px-8 py-3"
          >
            🏠 Start Over
          </button>
        </div>

        {Object.keys(coverLetters).length > 0 && (
          <div className="space-x-4">
            <button
              onClick={() => {
                Object.keys(coverLetters).forEach(tone => copyToClipboard(tone));
              }}
              className="btn-primary"
            >
              📋 Copy All
            </button>
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="mt-8 glass-card p-6">
        <h4 className="font-bold text-amber-400 mb-3 flex items-center">
          <span className="text-xl mr-2">💡</span>
          Cover Letter Tips
        </h4>
        <ul className="space-y-2 text-charcoal-200">
          <li className="flex items-start">
            <span className="text-amber-400 mr-2 mt-1">•</span>
            <span><strong>Customize each letter</strong> - Edit the generated content to make it more personal</span>
          </li>
          <li className="flex items-start">
            <span className="text-amber-400 mr-2 mt-1">•</span>
            <span><strong>Match the tone</strong> - Use professional tone for corporate jobs, enthusiastic for startups</span>
          </li>
          <li className="flex items-start">
            <span className="text-amber-400 mr-2 mt-1">•</span>
            <span><strong>Include specific examples</strong> - Add concrete achievements from your resume</span>
          </li>
          <li className="flex items-start">
            <span className="text-amber-400 mr-2 mt-1">•</span>
            <span><strong>Proofread carefully</strong> - Check for spelling and grammar errors before sending</span>
          </li>
        </ul>
      </div>
    </div >
  );
};

export default CoverLetter;
