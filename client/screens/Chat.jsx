// screens/ChatScreen.js
import { useNavigation } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { View, FlatList, Text, TouchableOpacity, Image, RefreshControl } from 'react-native';

import { chatData } from '../constants/chatData';

const ChatScreen = () => {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);

  const handleChatPress = (item) => {
    navigation.navigate('Message', { chatData: item });
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Add your refresh logic here
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View className="border-b border-accent bg-white p-4">
        <Text className="text-xl font-bold text-text">Messages</Text>
      </View>

      <FlatList
        data={chatData}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="mb-2 flex-row items-center border-b border-accent bg-white p-4"
            onPress={() => handleChatPress(item)}>
            <View className="relative">
              <Image source={{ uri: item.avatar }} className="h-12 w-12 rounded-full" />
              {item.isOnline && (
                <View className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-primary" />
              )}
            </View>
            <View className="ml-4 flex-1">
              <Text className="text-lg font-semibold text-text">{item.name}</Text>
              <Text className="mt-1 text-highlight">{item.lastMessage}</Text>
            </View>
            <View className="items-end">
              <Text className="text-sm text-highlight">{item.timestamp}</Text>
              {item.unread > 0 && (
                <View className="mt-2 h-5 w-5 items-center justify-center rounded-full bg-primary">
                  <Text className="text-xs text-white">{item.unread}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default ChatScreen;
