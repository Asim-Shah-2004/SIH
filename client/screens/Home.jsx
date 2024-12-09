import { ML_URL } from '@env';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { FlatList, StyleSheet, View, Text } from 'react-native';

import NewPost from '../components/home/NewPost';
import Post from '../components/home/Post';

const Home = () => {
  const [posts, setPosts] = useState();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const email = 'raymond.salinas@company.com'; // Replace with the actual email
        const response = await axios.get(`${ML_URL}/api/quantum_recommend_posts`, {
          params: { email },
        });
        setPosts(response.data.recommendations);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmitPost = (content) => {};

  const updatePostComments = (postId, newComment) => {
    setPosts((currentPosts) =>
      currentPosts.map((post) =>
        post.post_id === postId
          ? { ...post, comments: [newComment, ...(post.comments || [])] }
          : post
      )
    );
  };

  return (
    <View>
      <NewPost onSubmitPost={handleSubmitPost} />
      {loading && <Text>Loading...</Text>}
      {posts && (
        <FlatList
          data={posts}
          renderItem={({ item }) => (
            <Post key={item.post_id} postData={item} updateComments={updatePostComments} />
          )}
          keyExtractor={(item) => item.post_id.toString()}
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
