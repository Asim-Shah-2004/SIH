import './global.css';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { StatusBar, SafeAreaView, Text, ActivityIndicator } from 'react-native';

import AppNavigator from './navigation/AppNavigator';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    checkLoginStatus();
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
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <NavigationContainer>
        <AppNavigator isLoggedIn={isLoggedIn} />
      </NavigationContainer>
    </SafeAreaView>
  );
}
