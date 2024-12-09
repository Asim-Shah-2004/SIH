import { SERVER_URL } from '@env';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useState, useRef, useEffect, useMemo } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
  PanResponder,
  Animated,
} from 'react-native';

import { useAuth } from '../../providers/AuthProvider';

const CommentModal = ({ isVisible, onClose, postData, updateComments }) => {
  const [newComment, setNewComment] = useState('');
  const panY = useRef(new Animated.Value(0)).current;
  const { user, token } = useAuth();

  // Reset pan position when modal visibility changes
  useEffect(() => {
    if (isVisible) {
      panY.setValue(0);
      panY.setOffset(0);
    }
  }, [isVisible]);

  const translateY = panY.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [0, 0, 1],
  });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        // Only allow downward drag
        if (gestureState.dy > 0) {
          panY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 50) {
          // If dragged down more than 50px, close the modal
          handleClose();
        } else {
          // Otherwise, snap back to initial position
          Animated.spring(panY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    try {
      // const response = await axios.post(`${SERVER_URL}/posts/comment`, {
      //   postId: postData._id,
      //   email: user.email,
      //   text: newComment,
      // });

      const newCommentObj = {
        text: newComment,
        userId: user.fullName,
        author: {
          imageUrl: user.profilePicture,
        },
        createdAt: new Date().toISOString(),
      };

      // Update the comments in parent components
      updateComments(postData.post_id, newCommentObj);
      setNewComment('');
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  // Add relative time formatting
  const getRelativeTime = (date) => {
    if (!date) return 'unknown';
    const now = new Date();
    const posted = new Date(date);
    const diff = Math.floor((now - posted) / 1000); // seconds

    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return posted.toLocaleDateString();
  };

  // Sort comments to show user's comments first
  const sortedComments = useMemo(() => {
    if (!postData.comments) return [];
    return [...postData.comments].sort((a, b) => {
      // User's comments first
      if (a.userId === user?.fullName && b.userId !== user?.fullName) return -1;
      if (a.userId !== user?.fullName && b.userId === user?.fullName) return 1;
      // Then sort by date
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [postData.comments, user?.fullName]);

  const handleClose = () => {
    panY.setValue(0);
    onClose();
  };

  return (
    <Modal animationType="slide" transparent visible={isVisible} onRequestClose={handleClose}>
      <View className="flex-1 bg-black/60">
        <Animated.View
          className="mt-8 flex-1 rounded-t-[32px] bg-white shadow-2xl"
          style={{ transform: [{ translateY }] }}>
          {/* Drag Handle */}
          <View
            {...panResponder.panHandlers}
            className="absolute left-0 right-0 top-0 h-8 items-center justify-center">
            <View className="h-1 w-16 rounded-full bg-gray-300" />
          </View>

          {/* Header - adjusted padding for drag handle */}
          <View className="mt-6 flex-row items-center justify-between border-b border-gray-200 p-4">
            <Text className="text-xl font-bold">Comments</Text>
            <TouchableOpacity onPress={handleClose} className="rounded-full bg-gray-100 p-2">
              <FontAwesome name="times" size={20} color="#374151" />
            </TouchableOpacity>
          </View>

          {/* Comments List */}
          <ScrollView className="flex-1 p-4">
            {sortedComments.length > 0 ? (
              sortedComments.map((comment, index) => (
                <View
                  key={`${comment.userId}-${index}`}
                  className="mb-4 border-b border-gray-100 pb-4">
                  <View className="flex-row items-start">
                    <Image
                      source={{
                        uri:
                          comment?.author?.profileImage || 'https://ui-avatars.com/api/?name=User',
                      }}
                      className="h-8 w-8 rounded-full"
                    />
                    <View className="ml-3 flex-1">
                      <Text className="font-semibold text-gray-900">
                        {comment.userId || 'User'}
                      </Text>
                      <Text className="text-gray-600">{comment.text}</Text>
                      <Text className="mt-1 text-xs text-gray-400">
                        {getRelativeTime(comment.createdAt)}
                      </Text>
                    </View>
                  </View>
                </View>
              ))
            ) : (
              <Text className="text-center text-gray-500">No comments yet</Text>
            )}
          </ScrollView>

          {/* Comment Input */}
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="border-t border-gray-200 bg-white p-4">
            <View className="flex-row items-center">
              <TextInput
                className="mr-2 flex-1 rounded-full bg-gray-100 px-4 py-4"
                placeholder="Add a comment..."
                value={newComment}
                onChangeText={setNewComment}
                multiline
              />
              <TouchableOpacity
                onPress={handleSubmitComment}
                className="rounded-full border p-2"
                disabled={!newComment.trim()}>
                <Ionicons name="send" size={20} className="text-white" />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default CommentModal;
