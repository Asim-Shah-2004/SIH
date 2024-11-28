// screens/ChatScreen.js
import React from 'react';
import { View, FlatList, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ChatScreen = () => {
    const navigation = useNavigation();
    const chatData = [
        { id: '1', name: 'John Doe', lastMessage: 'Hey, how are you?', timestamp: '10:30 AM' },
        { id: '2', name: 'Jane Smith', lastMessage: 'Did you see the new update?', timestamp: '2:45 PM' },
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
                        className="p-4 bg-white mb-2 border-b border-gray-100"
                        onPress={() => handleChatPress(item)}
                    >
                        <Text className="text-lg font-semibold text-gray-800">{item.name}</Text>
                        <Text className="text-gray-600 mt-1">{item.lastMessage}</Text>
                        <Text className="text-gray-400 text-sm mt-1">{item.timestamp}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

export default ChatScreen;