import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SettingsProps } from '../types';
import './Settings.css';

const Settings: React.FC<SettingsProps> = ({ settings, setSettings }) => {
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
    setLocalSettings({
      homeTeamName: 'Home',
      awayTeamName: 'Away',
      initialHomeScore: 0,
      initialAwayScore: 0,
      scoreIncrement: 1,
      timerDuration: 20 * 60, // 20 minutes in seconds
      timerDirection: 'down',
      showTimer: true,
      vibrateOnButtonPress: true,
      theme: 'light',
    });
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
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
          
          <div className="form-group">
            <label htmlFor="scoreIncrement">Score Increment</label>
            <input
              type="number"
              id="scoreIncrement"
              name="scoreIncrement"
              value={localSettings.scoreIncrement}
              onChange={handleChange}
              min="1"
            />
          </div>
        </div>
        
        <div className="settings-section">
          <h2>Timer</h2>
          
          <div className="form-group checkbox">
            <label htmlFor="showTimer">Show Timer</label>
            <input
              type="checkbox"
              id="showTimer"
              name="showTimer"
              checked={localSettings.showTimer}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="timerDuration">Timer Duration (minutes)</label>
            <input
              type="number"
              id="timerDuration"
              name="timerDuration"
              value={Math.floor(localSettings.timerDuration / 60)}
              onChange={(e) => setLocalSettings({
                ...localSettings,
                timerDuration: (parseInt(e.target.value, 10) || 0) * 60
              })}
              min="1"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="timerDirection">Timer Direction</label>
            <select
              id="timerDirection"
              name="timerDirection"
              value={localSettings.timerDirection}
              onChange={handleChange}
            >
              <option value="down">Count Down</option>
              <option value="up">Count Up</option>
            </select>
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
          Reset to Defaults
        </button>
        <button className="cancel-button" onClick={() => navigate('/')}>
          Cancel
        </button>
      </div>
      
      <div className="app-info">
        <h3>About ScoresTN3</h3>
        <p>Version 0.1.0</p>
        <p>A TypeScript PWA conversion of the ScoresTN2 Flutter application.</p>
        <p>
          <a href="https://github.com/alpiepho/scoreboard_tn2" target="_blank" rel="noopener noreferrer">
            View Original Project
          </a>
        </p>
      </div>
    </div>
  );
};

export default Settings;
