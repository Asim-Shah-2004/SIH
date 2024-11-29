import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';

import { alumniRecommendations } from '../constants/alumniData';

const AlumniRecommendations = ({ navigation }) => {
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
        data={alumniRecommendations}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderRecommendationItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 12 }}
      />

      <Text className="mb-3 text-lg font-bold">Based on Interests</Text>
      <FlatList
        data={alumniRecommendations}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderRecommendationItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 12 }}
      />

      <Text className="mb-3 text-lg font-bold">Based on Batch</Text>
      <FlatList
        data={alumniRecommendations}
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
