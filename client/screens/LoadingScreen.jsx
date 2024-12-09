import { SERVER_URL, ML_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useEffect } from 'react';

import LoadingComponent from '../components/LoadingComponent';
import { useAuth } from '../providers/AuthProvider';

const MAX_RETRIES = 3;
const INITIAL_DELAY = 1000;

const LoadingScreen = ({ loading, setLoading }) => {
  const { setUser, setIsLoggedIn, setReqSet, setRecommendations } = useAuth();

  const fetchRecommendations = async (email, retryCount = 0, delay = INITIAL_DELAY) => {
    try {
      const response = await axios.get(`${ML_URL}/api/quantum_recommend_posts`, {
        params: { email: 'raymond.salinas@company.com' },
      });
      setRecommendations(response.data.recommendations);
    } catch (error) {
      console.log(`Attempt ${retryCount + 1} failed:`, error);

      if (retryCount < MAX_RETRIES) {
        console.log(`Retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        return fetchRecommendations(email, retryCount + 1, delay * 2);
      }

      console.error('Max retries reached. Failed to fetch recommendations.');
    }
  };

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

      await fetchRecommendations(response.data.email);

      setLoading(false);
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
