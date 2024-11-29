import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function NewPost({ navigation }) {
    const [postContent, setPostContent] = useState('');
    const [imageUri, setImageUri] = useState('');
    const [videoUri, setVideoUri] = useState('');

    const handlePostContentChange = (text) => {
        if (text.length <= 3000) {
            setPostContent(text);
        }
    };

    const handleMediaPick = () => {
        if (!imageUri && !videoUri) {
            setImageUri('https://via.placeholder.com/400'); // Mock image URI
        } else if (!videoUri) {
            setVideoUri('https://www.w3schools.com/html/mov_bbb.mp4'); // Mock video URI
        } else {
            alert('You can only add one image and one video.');
        }
    };

    const handleWriteWithAI = () => {
        alert('Write with AI feature is coming soon!');
    };

    const handleSentimentAnalysis = () => {
        alert('Sentiment Analysis feature is coming soon!');
    };

    const handleSubmit = () => {
        alert('Post submitted successfully!');
        setPostContent('');
        setImageUri('');
        setVideoUri('');
    };

    return (
        <ScrollView className="flex-1 bg-gray-100 p-4">
            <Text className="text-2xl font-bold text-center mb-6">Create a New Post</Text>

            {/* Post Content Input */}
            <TextInput
                className="bg-white p-4 rounded-md border border-gray-300 text-base"
                multiline
                placeholder="Write your post here..."
                value={postContent}
                onChangeText={handlePostContentChange}
                maxLength={3000}
            />
            <Text className="text-sm text-gray-500 text-right mt-1">{postContent.length}/3000</Text>

            {/* Add Media Button */}
            <TouchableOpacity
                className="flex-row items-center bg-blue-500 rounded-md p-3 my-4"
                onPress={handleMediaPick}
            >
                <MaterialIcons name="insert-photo" size={24} color="white" />
                <Text className="text-white text-base ml-2">Add Media</Text>
            </TouchableOpacity>

            {/* Image Display */}
            {imageUri ? (
                <Image
                    source={{ uri: imageUri }}
                    className="w-full h-48 rounded-md mt-2"
                    resizeMode="cover"
                />
            ) : null}

            {/* Video Display */}
            {videoUri ? (
                <View className="w-full h-24 bg-gray-400 rounded-md flex items-center justify-center mt-4">
                    <Text className="text-white text-sm">Video Preview: {videoUri}</Text>
                </View>
            ) : null}

            {/* Additional Options */}
            <TouchableOpacity
                className="flex-row items-center bg-green-500 rounded-md p-3 my-4"
                onPress={handleWriteWithAI}
            >
                <MaterialIcons name="create" size={24} color="white" />
                <Text className="text-white text-base ml-2">Write with AI</Text>
            </TouchableOpacity>

            <TouchableOpacity
                className="flex-row items-center bg-purple-500 rounded-md p-3 my-4"
                onPress={handleSentimentAnalysis}
            >
                <MaterialIcons name="analytics" size={24} color="white" />
                <Text className="text-white text-base ml-2">Sentiment Analysis</Text>
            </TouchableOpacity>

            {/* Submit Button */}
            <TouchableOpacity
                className="bg-blue-600 rounded-md p-4 mt-4"
                onPress={handleSubmit}
            >
                <Text className="text-white text-center text-lg">Submit Post</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}
