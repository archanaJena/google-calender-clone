import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  addWeeks,
  isSameMonth,
  isSameDay,
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

export {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  addWeeks,
  isSameMonth,
  isSameDay,
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

export const formatTime = (date: Date, format24h = false): string => {
  return format(date, format24h ? 'HH:mm' : 'h:mm a');
};

export const formatDateShort = (date: Date): string => {
  return format(date, 'MMM d, yyyy');
};

export const formatDateLong = (date: Date): string => {
  return format(date, 'EEEE, MMMM d, yyyy');
};

export const getMonthDays = (date: Date): Date[] => {
  const start = startOfWeek(startOfMonth(date), { weekStartsOn: 0 });
  const end = endOfWeek(endOfMonth(date), { weekStartsOn: 0 });
  
  const days: Date[] = [];
  let current = start;
  
  while (current <= end) {
    days.push(current);
    current = addDays(current, 1);
  }
  
  return days;
};

export const getWeekDays = (date: Date): Date[] => {
  const start = startOfWeek(date, { weekStartsOn: 0 });
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
};

export const getHourLabels = (start = 0, end = 24): string[] => {
  const labels: string[] = [];
  for (let hour = start; hour < end; hour++) {
    const date = setHours(new Date(), hour);
    labels.push(format(date, 'h a'));
  }
  return labels;
};
