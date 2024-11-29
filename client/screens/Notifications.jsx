import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, FlatList, Text, TouchableOpacity } from 'react-native';

const ChatScreen = () => {
  const navigation = useNavigation();

  const invitations = [
    { id: '1', name: 'Alice Johnson', message: 'Invited you to connect' },
    { id: '2', name: 'Bob Williams', message: 'Sent you a connection request' },
  ];

  const notifications = [
    { id: '1', name: 'Company Updates', message: 'New company updates available' },
    { id: '2', name: 'Event Reminder', message: 'Alumni event is coming up soon' },
    { id: '3', name: 'Job Opportunity', message: 'New job posting match found' },
  ];

  const handleInvitationPress = (item) => {
    // Handle invitation press
  };

  const handleNotificationPress = (item) => {
    // Handle notification press
  };

  const renderSection = (data, title, renderItem, onPressHandler) => (
    <View className="mb-6">
      <Text className="mb-4 text-lg font-bold">{title}</Text>
      {data.length > 0 ? (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              className="mb-4 rounded-lg bg-white p-4 shadow-md"
              onPress={() => onPressHandler(item)}>
              {renderItem(item)}
            </TouchableOpacity>
          )}
        />
      ) : (
        <Text className="text-center text-gray-500">No {title.toLowerCase()} available</Text>
      )}
    </View>
  );

  return (
    <View className="flex-1 bg-gray-100 p-4">
      {renderSection(
        invitations,
        'Invitations',
        (item) => (
          <>
            <Text className="text-base font-bold">{item.name}</Text>
            <Text className="text-sm text-gray-600">{item.message}</Text>
          </>
        ),
        handleInvitationPress
      )}

      {renderSection(
        notifications,
        'Notifications',
        (item) => (
          <>
            <Text className="text-base font-bold">{item.name}</Text>
            <Text className="text-sm text-gray-600">{item.message}</Text>
          </>
        ),
        handleNotificationPress
      )}
    </View>
  );
};

export default ChatScreen;
