// screens/RegisterScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    // Perform registration logic here
    navigation.navigate('Login');
  };

  return (
    <View className="flex-1 justify-center bg-white p-6">
      <Text className="mb-8 text-center text-3xl font-bold text-gray-800">Register</Text>
      <TextInput
        className="mb-4 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3"
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
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
        className="mb-4 w-full rounded-xl bg-blue-500 px-4 py-4"
        onPress={handleRegister}>
        <Text className="text-center text-lg font-bold text-white">Register</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="w-full rounded-xl px-4 py-4"
        onPress={() => navigation.navigate('Login')}>
        <Text className="text-center font-semibold text-blue-500">
          Already have an account? Login
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default RegisterScreen;
