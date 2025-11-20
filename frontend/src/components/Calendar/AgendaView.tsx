import { CalendarEvent } from "@/types";
import { format, isSameDay, startOfDay, addDays } from "@/lib/date";
import { EventChip } from "../EventChip";
import { cn } from "@/lib/utils";

interface AgendaViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
}

export const AgendaView = ({
  currentDate,
  events,
  onEventClick,
}: AgendaViewProps) => {
  // Show events for next 30 days
  const days = Array.from({ length: 30 }, (_, i) =>
    addDays(startOfDay(currentDate), i)
  );

  const getEventsForDay = (day: Date) => {
    return events
      .filter((event) => {
        const eventStart = new Date(event.start);
        return isSameDay(eventStart, day);
      })
      .sort(
        (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
      );
  };

  return (
    <div className="h-full overflow-auto">
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        {days.map((day) => {
          const dayEvents = getEventsForDay(day);
          if (dayEvents.length === 0) return null;

          return (
            <div key={day.toISOString()} className="space-y-2">
              <div className="sticky top-0 bg-background py-2 z-10">
                <div className="flex items-baseline gap-3">
                  <div className="text-4xl font-normal text-foreground">
                    {format(day, "d")}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground">
                      {format(day, "EEEE")}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {format(day, "MMMM yyyy")}
                    </div>
                  </div>
                </div>
                <div className="mt-2 h-px bg-calendar-border" />
              </div>

              <div className="space-y-2 pl-16">
                {dayEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex gap-4 items-start group cursor-pointer"
                    onClick={() => onEventClick(event)}
                  >
                    <div className="text-xs text-muted-foreground w-20 pt-2 flex-shrink-0">
                      {event.allDay ? "All day" : format(event.start, "h:mm a")}
                    </div>
                    <div className="flex-1">
                      <EventChip
                        event={event}
                        onClick={() => onEventClick(event)}
                        showTime={false}
                        className="mb-1"
                      />
                      {event.location && (
                        <div className="text-xs text-muted-foreground mt-1">
                          📍 {event.location}
                        </div>
                      )}
                      {event.description && (
                        <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {event.description}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {events.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No events scheduled
          </div>
        )}
      </div>
    </div>
  );
};
