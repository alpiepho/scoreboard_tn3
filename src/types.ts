export interface AppSettings {
  homeTeamName: string;
  awayTeamName: string;
  enableScoreWarning: boolean; // Setting to enable warning at multiples of 7
  vibrateOnButtonPress: boolean;
  theme: 'light' | 'dark';
  maxSets: 3 | 5; // Maximum number of sets to play (3 or 5)
  showSets: boolean; // Toggle visibility of sets display
  colorsSwapped: boolean; // Track if team colors have been swapped
}

export interface GameState {
  homeScore: number;
  awayScore: number;
  homeSets: number;
  awaySets: number;
}

export interface ScoreboardProps {
  settings: AppSettings;
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}

export interface SettingsProps {
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
  resetScores: () => void;
  resetScoresAndSets: () => void;
  swapHomeAndAway: () => void;
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}

export interface TimerProps {
  initialSeconds: number;
  direction: 'up' | 'down';
  running: boolean;
  onComplete?: () => void;
}

export interface ScoreDisplayProps {
  team: string;
  score: number;
  onIncrement: () => void;
  onDecrement: () => void;
  increment: number;
}

export interface ScorePanelProps {
  team: string;
  score: number;
  onScoreChange: (newScore: number | ((prevScore: number) => number)) => void;
  increment: number;
}
