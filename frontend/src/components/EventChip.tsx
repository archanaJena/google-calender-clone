import { CalendarEvent } from '@/types';
import { formatTime } from '@/lib/date';
import { cn } from '@/lib/utils';

interface EventChipProps {
  event: CalendarEvent;
  onClick?: () => void;
  className?: string;
  showTime?: boolean;
}

const colorClasses: Record<string, { bg: string; border: string }> = {
  blue: { bg: 'bg-event-blue/10', border: 'border-l-event-blue' },
  red: { bg: 'bg-event-red/10', border: 'border-l-event-red' },
  green: { bg: 'bg-event-green/10', border: 'border-l-event-green' },
  orange: { bg: 'bg-event-orange/10', border: 'border-l-event-orange' },
  purple: { bg: 'bg-event-purple/10', border: 'border-l-event-purple' },
  cyan: { bg: 'bg-event-cyan/10', border: 'border-l-event-cyan' },
  gray: { bg: 'bg-event-gray/10', border: 'border-l-event-gray' },
};

export const EventChip = ({ event, onClick, className, showTime = true }: EventChipProps) => {
  const colors = colorClasses[event.color] || colorClasses.blue;

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full text-left px-2 py-1 rounded border-l-4 shadow-sm hover:shadow transition-shadow',
        colors.bg,
        colors.border,
        className
      )}
    >
      <div className="text-xs font-medium text-foreground truncate">
        {showTime && !event.allDay && (
          <span className="mr-1">{formatTime(event.start)}</span>
        )}
        {event.title}
      </div>
      {event.location && (
        <div className="text-xs text-muted-foreground truncate">
          {event.location}
        </div>
      )}
    </button>
  );
};
