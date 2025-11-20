import { EventAPI } from '../types';
import { CalendarEvent, CreateEventInput, UpdateEventInput } from '@/types';
import { seedEvents } from '@/data/seed';
import { isWithinInterval, parseISO } from 'date-fns';

const STORAGE_KEY = 'calendar_events';
const DELAY = 300;

const delay = () => new Promise(resolve => setTimeout(resolve, DELAY));

const serializeEvents = (events: CalendarEvent[]): string => {
  return JSON.stringify(events.map(event => ({
    ...event,
    start: event.start.toISOString(),
    end: event.end.toISOString(),
    recurrence: event.recurrence ? {
      ...event.recurrence,
      endDate: event.recurrence.endDate?.toISOString(),
    } : undefined,
  })));
};

const deserializeEvents = (json: string): CalendarEvent[] => {
  const data = JSON.parse(json);
  return data.map((event: any) => ({
    ...event,
    start: parseISO(event.start),
    end: parseISO(event.end),
    recurrence: event.recurrence ? {
      ...event.recurrence,
      endDate: event.recurrence.endDate ? parseISO(event.recurrence.endDate) : undefined,
    } : undefined,
  }));
};

export class MockEventAPI implements EventAPI {
  private getStoredEvents(): CalendarEvent[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        const serialized = serializeEvents(seedEvents);
        localStorage.setItem(STORAGE_KEY, serialized);
        return seedEvents;
      }
      return deserializeEvents(stored);
    } catch (error) {
      console.error('Error loading events:', error);
      return seedEvents;
    }
  }

  private saveEvents(events: CalendarEvent[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, serializeEvents(events));
    } catch (error) {
      console.error('Error saving events:', error);
    }
  }

  async getEvents(startDate: Date, endDate: Date): Promise<CalendarEvent[]> {
    await delay();
    const events = this.getStoredEvents();
    return events.filter(event => 
      isWithinInterval(event.start, { start: startDate, end: endDate }) ||
      isWithinInterval(event.end, { start: startDate, end: endDate }) ||
      (event.start <= startDate && event.end >= endDate)
    );
  }

  async getEvent(id: string): Promise<CalendarEvent | null> {
    await delay();
    const events = this.getStoredEvents();
    return events.find(e => e.id === id) || null;
  }

  async createEvent(input: CreateEventInput): Promise<CalendarEvent> {
    await delay();
    const events = this.getStoredEvents();
    const newEvent: CalendarEvent = {
      ...input,
      id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    events.push(newEvent);
    this.saveEvents(events);
    return newEvent;
  }

  async updateEvent(input: UpdateEventInput): Promise<CalendarEvent> {
    await delay();
    const events = this.getStoredEvents();
    const index = events.findIndex(e => e.id === input.id);
    if (index === -1) {
      throw new Error(`Event ${input.id} not found`);
    }
    const updated = { ...events[index], ...input };
    events[index] = updated;
    this.saveEvents(events);
    return updated;
  }

  async deleteEvent(id: string): Promise<void> {
    await delay();
    const events = this.getStoredEvents();
    const filtered = events.filter(e => e.id !== id);
    this.saveEvents(filtered);
  }

  async searchEvents(query: string): Promise<CalendarEvent[]> {
    await delay();
    const events = this.getStoredEvents();
    const lowerQuery = query.toLowerCase();
    return events.filter(event =>
      event.title.toLowerCase().includes(lowerQuery) ||
      event.description?.toLowerCase().includes(lowerQuery) ||
      event.location?.toLowerCase().includes(lowerQuery)
    );
  }
}
