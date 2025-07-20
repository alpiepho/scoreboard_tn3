import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SettingsProps } from '../types';
import './Settings.css';

const Settings: React.FC<SettingsProps> = ({ settings, setSettings, resetScores, resetScoresAndSets }) => {
  const navigate = useNavigate();
  const [localSettings, setLocalSettings] = useState({ ...settings });
  
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Handle different input types
    if (type === 'number') {
      setLocalSettings({
        ...localSettings,
        [name]: parseInt(value, 10) || 0
      });
    } else if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setLocalSettings({
        ...localSettings,
        [name]: checked
      });
    } else if (name === 'maxSets') {
      // Handle maxSets specifically to ensure it's either 3 or 5
      setLocalSettings({
        ...localSettings,
        maxSets: parseInt(value, 10) === 3 ? 3 : 5
      });
    } else {
      setLocalSettings({
        ...localSettings,
        [name]: value
      });
    }
  };
  
  // Save settings
  const saveSettings = () => {
    setSettings(localSettings);
    navigate('/');
  };
  
  // Reset to defaults
  const resetToDefaults = () => {
    // Set settings to defaults
    const defaultSettings = {
      homeTeamName: 'Home',
      awayTeamName: 'Away',
      enableScoreWarning: true,
      vibrateOnButtonPress: true,
      theme: 'light' as 'light' | 'dark',
      maxSets: 5 as 3 | 5,
      showSets: true,
    };
    
    // Update local settings and apply them
    setLocalSettings(defaultSettings);
    setSettings(defaultSettings);
    
    // Also reset scores and sets
    resetScoresAndSets();
    
    // Navigate back to the scoreboard to show the reset state
    navigate('/');
  };

  // Back/Cancel without saving changes
  const handleCancel = () => {
    // Navigate back without updating settings
    navigate('/');
  };
  
  return (
    <div className="settings-container">
      <div className="settings-header">
        <div className="back-button" onClick={handleCancel}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" fill="currentColor"/>
          </svg>
        </div>
        <h1>Settings</h1>
      </div>
      
      <div className="settings-section usage-instructions">
        <h2>How to Use</h2>
        <div className="instruction-item">
          <div className="instruction-title">Increment Score</div>
          <div className="instruction-description">Single tap on a team's score panel to add 1 point</div>
        </div>
        <div className="instruction-item">
          <div className="instruction-title">Decrement Score</div>
          <div className="instruction-description">Press and hold on a team's score panel to continuously decrease the score</div>
        </div>
        <div className="instruction-item">
          <div className="instruction-title">Manage Sets</div>
          <div className="instruction-description">Tap a circle to toggle sets, press + to add a set, or press - to clear all sets</div>
        </div>
        <div className="instruction-item">
          <div className="instruction-title">Access Settings</div>
          <div className="instruction-description">Tap the gear icon in the bottom-right corner of the scoreboard</div>
        </div>
      </div>
      
      <div className="settings-form">
        <div className="settings-section">
          <h2>Teams</h2>
          
          <div className="form-group">
            <label htmlFor="homeTeamName">Home Team Name</label>
            <input
              type="text"
              id="homeTeamName"
              name="homeTeamName"
              value={localSettings.homeTeamName}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="awayTeamName">Away Team Name</label>
            <input
              type="text"
              id="awayTeamName"
              name="awayTeamName"
              value={localSettings.awayTeamName}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div className="settings-section">
          <h2>Scores</h2>
          
          <div className="form-group checkbox">
            <label htmlFor="enableScoreWarning">Enable Score Warnings</label>
            <input
              type="checkbox"
              id="enableScoreWarning"
              name="enableScoreWarning"
              checked={localSettings.enableScoreWarning}
              onChange={handleChange}
            />
            <div className="setting-hint">Shows notification when total score is a multiple of 7</div>
          </div>
        </div>
        
        <div className="settings-section">
          <h2>Appearance</h2>
          
          <div className="form-group">
            <label htmlFor="theme">Theme</label>
            <select
              id="theme"
              name="theme"
              value={localSettings.theme}
              onChange={handleChange}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
          
          <div className="form-group checkbox">
            <label htmlFor="vibrateOnButtonPress">Vibrate on Button Press</label>
            <input
              type="checkbox"
              id="vibrateOnButtonPress"
              name="vibrateOnButtonPress"
              checked={localSettings.vibrateOnButtonPress}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div className="settings-section">
          <h2>Sets</h2>
          
          <div className="form-group">
            <label htmlFor="maxSets">Maximum Sets</label>
            <select
              id="maxSets"
              name="maxSets"
              value={localSettings.maxSets}
              onChange={handleChange}
            >
              <option value={3}>3 Sets</option>
              <option value={5}>5 Sets</option>
            </select>
            <div className="setting-hint">Number of set indicators to display</div>
          </div>
          
          <div className="form-group checkbox">
            <label htmlFor="showSets">Show Sets</label>
            <input
              type="checkbox"
              id="showSets"
              name="showSets"
              checked={localSettings.showSets}
              onChange={handleChange}
            />
            <div className="setting-hint">Toggle visibility of set indicators</div>
          </div>
        </div>
      </div>
      
      <div className="settings-actions">
        <button className="save-button" onClick={saveSettings}>
          Save Settings
        </button>
        <button className="reset-button" onClick={resetToDefaults}>
          Reset All
        </button>
        <button className="reset-button" onClick={() => {
          // Immediately reset the actual game scores only
          resetScores();
          // Navigate back to the scoreboard to show the reset scores
          navigate('/');
        }}>
          Reset Scores Only
        </button>
        <button className="reset-button" onClick={() => {
          // Immediately reset both scores and sets
          resetScoresAndSets();
          // Navigate back to the scoreboard
          navigate('/');
        }}>
          Reset Scores & Sets
        </button>
        <button className="cancel-button" onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Settings;
