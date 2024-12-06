import React, { useState, useCallback } from 'react';
import { View, FlatList, Text, TouchableOpacity } from 'react-native';

import { AuthContext } from '../../providers/CustomProvider';

const Notifications = () => {
    // State to manage active tab (either 'invitations' or 'notifications')
    const [activeTab, setActiveTab] = useState(true);
    const [isPressed, setIsPressed] = useState(false); // Prevent multiple rapid clicks
    const { role } = React.useContext(AuthContext);

    // Sample data
    const invitations = [
        { id: '1', name: 'Alice Johnson', message: 'Invited you to connect' },
        { id: '2', name: 'Bob Williams', message: 'Sent you a connection request' },
        { id: '3', name: 'Charlie Davis', message: 'Wants to connect with you' },
        { id: '4', name: 'David Clark', message: 'Invited you to join the group' },
        { id: '5', name: 'Emily Evans', message: 'Sent you a connection request' },
        { id: '6', name: 'Frank Garcia', message: 'Wants to connect with you' },
        { id: '7', name: 'Grace Harris', message: 'Invited you to join the event' },
        { id: '8', name: 'Hannah Lee', message: 'Sent you an invitation to collaborate' },
        { id: '9', name: 'Isaac Martin', message: 'Invited you to join a professional network' },
        { id: '10', name: 'Jack Brown', message: 'Sent you a job referral request' },
        { id: '11', name: 'Katherine Taylor', message: 'Wants to connect with you' },
        { id: '12', name: 'Liam Moore', message: 'Invited you to join a team' },
        { id: '13', name: 'Mason Wilson', message: 'Sent you an invitation to collaborate' },
        { id: '14', name: 'Nina Walker', message: 'Invited you to participate in a seminar' },
        { id: '15', name: 'Oliver White', message: 'Wants to connect on LinkedIn' },
    ];

    const notifications = [
        { id: '1', name: 'Company Updates', message: 'New company updates available' },
        { id: '2', name: 'Event Reminder', message: 'Alumni event is coming up soon' },
        { id: '3', name: 'Job Opportunity', message: 'New job posting match found' },
        { id: '4', name: 'System Maintenance', message: 'Scheduled maintenance for tomorrow' },
        { id: '5', name: 'Security Alert', message: 'Account security update required' },
        { id: '6', name: 'New Message', message: 'You have received a new message from HR' },
        { id: '7', name: 'Password Reset', message: 'Your password was successfully reset' },
        {
            id: '8',
            name: 'New Update',
            message: 'Your software has been updated to the latest version',
        },
        {
            id: '9',
            name: 'Task Reminder',
            message: "Don't forget to submit your report by the end of the day",
        },
        {
            id: '10',
            name: 'Network Connectivity',
            message: 'There are issues with your network connection',
        },
        {
            id: '11',
            name: 'Feature Announcement',
            message: 'New features have been added to your dashboard',
        },
        { id: '12', name: 'Product Launch', message: 'Check out our new product launching next week' },
        {
            id: '13',
            name: 'Survey Reminder',
            message: 'Please complete the survey by the end of the week',
        },
        { id: '14', name: 'Job Alert', message: 'New job opening matching your profile' },
        {
            id: '15',
            name: 'Meeting Invitation',
            message: 'A meeting has been scheduled for tomorrow afternoon',
        },
    ];

    // Handle press events for each item (you can add custom logic here)
    const handleInvitationPress = (item) => {
        console.log('Invitation pressed:', item);
    };

    const handleNotificationPress = (item) => {
        console.log('Notification pressed:', item);
    };

    // Debounced tab press handler
    const handleTabPress = useCallback(
        (isInvitation) => {
            if (!isPressed) {
                setIsPressed(true); // Disable rapid clicking
                setActiveTab(isInvitation);
                setTimeout(() => setIsPressed(false), 300); // Re-enable after a short delay
            }
        },
        [isPressed]
    );

    return (
        <View className="flex-1 bg-gray-100 p-4">
            {/* Tab Buttons */}
            <View className="mb-6 flex-row">
                <TouchableOpacity
                    onPress={() => handleTabPress(true)}
                    style={{
                        flex: 1,
                        paddingVertical: 16, // Increased vertical padding
                        backgroundColor: activeTab ? '#1e40af' : '#d1d5db', // Blue when active
                        borderRadius: 5,
                        marginRight: 8,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <Text
                        style={{
                            color: activeTab ? 'white' : 'black',
                            fontWeight: 'bold',
                            fontSize: 18, // Increased font size
                        }}>
                        Invitations
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => handleTabPress(false)}
                    style={{
                        flex: 1,
                        paddingVertical: 16, // Increased vertical padding
                        backgroundColor: !activeTab ? '#1e40af' : '#d1d5db', // Blue when active
                        borderRadius: 5,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <Text
                        style={{
                            color: !activeTab ? 'white' : 'black',
                            fontWeight: 'bold',
                            fontSize: 18, // Increased font size
                        }}>
                        Notifications
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Conditional Rendering of Invitations Section */}
            {activeTab ? (
                <View className="mb-6">
                    {invitations.length > 0 ? (
                        <FlatList
                            data={invitations}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    className="mb-4 rounded-lg bg-white p-4 shadow-md"
                                    onPress={() => handleInvitationPress(item)}>
                                    <Text className="text-base font-bold">{item.name}</Text>
                                    <Text className="text-sm text-gray-600">{item.message}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    ) : (
                        <Text className="text-center text-gray-500">No invitations available</Text>
                    )}
                </View>
            ) : (
                <View className="mb-6">
                    {notifications.length > 0 ? (
                        <FlatList
                            data={notifications}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    className="mb-4 rounded-lg bg-white p-4 shadow-md"
                                    onPress={() => handleNotificationPress(item)}>
                                    <Text className="text-base font-bold">{item.name}</Text>
                                    <Text className="text-sm text-gray-600">{item.message}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    ) : (
                        <Text className="text-center text-gray-500">No notifications available</Text>
                    )}
                </View>
            )}
        </View>
    );
};

export default Notifications;
