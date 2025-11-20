import { useEffect, useState } from "react";
import { CalendarEvent, CreateEventInput, CalendarColor } from "@/types";
import { format, setHours, setMinutes } from "@/lib/date";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/types";
import { cn } from "@/lib/utils";
import { X, Trash2 } from "lucide-react";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (input: CreateEventInput) => void;
  onDelete?: (id: string) => void;
  event?: CalendarEvent;
  initialDate?: Date;
  initialHour?: number;
  calendars: Calendar[];
}

const colorOptions: { value: CalendarColor; label: string }[] = [
  { value: "blue", label: "Blue" },
  { value: "red", label: "Red" },
  { value: "green", label: "Green" },
  { value: "orange", label: "Orange" },
  { value: "purple", label: "Purple" },
  { value: "cyan", label: "Cyan" },
  { value: "gray", label: "Gray" },
];

const colorClasses: Record<string, string> = {
  blue: "bg-event-blue",
  red: "bg-event-red",
  green: "bg-event-green",
  orange: "bg-event-orange",
  purple: "bg-event-purple",
  cyan: "bg-event-cyan",
  gray: "bg-event-gray",
};

export const EventModal = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  event,
  initialDate,
  initialHour,
  calendars,
}: EventModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [allDay, setAllDay] = useState(false);
  const [location, setLocation] = useState("");
  const [calendarId, setCalendarId] = useState("");
  const [color, setColor] = useState<CalendarColor>("blue");

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDescription(event.description || "");
      setStartDate(format(event.start, "yyyy-MM-dd"));
      setStartTime(format(event.start, "HH:mm"));
      setEndDate(format(event.end, "yyyy-MM-dd"));
      setEndTime(format(event.end, "HH:mm"));
      setAllDay(event.allDay);
      setLocation(event.location || "");
      setCalendarId(event.calendarId);
      setColor(event.color);
    } else if (initialDate) {
      const start =
        initialHour !== undefined
          ? setMinutes(setHours(initialDate, initialHour), 0)
          : initialDate;
      const end =
        initialHour !== undefined
          ? setMinutes(setHours(initialDate, initialHour + 1), 0)
          : initialDate;

      setStartDate(format(start, "yyyy-MM-dd"));
      setStartTime(format(start, "HH:mm"));
      setEndDate(format(end, "yyyy-MM-dd"));
      setEndTime(format(end, "HH:mm"));
      setAllDay(initialHour === undefined);
      setCalendarId(calendars[0]?.id || "");
      setColor(calendars[0]?.color || "blue");
    } else {
      const now = new Date();
      const nextHour = setMinutes(setHours(now, now.getHours() + 1), 0);
      setStartDate(format(now, "yyyy-MM-dd"));
      setStartTime(format(now, "HH:mm"));
      setEndDate(format(nextHour, "yyyy-MM-dd"));
      setEndTime(format(nextHour, "HH:mm"));
      setCalendarId(calendars[0]?.id || "");
      setColor(calendars[0]?.color || "blue");
    }
  }, [event, initialDate, initialHour, calendars]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const start = allDay
      ? new Date(startDate)
      : new Date(`${startDate}T${startTime}`);

    const end = allDay ? new Date(endDate) : new Date(`${endDate}T${endTime}`);

    const input: CreateEventInput = {
      title,
      description: description || undefined,
      start,
      end,
      allDay,
      calendarId,
      color,
      location: location || undefined,
    };

    onSave(input);
    handleClose();
  };

  const handleClose = () => {
    setTitle("");
    setDescription("");
    setLocation("");
    setAllDay(false);
    onClose();
  };

  const handleDeleteClick = () => {
    if (event && onDelete) {
      onDelete(event.id);
      handleClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{event ? "Edit Event" : "Create Event"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Add title"
              required
              autoFocus
            />
          </div>

          <div className="flex items-center gap-2">
            <Switch checked={allDay} onCheckedChange={setAllDay} />
            <Label>All day</Label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start date *</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            {!allDay && (
              <div className="space-y-2">
                <Label htmlFor="startTime">Start time *</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="endDate">End date *</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
            {!allDay && (
              <div className="space-y-2">
                <Label htmlFor="endTime">End time *</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Add location"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add description"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="calendar">Calendar *</Label>
            <select
              id="calendar"
              value={calendarId}
              onChange={(e) => setCalendarId(e.target.value)}
              className="w-full h-10 px-3 rounded-md border border-input bg-background"
              required
            >
              {calendars.map((cal) => (
                <option key={cal.id} value={cal.id}>
                  {cal.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex gap-2 flex-wrap">
              {colorOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setColor(option.value)}
                  className={cn(
                    "h-8 w-8 rounded-full border-2 transition-all",
                    colorClasses[option.value],
                    color === option.value
                      ? "border-foreground scale-110"
                      : "border-transparent"
                  )}
                  title={option.label}
                />
              ))}
            </div>
          </div>

          <DialogFooter className="gap-2">
            {event && onDelete && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDeleteClick}
                className="mr-auto"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            )}
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary-hover">
              {event ? "Save" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
