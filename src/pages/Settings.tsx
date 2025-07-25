import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SettingsProps } from '../types';
import './Settings.css';
import './TeamColorStyles.css';
import AboutModal from '../components/AboutModal';
import { fontFamilies } from '../utils/fonts';
import TeamColorPicker from '../components/TeamColorPicker';
import TextColorPicker from '../components/TextColorPicker';
import { getTeamColors, applyTeamColors } from '../utils/teamColors';

const Settings: React.FC<SettingsProps> = ({ 
  settings, 
  setSettings, 
  resetScores, 
  resetScoresAndSets, 
  swapHomeAndAway,
  gameState,
  setGameState
}) => {
  const navigate = useNavigate();
  const [localSettings, setLocalSettings] = useState({ ...settings });
  const [showFontDropdown, setShowFontDropdown] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);

  // Custom color state for each picker (persist in localStorage)
  const [customColors, setCustomColors] = useState(() => {
    try {
      const stored = localStorage.getItem('customColors');
      if (stored) return JSON.parse(stored);
    } catch {}
    return {
      homeBg: [] as string[],
      awayBg: [] as string[],
      homeText: [] as string[],
      awayText: [] as string[],
    };
  });

  // Persist customColors to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('customColors', JSON.stringify(customColors));
  }, [customColors]);

  // Dialog state for custom color limit
  const [showCustomColorDialog, setShowCustomColorDialog] = useState<null | {
    type: 'homeBg' | 'awayBg' | 'homeText' | 'awayText',
    color: string
  }>(null);
  
  // Factory defaults dialog state
  const [showFactoryDefaultsDialog, setShowFactoryDefaultsDialog] = useState(false);
  
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isTeamNameField = name === 'homeTeamName' || name === 'awayTeamName';
    let updatedSettings = { ...localSettings };
    
    // Handle different input types
    if (type === 'number') {
      updatedSettings = {
        ...updatedSettings,
        [name]: parseInt(value, 10) || 0
      };
    } else if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      
      if (name === 'theme') {
        // For theme checkbox, set to 'dark' when checked, 'light' when unchecked
        updatedSettings = {
          ...updatedSettings,
          [name]: checked ? 'dark' : 'light'
        };
      } else {
        updatedSettings = {
          ...updatedSettings,
          [name]: checked
        };
      }
    } else if (name === 'maxSets') {
      // Handle maxSets specifically to ensure it's either 3 or 5
      updatedSettings = {
        ...updatedSettings,
        maxSets: parseInt(value, 10) === 3 ? 3 : 5
      };
    } else {
      updatedSettings = {
        ...updatedSettings,
        [name]: value
      };
    }
    
    // Update local settings
    setLocalSettings(updatedSettings);      // For all settings except team names, immediately apply
    if (!isTeamNameField) {
      setSettings(updatedSettings);
      
      // Only navigate back to scoreboard for settings other than theme and vibrate
      if (name !== 'theme' && name !== 'vibrateOnButtonPress') {
        navigate('/');
      }
    }
  };
  
  // Save team names
  const saveSettings = () => {
    // Only update the team names
    setSettings({
      ...settings,
      homeTeamName: localSettings.homeTeamName,
      awayTeamName: localSettings.awayTeamName
    });
    navigate('/');
  };
  
  // Reset to defaults
  const resetToDefaults = () => {
    // Set settings to defaults
    const defaultSettings = {
      homeTeamName: 'Home',
      awayTeamName: 'Away',
      enableScoreWarning: true,
      vibrateOnButtonPress: true,
      theme: 'light' as 'light' | 'dark',
      maxSets: 5 as 3 | 5,
      showSets: true,
      colorsSwapped: false,
      fontFamily: 'Default' as 'Default' | 'Lato' | 'Merriweather' | 'Montserrat' | 'OpenSans' | 'RobotoMono' | 'RockSalt' | 'SpaceMono' | 'LeagueSpartan',
      homeTeamColorId: 'blue',
      awayTeamColorId: 'red',
      setCircleColorId: 'black',
      homeTeamTextColorId: 'black', // Force home text color to black
      awayTeamTextColorId: 'black',  // Force away text color to black
    };
    
    // Update local settings and apply them
    setLocalSettings(defaultSettings);
    setSettings(defaultSettings);
    
    // Apply the team colors immediately
    const teamColors = getTeamColors(
      defaultSettings.homeTeamColorId,
      defaultSettings.awayTeamColorId,
      defaultSettings.colorsSwapped
    );
    applyTeamColors(teamColors);
    
    // Also reset scores and sets
    resetScoresAndSets();
    
    // Navigate back to the scoreboard to show the reset state
    navigate('/');
  };

  // Back/Cancel without saving changes
  const handleCancel = () => {
    // Navigate back without updating settings
    navigate('/');
  };
  
  // Handle scroll events explicitly to help Chrome
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    // This just ensures scroll events are processed
    e.stopPropagation();
  };
  
  // Effect to close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const dropdown = document.querySelector('.custom-dropdown');
      if (dropdown && !dropdown.contains(event.target as Node) && showFontDropdown) {
        setShowFontDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showFontDropdown]);


  // Factory defaults handler
  const handleFactoryDefaults = () => {
    setShowFactoryDefaultsDialog(true);
  };

  const confirmFactoryDefaults = () => {
    // Clear all localStorage and reload app
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="settings-container" onScroll={handleScroll}>
      <div className="settings-header">
        <div className="back-button" onClick={handleCancel}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" fill="currentColor"/>
          </svg>
        </div>
        <h1>Settings</h1>
      </div>
      
      <div className="settings-section quick-actions">
        <h2>Quick Actions</h2>
        <div className="form-group">
          <button 
            className="swap-teams-button" 
            title="Swap team names, scores, sets, and colors"
            onClick={() => {
              swapHomeAndAway();
              navigate('/');
            }}
          >
            <span className="swap-icon">⇄</span>
            <span className="home-color-dot"></span>
            Swap Teams
            <span className="away-color-dot"></span>
          </button>
        </div>
        
        <div className="form-group sets-controls">
          <div className="set-controls-row">
            <span className="team-label">
              <span className={settings.colorsSwapped ? "away-color-dot" : "home-color-dot"} style={{ marginRight: '8px' }}></span>
              Home Sets
            </span>
            <button className="set-control-button" onClick={() => {
              // Decrement home sets if greater than 0
              if (gameState.homeSets > 0) {
                setGameState(prev => ({
                  ...prev,
                  homeSets: prev.homeSets - 1
                }));
              }
              navigate('/');
            }}>-</button>
            <button className="set-control-button" onClick={() => {
              // Increment home sets if less than maxSets
              if (gameState.homeSets < settings.maxSets) {
                setGameState(prev => ({
                  ...prev,
                  homeSets: prev.homeSets + 1
                }));
              }
              navigate('/');
            }}>+</button>
          </div>
          
          <div className="set-controls-row">
            <span className="team-label">
              <span className={settings.colorsSwapped ? "home-color-dot" : "away-color-dot"} style={{ marginRight: '8px' }}></span>
              Away Sets
            </span>
            <button className="set-control-button" onClick={() => {
              // Decrement away sets if greater than 0
              if (gameState.awaySets > 0) {
                setGameState(prev => ({
                  ...prev,
                  awaySets: prev.awaySets - 1
                }));
              }
              navigate('/');
            }}>-</button>
            <button className="set-control-button" onClick={() => {
              // Increment away sets if less than maxSets
              if (gameState.awaySets < settings.maxSets) {
                setGameState(prev => ({
                  ...prev,
                  awaySets: prev.awaySets + 1
                }));
              }
              navigate('/');
            }}>+</button>
          </div>
        </div>
        
        <div className="form-group">
          <button className="reset-button" onClick={() => {
            // Immediately reset the actual game scores only
            resetScores();
            // Navigate back to the scoreboard to show the reset scores
            navigate('/');
          }}>
            Reset Scores Only
          </button>
        </div>
        
        <div className="form-group">
          <button className="reset-button" onClick={() => {
            // Immediately reset both scores and sets
            resetScoresAndSets();
            // Navigate back to the scoreboard
            navigate('/');
          }}>
            Reset Scores & Sets
          </button>
        </div>
        
        <div className="form-group">
          <button className="reset-button" type="button" onClick={resetToDefaults}>
            Reset All Settings
          </button>
        </div>
      </div>
      
      <div className="settings-section usage-instructions">
        <h2>How to Use</h2>
        <div className="instruction-item">
          <div className="instruction-title">Increment Score</div>
          <div className="instruction-description">Single tap on a team's score panel to add 1 point</div>
        </div>
        <div className="instruction-item">
          <div className="instruction-title">Decrement Score</div>
          <div className="instruction-description">Press and hold on a team's score panel to continuously decrease the score</div>
        </div>
        <div className="instruction-item">
          <div className="instruction-title">Manage Sets</div>
          <div className="instruction-description">Tap a circle to toggle sets, press + to add a set, or press - to clear all sets</div>
        </div>
        <div className="instruction-item">
          <div className="instruction-title">Access Settings</div>
          <div className="instruction-description">Tap the gear icon in the bottom-right corner of the scoreboard</div>
        </div>
      </div>
      
      <div className="settings-form">
        <div className="settings-section">
          <h2>Scores</h2>
          
          <div className="form-group checkbox">
            <label htmlFor="enableScoreWarning">Enable Score Warnings</label>
            <input
              type="checkbox"
              id="enableScoreWarning"
              name="enableScoreWarning"
              checked={localSettings.enableScoreWarning}
              onChange={handleChange}
            />
            <div className="setting-hint">Shows notification when total score is a multiple of 7</div>
          </div>
        </div>
        
        <div className="settings-section">
          <h2>Appearance</h2>
          
          <div className="form-group checkbox">
            <label htmlFor="theme">Dark Mode</label>
            <input
              type="checkbox"
              id="theme"
              name="theme"
              checked={localSettings.theme === 'dark'}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="fontFamily">Font Style</label>
            <div className="custom-dropdown">
              <div 
                className="dropdown-selected"
                onClick={() => setShowFontDropdown(!showFontDropdown)}
              >
                <span className={fontFamilies.find(f => f.value === localSettings.fontFamily)?.className || ''}>
                  {fontFamilies.find(f => f.value === localSettings.fontFamily)?.label || 'Default: ex. 0123456789'}
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className="dropdown-arrow">
                  <path d="M7 10l5 5 5-5z" fill="currentColor" />
                </svg>
              </div>
              
              {showFontDropdown && (
                <div className="dropdown-options">
                  {fontFamilies.map((font) => (
                    <div 
                      key={font.value}
                      className={`dropdown-option ${font.className} ${localSettings.fontFamily === font.value ? 'selected' : ''}`}
                      onClick={() => {
                        const updatedSettings = {
                          ...localSettings,
                          fontFamily: font.value as "Default" | "Lato" | "Merriweather" | "Montserrat" | "OpenSans" | "RobotoMono" | "RockSalt" | "SpaceMono" | "LeagueSpartan"
                        };
                        setLocalSettings(updatedSettings);
                        setSettings(updatedSettings);
                        setShowFontDropdown(false);
                        // Navigate back to scoreboard immediately after selecting font
                        navigate('/');
                      }}
                    >
                      {font.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
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
        
        <div className="settings-section">
          <h2>Sets</h2>
          
          <div className="form-group">
            <label htmlFor="maxSets">Maximum Sets</label>
            <select
              id="maxSets"
              name="maxSets"
              value={localSettings.maxSets}
              onChange={handleChange}
            >
              <option value={3}>3 Sets</option>
              <option value={5}>5 Sets</option>
            </select>
          </div>
          
          <div className="form-group checkbox">
            <label htmlFor="showSets">Show Sets</label>
            <input
              type="checkbox"
              id="showSets"
              name="showSets"
              checked={localSettings.showSets}
              onChange={handleChange}
            />
            <div className="setting-hint">Toggle visibility of set indicators</div>
          </div>
        </div>
        
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
          
          <div className="form-group">
            <label>Team Colors</label>
            <div className="team-colors-container">
              <div className="team-color-section">
                <h3>Home Team</h3>
                <TeamColorPicker 
                  teamType="home"
                  selectedColorId={localSettings.homeTeamColorId}
                  customColors={customColors.homeBg}
                  onAddCustomColor={(color: string) => {
                    if (customColors.homeBg.length >= 9) {
                      setShowCustomColorDialog({ type: 'homeBg', color });
                    } else {
                      setCustomColors((prev: typeof customColors) => ({ ...prev, homeBg: [...prev.homeBg, color] }));
                    }
                  }}
                  onRemoveCustomColor={(index: number) => {
                    setCustomColors((prev: typeof customColors) => ({ ...prev, homeBg: prev.homeBg.filter((_: string, i: number) => i !== index) }));
                  }}
                  onChange={colorId => {
                    const updatedSettings = { ...localSettings, homeTeamColorId: colorId };
                    setLocalSettings(updatedSettings);
                    setSettings(updatedSettings);
                  }}
                />
                <TextColorPicker
                  teamType="home"
                  selectedColorId={localSettings.homeTeamTextColorId}
                  customColors={customColors.homeText}
                  onAddCustomColor={(color: string) => {
                    if (customColors.homeText.length >= 9) {
                      setShowCustomColorDialog({ type: 'homeText', color });
                    } else {
                      setCustomColors((prev: typeof customColors) => ({ ...prev, homeText: [...prev.homeText, color] }));
                    }
                  }}
                  onRemoveCustomColor={(index: number) => {
                    setCustomColors((prev: typeof customColors) => ({ ...prev, homeText: prev.homeText.filter((_: string, i: number) => i !== index) }));
                  }}
                  onChange={colorId => {
                    const updatedSettings = { ...localSettings, homeTeamTextColorId: colorId };
                    setLocalSettings(updatedSettings);
                    setSettings(updatedSettings);
                  }}
                />
              </div>
              
              <div className="team-color-section">
                <h3>Away Team</h3>
                <TeamColorPicker 
                  teamType="away"
                  selectedColorId={localSettings.awayTeamColorId}
                  customColors={customColors.awayBg}
                  onAddCustomColor={(color: string) => {
                    if (customColors.awayBg.length >= 9) {
                      setShowCustomColorDialog({ type: 'awayBg', color });
                    } else {
                      setCustomColors((prev: typeof customColors) => ({ ...prev, awayBg: [...prev.awayBg, color] }));
                    }
                  }}
                  onRemoveCustomColor={(index: number) => {
                    setCustomColors((prev: typeof customColors) => ({ ...prev, awayBg: prev.awayBg.filter((_: string, i: number) => i !== index) }));
                  }}
                  onChange={colorId => {
                    const updatedSettings = { ...localSettings, awayTeamColorId: colorId };
                    setLocalSettings(updatedSettings);
                    setSettings(updatedSettings);
                  }}
                />
                <TextColorPicker
                  teamType="away"
                  selectedColorId={localSettings.awayTeamTextColorId}
                  customColors={customColors.awayText}
                  onAddCustomColor={(color: string) => {
                    if (customColors.awayText.length >= 9) {
                      setShowCustomColorDialog({ type: 'awayText', color });
                    } else {
                      setCustomColors((prev: typeof customColors) => ({ ...prev, awayText: [...prev.awayText, color] }));
                    }
                  }}
                  onRemoveCustomColor={(index: number) => {
                    setCustomColors((prev: typeof customColors) => ({ ...prev, awayText: prev.awayText.filter((_: string, i: number) => i !== index) }));
                  }}
                  onChange={colorId => {
                    const updatedSettings = { ...localSettings, awayTeamTextColorId: colorId };
                    setLocalSettings(updatedSettings);
                    setSettings(updatedSettings);
                  }}
                />
      {/* Custom Color Limit Dialog */}
      {showCustomColorDialog && (
        <div className="custom-color-dialog-backdrop">
          <div className="custom-color-dialog">
            <p>You can only have 9 custom colors. Remove the oldest color to add a new one?</p>
            <div className="dialog-actions">
              <button
                onClick={() => {
                  // Remove oldest and add new color
                  setCustomColors((prev: typeof customColors) => {
                    const type = showCustomColorDialog!.type;
                    const arr = [...prev[type]];
                    arr.shift();
                    arr.push(showCustomColorDialog!.color);
                    return { ...prev, [type]: arr };
                  });
                  setShowCustomColorDialog(null);
                }}
              >
                Remove Oldest
              </button>
              <button onClick={() => setShowCustomColorDialog(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="settings-actions">
        <button className="save-button" type="button" onClick={saveSettings}>
          Save Team Details
        </button>
        <button className="about-button" type="button" onClick={() => setShowAboutModal(true)}>
          About
        </button>
        <button className="cancel-button" type="button" onClick={handleCancel}>
          Cancel
        </button>
        <button className="reset-button" type="button" onClick={handleFactoryDefaults}>
          Factory Defaults
        </button>
      </div>
      
      {/* About Modal */}
      <AboutModal
        visible={showAboutModal}
        onClose={() => setShowAboutModal(false)}
      />
      
      {/* Factory Defaults Dialog */}
      {showFactoryDefaultsDialog && (
        <div className="modal-backdrop" style={{ zIndex: 10000, position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="modal-dialog" style={{ background: '#fff', borderRadius: '12px', maxWidth: 340, width: '90%', padding: '2rem 1.5rem', boxShadow: '0 8px 32px rgba(0,0,0,0.25)', textAlign: 'center' }}>
            <h2 style={{ marginTop: 0 }}>Restore Factory Defaults?</h2>
            <p style={{ margin: '1.2em 0 2em 0' }}>This will clear all locally saved settings and custom colors. Are you sure you want to restore factory defaults?</p>
            <div className="dialog-actions" style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button type="button" className="reset-button" style={{ minWidth: 100 }} onClick={confirmFactoryDefaults}>Yes, Reset</button>
              <button type="button" className="cancel-button" style={{ minWidth: 100 }} onClick={() => setShowFactoryDefaultsDialog(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
