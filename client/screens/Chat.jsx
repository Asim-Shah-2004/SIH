// screens/ChatScreen.js
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, FlatList, Text, TouchableOpacity } from 'react-native';

const ChatScreen = () => {
  const navigation = useNavigation();
  const chatData = [
    { id: '1', name: 'John Doe', lastMessage: 'Hey, how are you?', timestamp: '10:30 AM' },
    {
      id: '2',
      name: 'Jane Smith',
      lastMessage: 'Did you see the new update?',
      timestamp: '2:45 PM',
    },
    // Add more chat data as needed
  ];

  const handleChatPress = (item) => {
    navigation.navigate('Message', { chatData: item });
  };

  return (
    <View className="flex-1 bg-gray-50">
      <FlatList
        data={chatData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="mb-2 border-b border-gray-100 bg-white p-4"
            onPress={() => handleChatPress(item)}>
            <Text className="text-lg font-semibold text-gray-800">{item.name}</Text>
            <Text className="mt-1 text-gray-600">{item.lastMessage}</Text>
            <Text className="mt-1 text-sm text-gray-400">{item.timestamp}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default ChatScreen;
