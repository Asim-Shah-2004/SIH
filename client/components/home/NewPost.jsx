import { ML_URL } from '@env';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SERVER_URL } from '@env'

import Post from './Post';
import { useAuth } from '../../providers/AuthProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NewPost = () => {
  const [newPost, setNewPost] = useState('');
  const [media, setMedia] = useState([]);
  const [emotion, setEmotion] = useState('');
  const [AI, setAI] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [stack, setStack] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const { user } = useAuth();

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
      setLoading1(true);
      const response = await axios.post(`${ML_URL}/api/analyze_emotion/`, {
        post: newPost,
      });
      console.log('Emotion Analysis Response:', response.data);
      setEmotion(response.data.emotions[0].label);
    } catch (error) {
      console.error('Error analyzing emotion:', error);
    } finally {
      setLoading1(false);
    }
  };

  const rewriteText = async () => {
    try {
      setLoading2(true);
      const response = await axios.post(`${ML_URL}/api/rewrite/`, {
        post: newPost || '',
        style: prompt,
      });
      console.log('Rewrite Response:', response.data);
      setStack([...stack, newPost]);
      setNewPost(response.data.rewritten_text);
    } catch (error) {
      console.error('Error rewriting text:', error);
    } finally {
      setLoading2(false);
    }
  };

  const undoRewrite = () => {
    if (stack.length > 0) {
      setNewPost(stack.pop());
      setStack([...stack]);
    }
  };

  const handleSubmit = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('Invalid token')
      }
      const response = await axios.post(`${SERVER_URL}/posts/`, {
        text: newPost,
        media
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      console.log(response.data);
      setMedia([])
      setNewPost('')
    }
    catch (err) {
      console.error('Error submitting post:', err);
    }
  };


  const pickMedia = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
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
              <Ionicons name="close-circle" size={24} color="white" />
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
          source={{ uri: user?.profilePhoto || 'https://via.placeholder.com/40' }}
          className="mr-3 h-10 w-10 rounded-full"
        />
        <TextInput
          className="max-h-[120px] min-h-[40px] flex-1 rounded-lg bg-gray-100 p-4 text-base shadow-sm"
          placeholder="What's on your mind? (Markdown supported)"
          multiline
          value={newPost}
          onChangeText={setNewPost}
          placeholderTextColor="#657786"
        />
      </View>

      {media.length > 0 && <View className="my-4">{renderMediaPreview()}</View>}

      {/* {newPost && renderMarkdownPreview()} */}

      <View className="mt-3 flex-row items-center justify-between">
        <View className="flex-row">
          <TouchableOpacity
            className="ounded-lg mr-2 flex-row items-center bg-gray-50 px-3 py-1"
            onPress={pickMedia}>
            <Ionicons name="image-outline" size={24} color="#4a4a4a" />
            <Text className="text-sm font-medium text-gray-700">Media</Text>
          </TouchableOpacity>

          {/* <TouchableOpacity
            className="flex-row items-center rounded-lg bg-gray-50 px-3"
            onPress={() => handleHelper(AI)}>
            <Ionicons name="sparkles-outline" size={24} color="#4a4a4a" />
            <Text className="text-sm font-medium text-gray-700">AI Helper</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center rounded-lg bg-gray-50 px-3"
            onPress={() => setShowPreview(!showPreview)}>
            <Ionicons name="eye-outline" size={24} color="#4a4a4a" />
            <Text className="text-sm font-medium text-gray-700">Preview</Text>
          </TouchableOpacity> */}
        </View>

        <TouchableOpacity
          className={`rounded-full px-6 py-2 ${!newPost.trim() && media.length === 0 ? 'bg-black/50' : 'bg-black'
            }`}
          onPress={handleSubmit}
          disabled={!newPost.trim() && media.length === 0}>
          <Text className="text-sm font-semibold text-white" onPress={handleSubmit}>Post</Text>
        </TouchableOpacity>
      </View>

      {showPreview && (
        <View className="mt-4 rounded-lg border border-gray-200">
          <Post
            post={{
              postId: 'preview',
              authorId: user._id,
              fullName: user.fullName,
              profilePhoto: user.profilePhoto,
              text: newPost,
              media,
              comments: { total: 0, details: [] },
              likes: { total: 0, details: [] },
              timestamp: new Date(),
            }}
            preview
          />
        </View>
      )}

      {AI && (
        <View className="mt-2 space-y-4">
          {/* Analyze Emotion Section */}
          <View className="flex-row items-center gap-1 rounded-lg border-l-4 border-yellow-500 bg-yellow-50 p-2 shadow-lg">
            <Text className="text-xl text-yellow-500">💡</Text>
            <Text className="text-sm font-medium text-gray-800">
              Try writing something in the Post to analyze emotion or Generate Post entirely by AI.
            </Text>
          </View>

          <View className="flex-row items-center justify-between rounded-lg bg-gray-50 p-3">
            <TouchableOpacity
              className={`rounded-lg px-4 py-2 ${newPost ? 'bg-blue-500' : 'bg-gray-300'}`}
              onPress={newPost ? analyzeEmotion : null}
              disabled={!newPost}>
              <Text className={`text-sm font-medium ${newPost ? 'text-white' : 'text-gray-500'}`}>
                Analyze Emotion
              </Text>
            </TouchableOpacity>
            <Text className="text-sm font-medium text-gray-700">
              {loading1 ? 'Loading...' : emotion || 'No emotion detected'}
            </Text>
          </View>

          {/* Suggestions Section */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="py-2">
            {suggestions.map((suggestion, index) => (
              <TouchableOpacity
                key={index}
                className="mr-1 rounded-full border border-blue-200 bg-blue-50 px-3 py-2 shadow-sm"
                onPress={() => applyAISuggestion(suggestion)}>
                <Text className="text-sm font-medium text-blue-600">{suggestion}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* AI Prompt Input */}
          <View>
            <TextInput
              className="mb-2 max-h-[80px] min-h-[40px] rounded-lg border border-gray-200 bg-white p-4 text-base shadow-sm"
              placeholder="Enter AI prompt..."
              multiline
              value={prompt}
              onChangeText={setPrompt}
              placeholderTextColor="#657786"
            />
            <TouchableOpacity
              className={`mb-2 rounded-lg ${prompt ? 'bg-green-500' : 'bg-gray-300'} px-4 py-3 shadow-sm`}
              onPress={prompt ? rewriteText : null} // Only trigger rewriteText if prompt is set
              disabled={!prompt} // Disable the button when prompt is not set
            >
              <Text
                className={`text-center text-sm font-medium ${prompt ? 'text-white' : 'text-gray-500'}`}>
                {loading2 ? 'Generating Response...' : 'Write with AI'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`rounded-lg px-4 py-3 shadow-sm ${stack.length === 0 ? 'bg-gray-500' : 'bg-black'}`}
              onPress={stack ? undoRewrite : null} // Only trigger undoRewrite if stack is not empty
              disabled={stack.length === 0} // Disable the button when stack is empty
            >
              <Text className="text-center text-sm font-medium text-white">Discard Response</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

export default NewPost;
