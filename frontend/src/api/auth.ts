const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface AuthResponse {
  message: string;
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    authMethod: 'manual' | 'google';
    isEmailVerified?: boolean;
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  authMethod: 'manual' | 'google';
  isEmailVerified?: boolean;
}

class AuthAPI {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'An error occurred');
    }

    return data;
  }

  async signup(email: string, password: string, name: string): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async getCurrentUser(token: string): Promise<User> {
    const response = await fetch(`${this.baseURL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get current user');
    }

    const data = await response.json();
    return data.user;
  }

  async logout(token: string): Promise<void> {
    await this.request('/auth/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  getGoogleAuthUrl(): string {
    return `${this.baseURL}/auth/google`;
  }
}

export const authAPI = new AuthAPI();

