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
    colorsSwapped: false, // Default to unswapped colors
  };

  // Initialize settings from localStorage or use defaults
  const [settings, setSettings] = useState<AppSettings>(() => {
    const savedSettings = localStorage.getItem('scoresTN3Settings');
    let loadedSettings;
    
    if (savedSettings) {
      // Parse saved settings
      loadedSettings = JSON.parse(savedSettings);
    } else {
      loadedSettings = defaultSettings;
    }
    
    // Apply colors immediately based on loaded settings
    const homeColor = loadedSettings.colorsSwapped ? '#f44336' : '#2196f3'; // Red : Blue if swapped
    const awayColor = loadedSettings.colorsSwapped ? '#2196f3' : '#f44336'; // Blue : Red if swapped
    document.documentElement.style.setProperty('--home-team-color', homeColor);
    document.documentElement.style.setProperty('--away-team-color', awayColor);
    
    return loadedSettings;
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

  // Apply team colors based on settings
  useEffect(() => {
    console.log('Applying colors, swapped:', settings.colorsSwapped);
    const homeColor = settings.colorsSwapped ? '#f44336' : '#2196f3'; // Red : Blue if swapped
    const awayColor = settings.colorsSwapped ? '#2196f3' : '#f44336'; // Blue : Red if swapped
    
    // Apply the colors immediately and ensure they take effect
    // These will override any values set in CSS
    document.documentElement.style.setProperty('--home-team-color', homeColor);
    document.documentElement.style.setProperty('--away-team-color', awayColor);
  }, [settings.colorsSwapped]); // Update only when colorsSwapped changes

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

  // Swap home and away teams
  const swapHomeAndAway = () => {
    // Swap team names, scores, sets, and toggle the colorsSwapped flag
    setSettings(prevSettings => {
      // Update colors based on the new swapped state
      const newSwappedState = !prevSettings.colorsSwapped;
      const homeColor = newSwappedState ? '#f44336' : '#2196f3'; // Red : Blue
      const awayColor = newSwappedState ? '#2196f3' : '#f44336'; // Blue : Red
      
      // Set the CSS variables immediately
      document.documentElement.style.setProperty('--home-team-color', homeColor);
      document.documentElement.style.setProperty('--away-team-color', awayColor);
      
      return {
        ...prevSettings,
        homeTeamName: prevSettings.awayTeamName,
        awayTeamName: prevSettings.homeTeamName,
        colorsSwapped: newSwappedState
      };
    });
    
    // Swap scores and sets in game state
    setGameState(prevState => ({
      homeScore: prevState.awayScore,
      awayScore: prevState.homeScore,
      homeSets: prevState.awaySets,
      awaySets: prevState.homeSets
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
            swapHomeAndAway={swapHomeAndAway}
          />
        } />
      </Routes>
    </div>
  )
}

export default App
