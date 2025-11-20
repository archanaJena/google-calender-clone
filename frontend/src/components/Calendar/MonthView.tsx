import { CalendarEvent } from "@/types";
import {
  getMonthDays,
  format,
  isSameMonth,
  isToday,
  isSameDay,
} from "@/lib/date";
import { EventChip } from "../EventChip";
import { cn } from "@/lib/utils";

interface MonthViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onDayClick: (date: Date) => void;
}

export const MonthView = ({
  currentDate,
  events,
  onEventClick,
  onDayClick,
}: MonthViewProps) => {
  const days = getMonthDays(currentDate);
  const weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const getEventsForDay = (day: Date) => {
    return events.filter((event) => {
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);
      const dayStart = new Date(day);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(day);
      dayEnd.setHours(23, 59, 59, 999);

      return (
        (eventStart >= dayStart && eventStart <= dayEnd) ||
        (eventEnd >= dayStart && eventEnd <= dayEnd) ||
        (eventStart <= dayStart && eventEnd >= dayEnd)
      );
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Week day headers */}
      <div className="grid grid-cols-7 border-b border-calendar-border">
        {weekDays.map((day) => (
          <div
            key={day}
            className="p-2 text-center text-xs font-medium text-muted-foreground"
          >
            <span className="hidden sm:inline">{day}</span>
            <span className="sm:hidden">{day.slice(0, 3)}</span>
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 flex-1 auto-rows-fr">
        {days.map((day, index) => {
          const dayEvents = getEventsForDay(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isTodayDate = isToday(day);
          const displayedEvents = dayEvents.slice(0, 3);
          const remainingCount = dayEvents.length - displayedEvents.length;

          return (
            <div
              key={index}
              className={cn(
                "border-b border-r border-calendar-border p-2 min-h-[100px] cursor-pointer hover:bg-calendar-hover transition-colors",
                !isCurrentMonth && "bg-muted/30",
                isTodayDate && "bg-calendar-today"
              )}
              onClick={() => onDayClick(day)}
            >
              <div className="flex flex-col h-full">
                <div
                  className={cn(
                    "text-sm font-medium mb-1",
                    !isCurrentMonth && "text-muted-foreground",
                    isTodayDate && "text-primary font-bold"
                  )}
                >
                  <span
                    className={cn(
                      isTodayDate &&
                        "bg-primary text-primary-foreground rounded-full h-6 w-6 inline-flex items-center justify-center"
                    )}
                  >
                    {format(day, "d")}
                  </span>
                </div>
                <div className="space-y-1 overflow-hidden flex-1">
                  {displayedEvents.map((event) => (
                    <EventChip
                      key={event.id}
                      event={event}
                      onClick={() => {
                        onEventClick(event);
                      }}
                      showTime={!event.allDay}
                      className="text-xs"
                    />
                  ))}
                  {remainingCount > 0 && (
                    <div className="text-xs text-muted-foreground pl-2">
                      +{remainingCount} more
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
