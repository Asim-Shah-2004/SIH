import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
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
} from 'react-native';

// Expanded Alumni Data
const ALUMNI_DATA = [
  {
    id: '1',
    name: 'John Doe',
    username: 'johndoe',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    bio: 'Software Engineer',
  },
  {
    id: '2',
    name: 'Jane Smith',
    username: 'janesmith',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    bio: 'Product Manager',
  },
  {
    id: '3',
    name: 'Mike Johnson',
    username: 'mikejohnson',
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
    bio: 'Design Lead',
  },
  {
    id: '4',
    name: 'Emily Brown',
    username: 'emilybrown',
    avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
    bio: 'Marketing Specialist',
  },
  {
    id: '5',
    name: 'David Wilson',
    username: 'davidwilson',
    avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
    bio: 'Data Scientist',
  },
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
    const suggestions = ALUMNI_DATA.filter(
      (alumni) =>
        alumni.name.toLowerCase().includes(searchText.toLowerCase()) ||
        alumni.username.toLowerCase().includes(searchText.toLowerCase()) ||
        alumni.bio.toLowerCase().includes(searchText.toLowerCase())
    );

    setTagSuggestions(suggestions);
    setShowTagModal(true);
  };

  const handleSelectTag = (alumni) => {
    if (!selectedTags.find((tag) => tag.id === alumni.id)) {
      setSelectedTags([...selectedTags, alumni]);

      // Replace the last partial tag with full tag
      const taggedText = postContent.replace(/@\w*$/, `@${alumni.username} `);
      setPostContent(taggedText);
    }

    setShowTagModal(false);
    setTagSuggestions([]);
  };

  const removeTag = (alumniToRemove) => {
    setSelectedTags(selectedTags.filter((tag) => tag.id !== alumniToRemove.id));
  };

  // Media Picker
  const pickMedia = async (type) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes:
          type === 'image'
            ? ImagePicker.MediaTypeOptions.Images
            : ImagePicker.MediaTypeOptions.Videos,
        allowsMultipleSelection: true,
        quality: 1,
      });

      if (!result.canceled) {
        const newFiles = result.assets.map((asset) => ({
          type,
          uri: asset.uri,
        }));
        setMediaFiles((prev) => [...prev, ...newFiles]);
      }
    } catch (error) {
      console.error('Media selection error:', error);
    }
  };

  // Tag Selection Modal
  const TagSelectionModal = () => (
    <Modal
      animationType="slide"
      transparent
      visible={showTagModal}
      onRequestClose={() => setShowTagModal(false)}>
      <View className="flex-1 justify-end bg-black/50">
        <View className="max-h-[70%] rounded-t-2xl bg-white p-4">
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-xl font-bold">Tag People</Text>
            <TouchableOpacity onPress={() => setShowTagModal(false)}>
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
          </View>

          {/* Search Input */}
          <TextInput
            placeholder="Search people, roles, or departments"
            className="mb-4 rounded-xl bg-gray-100 p-3"
            onChangeText={handleTagSearch}
          />

          {/* Tag Suggestions */}
          <ScrollView>
            {tagSuggestions.map((alumni) => (
              <TouchableOpacity
                key={alumni.id}
                className="flex-row items-center border-b border-gray-200 p-3"
                onPress={() => handleSelectTag(alumni)}>
                <Image source={{ uri: alumni.avatar }} className="mr-4 h-12 w-12 rounded-full" />
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
      className="flex-1 bg-white">
      {/* Tag Selection Modal */}
      <TagSelectionModal />

      {/* Header */}
      <View className="flex-row items-center justify-between border-b border-gray-200 p-4">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color="black" />
        </TouchableOpacity>

        <View className="flex-row space-x-2">
          {/* AI Magic Button */}
          <TouchableOpacity
            className="rounded-full bg-purple-500 p-2"
            onPress={() => {
              // AI Rewrite logic
              alert('AI Magic activated!');
            }}>
            <Ionicons name="sparkles" size={20} color="white" />
          </TouchableOpacity>

          {/* Tag Button */}
          <TouchableOpacity
            className="rounded-full bg-green-500 p-2"
            onPress={() => handleTagSearch()}>
            <Ionicons name="at" size={20} color="white" />
          </TouchableOpacity>

          {/* Post Button */}
          <TouchableOpacity
            className="rounded-full bg-blue-500 px-4 py-2"
            onPress={() => {
              // Post submission logic
              alert('Post submitted!');
            }}>
            <Text className="font-bold text-white">Post</Text>
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
          className="min-h-[150px] rounded-xl bg-gray-50 p-3 text-base"
        />

        {/* Selected Tags */}
        {selectedTags.length > 0 && (
          <ScrollView horizontal className="mt-4" showsHorizontalScrollIndicator={false}>
            {selectedTags.map((tag) => (
              <View
                key={tag.id}
                className="mr-2 flex-row items-center rounded-full bg-blue-100 px-3 py-2">
                <Image source={{ uri: tag.avatar }} className="mr-2 h-6 w-6 rounded-full" />
                <Text className="mr-2 text-blue-600">@{tag.username}</Text>
                <TouchableOpacity onPress={() => removeTag(tag)}>
                  <Ionicons name="close" size={16} color="blue" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        )}

        {/* Media Upload Buttons */}
        <View className="mt-4 flex-row space-x-4">
          <TouchableOpacity
            className="flex-1 flex-row items-center justify-center rounded-xl bg-gray-100 p-3"
            onPress={() => pickMedia('image')}>
            <Ionicons name="image" size={24} color="gray" />
            <Text className="ml-2 text-gray-700">Add Image</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 flex-row items-center justify-center rounded-xl bg-gray-100 p-3"
            onPress={() => pickMedia('video')}>
            <Ionicons name="videocam" size={24} color="gray" />
            <Text className="ml-2 text-gray-700">Add Video</Text>
          </TouchableOpacity>
        </View>

        {/* Media Preview */}
        {mediaFiles.length > 0 && (
          <ScrollView horizontal className="mt-4" showsHorizontalScrollIndicator={false}>
            {mediaFiles.map((file, index) => (
              <View key={index} className="relative mr-4 overflow-hidden rounded-xl">
                {file.type === 'image' ? (
                  <Image source={{ uri: file.uri }} className="h-40 w-40 rounded-xl" />
                ) : (
                  <View className="h-40 w-40 items-center justify-center rounded-xl bg-black">
                    <Ionicons name="videocam" size={40} color="white" />
                  </View>
                )}
                <TouchableOpacity
                  className="absolute right-2 top-2 rounded-full bg-black/50 p-1"
                  onPress={() => {
                    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
                  }}>
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
