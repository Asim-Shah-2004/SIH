// App.js - Rendering multiple posts

import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet } from 'react-native';

import Post from '../components/Post';

const Home = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Simulating a backend fetch
    const fetchPosts = async () => {
      const data = [
        {
          id: 1,
          username: 'John Doe',
          userProfilePic: 'https://www.example.com/johndoe.jpg',
          timestamp: '2 hours ago',
          postText: 'This is my first post on React Native!',
          image: 'https://www.example.com/image.jpg',
          likes: 3,
          comments: [
            { user: 'Jane Doe', text: 'Nice post!' },
            { user: 'Jack Smith', text: 'Great work!' },
          ],
        },
        {
          id: 2,
          username: 'Sarah Lee',
          userProfilePic: 'https://www.example.com/sarahlee.jpg',
          timestamp: '1 day ago',
          postText: 'Exploring new features in React Native.',
          image: '',
          likes: 10,
          comments: [{ user: 'Anna Miller', text: 'Looking forward to the tutorial!' }],
        },
      ];
      setPosts(data);
    };

    fetchPosts();
  }, []);

  return (
    <FlatList
      data={posts}
      renderItem={({ item }) => <Post key={item.id} postData={item} />}
      keyExtractor={(item) => item.id.toString()}
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
