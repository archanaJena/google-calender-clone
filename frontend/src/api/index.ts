import { RestEventAPI } from './EventAPI';
import { MockCalendarAPI } from './mock/MockCalendarAPI';
import { MockSettingsAPI } from './mock/MockSettingsAPI';

export const eventAPI = new RestEventAPI();
export const calendarAPI = new MockCalendarAPI();
export const settingsAPI = new MockSettingsAPI();
