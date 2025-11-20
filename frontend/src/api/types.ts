import { CalendarEvent, Calendar, UserSettings, CreateEventInput, UpdateEventInput } from '@/types';

export interface EventAPI {
  getEvents(startDate: Date, endDate: Date): Promise<CalendarEvent[]>;
  getEvent(id: string): Promise<CalendarEvent | null>;
  createEvent(input: CreateEventInput): Promise<CalendarEvent>;
  updateEvent(input: UpdateEventInput): Promise<CalendarEvent>;
  deleteEvent(id: string): Promise<void>;
  searchEvents(query: string): Promise<CalendarEvent[]>;
}

export interface CalendarAPI {
  getCalendars(): Promise<Calendar[]>;
  getCalendar(id: string): Promise<Calendar | null>;
  updateCalendar(id: string, updates: Partial<Calendar>): Promise<Calendar>;
}

export interface SettingsAPI {
  getSettings(): Promise<UserSettings>;
  updateSettings(updates: Partial<UserSettings>): Promise<UserSettings>;
}
