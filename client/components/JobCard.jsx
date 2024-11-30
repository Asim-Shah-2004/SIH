import { FontAwesome } from '@expo/vector-icons';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';

import ConnectModal from '../utils/ConnectModal';
import { downloadPdf } from '../utils/downloadPDF';

const JobCard = ({ item }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);

  const handleModalClose = () => {
    setModalVisible(false);
  };

  return (
    <View className="mb-6 overflow-hidden rounded-xl bg-white shadow-lg">
      <View className="p-5">
        {/* Job Header Section */}
        <View className="mb-4 flex-row items-center">
          <Image source={{ uri: item.logo }} className="mr-4 h-14 w-14 rounded-lg" />
          <View>
            <Text className="text-2xl font-bold text-gray-900">{item.title}</Text>
            <Text className="text-base text-blue-600">{item.company}</Text>
          </View>
        </View>

        {/* Collapsed View */}
        {!isExpanded && (
          <View className="mb-6 space-y-2">
            <Text className="text-sm text-gray-700">{item.location}</Text>
            <Text className="text-sm text-gray-700">{item.salary}</Text>
            <Text className="text-sm text-blue-600">
              {item.type} • {item.experience}
            </Text>
            <TouchableOpacity
              onPress={() => setIsExpanded(true)}
              style={{ position: 'absolute', bottom: 10, right: 10 }}
              className="rounded-lg bg-blue-600 px-3 py-2">
              <Text className="text-center font-bold text-white">View More</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Expanded View */}
        {isExpanded && (
          <>
            <View className="mb-6 space-y-2">
              <Text className="text-sm text-gray-700">{item.location}</Text>
              <Text className="text-sm text-gray-700">{item.salary}</Text>
              <Text className="text-sm text-blue-600">
                {item.type} • {item.experience}
              </Text>
              <Text className="text-sm text-gray-600">Posted on {item.postedDate}</Text>
              <Text className="text-sm text-gray-600">
                {item.department} • {item.vacancies} opening(s)
              </Text>
            </View>

            {/* Posted By Section */}
            <View className="mb-6 flex-row items-center gap-4">
              <Text className="text-md font-medium text-gray-700">
                Posted By: <Text className="text-blue-600">{item.postedBy?.name}</Text>
              </Text>
              <TouchableOpacity
                className="rounded-md bg-blue-500 px-4 py-2"
                onPress={() => setModalVisible(true)}>
                <Text className="text-white">Connect</Text>
              </TouchableOpacity>
              {/* Modal Component */}
              <ConnectModal
                isVisible={modalVisible} // Pass the visibility state
                closeModal={handleModalClose} // Function to close the modal
                item={item} // Pass the user data to the modal
              />
            </View>

            {/* Requirements Section */}
            {item.requirements?.length > 0 && (
              <View className="mb-6">
                <Text className="mb-2 text-base font-semibold text-gray-800">Requirements:</Text>
                {item.requirements.map((req, index) => (
                  <Text key={index} className="ml-2 text-sm text-gray-600">
                    • {req}
                  </Text>
                ))}
              </View>
            )}

            {/* Benefits Section */}
            {item.benefits?.length > 0 && (
              <View className="mb-6">
                <Text className="mb-2 text-base font-semibold text-gray-800">Benefits:</Text>
                <View className="flex-row flex-wrap gap-2">
                  {item.benefits.map((benefit, index) => (
                    <Text
                      key={index}
                      className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-800">
                      {benefit}
                    </Text>
                  ))}
                </View>
              </View>
            )}

            {/* Skills Section */}
            <View className="mb-6">
              <Text className="mb-2 text-base font-semibold text-gray-800">Skills:</Text>
              <View className="flex-row flex-wrap gap-2">
                {item.skills.map((skill) => (
                  <Text
                    key={skill}
                    className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800">
                    {skill}
                  </Text>
                ))}
              </View>
            </View>

            {/* JD PDF Section */}
            {item.jdPdf && (
              <TouchableOpacity
                onPress={() => downloadPdf(item.jdPdf, `${item.title}_Job_Description.pdf`)}
                className="mb-6 flex-row items-center rounded-lg bg-gray-300 px-5 py-3">
                <FontAwesome name="file-pdf-o" size={24} color="gray" className="mr-2" />
                <Text className="font-bold text-gray-800">Download Job Description</Text>
              </TouchableOpacity>
            )}

            {/* Apply Button */}
            <TouchableOpacity className="mb-4 rounded-lg bg-blue-600 px-5 py-3">
              <Text className="text-center font-bold text-white">Apply Now</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setIsExpanded(false)}
              className="flex items-center py-2">
              <FontAwesome name="caret-up" size={30} color="blue" />
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

export default JobCard;
