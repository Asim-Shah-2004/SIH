// Post.js - A reusable Post component

import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, TextInput, Button, StyleSheet } from 'react-native';

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
        <View style={styles.postContainer}>
            <View style={styles.postHeader}>
                {postData.userProfilePic ? (
                    <Image source={{ uri: postData.userProfilePic }} style={styles.profilePic} />
                ) : (
                    <View style={styles.defaultProfilePic} />
                )}
                <View style={styles.headerText}>
                    <Text style={styles.username}>{postData.username}</Text>
                    <Text style={styles.timestamp}>{postData.timestamp}</Text>
                </View>
            </View>

            <Text style={styles.postText}>{postData.postText}</Text>

            {postData.image && <Image source={{ uri: postData.image }} style={styles.postImage} />}

            <View style={styles.actions}>
                <TouchableOpacity onPress={handleLike} style={styles.likeButton}>
                    <Text style={styles.likeText}>Like {likes}</Text>
                </TouchableOpacity>
            </View>

            {/* Comments */}
            <FlatList
                data={comments}
                renderItem={({ item }) => (
                    <View style={styles.comment}>
                        <Text style={styles.commentUser}>{item.user}:</Text>
                        <Text>{item.text}</Text>
                    </View>
                )}
                keyExtractor={(item, index) => index.toString()}
            />

            {/* Add Comment Section */}
            <View style={styles.addComment}>
                <TextInput
                    style={styles.commentInput}
                    placeholder="Add a comment..."
                    value={newComment}
                    onChangeText={setNewComment}
                />
                <Button title="Add" onPress={handleAddComment} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    postContainer: {
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 10,
        backgroundColor: '#fff',
    },
    postHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profilePic: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    defaultProfilePic: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#ccc',
    },
    headerText: {
        flexDirection: 'column',
    },
    username: {
        fontWeight: 'bold',
    },
    timestamp: {
        fontSize: 12,
        color: '#777',
    },
    postText: {
        fontSize: 16,
        marginVertical: 10,
    },
    postImage: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
        borderRadius: 8,
        marginVertical: 10,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    likeButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    likeText: {
        color: '#0077b5',
    },
    comment: {
        flexDirection: 'row',
        marginVertical: 5,
    },
    commentUser: {
        fontWeight: 'bold',
        marginRight: 5,
    },
    addComment: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    commentInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 20,
        paddingLeft: 10,
        marginRight: 10,
        width: '80%',
        height: 40,
    },
});

export default Post;
