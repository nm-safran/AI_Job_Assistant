import React, { useState, useEffect } from 'react';
import { formatCourseForDisplay } from '../services/dataService';

const RealCoursesDisplay = ({ courses, skill }) => {
  const [displayedCourses, setDisplayedCourses] = useState(courses ? courses.slice(0, 3) : []);
  const [showAll, setShowAll] = useState(false);

  if (!courses || courses.length === 0) {
    return null;
  }

  const handleToggleShowAll = () => {
    if (showAll) {
      setDisplayedCourses(courses.slice(0, 3));
      setShowAll(false);
    } else {
      setDisplayedCourses(courses);
      setShowAll(true);
    }
  };

  return (
    <div className="glass-card border border-emerald-500/20 p-6 mt-4">
      <h5 className="text-sm font-semibold text-emerald-400 mb-4 flex items-center">
        <span className="mr-2">🌐</span>
        Real Courses from Kaggle Datasets ({courses.length} available)
      </h5>

      <div className="space-y-3">
        {displayedCourses.map((course, idx) => {
          const formatted = formatCourseForDisplay(course);

          return (
            <div
              key={idx}
              className="glass-card p-4 border border-emerald-500/10 hover:border-emerald-500/30 transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1">
                  <h6 className="font-semibold text-cream-100 text-sm">{formatted.title}</h6>
                  <p className="text-xs text-charcoal-400 mt-1">{formatted.description?.substring(0, 100)}</p>

                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="px-2 py-1 text-xs bg-emerald-500/10 text-emerald-400 rounded border border-emerald-500/20">
                      {formatted.platform}
                    </span>
                    {formatted.level && (
                      <span className="px-2 py-1 text-xs bg-amber-500/10 text-amber-400 rounded border border-amber-500/20">
                        {formatted.level}
                      </span>
                    )}
                    {formatted.duration && (
                      <span className="px-2 py-1 text-xs bg-blue-500/10 text-blue-400 rounded border border-blue-500/20">
                        ⏱️ {formatted.duration}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-right">
                  {formatted.rating && formatted.rating !== 'N/A' && (
                    <div className="text-center">
                      <div className="text-amber-400 font-bold text-sm">⭐ {formatted.rating}</div>
                      <div className="text-xs text-charcoal-400">Rating</div>
                    </div>
                  )}
                  {formatted.price && formatted.price !== 'Free' && (
                    <div className="text-center">
                      <div className="text-emerald-400 font-bold text-sm">${formatted.price}</div>
                      <div className="text-xs text-charcoal-400">Price</div>
                    </div>
                  )}
                  {formatted.price === 'Free' && (
                    <div className="text-center">
                      <div className="text-emerald-400 font-bold text-sm">FREE</div>
                      <div className="text-xs text-charcoal-400">No cost</div>
                    </div>
                  )}
                </div>
              </div>

              {formatted.url && formatted.url !== '#' && (
                <div className="mt-3 pt-3 border-t border-charcoal-600/30">
                  <a
                    href={formatted.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center"
                  >
                    View Course →
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {courses.length > 3 && (
        <button
          onClick={handleToggleShowAll}
          className="mt-4 w-full py-2 px-4 glass-card-hover border border-emerald-500/20 text-emerald-400 hover:text-emerald-300 text-sm font-medium rounded transition-all"
        >
          {showAll ? `Show Less (3/${courses.length})` : `Show All ${courses.length} Courses`}
        </button>
      )}
    </div>
  );
};

export default RealCoursesDisplay;
