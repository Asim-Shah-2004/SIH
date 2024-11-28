// screens/Home.js
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export default function Home({ navigation }) {
    return (
        <View className="flex-1 justify-center items-center bg-white p-6">
            <Text className="text-2xl font-bold text-gray-800 mb-6">
                Welcome Home
            </Text>
            <TouchableOpacity
                className="bg-blue-500 px-6 py-3 rounded-xl"
                onPress={() => navigation.navigate('Map')}
            >
                <Text className="text-white font-semibold">Go to Map</Text>
            </TouchableOpacity>
        </View>
    );
}
