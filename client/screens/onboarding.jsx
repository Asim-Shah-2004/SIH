import { Text, View, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import {Image} from 'expo-image';

const onboardingData = [
  {
    title: "Welcome to Alumni Connect",
    description: "Stay connected with your alma mater and fellow graduates",
    image: require('../assets/connect.gif')
  },
  {
    title: "Network & Opportunities",
    description: "Discover career opportunities and expand your professional network",
    image: require('../assets/network.gif')
  },
  {
    title: "Events & Updates",
    description: "Stay updated with latest events, news and announcements",
    image: require('../assets/events.gif')
  }
];

export default function HomePage({navigation}) {
  const [currentStep, setCurrentStep] = useState(0);
  console.log('Image source:', onboardingData[currentStep].image);

  const handleNext = () => {
    if (currentStep === onboardingData.length - 1) {
      navigation.navigate('Login');
    } else {
      setCurrentStep(prev => prev + 1);
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
            marginBottom: 32
          }}
          resizeMode="contain"
          onError={(e) => console.log('Error loading image:', e.nativeEvent.error)}
        />
        
        <Text className="text-2xl font-bold text-center mb-2">
          {onboardingData[currentStep].title}
        </Text>
        
        <Text className="text-gray-600 text-center mb-8">
          {onboardingData[currentStep].description}
        </Text>

        {/* Dots indicator */}
        <View className="flex-row space-x-2 mb-8">
          {onboardingData.map((_, index) => (
            <View
              key={index}
              className={`h-2 w-2 rounded-full ${
                index === currentStep ? 'bg-blue-500 w-4' : 'bg-gray-300'
              }`}
            />
          ))}
        </View>
      </View>

      <View className="p-4">
        <TouchableOpacity
          onPress={handleNext}
          className="bg-primary text-dark  p-4 rounded-full"
        >
          <Text className="text-white text-center font-semibold text-lg">
            {currentStep === onboardingData.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
