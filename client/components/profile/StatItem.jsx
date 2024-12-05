import React from 'react';
import { View, Text } from 'react-native';

const StatItem = ({ icon: Icon, count, label }) => (
  <View className="items-center space-y-1">
    <View className="flex-row items-center space-x-1">
      <Icon size={14} className="text-text/60" />
      <Text className="text-base font-bold text-text">{count}</Text>
    </View>
    <Text className="text-text/60 text-xs">{label}</Text>
  </View>
);

export default StatItem;
