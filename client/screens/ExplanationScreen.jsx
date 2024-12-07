import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, useWindowDimensions, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Button from '../components/general/Button';

const ProcessStep = ({ icon, title, description, isLast = false }) => (
  <View className="relative flex-row items-start space-x-2">
    <View className="z-10 rounded-full bg-white p-2 shadow-sm">
      <MaterialIcons name={icon} size={25} color="#909" />
    </View>
    {!isLast && (
      <View className="absolute left-4 top-10 h-full w-0.5 bg-gray-100" />
    )}
    <View className="flex-1 pb-4">
      <Text className="text-base font-bold text-gray-900">{title}</Text>
      <Text className="mt-1 text-sm leading-relaxed text-gray-600">
        {description}
      </Text>
    </View>
  </View>
);

const ExplanationScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const isPad = width > 768;

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-4 pb-4 pt-8 shadow-sm">
        <Text className="text-center text-2xl font-bold tracking-tight text-gray-900">
          Create Your Profile
        </Text>
        <Text className="mt-1 text-center text-sm text-gray-600">
          Choose your preferred method to set up your professional profile
        </Text>
      </View>

      <ScrollView className="flex-1">
        <View className={`p-4 ${isPad ? 'max-w-2xl self-center' : ''}`}>
          {/* AI Resume Upload Section */}
          <TouchableOpacity
            onPress={() => navigation.navigate('Register')}
           className="mb-4 overflow-hidden rounded-2xl bg-white p-4 border-2 border-dashed shadow-sm">
            <View className="mb-3">
              <Text className="text-sm font-semibold text-gray-900">
                RECOMMENDED
              </Text>
              <Text className="text-xl font-bold text-gray-900">
                Smart Profile Creation
              </Text>
            </View>

            <ProcessStep
              icon="description"
              title="Upload Your Resume"
              description="Simply upload your existing resume in PDF or DOC format"
            />
            <ProcessStep
              icon="psychology"
              title="AI-Powered Analysis"
              description="Our advanced AI system extracts and organizes your professional information"
            />
            <ProcessStep
              icon="auto-awesome"
              title="Instant Profile"
              description="Get a complete profile ready in seconds with high accuracy"
              isLast
            />
          </TouchableOpacity>

          {/* Divider */}
          <View className="mb-4 flex-row items-center">
            <View className="flex-1 h-0.5 bg-gray-100" />
            <Text className="mx-2 text-sm font-medium text-gray-400">OR</Text>
            <View className="flex-1 h-0.5 bg-gray-100" />
          </View>

          {/* Manual Entry Section */}
          <TouchableOpacity
            onPress={() => navigation.navigate('Manual')}
           className="rounded-2xl bg-white p-4 shadow-sm border">
            <Text className="mb-2 text-xl font-bold text-gray-900">
              Manual Setup
            </Text>
            <ProcessStep
              icon="edit"
              title="Step-by-Step Entry"
              description="Fill in your information manually with our guided form process"
              isLast
            />
          </TouchableOpacity>
        </View>
      </ScrollView>

      
    </View>
  );
};

export default ExplanationScreen;