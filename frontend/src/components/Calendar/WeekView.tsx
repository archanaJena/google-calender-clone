import { CalendarEvent } from '@/types';
import { getWeekDays, format, isToday, startOfDay, endOfDay, formatTime, getDateLocale } from '@/lib/date';
import { EventChip } from '../EventChip';
import { cn } from '@/lib/utils';
import { useSettings } from '@/context/SettingsContext';

interface WeekViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onTimeSlotClick?: (date: Date, hour: number) => void;
  highlightedEventIds?: string[];
}

const occursOnDay = (event: CalendarEvent, day: Date) => {
  const dayStart = startOfDay(day);
  const dayEnd = endOfDay(day);
  const eventStart = new Date(event.start);
  const eventEnd = new Date(event.end);
  return eventStart <= dayEnd && eventEnd >= dayStart;
};

const overlapsRange = (event: CalendarEvent, rangeStart: Date, rangeEnd: Date) => {
  const eventStart = new Date(event.start);
  const eventEnd = new Date(event.end);
  return eventStart < rangeEnd && eventEnd > rangeStart;
};

export const WeekView = ({
  currentDate,
  events,
  onEventClick,
  onTimeSlotClick,
  highlightedEventIds,
}: WeekViewProps) => {
  const { settings } = useSettings();
  const weekStartsOn = settings?.weekStartsOn ?? 0;
  const timeFormat24h = settings?.timeFormat === '24h';
  const locale = getDateLocale(settings?.language);
  const days = getWeekDays(currentDate, weekStartsOn);
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const visibleHours = hours.slice(6, 22); // 6 AM to 10 PM

  const getEventsForDayAndHour = (day: Date, hour: number) => {
    const slotStart = new Date(day);
    slotStart.setHours(hour, 0, 0, 0);
    const slotEnd = new Date(slotStart);
    slotEnd.setHours(slotEnd.getHours() + 1);
    return events.filter((event) => {
      if (event.allDay) return false;
      return overlapsRange(event, slotStart, slotEnd);
    });
  };

  const getAllDayEvents = (day: Date) => {
    return events.filter((event) => event.allDay && occursOnDay(event, day));
  };

  return (
    <div className="flex flex-col h-full overflow-auto">
      {/* Week header */}
      <div className="sticky top-0 bg-background z-10 border-b border-calendar-border">
        <div className="grid grid-cols-8">
          <div className="p-2 text-xs font-medium text-muted-foreground border-r border-calendar-border">
            GMT-5
          </div>
          {days.map((day) => {
            const isTodayDate = isToday(day);
            return (
              <div
                key={day.toISOString()}
                className={cn(
                  'p-2 text-center border-r border-calendar-border last:border-r-0',
                  isTodayDate && 'bg-calendar-today'
                )}
              >
                <div className="text-xs text-muted-foreground">
                  {format(day, 'EEE', { locale })}
                </div>
                <div
                  className={cn(
                    'text-2xl font-normal',
                    isTodayDate && 'text-primary font-bold'
                  )}
                >
                  <span className={cn(
                    isTodayDate && 'bg-primary text-primary-foreground rounded-full h-10 w-10 inline-flex items-center justify-center'
                  )}>
                    {format(day, 'd', { locale })}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* All-day events */}
        <div className="grid grid-cols-8 border-t border-calendar-border">
          <div className="p-2 text-xs text-muted-foreground border-r border-calendar-border">
            {settings?.language === 'en' ? 'All day' : settings?.language === 'hi' ? 'पूरा दिन' : 'Toute la journée'}
          </div>
          {days.map((day) => {
            const allDayEvents = getAllDayEvents(day);
            return (
              <div
                key={`allday-${day.toISOString()}`}
                className="p-1 border-r border-calendar-border last:border-r-0 min-h-[60px]"
              >
                <div className="space-y-1">
                  {allDayEvents.map((event) => (
                    <EventChip
                      key={event.id}
                      event={event}
                      onClick={() => onEventClick(event)}
                      showTime={false}
                        highlighted={highlightedEventIds?.includes(event.id)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Time grid */}
      <div className="flex-1">
        {visibleHours.map((hour) => (
          <div key={hour} className="grid grid-cols-8 border-b border-calendar-border h-16">
            <div className="p-2 text-xs text-muted-foreground text-right border-r border-calendar-border">
              {formatTime(new Date(new Date().setHours(hour, 0, 0, 0)), timeFormat24h, settings?.language, settings?.timezone)}
            </div>
            {days.map((day) => {
              const hourEvents = getEventsForDayAndHour(day, hour);
              return (
                <div
                  key={`${day.toISOString()}-${hour}`}
                  className="border-r border-calendar-border last:border-r-0 p-1 cursor-pointer hover:bg-calendar-hover transition-colors relative"
                  onClick={() => onTimeSlotClick?.(day, hour)}
                >
                  <div className="space-y-1">
                    {hourEvents.map((event) => (
                      <EventChip
                        key={event.id}
                        event={event}
                        onClick={() => onEventClick(event)}
                        highlighted={highlightedEventIds?.includes(event.id)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
