import React from 'react';
import { Text, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const Badge = ({ children, onPress }) => (
  <Pressable onPress={onPress}>
    <LinearGradient
      colors={['#2C3E8D', '#3498DB']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="mr-2 mb-2 px-4 py-2 rounded-full shadow-md bg-gradient-to-r from-primary to-secondary"
    >
      <Text className="text-white text-sm font-medium">
        {children}
      </Text>
    </LinearGradient>
  </Pressable>
);

export default Badge;
