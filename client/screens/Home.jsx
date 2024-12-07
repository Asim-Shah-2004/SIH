import { useState, useEffect } from 'react';
import { FlatList, StyleSheet } from 'react-native';

import NewPost from '../components/home/NewPost';
import Post from '../components/home/Post';
import { posts } from '../constants/posts/postData';

const Home = () => {
  const [postData, setPostData] = useState([]);

  useEffect(() => {
    setPostData(posts);
  }, []);

  const handleSubmitPost = (content) => {
    const post = {
      userId: Date.now(),
      content,
      timestamp: new Date().toISOString(),
    };
    setPostData([post, ...postData]);
  };

  return (
    <FlatList
      ListHeaderComponent={<NewPost onSubmitPost={handleSubmitPost} />}
      data={postData}
      renderItem={({ item }) => <Post key={item.userId} postData={item} />}
      keyExtractor={(item) => item.userId.toString()}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 6,
  },
});

export default Home;
