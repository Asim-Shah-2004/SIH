import React from 'react';
import { View, Text, Pressable } from 'react-native';

const Card = ({ icon, title, subtitle, meta, description, onPress }) => (
  <Pressable onPress={onPress}>
    <View className="border-background/10 mb-3 flex-row items-start rounded-lg border bg-accent p-3 shadow-lg">
      <View className="mr-3 h-10 w-10 items-center justify-center rounded-lg bg-background shadow-sm">
        {icon}
      </View>
      <View className="flex-1">
        <Text className="text-lg font-bold text-text">{title}</Text>
        <Text className="text-text/60 text-base font-medium">{subtitle}</Text>
        <Text className="text-text/50 text-sm italic">{meta}</Text>
        {description && <Text className="text-text/60 mt-1 text-sm leading-5">{description}</Text>}
      </View>
    </View>
  </Pressable>
);

export default Card;
