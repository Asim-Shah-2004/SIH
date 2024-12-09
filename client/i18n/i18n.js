import AsyncStorage from '@react-native-async-storage/async-storage';
import i18 from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en';
import hi from './locales/hi';

export const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिंदी' },
];

i18.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  resources: {
    en: { translation: en },
    hi: { translation: hi },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

export const changeLanguage = async (language) => {
  try {
    await AsyncStorage.setItem('user-language', language);
    await i18.changeLanguage(language);
  } catch (error) {
    console.log('Error changing language:', error);
  }
};

export default i18;
