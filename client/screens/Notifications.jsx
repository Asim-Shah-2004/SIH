import React from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ChatScreen = () => {
    const navigation = useNavigation();

    const invitations = [
        { id: '1', name: 'Alice Johnson', message: 'Invited you to connect' },
        { id: '2', name: 'Bob Williams', message: 'Sent you a connection request' },
        // Add more invitation data as needed
    ];

    const notifications = [
        { id: '1', name: 'Company Updates', message: 'New company updates available' },
        { id: '2', name: 'Event Reminder', message: 'Alumni event is coming up soon' },
        { id: '3', name: 'Job Opportunity', message: 'New job posting match found' },
        { id: '4', name: 'Job Opportunity', message: 'New job posting match found' },
        { id: '5', name: 'Job Opportunity', message: 'New job posting match found' },
        { id: '6', name: 'Job Opportunity', message: 'New job posting match found' },
        { id: '7', name: 'Job Opportunity', message: 'New job posting match found' },
        { id: '8', name: 'Job Opportunity', message: 'New job posting match found' },
        { id: '9', name: 'Job Opportunity', message: 'New job posting match found' },
        // Add more notification data as needed
    ];

    const handleChatPress = (item) => {
        navigation.navigate('Message', { chatData: item });
    };

    const handleInvitationPress = (item) => {
        // Handle invitation press
    };

    const handleNotificationPress = (item) => {
        // Handle notification press
    };

    const renderSection = (data, title, renderItem, onPressHandler) => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>{title}</Text>
            {data.length > 0 ? (
                <FlatList
                    data={data}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.sectionItem} onPress={() => onPressHandler(item)}>
                            {renderItem(item)}
                        </TouchableOpacity>
                    )}
                />
            ) : (
                <Text style={styles.noData}>No {title.toLowerCase()} available</Text>
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.dynamicContainer}>
                {renderSection(invitations, 'Invitations', (item) => (
                    <>
                        <Text style={styles.name}>{item.name}</Text>
                        <Text style={styles.message}>{item.message}</Text>
                    </>
                ), handleInvitationPress)}

                {renderSection(notifications, 'Notifications', (item) => (
                    <>
                        <Text style={styles.name}>{item.name}</Text>
                        <Text style={styles.message}>{item.message}</Text>
                    </>
                ), handleNotificationPress)}
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f3f3f3',
    },
    dynamicContainer: {
        flex: 1,
        padding: 16,
    },
    section: {
        flex: 1,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    noData: {
        fontSize: 16,
        color: '#999',
        textAlign: 'center',
    },
    sectionItem: {
        backgroundColor: '#f3f3f3',
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
    },
    chatSection: {
        flex: 2,
        backgroundColor: '#f3f3f3',
    },
    chatItem: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    message: {
        fontSize: 14,
        color: '#666',
    },
    lastMessage: {
        fontSize: 14,
        color: '#666',
    },
    timestamp: {
        fontSize: 12,
        color: '#999',
    },
});

export default ChatScreen;
