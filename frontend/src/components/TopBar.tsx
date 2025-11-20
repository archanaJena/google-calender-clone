import { ChevronLeft, ChevronRight, Search, Settings, Menu, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

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
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback>
                  {user?.name ? getUserInitials(user.name) : <User className="h-4 w-4" />}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
