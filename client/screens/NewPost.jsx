import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, ScrollView } from 'react-native';

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
      <Text className="mb-6 text-center text-2xl font-bold">Create a New Post</Text>

      {/* Post Content Input */}
      <TextInput
        className="rounded-md border border-gray-300 bg-white p-4 text-base"
        multiline
        placeholder="Write your post here..."
        value={postContent}
        onChangeText={handlePostContentChange}
        maxLength={3000}
      />
      <Text className="mt-1 text-right text-sm text-gray-500">{postContent.length}/3000</Text>

      {/* Add Media Button */}
      <TouchableOpacity
        className="my-4 flex-row items-center rounded-md bg-blue-500 p-3"
        onPress={handleMediaPick}>
        <MaterialIcons name="insert-photo" size={24} color="white" />
        <Text className="ml-2 text-base text-white">Add Media</Text>
      </TouchableOpacity>

      {/* Image Display */}
      {imageUri ? (
        <Image
          source={{ uri: imageUri }}
          className="mt-2 h-48 w-full rounded-md"
          resizeMode="cover"
        />
      ) : null}

      {/* Video Display */}
      {videoUri ? (
        <View className="mt-4 flex h-24 w-full items-center justify-center rounded-md bg-gray-400">
          <Text className="text-sm text-white">Video Preview: {videoUri}</Text>
        </View>
      ) : null}

      {/* Additional Options */}
      <TouchableOpacity
        className="my-4 flex-row items-center rounded-md bg-green-500 p-3"
        onPress={handleWriteWithAI}>
        <MaterialIcons name="create" size={24} color="white" />
        <Text className="ml-2 text-base text-white">Write with AI</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="my-4 flex-row items-center rounded-md bg-purple-500 p-3"
        onPress={handleSentimentAnalysis}>
        <MaterialIcons name="analytics" size={24} color="white" />
        <Text className="ml-2 text-base text-white">Sentiment Analysis</Text>
      </TouchableOpacity>

      {/* Submit Button */}
      <TouchableOpacity className="mt-4 rounded-md bg-blue-600 p-4" onPress={handleSubmit}>
        <Text className="text-center text-lg text-white">Submit Post</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
