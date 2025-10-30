/**
 * i18n Configuration - Multi-language support
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { StorageService } from '@/services/StorageService';

// Import translations
import en from './en/translation.json';
import hi from './hi/translation.json';
import gu from './gu/translation.json';

const resources = {
  en: { translation: en },
  hi: { translation: hi },
  gu: { translation: gu },
};

// Initialize i18n
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: StorageService.getLanguage() || 'en',
    fallbackLng: 'en',
    compatibilityJSON: 'v3',
    
    interpolation: {
      escapeValue: false,
    },

    react: {
      useSuspense: false,
    },
  });

export default i18n;
