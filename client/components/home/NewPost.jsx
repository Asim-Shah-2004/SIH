import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const NewPost = ({ onSubmitPost, user }) => {
  const [newPost, setNewPost] = useState('');
  const [media, setMedia] = useState([]);
  const [emotion, setEmotion] = useState('');
  const [AI, setAI] = useState(false);
  const [prompt, setPrompt] = useState('');

  const suggestions = [
    'Make this more professional',
    'Add a touch of humor',
    'Simplify the language',
  ];

  const applyAISuggestion = (suggestion) => {
    setPrompt((prevPrompt) => `${prevPrompt} ${suggestion}`);
  };

  const handleHelper = (val) => {
    setAI(!val);
  };

  const analyzeEmotion = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/analyze_emotion/', {
        post: newPost,
      });
      console.log('Emotion Analysis Response:', response.data);
      setEmotion(response.data.emotions[0].label);
    } catch (error) {
      console.error('Error analyzing emotion:', error);
    }
  };

  const rewriteText = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/rewrite/', {
        post: newPost,
        style: prompt,
      });
      console.log('Rewrite Response:', response.data);
      setNewPost(response.data.rewritten_text);
    } catch (error) {
      console.error('Error rewriting text:', error);
    }
  };

  const handleSubmit = () => {
    if (newPost.trim() || media.length > 0) {
      onSubmitPost({
        text: newPost,
        media,
      });
      setNewPost('');
      setMedia([]);
    }
  };

  const pickMedia = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      const newMedia = await Promise.all(
        result.assets.map(async (asset) => {
          const isVideo = asset.type === 'video';
          if (isVideo) {
            try {
              const { uri } = await VideoThumbnails.getThumbnailAsync(asset.uri, {
                time: 1000,
              });
              return {
                type: 'video',
                uri: asset.uri,
                thumbnail: uri,
              };
            } catch (e) {
              console.error('Error generating video thumbnail', e);
              return {
                type: 'video',
                uri: asset.uri,
              };
            }
          }
          return {
            type: 'image',
            uri: asset.uri,
          };
        })
      );

      setMedia((prevMedia) => [...prevMedia, ...newMedia]);
    }
  };

  const removeMedia = (index) => {
    setMedia((prevMedia) => prevMedia.filter((_, i) => i !== index));
  };

  const renderMediaPreview = () => {
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-3 mt-3 flex-row">
        {media.map((item, index) => (
          <View key={index} className="relative mr-2">
            <Image
              source={{ uri: item.type === 'image' ? item.uri : item.thumbnail || item.uri }}
              className="h-24 w-24 rounded-lg"
            />
            <TouchableOpacity
              className="absolute right-1 top-1 rounded-full bg-black/60 p-1"
              onPress={() => removeMedia(index)}>
              <Icon name="close-circle" size={24} color="white" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    );
  };

  return (
    <View className="border-b border-gray-200 bg-white p-4">
      <View className="flex-row items-start">
        <Image
          source={{ uri: user?.avatar || 'https://via.placeholder.com/40' }}
          className="mr-3 h-10 w-10 rounded-full"
        />
        <TextInput
          className="max-h-[120px] min-h-[80px] flex-1 rounded-lg bg-gray-100 p-3 text-base"
          placeholder="What's on your mind?"
          multiline
          value={newPost}
          onChangeText={setNewPost}
          placeholderTextColor="#657786"
        />
      </View>

      {media.length > 0 && renderMediaPreview()}

      <View className="mt-3 flex-row items-center justify-between">
        <View className="flex-row space-x-4">
          <TouchableOpacity className="flex-row items-center space-x-2" onPress={pickMedia}>
            <Icon name="image-outline" size={24} color="#4a4a4a" />
            <Text className="text-sm text-gray-700">Media</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center space-x-2"
            onPress={() => handleHelper(AI)}>
            <Icon name="sparkles-outline" size={24} color="#4a4a4a" />
            <Text className="text-sm text-gray-700">AI Helper</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          className={`rounded-full px-6 py-2 ${
            !newPost.trim() && media.length === 0 ? 'bg-black/50' : 'bg-black'
          }`}
          onPress={handleSubmit}
          disabled={!newPost.trim() && media.length === 0}>
          <Text className="text-sm font-semibold text-white">Post</Text>
        </TouchableOpacity>
      </View>

      {AI && (
        <ScrollView className="mb-2 mt-4">
          {/* Analyze Emotion Section */}
          <View className="mb-2 flex-row items-center">
            <TouchableOpacity
              className={`mr-2 rounded-lg px-4 py-2 ${newPost ? 'bg-blue-500' : 'bg-gray-300'}`}
              onPress={newPost ? analyzeEmotion : null} // Only trigger the function if newPost exists
              disabled={!newPost} // Disable the button when newPost doesn't exist
            >
              <Text className={`text-sm font-medium ${newPost ? 'text-white' : 'text-gray-500'}`}>
                Analyze Emotion
              </Text>
            </TouchableOpacity>
            {/* Display emotion beside the button */}
            <Text className="text-sm font-medium text-gray-700">
              {emotion || 'No emotion detected'} {/* Display detected emotion */}
            </Text>
          </View>

          {/* Horizontal Suggestions */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-2 flex-row space-x-2">
            {suggestions.map((suggestion, index) => (
              <TouchableOpacity
                key={index}
                className="rounded-full border border-blue-200 bg-blue-100 px-4 py-2"
                onPress={() => applyAISuggestion(suggestion)}>
                <Text className="text-sm font-medium text-blue-600">{suggestion}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Text Input */}
          <View>
            <TextInput
              className="max-h-[80px] min-h-[40px] flex-1 rounded-lg border border-gray-300 bg-gray-100 p-3 text-base"
              placeholder="What's on your mind?"
              multiline
              value={prompt}
              onChangeText={setPrompt}
              placeholderTextColor="#657786"
            />
          </View>

          {/* Rewrite Button */}
          <View className="mt-2">
            <TouchableOpacity
              className="rounded-lg bg-green-500 px-4 py-2"
              onPress={rewriteText} // Ensure rewriteText is defined
            >
              <Text className="text-center text-sm font-medium text-white">Rewrite</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default NewPost;
