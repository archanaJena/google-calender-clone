import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { TopBar } from "@/components/TopBar";
import { Sidebar } from "@/components/Sidebar";
import { ViewSelector } from "@/components/ViewSelector";
import { MonthView } from "@/components/Calendar/MonthView";
import { WeekView } from "@/components/Calendar/WeekView";
import { DayView } from "@/components/Calendar/DayView";
import { AgendaView } from "@/components/Calendar/AgendaView";
import { YearView } from "@/components/Calendar/YearView";
import { EventModal } from "@/components/EventModal";
import { eventAPI, calendarAPI } from "@/api";
import { CalendarEvent, Calendar, ViewType, CreateEventInput } from "@/types";
import {
  format,
  addMonths,
  addWeeks,
  addDays,
  addYears,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  startOfDay,
  endOfDay,
  startOfYear,
  endOfYear,
  setHours,
} from "@/lib/date";
import { useToast } from "@/hooks/use-toast";

export const CalendarPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const view = (searchParams.get("view") as ViewType) || "month";
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [calendars, setCalendars] = useState<Calendar[]>([]);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<
    CalendarEvent | undefined
  >();
  const [modalInitialDate, setModalInitialDate] = useState<Date | undefined>();
  const [modalInitialHour, setModalInitialHour] = useState<
    number | undefined
  >();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<CalendarEvent[]>([]);
  const [highlightedEventIds, setHighlightedEventIds] = useState<string[]>([]);

  // Load calendars
  useEffect(() => {
    const loadCalendars = async () => {
      try {
        const data = await calendarAPI.getCalendars();
        setCalendars(data);
      } catch (error) {
        console.error("Error loading calendars:", error);
        toast({
          title: "Error",
          description: "Failed to load calendars",
          variant: "destructive",
        });
      }
    };
    loadCalendars();
  }, [toast]);

  // Load events
  useEffect(() => {
    const loadEvents = async () => {
      setIsLoading(true);
      try {
        const start = (() => {
          switch (view) {
            case "year":
              return startOfYear(currentDate);
            case "month":
              return startOfWeek(startOfMonth(currentDate));
            case "week":
              return startOfWeek(currentDate);
            case "day":
              return startOfDay(currentDate);
            case "agenda":
              return addDays(startOfDay(currentDate), 1);
            default:
              return currentDate;
          }
        })();

        const end = (() => {
          switch (view) {
            case "year":
              return endOfYear(currentDate);
            case "month":
              return endOfWeek(endOfMonth(currentDate));
            case "week":
              return endOfWeek(currentDate);
            case "day":
              return endOfDay(currentDate);
            case "agenda":
              return addDays(addDays(startOfDay(currentDate), 1), 30);
            default:
              return addDays(currentDate, 30);
          }
        })();

        const data = await eventAPI.getEvents(start, end);

        // Filter by visible calendars
        const visibleCalendarIds = calendars
          .filter((cal) => cal.visible)
          .map((cal) => cal.id);

        setEvents(
          data.filter((event) => visibleCalendarIds.includes(event.calendarId))
        );
      } catch (error) {
        console.error("Error loading events:", error);
        toast({
          title: "Error",
          description: "Failed to load events",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (calendars.length > 0) {
      loadEvents();
    }
  }, [currentDate, view, calendars, toast]);

  const handleViewChange = (newView: ViewType) => {
    setSearchParams({ view: newView });
  };

  const handlePrevious = () => {
    switch (view) {
      case "year":
        setCurrentDate(addYears(currentDate, -1));
        break;
      case "month":
        setCurrentDate(addMonths(currentDate, -1));
        break;
      case "week":
        setCurrentDate(addWeeks(currentDate, -1));
        break;
      case "day":
        setCurrentDate(addDays(currentDate, -1));
        break;
    }
  };

  const handleNext = () => {
    switch (view) {
      case "year":
        setCurrentDate(addYears(currentDate, 1));
        break;
      case "month":
        setCurrentDate(addMonths(currentDate, 1));
        break;
      case "week":
        setCurrentDate(addWeeks(currentDate, 1));
        break;
      case "day":
        setCurrentDate(addDays(currentDate, 1));
        break;
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleDateSelect = (date: Date) => {
    setCurrentDate(date);
    if (view === "month") {
      handleViewChange("day");
    }
  };

  const handleCalendarToggle = async (id: string) => {
    const calendar = calendars.find((cal) => cal.id === id);
    if (!calendar) return;

    try {
      await calendarAPI.updateCalendar(id, { visible: !calendar.visible });
      setCalendars(
        calendars.map((cal) =>
          cal.id === id ? { ...cal, visible: !cal.visible } : cal
        )
      );
    } catch (error) {
      console.error("Error toggling calendar:", error);
      toast({
        title: "Error",
        description: "Failed to update calendar",
        variant: "destructive",
      });
    }
  };

  const handleCreateEvent = () => {
    setSelectedEvent(undefined);
    setModalInitialDate(undefined);
    setModalInitialHour(undefined);
    setIsEventModalOpen(true);
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsEventModalOpen(true);
  };

  const handleDayClick = (date: Date) => {
    setModalInitialDate(date);
    setModalInitialHour(undefined);
    setIsEventModalOpen(true);
  };

  const handleTimeSlotClick = (date: Date, hour: number) => {
    setModalInitialDate(date);
    setModalInitialHour(hour);
    setIsEventModalOpen(true);
  };

  const handleSearchEvents = async (query: string) => {
    const trimmed = query.trim();
    setSearchQuery(query);

    if (!trimmed) {
      setSearchResults([]);
      setHighlightedEventIds([]);
      return;
    }

    try {
      const results = await eventAPI.searchEvents(trimmed);
      setSearchResults(results);
      setHighlightedEventIds(results.map((event) => event.id));

      if (results.length > 0) {
        const first = results[0];
        const targetDate = new Date(first.start);
        setCurrentDate(targetDate);
      } else {
        toast({
          title: "No events found",
          description: `No events matching "${trimmed}"`,
        });
      }
    } catch (error) {
      console.error("Error searching events:", error);
      toast({
        title: "Error",
        description: "Failed to search events",
        variant: "destructive",
      });
    }
  };

  const handleSearchResultClick = (event: CalendarEvent) => {
    const targetDate = new Date(event.start);
    setCurrentDate(targetDate);
    if (view !== "day") {
      handleViewChange("day");
    }
  };

  const handleSaveEvent = async (input: CreateEventInput) => {
    try {
      if (selectedEvent) {
        await eventAPI.updateEvent({ ...input, id: selectedEvent.id });
        toast({ title: "Event updated successfully" });
      } else {
        await eventAPI.createEvent(input);
        toast({ title: "Event created successfully" });
      }

      // Reload events based on current view
      const reloadStart = (() => {
        switch (view) {
          case "year":
            return startOfYear(currentDate);
          case "month":
            return startOfWeek(startOfMonth(currentDate));
          case "week":
            return startOfWeek(currentDate);
          case "day":
            return startOfDay(currentDate);
          case "agenda":
            return addDays(startOfDay(currentDate), 1);
          default:
            return currentDate;
        }
      })();

      const reloadEnd = (() => {
        switch (view) {
          case "year":
            return endOfYear(currentDate);
          case "month":
            return endOfWeek(endOfMonth(currentDate));
          case "week":
            return endOfWeek(currentDate);
          case "day":
            return endOfDay(currentDate);
          case "agenda":
            return addDays(addDays(startOfDay(currentDate), 1), 30);
          default:
            return addDays(currentDate, 30);
        }
      })();

      const data = await eventAPI.getEvents(reloadStart, reloadEnd);
      const visibleCalendarIds = calendars
        .filter((cal) => cal.visible)
        .map((cal) => cal.id);
      setEvents(
        data.filter((event) => visibleCalendarIds.includes(event.calendarId))
      );
    } catch (error) {
      console.error("Error saving event:", error);
      toast({
        title: "Error",
        description: "Failed to save event",
        variant: "destructive",
      });
      throw error; // Re-throw so modal can handle it
    }
  };

  const handleDeleteEvent = async (id: string) => {
    try {
      await eventAPI.deleteEvent(id);
      setEvents(events.filter((event) => event.id !== id));
      toast({ title: "Event deleted successfully" });
    } catch (error) {
      console.error("Error deleting event:", error);
      toast({
        title: "Error",
        description: "Failed to delete event",
        variant: "destructive",
      });
    }
  };

  const getTitle = () => {
    switch (view) {
      case "year":
        return format(currentDate, "yyyy");
      case "month":
        return format(currentDate, "MMMM yyyy");
      case "week":
        return format(currentDate, "MMMM yyyy");
      case "day":
        return format(currentDate, "MMMM d, yyyy");
      case "agenda":
        return "Agenda";
      default:
        return "";
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <TopBar
        title={getTitle()}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onToday={handleToday}
        onSearch={handleSearchEvents}
        onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          calendars={calendars}
          selectedDate={currentDate}
          onDateSelect={handleDateSelect}
          onCalendarToggle={handleCalendarToggle}
          onCreateEvent={handleCreateEvent}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-calendar-border flex items-center justify-between">
            <ViewSelector currentView={view} onViewChange={handleViewChange} />
          </div>

          {searchQuery.trim() && (
            <div className="border-b border-calendar-border px-4 py-2 text-sm bg-muted/40">
              {searchResults.length === 0 ? (
                <div className="text-muted-foreground">
                  No events matching "{searchQuery.trim()}"
                </div>
              ) : (
                <div className="space-y-1">
                  {searchResults.map((event) => (
                    <button
                      key={event.id}
                      className="w-full text-left flex items-center justify-between px-2 py-1 rounded hover:bg-muted transition-colors"
                      onClick={() => handleSearchResultClick(event)}
                    >
                      <span className="truncate text-sm">
                        {event.title}
                        {event.location && (
                          <span className="text-muted-foreground ml-2 text-xs">
                            • {event.location}
                          </span>
                        )}
                      </span>
                      <span className="text-xs text-muted-foreground ml-2 whitespace-nowrap">
                        {format(new Date(event.start), "MMM d, yyyy")}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-muted-foreground">Loading events...</div>
              </div>
            ) : (
              <>
                {view === "month" && (
                  <MonthView
                    currentDate={currentDate}
                    events={events}
                    onEventClick={handleEventClick}
                    onDayClick={handleDayClick}
                    highlightedEventIds={highlightedEventIds}
                  />
                )}
                {view === "week" && (
                  <WeekView
                    currentDate={currentDate}
                    events={events}
                    onEventClick={handleEventClick}
                    onTimeSlotClick={handleTimeSlotClick}
                    highlightedEventIds={highlightedEventIds}
                  />
                )}
                {view === "day" && (
                  <DayView
                    currentDate={currentDate}
                    events={events}
                    onEventClick={handleEventClick}
                    onTimeSlotClick={(hour) =>
                      handleTimeSlotClick(currentDate, hour)
                    }
                    highlightedEventIds={highlightedEventIds}
                  />
                )}
                {view === "year" && (
                  <YearView
                    currentDate={currentDate}
                    events={events}
                    onEventClick={handleEventClick}
                    onMonthClick={(date) => {
                      setCurrentDate(date);
                      handleViewChange("month");
                    }}
                    highlightedEventIds={highlightedEventIds}
                  />
                )}
                {view === "agenda" && (
                  <AgendaView
                    currentDate={currentDate}
                    events={events}
                    onEventClick={handleEventClick}
                    highlightedEventIds={highlightedEventIds}
                  />
                )}
              </>
            )}
          </div>
        </main>
      </div>

      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
        event={selectedEvent}
        initialDate={modalInitialDate}
        initialHour={modalInitialHour}
        calendars={calendars}
      />
    </div>
  );
};
