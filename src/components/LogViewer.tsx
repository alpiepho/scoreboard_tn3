import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogEntry } from '../types';
import { getLogEntries, copyLogsToClipboard, clearLogs } from '../utils/logger';
import './LogViewer.css';

interface LogViewerProps {
  visible: boolean;
  onClose: () => void;
}

const LogViewer: React.FC<LogViewerProps> = ({ visible, onClose }) => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<LogEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleClose = () => {
    onClose();
    navigate('/');
  };

  // Load entries when modal opens
  useEffect(() => {
    if (visible) {
      setEntries(getLogEntries());
    }
  }, [visible]);

  if (!visible) return null;

  // Filter entries based on search and type
  const filteredEntries = entries.filter(entry => {
    const matchesSearch = searchTerm === '' || 
      entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (entry.details.action && entry.details.action.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = selectedType === 'all' || entry.type === selectedType;
    
    return matchesSearch && matchesType;
  });

  const handleCopyToClipboard = async () => {
    const success = await copyLogsToClipboard();
    setCopySuccess(success);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleClearLogs = () => {
    clearLogs();
    setEntries([]);
    setShowClearDialog(false);
  };

  const formatTimestamp = (timestamp: Date): string => {
    return timestamp.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div className="log-viewer-overlay" onClick={handleClose}>
      <div className="log-viewer-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="log-viewer-header">
          <h2>Activity Log</h2>
          <button className="log-viewer-close" onClick={handleClose}>×</button>
        </div>

        {/* Controls */}
        <div className="log-viewer-controls">
          <div className="search-filter-row">
            <input
              type="text"
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="log-search-input"
            />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="log-type-filter"
            >
              <option value="all">All Types</option>
              <option value="score">Scores</option>
              <option value="setting">Settings</option>
              <option value="action">Actions</option>
            </select>
          </div>
          
          <div className="log-actions">
            <button 
              className="log-action-button copy-button"
              onClick={handleCopyToClipboard}
              disabled={copySuccess}
            >
              {copySuccess ? 'Copied!' : 'Copy'}
            </button>
            <button 
              className="log-action-button clear-button"
              onClick={() => setShowClearDialog(true)}
            >
              Clear
            </button>
          </div>
        </div>

        {/* Entry Count */}
        <div className="log-entry-count">
          {filteredEntries.length} of {entries.length} entries
        </div>

        {/* Log Entries */}
        <div className="log-entries-container">
          {filteredEntries.length === 0 ? (
            <div className="no-entries">
              {entries.length === 0 ? 'No log entries yet' : 'No entries match your filter'}
            </div>
          ) : (
            filteredEntries.map((entry) => (
              <div key={entry.id} className="log-entry">
                <div className="log-entry-header">
                  <span className="log-entry-time">{formatTimestamp(entry.timestamp)}</span>
                </div>
                <div className="log-entry-description">{entry.description}</div>
              </div>
            ))
          )}
        </div>

        {/* Clear Confirmation Dialog */}
        {showClearDialog && (
          <div className="clear-dialog-overlay">
            <div className="clear-dialog">
              <h3>Clear All Logs?</h3>
              <p>This will permanently delete all log entries. This action cannot be undone.</p>
              <div className="clear-dialog-actions">
                <button 
                  className="clear-confirm-button"
                  onClick={handleClearLogs}
                >
                  Yes, Clear All
                </button>
                <button 
                  className="clear-cancel-button"
                  onClick={() => setShowClearDialog(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LogViewer;
