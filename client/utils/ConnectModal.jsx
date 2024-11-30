import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, Image, TextInput } from 'react-native';

const ConnectModal = ({ isVisible, closeModal, item }) => {
  const [note, setNote] = useState('');
  const navigation = useNavigation();

  const handleConnect = () => {
    console.log('Connecting...');
    if (note) {
      console.log('Note:', note); // Send connection with the note
    } else {
      console.log('Sending without a note'); // Send connection without the note
    }
    closeModal(); // Close the modal after sending the connection
  };

  const handleViewProfile = () => {
    navigation.navigate('Profile'); // Navigate to the profile with the user ID
    closeModal(); // Close the modal after navigating to the profile
  };

  return (
    <Modal visible={isVisible} animationType="slide" transparent onRequestClose={closeModal}>
      <View className="flex-1 items-center justify-center bg-black bg-opacity-50">
        <View className="max-h-80 w-80 rounded-lg bg-white p-6">
          {/* Close Button (X) */}
          <TouchableOpacity
            onPress={closeModal}
            className="absolute right-4 top-4 p-2"
            activeOpacity={0.7} // Click feedback
            style={{ zIndex: 100 }} // Ensure it's on top
          >
            <Text className="text-2xl font-bold text-gray-800">&times;</Text>
          </TouchableOpacity>

          {/* User info */}
          <View className="mb-6 flex-row items-center">
            <Image
              source={{
                uri: item.postedBy?.imageUrl || 'https://randomuser.me/api/portraits/men/32.jpg',
              }} // Example random image URL
              className="mr-4 h-16 w-16 rounded-full"
            />
            <View>
              <Text className="text-lg font-bold text-gray-800">
                {item.postedBy?.name || 'John Doe'}
              </Text>
              <Text className="text-sm text-gray-600">
                {item.postedBy?.position || 'Software Engineer'}
              </Text>
              <Text className="text-sm text-gray-600">
                {item.postedBy?.email || 'johndoe@example.com'}
              </Text>
            </View>
          </View>

          {/* View Profile Button */}
          <TouchableOpacity onPress={handleViewProfile}>
            <Text className="mb-4 text-blue-600">View Profile</Text>
          </TouchableOpacity>

          {/* Note input (always open) */}
          <View className="mb-6">
            <TextInput
              value={note}
              onChangeText={setNote}
              className="rounded-md border border-gray-300 p-3 text-sm"
              placeholder="Add a note (optional)"
              multiline
            />
          </View>

          {/* Connect Button */}
          <TouchableOpacity onPress={handleConnect} className="rounded-md bg-blue-600 px-4 py-2">
            <Text className="text-sm font-medium text-white">Connect</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ConnectModal;
