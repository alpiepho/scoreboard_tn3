import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import './App.css'
import Scoreboard from './pages/Scoreboard'
import Settings from './pages/Settings'
import { AppSettings } from './types'

function App() {
  const navigate = useNavigate();
  
  // Default settings
  const defaultSettings: AppSettings = {
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
  };

  // Initialize settings from localStorage or use defaults
  const [settings, setSettings] = useState<AppSettings>(() => {
    const savedSettings = localStorage.getItem('scoresTN3Settings');
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
  });

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('scoresTN3Settings', JSON.stringify(settings));
  }, [settings]);

  // Check if the app is installed as PWA
  const [isPWA, setIsPWA] = useState(false);
  useEffect(() => {
    // Check if the app is running in standalone mode (installed PWA)
    if (window.matchMedia('(display-mode: standalone)').matches || 
        (window.navigator as any).standalone === true) {
      setIsPWA(true);
    }
  }, []);

  return (
    <div className={`app ${settings.theme}`}>
      <Routes>
        <Route path="/" element={<Scoreboard settings={settings} />} />
        <Route path="/settings" element={<Settings settings={settings} setSettings={setSettings} />} />
      </Routes>
      <div className="navigation">
        <button onClick={() => navigate('/')}>Scoreboard</button>
        <button onClick={() => navigate('/settings')}>Settings</button>
      </div>
    </div>
  )
}

export default App
