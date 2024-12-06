import React, { useEffect } from 'react';
import { decode } from 'base-64'
import axios from 'axios';
import { AuthContext } from '../providers/CustomProvider'; // Assume AuthContext is properly set up
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SERVER_URL } from '@env';


import LoadingComponent from '../components/LoadingComponent';

const LoadingScreen = ({ loading, setLoading }) => {
    const { setUser, setIsLoggedIn, setReqSet } = React.useContext(AuthContext); // Assuming you have a setUser function in AuthContext
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
            const id = decodedToken.id;

            const response = await axios.get(`${SERVER_URL}/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUser(response.data);
            setReqSet(new Set(response.data.sentRequests));
            setTimeout(() => setLoading(false), 1500);
        } catch (err) {
            setIsLoggedIn(false);
            console.error('Error fetching user data:', err);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    return <LoadingComponent />;
};

export default LoadingScreen;
