export type CalendarColor = 'blue' | 'red' | 'green' | 'orange' | 'purple' | 'cyan' | 'gray';

export type ViewType = 'month' | 'week' | 'day' | 'agenda';

export type RecurrenceFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly' | 'none';

export interface RecurrenceRule {
  frequency: RecurrenceFrequency;
  interval: number;
  endDate?: Date;
  count?: number;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  allDay: boolean;
  calendarId: string;
  color: CalendarColor;
  location?: string;
  guests?: string[];
  recurrence?: RecurrenceRule;
  timezone?: string;
}

export interface Calendar {
  id: string;
  name: string;
  color: CalendarColor;
  visible: boolean;
}

export interface UserSettings {
  defaultView: ViewType;
  weekStartsOn: 0 | 1; // 0 = Sunday, 1 = Monday
  timezone: string;
  timeFormat: '12h' | '24h';
}

export interface CreateEventInput {
  title: string;
  description?: string;
  start: Date;
  end: Date;
  allDay: boolean;
  calendarId: string;
  color: CalendarColor;
  location?: string;
  guests?: string[];
  recurrence?: RecurrenceRule;
  timezone?: string;
}

export interface UpdateEventInput extends Partial<CreateEventInput> {
  id: string;
}
