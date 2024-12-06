import { SERVER_URL } from '@env'; // Import the SERVER_URL from .env file
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, TouchableOpacity, ActivityIndicator } from 'react-native';

const UsersListPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUsers = async () => {
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        throw new Error('Token not found');
      }

      try {
        const response = await axios.get(`${SERVER_URL}/users/getAll`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data); // Assuming the response contains an array of users
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleConnect = async (userId) => {
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
    } catch (error) {
      console.error('Error sending connection request:', error);
      alert('Failed to send connection request');
    }
  };

  const renderUserItem = ({ item }) => (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        borderBottomWidth: 1,
        borderColor: '#ccc',
      }}>
      <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.fullName}</Text>
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity
          style={{
            backgroundColor: '#007BFF',
            padding: 10,
            borderRadius: 5,
            marginRight: 10,
          }}
          onPress={() => navigation.navigate('Profile', { name: item.fullName })}>
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>View Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: '#28A745',
            padding: 10,
            borderRadius: 5,
          }}
          onPress={() => handleConnect(item._id)}>
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Connect</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#f8f9fa',
        }}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={{ marginTop: 10, fontSize: 16 }}>Loading Users...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
      <FlatList
        data={users}
        keyExtractor={(item) => item._id}
        renderItem={renderUserItem}
        contentContainerStyle={{ padding: 10 }}
      />
    </View>
  );
};

export default UsersListPage;
