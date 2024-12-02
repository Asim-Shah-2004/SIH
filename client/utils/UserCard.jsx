import { FontAwesome } from '@expo/vector-icons'; // Add FontAwesome for pencil icon
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput } from 'react-native';

const UserCard = ({ user }) => {
  const [note, setNote] = useState('');
  const [isNoteOpen, setIsNoteOpen] = useState(false); // State to toggle TextInput visibility
  const navigation = useNavigation();

  const handleConnect = () => {
    console.log('Connecting...');
    if (note) {
      console.log('Note:', note); // Send connection with the note
    } else {
      console.log('Sending without a note'); // Send connection without the note
    }
  };

  const handleViewProfile = () => {
    navigation.navigate('Profile'); // Navigate to the profile
  };

  return (
    <View className="max-h-80 w-80 rounded-lg bg-white p-6 shadow-lg">
      {/* User info */}
      <View className="mb-6 flex-row items-center">
        <Image
          source={{ uri: user?.imageUrl || 'https://randomuser.me/api/portraits/men/32.jpg' }}
          className="mr-4 h-16 w-16 rounded-full"
        />
        <View>
          <Text className="text-lg font-bold text-gray-800">{user?.name || 'John Doe'}</Text>
          <Text className="text-sm text-gray-600">{user?.position || 'Software Engineer'}</Text>
          <Text className="text-sm text-gray-600">{user?.email || 'johndoe@example.com'}</Text>
        </View>
      </View>

      {/* View Profile Button */}
      <TouchableOpacity onPress={handleViewProfile} className="mb-4">
        <Text className="text-blue-600">View Profile</Text>
      </TouchableOpacity>

      {/* Note input with pencil icon */}
      <View className="mb-6">
        {!isNoteOpen ? (
          <TouchableOpacity onPress={() => setIsNoteOpen(true)} className="flex-row items-center">
            <FontAwesome name="pencil" size={16} color="gray" />
            <Text className="ml-2 text-sm text-gray-600">Add a Note</Text>
          </TouchableOpacity>
        ) : (
          <TextInput
            value={note}
            onChangeText={setNote}
            className="rounded-md border border-gray-300 p-3 text-sm"
            placeholder="Add a note (optional)"
            multiline
          />
        )}
      </View>

      {/* Connect Button */}
      <TouchableOpacity onPress={handleConnect} className="rounded-md bg-blue-600 px-4 py-2">
        <Text className="text-center text-sm font-medium text-white">Connect</Text>
      </TouchableOpacity>
    </View>
  );
};

export default UserCard;
