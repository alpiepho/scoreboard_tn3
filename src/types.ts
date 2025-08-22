export interface AppSettings {
  homeTeamName: string;
  awayTeamName: string;
  enableScoreWarning: boolean; // Setting to enable warning at multiples of 7
  vibrateOnButtonPress: boolean;
  theme: 'light' | 'dark';
  maxSets: 3 | 5; // Maximum number of sets to play (3 or 5)
  showSets: boolean; // Toggle visibility of sets display
  colorsSwapped: boolean; // Track if team colors have been swapped
  fontFamily: 'Default' | 'Lato' | 'Merriweather' | 'Montserrat' | 'OpenSans' | 'RobotoMono' | 'RockSalt' | 'SpaceMono' | 'LeagueSpartan'; // Font for scores and team names
  homeTeamColorId: string; // Color ID for home team from teamColors.ts
  awayTeamColorId: string; // Color ID for away team from teamColors.ts
  homeTeamTextColorId: string; // Text color ID for home team
  awayTeamTextColorId: string; // Text color ID for away team
  setCircleColorId: string; // Color ID for set circles from circleColors.ts
}

export interface GameState {
  homeScore: number;
  awayScore: number;
  homeSets: number;
  awaySets: number;
  lastScoringTeam: 'home' | 'away' | null; // Tracks which team scored last for serving indicator
}

export interface ScoreboardProps {
  settings: AppSettings;
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  onOpenCommentModal: () => void;
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

export interface LogEntry {
  id: string;
  timestamp: Date;
  type: 'score' | 'setting' | 'action' | 'comment';
  description: string;
  details: {
    team?: 'home' | 'away';
    before?: any;
    after?: any;
    action?: string;
    isUserComment?: boolean;
  };
}

export interface LogSettings {
  maxEntries: number;
  isEnabled: boolean;
}
