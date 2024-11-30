import { FontAwesome } from '@expo/vector-icons';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, useWindowDimensions } from 'react-native';
import JobDetailsModal from './JobDetailsModal';   

const JobCard = ({ item, userSkills }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const { width: screenWidth } = useWindowDimensions();
    const isSmallScreen = screenWidth < 380;
    
    const matchingSkills = item.skills.filter(skill => userSkills.includes(skill));
    const matchPercentage = Math.round((matchingSkills.length / item.skills.length) * 100);

    return (
        <>
            <TouchableOpacity 
                onPress={() => setModalVisible(true)}
                className={`mb-3 overflow-hidden rounded-xl bg-white shadow-lg border-2 ${
                    matchingSkills.length === item.skills.length ? 'border-green-500' : 'border-black'
                }`}
            >
                <View className={`${isSmallScreen ? 'p-3' : 'p-5'}`}>
                    {/* Job Header Section */}
                    <View className="mb-3 flex-row items-center">
                        <Image 
                            source={{ uri: item.logo }} 
                            className={`mr-3 ${isSmallScreen ? 'h-12 w-12' : 'h-14 w-14'} rounded-lg`} 
                        />
                        <View>
                            <Text className={`${isSmallScreen ? 'text-xl' : 'text-2xl'} font-bold text-gray-900`}>
                                {item.title}
                            </Text>
                            <Text className={`${isSmallScreen ? 'text-sm' : 'text-base'} text-blue-600`}>
                                {item.company}
                            </Text>
                        </View>
                    </View>

                    {/* Add match badge */}
                    <View className="mt-2 bg-green-50 self-end px-2 py-1 rounded-lg">
                        <Text className="text-xs font-bold text-green-700">
                            {matchingSkills.length}/{item.skills.length} skills matched ({matchPercentage}%)
                        </Text>
                    </View>

                    {/* Preview Info */}
                    <View className="space-y-1">
                        <Text className={`${isSmallScreen ? 'text-sm' : 'text-sm'} text-gray-700`}>
                            {item.location}
                        </Text>
                        <Text className={`${isSmallScreen ? 'text-sm' : 'text-sm'} text-gray-700`}>
                            {item.salary}
                        </Text>
                        <Text className={`${isSmallScreen ? 'text-sm' : 'text-sm'} text-blue-600`}>
                            {item.type} • {item.experience}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>

            <JobDetailsModal 
                isVisible={modalVisible}
                onClose={() => setModalVisible(false)}
                item={item}
                userSkills={userSkills}
            />
        </>
    );
};

export default JobCard;
