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
        <View className="flex-1 bg-white p-6 justify-center">
            <Text className="text-3xl font-bold mb-8 text-center text-gray-800">Register</Text>
            <TextInput
                className="w-full bg-gray-50 rounded-xl px-4 py-3 mb-4 border border-gray-200"
                placeholder="Name"
                value={name}
                onChangeText={setName}
            />
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
                className="w-full bg-blue-500 rounded-xl px-4 py-4 mb-4"
                onPress={handleRegister}
            >
                <Text className="text-white text-center font-bold text-lg">Register</Text>
            </TouchableOpacity>
            <TouchableOpacity
                className="w-full rounded-xl px-4 py-4"
                onPress={() => navigation.navigate('Login')}
            >
                <Text className="text-blue-500 text-center font-semibold">
                    Already have an account? Login
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default RegisterScreen;