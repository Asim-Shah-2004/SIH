// screens/ChatScreen.js
import React from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity } from 'react-native';
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
        <View style={styles.container}>
            <FlatList
                data={chatData}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.chatItem} onPress={() => handleChatPress(item)}>
                        <Text style={styles.name}>{item.name}</Text>
                        <Text style={styles.lastMessage}>{item.lastMessage}</Text>
                        <Text style={styles.timestamp}>{item.timestamp}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    // Styles omitted for brevity
});

export default ChatScreen;