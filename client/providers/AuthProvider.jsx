import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import { createContext, useState, useEffect, useContext } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [reqSet, setReqSet] = useState(new Set());

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const loggedInValue = await AsyncStorage.getItem('isLoggedIn');
        const roleValue = await AsyncStorage.getItem('role');
        const token = await AsyncStorage.getItem('token');
        setIsLoggedIn(loggedInValue === 'true');
        if (token) {
          const decodedToken = jwtDecode(token);
          const currentTime = Date.now() / 1000;
          if (decodedToken.exp < currentTime) {
            setIsLoggedIn(false);
            setToken(null);
            await AsyncStorage.removeItem('token');
          } else {
            setToken(token);
          }
        }
        setRole(roleValue || null);
        setLoading(false);
      } catch (e) {
        console.error('Error reading AsyncStorage:', e);
      }
    };

    checkAuthStatus();
  }, []);

  if (loading) {
    return (
      <View className="h-full w-full bg-white">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading .....</Text>
      </View>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        role,
        setRole,
        reqSet,
        setReqSet,
        user,
        setUser,
        token,
        setToken,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
