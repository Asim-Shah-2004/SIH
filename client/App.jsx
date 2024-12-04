import './global.css';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { useColorScheme } from 'nativewind';
import { useState, useEffect } from 'react';
import { StatusBar, SafeAreaView, Text, ActivityIndicator } from 'react-native';

import AppNavigator from './navigation/AppNavigator';
import { Providers } from './providers/CustomProvider';
import { themes } from './utils/colorTheme';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const { colorScheme } = useColorScheme();

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
      <Providers>
        <SafeAreaView
          className="flex-1 items-center justify-center bg-background"
          style={themes['light']}>
          <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
          <ActivityIndicator size="large" color="rgb(var(--color-primary))" />
          <Text className="text-text/60 mt-2.5 text-base font-medium">
            Please wait, loading your experience...
          </Text>
        </SafeAreaView>
      </Providers>
    );
  }

  return (
    <Providers>
      <NavigationContainer>
        <SafeAreaView className="flex-1 bg-background" style={themes['light']}>
          <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
          <AppNavigator isLoggedIn={true} />
        </SafeAreaView>
      </NavigationContainer>
    </Providers>
  );
}
