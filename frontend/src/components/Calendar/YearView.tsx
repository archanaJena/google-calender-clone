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

  const getEventDots = (dayEvents: CalendarEvent[]) => {
    if (dayEvents.length === 0) return [];
    // Return all events with their colors
    return dayEvents.map((event) => ({
      color: event.color,
      colorClass: colorDotClasses[event.color] || colorDotClasses.blue,
    }));
  };

  const getDotPosition = (index: number, total: number) => {
    if (total === 1) {
      return { top: 'auto', bottom: '2px', left: '50%', transform: 'translateX(-50%)' };
    }
    
    // Arrange dots in a circle around the date
    const angle = (index * 360) / total;
    const radius = 8; // Distance from center
    const radian = (angle * Math.PI) / 180;
    const x = Math.cos(radian) * radius;
    const y = Math.sin(radian) * radius;
    
    return {
      top: `${50 + y}%`,
      left: `${50 + x}%`,
      transform: 'translate(-50%, -50%)',
    };
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
                    const eventDots = getEventDots(dayEvents);

                    return (
                      <div
                        key={dayIndex}
                        className={cn(
                          "min-h-[32px] p-0.5 border border-transparent rounded relative flex items-center justify-center",
                          !isCurrentMonthDay && "opacity-30",
                          isTodayDate && isCurrentMonthDay && "bg-primary/10"
                        )}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div
                          className={cn(
                            "text-xs text-center z-10",
                            !isCurrentMonthDay && "text-muted-foreground",
                            isTodayDate && isCurrentMonthDay && "font-bold text-primary"
                          )}
                        >
                          {format(day, "d")}
                        </div>
                        {eventDots.length > 0 && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="absolute inset-0 flex items-center justify-center">
                                {eventDots.map((dot, dotIndex) => {
                                  const position = getDotPosition(dotIndex, eventDots.length);
                                  return (
                                    <div
                                      key={dotIndex}
                                      className={cn(
                                        "w-1.5 h-1.5 rounded-full absolute",
                                        dot.colorClass
                                      )}
                                      style={position}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (dayEvents[dotIndex]) {
                                          onEventClick(dayEvents[dotIndex]);
                                        }
                                      }}
                                    />
                                  );
                                })}
                              </div>
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

