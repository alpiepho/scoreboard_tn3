import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ScoreboardProps } from '../types';
import ScoreAlert from '../components/ScoreAlert';
import './Scoreboard.css';
import './ScoreboardTheme.css'; // Import theme-specific styles
import { getFontFamilyString } from '../utils/fonts';
import { getFontConfig, CONFIG_VERSION } from '../utils/fontConfig';
import { getTeamColors } from '../utils/teamColors';
import { textColorPresets } from '../utils/textColors';
import { logScoreChange, logSetChange } from '../utils/logger';

// Helper to get custom colors from localStorage
function getCustomColors() {
  try {
    const stored = localStorage.getItem('customColors');
    if (stored) return JSON.parse(stored);
  } catch {}
  return {
    homeBg: [],
    awayBg: [],
    homeText: [],
    awayText: [],
  };
}

const Scoreboard: React.FC<ScoreboardProps> = ({ settings, gameState, setGameState, onOpenCommentModal }) => {
  const navigate = useNavigate();
  
  // Alert state
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  
  // Long press state
  const longPressDelay = 500; // ms to hold for a long press
  const decrementInterval = 200; // ms between auto-decrements (faster)
  const homeTimeoutRef = useRef<number | null>(null);
  const awayTimeoutRef = useRef<number | null>(null);
  const homeIntervalRef = useRef<number | null>(null);
  const awayIntervalRef = useRef<number | null>(null);
  
  // Settings button long press state
  const settingsTimeoutRef = useRef<number | null>(null);
  const [settingsPressed, setSettingsPressed] = useState(false);
  const [homePressed, setHomePressed] = useState(false);
  const [awayPressed, setAwayPressed] = useState(false);
  const [homeAutoDecrementing, setHomeAutoDecrementing] = useState(false);
  const [awayAutoDecrementing, setAwayAutoDecrementing] = useState(false);
  
  // Use refs to track the current pressed state for access in timeouts
  const homePressedRef = useRef<boolean>(false);
  const awayPressedRef = useRef<boolean>(false);
  const gameStateRef = useRef(gameState);
  
  // Track previous scores for logging
  const prevScoresRef = useRef({ homeScore: gameState.homeScore, awayScore: gameState.awayScore, homeSets: gameState.homeSets, awaySets: gameState.awaySets });
  
  // Update refs when state changes
  useEffect(() => {
    homePressedRef.current = homePressed;
  }, [homePressed]);
  
  useEffect(() => {
    awayPressedRef.current = awayPressed;
  }, [awayPressed]);
  
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);
  
  // Track which multiples of 7 we've already warned about
  const shownWarningsRef = useRef<Set<number>>(new Set());
  
  // Effect to handle window resize and orientation changes
  useEffect(() => {
    const handleResize = () => {
      // This will trigger CSS media queries to adjust score size
      document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
      
      // Use a multiplier of 1.0 as the base size (changed from 2.0 for testing)
      const sizeMultiplier = 1.0;
      
      // Update font config for current orientation
      const isLandscape = window.innerWidth > window.innerHeight;
      const orientation = isLandscape ? 'landscape' : 'portrait';
      
      // Get font config with orientation-specific multiplier
      const fontConfig = getFontConfig(settings.fontFamily, sizeMultiplier);
      console.log(`RESIZE EVENT - Applied in resize: ${orientation}, score size: ${fontConfig.scoreSize?.[orientation]}, version: ${CONFIG_VERSION}`);
      
      // Update orientation-specific properties
      document.documentElement.style.setProperty(
        '--score-size', 
        fontConfig.scoreSize?.[orientation] || ''
      );
      
      document.documentElement.style.setProperty(
        '--score-padding', 
        fontConfig.scorePadding[orientation]
      );
    };
    
    // Set initial value
    handleResize();
    
    // Add event listeners
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    
    // Force a resize event when component mounts to ensure latest config is applied
    const timer = setTimeout(handleResize, 100);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      clearTimeout(timer);
    };
  }, [settings.fontFamily, CONFIG_VERSION]);
  
  // Effect to apply the selected font family and its configuration
  useEffect(() => {
    // Apply the font-family to the root element for use in CSS
    const fontFamilyValue = getFontFamilyString(settings.fontFamily);
    
    // Use a multiplier of 1.0 as the base size (changed from 2.0 for testing)
    const sizeMultiplier = 1.0;
    
    // Set orientation-specific properties
    const isLandscape = window.innerWidth > window.innerHeight;
    const orientation = isLandscape ? 'landscape' : 'portrait';
    
    // Get font config with orientation-specific multiplier
    const fontConfig = getFontConfig(settings.fontFamily, sizeMultiplier);
    console.log(`FONT EFFECT - Applied in font effect: ${orientation}, score size: ${fontConfig.scoreSize?.[orientation]}, version: ${CONFIG_VERSION}`);
    
    // Set all font-specific properties as CSS variables
    document.documentElement.style.setProperty('--scoreboard-font-family', fontFamilyValue);
    
    // Set score size based on orientation and font
    document.documentElement.style.setProperty(
      '--score-size', 
      fontConfig.scoreSize?.[orientation] || ''
    );
    
    // Set score padding based on orientation and font
    document.documentElement.style.setProperty(
      '--score-padding', 
      fontConfig.scorePadding[orientation]
    );
    
    // Set font weight, line height, and letter spacing
    document.documentElement.style.setProperty('--score-font-weight', String(fontConfig.fontWeight));
    document.documentElement.style.setProperty('--score-line-height', String(fontConfig.lineHeight));
    document.documentElement.style.setProperty('--score-letter-spacing', fontConfig.letterSpacing);
    
  }, [settings.fontFamily, CONFIG_VERSION]);
  
  // Disable browser's pull-to-refresh and other gestures
  useEffect(() => {
    const preventDefaultTouch = (e: TouchEvent) => {
      if (e.target instanceof Element) {
        const targetElement = e.target as Element;
        if (targetElement.closest('.score-button')) {
          e.preventDefault();
        }
      }
    };
    
    document.addEventListener('touchstart', preventDefaultTouch, { passive: false });
    document.addEventListener('touchmove', preventDefaultTouch, { passive: false });
    document.addEventListener('touchend', preventDefaultTouch, { passive: false });
    
    return () => {
      document.removeEventListener('touchstart', preventDefaultTouch);
      document.removeEventListener('touchmove', preventDefaultTouch);
      document.removeEventListener('touchend', preventDefaultTouch);
    };
  }, []);

  // Effect to stop auto-decrement when score reaches zero
  useEffect(() => {
    if (gameState.homeScore === 0 && homeIntervalRef.current !== null) {
      window.clearTimeout(homeIntervalRef.current);
      homeIntervalRef.current = null;
    }
    
    if (gameState.awayScore === 0 && awayIntervalRef.current !== null) {
      window.clearTimeout(awayIntervalRef.current);
      awayIntervalRef.current = null;
    }
  }, [gameState.homeScore, gameState.awayScore]);
  
  // Reset all warnings
  const resetAllWarnings = () => {
    shownWarningsRef.current.clear();
  };
  
  // Effect to reset warnings on component mount/remount
  useEffect(() => {
    resetAllWarnings();
  }, []);
  
  // Effect to reset warnings when scores are reset to zero
  useEffect(() => {
    if (gameState.homeScore === 0 && gameState.awayScore === 0) {
      resetAllWarnings();
    }
  }, [gameState]);

  // Effect to log score and set changes
  useEffect(() => {
    const prev = prevScoresRef.current;
    
    // Log home score changes
    if (gameState.homeScore !== prev.homeScore) {
      logScoreChange('home', prev.homeScore, gameState.homeScore, gameState.homeScore, gameState.awayScore, settings.homeTeamName, settings.awayTeamName);
    }
    
    // Log away score changes  
    if (gameState.awayScore !== prev.awayScore) {
      logScoreChange('away', prev.awayScore, gameState.awayScore, gameState.homeScore, gameState.awayScore, settings.homeTeamName, settings.awayTeamName);
    }
    
    // Log home set changes
    if (gameState.homeSets !== prev.homeSets) {
      logSetChange('home', prev.homeSets, gameState.homeSets, gameState.homeSets, gameState.awaySets, settings.homeTeamName, settings.awayTeamName);
    }
    
    // Log away set changes
    if (gameState.awaySets !== prev.awaySets) {
      logSetChange('away', prev.awaySets, gameState.awaySets, gameState.homeSets, gameState.awaySets, settings.homeTeamName, settings.awayTeamName);
    }
    
    // Update the previous values for next comparison
    prevScoresRef.current = {
      homeScore: gameState.homeScore,
      awayScore: gameState.awayScore,
      homeSets: gameState.homeSets,
      awaySets: gameState.awaySets
    };
  }, [gameState.homeScore, gameState.awayScore, gameState.homeSets, gameState.awaySets, settings.homeTeamName, settings.awayTeamName]);

  // Check if we should show a warning for a multiple of 7
  const checkForWarning = (totalScore: number) => {
    // Don't show a new warning if an alert is already visible
    if (alertVisible) return;
    
    // Only show a warning if:
    // 1. Warnings are enabled in settings
    // 2. The total score is a positive multiple of 7
    // 3. We haven't already shown a warning for this exact multiple of 7
    if (settings.enableScoreWarning && 
        totalScore > 0 && 
        totalScore % 7 === 0 && 
        !shownWarningsRef.current.has(totalScore)) {
      
      // Mark this multiple of 7 as warned
      shownWarningsRef.current.add(totalScore);
      
      // Show the warning with the exact total score
      setAlertMessage(`Total Score: ${totalScore}`);
      setAlertVisible(true);
    }
  };

  // Function to vibrate device if supported
  const vibrate = () => {
    if ('vibrate' in navigator && settings.vibrateOnButtonPress) {
      navigator.vibrate(50); // Short vibration of 50ms
    }
  };
  
  // Reset warnings when scores change
  const resetWarningsOnDecrement = (oldTotalScore: number, newTotalScore: number) => {
    // If we've decremented past a multiple of 7, remove that warning from the shown warnings
    if (oldTotalScore > newTotalScore) {
      // Check all multiples of 7 between the old and new total score
      for (let i = oldTotalScore; i > newTotalScore; i--) {
        if (i % 7 === 0 && shownWarningsRef.current.has(i)) {
          shownWarningsRef.current.delete(i);
        }
      }
    }
  };
  
  // Handle home score changes
  const incrementHomeScore = () => {
    if (alertVisible) return; // Don't update scores when alert is visible
    
    // Update both the state and the ref
    setGameState(prevState => {
      const updatedState = {
        ...prevState,
        homeScore: prevState.homeScore + 1,
        lastScoringTeam: 'home' as const
      };
      
      // Update ref immediately
      gameStateRef.current = updatedState;
      
      return updatedState;
    });
    
    // Calculate the new total score for warning check
    const newTotalScore = (gameState.homeScore + 1) + gameState.awayScore;
    
    // Check if we need to show a warning
    checkForWarning(newTotalScore);
    
    vibrate();
  };
  
  const decrementHomeScore = () => {
    if (alertVisible) return; // Don't update scores when alert is visible
    
    // Calculate old total score for warning check first
    const oldTotalScore = gameState.homeScore + gameState.awayScore;
    
    // Update both the state and the ref
    setGameState(prevState => {
      const currentHomeScore = prevState.homeScore;
      const newHomeScore = Math.max(0, currentHomeScore - 1);
      
      const updatedState = {
        ...prevState,
        homeScore: newHomeScore
      };
      
      // Update ref immediately to avoid race conditions
      gameStateRef.current = updatedState;
      
      return updatedState;
    });
    
    // Calculate new total score for warning reset check
    const newTotalScore = Math.max(0, gameState.homeScore - 1) + gameState.awayScore;
    
    // Reset warnings if we've decremented past a multiple of 7
    resetWarningsOnDecrement(oldTotalScore, newTotalScore);

    vibrate();
  };  // Handle away score changes
  const incrementAwayScore = () => {
    if (alertVisible) return; // Don't update scores when alert is visible
    
    // Update both the state and the ref
    setGameState(prevState => {
      const updatedState = {
        ...prevState,
        awayScore: prevState.awayScore + 1,
        lastScoringTeam: 'away' as const
      };
      
      // Update ref immediately
      gameStateRef.current = updatedState;
      
      return updatedState;
    });
    
    // Calculate the new total score for warning check
    const newTotalScore = gameState.homeScore + (gameState.awayScore + 1);
    
    // Check if we need to show a warning
    checkForWarning(newTotalScore);
    
    vibrate();
  };
  
  const decrementAwayScore = () => {
    if (alertVisible) return; // Don't update scores when alert is visible
    
    // Calculate old total score for warning check first
    const oldTotalScore = gameState.homeScore + gameState.awayScore;
    
    // Update both the state and the ref
    setGameState(prevState => {
      const currentAwayScore = prevState.awayScore;
      const newAwayScore = Math.max(0, currentAwayScore - 1);
      
      const updatedState = {
        ...prevState,
        awayScore: newAwayScore
      };
      
      // Update ref immediately to avoid race conditions
      gameStateRef.current = updatedState;
      
      return updatedState;
    });
    
    // Calculate new total score for warning reset check
    const newTotalScore = gameState.homeScore + Math.max(0, gameState.awayScore - 1);
    
    // Reset warnings if we've decremented past a multiple of 7
    resetWarningsOnDecrement(oldTotalScore, newTotalScore);

    vibrate();
  };  // Home team handlers for long press
  const handleHomeMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    // Don't process when alert is visible
    if (alertVisible) {
      e.preventDefault();
      return;
    }
    
    // Start long press detection
    setHomePressed(true);
    homePressedRef.current = true;
    
    // Clear any existing timers first
    if (homeTimeoutRef.current !== null) {
      clearTimeout(homeTimeoutRef.current);
      homeTimeoutRef.current = null;
    }
    if (homeIntervalRef.current !== null) {
      clearTimeout(homeIntervalRef.current);
      homeIntervalRef.current = null;
    }
    
    // Start the long press timer
    homeTimeoutRef.current = window.setTimeout(() => {
      // First decrement after initial delay
      decrementHomeScore();
      
      // Set auto-decrementing state for visual feedback
      setHomeAutoDecrementing(true);
      
      // Start continuous decrement using recursive setTimeout to avoid React state closure issues
      const startRecursiveDecrement = () => {
        // Check if we should continue
        if (!homePressedRef.current) return;
        
        // Get the current score directly from DOM to ensure we're always using the latest value
        const scoreElement = document.querySelector('.score-button.home .score');
        const currentScore = scoreElement ? parseInt(scoreElement.textContent || '0', 10) : 0;
        
        if (currentScore > 0) {
          decrementHomeScore();
          // Schedule the next decrement with a slight delay to allow the DOM to update
          homeIntervalRef.current = window.setTimeout(startRecursiveDecrement, decrementInterval);
        } else {
          // Stop auto-decrementing and reset state when score reaches zero
          setHomeAutoDecrementing(false);
        }
      };
      
      // Start the recursive process
      startRecursiveDecrement();
      
      // Clear the initial timeout reference
      homeTimeoutRef.current = null;
    }, longPressDelay);
  };
  
  const handleHomeMouseUp = () => {
    // Cancel pressed state
    setHomePressed(false);
    homePressedRef.current = false;
    
    // Reset auto-decrementing state
    setHomeAutoDecrementing(false);
    
    // If interval exists, clear it (stop auto-decrement)
    if (homeIntervalRef.current !== null) {
      clearTimeout(homeIntervalRef.current);
      homeIntervalRef.current = null;
    }
    
    // If timeout still exists, it was a short press (increment)
    if (homeTimeoutRef.current !== null) {
      clearTimeout(homeTimeoutRef.current);
      incrementHomeScore();
      homeTimeoutRef.current = null;
    }
  };
  
  const handleHomeMouseLeave = () => {
    // Cancel all timers when moving out of the button
    if (homeTimeoutRef.current !== null) {
      clearTimeout(homeTimeoutRef.current);
      homeTimeoutRef.current = null;
    }
    
    if (homeIntervalRef.current !== null) {
      clearTimeout(homeIntervalRef.current);
      homeIntervalRef.current = null;
    }
    
    setHomePressed(false);
    homePressedRef.current = false;
    setHomeAutoDecrementing(false);
  };

  // Away team handlers for long press
  const handleAwayMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    // Don't process when alert is visible
    if (alertVisible) {
      e.preventDefault();
      return;
    }
    
    // Start long press detection
    setAwayPressed(true);
    awayPressedRef.current = true;
    
    // Clear any existing timers first
    if (awayTimeoutRef.current !== null) {
      clearTimeout(awayTimeoutRef.current);
      awayTimeoutRef.current = null;
    }
    if (awayIntervalRef.current !== null) {
      clearTimeout(awayIntervalRef.current);
      awayIntervalRef.current = null;
    }
    
    // Start the long press timer
    awayTimeoutRef.current = window.setTimeout(() => {
      // First decrement after initial delay
      decrementAwayScore();
      
      // Set auto-decrementing state for visual feedback
      setAwayAutoDecrementing(true);
      
      // Start continuous decrement using recursive setTimeout to avoid React state closure issues
      const startRecursiveDecrement = () => {
        // Check if we should continue
        if (!awayPressedRef.current) return;
        
        // Get the current score directly from DOM to ensure we're always using the latest value
        const scoreElement = document.querySelector('.score-button.away .score');
        const currentScore = scoreElement ? parseInt(scoreElement.textContent || '0', 10) : 0;
        
        if (currentScore > 0) {
          decrementAwayScore();
          // Schedule the next decrement with a slight delay to allow the DOM to update
          awayIntervalRef.current = window.setTimeout(startRecursiveDecrement, decrementInterval);
        } else {
          // Stop auto-decrementing and reset state when score reaches zero
          setAwayAutoDecrementing(false);
        }
      };
      
      // Start the recursive process
      startRecursiveDecrement();
      
      // Clear the initial timeout reference
      awayTimeoutRef.current = null;
    }, longPressDelay);
  };
  
  const handleAwayMouseUp = () => {
    // Cancel pressed state
    setAwayPressed(false);
    awayPressedRef.current = false;
    
    // Reset auto-decrementing state
    setAwayAutoDecrementing(false);
    
    // If interval exists, clear it (stop auto-decrement)
    if (awayIntervalRef.current !== null) {
      clearTimeout(awayIntervalRef.current);
      awayIntervalRef.current = null;
    }
    
    // If timeout still exists, it was a short press (increment)
    if (awayTimeoutRef.current !== null) {
      clearTimeout(awayTimeoutRef.current);
      incrementAwayScore();
      awayTimeoutRef.current = null;
    }
  };
  
  const handleAwayMouseLeave = () => {
    // Cancel all timers when moving out of the button
    if (awayTimeoutRef.current !== null) {
      clearTimeout(awayTimeoutRef.current);
      awayTimeoutRef.current = null;
    }
    
    if (awayIntervalRef.current !== null) {
      clearTimeout(awayIntervalRef.current);
      awayIntervalRef.current = null;
    }
    
    setAwayPressed(false);
    awayPressedRef.current = false;
    setAwayAutoDecrementing(false);
  };

  // Settings button handlers for long press
  const handleSettingsMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault(); // Prevent default touch behavior
    
    setSettingsPressed(true);
    
    // Clear any existing timer
    if (settingsTimeoutRef.current !== null) {
      clearTimeout(settingsTimeoutRef.current);
      settingsTimeoutRef.current = null;
    }
    
    // Start the long press timer
    settingsTimeoutRef.current = window.setTimeout(() => {
      // Long press detected - open comment modal
      onOpenCommentModal();
      settingsTimeoutRef.current = null;
    }, longPressDelay);
  };
  
  const handleSettingsMouseUp = () => {
    setSettingsPressed(false);
    
    // If timeout still exists, it was a short press (navigate to settings)
    if (settingsTimeoutRef.current !== null) {
      clearTimeout(settingsTimeoutRef.current);
      settingsTimeoutRef.current = null;
      navigate('/settings');
    }
  };
  
  const handleSettingsMouseLeave = () => {
    // Cancel timer when moving out of the button
    if (settingsTimeoutRef.current !== null) {
      clearTimeout(settingsTimeoutRef.current);
      settingsTimeoutRef.current = null;
    }
    setSettingsPressed(false);
  };

  // Clean up timeouts when component unmounts
  useEffect(() => {
    return () => {
      if (homeTimeoutRef.current !== null) {
        window.clearTimeout(homeTimeoutRef.current);
      }
      if (awayTimeoutRef.current !== null) {
        window.clearTimeout(awayTimeoutRef.current);
      }
      if (homeIntervalRef.current !== null) {
        window.clearTimeout(homeIntervalRef.current);
      }
      if (awayIntervalRef.current !== null) {
        window.clearTimeout(awayIntervalRef.current);
      }
      if (settingsTimeoutRef.current !== null) {
        window.clearTimeout(settingsTimeoutRef.current);
      }
    };
  }, []);

  // Get custom colors from localStorage
  const customColors = getCustomColors();

  // Helper to resolve color (preset or custom)
  function resolveColor(colorId: string, customArr: string[], presetArr: any[], presetKey: string) {
    if (colorId.startsWith('#') && customArr.includes(colorId)) {
      return colorId;
    }
    const preset = presetArr.find((p: any) => p.id === colorId);
    return preset ? preset[presetKey] : colorId;
  }

  // Get team background colors (preset or custom)
  const homeBgColor = resolveColor(settings.homeTeamColorId, customColors.homeBg, getTeamColors().home ? [getTeamColors().home, getTeamColors().away] : [], 'backgroundColor');
  const awayBgColor = resolveColor(settings.awayTeamColorId, customColors.awayBg, getTeamColors().home ? [getTeamColors().home, getTeamColors().away] : [], 'backgroundColor');

  // Get text colors (preset or custom)
  const homeTextColor = resolveColor(settings.homeTeamTextColorId, customColors.homeText, textColorPresets, 'color');
  const awayTextColor = resolveColor(settings.awayTeamTextColorId, customColors.awayText, textColorPresets, 'color');

  // Patch: set CSS variables for text color so all children (name, score, circles) inherit it
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--scoreboard-home-text-color', homeTextColor);
    root.style.setProperty('--scoreboard-away-text-color', awayTextColor);
    return () => {
      root.style.removeProperty('--scoreboard-home-text-color');
      root.style.removeProperty('--scoreboard-away-text-color');
    };
  }, [homeTextColor, awayTextColor]);

  return (
    <div className="scoreboard-container">
      {/* Score Alert Popup */}
      <ScoreAlert 
        message={alertMessage}
        isVisible={alertVisible}
        onClose={() => {
          setAlertVisible(false);
          // We've fully processed this warning now
        }}
      />
      
      <div className="scoreboard-buttons">
        <div 
          className={`score-button home ${homePressed ? 'pressed' : ''} ${homeAutoDecrementing ? 'auto-decrementing' : ''}`}
          style={{
            backgroundColor: homeBgColor,
            color: 'var(--scoreboard-home-text-color)', // Inherit text color for all children
            fontFamily: getFontFamilyString(settings.fontFamily),
          }}
          onMouseDown={handleHomeMouseDown}
          onMouseUp={handleHomeMouseUp}
          onMouseLeave={handleHomeMouseLeave}
          onTouchStart={handleHomeMouseDown}
          onTouchEnd={handleHomeMouseUp}
          onTouchCancel={handleHomeMouseLeave}
        >
          <div className="score-content">
            <div className="team-name" style={{ color: 'var(--scoreboard-home-text-color)' }}>{gameState.lastScoringTeam === 'home' ? `${settings.homeTeamName} >` : settings.homeTeamName}</div>
            <div className="score" style={{ color: 'var(--scoreboard-home-text-color)' }}>{gameState.homeScore}</div>
          </div>
          {/* Home team sets circles */}
          {settings.showSets && (
            <div className="team-sets-circles home-set-circles">
              <div className="sets-circles">
                {[...Array(settings.maxSets)].map((_, index) => (
                  <div 
                    key={`home-set-${index}`}
                    className={`set-circle ${index < gameState.homeSets ? 'active' : ''}`}
                    style={{ borderColor: 'var(--scoreboard-home-text-color)', backgroundColor: index < gameState.homeSets ? 'var(--scoreboard-home-text-color)' : 'transparent' }}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering score button
                      e.preventDefault(); // Prevent default browser behavior
                      // Click to toggle the set status
                      
                      if (index < gameState.homeSets) {
                        // If this circle is already active, deactivate it and all after
                        setGameState(prev => {
                          const updatedState = {
                            ...prev,
                            homeSets: index
                          };
                          
                          return updatedState;
                        });
                      } else {
                        // If this circle is inactive, activate it and all before
                        setGameState(prev => {
                          const updatedState = {
                            ...prev,
                            homeSets: index + 1
                          };
                          
                          return updatedState;
                        });
                      }
                      
                      vibrate();
                    }}
                    onTouchEnd={(e) => {
                      e.stopPropagation(); // Prevent triggering score button
                      e.preventDefault(); // Prevent default browser behavior
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        <div 
          className={`score-button away ${awayPressed ? 'pressed' : ''} ${awayAutoDecrementing ? 'auto-decrementing' : ''}`}
          style={{
            backgroundColor: awayBgColor,
            color: 'var(--scoreboard-away-text-color)',
            fontFamily: getFontFamilyString(settings.fontFamily),
          }}
          onMouseDown={handleAwayMouseDown}
          onMouseUp={handleAwayMouseUp}
          onMouseLeave={handleAwayMouseLeave}
          onTouchStart={handleAwayMouseDown}
          onTouchEnd={handleAwayMouseUp}
          onTouchCancel={handleAwayMouseLeave}
        >
          <div className="score-content">
            <div className="team-name" style={{ color: 'var(--scoreboard-away-text-color)' }}>{gameState.lastScoringTeam === 'away' ? `< ${settings.awayTeamName}` : settings.awayTeamName}</div>
            <div className="score" style={{ color: 'var(--scoreboard-away-text-color)' }}>{gameState.awayScore}</div>
          </div>
          {/* Away team sets circles */}
          {settings.showSets && (
            <div className="team-sets-circles away-set-circles">
              <div className="sets-circles">
                {[...Array(settings.maxSets)].map((_, index) => (
                  <div 
                    key={`away-set-${index}`}
                    className={`set-circle ${index < gameState.awaySets ? 'active' : ''}`}
                    style={{ borderColor: 'var(--scoreboard-away-text-color)', backgroundColor: index < gameState.awaySets ? 'var(--scoreboard-away-text-color)' : 'transparent' }}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering score button
                      e.preventDefault(); // Prevent default browser behavior
                      // Click to toggle the set status
                      
                      if (index < gameState.awaySets) {
                        // If this circle is already active, deactivate it and all after
                        setGameState(prev => {
                          const updatedState = {
                            ...prev,
                            awaySets: index
                          };
                          
                          return updatedState;
                        });
                      } else {
                        // If this circle is inactive, activate it and all before
                        setGameState(prev => {
                          const updatedState = {
                            ...prev,
                            awaySets: index + 1
                          };
                          
                          return updatedState;
                        });
                      }
                      
                      vibrate();
                    }}
                    onTouchEnd={(e) => {
                      e.stopPropagation(); // Prevent triggering score button
                      e.preventDefault(); // Prevent default browser behavior
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <button 
        className={`settings-button ${settingsPressed ? 'pressed' : ''}`}
        onMouseDown={handleSettingsMouseDown}
        onMouseUp={handleSettingsMouseUp}
        onMouseLeave={handleSettingsMouseLeave}
        onTouchStart={handleSettingsMouseDown}
        onTouchEnd={handleSettingsMouseUp}
        onTouchCancel={handleSettingsMouseLeave}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
          <path fill="none" d="M0 0h24v24H0z"/>
          <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" fill="currentColor"/>
        </svg>
      </button>
    </div>
  );
};

export default Scoreboard;
