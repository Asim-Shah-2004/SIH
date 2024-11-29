import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';

const eventsData = [
  {
    id: '1',
    title: 'Tech Conference 2024',
    location: 'Mumbai, India',
    date: '25th December 2024',
    time: '10:00 AM',
  },
  {
    id: '2',
    title: 'AI & ML Workshop',
    location: 'Bangalore, India',
    date: '5th January 2025',
    time: '02:00 PM',
  },
  {
    id: '3',
    title: 'Product Launch: InnovatePro',
    location: 'Delhi, India',
    date: '15th February 2025',
    time: '11:00 AM',
  },
  {
    id: '4',
    title: 'UX/UI Design Bootcamp',
    location: 'Pune, India',
    date: '20th March 2025',
    time: '09:00 AM',
  },
];

const EventPortal = () => {
  const renderEvent = ({ item }) => (
    <View className="mb-4 rounded-lg bg-white p-4 shadow-md">
      <Text className="text-lg font-bold text-blue-900">{item.title}</Text>
      <Text className="mt-1 text-sm text-blue-600">{item.location}</Text>
      <Text className="mt-1 text-sm text-gray-700">{item.date}</Text>
      <Text className="mt-1 text-sm text-gray-600">{item.time}</Text>
      <TouchableOpacity className="mt-4 rounded-lg bg-blue-600 px-4 py-3">
        <Text className="text-center font-bold text-white">Register Now</Text>
      </TouchableOpacity>
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
