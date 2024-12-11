import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';

import { useAuth } from '../../providers/AuthProvider';

export default function MainHeader() {
  const { role, user } = useAuth();
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');

  const handleChatPress = () => navigation.navigate('Chats');
  const handleNotificationsPress = () => navigation.navigate('Alerts');
  const handleProfilePress = () => navigation.openDrawer();
  const handleSearch = () => {
    // Implement search functionality
    console.log('Searching for:', searchQuery);
  };

  return (
    <View className="flex-row items-center justify-between border-b border-gray-200 bg-white px-4 py-3 shadow-sm">
      {/* Profile/Menu Button */}
      <TouchableOpacity 
        onPress={handleProfilePress} 
        className="p-1 flex-row items-center"
      >
        <Ionicons 
          name="person-circle-outline" 
          size={32} 
          color="#333" 
        />
        {user?.name && (
          <Text className="ml-2 text-gray-700 font-semibold text-sm">
            {user.name.split(' ')[0]}
          </Text>
        )}
      </TouchableOpacity>

      {/* Search Input */}
      <View className="mx-4 flex-1 flex-row items-center">
        <View className="flex-1 relative">
          <TextInput
            className="rounded-lg bg-gray-100 px-4 py-2 pl-10 text-gray-800"
            placeholder="Search..."
            placeholderTextColor="#9ca3af"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          <View className="absolute left-0 top-0 bottom-0 justify-center pl-3">
            <Ionicons 
              name="search-outline" 
              size={20} 
              color="#9ca3af" 
            />
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View className="flex-row items-center space-x-3">
        {role === 'alumni' && (
          <TouchableOpacity 
            onPress={handleChatPress} 
            className="p-1"
          >
            <Ionicons 
              name="chatbubbles-outline" 
              size={24} 
              color="#333" 
            />
          </TouchableOpacity>
        )}
        
        <TouchableOpacity 
          onPress={handleNotificationsPress} 
          className="p-1"
        >
          <Ionicons 
            name="notifications-outline" 
            size={24} 
            color="#333" 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}