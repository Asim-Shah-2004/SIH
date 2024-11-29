import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';

const eventsData = [
    { id: '1', title: 'Tech Conference 2024', location: 'Mumbai, India', date: '25th December 2024', time: '10:00 AM' },
    { id: '2', title: 'AI & ML Workshop', location: 'Bangalore, India', date: '5th January 2025', time: '02:00 PM' },
    { id: '3', title: 'Product Launch: InnovatePro', location: 'Delhi, India', date: '15th February 2025', time: '11:00 AM' },
    { id: '4', title: 'UX/UI Design Bootcamp', location: 'Pune, India', date: '20th March 2025', time: '09:00 AM' },
];

const EventPortal = () => {
    const renderEvent = ({ item }) => (
        <View className="bg-white p-4 mb-4 rounded-lg shadow-md">
            <Text className="text-blue-900 text-lg font-bold">{item.title}</Text>
            <Text className="text-blue-600 text-sm mt-1">{item.location}</Text>
            <Text className="text-gray-700 text-sm mt-1">{item.date}</Text>
            <Text className="text-gray-600 text-sm mt-1">{item.time}</Text>
            <TouchableOpacity className="bg-blue-600 py-3 px-4 rounded-lg mt-4">
                <Text className="text-white font-bold text-center">Register Now</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View className="flex-1 bg-gray-100 py-5 px-4">
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
