import { ML_URL, SERVER_URL } from '@env';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { FlatList, StyleSheet, View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NewPost from '../components/home/NewPost';
import Post from '../components/home/Post';

const Home = () => {
  const [posts, setPosts] = useState();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('Token not found');
      }
      setLoading(true);
      try {
        // const email = 'raymond.salinas@company.com'; // Replace with the actual email
        // const response = await axios.get(`${ML_URL}/api/quantum_recommend_posts`, {
        //   params: { email },
        // });

        const response2 = await axios.get(`${SERVER_URL}/posts`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setPosts(response2.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // TODO: Implement handleSubmitPost
  const updatePostComments = (postId, newComment) => {
    setPosts((currentPosts) =>
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
      <NewPost />
      {loading && <Text>Loading...</Text>}
      {posts && (
        <FlatList
          data={posts}
          renderItem={({ item: post }) => (
            <Post key={post.postId} post={post} updateComments={updatePostComments} />
          )}
          keyExtractor={(item) => item.postId}
          contentContainerStyle={styles.container}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 6,
  },
});

export default Home;
