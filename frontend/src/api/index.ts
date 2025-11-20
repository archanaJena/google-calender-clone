import { MockEventAPI } from './mock/MockEventAPI';
import { MockCalendarAPI } from './mock/MockCalendarAPI';
import { MockSettingsAPI } from './mock/MockSettingsAPI';

export const eventAPI = new MockEventAPI();
export const calendarAPI = new MockCalendarAPI();
export const settingsAPI = new MockSettingsAPI();
