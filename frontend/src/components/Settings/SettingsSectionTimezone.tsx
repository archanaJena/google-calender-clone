import { useSettings } from '@/context/SettingsContext';
import { useTranslation } from '@/i18n/context';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

// Common timezones organized by region
const timezones = [
  // Americas
  { value: 'America/New_York', label: 'Eastern Time (US & Canada)' },
  { value: 'America/Chicago', label: 'Central Time (US & Canada)' },
  { value: 'America/Denver', label: 'Mountain Time (US & Canada)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (US & Canada)' },
  { value: 'America/Toronto', label: 'Toronto' },
  { value: 'America/Vancouver', label: 'Vancouver' },
  { value: 'America/Sao_Paulo', label: 'São Paulo' },
  { value: 'America/Mexico_City', label: 'Mexico City' },
  
  // Europe
  { value: 'Europe/London', label: 'London' },
  { value: 'Europe/Paris', label: 'Paris' },
  { value: 'Europe/Berlin', label: 'Berlin' },
  { value: 'Europe/Rome', label: 'Rome' },
  { value: 'Europe/Madrid', label: 'Madrid' },
  { value: 'Europe/Amsterdam', label: 'Amsterdam' },
  { value: 'Europe/Moscow', label: 'Moscow' },
  
  // Asia
  { value: 'Asia/Kolkata', label: 'Mumbai, New Delhi' },
  { value: 'Asia/Dubai', label: 'Dubai' },
  { value: 'Asia/Singapore', label: 'Singapore' },
  { value: 'Asia/Hong_Kong', label: 'Hong Kong' },
  { value: 'Asia/Shanghai', label: 'Shanghai' },
  { value: 'Asia/Tokyo', label: 'Tokyo' },
  { value: 'Asia/Seoul', label: 'Seoul' },
  { value: 'Asia/Bangkok', label: 'Bangkok' },
  
  // Oceania
  { value: 'Australia/Sydney', label: 'Sydney' },
  { value: 'Australia/Melbourne', label: 'Melbourne' },
  { value: 'Pacific/Auckland', label: 'Auckland' },
  
  // UTC
  { value: 'UTC', label: 'UTC' },
];

export const SettingsSectionTimezone = () => {
  const { settings, updateSettings } = useSettings();
  const { t } = useTranslation();

  if (!settings) return null;

  const handleTimezoneChange = async (timezone: string) => {
    await updateSettings({ timezone });
  };

  const handleTimeFormatChange = async (use24h: boolean) => {
    await updateSettings({ timeFormat: use24h ? '24h' : '12h' });
  };

  // Get current time in selected timezone
  const getCurrentTimeInTimezone = (tz: string) => {
    try {
      return new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        hour: 'numeric',
        minute: '2-digit',
        hour12: settings?.timeFormat !== '24h',
      }).format(new Date());
    } catch {
      return '';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">{t('settings.timezone')}</h2>
        <p className="text-sm text-muted-foreground mb-6">
          {settings.language === 'en' && 'Select your time zone to display events and times correctly.'}
          {settings.language === 'hi' && 'घटनाओं और समय को सही ढंग से प्रदर्शित करने के लिए अपना समय क्षेत्र चुनें।'}
          {settings.language === 'fr' && 'Sélectionnez votre fuseau horaire pour afficher correctement les événements et les heures.'}
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="timezone-select">{t('settings.selectTimezone')}</Label>
        <Select
          value={settings.timezone}
          onValueChange={handleTimezoneChange}
        >
          <SelectTrigger id="timezone-select" className="w-full sm:w-[300px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            {timezones.map((tz) => (
              <SelectItem key={tz.value} value={tz.value}>
                {tz.label} ({getCurrentTimeInTimezone(tz.value)})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="time-format-switch">
          {settings.language === 'en' && 'Use 24-hour format'}
          {settings.language === 'hi' && '24 घंटे प्रारूप का उपयोग करें'}
          {settings.language === 'fr' && 'Utiliser le format 24 heures'}
        </Label>
        <div className="flex items-center gap-3">
          <Switch
            id="time-format-switch"
            checked={settings.timeFormat === '24h'}
            onCheckedChange={handleTimeFormatChange}
          />
          <span className="text-sm text-muted-foreground">
            {settings.timeFormat === '24h' 
              ? (settings.language === 'en' ? '24-hour format (14:30)' : settings.language === 'hi' ? '24 घंटे प्रारूप (14:30)' : 'Format 24 heures (14:30)')
              : (settings.language === 'en' ? '12-hour format (2:30 PM)' : settings.language === 'hi' ? '12 घंटे प्रारूप (2:30 PM)' : 'Format 12 heures (14:30)')
            }
          </span>
        </div>
      </div>

      <div className="pt-4 border-t">
        <p className="text-xs text-muted-foreground">
          {settings.language === 'en' && `Current time: ${getCurrentTimeInTimezone(settings.timezone)}`}
          {settings.language === 'hi' && `वर्तमान समय: ${getCurrentTimeInTimezone(settings.timezone)}`}
          {settings.language === 'fr' && `Heure actuelle: ${getCurrentTimeInTimezone(settings.timezone)}`}
        </p>
      </div>
    </div>
  );
};

