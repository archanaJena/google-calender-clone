import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  startOfYear,
  endOfYear,
  addDays,
  addMonths,
  addWeeks,
  addYears,
  isSameMonth,
  isSameDay,
  isSameYear,
  isToday,
  startOfDay,
  endOfDay,
  differenceInDays,
  differenceInMinutes,
  setHours,
  setMinutes,
  getHours,
  getMinutes,
  parseISO,
} from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import { fr } from 'date-fns/locale/fr';
import { hi } from 'date-fns/locale/hi';
import { Language, Region } from '@/types';

export {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  startOfYear,
  endOfYear,
  addDays,
  addMonths,
  addWeeks,
  addYears,
  isSameMonth,
  isSameDay,
  isSameYear,
  isToday,
  startOfDay,
  endOfDay,
  differenceInDays,
  differenceInMinutes,
  setHours,
  setMinutes,
  getHours,
  getMinutes,
  parseISO,
};

// Get locale for date-fns based on language
export const getDateLocale = (language?: Language) => {
  switch (language) {
    case 'fr':
      return fr;
    case 'hi':
      return hi;
    default:
      return enUS;
  }
};

// Get date format based on region
export const getDateFormat = (region?: Region): string => {
  // Regions that use DD/MM/YYYY format
  const ddMMyyyyRegions: Region[] = ['IN', 'FR', 'GB', 'AU', 'DE', 'CN', 'JP', 'BR'];
  return ddMMyyyyRegions.includes(region || 'US') ? 'dd/MM/yyyy' : 'MM/dd/yyyy';
};

// Format time with locale support
export const formatTime = (date: Date, format24h = false, language?: Language, timezone?: string): string => {
  const locale = getDateLocale(language);
  
  if (timezone) {
    try {
      // Use Intl to format in specific timezone
      return new Intl.DateTimeFormat(language === 'hi' ? 'hi-IN' : language === 'fr' ? 'fr-FR' : 'en-US', {
        timeZone: timezone,
        hour: 'numeric',
        minute: '2-digit',
        hour12: !format24h,
      }).format(date);
    } catch {
      // Fallback to date-fns if timezone formatting fails
    }
  }
  
  return format(date, format24h ? 'HH:mm' : 'h:mm a', { locale });
};

// Format date short with locale and region support
export const formatDateShort = (date: Date, language?: Language, region?: Region): string => {
  const locale = getDateLocale(language);
  const dateFormat = getDateFormat(region);
  
  if (dateFormat === 'dd/MM/yyyy') {
    return format(date, 'dd MMM yyyy', { locale });
  }
  return format(date, 'MMM d, yyyy', { locale });
};

// Format date long with locale support
export const formatDateLong = (date: Date, language?: Language): string => {
  const locale = getDateLocale(language);
  return format(date, 'EEEE, MMMM d, yyyy', { locale });
};

// Format with locale (helper for calendar title and general formatting)
export const formatWithLocale = (date: Date, formatStr: string, language?: Language): string => {
  const locale = getDateLocale(language);
  return format(date, formatStr, { locale });
};

// Get month days with week start support
export const getMonthDays = (date: Date, weekStartsOn: 0 | 1 = 0): Date[] => {
  const start = startOfWeek(startOfMonth(date), { weekStartsOn });
  const end = endOfWeek(endOfMonth(date), { weekStartsOn });
  
  const days: Date[] = [];
  let current = start;
  
  while (current <= end) {
    days.push(current);
    current = addDays(current, 1);
  }
  
  return days;
};

// Get week days with week start support
export const getWeekDays = (date: Date, weekStartsOn: 0 | 1 = 0): Date[] => {
  const start = startOfWeek(date, { weekStartsOn });
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
};

// Get hour labels with locale support
export const getHourLabels = (start = 0, end = 24, language?: Language, format24h = false): string[] => {
  const locale = getDateLocale(language);
  const labels: string[] = [];
  for (let hour = start; hour < end; hour++) {
    const date = setHours(new Date(), hour);
    labels.push(format(date, format24h ? 'HH:mm' : 'h a', { locale }));
  }
  return labels;
};

// Convert date to timezone
export const convertToTimezone = (date: Date, timezone: string): Date => {
  try {
    // Get the time in the target timezone as a string
    const timeString = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(date);
    
    // Parse it back to a Date object (this will be in local time)
    const [datePart, timePart] = timeString.split(', ');
    const [month, day, year] = datePart.split('/');
    const [hour, minute, second] = timePart.split(':');
    
    return new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      parseInt(hour),
      parseInt(minute),
      parseInt(second)
    );
  } catch {
    return date;
  }
};
