import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ScorePanel from '../components/ScorePanel';
import Timer from '../components/Timer';
import { playAlarm } from '../utils/audio';
import { ScoreboardProps } from '../types';
import './Scoreboard.css';

const Scoreboard: React.FC<ScoreboardProps> = ({ settings }) => {
  const navigate = useNavigate();
  
  // Initialize scores from settings
  const [homeScore, setHomeScore] = useState(settings.initialHomeScore);
  const [awayScore, setAwayScore] = useState(settings.initialAwayScore);
  
  // Timer state
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerComplete, setTimerComplete] = useState(false);
  
  // Reset scores when settings change
  useEffect(() => {
    setHomeScore(settings.initialHomeScore);
    setAwayScore(settings.initialAwayScore);
  }, [settings.initialHomeScore, settings.initialAwayScore]);
  
  // Handle timer completion
  const handleTimerComplete = () => {
    setTimerRunning(false);
    setTimerComplete(true);
    
    // Play sound and vibrate when timer completes
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200]);
    }
    
    try {
      playAlarm();
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };
  
  // Toggle timer
  const toggleTimer = () => {
    if (timerComplete) {
      // Reset timer if it was completed
      setTimerComplete(false);
      setTimerRunning(true);
    } else {
      // Otherwise just toggle running state
      setTimerRunning(prev => !prev);
    }
  };
  
  // Reset timer
  const resetTimer = () => {
    setTimerRunning(false);
    setTimerComplete(false);
  };
  
  // Reset scores
  const resetScores = () => {
    setHomeScore(settings.initialHomeScore);
    setAwayScore(settings.initialAwayScore);
  };
  
  // Reset everything
  const resetAll = () => {
    resetScores();
    resetTimer();
  };

  return (
    <div className="scoreboard-container">
      <div className="scoreboard">
        <div className="scoreboard-header">
          <h1>ScoresTN3</h1>
          
          {settings.showTimer && (
            <div className="timer-container">
              <Timer 
                initialSeconds={settings.timerDuration}
                direction={settings.timerDirection}
                running={timerRunning}
                onComplete={handleTimerComplete}
              />
              <div className="timer-controls">
                <button 
                  className={`timer-button ${timerRunning ? 'pause' : 'play'}`}
                  onClick={toggleTimer}
                >
                  {timerRunning ? 'Pause' : timerComplete ? 'Restart' : 'Start'}
                </button>
                <button 
                  className="timer-button reset"
                  onClick={resetTimer}
                >
                  Reset
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div className="scores-container">
          <ScorePanel 
            team={settings.homeTeamName}
            score={homeScore}
            onScoreChange={setHomeScore}
            increment={settings.scoreIncrement}
          />
          <ScorePanel 
            team={settings.awayTeamName}
            score={awayScore}
            onScoreChange={setAwayScore}
            increment={settings.scoreIncrement}
          />
        </div>
        
        <div className="action-buttons">
          <button className="action-button" onClick={resetScores}>
            Reset Scores
          </button>
          <button className="action-button" onClick={resetAll}>
            Reset All
          </button>
          <button className="action-button" onClick={() => navigate('/settings')}>
            Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default Scoreboard;
