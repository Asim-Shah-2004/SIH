import { SERVER_URL } from '@env';
import axios from 'axios';
import React, { useState, useMemo, useEffect } from 'react';
import { View, FlatList, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { AuthContext } from '../providers/CustomProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import JobCard from '../components/jobs/JobCard';
// import { jobsData } from '../constants/jobs/jobData';
import { DEFAULT_ALUMNI_DATA as profileData } from '../constants/profileData';

const JobPortal = ({ navigation }) => {
  const [skills, setSkills] = useState(profileData.skills);
  const [jobsData, setJobsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = React.useContext(AuthContext);

  useEffect(() => {
    console.log(user)
    const fetchJobs = async () => {
      try {
        const token = await AsyncStorage.getItem('token');

        if (!token) {
          throw new Error('Token not found');
        }

        setLoading(true);
        const response = await axios.get(`${SERVER_URL}/jobs`, {
          headers: {
            Authorization: `Bearer ${token}`, // Add the token here
          },
        }); // Use this if testing on physical device
        setJobsData(response.data); // Assuming the backend returns an array of jobs
        setLoading(false);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const sortedJobs = useMemo(() => {
    return [...jobsData].sort((a, b) => {
      const aMatches = a.skills.filter((skill) => skills.includes(skill)).length;
      const bMatches = b.skills.filter((skill) => skills.includes(skill)).length;
      return bMatches - aMatches;
    });
  }, [jobsData, skills]);

  const renderJob = ({ item }) => <JobCard item={item} userSkills={skills} />;

  const openPostJobPage = () => {
    // For now, just log to simulate the action of opening a new page
    console.log('Open a new page to post a job');
    navigation.navigate('NewJob');
  };
  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-4 text-gray-600">Loading jobs...</Text>
      </View>
    );
  }

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
