import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, Image, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ConnectModal = ({ isVisible, closeModal, item }) => {
    const [note, setNote] = useState('');
    const navigation = useNavigation();

    const handleConnect = () => {
        console.log('Connecting...');
        if (note) {
            console.log('Note:', note);  // Send connection with the note
        } else {
            console.log('Sending without a note');  // Send connection without the note
        }
        closeModal(); // Close the modal after sending the connection
    };

    const handleViewProfile = () => {
        navigation.navigate('Profile'); // Navigate to the profile with the user ID
        closeModal(); // Close the modal after navigating to the profile
    }

    return (
        <Modal visible={isVisible} animationType="slide" transparent={true} onRequestClose={closeModal}>
            <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
                <View className="bg-white rounded-lg p-6 w-80 max-h-80">
                    {/* Close Button (X) */}
                    <TouchableOpacity
                        onPress={closeModal}
                        className="absolute top-4 right-4 p-2"
                        activeOpacity={0.7} // Click feedback
                        style={{ zIndex: 100 }} // Ensure it's on top
                    >
                        <Text className="text-2xl font-bold text-gray-800">&times;</Text>
                    </TouchableOpacity>


                    {/* User info */}
                    <View className="flex-row items-center mb-6">
                        <Image
                            source={{ uri: item.postedBy?.imageUrl || 'https://randomuser.me/api/portraits/men/32.jpg' }} // Example random image URL
                            className="w-16 h-16 rounded-full mr-4"
                        />
                        <View>
                            <Text className="text-lg font-bold text-gray-800">{item.postedBy?.name || 'John Doe'}</Text>
                            <Text className="text-sm text-gray-600">{item.postedBy?.position || 'Software Engineer'}</Text>
                            <Text className="text-sm text-gray-600">{item.postedBy?.email || 'johndoe@example.com'}</Text>
                        </View>
                    </View>

                    {/* View Profile Button */}
                    <TouchableOpacity onPress={handleViewProfile}>
                        <Text className="text-blue-600 mb-4">View Profile</Text>
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
            </View>
        </Modal>
    );
};

export default ConnectModal;