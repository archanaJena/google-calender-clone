import { ChevronLeft, ChevronRight, Search, Settings, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface TopBarProps {
  title: string;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
  onSearch?: (query: string) => void;
  onMenuToggle?: () => void;
}

export const TopBar = ({
  title,
  onPrevious,
  onNext,
  onToday,
  onSearch,
  onMenuToggle,
}: TopBarProps) => {
  return (
    <header className="h-16 border-b border-border bg-background flex items-center px-4 gap-4">
      <div className="flex items-center gap-3">
        {onMenuToggle && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuToggle}
            className="md:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={onPrevious}
            className="h-9 w-9"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onNext}
            className="h-9 w-9"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
        <Button
          variant="outline"
          onClick={onToday}
          className="h-9 px-3"
        >
          Today
        </Button>
      </div>

      <h1 className="text-xl font-medium text-foreground">
        {title}
      </h1>

      <div className="ml-auto flex items-center gap-3">
        <div className="relative hidden sm:block w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search events..."
            className="pl-10 h-9"
            onChange={(e) => onSearch?.(e.target.value)}
          />
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
        >
          <Settings className="h-5 w-5" />
        </Button>
        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium">
          U
        </div>
      </div>
    </header>
  );
};
