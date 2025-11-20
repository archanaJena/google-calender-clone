import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { MiniCalendar } from './MiniCalendar';
import { Calendar } from '@/types';
import { cn } from '@/lib/utils';

interface SidebarProps {
  calendars: Calendar[];
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  onCalendarToggle: (id: string) => void;
  onCreateEvent: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const colorClasses: Record<string, string> = {
  blue: 'bg-event-blue',
  red: 'bg-event-red',
  green: 'bg-event-green',
  orange: 'bg-event-orange',
  purple: 'bg-event-purple',
  cyan: 'bg-event-cyan',
  gray: 'bg-event-gray',
};

export const Sidebar = ({
  calendars,
  selectedDate,
  onDateSelect,
  onCalendarToggle,
  onCreateEvent,
  isOpen = true,
  onClose,
}: SidebarProps) => {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed md:static inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border flex flex-col transition-transform duration-200',
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        <div className="p-4 space-y-6">
          <Button
            onClick={onCreateEvent}
            className="w-full bg-primary hover:bg-primary-hover text-primary-foreground shadow-sm h-12 text-base font-medium"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create
          </Button>

          <MiniCalendar
            selectedDate={selectedDate}
            onDateSelect={onDateSelect}
          />

          <div>
            <h3 className="text-sm font-medium text-foreground mb-3">
              My Calendars
            </h3>
            <div className="space-y-2">
              {calendars.map((calendar) => (
                <label
                  key={calendar.id}
                  className="flex items-center gap-3 cursor-pointer group py-1"
                >
                  <Checkbox
                    checked={calendar.visible}
                    onCheckedChange={() => onCalendarToggle(calendar.id)}
                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <div className="flex items-center gap-2 flex-1">
                    <div
                      className={cn(
                        'h-3 w-3 rounded-sm',
                        colorClasses[calendar.color]
                      )}
                    />
                    <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                      {calendar.name}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
