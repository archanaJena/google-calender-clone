import { Button } from '@/components/ui/button';
import { ViewType } from '@/types';
import { cn } from '@/lib/utils';

interface ViewSelectorProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const views: { value: ViewType; label: string }[] = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'agenda', label: 'Agenda' },
];

export const ViewSelector = ({ currentView, onViewChange }: ViewSelectorProps) => {
  return (
    <div className="flex items-center border border-border rounded-md overflow-hidden">
      {views.map((view) => (
        <Button
          key={view.value}
          variant="ghost"
          onClick={() => onViewChange(view.value)}
          className={cn(
            'h-9 px-4 rounded-none border-r border-border last:border-r-0',
            currentView === view.value && 'bg-secondary text-secondary-foreground'
          )}
        >
          {view.label}
        </Button>
      ))}
    </div>
  );
};
