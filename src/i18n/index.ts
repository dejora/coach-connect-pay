
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import all translation files
import translationEN from './locales/en/translation.json';
import translationFR from './locales/fr/translation.json';
import translationES from './locales/es/translation.json';

// Import all languages 
const resources = {
  en: {
    translation: translationEN
  },
  fr: {
    translation: translationFR
  },
  es: {
    translation: translationES
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", // default language
    fallbackLng: "en",
    
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
