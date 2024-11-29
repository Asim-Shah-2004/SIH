import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, TextInput, Button } from 'react-native';

const Post = ({ postData }) => {
  const [likes, setLikes] = useState(postData.likes.length);
  const [comments, setComments] = useState(postData.comments);
  const [reactions, setReactions] = useState(postData.reactions); // Handle reactions
  const [newComment, setNewComment] = useState('');

  // Handle Like button
  const handleLike = () => {
    setLikes(likes + 1); // Increase like count
  };

  // Handle Add Comment button
  const handleAddComment = () => {
    if (newComment.trim()) {
      setComments([
        ...comments,
        { user: 'You', text: newComment, createdAt: new Date(), updatedAt: new Date() },
      ]);
      setNewComment(''); // Clear the input field
    }
  };

  // Handle Reactions (e.g., love, haha, wow, etc.)
  const handleReaction = (reactionType) => {
    setReactions([
      ...reactions,
      { userId: 'You', type: reactionType }, // Add reaction
    ]);
  };

  return (
    <View style={{ marginBottom: 20, borderRadius: 10, borderWidth: 1, borderColor: '#ccc', padding: 15, backgroundColor: '#fff' }}>
      {/* Post Header */}
      <View style={{ marginBottom: 10, flexDirection: 'row', alignItems: 'center' }}>
        <Image
          source={{ uri: 'https://www.example.com/userProfilePic.jpg' }} // Use user profile pic
          style={{ marginRight: 10, height: 40, width: 40, borderRadius: 20 }}
        />
        <View>
          <Text style={{ fontWeight: 'bold', fontSize: 16 }}>John Doe</Text>
          <Text style={{ fontSize: 12, color: '#888' }}>2 hours ago</Text>
        </View>
      </View>

      {/* Post Content */}
      <Text style={{ marginBottom: 10, fontSize: 16, color: '#333' }}>{postData.text}</Text>

      {/* Media (Image or Video) */}
      {postData.media && postData.media.length > 0 && (
        <FlatList
          data={postData.media}
          horizontal
          renderItem={({ item }) => (
            <View style={{ marginRight: 10 }}>
              {item.type === 'image' ? (
                <Image
                  source={{ uri: item.url }}
                  style={{ height: 200, width: 200, borderRadius: 10 }}
                />
              ) : item.type === 'video' ? (
                <Text style={{ color: '#555' }}>[Video Placeholder]</Text> // Add video component if needed
              ) : null}
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      )}

      {/* Actions (Like Button, Reactions) */}
      <View style={{ marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
        <TouchableOpacity onPress={handleLike} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontWeight: 'bold', color: '#007BFF' }}>Like {likes}</Text>
        </TouchableOpacity>

        {/* Reaction Buttons */}
        <View style={{ flexDirection: 'row' }}>
          {['love', 'haha', 'wow', 'sad', 'angry'].map((reactionType) => (
            <TouchableOpacity
              key={reactionType}
              onPress={() => handleReaction(reactionType)}
              style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}
            >
              <Text style={{ fontWeight: 'bold', color: '#666' }}>{reactionType}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Comments Section */}
      <FlatList
        data={comments}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 5, flexDirection: 'row', alignItems: 'flex-start' }}>
            <Text style={{ fontWeight: 'bold', marginRight: 5 }}>{item.user}:</Text>
            <Text>{item.text}</Text>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />

      {/* Add Comment Section */}
      <View style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center' }}>
        <TextInput
          style={{
            flex: 1,
            padding: 8,
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 20,
            marginRight: 10,
            fontSize: 14,
          }}
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
