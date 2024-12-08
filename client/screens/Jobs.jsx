import { SERVER_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useState, useMemo, useEffect } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';

import JobCard from '../components/jobs/JobCard';
import { DEFAULT_ALUMNI_DATA as profileData } from '../constants/profileData';

const JobPortal = ({ navigation }) => {
  const [skills, setSkills] = useState(profileData.skills);
  const [jobsData, setJobsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); // State to track refreshing

  // Fetch jobs function
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
      });
      setJobsData(response.data); // Assuming the backend returns an array of jobs
      setLoading(false);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setLoading(false);
    }
  };

  // Call fetchJobs on mount
  useEffect(() => {
    fetchJobs();
  }, []);

  // Pull to refresh handler
  const onRefresh = () => {
    setRefreshing(true);
    fetchJobs().finally(() => setRefreshing(false)); // Reset refreshing state after fetching
  };

  const sortedJobs = useMemo(() => {
    return [...jobsData].sort((a, b) => {
      const aMatches = a.skills.filter((skill) => skills.includes(skill)).length;
      const bMatches = b.skills.filter((skill) => skills.includes(skill)).length;
      return bMatches - aMatches;
    });
  }, [jobsData, skills]);

  const renderJob = ({ item }) => <JobCard item={item} userSkills={skills} />;

  const openPostJobPage = () => {
    console.log('Open a new page to post a job');
    navigation.navigate('NewJob');
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100">
        <ActivityIndicator size="large" color="#000" />
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

      {/* FlatList with Pull to Refresh */}
      <FlatList
        data={sortedJobs}
        renderItem={renderJob}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing} // Display refresh spinner when refreshing
            onRefresh={onRefresh} // Trigger onRefresh handler when user pulls to refresh
          />
        }
      />
    </View>
  );
};

export default JobPortal;
