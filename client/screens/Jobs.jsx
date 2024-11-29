import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';

import { jobsData } from '../constants/jobData';

const JobPortal = ({ navigation }) => {
  const renderJob = ({ item }) => (
    <View className="mb-4 overflow-hidden rounded-xl bg-white shadow-lg">
      <View className="p-4">
        <View className="mb-4 flex-row items-center">
          <Image source={{ uri: item.logo }} className="mr-3 h-12 w-12 rounded-lg" />
          <View>
            <Text className="text-xl font-bold text-gray-900">{item.title}</Text>
            <Text className="text-base text-blue-600">{item.company}</Text>
          </View>
        </View>

        {/* Extended Job Details */}
        <View className="mb-4 space-y-2">
          <Text className="mt-1 text-gray-700">{item.location}</Text>
          <Text className="mt-1 text-gray-600">{item.salary}</Text>
          <Text className="text-blue-600">
            {item.type} • {item.experience}
          </Text>
          <Text className="text-gray-600">Posted on {item.postedDate}</Text>
          <Text className="text-gray-600">
            {item.department} • {item.vacancies} openings
          </Text>
        </View>

        {/* Requirements Section */}
        <View className="mb-4">
          <Text className="mb-2 font-semibold text-gray-700">Requirements:</Text>
          {item.requirements?.map((req, index) => (
            <Text key={index} className="ml-2 text-sm text-gray-600">
              • {req}
            </Text>
          ))}
        </View>

        {/* Benefits Section */}
        <View className="mb-4">
          <Text className="mb-2 font-semibold text-gray-700">Benefits:</Text>
          <View className="flex-row flex-wrap gap-2">
            {item.benefits?.map((benefit, index) => (
              <Text
                key={index}
                className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-800">
                {benefit}
              </Text>
            ))}
          </View>
        </View>

        {/* Skills Section */}
        <View className="mb-4 flex-row flex-wrap gap-2">
          {item.skills.map((skill) => (
            <Text key={skill} className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800">
              {skill}
            </Text>
          ))}
        </View>

        <TouchableOpacity className="rounded-lg bg-blue-600 px-4 py-3">
          <Text className="text-center font-bold text-white">Apply Now</Text>
        </TouchableOpacity>
      </View>
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
