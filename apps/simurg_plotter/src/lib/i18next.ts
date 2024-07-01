import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next, useTranslation as useTranslationOriginal } from 'react-i18next';
import translationEN from '../translations/en.json';
import translationRU from '../translations/ru.json';

// the translations
const resources = {
  en: {
    translation: translationEN,
  },
  ru: {
    translation: translationRU,
  },
};

i18n
  .use(LanguageDetector) // Detects language
  .use(initReactI18next) // Passes i18n down to react-i18next
  .init({
    resources,
    fallbackLng: 'en', // Use English if the detected language is not available
    debug: true,
    interpolation: {
      escapeValue: false, // React already safes from xss
    },
  });

export const useTranslation = useTranslationOriginal;
export default i18n;
