import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';

import i18n from '../i18n/i18n';

export const Providers = ({ children }) => {
  useEffect(() => {
    const initializeLanguage = async () => {
      try {
        const storedLang = await AsyncStorage.getItem('user-language');
        if (storedLang) {
          await i18n.changeLanguage(storedLang);
        }
      } catch (error) {
        console.error('Error initializing language:', error);
      }
    };

    initializeLanguage();
  }, []);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};

export default Providers;
