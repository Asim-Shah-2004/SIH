import React from 'react';
import { View, Text, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import AlumniDirectory from '../../screens/AlumniDirectory';

const AlumniRecommendations = ({ navigation }) => {

    return (
        <ScrollView contentContainerStyle={{ paddingBottom: 16 }} className="bg-gray-100 p-4">
            {/* Alumni Map Button */}
            <View className="flex-row justify-between">
                <View className="mb-4 flex-row justify-between flex-grow">
                    <TouchableOpacity
                        className="rounded-md bg-blue-700 px-4 py-2"
                        onPress={() => navigation.navigate('Map')}>
                        <Text className="text-base font-semibold text-white">Alumni Map</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <AlumniDirectory />
        </ScrollView>
    );
};

export default AlumniRecommendations;
