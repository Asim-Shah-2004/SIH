import { SERVER_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const initSocket = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        if (!storedToken) {
          return;
        }
        setToken(storedToken);

        const socketInstance = io(SERVER_URL, {
          auth: { token: storedToken },
        });

        socketInstance.on('connect', () => {
          console.log('Socket connected');
        });

        socketInstance.on('error', (error) => {
          console.error('Socket error:', error);
        });

        setSocket(socketInstance);

        return () => socketInstance.disconnect();
      } catch (error) {
        console.error('Socket initialization error:', error);
      }
    };

    initSocket();
  }, []);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};
