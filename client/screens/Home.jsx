import { useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import NewPost from '../components/home/NewPost';
import Post from '../components/home/Post';
import { useAuth } from '../providers/AuthProvider';

const Home = () => {
  const { recommendations, setRecommendations } = useAuth();

  const handleSubmitPost = (content) => {
    // TODO: Implement handleSubmitPost
  };

  const updatePostComments = (postId, newComment) => {
    setRecommendations((currentPosts) =>
      currentPosts.map((post) =>
        post.postId === postId
          ? {
              ...post,
              comments: {
                total: post.comments.total + 1,
                details: [newComment, ...(post.comments?.details || [])],
              },
            }
          : post
      )
    );
  };

  return (
    <View>
      <NewPost onSubmitPost={handleSubmitPost} />
      <FlatList
        data={recommendations}
        renderItem={({ item: post }) => (
          <Post key={post.postId} post={post} updateComments={updatePostComments} />
        )}
        keyExtractor={(item) => item.postId}
        contentContainerStyle={styles.container}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 6,
  },
});

export default Home;
