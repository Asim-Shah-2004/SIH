// utils/connectionUtils.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SERVER_URL } from '@env'; // Assuming SERVER_URL is imported from config

export const connectHandler = async (userId) => {
  const token = await AsyncStorage.getItem('token');

  if (!token) {
    throw new Error('Token not found');
  }

  try {
    const response = await axios.post(
      `${SERVER_URL}/connections/send`,
      { targetUserId: userId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    alert('Connection request sent!');
    console.log(response.data.message);
    return response.data.user;
  } catch (error) {
    console.error('Error sending connection request:', error);
    alert('Failed to send connection request');
  }
};
