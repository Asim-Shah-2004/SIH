import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  Image, 
  TouchableOpacity, 
  ScrollView, 
  Modal,
  Platform,
  KeyboardAvoidingView,
  Animated
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons, Feather, Ionicons } from '@expo/vector-icons';

// Expanded Alumni Data
const ALUMNI_DATA = [
  { 
    id: '1', 
    name: 'John Doe', 
    username: 'johndoe', 
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    bio: 'Software Engineer'
  },
  { 
    id: '2', 
    name: 'Jane Smith', 
    username: 'janesmith', 
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    bio: 'Product Manager'
  },
  { 
    id: '3', 
    name: 'Mike Johnson', 
    username: 'mikejohnson', 
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
    bio: 'Design Lead'
  },
  { 
    id: '4', 
    name: 'Emily Brown', 
    username: 'emilybrown', 
    avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
    bio: 'Marketing Specialist'
  },
  { 
    id: '5', 
    name: 'David Wilson', 
    username: 'davidwilson', 
    avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
    bio: 'Data Scientist'
  }
];

export default function NewPostScreen({ navigation }) {
  const [postContent, setPostContent] = useState('');
  const [mediaFiles, setMediaFiles] = useState([]);
  const [tagSuggestions, setTagSuggestions] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [showTagModal, setShowTagModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Advanced Tagging Logic
  const handleTagSearch = (searchText = '') => {
    const suggestions = ALUMNI_DATA.filter(alumni => 
      alumni.name.toLowerCase().includes(searchText.toLowerCase()) ||
      alumni.username.toLowerCase().includes(searchText.toLowerCase()) ||
      alumni.bio.toLowerCase().includes(searchText.toLowerCase())
    );
    
    setTagSuggestions(suggestions);
    setShowTagModal(true);
  };

  const handleSelectTag = (alumni) => {
    if (!selectedTags.find(tag => tag.id === alumni.id)) {
      setSelectedTags([...selectedTags, alumni]);
      
      // Replace the last partial tag with full tag
      const taggedText = postContent.replace(/@\w*$/, `@${alumni.username} `);
      setPostContent(taggedText);
    }
    
    setShowTagModal(false);
    setTagSuggestions([]);
  };

  const removeTag = (alumniToRemove) => {
    setSelectedTags(selectedTags.filter(tag => tag.id !== alumniToRemove.id));
  };

  // Media Picker
  const pickMedia = async (type) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: type === 'image' 
          ? ImagePicker.MediaTypeOptions.Images 
          : ImagePicker.MediaTypeOptions.Videos,
        allowsMultipleSelection: true,
        quality: 1,
      });

      if (!result.canceled) {
        const newFiles = result.assets.map(asset => ({
          type,
          uri: asset.uri
        }));
        setMediaFiles(prev => [...prev, ...newFiles]);
      }
    } catch (error) {
      console.error('Media selection error:', error);
    }
  };

  // Tag Selection Modal
  const TagSelectionModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showTagModal}
      onRequestClose={() => setShowTagModal(false)}
    >
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white rounded-t-2xl p-4 max-h-[70%]">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold">Tag People</Text>
            <TouchableOpacity onPress={() => setShowTagModal(false)}>
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
          </View>

          {/* Search Input */}
          <TextInput
            placeholder="Search people, roles, or departments"
            className="bg-gray-100 p-3 rounded-xl mb-4"
            onChangeText={handleTagSearch}
          />

          {/* Tag Suggestions */}
          <ScrollView>
            {tagSuggestions.map(alumni => (
              <TouchableOpacity 
                key={alumni.id}
                className="flex-row items-center p-3 border-b border-gray-200"
                onPress={() => handleSelectTag(alumni)}
              >
                <Image 
                  source={{ uri: alumni.avatar }}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <View>
                  <Text className="font-bold">{alumni.name}</Text>
                  <Text className="text-gray-500">{alumni.bio}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
    >
      {/* Tag Selection Modal */}
      <TagSelectionModal />

      {/* Header */}
      <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color="black" />
        </TouchableOpacity>
        
        <View className="flex-row space-x-2">
          {/* AI Magic Button */}
          <TouchableOpacity 
            className="bg-purple-500 p-2 rounded-full"
            onPress={() => {
              // AI Rewrite logic
              alert('AI Magic activated!');
            }}
          >
            <Ionicons name="sparkles" size={20} color="white" />
          </TouchableOpacity>

          {/* Tag Button */}
          <TouchableOpacity 
            className="bg-green-500 p-2 rounded-full"
            onPress={() => handleTagSearch()}
          >
            <Ionicons name="at" size={20} color="white" />
          </TouchableOpacity>

          {/* Post Button */}
          <TouchableOpacity 
            className="bg-blue-500 px-4 py-2 rounded-full"
            onPress={() => {
              // Post submission logic
              alert('Post submitted!');
            }}
          >
            <Text className="text-white font-bold">Post</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content Area */}
      <View className="flex-1 p-4">
        {/* Text Input */}
        <TextInput
          multiline
          placeholder="What's happening?"
          placeholderTextColor="#888"
          value={postContent}
          onChangeText={(text) => {
            setPostContent(text);
            
            // Trigger tag modal when @ is typed
            if (text.endsWith('@')) {
              handleTagSearch();
            }
          }}
          className="min-h-[150px] text-base bg-gray-50 p-3 rounded-xl"
        />

        {/* Selected Tags */}
        {selectedTags.length > 0 && (
          <ScrollView 
            horizontal 
            className="mt-4"
            showsHorizontalScrollIndicator={false}
          >
            {selectedTags.map(tag => (
              <View 
                key={tag.id} 
                className="bg-blue-100 px-3 py-2 rounded-full mr-2 flex-row items-center"
              >
                <Image 
                  source={{ uri: tag.avatar }}
                  className="w-6 h-6 rounded-full mr-2"
                />
                <Text className="text-blue-600 mr-2">@{tag.username}</Text>
                <TouchableOpacity onPress={() => removeTag(tag)}>
                  <Ionicons name="close" size={16} color="blue" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        )}

        {/* Media Upload Buttons */}
        <View className="flex-row space-x-4 mt-4">
          <TouchableOpacity
            className="flex-1 bg-gray-100 p-3 rounded-xl items-center flex-row justify-center"
            onPress={() => pickMedia('image')}
          >
            <Ionicons name="image" size={24} color="gray" />
            <Text className="ml-2 text-gray-700">Add Image</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 bg-gray-100 p-3 rounded-xl items-center flex-row justify-center"
            onPress={() => pickMedia('video')}
          >
            <Ionicons name="videocam" size={24} color="gray" />
            <Text className="ml-2 text-gray-700">Add Video</Text>
          </TouchableOpacity>
        </View>

        {/* Media Preview */}
        {mediaFiles.length > 0 && (
          <ScrollView 
            horizontal 
            className="mt-4"
            showsHorizontalScrollIndicator={false}
          >
            {mediaFiles.map((file, index) => (
              <View 
                key={index} 
                className="mr-4 relative rounded-xl overflow-hidden"
              >
                {file.type === 'image' ? (
                  <Image 
                    source={{ uri: file.uri }} 
                    className="w-40 h-40 rounded-xl"
                  />
                ) : (
                  <View className="w-40 h-40 bg-black rounded-xl justify-center items-center">
                    <Ionicons name="videocam" size={40} color="white" />
                  </View>
                )}
                <TouchableOpacity
                  className="absolute top-2 right-2 bg-black/50 rounded-full p-1"
                  onPress={() => {
                    setMediaFiles(prev => prev.filter((_, i) => i !== index));
                  }}
                >
                  <Ionicons name="close" size={16} color="white" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}