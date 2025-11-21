import { CalendarEvent } from "@/types";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isToday,
} from "@/lib/date";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface YearViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onMonthClick: (date: Date) => void;
}

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

const colorDotClasses: Record<string, string> = {
  blue: "bg-event-blue",
  red: "bg-event-red",
  green: "bg-event-green",
  orange: "bg-event-orange",
  purple: "bg-event-purple",
  cyan: "bg-event-cyan",
  gray: "bg-event-gray",
};

export const YearView = ({
  currentDate,
  events,
  onEventClick,
  onMonthClick,
}: YearViewProps) => {
  const year = currentDate.getFullYear();
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const getEventsForMonth = (monthIndex: number) => {
    const monthStart = new Date(year, monthIndex, 1);
    const monthEnd = endOfMonth(monthStart);
    return events.filter((event) => {
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);
      return (
        (eventStart >= monthStart && eventStart <= monthEnd) ||
        (eventEnd >= monthStart && eventEnd <= monthEnd) ||
        (eventStart <= monthStart && eventEnd >= monthEnd)
      );
    });
  };

  const getEventsForDay = (day: Date, monthEvents: CalendarEvent[]) => {
    return monthEvents.filter((event) => {
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

  const getPrimaryEventColor = (dayEvents: CalendarEvent[]): string | null => {
    if (dayEvents.length === 0) return null;
    // Get the first event's color
    return dayEvents[0].color;
  };

  return (
    <TooltipProvider>
      <div className="h-full overflow-auto p-6">
        <div className="grid grid-cols-3 gap-6 max-w-7xl mx-auto">
          {monthNames.map((monthName, monthIndex) => {
            const monthDate = new Date(year, monthIndex, 1);
            const monthEvents = getEventsForMonth(monthIndex);
            const monthStart = startOfWeek(startOfMonth(monthDate), { weekStartsOn: 0 });
            const monthEnd = endOfWeek(endOfMonth(monthDate), { weekStartsOn: 0 });
            const days: Date[] = [];
            let current = monthStart;
            while (current <= monthEnd) {
              days.push(current);
              current = addDays(current, 1);
            }
            const isCurrentMonth = monthIndex === currentMonth && year === currentYear;

            return (
              <div
                key={monthIndex}
                className={cn(
                  "border border-calendar-border rounded-lg p-4 bg-background hover:shadow-md transition-shadow cursor-pointer h-[280px] flex flex-col",
                  isCurrentMonth && "ring-2 ring-primary"
                )}
                onClick={() => onMonthClick(monthDate)}
              >
                <div className="text-sm font-semibold text-foreground mb-2">
                  {monthName}
                </div>

                {/* Week day headers */}
                <div className="grid grid-cols-7 gap-0 mb-1">
                  {weekDays.map((day, i) => (
                    <div
                      key={i}
                      className="h-5 flex items-center justify-center text-xs font-medium text-muted-foreground"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-0 flex-1">
                  {days.map((day, dayIndex) => {
                    const dayEvents = getEventsForDay(day, monthEvents);
                    const isCurrentMonthDay = isSameMonth(day, monthDate);
                    const isTodayDate = isToday(day);
                    const eventColor = getPrimaryEventColor(dayEvents);
                    const colorClass = eventColor ? colorDotClasses[eventColor] : null;

                    return (
                      <div
                        key={dayIndex}
                        className={cn(
                          "min-h-[32px] p-0.5 border border-transparent rounded flex flex-col items-center justify-start",
                          !isCurrentMonthDay && "opacity-30",
                          isTodayDate && isCurrentMonthDay && "bg-primary/10"
                        )}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div
                          className={cn(
                            "text-xs w-full text-center",
                            !isCurrentMonthDay && "text-muted-foreground",
                            isTodayDate && isCurrentMonthDay && "font-bold text-primary"
                          )}
                        >
                          {format(day, "d")}
                        </div>
                        {dayEvents.length > 0 && colorClass && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div
                                className={cn(
                                  "w-1.5 h-1.5 rounded-full mt-0.5",
                                  colorClass
                                )}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (dayEvents.length > 0) {
                                    onEventClick(dayEvents[0]);
                                  }
                                }}
                              />
                            </TooltipTrigger>
                            <TooltipContent
                              side="top"
                              className="max-w-xs p-3"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="space-y-2">
                                <div className="text-xs font-semibold text-foreground">
                                  {format(day, "EEEE, MMMM d, yyyy")}
                                </div>
                                <div className="space-y-1">
                                  {dayEvents.map((event) => (
                                    <div
                                      key={event.id}
                                      className="text-xs cursor-pointer hover:underline"
                                      onClick={() => {
                                        onEventClick(event);
                                      }}
                                    >
                                      <span className="font-medium">{event.title}</span>
                                      {event.location && (
                                        <span className="text-muted-foreground ml-2">
                                          • {event.location}
                                        </span>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </TooltipProvider>
  );
};

