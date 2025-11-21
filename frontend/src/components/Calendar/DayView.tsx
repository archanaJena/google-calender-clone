import { CalendarEvent } from '@/types';
import { format, startOfDay, endOfDay, isToday } from '@/lib/date';
import { EventChip } from '../EventChip';
import { cn } from '@/lib/utils';

interface DayViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onTimeSlotClick?: (hour: number) => void;
  highlightedEventIds?: string[];
}

const occursOnDay = (event: CalendarEvent, date: Date) => {
  const dayStart = startOfDay(date);
  const dayEnd = endOfDay(date);
  const eventStart = new Date(event.start);
  const eventEnd = new Date(event.end);
  return eventStart <= dayEnd && eventEnd >= dayStart;
};

const overlapsRange = (event: CalendarEvent, rangeStart: Date, rangeEnd: Date) => {
  const eventStart = new Date(event.start);
  const eventEnd = new Date(event.end);
  return eventStart < rangeEnd && eventEnd > rangeStart;
};

export const DayView = ({
  currentDate,
  events,
  onEventClick,
  onTimeSlotClick,
  highlightedEventIds,
}: DayViewProps) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const visibleHours = hours.slice(6, 22); // 6 AM to 10 PM
  const isTodayDate = isToday(currentDate);

  const getEventsForHour = (hour: number) => {
    const slotStart = new Date(currentDate);
    slotStart.setHours(hour, 0, 0, 0);
    const slotEnd = new Date(slotStart);
    slotEnd.setHours(slotEnd.getHours() + 1);
    return events.filter((event) => {
      if (event.allDay) return false;
      return overlapsRange(event, slotStart, slotEnd);
    });
  };

  const allDayEvents = events.filter(
    (event) => event.allDay && occursOnDay(event, currentDate)
  );

  return (
    <div className="flex flex-col h-full overflow-auto">
      {/* Day header */}
      <div className="sticky top-0 bg-background z-10 border-b border-calendar-border">
        <div className={cn(
          'p-4 text-center',
          isTodayDate && 'bg-calendar-today'
        )}>
          <div className="text-sm text-muted-foreground mb-1">
            {format(currentDate, 'EEEE')}
          </div>
          <div
            className={cn(
              'text-4xl font-normal',
              isTodayDate && 'text-primary font-bold'
            )}
          >
            <span className={cn(
              isTodayDate && 'bg-primary text-primary-foreground rounded-full h-16 w-16 inline-flex items-center justify-center'
            )}>
              {format(currentDate, 'd')}
            </span>
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            {format(currentDate, 'MMMM yyyy')}
          </div>
        </div>

        {/* All-day events */}
        {allDayEvents.length > 0 && (
          <div className="p-3 border-t border-calendar-border">
            <div className="text-xs text-muted-foreground mb-2">All day</div>
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
        )}
      </div>

      {/* Time grid */}
      <div className="flex-1">
        {visibleHours.map((hour) => {
          const hourEvents = getEventsForHour(hour);
          return (
            <div
              key={hour}
              className="flex border-b border-calendar-border h-20 hover:bg-calendar-hover transition-colors cursor-pointer"
              onClick={() => onTimeSlotClick?.(hour)}
            >
              <div className="w-20 p-2 text-xs text-muted-foreground text-right border-r border-calendar-border flex-shrink-0">
                {format(new Date().setHours(hour, 0, 0, 0), 'h a')}
              </div>
              <div className="flex-1 p-2">
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
            </div>
          );
        })}
      </div>
    </div>
  );
};
