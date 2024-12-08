import { SERVER_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useContext, useEffect } from 'react';

import LoadingComponent from '../components/LoadingComponent';
import { AuthContext } from '../providers/CustomProvider';

const LoadingScreen = ({ loading, setLoading }) => {
  const { setUser, setIsLoggedIn, setReqSet } = useContext(AuthContext);

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('Token not found');
      }

      const decodedToken = jwtDecode(token);
      const id = decodedToken.id;

      const response = await axios.get(`${SERVER_URL}/users/fetch/${id}`, {
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
