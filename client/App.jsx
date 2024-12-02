import './global.css';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import { StatusBar, SafeAreaView, Text, ActivityIndicator } from 'react-native';

import i18n from './i18n/i18n';
import AppNavigator from './navigation/AppNavigator';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    checkLoginStatus();
    initializeLanguage();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const value = await AsyncStorage.getItem('isLoggedIn');
      setIsLoggedIn(value === 'true');
    } catch (e) {
      console.error('Error reading AsyncStorage:', e);
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  };

  const initializeLanguage = async () => {
    try {
      const storedLang = await AsyncStorage.getItem('user-language');
      if (storedLang) {
        i18n.changeLanguage(storedLang);
      }
    } catch (error) {
      console.error('Error initializing language:', error);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-background">
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        <ActivityIndicator size="large" color="rgb(var(--color-primary))" />
        <Text className="mt-2.5 text-base font-medium text-text/60">
          Please wait, loading your experience...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <I18nextProvider i18n={i18n}>
      <NavigationContainer>
        <SafeAreaView className="flex-1 bg-background">
          <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
          <AppNavigator isLoggedIn={true} />
        </SafeAreaView>
      </NavigationContainer>
    </I18nextProvider>
  );
}
