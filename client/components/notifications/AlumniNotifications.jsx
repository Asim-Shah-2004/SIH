import { SERVER_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useState, useCallback, useContext } from 'react';
import { View, FlatList, Text, TouchableOpacity, Button } from 'react-native';

import { AuthContext } from '../../providers/CustomProvider';

const Notifications = () => {
  // State to manage active tab (either 'invitations' or 'notifications')
  const [activeTab, setActiveTab] = useState(true);
  const [isPressed, setIsPressed] = useState(false); // Prevent multiple rapid clicks
  const { user, setUser } = useContext(AuthContext);

  const handleAccept = async (invitationId) => {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      throw new Error('Token not found');
    }
    try {
      const response = await axios.post(
        `${SERVER_URL}/connections/accept`,
        { requesterId: invitationId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert(response.data.message || 'Invitation accepted!');
      setUser(response.data.user);
    } catch (error) {
      console.error('Error accepting invitation:', error);
      alert('Failed to accept invitation.');
    }
  };

  const handleReject = async (invitationId) => {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      throw new Error('Token not found');
    }
    try {
      const response = await axios.post(
        `${SERVER_URL}/connections/reject`,
        { requesterId: invitationId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert(response.data.message || 'Invitation rejected!');
      setUser(response.data.user);
    } catch (error) {
      console.error('Error rejecting invitation:', error);
      alert('Failed to reject invitation.');
    }
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
          {user.receivedRequests.length > 0 ? (
            <FlatList
              data={user.receivedRequests}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <View className="mb-4 rounded-lg bg-white p-4 shadow-md">
                  <TouchableOpacity>
                    <Text className="text-base font-bold">{item.fullName}</Text>
                    <Text className="text-sm text-gray-600">{item.bio}</Text>
                  </TouchableOpacity>
                  <View className="mt-2 flex-row justify-between">
                    <Button title="Accept" onPress={() => handleAccept(item._id)} color="green" />
                    <Button title="Reject" onPress={() => handleReject(item._id)} color="red" />
                  </View>
                </View>
              )}
            />
          ) : (
            <Text className="text-center text-gray-500">No invitations available</Text>
          )}
        </View>
      ) : (
        <View className="mb-6">
          {user.notifications.length > 0 ? (
            <FlatList
              data={user.notifications}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item, index }) => <Text className="text-base font-bold">{item}</Text>}
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
