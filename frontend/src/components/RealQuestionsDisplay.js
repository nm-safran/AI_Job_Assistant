import React, { useState } from 'react';

const RealQuestionsBadge = ({ count, onClick }) => {
  if (!count || count === 0) return null;

  return (
    <button
      onClick={onClick}
      className="ml-2 px-3 py-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold rounded-full hover:shadow-lg hover:shadow-emerald-500/50 transition-all"
    >
      📊 +{count} Real Dataset
    </button>
  );
};

const RealQuestionsDisplay = ({ questions, category = 'All' }) => {
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [displayedQuestions, setDisplayedQuestions] = useState(questions ? questions.slice(0, 3) : []);
  const [showAll, setShowAll] = useState(false);

  if (!questions || questions.length === 0) {
    return null;
  }

  const handleToggleShowAll = () => {
    if (showAll) {
      setDisplayedQuestions(questions.slice(0, 3));
      setShowAll(false);
    } else {
      setDisplayedQuestions(questions);
      setShowAll(true);
    }
  };

  const getDifficultyColor = (difficulty) => {
    const level = difficulty?.toLowerCase() || 'medium';
    if (level.includes('easy') || level.includes('beginner')) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    if (level.includes('hard') || level.includes('expert')) return 'bg-red-500/10 text-red-400 border-red-500/20';
    return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
  };

  return (
    <div className="glass-card border border-teal-500/20 p-6 mt-4">
      <h5 className="text-sm font-semibold text-teal-400 mb-4 flex items-center">
        <span className="mr-2">📊</span>
        Real Interview Questions from Kaggle ({questions.length} available)
      </h5>

      <div className="space-y-3">
        {displayedQuestions.map((question, idx) => (
          <div
            key={idx}
            className="glass-card p-4 border border-teal-500/10 hover:border-teal-500/30 transition-all cursor-pointer"
            onClick={() => setSelectedQuestion(selectedQuestion?.id === question.id ? null : question)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h6 className="font-semibold text-cream-100 text-sm leading-tight mb-2">
                  {question.question || question.title || 'Question'}
                </h6>

                <div className="flex flex-wrap gap-2 items-center">
                  {question.difficulty && (
                    <span className={`px-2 py-1 text-xs rounded border ${getDifficultyColor(question.difficulty)}`}>
                      {question.difficulty}
                    </span>
                  )}
                  {question.category && (
                    <span className="px-2 py-1 text-xs bg-teal-500/10 text-teal-400 rounded border border-teal-500/20">
                      {question.category}
                    </span>
                  )}
                  {question.type && (
                    <span className="px-2 py-1 text-xs bg-blue-500/10 text-blue-400 rounded border border-blue-500/20">
                      {question.type}
                    </span>
                  )}
                </div>
              </div>

              <div className="ml-3 text-teal-400">
                {selectedQuestion?.id === question.id ? '▼' : '▶'}
              </div>
            </div>

            {/* Expanded Answer */}
            {selectedQuestion?.id === question.id && (
              <div className="mt-4 pt-4 border-t border-charcoal-600/30 animate-fade-in">
                {question.answer && (
                  <div className="mb-4">
                    <h7 className="text-xs font-semibold text-emerald-400 mb-2">💡 Answer:</h7>
                    <p className="text-charcoal-200 text-sm leading-relaxed whitespace-pre-wrap">
                      {question.answer}
                    </p>
                  </div>
                )}

                {question.hints && (
                  <div className="mb-3">
                    <h7 className="text-xs font-semibold text-amber-400 mb-2">🎯 Hints:</h7>
                    <ul className="text-charcoal-200 text-sm space-y-1">
                      {(Array.isArray(question.hints) ? question.hints : [question.hints]).map((hint, i) => (
                        <li key={i} className="flex items-start">
                          <span className="text-amber-400 mr-2">•</span>
                          <span>{hint}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {question.follow_up && (
                  <div>
                    <h7 className="text-xs font-semibold text-blue-400 mb-2">❓ Follow-up:</h7>
                    <p className="text-charcoal-200 text-sm">{question.follow_up}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {questions.length > 3 && (
        <button
          onClick={handleToggleShowAll}
          className="mt-4 w-full py-2 px-4 glass-card-hover border border-teal-500/20 text-teal-400 hover:text-teal-300 text-sm font-medium rounded transition-all"
        >
          {showAll ? `Show Less (3/${questions.length})` : `Show All ${questions.length} Questions`}
        </button>
      )}
    </div>
  );
};

export default RealQuestionsDisplay;
export { RealQuestionsBadge };
