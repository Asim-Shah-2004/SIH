import { View, FlatList, TouchableOpacity, Text } from 'react-native';

const notifications = [
  { id: '1', name: 'Company Updates', message: 'New company updates available' },
  { id: '2', name: 'Event Reminder', message: 'Alumni event is coming up soon' },
  { id: '3', name: 'Job Opportunity', message: 'New job posting match found' },
  { id: '4', name: 'System Maintenance', message: 'Scheduled maintenance for tomorrow' },
  { id: '5', name: 'Security Alert', message: 'Account security update required' },
  { id: '6', name: 'New Message', message: 'You have received a new message from HR' },
  { id: '7', name: 'Password Reset', message: 'Your password was successfully reset' },
];

const CollegeNotifications = () => {
  const handleNotificationPress = (item) => {
    console.log('Notification pressed:', item);
  };
  return (
    <>
      <Text className="mb-4 text-2xl font-semibold">College Notifications</Text>
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
    </>
  );
};

export default CollegeNotifications;
