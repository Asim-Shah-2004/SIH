import React, { useState, useMemo } from 'react';
import { View, FlatList, TouchableOpacity, Text } from 'react-native';
import { DEFAULT_ALUMNI_DATA as profileData } from '../constants/profileData';

import JobCard from '../components/JobCard';
import { jobsData } from '../constants/jobs/jobData';

const JobPortal = ({ navigation }) => {
  const [skills, setSkills] = useState(profileData.skills);
  
  const sortedJobs = useMemo(() => {
    return [...jobsData].sort((a, b) => {
      const aMatches = a.skills.filter(skill => skills.includes(skill)).length;
      const bMatches = b.skills.filter(skill => skills.includes(skill)).length;
      return bMatches - aMatches;
    });
  }, [jobsData, skills]);

  const renderJob = ({ item }) => (
    <JobCard 
      item={item} 
      userSkills={skills}
    />
  );

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
        data={sortedJobs}
        renderItem={renderJob}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
};

export default JobPortal;
