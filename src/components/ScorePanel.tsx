import { useState } from 'react';
import { ScorePanelProps } from '../types';
import './ScorePanel.css';

const ScorePanel: React.FC<ScorePanelProps> = ({ team, score, onScoreChange, increment }) => {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchTimer, setTouchTimer] = useState<number | null>(null);
  
  // Check if vibration should be enabled from localStorage
  const shouldVibrate = () => {
    try {
      const savedSettings = localStorage.getItem('scoresTN3Settings');
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        return settings.vibrateOnButtonPress;
      }
    } catch (error) {
      console.error('Error reading settings:', error);
    }
    return true; // Default to true if setting can't be read
  };

  // Function to vibrate device if supported and enabled
  const vibrate = () => {
    if ('vibrate' in navigator && shouldVibrate()) {
      navigator.vibrate(50); // Short vibration of 50ms
    }
  };

  // Increment score
  const handleIncrement = () => {
    onScoreChange(score + increment);
    vibrate();
  };

  // Decrement score
  const handleDecrement = () => {
    onScoreChange(Math.max(0, score - increment));
    vibrate();
  };

  // Long press handling for continuous increment/decrement
  const handleTouchStart = (increment: boolean) => {
    setTouchStart(Date.now());
    
    // Start a timer that will continuously increment/decrement
    const timer = window.setInterval(() => {
      // Only start continuous change after 500ms of holding
      if (touchStart && Date.now() - touchStart > 500) {
        if (increment) {
          onScoreChange(prev => prev + 1);
        } else {
          onScoreChange(prev => Math.max(0, prev - 1));
        }
        vibrate();
      }
    }, 100); // Increment/decrement every 100ms
    
    setTouchTimer(timer);
  };

  const handleTouchEnd = () => {
    if (touchTimer) {
      clearInterval(touchTimer);
      setTouchTimer(null);
    }
    setTouchStart(null);
  };

  return (
    <div className="score-panel">
      <h2 className="team-name">{team}</h2>
      <div className="score-display">{score}</div>
      <div className="score-controls">
        <button 
          className="score-button decrement"
          onClick={handleDecrement}
          onTouchStart={() => handleTouchStart(false)}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
        >
          -
        </button>
        <button 
          className="score-button increment"
          onClick={handleIncrement}
          onTouchStart={() => handleTouchStart(true)}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default ScorePanel;
