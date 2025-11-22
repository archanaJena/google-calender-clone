import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserSettings, Language, Region } from '@/types';
import { settingsAPI } from '@/api';
import { useAuth } from './AuthContext';

interface SettingsContextType {
  settings: UserSettings | null;
  updateSettings: (updates: Partial<UserSettings>) => Promise<void>;
  loading: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// Default settings
const defaultSettings: UserSettings = {
  language: 'en',
  region: 'US',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/New_York',
  defaultView: 'month',
  weekStartsOn: 0,
  timeFormat: '12h',
};

// Apply language-specific font to document
const applyLanguageFont = (language: Language) => {
  const root = document.documentElement;
  root.classList.remove('lang-en', 'lang-hi', 'lang-fr');
  root.classList.add(`lang-${language}`);
  root.setAttribute('lang', language);
};

// Get week start day based on region
const getWeekStartForRegion = (region: Region): 0 | 1 => {
  // Regions that start week on Monday
  const mondayStartRegions: Region[] = ['FR', 'DE', 'IN', 'GB', 'AU', 'CN', 'JP'];
  return mondayStartRegions.includes(region) ? 1 : 0;
};

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, loading: authLoading } = useAuth();

  // Load settings when authenticated
  useEffect(() => {
    if (authLoading) return; // Wait for auth to finish checking
    
    const loadSettings = async () => {
      try {
        if (isAuthenticated) {
          const loaded = await settingsAPI.getSettings();
          const merged = { ...defaultSettings, ...loaded };
          
          // Ensure weekStartsOn matches region if not explicitly set
          if (!loaded.weekStartsOn && loaded.region) {
            merged.weekStartsOn = getWeekStartForRegion(loaded.region);
          }
          
          setSettings(merged);
          applyLanguageFont(merged.language);
        } else {
          // Not authenticated, use defaults
          setSettings(defaultSettings);
          applyLanguageFont(defaultSettings.language);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
        setSettings(defaultSettings);
        applyLanguageFont(defaultSettings.language);
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, [isAuthenticated, authLoading]);

  const updateSettings = async (updates: Partial<UserSettings>) => {
    if (!settings) return;

    const updated = { ...settings, ...updates };
    
    // Auto-update weekStartsOn when region changes
    if (updates.region && updates.region !== settings.region) {
      updated.weekStartsOn = getWeekStartForRegion(updates.region);
      updates.weekStartsOn = updated.weekStartsOn;
    }
    
    // Apply language font immediately
    if (updates.language) {
      applyLanguageFont(updates.language);
    }

    try {
      // Send only the updates to the API, not the full settings object
      const savedSettings = await settingsAPI.updateSettings(updates);
      setSettings(savedSettings);
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
};

