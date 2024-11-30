import React from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, Image, useWindowDimensions, Platform } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import ConnectModal from '../utils/ConnectModal';
import * as WebBrowser from 'expo-web-browser';

const JobDetailsModal = ({ isVisible, onClose, item, userSkills }) => {
  const [connectModalVisible, setConnectModalVisible] = React.useState(false);
  const { width: screenWidth } = useWindowDimensions();

  const isSmallScreen = screenWidth < 380;

  const handleDownloadPDF = async () => {
    try {
      await WebBrowser.openBrowserAsync(item.jdPdf);
    } catch (error) {
      console.error('Error opening PDF:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const SkillTag = ({ skill }) => (
    <Text 
      className={`px-4 py-2 rounded-xl text-sm font-medium ${
        userSkills.includes(skill)
          ? 'bg-blue-100 text-blue-800 border-blue-200'
          : 'bg-gray-100 text-gray-700 border-gray-200'
      }`}
    >
      {skill}
      {userSkills.includes(skill) && ' ✓'}
    </Text>
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/60">
        <View className={`mt-${isSmallScreen ? '4' : '8'} flex-1 rounded-t-[32px] bg-white shadow-2xl`}>
          <ScrollView 
            showsVerticalScrollIndicator={false}
            className="px-6 pt-6"
          >
            {/* Header */}
            <View className="flex-row justify-between items-center mb-6">
              <TouchableOpacity onPress={onClose} className="p-2 bg-gray-100 rounded-full">
                <FontAwesome name="times" size={isSmallScreen ? 18 : 22} color="#374151" />
              </TouchableOpacity>
              <TouchableOpacity className="rounded-full bg-black px-6 py-2.5 shadow-sm">
                <Text className="text-white font-semibold">Apply Now</Text>
              </TouchableOpacity>
            </View>

            {/* Quick Actions */}
            <View className="flex-row gap-3 mb-6">
              <TouchableOpacity 
                onPress={handleDownloadPDF}
                className="flex-1 flex-row items-center justify-center bg-blue-50 p-3 rounded-xl"
              >
                <FontAwesome name="file-pdf-o" size={20} color="#000" className="mr-2" />
                <Text className="text-black font-medium">View JD</Text>
              </TouchableOpacity>
              <View className="flex-1 bg-green-50 p-3 rounded-xl">
                <Text className="text-center text-green-700 font-medium">
                  {item.vacancies} {item.vacancies > 1 ? 'Vacancies' : 'Vacancy'}
                </Text>
              </View>
            </View>

            {/* Company Info with enhanced styling */}
            <View className="flex-row items-start mb-8">
              <Image 
                source={{ uri: item.logo }} 
                className="w-20 h-20 " 
              />
              <View className="ml-4 flex-1">
                <Text className="text-2xl font-bold text-gray-900 tracking-tight">
                  {item.title}
                </Text>
                <Text className="text-lg font-medium text-blue-600 mt-1">
                  {item.company}
                </Text>
              </View>
            </View>

            {/* Department & Posted Date */}
            <View className="flex-row gap-4 mb-6">
              <View className="flex-1 bg-purple-50 p-4 rounded-xl">
                <Text className="text-purple-600 text-sm mb-1">Department</Text>
                <Text className="text-purple-900 font-medium">{item.department}</Text>
              </View>
              <View className="flex-1 bg-orange-50 p-4 rounded-xl">
                <Text className="text-orange-600 text-sm mb-1">Posted On</Text>
                <Text className="text-orange-900 font-medium">{formatDate(item.postedDate)}</Text>
              </View>
            </View>

            {/* Description */}
            <View className="mb-8">
              <Text className="text-xl font-bold text-gray-900 mb-3">Description</Text>
              <Text className="text-gray-600 leading-relaxed">
                {item.description}
              </Text>
            </View>

            {/* Key Details with modern grid */}
            <View className="bg-gray-200 p-4 rounded-2xl mb-8">
              <View className="grid grid-cols-2 gap-4">
                {[
                  { icon: 'map-marker', label: 'Location', value: item.location },
                  { icon: 'money', label: 'Salary', value: item.salary },
                  { icon: 'briefcase', label: 'Experience', value: item.experience },
                  { icon: 'clock-o', label: 'Type', value: item.type }
                ].map((detail, index) => (
                  <View key={index} className="p-3 bg-white rounded-xl shadow-sm">
                    <Text className="text-gray-500 text-sm mb-1">{detail.label}</Text>
                    <Text className="font-semibold">{detail.value}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Posted By Section with enhanced styling */}
            <View className="bg-gray-100 p-4 rounded-2xl mb-8">
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-blue-600 font-medium mb-1">Posted By</Text>
                  <Text className="text-xl font-semibold text-gray-900">
                    {item.postedBy?.name}
                  </Text>
                </View>
                <TouchableOpacity 
                  className="bg-black px-6 py-2.5 rounded-full shadow-sm"
                  onPress={() => setConnectModalVisible(true)}
                >
                  <Text className="text-white font-medium">Connect</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Requirements and Benefits with modern styling */}
            {['Requirements', 'Benefits'].map((section) => (
              <View key={section} className="mb-8">
                <Text className="text-xl font-bold text-gray-900 mb-4">
                  {section}
                </Text>
                <View className={`${section !== 'Requirements' ? 'flex-row flex-wrap gap-3' : ''}`}>
                  {item[section.toLowerCase()]?.map((item, index) => (
                    section === 'Requirements' ? (
                      <View key={index} className="flex-row items-center mb-3">
                        <View className="w-2 h-2 bg-blue-600 rounded-full mr-3" />
                        <Text className="text-gray-700 text-base">{item}</Text>
                      </View>
                    ) : (
                      <Text 
                        key={index} 
                        className="bg-green-50 text-green-700 px-4 py-2 rounded-xl text-sm font-medium"
                      >
                        {item}
                      </Text>
                    )
                  ))}
                </View>
              </View>
            ))}

            {/* Skills section with modern tags */}
            <View className="mb-8">
              <Text className="text-xl font-bold text-gray-900 mb-4">Required Skills</Text>
              <View className="flex-row flex-wrap gap-3">
                {item.skills?.map((skill) => (
                  <SkillTag key={skill} skill={skill} />
                ))}
              </View>
              <View className="mt-4 p-4 bg-gray-50 rounded-xl">
                <Text className="text-gray-700 font-medium">
                  Match: {item.skills.filter(skill => userSkills.includes(skill)).length}/{item.skills.length} skills
                </Text>
              </View>
            </View>

            {/* Additional Info */}
            <View className="mb-8 bg-gray-50 p-4 rounded-xl">
              <Text className="text-sm text-gray-500">
                This position was posted on {formatDate(item.postedDate)}. 
                {item.vacancies > 1 
                  ? ` There are currently ${item.vacancies} open positions.`
                  : ' There is currently 1 open position.'}
              </Text>
            </View>
          </ScrollView>
        </View>
        <ConnectModal
          isVisible={connectModalVisible}
          closeModal={() => setConnectModalVisible(false)}
          item={item}
        />
      </View>
    </Modal>
  );
};

export default JobDetailsModal;