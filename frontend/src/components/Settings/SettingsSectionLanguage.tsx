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

export const SettingsSectionLanguage = () => {
  const { settings, updateSettings } = useSettings();
  const { t } = useTranslation();

  if (!settings) return null;

  const handleLanguageChange = async (language: 'en' | 'hi' | 'fr') => {
    await updateSettings({ language });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">{t('settings.language')}</h2>
        <p className="text-sm text-muted-foreground mb-6">
          {settings.language === 'en' && 'Choose your preferred language for the calendar interface.'}
          {settings.language === 'hi' && 'कैलेंडर इंटरफ़ेस के लिए अपनी पसंदीदा भाषा चुनें।'}
          {settings.language === 'fr' && 'Choisissez votre langue préférée pour l\'interface du calendrier.'}
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="language-select">{t('settings.selectLanguage')}</Label>
        <Select
          value={settings.language}
          onValueChange={handleLanguageChange}
        >
          <SelectTrigger id="language-select" className="w-full sm:w-[300px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="hi">हिन्दी (Hindi)</SelectItem>
            <SelectItem value="fr">Français (French)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="pt-4 border-t">
        <p className="text-xs text-muted-foreground">
          {settings.language === 'en' && 'Changing the language will update all text, dates, and labels throughout the calendar.'}
          {settings.language === 'hi' && 'भाषा बदलने से कैलेंडर में सभी पाठ, तिथियां और लेबल अपडेट हो जाएंगे।'}
          {settings.language === 'fr' && 'Changer la langue mettra à jour tout le texte, les dates et les étiquettes dans le calendrier.'}
        </p>
      </div>
    </div>
  );
};

