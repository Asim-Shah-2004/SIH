import { FontAwesome } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  useWindowDimensions,
  Platform,
} from 'react-native';

import ConnectModal from '../../utils/ConnectModal';

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
      day: 'numeric',
    });
  };

  const SkillTag = ({ skill }) => (
    <Text
      className={`rounded-xl px-4 py-2 text-sm font-medium ${userSkills.includes(skill)
        ? 'border-blue-200 bg-blue-100 text-blue-800'
        : 'border-gray-200 bg-gray-100 text-gray-700'
        }`}>
      {skill}
      {userSkills.includes(skill) && ' ✓'}
    </Text>
  );

  return (
    <Modal animationType="slide" transparent visible={isVisible} onRequestClose={onClose}>
      <View className="flex-1 bg-black/60">
        <View
          className={`mt-${isSmallScreen ? '4' : '8'} flex-1 rounded-t-[32px] bg-white shadow-2xl`}>
          <ScrollView showsVerticalScrollIndicator={false} className="px-6 pt-6">
            {/* Header */}
            <View className="mb-6 flex-row items-center justify-end">
              <TouchableOpacity onPress={onClose} className="rounded-full bg-gray-100 p-2">
                <FontAwesome name="times" size={isSmallScreen ? 18 : 22} color="#374151" />
              </TouchableOpacity>
            </View>

            {/* Company Info with enhanced styling */}
            <View className="mb-8 flex-row items-start">
              <Image source={{ uri: item.logo }} className="h-20 w-20 " />
              <View className="ml-4 flex-1">
                <Text className="text-2xl font-bold tracking-tight text-gray-900">
                  {item.title}
                </Text>
                <Text className="mt-1 text-lg font-medium text-blue-600">{item.company}</Text>
              </View>
            </View>

            {/* Department, Vacancies & Posted Date */}
            <View className="mb-6 flex-row gap-4">
              <View className="flex-1 rounded-xl bg-purple-50 p-4">
                <Text className="mb-1 text-sm text-purple-600">Department</Text>
                <Text className="font-medium text-purple-900">{item.department}</Text>
              </View>
              <View className="flex-1 rounded-xl bg-orange-50 p-4">
                <Text className="mb-1 text-sm text-orange-600">Posted On</Text>
                <Text className="font-medium text-orange-900">{formatDate(item.postedDate)}</Text>
              </View>
            </View>

            {/* Vacancies */}
            <View className="mb-6 rounded-xl bg-green-50 p-4">
              <Text className="text-center font-medium text-green-700">
                {item.vacancies} {item.vacancies > 1 ? 'Vacancies' : 'Vacancy'}
              </Text>
            </View>

            {/* Description */}
            <View className="mb-8">
              <Text className="mb-3 text-xl font-bold text-gray-900">Description</Text>
              <Text className="leading-relaxed text-gray-600">{item.description}</Text>
            </View>

            {/* Key Details with modern grid */}
            <View className="mb-8 rounded-2xl bg-gray-200 p-4">
              <View className="grid grid-cols-2 gap-4">
                {[
                  { icon: 'map-marker', label: 'Location', value: item.location },
                  { icon: 'money', label: 'Salary', value: item.salary },
                  { icon: 'briefcase', label: 'Experience', value: item.experience },
                  { icon: 'clock-o', label: 'Type', value: item.type },
                ].map((detail, index) => (
                  <View key={index} className="rounded-xl bg-white p-3 shadow-sm">
                    <Text className="mb-1 text-sm text-gray-500">{detail.label}</Text>
                    <Text className="font-semibold">{detail.value}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Posted By Section with enhanced styling */}
            <View className="mb-8 rounded-2xl bg-gray-100 p-4">
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="mb-1 font-medium text-blue-600">Posted By</Text>
                  <Text className="text-xl font-semibold text-gray-900">{item.postedBy?.name}</Text>
                </View>
                <TouchableOpacity
                  className="rounded-full bg-black px-6 py-2.5 shadow-sm"
                  onPress={() => setConnectModalVisible(true)}>
                  <Text className="font-medium text-white">Connect</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Requirements and Benefits with modern styling */}
            {['Requirements', 'Benefits'].map((section) => (
              <View key={section} className="mb-8">
                <Text className="mb-4 text-xl font-bold text-gray-900">{section}</Text>
                <View className={`${section !== 'Requirements' ? 'flex-row flex-wrap gap-3' : ''}`}>
                  {item[section.toLowerCase()]?.map((item, index) =>
                    section === 'Requirements' ? (
                      <View key={index} className="mb-3 flex-row items-center">
                        <View className="mr-3 h-2 w-2 rounded-full bg-blue-600" />
                        <Text className="text-base text-gray-700">{item}</Text>
                      </View>
                    ) : (
                      <Text
                        key={index}
                        className="rounded-xl bg-green-50 px-4 py-2 text-sm font-medium text-green-700">
                        {item}
                      </Text>
                    )
                  )}
                </View>
              </View>
            ))}

            {/* Skills section with modern tags */}
            <View className="mb-8">
              <Text className="mb-4 text-xl font-bold text-gray-900">Required Skills</Text>
              <View className="flex-row flex-wrap gap-3">
                {item.skills?.map((skill) => (
                  <SkillTag key={skill} skill={skill} />
                ))}
              </View>
              <View className="mt-4 rounded-xl bg-gray-50 p-4">
                <Text className="font-medium text-gray-700">
                  Match: {item.skills.filter((skill) => userSkills.includes(skill)).length}/
                  {item.skills.length} skills
                </Text>
              </View>
            </View>

            {/* View JD & Apply Now Buttons Above Additional Info */}
            <View className="mb-6">
              {/* View Job Description Button */}
              <TouchableOpacity
                onPress={handleDownloadPDF}
                className="mb-4 flex-row items-center justify-center rounded-xl bg-blue-400 p-3">
                <FontAwesome name="file-pdf-o" size={20} color="#000" className="mr-2" />
                <Text className="text-lg text-black">View Job Description</Text>
              </TouchableOpacity>

              {/* Apply Now Button */}
              <TouchableOpacity className="rounded-xl bg-black px-6 py-2.5 shadow-sm">
                <Text className="font-semibold text-lg text-white text-center">Apply Now</Text>
              </TouchableOpacity>
            </View>

            {/* Additional Info */}
            <View className="mb-8 rounded-xl bg-gray-50 p-4">
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
