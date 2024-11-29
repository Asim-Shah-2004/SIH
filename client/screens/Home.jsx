import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import Post from '../components/Post'; // Adjust the import based on your project structure
import posts from '../constants/posts/postData'; // Adjust the import for posts data

const Home = () => {
  const [postData, setPostData] = useState([]);

  useEffect(() => {
    // Simulating fetching data
    setPostData(posts);
  }, []);

  return (
    <FlatList
      data={postData}
      renderItem={({ item }) => <Post key={item.userId} postData={item} />}
      keyExtractor={(item) => item.userId.toString()}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});

export default Home;
