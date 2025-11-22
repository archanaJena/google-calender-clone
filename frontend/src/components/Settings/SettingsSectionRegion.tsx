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
import { Region } from '@/types';

const regions: Array<{ value: Region; label: string }> = [
  { value: 'US', label: 'United States' },
  { value: 'IN', label: 'India' },
  { value: 'FR', label: 'France' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'CA', label: 'Canada' },
  { value: 'AU', label: 'Australia' },
  { value: 'DE', label: 'Germany' },
  { value: 'JP', label: 'Japan' },
  { value: 'CN', label: 'China' },
  { value: 'BR', label: 'Brazil' },
];

export const SettingsSectionRegion = () => {
  const { settings, updateSettings } = useSettings();
  const { t } = useTranslation();

  if (!settings) return null;

  const handleRegionChange = async (region: Region) => {
    await updateSettings({ region });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">{t('settings.region')}</h2>
        <p className="text-sm text-muted-foreground mb-6">
          {settings.language === 'en' && 'Select your region to customize date formats and week start day.'}
          {settings.language === 'hi' && 'तिथि प्रारूप और सप्ताह शुरू करने के दिन को अनुकूलित करने के लिए अपना क्षेत्र चुनें।'}
          {settings.language === 'fr' && 'Sélectionnez votre région pour personnaliser les formats de date et le jour de début de semaine.'}
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="region-select">{t('settings.selectRegion')}</Label>
        <Select
          value={settings.region}
          onValueChange={handleRegionChange}
        >
          <SelectTrigger id="region-select" className="w-full sm:w-[300px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {regions.map((region) => (
              <SelectItem key={region.value} value={region.value}>
                {region.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="pt-4 border-t">
        <p className="text-xs text-muted-foreground">
          {settings.language === 'en' && `Week starts on: ${settings.weekStartsOn === 0 ? 'Sunday' : 'Monday'}`}
          {settings.language === 'hi' && `सप्ताह शुरू होता है: ${settings.weekStartsOn === 0 ? 'रविवार' : 'सोमवार'}`}
          {settings.language === 'fr' && `La semaine commence le: ${settings.weekStartsOn === 0 ? 'Dimanche' : 'Lundi'}`}
        </p>
      </div>
    </div>
  );
};

