import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { SettingsSidebar } from './SettingsSidebar';
import { SettingsSectionLanguage } from './SettingsSectionLanguage';
import { SettingsSectionRegion } from './SettingsSectionRegion';
import { SettingsSectionTimezone } from './SettingsSectionTimezone';
import { useTranslation } from '@/i18n/context';

type SettingsSection = 'language' | 'region' | 'timezone';

interface SettingsPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SettingsPanel = ({ open, onOpenChange }: SettingsPanelProps) => {
  const [activeSection, setActiveSection] = useState<SettingsSection>('language');
  const { t } = useTranslation();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-2xl p-0 flex flex-col">
        <div className="flex h-full">
          {/* Sidebar */}
          <SettingsSidebar
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />

          {/* Main Content */}
          <div className="flex-1 overflow-auto">
            <SheetHeader className="px-6 pt-6 pb-4 border-b">
              <SheetTitle>{t('settings.title')}</SheetTitle>
            </SheetHeader>

            <div className="p-6">
              {activeSection === 'language' && <SettingsSectionLanguage />}
              {activeSection === 'region' && <SettingsSectionRegion />}
              {activeSection === 'timezone' && <SettingsSectionTimezone />}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

