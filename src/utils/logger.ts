import { LogEntry, LogSettings } from '../types';

const LOG_STORAGE_KEY = 'scoresTN3Logs';
const LOG_SETTINGS_STORAGE_KEY = 'scoresTN3LogSettings';

// Default log settings
const defaultLogSettings: LogSettings = {
  maxEntries: 500,
  isEnabled: true,
};

// Get log settings from localStorage
export const getLogSettings = (): LogSettings => {
  try {
    const stored = localStorage.getItem(LOG_SETTINGS_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...defaultLogSettings, ...parsed };
    }
  } catch (error) {
    console.warn('Failed to load log settings:', error);
  }
  return defaultLogSettings;
};

// Save log settings to localStorage
export const setLogSettings = (settings: LogSettings): void => {
  try {
    localStorage.setItem(LOG_SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.warn('Failed to save log settings:', error);
  }
};

// Get all log entries from localStorage
export const getLogEntries = (): LogEntry[] => {
  try {
    const stored = localStorage.getItem(LOG_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Convert timestamp strings back to Date objects and sort by timestamp (newest first)
      return parsed
        .map((entry: any) => ({
          ...entry,
          timestamp: new Date(entry.timestamp),
        }))
        .sort((a: LogEntry, b: LogEntry) => b.timestamp.getTime() - a.timestamp.getTime());
    }
  } catch (error) {
    console.warn('Failed to load log entries:', error);
  }
  return [];
};

// Save log entries to localStorage
const saveLogEntries = (entries: LogEntry[]): void => {
  try {
    localStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(entries));
  } catch (error) {
    console.warn('Failed to save log entries:', error);
  }
};

// Generate unique ID for log entry
const generateLogId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Add a new log entry
export const addLogEntry = (
  type: LogEntry['type'],
  description: string,
  details: LogEntry['details'] = {}
): void => {
  const settings = getLogSettings();
  
  // Check if logging is enabled
  if (!settings.isEnabled) {
    return;
  }

  const newEntry: LogEntry = {
    id: generateLogId(),
    timestamp: new Date(),
    type,
    description,
    details,
  };

  const existingEntries = getLogEntries();
  const updatedEntries = [newEntry, ...existingEntries];

  // Prune entries if we exceed the limit
  const prunedEntries = updatedEntries.slice(0, settings.maxEntries);
  
  saveLogEntries(prunedEntries);
};

// Clear all log entries
export const clearLogs = (): void => {
  try {
    localStorage.removeItem(LOG_STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to clear log entries:', error);
  }
};

// Set maximum number of log entries
export const setLogLimit = (maxEntries: number): void => {
  const currentSettings = getLogSettings();
  const newSettings = { ...currentSettings, maxEntries };
  setLogSettings(newSettings);
  
  // Prune existing entries if necessary
  pruneOldEntries(maxEntries);
};

// Enable/disable logging
export const setLoggingEnabled = (enabled: boolean): void => {
  const currentSettings = getLogSettings();
  const newSettings = { ...currentSettings, isEnabled: enabled };
  setLogSettings(newSettings);
};

// Remove excess entries to stay within limit
export const pruneOldEntries = (maxEntries?: number): void => {
  const settings = getLogSettings();
  const limit = maxEntries ?? settings.maxEntries;
  const entries = getLogEntries();
  
  if (entries.length > limit) {
    const prunedEntries = entries.slice(0, limit);
    saveLogEntries(prunedEntries);
  }
};

// Format logs for export
export const exportLogs = (): string => {
  const entries = getLogEntries();
  const settings = getLogSettings();
  
  let output = `ScoresTN3 Activity Log\n`;
  output += `Generated: ${new Date().toLocaleString()}\n`;
  output += `Total Entries: ${entries.length}\n`;
  output += `Max Entries: ${settings.maxEntries}\n`;
  output += `Logging Enabled: ${settings.isEnabled}\n`;
  output += `\n${'='.repeat(50)}\n\n`;
  
  entries.forEach((entry, index) => {
    const timestamp = entry.timestamp.toLocaleString();
    const typeIcon = getTypeIcon(entry.type);
    
    output += `${index + 1}. ${typeIcon} ${timestamp}\n`;
    output += `   ${entry.description}\n`;
    
    if (entry.details.team) {
      output += `   Team: ${entry.details.team}\n`;
    }
    
    if (entry.details.before !== undefined && entry.details.after !== undefined) {
      output += `   Change: ${entry.details.before} → ${entry.details.after}\n`;
    }
    
    if (entry.details.action) {
      output += `   Action: ${entry.details.action}\n`;
    }
    
    output += '\n';
  });
  
  return output;
};

// Get emoji icon for log entry type
const getTypeIcon = (type: LogEntry['type']): string => {
  switch (type) {
    case 'score':
      return '🔢';
    case 'setting':
      return '⚙️';
    case 'action':
      return '🔄';
    default:
      return '📝';
  }
};

// Copy logs to clipboard
export const copyLogsToClipboard = async (): Promise<boolean> => {
  try {
    const logText = exportLogs();
    await navigator.clipboard.writeText(logText);
    return true;
  } catch (error) {
    console.warn('Failed to copy logs to clipboard:', error);
    return false;
  }
};

// Log score change
export const logScoreChange = (
  team: 'home' | 'away',
  oldScore: number,
  newScore: number
): void => {
  const change = newScore - oldScore;
  const changeText = change > 0 ? `+${change}` : `${change}`;
  const teamName = team.charAt(0).toUpperCase() + team.slice(1);
  
  addLogEntry(
    'score',
    `${teamName} Score Change`,
    {
      team,
      before: oldScore,
      after: newScore,
      action: `${teamName}: ${oldScore} → ${newScore} (${changeText})`,
    }
  );
};

// Log set change
export const logSetChange = (
  team: 'home' | 'away',
  oldSets: number,
  newSets: number
): void => {
  const teamName = team.charAt(0).toUpperCase() + team.slice(1);
  
  addLogEntry(
    'score',
    `${teamName} Sets Change`,
    {
      team,
      before: oldSets,
      after: newSets,
      action: `${teamName} Sets: ${oldSets} → ${newSets}`,
    }
  );
};

// Log setting change
export const logSettingChange = (
  settingName: string,
  oldValue: any,
  newValue: any
): void => {
  addLogEntry(
    'setting',
    `Setting Changed: ${settingName}`,
    {
      before: oldValue,
      after: newValue,
      action: `${settingName}: ${oldValue} → ${newValue}`,
    }
  );
};

// Log action
export const logAction = (actionDescription: string, details?: any): void => {
  addLogEntry(
    'action',
    actionDescription,
    {
      action: actionDescription,
      ...details,
    }
  );
};
