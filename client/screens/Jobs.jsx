import React, { useState } from 'react';
import { View, FlatList, TouchableOpacity, Text } from 'react-native';

import JobCard from '../components/JobCard';
import { jobsData } from '../constants/jobs/jobData';

const JobPortal = ({ navigation }) => {
  const renderJob = ({ item }) => <JobCard item={item} />;

  const openPostJobPage = () => {
    // For now, just log to simulate the action of opening a new page
    console.log('Open a new page to post a job');
    navigation.navigate('NewJob');
  };

  return (
    <View className="flex-1 bg-gray-100">
      {/* Button to Post a New Job */}
      <TouchableOpacity
        onPress={openPostJobPage}
        className="mx-4 my-4 rounded-lg bg-blue-600 px-5 py-3">
        <Text className="text-center font-bold text-white">Post a New Job</Text>
      </TouchableOpacity>

      <FlatList
        data={jobsData}
        renderItem={renderJob}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
};

export default JobPortal;
