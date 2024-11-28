import React from 'react';
import { View, Text, Pressable } from 'react-native';

const Card = ({ icon, title, subtitle, meta, description, onPress }) => (
  <Pressable onPress={onPress}>
    <View className="flex-row items-start mb-3 bg-accent p-3 rounded-lg shadow-lg border border-background/10">
      <View className="w-10 h-10 rounded-lg bg-background items-center justify-center mr-3 shadow-sm">
        {icon}
      </View>
      <View className="flex-1">
        <Text className="font-bold text-text text-lg">{title}</Text>
        <Text className="text-text/60 text-base font-medium">{subtitle}</Text>
        <Text className="text-text/50 text-sm italic">{meta}</Text>
        {description && (
          <Text className="text-text/60 text-sm mt-1 leading-5">{description}</Text>
        )}
      </View>
    </View>
  </Pressable>
);

export default Card;