import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ScrollView } from 'react-native';

import { eventsData } from '../constants/eventData';

const EventPortal = () => {
  const renderEvent = ({ item }) => (
    <View className="mb-4 overflow-hidden rounded-xl bg-white shadow-lg">
      <Image source={{ uri: item.image }} className="h-40 w-full" />
      <View className="p-4">
        <View className="mb-2 flex-row items-center justify-between">
          <Text className="text-sm font-semibold text-blue-600">{item.type}</Text>
          <Text className="text-sm text-green-600">{item.price}</Text>
        </View>
        <Text className="mb-1 text-xl font-bold text-gray-900">{item.title}</Text>
        <Text className="mb-3 text-sm text-gray-600">{item.description}</Text>

        {/* Location and Time Info */}
        <View className="mb-4 space-y-2">
          <Text className="mt-1 text-sm text-blue-600">{item.location}</Text>
          <Text className="mt-1 text-sm text-gray-700">{item.date}</Text>
          <Text className="mt-1 text-sm text-gray-600">{item.time}</Text>
        </View>

        {/* Speakers Section */}
        {item.speakers && (
          <View className="mb-4">
            <Text className="mb-2 font-semibold text-gray-700">Featured Speakers:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {item.speakers.map((speaker, index) => (
                <View key={index} className="mr-4">
                  <Image source={{ uri: speaker.image }} className="h-16 w-16 rounded-full" />
                  <Text className="mt-1 text-center font-semibold">{speaker.name}</Text>
                  <Text className="text-center text-xs text-gray-600">{speaker.role}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Agenda Preview */}
        {item.agenda && (
          <View className="mb-4">
            <Text className="mb-2 font-semibold text-gray-700">Agenda Highlights:</Text>
            {item.agenda.slice(0, 2).map((slot, index) => (
              <View key={index} className="mb-1 flex-row">
                <Text className="text-blue-600">{slot.time}</Text>
                <Text className="ml-2 text-gray-600">- {slot.title}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Event Status */}
        <View className="mb-4 flex-row items-center justify-between">
          <Text className="text-sm text-gray-600">
            {item.registeredCount}/{item.maxCapacity} registered
          </Text>
          <View className="flex-row">
            {item.sponsors.slice(0, 2).map((sponsor, index) => (
              <Text key={index} className="text-xs text-blue-600">
                {sponsor}
                {index < Math.min(2, item.sponsors.length - 1) ? ', ' : ''}
              </Text>
            ))}
          </View>
        </View>

        <TouchableOpacity className="rounded-lg bg-blue-600 px-4 py-3">
          <Text className="text-center font-bold text-white">Register Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-100 px-4 py-5">
      <FlatList
        data={eventsData}
        renderItem={renderEvent}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

export default EventPortal;
