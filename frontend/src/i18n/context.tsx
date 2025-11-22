import { createContext, useContext, ReactNode, useMemo } from 'react';
import { translations, TranslationKey } from './translations';
import { Language } from '@/types';

interface I18nContextValue {
  t: (key: string) => string;
  language: Language;
}

const I18nContext = createContext<I18nContextValue>({
  t: (key: string) => key,
  language: 'en',
});

// Helper function to get nested translation
const getNestedTranslation = (obj: any, path: string): string => {
  const keys = path.split('.');
  let value = obj;
  
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return path; // Return key path if translation not found
    }
  }
  
  return typeof value === 'string' ? value : path;
};

interface I18nProviderProps {
  children: ReactNode;
  language: Language;
}

export const I18nProvider = ({ children, language }: I18nProviderProps) => {
  const t = useMemo(() => {
    const translation = translations[language] || translations.en;
    return (key: string) => getNestedTranslation(translation, key);
  }, [language]);

  return (
    <I18nContext.Provider value={{ t, language }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useTranslation must be used within I18nProvider');
  }
  return context;
};

