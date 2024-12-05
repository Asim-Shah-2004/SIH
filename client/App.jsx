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
