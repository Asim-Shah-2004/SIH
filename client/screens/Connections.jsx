import React from 'react';
import { View, Text, FlatList, TouchableOpacity, ScrollView } from 'react-native';

import { alumniRecommendations } from '../constants/alumni/alumniRecommendations';
import UserCard from '../utils/UserCard'; // Importing the UserCard component

const AlumniRecommendations = ({ navigation }) => {
  // Render the alumni recommendations using the UserCard component
  const renderRecommendationItem = ({ item }) => (
    <UserCard
      user={item}
      onConnect={() => {
        console.log(`Connecting with ${item.name}`);
        // Handle the connect logic here (send invitation, etc.)
      }}
      onViewProfile={() => navigation.navigate('Profile')} // Navigate to the user's profile
    />
  );

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 16 }} className="bg-gray-100 p-4">
      {/* Alumni Map Button */}
      <View className="flex-row justify-evenly">
        <View className="mb-4 flex-row justify-between">
          <TouchableOpacity
            className="rounded-md bg-blue-700 px-4 py-2"
            onPress={() => navigation.navigate('Map')}>
            <Text className="text-base font-semibold text-white">Alumni Map</Text>
          </TouchableOpacity>
        </View>
        <View className="mb-4 flex-row justify-between">
          <TouchableOpacity
            className="rounded-md bg-blue-700 px-4 py-2"
            onPress={() => navigation.navigate('Directory')}>
            <Text className="text-base font-semibold text-white">Alumni Directory</Text>
          </TouchableOpacity>
        </View>
        <View className="mb-4 flex-row justify-between">
          <TouchableOpacity
            className="rounded-md bg-blue-700 px-4 py-2"
            onPress={() => navigation.navigate('All')}>
            <Text className="text-base font-semibold text-white">All</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Alumni Recommendations based on different categories */}
      <Text className="mb-3 text-lg font-bold">Alumni Recommendations</Text>

      <Text className="mb-3 text-lg font-bold">Based on Location</Text>
      <FlatList
        data={alumniRecommendations}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderRecommendationItem} // Using the UserCard component here
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 12 }}
        ItemSeparatorComponent={() => <View style={{ width: 15 }} />} // Spacing between cards
      />

      <Text className="mb-3 text-lg font-bold">Based on Interests</Text>
      <FlatList
        data={alumniRecommendations}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderRecommendationItem} // Using the UserCard component here
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 12 }}
        ItemSeparatorComponent={() => <View style={{ width: 12 }} />} // Spacing between cards
      />

      <Text className="mb-3 text-lg font-bold">Based on Batch</Text>
      <FlatList
        data={alumniRecommendations}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderRecommendationItem} // Using the UserCard component here
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 12 }}
        ItemSeparatorComponent={() => <View style={{ width: 12 }} />} // Spacing between cards
      />
    </ScrollView>
  );
};

export default AlumniRecommendations;
