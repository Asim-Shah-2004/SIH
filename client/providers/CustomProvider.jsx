import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useState, useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import { View, SafeAreaView, ActivityIndicator, Text } from 'react-native';

import i18n from '../i18n/i18n';

// Create the AuthContext
export const AuthContext = createContext();

export const Providers = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

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
        setLoading(false);
      } catch (e) {
        console.error('Error reading AsyncStorage:', e);
      }
    };

    initializeLanguage();
    checkAuthStatus();
  }, []);

  if (loading) {
    <View className='h-full w-full bg-white'>
      <ActivityIndicator size='large' color='#0000ff' />
      <Text>Loading .....</Text>
    </View>
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, role, setIsLoggedIn, setRole, user, setUser }}>
      <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
    </AuthContext.Provider>
  );
};

export default Providers;
