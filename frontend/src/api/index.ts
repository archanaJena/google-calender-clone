import { RestEventAPI } from './EventAPI';
import { MockCalendarAPI } from './mock/MockCalendarAPI';
import { RestSettingsAPI } from './SettingsAPI';

export const eventAPI = new RestEventAPI();
export const calendarAPI = new MockCalendarAPI();
export const settingsAPI = new RestSettingsAPI();
