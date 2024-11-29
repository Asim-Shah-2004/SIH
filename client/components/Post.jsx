import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, TextInput, Button } from 'react-native';

const Post = ({ postData }) => {
  const [likes, setLikes] = useState(postData.likes);
  const [comments, setComments] = useState(postData.comments);
  const [newComment, setNewComment] = useState('');

  // Handle Like button
  const handleLike = () => {
    setLikes(likes + 1); // Increase like count
  };

  // Handle Add Comment button
  const handleAddComment = () => {
    if (newComment.trim()) {
      setComments([...comments, { text: newComment, user: 'You' }]);
      setNewComment(''); // Clear the input field
    }
  };

  return (
    <View className="mb-5 rounded-lg border border-gray-300 bg-white p-4 shadow-sm">
      {/* Post Header */}
      <View className="mb-3 flex-row items-center">
        {postData.userProfilePic ? (
          <Image
            source={{ uri: postData.userProfilePic }}
            className="mr-3 h-10 w-10 rounded-full"
          />
        ) : (
          <View className="mr-3 h-10 w-10 rounded-full bg-gray-300" />
        )}
        <View>
          <Text className="font-bold text-gray-900">{postData.username}</Text>
          <Text className="text-xs text-gray-500">{postData.timestamp}</Text>
        </View>
      </View>

      {/* Post Content */}
      <Text className="mb-3 text-base text-gray-800">{postData.postText}</Text>

      {/* Post Image */}
      {postData.image && (
        <Image source={{ uri: postData.image }} className="mb-3 h-48 w-full rounded-lg" />
      )}

      {/* Actions (Like Button) */}
      <View className="mb-3 flex-row items-center justify-between">
        <TouchableOpacity onPress={handleLike} className="flex-row items-center">
          <Text className="font-semibold text-blue-600">Like {likes}</Text>
        </TouchableOpacity>
      </View>

      {/* Comments Section */}
      <FlatList
        data={comments}
        renderItem={({ item }) => (
          <View className="mb-2 flex-row items-start">
            <Text className="mr-2 font-semibold">{item.user}:</Text>
            <Text>{item.text}</Text>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />

      {/* Add Comment Section */}
      <View className="mt-3 flex-row items-center">
        <TextInput
          className="mr-2 flex-1 rounded-full border border-gray-300 px-3 py-2"
          placeholder="Add a comment..."
          value={newComment}
          onChangeText={setNewComment}
        />
        <Button title="Add" onPress={handleAddComment} />
      </View>
    </View>
  );
};

export default Post;
