import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';

export default function MainHeader() {
  const navigation = useNavigation();

  const handleChatPress = () => navigation.navigate('Chat');
  const handleNotificationsPress = () => navigation.navigate('Alerts');

  return (
    <View className="flex-row items-center justify-between border-b border-gray-200 bg-background px-4 py-3 shadow-sm">
      <TouchableOpacity onPress={() => navigation.openDrawer()} className="p-1">
        {/* <Ionicons name="menu-outline" size={28} color="rgb(var(--color-text))" /> */}
        <Ionicons name="person-circle-outline" size={28} color="rgb(var(--color-text))" />
      </TouchableOpacity>

      <View className="mx-4 flex-1">
        <TextInput
          className="rounded-full bg-accent px-4 py-2 text-text"
          placeholder="Search..."
          placeholderTextColor="rgb(var(--color-text))"
        />
      </View>

      <View className="flex-row items-center space-x-3">
        <TouchableOpacity onPress={handleChatPress} className="p-1">
          <Ionicons name="chatbubbles-outline" size={24} color="rgb(var(--color-text))" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNotificationsPress} className="p-1">
          <Ionicons name="notifications-outline" size={24} color="rgb(var(--color-text))" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
