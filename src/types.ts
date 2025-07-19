export interface AppSettings {
  homeTeamName: string;
  awayTeamName: string;
  initialHomeScore: number;
  initialAwayScore: number;
  scoreIncrement: number;
  timerDuration: number;
  timerDirection: 'up' | 'down';
  showTimer: boolean;
  vibrateOnButtonPress: boolean;
  theme: 'light' | 'dark';
}

export interface ScoreboardProps {
  settings: AppSettings;
}

export interface SettingsProps {
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
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
