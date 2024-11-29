import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Text, Pressable } from 'react-native';

const Badge = ({ children, onPress }) => (
  <Pressable onPress={onPress}>
    <LinearGradient
      colors={['#2C3E8D', '#3498DB']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="mb-2 mr-2 rounded-full bg-gradient-to-r from-primary to-secondary px-4 py-2 shadow-md">
      <Text className="text-sm font-medium text-white">{children}</Text>
    </LinearGradient>
  </Pressable>
);

export default Badge;
