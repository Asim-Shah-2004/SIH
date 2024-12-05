import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useState, useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import { SafeAreaView, ActivityIndicator, Text } from 'react-native';

import i18n from '../i18n/i18n';

// Create the AuthContext
export const AuthContext = createContext();

export const Providers = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

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

    const checkAuthStatus = async () => {
      try {
        const loggedInValue = await AsyncStorage.getItem('isLoggedIn');
        const roleValue = await AsyncStorage.getItem('role');
        setIsLoggedIn(loggedInValue === 'true');
        setRole(roleValue || null);
      } catch (e) {
        console.error('Error reading AsyncStorage:', e);
      } finally {
        setTimeout(() => setLoading(false), 1000); // Simulate loading delay
      }
    };

    initializeLanguage();
    checkAuthStatus();
  }, []);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="rgb(var(--color-primary))" />
        <Text className="text-text/60 mt-2.5 text-base font-medium">
          Please wait, loading your experience...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, role, setIsLoggedIn, setRole }}>
      <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
    </AuthContext.Provider>
  );
};

export default Providers;
