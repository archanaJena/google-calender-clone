import { CalendarAPI } from '../types';
import { Calendar } from '@/types';
import { seedCalendars } from '@/data/seed';

const STORAGE_KEY = 'calendars';
const DELAY = 200;

const delay = () => new Promise(resolve => setTimeout(resolve, DELAY));

export class MockCalendarAPI implements CalendarAPI {
  private getStoredCalendars(): Calendar[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(seedCalendars));
        return seedCalendars;
      }
      return JSON.parse(stored);
    } catch (error) {
      console.error('Error loading calendars:', error);
      return seedCalendars;
    }
  }

  private saveCalendars(calendars: Calendar[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(calendars));
    } catch (error) {
      console.error('Error saving calendars:', error);
    }
  }

  async getCalendars(): Promise<Calendar[]> {
    await delay();
    return this.getStoredCalendars();
  }

  async getCalendar(id: string): Promise<Calendar | null> {
    await delay();
    const calendars = this.getStoredCalendars();
    return calendars.find(c => c.id === id) || null;
  }

  async updateCalendar(id: string, updates: Partial<Calendar>): Promise<Calendar> {
    await delay();
    const calendars = this.getStoredCalendars();
    const index = calendars.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error(`Calendar ${id} not found`);
    }
    const updated = { ...calendars[index], ...updates };
    calendars[index] = updated;
    this.saveCalendars(calendars);
    return updated;
  }
}
