import React from 'react';
import { Text, Pressable } from 'react-native';

const Badge = ({ children, onPress }) => (
  <Pressable onPress={onPress} className="bg-accent/10 rounded-full px-4 py-2">
    <Text className="text-sm font-medium text-text">{children}</Text>
  </Pressable>
);

export default Badge;
