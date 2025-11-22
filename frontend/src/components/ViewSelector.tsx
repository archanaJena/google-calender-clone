import { Button } from '@/components/ui/button';
import { ViewType } from '@/types';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/i18n/context';

interface ViewSelectorProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export const ViewSelector = ({ currentView, onViewChange }: ViewSelectorProps) => {
  const { t } = useTranslation();
  
  const views: { value: ViewType; labelKey: string }[] = [
    { value: 'day', labelKey: 'calendar.day' },
    { value: 'week', labelKey: 'calendar.week' },
    { value: 'month', labelKey: 'calendar.month' },
    { value: 'year', labelKey: 'calendar.year' },
    { value: 'agenda', labelKey: 'calendar.agenda' },
  ];

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
          {t(view.labelKey)}
        </Button>
      ))}
    </div>
  );
};
