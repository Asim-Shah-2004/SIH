import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, ScrollView, Image } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SERVER_URL } from '@env';

const ProfileScreen = ({ route }) => {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const id = route.params._id;
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('Token not found');
      }
      try {
        const response = await axios.get(`${SERVER_URL}/users/fetch/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('User data:', response.data);
        setUser(response.data);
      } catch (error) {
        console.log('Error fetching user data:', error);
        setError("Couldn't fetch user data");
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const Section = ({ title, children }) => (
    <View className="mb-4 rounded-xl bg-white p-4 shadow-md">
      <Text className="mb-3 text-xl font-semibold text-gray-800">{title}</Text>
      {children}
    </View>
  );

  const InfoItem = ({ icon, text }) => (
    <View className="mb-2 flex-row items-center">
      <Ionicons name={icon} size={20} color="#666" className="mr-2" />
      <Text className="ml-2 text-gray-700">{text}</Text>
    </View>
  );

  if (loading) {
    return <Text>Loading</Text>;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    user && (
      <ScrollView className="flex-1 bg-gray-100">
        {/* Cover Photo */}
        <View className="h-40 bg-blue-500" />

        {/* Profile Header */}
        <View className="-mt-20 px-4">
          <View className="rounded-xl bg-white p-4 shadow-lg">
            <View className="-mt-24 items-center">
              {user.profilePhoto && (
                <Image
                  source={{ uri: `${user.profilePhoto}` }}
                  className="mb-2 h-32 w-32 rounded-full border-4 border-white shadow-lg"
                />
              )}
              <Text className="mt-2 text-2xl font-bold text-gray-900">{user.fullName}</Text>
              <Text className="mt-1 px-4 text-center text-gray-600">{user.bio}</Text>
            </View>

            {/* Quick Info */}
            <View className="mt-4 flex-row justify-around border-t border-gray-200 pt-4">
              <InfoItem icon="mail-outline" text={user.email} />
              <InfoItem icon="call-outline" text={user.phone} />
            </View>
          </View>
        </View>

        {/* Main Content */}
        <View className="mt-4 px-4">
          {/* Education */}
          <Section title="Education">
            {user.education.map((edu, index) => (
              <View key={index} className="mb-3 border-b border-gray-100 pb-3">
                <Text className="text-lg font-bold text-gray-800">{edu.degree}</Text>
                <Text className="text-gray-600">{edu.institution}</Text>
                <Text className="text-sm text-gray-500">Class of {edu.yearOfGraduation}</Text>
              </View>
            ))}
          </Section>

          {/* Skills */}
          <Section title="Skills">
            <View className="-m-1 flex-row flex-wrap">
              {user.skills.map((skill, index) => (
                <View key={index} className="m-1 rounded-full bg-blue-100 px-4 py-2">
                  <Text className="text-blue-800">{skill}</Text>
                </View>
              ))}
            </View>
          </Section>

          {/* Languages */}
          <Section title="Languages">
            <View className="-m-1 flex-row flex-wrap">
              {user.languages.map((language, index) => (
                <View key={index} className="m-1 rounded-full bg-green-100 px-4 py-2">
                  <Text className="text-green-800">{language}</Text>
                </View>
              ))}
            </View>
          </Section>

          {/* Interests */}
          <Section title="Interests">
            <View className="-m-1 flex-row flex-wrap">
              {user.interests.map((interest, index) => (
                <View key={index} className="m-1 rounded-full bg-purple-100 px-4 py-2">
                  <Text className="text-purple-800">{interest}</Text>
                </View>
              ))}
            </View>
          </Section>

          {/* Work Experience */}
          {user.workExperience.length > 0 && (
            <Section title="Work Experience">
              {user.workExperience.map((work, index) => (
                <View key={index} className="mb-3 border-b border-gray-100 pb-3">
                  <Text className="text-gray-800">{work}</Text>
                </View>
              ))}
            </Section>
          )}
        </View>

        {/* Bottom Padding */}
        <View className="h-10" />
      </ScrollView>
    ));
};

export default ProfileScreen;
