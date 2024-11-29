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
    <View className="mr-4 w-64 rounded-lg bg-white p-4">
      <View className="mb-3 flex-row items-center">
        <Image source={require('../assets/profile.jpg')} className="mr-3 h-12 w-12 rounded-full" />
        <View>
          <Text className="text-lg font-bold">{item.name}</Text>
          <Text className="text-sm text-gray-500">{item.title}</Text>
        </View>
      </View>
      <View className="flex-row items-center justify-between">
        <View className="flex-row">
          <TouchableOpacity className="rounded-md bg-blue-600 px-3 py-2">
            <Text className="text-sm font-bold text-white">View Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity className="ml-2 rounded-md bg-blue-600 px-3 py-2">
            <Text className="text-sm font-bold text-white">Connect</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View className="bg-gray-100 p-4">
      <View className="mb-4 flex-row justify-between">
        <TouchableOpacity
          className="rounded-md bg-blue-700 px-4 py-2"
          onPress={() => navigation.navigate('Map')}>
          <Text className="text-base font-semibold text-white">Alumni Map</Text>
        </TouchableOpacity>
      </View>

      <Text className="mb-3 text-lg font-bold">Alumni Recommendations</Text>

      <Text className="mb-3 text-lg font-bold">Based on Location</Text>
      <FlatList
        data={recommendations}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderRecommendationItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 12 }}
      />

      <Text className="mb-3 text-lg font-bold">Based on Interests</Text>
      <FlatList
        data={recommendations}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderRecommendationItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 12 }}
      />

      <Text className="mb-3 text-lg font-bold">Based on Batch</Text>
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
