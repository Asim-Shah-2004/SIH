import './global.css';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar, SafeAreaView } from 'react-native';

import AppNavigator from './navigation/AppNavigator';
import { Providers, AuthContext } from './providers/CustomProvider';
import { themes } from './utils/colorTheme';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text } from 'react-native';

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const clearStorage = async () => {
      try {
        await AsyncStorage.clear();
        console.log('AsyncStorage cleared');
      } catch (e) {
        console.error('Failed to clear AsyncStorage', e);
      } finally {
        setLoading(false);
      }
    };

    clearStorage();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="text-text/60 mt-2.5 text-base font-medium">
          Please wait, loading your experience...
        </Text>
      </View>
    );
  }
  return (
    <Providers>
      <NavigationContainer>
        <SafeAreaView className="flex-1 bg-background" style={themes['light']}>
          <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
          <AppNavigator />
        </SafeAreaView>
      </NavigationContainer>
    </Providers>
  );
}
