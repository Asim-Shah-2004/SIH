import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';

const jobsData = [
    { id: '1', title: 'Software Engineer', company: 'TechCorp', location: 'Mumbai, India', salary: '₹10,00,000' },
    { id: '2', title: 'Data Scientist', company: 'DataX', location: 'Bangalore, India', salary: '₹12,00,000' },
    { id: '3', title: 'Product Manager', company: 'InnovateCo', location: 'Delhi, India', salary: '₹15,00,000' },
    { id: '4', title: 'UI/UX Designer', company: 'Designify', location: 'Pune, India', salary: '₹8,00,000' },
];

const JobPortal = ({ navigation }) => {
    const renderJob = ({ item }) => (
        <View className="bg-white p-4 mb-4 rounded-lg shadow-md">
            <Text className="text-lg font-bold text-blue-800">{item.title}</Text>
            <Text className="text-blue-600 mt-1">{item.company}</Text>
            <Text className="text-gray-700 mt-1">{item.location}</Text>
            <Text className="text-gray-600 mt-1">{item.salary}</Text>
            <TouchableOpacity className="bg-blue-500 mt-4 py-3 rounded-md">
                <Text className="text-white font-bold text-center">Apply Now</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View className="flex-1 bg-gray-100 p-4">
            <FlatList
                data={jobsData}
                renderItem={renderJob}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </View>
    );
};

export default JobPortal;
