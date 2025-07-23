import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import Scoreboard from './pages/Scoreboard'
import Settings from './pages/Settings'
import { AppSettings, GameState } from './types'
import { getTeamColors, applyTeamColors } from './utils/teamColors'
import { DEFAULT_SETTINGS } from './utils/constants'

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
    fontFamily: 'Default', // Default font
    homeTeamColorId: 'blue', // Default home team color
    awayTeamColorId: 'red', // Default away team color
  };

  // Initialize settings from localStorage or use defaults
  const [settings, setSettings] = useState<AppSettings>(() => {
    const savedSettings = localStorage.getItem('scoresTN3Settings');
    let loadedSettings;
    
    if (savedSettings) {
      // Parse saved settings
      const parsedSettings = JSON.parse(savedSettings);
      
      // Ensure all required properties exist (in case we're loading older saved settings)
      loadedSettings = {
        ...defaultSettings,
        ...parsedSettings,
        // Make sure color IDs exist
        homeTeamColorId: parsedSettings.homeTeamColorId || 'blue',
        awayTeamColorId: parsedSettings.awayTeamColorId || 'red'
      };
    } else {
      loadedSettings = defaultSettings;
    }
    
    // Apply colors immediately based on loaded settings
    const teamColors = getTeamColors(
      loadedSettings.homeTeamColorId,
      loadedSettings.awayTeamColorId,
      loadedSettings.colorsSwapped
    );
    applyTeamColors(teamColors);
    
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
      awaySets: 0,
      lastScoringTeam: null
    };
  });

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('scoresTN3Settings', JSON.stringify(settings));
  }, [settings]);

  // Apply team colors based on settings
  useEffect(() => {
    console.log('Applying colors, swapped:', settings.colorsSwapped);
    
    // Get and apply the team colors using the utility function
    const teamColors = getTeamColors(
      settings.homeTeamColorId,
      settings.awayTeamColorId,
      settings.colorsSwapped
    );
    
    // Apply the team colors to CSS variables
    applyTeamColors(teamColors);
    
  }, [settings.colorsSwapped, settings.homeTeamColorId, settings.awayTeamColorId]); // Update when color settings change

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
      awaySets: 0,
      lastScoringTeam: null
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
      // Create new settings with swapped values
      const newSettings = {
        ...prevSettings,
        homeTeamName: prevSettings.awayTeamName,
        awayTeamName: prevSettings.homeTeamName,
        colorsSwapped: !prevSettings.colorsSwapped
      };
      
      // Apply the updated colors immediately
      const teamColors = getTeamColors(
        newSettings.homeTeamColorId,
        newSettings.awayTeamColorId,
        newSettings.colorsSwapped
      );
      applyTeamColors(teamColors);
      
      return newSettings;
    });
    
    // Swap scores and sets in game state
    setGameState(prevState => ({
      homeScore: prevState.awayScore,
      awayScore: prevState.homeScore,
      homeSets: prevState.awaySets,
      awaySets: prevState.homeSets,
      lastScoringTeam: prevState.lastScoringTeam === 'home' ? 'away' : 
                       prevState.lastScoringTeam === 'away' ? 'home' : null
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
            gameState={gameState}
            setGameState={setGameState}
          />
        } />
      </Routes>
    </div>
  )
}

export default App
