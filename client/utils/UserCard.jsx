import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const UserCard = ({ user }) => {
    const [note, setNote] = useState('');
    const navigation = useNavigation();

    const handleConnect = () => {
        console.log('Connecting...');
        if (note) {
            console.log('Note:', note);  // Send connection with the note
        } else {
            console.log('Sending without a note');  // Send connection without the note
        }
    };

    const handleViewProfile = () => {
        navigation.navigate('Profile'); // Navigate to the profile
    };

    return (
        <View className="bg-white rounded-lg p-6 shadow-lg w-80 max-h-80">
            {/* User info */}
            <View className="flex-row items-center mb-6">
                <Image
                    source={{ uri: user?.imageUrl || 'https://randomuser.me/api/portraits/men/32.jpg' }}
                    className="w-16 h-16 rounded-full mr-4"
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

            {/* Note input (always open) */}
            <View className="mb-6">
                <TextInput
                    value={note}
                    onChangeText={setNote}
                    className="border border-gray-300 p-3 rounded-md text-sm"
                    placeholder="Add a note (optional)"
                    multiline
                />
            </View>

            {/* Connect Button */}
            <TouchableOpacity
                onPress={handleConnect}
                className="py-2 px-4 bg-blue-600 rounded-md"
            >
                <Text className="text-white text-sm font-medium">Connect</Text>
            </TouchableOpacity>
        </View>
    );
};

export default UserCard;
