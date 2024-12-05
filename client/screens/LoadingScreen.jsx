import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { decode } from 'base-64'
import axios from 'axios';
import { AuthContext } from '../providers/CustomProvider'; // Assume AuthContext is properly set up
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SERVER_URL } from '@env';
import { useNavigation } from '@react-navigation/native';

const LoadingScreen = ({ loading, setLoading }) => {
    const { setUser } = React.useContext(AuthContext); // Assuming you have a setUser function in AuthContext
    const decodeJWT = (token) => {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decode(base64); // Decode base64 to string (JSON)
        return JSON.parse(jsonPayload); // Parse the string to JSON
    };
    const fetchUserData = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                throw new Error('Token not found');
            }

            const decodedToken = decodeJWT(token);
            const email = decodedToken.email;

            const response = await axios.get(`${SERVER_URL}/users/${email}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUser(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching user data:', err);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    return (
        <View>
            <Text>Loading...</Text>
        </View>
    );
};

export default LoadingScreen;
