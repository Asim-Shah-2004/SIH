import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';

const jobsData = [
  {
    id: '1',
    title: 'Software Engineer',
    company: 'TechCorp',
    location: 'Mumbai, India',
    salary: '₹10,00,000',
  },
  {
    id: '2',
    title: 'Data Scientist',
    company: 'DataX',
    location: 'Bangalore, India',
    salary: '₹12,00,000',
  },
  {
    id: '3',
    title: 'Product Manager',
    company: 'InnovateCo',
    location: 'Delhi, India',
    salary: '₹15,00,000',
  },
  {
    id: '4',
    title: 'UI/UX Designer',
    company: 'Designify',
    location: 'Pune, India',
    salary: '₹8,00,000',
  },
];

const JobPortal = ({ navigation }) => {
  const renderJob = ({ item }) => (
    <View className="mb-4 rounded-lg bg-white p-4 shadow-md">
      <Text className="text-lg font-bold text-blue-800">{item.title}</Text>
      <Text className="mt-1 text-blue-600">{item.company}</Text>
      <Text className="mt-1 text-gray-700">{item.location}</Text>
      <Text className="mt-1 text-gray-600">{item.salary}</Text>
      <TouchableOpacity className="mt-4 rounded-md bg-blue-500 py-3">
        <Text className="text-center font-bold text-white">Apply Now</Text>
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
