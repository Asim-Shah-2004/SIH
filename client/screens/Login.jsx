// screens/LoginScreen.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await AsyncStorage.setItem('isLoggedIn', 'true');
      console.log('Data saved');
    } catch (e) {
      console.error('Error saving data', e);
    }
    navigation.navigate('MainDrawer');
  };

  return (
    <View className="flex-1 justify-center bg-white p-6">
      <Text className="mb-8 text-center text-3xl font-bold text-gray-800">Login</Text>
      <TextInput
        className="mb-4 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        className="mb-6 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3"
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity
        className="text-dark mb-4 w-full rounded-xl bg-primary px-4 py-4"
        onPress={handleLogin}>
        <Text className="text-center text-lg font-bold text-white">Login</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="w-full rounded-xl px-4 py-4"
        onPress={() => navigation.navigate('Register')}>
        <Text className="text-center font-semibold text-blue-500">
          Don't have an account? Register
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;
