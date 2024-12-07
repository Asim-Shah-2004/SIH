import { Image } from 'expo-image';
import { useState } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';

const onboardingData = [
  {
    title: 'Welcome to Alumni Connect',
    description: 'Stay connected with your alma mater and fellow graduates',
    image: require('../assets/connect.gif'),
  },
  {
    title: 'Network & Opportunities',
    description: 'Discover career opportunities and expand your professional network',
    image: require('../assets/network.gif'),
  },
  {
    title: 'Events & Updates',
    description: 'Stay updated with latest events, news and announcements',
    image: require('../assets/events.gif'),
  },
];

export default function OnboardingPage({ navigation }) {
  const [currentStep, setCurrentStep] = useState(0);
  // console.log('Image source:', onboardingData[currentStep].image);

  const handleNext = () => {
    if (currentStep === onboardingData.length - 1) {
      navigation.navigate('Explanation');
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center px-4">
        <Image
          source={onboardingData[currentStep].image}
          style={{
            width: 300,
            height: 300,
            marginBottom: 32,
          }}
          contentFit="contain"
          onError={(e) => console.log('Error loading image:', e.nativeEvent.error)}
        />

        <Text className="mb-2 text-center text-2xl font-bold">
          {onboardingData[currentStep].title}
        </Text>

        <Text className="mb-8 text-center text-gray-600">
          {onboardingData[currentStep].description}
        </Text>

        {/* Dots indicator */}
        <View className="mb-8 flex-row space-x-2">
          {onboardingData.map((_, index) => (
            <View
              key={index}
              className={`h-2 w-2 rounded-full ${
                index === currentStep ? 'w-4 bg-blue-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </View>
      </View>

      <View className="p-4">
        <TouchableOpacity onPress={handleNext} className="rounded-full bg-primary p-4 text-dark">
          <Text className="text-center text-lg font-semibold text-white">
            {currentStep === onboardingData.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
