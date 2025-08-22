import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import Scoreboard from './pages/Scoreboard'
import Settings from './pages/Settings'
import { AppSettings, GameState } from './types'
import { getTeamColors, applyTeamColors, applyTeamTextColors } from './utils/teamColors'
import { textColorPresets } from './utils/textColors'
import { logAction, logSettingChange } from './utils/logger'

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
    setCircleColorId: 'black', // Default set circle color
    homeTeamTextColorId: 'white', // Default home team text color
    awayTeamTextColorId: 'black', // Default away team text color
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
        awayTeamColorId: parsedSettings.awayTeamColorId || 'red',
        setCircleColorId: parsedSettings.setCircleColorId || 'black',
        homeTeamTextColorId: parsedSettings.homeTeamTextColorId || 'white',
        awayTeamTextColorId: parsedSettings.awayTeamTextColorId || 'black',
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
    
    // Apply text colors
    const homeTextColor = (textColorPresets.find(c => c.id === loadedSettings.homeTeamTextColorId) || textColorPresets[0]).color;
    const awayTextColor = (textColorPresets.find(c => c.id === loadedSettings.awayTeamTextColorId) || textColorPresets[0]).color;
    applyTeamTextColors(homeTextColor, awayTextColor);
    
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

  // Wrapper for setSettings that includes logging
  const setSettingsWithLogging = (newSettings: AppSettings | ((prev: AppSettings) => AppSettings)) => {
    const oldSettings = settings;
    
    if (typeof newSettings === 'function') {
      const computedSettings = newSettings(oldSettings);
      
      // Log specific setting changes
      Object.keys(computedSettings).forEach(key => {
        const oldValue = oldSettings[key as keyof AppSettings];
        const newValue = computedSettings[key as keyof AppSettings];
        if (oldValue !== newValue) {
          logSettingChange(key, oldValue, newValue);
        }
      });
      
      setSettings(computedSettings);
    } else {
      // Log specific setting changes
      Object.keys(newSettings).forEach(key => {
        const oldValue = oldSettings[key as keyof AppSettings];
        const newValue = newSettings[key as keyof AppSettings];
        if (oldValue !== newValue) {
          logSettingChange(key, oldValue, newValue);
        }
      });
      
      setSettings(newSettings);
    }
  };

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
    
    // Apply team text colors
    const homeTextColor = (textColorPresets.find(c => c.id === settings.homeTeamTextColorId) || textColorPresets[0]).color;
    const awayTextColor = (textColorPresets.find(c => c.id === settings.awayTeamTextColorId) || textColorPresets[0]).color;
    applyTeamTextColors(homeTextColor, awayTextColor);
    
  }, [settings.colorsSwapped, settings.homeTeamColorId, settings.awayTeamColorId, settings.homeTeamTextColorId, settings.awayTeamTextColorId]); // Update when color settings change

  // Initialize game state when the app first loads
  useEffect(() => {
    // Only set the initial game state once when the app loads
    const savedGameState = localStorage.getItem('scoresTN3GameState');
    if (savedGameState) {
      setGameState(JSON.parse(savedGameState));
    }
    
    // Log app startup
    logAction('Application Started', { version: '0.5.6' });
  }, []);

  // Save the game state whenever it changes
  useEffect(() => {
    localStorage.setItem('scoresTN3GameState', JSON.stringify(gameState));
  }, [gameState]);

  // Reset both scores and sets to zero
  const resetScoresAndSets = () => {
    logAction('Reset Scores and Sets', { 
      before: { homeScore: gameState.homeScore, awayScore: gameState.awayScore, homeSets: gameState.homeSets, awaySets: gameState.awaySets },
      after: { homeScore: 0, awayScore: 0, homeSets: 0, awaySets: 0 }
    });
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
    logAction('Reset Scores Only', { 
      before: { homeScore: gameState.homeScore, awayScore: gameState.awayScore },
      after: { homeScore: 0, awayScore: 0 }
    });
    setGameState(prevState => ({
      ...prevState,
      homeScore: 0,
      awayScore: 0
    }));
  };

  // Swap home and away teams
  const swapHomeAndAway = () => {
    logAction('Swap Teams', { 
      before: { 
        homeTeam: settings.homeTeamName, 
        awayTeam: settings.awayTeamName,
        homeScore: gameState.homeScore,
        awayScore: gameState.awayScore,
        homeSets: gameState.homeSets,
        awaySets: gameState.awaySets
      },
      after: { 
        homeTeam: settings.awayTeamName, 
        awayTeam: settings.homeTeamName,
        homeScore: gameState.awayScore,
        awayScore: gameState.homeScore,
        homeSets: gameState.awaySets,
        awaySets: gameState.homeSets
      }
    });
    
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
      
      // Apply text colors
      const homeTextColor = (textColorPresets.find(c => c.id === newSettings.homeTeamTextColorId) || textColorPresets[0]).color;
      const awayTextColor = (textColorPresets.find(c => c.id === newSettings.awayTeamTextColorId) || textColorPresets[0]).color;
      applyTeamTextColors(homeTextColor, awayTextColor);
      
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
            setSettings={setSettingsWithLogging} 
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
