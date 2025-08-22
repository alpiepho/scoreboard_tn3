import React, { useState, useEffect } from 'react';
import { getLogSettings, setLoggingEnabled, setLogLimit, getLogEntries, copyLogsToClipboard } from '../utils/logger';
import { LogSettings as LogSettingsType } from '../types';
import './LogSettings.css';

interface LogSettingsProps {
  onViewLogs: () => void;
  onClearLogs: () => void;
}

const LogSettings: React.FC<LogSettingsProps> = ({ onViewLogs, onClearLogs }) => {
  const [settings, setSettings] = useState<LogSettingsType>(() => getLogSettings());
  const [entryCount, setEntryCount] = useState(0);
  const [copySuccess, setCopySuccess] = useState(false);

  // Update entry count when component mounts
  useEffect(() => {
    const entries = getLogEntries();
    setEntryCount(entries.length);
  }, []);

  const handleEnabledChange = (enabled: boolean) => {
    setLoggingEnabled(enabled);
    const updatedSettings = { ...settings, isEnabled: enabled };
    setSettings(updatedSettings);
  };

  const handleLimitChange = (maxEntries: number) => {
    setLogLimit(maxEntries);
    const updatedSettings = { ...settings, maxEntries };
    setSettings(updatedSettings);
    
    // Update entry count after pruning
    setTimeout(() => {
      const entries = getLogEntries();
      setEntryCount(entries.length);
    }, 100);
  };

  const handleCopyToClipboard = async () => {
    const success = await copyLogsToClipboard();
    setCopySuccess(success);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const limitOptions = [
    { value: 100, label: '100 entries' },
    { value: 250, label: '250 entries' },
    { value: 500, label: '500 entries' },
    { value: 1000, label: '1000 entries' },
  ];

  return (
    <div className="log-settings-section">
      
      {/* Enable/Disable Logging */}
      <div className="form-group checkbox">
        <label htmlFor="enableLogging">Enable Activity Logging</label>
        <input
          type="checkbox"
          id="enableLogging"
          checked={settings.isEnabled}
          onChange={(e) => handleEnabledChange(e.target.checked)}
        />
        <div className="setting-hint">
          Track score changes, setting modifications, and user actions
        </div>
      </div>

      {/* Max Entries Limit */}
      <div className="form-group">
        <label htmlFor="maxEntries">Maximum Log Entries</label>
        <select
          id="maxEntries"
          value={settings.maxEntries}
          onChange={(e) => handleLimitChange(parseInt(e.target.value, 10))}
          disabled={!settings.isEnabled}
        >
          {limitOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="setting-hint">
          Older entries are automatically removed when limit is reached
        </div>
      </div>

      {/* Log Status */}
      <div className="log-status">
        <div className="log-status-item">
          <span className="log-status-label">Current Entries:</span>
          <span className="log-status-value">{entryCount}</span>
        </div>
        <div className="log-status-item">
          <span className="log-status-label">Status:</span>
          <span className={`log-status-value ${settings.isEnabled ? 'enabled' : 'disabled'}`}>
            {settings.isEnabled ? 'Enabled' : 'Disabled'}
          </span>
        </div>
      </div>

      {/* Log Actions */}
      <div className="log-actions-grid">
        <button 
          className="log-action-btn view-logs-btn"
          onClick={onViewLogs}
          disabled={entryCount === 0}
        >
          📖 View Log
        </button>
        
        <button 
          className="log-action-btn copy-logs-btn"
          onClick={handleCopyToClipboard}
          disabled={entryCount === 0 || copySuccess}
        >
          {copySuccess ? '✓ Copied!' : '📋 Copy'}
        </button>
        
        <button 
          className="log-action-btn clear-logs-btn"
          onClick={onClearLogs}
          disabled={entryCount === 0}
        >
          🗑️ Clear
        </button>
      </div>
    </div>
  );
};

export default LogSettings;
