import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, Modal, ScrollView } from 'react-native';
import { jobsData } from '../constants/jobData';
import { DEFAULT_ALUMNI_DATA } from '../constants/profileData';

const JobPortal = ({ navigation }) => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [skills, setSkills] = useState(DEFAULT_ALUMNI_DATA.skills);
  
  const sortedJobs = useMemo(() => {
    return [...jobsData].sort((a, b) => {
      const aMatches = a.skills.filter(skill => skills.includes(skill)).length;
      const bMatches = b.skills.filter(skill => skills.includes(skill)).length;
      const aMatchPercentage = aMatches / a.skills.length;
      const bMatchPercentage = bMatches / b.skills.length;
      return bMatchPercentage - aMatchPercentage;
    });
  }, [jobsData, skills]);

  const MatchBadge = ({ matchCount, totalCount }) => {
    const percentage = (matchCount / totalCount) * 100;
    const opacity = (percentage / 100) * 0.3;
    
    return (
      <View style={{ backgroundColor: `rgba(34, 197, 94, ${opacity})` }}
            className="px-2 py-1 rounded-lg">
        <Text className="text-xs font-bold text-green-700">
          {Math.round(percentage)}% match
        </Text>
      </View>
    );
  };

  const SkillTag = ({ skill, isMatched }) => (
    <Text 
      className={`px-3 py-1 rounded-full border ${
        isMatched 
          ? 'border-green-600 bg-green-50 text-green-700' 
          : 'border-black text-black'
      }`}
    >
      {skill}
      {isMatched && ' ✓'}
    </Text>
  );

  const JobDetailModal = ({ job, visible, onClose }) => (
    <Modal
      animationType="fade"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-center">
        <View className="m-4 bg-white p-4 py-5 rounded-2xl border-2 border-black">
          <ScrollView 
            className="max-h-[80vh]"
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View className="mb-6 flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-2xl font-bold text-black">{job?.title}</Text>
                <Text className="text-lg text-gray-700">{job?.company}</Text>
              </View>
              <Image source={{ uri: job?.logo }} className="h-16 w-16 rounded-lg p-2" />
            </View>

            {/* Details */}
            <View className="space-y-4">
              {/* Location and Salary */}
              <View className="border-b border-gray-200 pb-4">
                <Text className="text-base text-black">{job?.location}</Text>
                <Text className="text-base font-bold text-black">{job?.salary}</Text>
              </View>

              {/* Requirements */}
              <View className="border-b border-gray-200 pb-4">
                <Text className="text-lg font-bold mb-2">Requirements</Text>
                {job?.requirements?.map((req, index) => (
                  <Text key={index} className="text-base text-gray-800 ml-2">• {req}</Text>
                ))}
              </View>

              {/* Benefits */}
              <View className="border-b border-gray-200 pb-4">
                <Text className="text-lg font-bold mb-2">Benefits</Text>
                <View className="flex-row flex-wrap gap-2">
                  {job?.benefits?.map((benefit, index) => (
                    <Text key={index} className="border border-black rounded-full px-3 py-1">
                      {benefit}
                    </Text>
                  ))}
                </View>
              </View>

              {/* Skills */}
              <View className="pb-4">
                <Text className="text-lg font-bold mb-2">Required Skills</Text>
                <View className="flex-row flex-wrap gap-2">
                  {job?.skills?.map((skill) => (
                    <SkillTag
                      key={skill}
                      skill={skill}
                      isMatched={skills.includes(skill)}
                    />
                  ))}
                </View>
                {job?.skills && (
                  <View className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <Text className="text-sm text-gray-600">
                      You match {job.skills.filter(skill => skills.includes(skill)).length} out of {job.skills.length} required skills
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {/* Buttons */}
            <View className="flex-row gap-4 mt-1">
              <TouchableOpacity 
                className="flex-1 bg-black py-3 rounded-xl"
                onPress={() => {/* Handle apply */}}>
                <Text className="text-white text-center font-bold">Apply Now</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                className="flex-1 border-2 border-black py-3 rounded-xl"
                onPress={onClose}>
                <Text className="text-black text-center font-bold">Close</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  const renderJob = ({ item }) => {
    const matchingSkills = item.skills.filter(skill => skills.includes(skill));
    
    return (
      <TouchableOpacity 
        className={`mb-4 border-2 rounded-xl bg-white ${
          matchingSkills.length === item.skills.length 
            ? 'border-green-500' 
            : 'border-black'
        }`}
        onPress={() => {
          setSelectedJob(item);
          setModalVisible(true);
        }}>
        <View className="p-4">
          <View className="flex-row justify-between items-center">
            <View className="flex-1">
              <Text className="text-xl font-bold text-black">{item.title}</Text>
              <Text className="text-base text-gray-600">{item.company}</Text>
              <Text className="text-sm text-gray-500 mt-1">{item.location}</Text>
            </View>
            <View className="items-end space-y-2">
              <Image source={{ uri: item.logo }} className="h-14 w-14 rounded-lg mb-4" />
              <MatchBadge 
                matchCount={matchingSkills.length}
                totalCount={item.skills.length}
              />
            </View>
          </View>
          
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      <FlatList
        data={sortedJobs}
        renderItem={renderJob}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
      />
      <JobDetailModal 
        job={selectedJob}
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setSelectedJob(null);
        }}
      />
    </View>
  );
};

export default JobPortal;
