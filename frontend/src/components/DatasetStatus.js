import React, { useState, useEffect } from 'react';
import dataService from '../services/dataService';

const DatasetStatus = () => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    checkSystemStatus();
  }, []);

  const checkSystemStatus = async () => {
    setLoading(true);
    try {
      const result = await dataService.getDatasetInfo();
      if (result.success) {
        setStatus(result.data.data);
      }
    } catch (error) {
      console.error('Error checking dataset status:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!status) return null;

  const datasetsLoaded = status.datasets_loaded || 0;
  const totalDatasets = 8;
  const isFullyLoaded = datasetsLoaded === totalDatasets;

  return (
    <div className="glass-card p-4 border border-emerald-500/20 mb-6">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></div>
          <span className="text-sm font-medium text-emerald-400">
            ✓ {datasetsLoaded}/{totalDatasets} Datasets Loaded
          </span>
        </div>
        <span className="text-cream-400">{expanded ? '▼' : '▶'}</span>
      </button>

      {expanded && status.dataset_details && (
        <div className="mt-4 pt-4 border-t border-charcoal-700/30 space-y-2">
          {Object.entries(status.dataset_details).map(([key, details]) => (
            <div key={key} className="flex items-center justify-between text-xs text-charcoal-300 pl-6">
              <span>📊 {key.replace(/_/g, ' ')}</span>
              <span className="text-emerald-400">{details.records || 0} records</span>
            </div>
          ))}
          {status.message && (
            <div className="mt-3 text-xs text-charcoal-400 italic pl-6">
              {status.message}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DatasetStatus;
