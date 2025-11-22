import { cn } from '@/lib/utils';
import { useTranslation } from '@/i18n/context';
import { Languages, Globe, Clock } from 'lucide-react';

type SettingsSection = 'language' | 'region' | 'timezone';

interface SettingsSidebarProps {
  activeSection: SettingsSection;
  onSectionChange: (section: SettingsSection) => void;
}

const sections: Array<{ id: SettingsSection; icon: React.ReactNode; labelKey: string }> = [
  { id: 'language', icon: <Languages className="h-4 w-4" />, labelKey: 'settings.language' },
  { id: 'region', icon: <Globe className="h-4 w-4" />, labelKey: 'settings.region' },
  { id: 'timezone', icon: <Clock className="h-4 w-4" />, labelKey: 'settings.timezone' },
];

export const SettingsSidebar = ({ activeSection, onSectionChange }: SettingsSidebarProps) => {
  const { t } = useTranslation();

  return (
    <aside className="w-64 border-r bg-muted/30 p-4">
      <nav className="space-y-1">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => onSectionChange(section.id)}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
              activeSection === section.id
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:bg-background/50 hover:text-foreground'
            )}
          >
            {section.icon}
            <span>{t(section.labelKey)}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};

