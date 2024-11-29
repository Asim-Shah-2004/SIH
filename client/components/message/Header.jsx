import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

const Header = ({ chatData }) => (
  <View className="flex-row items-center justify-between border-b border-accent/10 bg-white p-4 shadow-sm">
    <View className="flex-1 flex-row items-center">
      <Image
        source={{ uri: chatData.avatar }}
        className="h-10 w-10 rounded-full border border-accent/10"
      />
      <View className="ml-3">
        <Text className="text-lg font-semibold text-text">{chatData.name}</Text>
        <Text className="text-xs text-highlight/70">Online</Text>
      </View>
    </View>
    <View className="flex-row gap-4">
      <TouchableOpacity className="rounded-full bg-primary/5 p-2">
        <Ionicons name="call" size={20} color="#2C3E8D" />
      </TouchableOpacity>
      <TouchableOpacity className="rounded-full bg-primary/5 p-2">
        <Ionicons name="videocam" size={20} color="#2C3E8D" />
      </TouchableOpacity>
    </View>
  </View>
);

export default Header;
