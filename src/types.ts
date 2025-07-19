export interface AppSettings {
  homeTeamName: string;
  awayTeamName: string;
  enableScoreWarning: boolean; // Setting to enable warning at multiples of 7
  vibrateOnButtonPress: boolean;
  theme: 'light' | 'dark';
}

export interface GameState {
  homeScore: number;
  awayScore: number;
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
  onScoreChange: (newScore: number) => void;
  increment: number;
}
