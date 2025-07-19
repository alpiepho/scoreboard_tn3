import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ScoreboardProps } from '../types';
import ScoreAlert from '../components/ScoreAlert';
import './Scoreboard.css';

const Scoreboard: React.FC<ScoreboardProps> = ({ settings, gameState, setGameState }) => {
  const navigate = useNavigate();
  
  // Alert state
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  
  // Touch tracking data
  const homeButtonRef = useRef<HTMLDivElement>(null);
  const awayButtonRef = useRef<HTMLDivElement>(null);
  const homeStartY = useRef<number | null>(null);
  const awayStartY = useRef<number | null>(null);
  const homeSwipeProcessed = useRef(false);
  const awaySwipeProcessed = useRef(false);
  
  // Track which multiples of 7 we've already warned about
  const shownWarningsRef = useRef<Set<number>>(new Set());
  
  // Effect to handle window resize and orientation changes
  useEffect(() => {
    const handleResize = () => {
      // This will trigger CSS media queries to adjust score size
      // We don't need to do anything else here as CSS handles the responsiveness
      document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    };
    
    // Set initial value
    handleResize();
    
    // Add event listeners
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);
  
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

  // Check if we should show a warning for a multiple of 7
  const checkForWarning = (totalScore: number) => {
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
  
  // Handle home score changes
  const incrementHomeScore = () => {
    if (alertVisible) return; // Don't update scores when alert is visible
    
    const newHomeScore = gameState.homeScore + 1;
    setGameState({
      ...gameState,
      homeScore: newHomeScore
    });
    
    // Calculate the new total score directly
    const newTotalScore = newHomeScore + gameState.awayScore;
    
    // Check if we need to show a warning
    checkForWarning(newTotalScore);
    
    vibrate();
  };
  
  const decrementHomeScore = () => {
    if (alertVisible) return; // Don't update scores when alert is visible
    
    const newHomeScore = Math.max(0, gameState.homeScore - 1);
    setGameState({
      ...gameState,
      homeScore: newHomeScore
    });
    vibrate();
  };
  
  // Handle away score changes
  const incrementAwayScore = () => {
    if (alertVisible) return; // Don't update scores when alert is visible
    
    const newAwayScore = gameState.awayScore + 1;
    setGameState({
      ...gameState,
      awayScore: newAwayScore
    });
    
    // Calculate the new total score directly
    const newTotalScore = gameState.homeScore + newAwayScore;
    
    // Check if we need to show a warning
    checkForWarning(newTotalScore);
    
    vibrate();
  };
  
  const decrementAwayScore = () => {
    if (alertVisible) return; // Don't update scores when alert is visible
    
    const newAwayScore = Math.max(0, gameState.awayScore - 1);
    setGameState({
      ...gameState,
      awayScore: newAwayScore
    });
    vibrate();
  };
  
  // Home team touch handlers
  const handleHomeTouchStart = (e: React.TouchEvent) => {
    // Don't process touches when alert is visible
    if (alertVisible) {
      e.preventDefault();
      return;
    }
    
    e.preventDefault();
    homeStartY.current = e.touches[0].clientY;
    homeSwipeProcessed.current = false;
  };

  const handleHomeTouchMove = (e: React.TouchEvent) => {
    // Don't process touches when alert is visible
    if (alertVisible) {
      e.preventDefault();
      return;
    }
    
    e.preventDefault();
    if (homeStartY.current === null || homeSwipeProcessed.current) return;
    
    const touchY = e.touches[0].clientY;
    const diff = homeStartY.current - touchY;
    
    // Threshold for swipe detection
    if (Math.abs(diff) > 30) {
      if (diff > 0) {
        // Swipe up - increment
        incrementHomeScore();
      } else {
        // Swipe down - decrement
        decrementHomeScore();
      }
      homeSwipeProcessed.current = true;
    }
  };

  const handleHomeTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    homeStartY.current = null;
    homeSwipeProcessed.current = false;
  };

  // Away team touch handlers
  const handleAwayTouchStart = (e: React.TouchEvent) => {
    // Don't process touches when alert is visible
    if (alertVisible) {
      e.preventDefault();
      return;
    }
    
    e.preventDefault();
    awayStartY.current = e.touches[0].clientY;
    awaySwipeProcessed.current = false;
  };

  const handleAwayTouchMove = (e: React.TouchEvent) => {
    // Don't process touches when alert is visible
    if (alertVisible) {
      e.preventDefault();
      return;
    }
    
    e.preventDefault();
    if (awayStartY.current === null || awaySwipeProcessed.current) return;
    
    const touchY = e.touches[0].clientY;
    const diff = awayStartY.current - touchY;
    
    // Threshold for swipe detection
    if (Math.abs(diff) > 30) {
      if (diff > 0) {
        // Swipe up - increment
        incrementAwayScore();
      } else {
        // Swipe down - decrement
        decrementAwayScore();
      }
      awaySwipeProcessed.current = true;
    }
  };

  const handleAwayTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    awayStartY.current = null;
    awaySwipeProcessed.current = false;
  };

  return (
    <div className="scoreboard-container">
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
          ref={homeButtonRef}
          className="score-button home"
          onClick={(e) => {
            // Don't process clicks when alert is visible
            if (alertVisible) {
              e.preventDefault();
              return;
            }
            incrementHomeScore();
          }}
          onTouchStart={handleHomeTouchStart}
          onTouchMove={handleHomeTouchMove}
          onTouchEnd={handleHomeTouchEnd}
        >
          <div className="team-name">{settings.homeTeamName}</div>
          <div className="score">{gameState.homeScore}</div>
        </div>
        
        <div 
          ref={awayButtonRef}
          className="score-button away"
          onClick={(e) => {
            // Don't process clicks when alert is visible
            if (alertVisible) {
              e.preventDefault();
              return;
            }
            incrementAwayScore();
          }}
          onTouchStart={handleAwayTouchStart}
          onTouchMove={handleAwayTouchMove}
          onTouchEnd={handleAwayTouchEnd}
        >
          <div className="team-name">{settings.awayTeamName}</div>
          <div className="score">{gameState.awayScore}</div>
        </div>
      </div>
      
      <button className="settings-button" onClick={() => navigate('/settings')}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
          <path fill="none" d="M0 0h24v24H0z"/>
          <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" fill="currentColor"/>
        </svg>
      </button>
    </div>
  );
};

export default Scoreboard;
