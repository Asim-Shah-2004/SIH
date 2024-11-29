import React from 'react';
import { View, Text, Pressable } from 'react-native';

const Card = ({ icon, title, subtitle, meta, description, onPress }) => (
  <Pressable onPress={onPress}>
    <View className="mb-3 flex-row items-start rounded-lg border border-background/10 bg-accent p-3 shadow-lg">
      <View className="mr-3 h-10 w-10 items-center justify-center rounded-lg bg-background shadow-sm">
        {icon}
      </View>
      <View className="flex-1">
        <Text className="text-lg font-bold text-text">{title}</Text>
        <Text className="text-base font-medium text-text/60">{subtitle}</Text>
        <Text className="text-sm italic text-text/50">{meta}</Text>
        {description && <Text className="mt-1 text-sm leading-5 text-text/60">{description}</Text>}
      </View>
    </View>
  </Pressable>
);

export default Card;
