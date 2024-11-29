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
        <View className="mb-5 border border-gray-300 rounded-lg p-4 bg-white shadow-sm">
            {/* Post Header */}
            <View className="flex-row items-center mb-3">
                {postData.userProfilePic ? (
                    <Image source={{ uri: postData.userProfilePic }} className="w-10 h-10 rounded-full mr-3" />
                ) : (
                    <View className="w-10 h-10 rounded-full bg-gray-300 mr-3" />
                )}
                <View>
                    <Text className="font-bold text-gray-900">{postData.username}</Text>
                    <Text className="text-xs text-gray-500">{postData.timestamp}</Text>
                </View>
            </View>

            {/* Post Content */}
            <Text className="text-base text-gray-800 mb-3">{postData.postText}</Text>

            {/* Post Image */}
            {postData.image && (
                <Image source={{ uri: postData.image }} className="w-full h-48 rounded-lg mb-3" />
            )}

            {/* Actions (Like Button) */}
            <View className="flex-row justify-between items-center mb-3">
                <TouchableOpacity onPress={handleLike} className="flex-row items-center">
                    <Text className="text-blue-600 font-semibold">Like {likes}</Text>
                </TouchableOpacity>
            </View>

            {/* Comments Section */}
            <FlatList
                data={comments}
                renderItem={({ item }) => (
                    <View className="flex-row items-start mb-2">
                        <Text className="font-semibold mr-2">{item.user}:</Text>
                        <Text>{item.text}</Text>
                    </View>
                )}
                keyExtractor={(item, index) => index.toString()}
            />

            {/* Add Comment Section */}
            <View className="flex-row items-center mt-3">
                <TextInput
                    className="flex-1 border border-gray-300 rounded-full px-3 py-2 mr-2"
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
