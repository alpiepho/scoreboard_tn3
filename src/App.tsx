import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import Scoreboard from './pages/Scoreboard'
import Settings from './pages/Settings'
import { AppSettings, GameState } from './types'

function App() {
  // Default settings
  const defaultSettings: AppSettings = {
    homeTeamName: 'Home',
    awayTeamName: 'Away',
    enableScoreWarning: true, // Default to enable warnings at multiples of 7
    vibrateOnButtonPress: true,
    theme: 'light',
    maxSets: 5, // Default to 5 sets
    showSets: true, // Default to showing sets
  };

  // Initialize settings from localStorage or use defaults
  const [settings, setSettings] = useState<AppSettings>(() => {
    const savedSettings = localStorage.getItem('scoresTN3Settings');
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
  });

  // Initialize game state - the current scores
  const [gameState, setGameState] = useState<GameState>(() => {
    // Try to get saved game state from localStorage
    const savedGameState = localStorage.getItem('scoresTN3GameState');
    // Return saved state or default to zeros
    return savedGameState ? JSON.parse(savedGameState) : {
      homeScore: 0,
      awayScore: 0,
      homeSets: 0,
      awaySets: 0
    };
  });

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('scoresTN3Settings', JSON.stringify(settings));
  }, [settings]);

  // Initialize game state when the app first loads
  useEffect(() => {
    // Only set the initial game state once when the app loads
    const savedGameState = localStorage.getItem('scoresTN3GameState');
    if (savedGameState) {
      setGameState(JSON.parse(savedGameState));
    }
  }, []);

  // Save the game state whenever it changes
  useEffect(() => {
    localStorage.setItem('scoresTN3GameState', JSON.stringify(gameState));
  }, [gameState]);

  // Reset both scores and sets to zero
  const resetScoresAndSets = () => {
    setGameState({
      homeScore: 0,
      awayScore: 0,
      homeSets: 0,
      awaySets: 0
    });
  };

  // Reset only scores, preserving sets
  const resetScores = () => {
    setGameState(prevState => ({
      ...prevState,
      homeScore: 0,
      awayScore: 0
    }));
  };

  return (
    <div className={`app ${settings.theme}`}>
      <Routes>
        <Route path="/" element={
          <Scoreboard 
            settings={settings} 
            gameState={gameState} 
            setGameState={setGameState} 
          />
        } />
        <Route path="/settings" element={
          <Settings 
            settings={settings} 
            setSettings={setSettings} 
            resetScores={resetScores}
            resetScoresAndSets={resetScoresAndSets}
          />
        } />
      </Routes>
    </div>
  )
}

export default App
