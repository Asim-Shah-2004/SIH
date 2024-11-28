// screens/LoginScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
        <View className="flex-1 bg-white p-6 justify-center">
            <Text className="text-3xl font-bold mb-8 text-center text-gray-800">Login</Text>
            <TextInput
                className="w-full bg-gray-50 rounded-xl px-4 py-3 mb-4 border border-gray-200"
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                className="w-full bg-gray-50 rounded-xl px-4 py-3 mb-6 border border-gray-200"
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            <TouchableOpacity
                className="w-full bg-primary text-dark rounded-xl px-4 py-4 mb-4"
                onPress={handleLogin}
            >
                <Text className="text-white text-center font-bold text-lg">Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
                className="w-full rounded-xl px-4 py-4"
                onPress={() => navigation.navigate('Register')}
            >
                <Text className="text-blue-500 text-center font-semibold">
                    Don't have an account? Register
                </Text>
            </TouchableOpacity>

        </View>
    );
};

export default LoginScreen;