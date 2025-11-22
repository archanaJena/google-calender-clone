import { SettingsAPI } from '../types';
import { UserSettings } from '@/types';

const STORAGE_KEY = 'user_settings';
const DELAY = 100;

const delay = () => new Promise(resolve => setTimeout(resolve, DELAY));

// Default settings
const defaultSettings: UserSettings = {
  language: 'en',
  region: 'US',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/New_York',
  defaultView: 'month',
  weekStartsOn: 0,
  timeFormat: '12h',
};

export class MockSettingsAPI implements SettingsAPI {
  private getStoredSettings(): UserSettings {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultSettings));
        return defaultSettings;
      }
      const parsed = JSON.parse(stored);
      // Merge with defaults to ensure all fields exist
      return { ...defaultSettings, ...parsed };
    } catch (error) {
      console.error('Error loading settings:', error);
      return defaultSettings;
    }
  }

  private saveSettings(settings: UserSettings): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }

  async getSettings(): Promise<UserSettings> {
    await delay();
    return this.getStoredSettings();
  }

  async updateSettings(updates: Partial<UserSettings>): Promise<UserSettings> {
    await delay();
    const current = this.getStoredSettings();
    const updated = { ...current, ...updates };
    this.saveSettings(updated);
    return updated;
  }
}
