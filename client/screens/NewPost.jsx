import React, { useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';  // To include emojis or icon support

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
        // Here we mock a logic where you can pick either an image or a video
        if (!imageUri && !videoUri) {
            setImageUri('https://via.placeholder.com/400');  // Mock image URI
        } else if (!videoUri) {
            setVideoUri('https://www.w3schools.com/html/mov_bbb.mp4');  // Mock video URI
        }
    };

    const handleWriteWithAI = () => {
        // Logic for writing with AI (e.g., generating suggestions, prompts, etc.)
        alert('Write with AI feature is coming soon!');
    };

    const handleSentimentAnalysis = () => {
        // Logic for sentiment analysis (e.g., analyzing post content)
        alert('Sentiment Analysis feature is coming soon!');
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.heading}>Create a New Post</Text>

            {/* Post Content Input */}
            <TextInput
                style={styles.textInput}
                multiline
                placeholder="Write your post here..."
                value={postContent}
                onChangeText={handlePostContentChange}
                maxLength={3000}
            />
            <Text style={styles.charCount}>{postContent.length}/3000</Text>

            {/* Add Media Button */}
            <TouchableOpacity style={styles.button} onPress={handleMediaPick}>
                <MaterialIcons name="insert-photo" size={24} color="white" />
                <Text style={styles.buttonText}>Add Media</Text>
            </TouchableOpacity>

            {/* Image Display */}
            {imageUri ? <Image source={{ uri: imageUri }} style={styles.image} /> : null}

            {/* Video Display */}
            {videoUri ? (
                <View style={styles.videoContainer}>
                    <Text style={styles.videoText}>Video Preview (Mock)</Text>
                </View>
            ) : null}

            {/* Additional Options */}
            <TouchableOpacity style={styles.button} onPress={handleWriteWithAI}>
                <MaterialIcons name="create" size={24} color="white" />
                <Text style={styles.buttonText}>Write with AI</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={handleSentimentAnalysis}>
                <MaterialIcons name="analytics" size={24} color="white" />
                <Text style={styles.buttonText}>Sentiment Analysis</Text>
            </TouchableOpacity>

            {/* Submit Button */}
            <TouchableOpacity style={styles.button} onPress={() => alert('Post submitted')}>
                <Text style={styles.buttonText}>Submit Post</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f4f4f4',
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    textInput: {
        height: 150,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
        backgroundColor: '#fff',
        textAlignVertical: 'top',
    },
    charCount: {
        fontSize: 14,
        textAlign: 'right',
        color: '#888',
        marginTop: 5,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#007BFF',
        padding: 10,
        marginVertical: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        marginLeft: 10,
    },
    image: {
        width: '100%',
        height: 200,
        marginVertical: 10,
        borderRadius: 5,
        resizeMode: 'cover',
    },
    videoContainer: {
        width: '100%',
        height: 200,
        backgroundColor: '#333',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
        borderRadius: 5,
    },
    videoText: {
        color: '#fff',
        fontSize: 18,
    },
});
