import { SettingsAPI } from './types';
import { UserSettings } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export class RestSettingsAPI implements SettingsAPI {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${this.baseURL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
        ...options.headers,
      },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const error = new Error(data?.message || 'Settings request failed');
      (error as any).status = response.status;
      throw error;
    }

    return data;
  }

  async getSettings(): Promise<UserSettings> {
    try {
      const data = await this.request<{ settings: UserSettings }>('/user/settings');
      return data.settings;
    } catch (error: any) {
      // If 401 (unauthorized), user might not be logged in - return defaults
      if (error.status === 401) {
        return {
          language: 'en',
          region: 'US',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/New_York',
          defaultView: 'month',
          weekStartsOn: 0,
          timeFormat: '12h',
        };
      }
      throw error;
    }
  }

  async updateSettings(updates: Partial<UserSettings>): Promise<UserSettings> {
    const data = await this.request<{ settings: UserSettings }>('/user/settings', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return data.settings;
  }
}

