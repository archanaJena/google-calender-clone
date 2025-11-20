import { SettingsAPI } from '../types';
import { UserSettings } from '@/types';
import { seedSettings } from '@/data/seed';

const STORAGE_KEY = 'user_settings';
const DELAY = 100;

const delay = () => new Promise(resolve => setTimeout(resolve, DELAY));

export class MockSettingsAPI implements SettingsAPI {
  private getStoredSettings(): UserSettings {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(seedSettings));
        return seedSettings;
      }
      return JSON.parse(stored);
    } catch (error) {
      console.error('Error loading settings:', error);
      return seedSettings;
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
