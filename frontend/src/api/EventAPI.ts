import { EventAPI } from './types';
import { CalendarEvent, CreateEventInput, UpdateEventInput } from '@/types';

interface APIError extends Error {
  status?: number;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const deserializeEvent = (event: any): CalendarEvent => {
  if (!event) {
    throw new Error('Invalid event payload');
  }

  const { _id, ...rest } = event;

  return {
    ...rest,
    id: event.id || _id,
    start: new Date(event.start),
    end: new Date(event.end),
    recurrence: event.recurrence
      ? {
          ...event.recurrence,
          endDate: event.recurrence.endDate ? new Date(event.recurrence.endDate) : undefined,
        }
      : undefined,
  };
};

const serializeEventInput = (input: Partial<CreateEventInput>) => {
  const payload: Record<string, unknown> = { ...input };

  if (input.start) {
    payload.start = input.start.toISOString();
  }
  if (input.end) {
    payload.end = input.end.toISOString();
  }
  if (input.recurrence) {
    payload.recurrence = {
      ...input.recurrence,
      endDate: input.recurrence.endDate?.toISOString(),
    };
  }

  Object.keys(payload).forEach((key) => {
    if (payload[key] === undefined) {
      delete payload[key];
    }
  });

  return payload;
};

export class RestEventAPI implements EventAPI {
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
      const error: APIError = new Error(data?.message || 'Event request failed');
      error.status = response.status;
      throw error;
    }

    return data;
  }

  async getEvents(startDate: Date, endDate: Date): Promise<CalendarEvent[]> {
    const params = new URLSearchParams({
      start: startDate.toISOString(),
      end: endDate.toISOString(),
    });

    const data = await this.request<{ events: CalendarEvent[] }>(`/events?${params.toString()}`);
    return data.events.map(deserializeEvent);
  }

  async getEvent(id: string): Promise<CalendarEvent | null> {
    try {
      const data = await this.request<{ event: CalendarEvent }>(`/events/${id}`);
      return deserializeEvent(data.event);
    } catch (error) {
      const apiError = error as APIError;
      if (apiError.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async createEvent(input: CreateEventInput): Promise<CalendarEvent> {
    const payload = serializeEventInput(input);
    const data = await this.request<{ event: CalendarEvent }>('/events', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return deserializeEvent(data.event);
  }

  async updateEvent(input: UpdateEventInput): Promise<CalendarEvent> {
    const { id, ...rest } = input;
    const payload = serializeEventInput(rest);
    const data = await this.request<{ event: CalendarEvent }>(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    return deserializeEvent(data.event);
  }

  async deleteEvent(id: string): Promise<void> {
    await this.request(`/events/${id}`, { method: 'DELETE' });
  }

  async searchEvents(query: string): Promise<CalendarEvent[]> {
    const params = new URLSearchParams({ q: query });
    const data = await this.request<{ events: CalendarEvent[] }>(`/events/search?${params.toString()}`);
    return data.events.map(deserializeEvent);
  }
}


