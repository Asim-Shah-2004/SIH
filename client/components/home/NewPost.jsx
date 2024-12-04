import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  ScrollView 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as VideoThumbnails from 'expo-video-thumbnails';
import Icon from 'react-native-vector-icons/Ionicons';

const NewPost = ({ onSubmitPost, user }) => {
  const [newPost, setNewPost] = useState('');
  const [media, setMedia] = useState([]);
  const [aiSuggestions, setAiSuggestions] = useState([]);

  const handleSubmit = () => {
    if (newPost.trim() || media.length > 0) {
      onSubmitPost({
        text: newPost,
        media: media
      });
      setNewPost('');
      setMedia([]);
      setAiSuggestions([]);
    }
  };

  const pickMedia = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
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
                thumbnail: uri 
              };
            } catch (e) {
              console.error('Error generating video thumbnail', e);
              return { 
                type: 'video', 
                uri: asset.uri 
              };
            }
          }
          return { 
            type: 'image', 
            uri: asset.uri 
          };
        })
      );

      setMedia(prevMedia => [...prevMedia, ...newMedia]);
    }
  };

  const removeMedia = (index) => {
    setMedia(prevMedia => prevMedia.filter((_, i) => i !== index));
  };

  const generateAISuggestions = async () => {
    const suggestions = [
      "Make this more professional",
      "Add a touch of humor",
      "Simplify the language"
    ];
    setAiSuggestions(suggestions);
  };

  const applyAISuggestion = (suggestion) => {
    setNewPost(suggestion);
  };

  const renderMediaPreview = () => {
    return (
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.mediaContainer}
      >
        {media.map((item, index) => (
          <View key={index} style={styles.mediaItem}>
            {item.type === 'image' ? (
              <Image 
                source={{ uri: item.uri }} 
                style={styles.mediaPreview} 
              />
            ) : (
              <Image 
                source={{ uri: item.thumbnail || item.uri }} 
                style={styles.mediaPreview} 
              />
            )}
            <TouchableOpacity 
              style={styles.removeMediaButton} 
              onPress={() => removeMedia(index)}
            >
              <Icon name="close-circle" size={24} color="white" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Image 
          source={{ uri: user?.avatar || 'https://via.placeholder.com/40' }} 
          style={styles.avatar} 
        />
        <TextInput
          style={styles.postInput}
          placeholder="What's on your mind?"
          multiline
          value={newPost}
          onChangeText={setNewPost}
          placeholderTextColor="#657786"
        />
      </View>

      {media.length > 0 && renderMediaPreview()}

      <View style={styles.postActions}>
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton} onPress={pickMedia}>
            <Icon name="image-outline" size={24} color="#4a4a4a" />
            <Text style={styles.actionButtonText}>Media</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={generateAISuggestions}
          >
            <Icon name="sparkles-outline" size={24} color="#4a4a4a" />
            <Text style={styles.actionButtonText}>AI Helper</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={[
            styles.submitButton, 
            (!newPost.trim() && media.length === 0) && styles.submitButtonDisabled
          ]}
          onPress={handleSubmit}
          disabled={!newPost.trim() && media.length === 0}
        >
          <Text style={styles.submitButtonText}>Post</Text>
        </TouchableOpacity>
      </View>

      {aiSuggestions.length > 0 && (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.aiSuggestionsContainer}
          contentContainerStyle={styles.aiSuggestionsContent}
        >
          {aiSuggestions.map((suggestion, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.aiSuggestionChip}
              onPress={() => applyAISuggestion(suggestion)}
            >
              <Text style={styles.aiSuggestionText}>{suggestion}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  postInput: {
    flex: 1,
    minHeight: 80,
    maxHeight: 120,
    fontSize: 16,
    textAlignVertical: 'top',
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
  },
  mediaContainer: {
    marginTop: 12,
    marginBottom: 12,
  },
  mediaItem: {
    position: 'relative',
    marginRight: 10,
  },
  mediaPreview: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  removeMediaButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 15,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionButtonText: {
    color: '#4a4a4a',
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: '#000',
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  submitButtonDisabled: {
    backgroundColor: '#0009',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 15,
  },
  aiSuggestionsContainer: {
    marginTop: 16,
    marginBottom: 8,
    maxHeight: 50,
  },
  aiSuggestionsContent: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 4,
  },
  aiSuggestionChip: {
    backgroundColor: '#e8f3ff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#cce4ff',
    marginRight: 8,
  },
  aiSuggestionText: {
    color: '#0066cc',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default NewPost;