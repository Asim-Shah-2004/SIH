import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';

import LoadingComponent from '../components/LoadingComponent';
import ExplanationScreen from '../screens/ExplanationScreen';
import RegisterScreen from '../screens/Register';
// import Register from '../screens/Register';
import Manual from '../screens/Manual';
import ConfirmRegistration from '../screens/ConfirmRegistration';
import OnboardingPage from '../screens/Onboarding';
import LoginScreen from '../screens/Login';

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 1000); // Delay of 2000ms or 2 seconds
    return () => clearTimeout(timer);
  }, []);

  if (!isReady) {
    return <LoadingComponent />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Onboarding" component={OnboardingPage} />
      <Stack.Screen name="Login" component={LoginScreen} />
      {/* <Stack.Screen name="Register" component={Register} /> */}
      <Stack.Screen name="Explanation" component={ExplanationScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Manual" component={Manual} />
      <Stack.Screen name="ConfirmRegistration" component={ConfirmRegistration} />
    </Stack.Navigator>
  );
}
