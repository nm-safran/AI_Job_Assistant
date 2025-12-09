import React, { useState } from 'react';

const RealProjectsDisplay = ({ projects, skill }) => {
  const [displayedProjects, setDisplayedProjects] = useState(projects ? projects.slice(0, 3) : []);
  const [showAll, setShowAll] = useState(false);

  if (!projects || projects.length === 0) {
    return null;
  }

  const handleToggleShowAll = () => {
    if (showAll) {
      setDisplayedProjects(projects.slice(0, 3));
      setShowAll(false);
    } else {
      setDisplayedProjects(projects);
      setShowAll(true);
    }
  };

  return (
    <div className="glass-card border border-amber-500/20 p-6 mt-4">
      <h5 className="text-sm font-semibold text-amber-400 mb-4 flex items-center">
        <span className="mr-2">🚀</span>
        Recommended Practice Projects ({projects.length})
      </h5>

      <div className="space-y-3">
        {displayedProjects.map((project, idx) => {
          return (
            <div
              key={idx}
              className="glass-card p-4 border border-amber-500/10 hover:border-amber-500/30 transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">📁</span>
                    <h6 className="font-semibold text-cream-100 text-sm">{project.name}</h6>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="px-2 py-1 text-xs bg-charcoal-700 text-charcoal-200 rounded border border-charcoal-600">
                      {project.language || skill}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded border ${project.difficulty === 'High'
                        ? 'bg-red-500/10 text-red-400 border-red-500/20'
                        : 'bg-green-500/10 text-green-400 border-green-500/20'
                      }`}>
                      {project.difficulty || 'Medium'} Difficulty
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-right">
                  <div className="text-center">
                    <div className="text-amber-400 font-bold text-sm flex items-center gap-1">
                      ⭐ {project.stars}
                    </div>
                    <div className="text-xs text-charcoal-400">Stars</div>
                  </div>
                  <div className="text-center">
                    <div className="text-charcoal-200 font-bold text-sm">
                      {project.forks}
                    </div>
                    <div className="text-xs text-charcoal-400">Forks</div>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-charcoal-600/30 flex justify-end">
                <a
                  href={`https://github.com/${project.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1"
                >
                  View on GitHub ↗
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {projects.length > 3 && (
        <button
          onClick={handleToggleShowAll}
          className="mt-4 w-full py-2 px-4 glass-card-hover border border-amber-500/20 text-amber-400 hover:text-amber-300 text-sm font-medium rounded transition-all"
        >
          {showAll ? `Show Less (3/${projects.length})` : `Show All ${projects.length} Projects`}
        </button>
      )}
    </div>
  );
};

export default RealProjectsDisplay;
