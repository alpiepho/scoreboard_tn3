import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SettingsProps } from '../types';
import './Settings.css';

const Settings: React.FC<SettingsProps> = ({ settings, setSettings, resetScores }) => {
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
    // Only reset team names and options, not the current scores
    const currentHomeScore = localSettings.initialHomeScore;
    const currentAwayScore = localSettings.initialAwayScore;
    
    setLocalSettings({
      homeTeamName: 'Home',
      awayTeamName: 'Away',
      initialHomeScore: currentHomeScore, // Keep current scores
      initialAwayScore: currentAwayScore, // Keep current scores
      enableScoreWarning: true,
      vibrateOnButtonPress: true,
      theme: 'light',
    });
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
          
          <div className="form-group">
            <label htmlFor="initialHomeScore">Initial Home Score</label>
            <input
              type="number"
              id="initialHomeScore"
              name="initialHomeScore"
              value={localSettings.initialHomeScore}
              onChange={handleChange}
              min="0"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="initialAwayScore">Initial Away Score</label>
            <input
              type="number"
              id="initialAwayScore"
              name="initialAwayScore"
              value={localSettings.initialAwayScore}
              onChange={handleChange}
              min="0"
            />
          </div>

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
      </div>
      
      <div className="settings-actions">
        <button className="save-button" onClick={saveSettings}>
          Save Settings
        </button>
        <button className="reset-button" onClick={resetToDefaults}>
          Reset Settings
        </button>
        <button className="reset-button" onClick={() => {
          // Update local settings
          setLocalSettings({
            ...localSettings,
            initialHomeScore: 0,
            initialAwayScore: 0
          });
          // Immediately reset the actual game scores
          resetScores();
        }}>
          Reset Scores
        </button>
        <button className="cancel-button" onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Settings;
