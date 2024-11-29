import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';

const AlumniRecommendations = ({ navigation }) => {
    const recommendations = [
        {
            id: 1,
            name: 'Blah Blah',
            title: 'SDE at JP Morgan',
            connection: '173 other mutual connections',
        },
        {
            id: 2,
            name: 'Nina Rose',
            title: 'SDE Hackathon Finalist at Microsoft',
            connection: '299 other mutual connections',
        },
        {
            id: 3,
            name: 'John Doe',
            title: 'Product Manager at Google',
            connection: '87 other mutual connections',
        },
        {
            id: 4,
            name: 'Jane Smith',
            title: 'Data Scientist at Amazon',
            connection: '42 other mutual connections',
        },
    ];

    const renderRecommendationItem = ({ item }) => (
        <View className="bg-white rounded-lg p-4 mr-4 w-64">
            <View className="flex-row items-center mb-3">
                <Image
                    source={require('../assets/profile.jpg')}
                    className="w-12 h-12 rounded-full mr-3"
                />
                <View>
                    <Text className="text-lg font-bold">{item.name}</Text>
                    <Text className="text-gray-500 text-sm">{item.title}</Text>
                </View>
            </View>
            <View className="flex-row justify-between items-center">
                <View className="flex-row">
                    <TouchableOpacity className="bg-blue-600 px-3 py-2 rounded-md">
                        <Text className="text-white text-sm font-bold">View Profile</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="bg-blue-600 px-3 py-2 rounded-md ml-2">
                        <Text className="text-white text-sm font-bold">Connect</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    return (
        <View className="bg-gray-100 p-4">
            <View className="flex-row justify-between mb-4">
                <TouchableOpacity
                    className="bg-blue-700 px-4 py-2 rounded-md"
                    onPress={() => navigation.navigate('Map')}
                >
                    <Text className="text-white text-base font-semibold">Alumni Map</Text>
                </TouchableOpacity>
            </View>

            <Text className="text-lg font-bold mb-3">Alumni Recommendations</Text>

            <Text className="text-lg font-bold mb-3">Based on Location</Text>
            <FlatList
                data={recommendations}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderRecommendationItem}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingVertical: 12 }}
            />

            <Text className="text-lg font-bold mb-3">Based on Interests</Text>
            <FlatList
                data={recommendations}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderRecommendationItem}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingVertical: 12 }}
            />

            <Text className="text-lg font-bold mb-3">Based on Batch</Text>
            <FlatList
                data={recommendations}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderRecommendationItem}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingVertical: 12 }}
            />
        </View>
    );
};

export default AlumniRecommendations;
