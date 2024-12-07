import { SERVER_URL } from '@env';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useCallback, useState, useEffect, useContext } from 'react';
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  Image,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';

import { AuthContext } from '../providers/CustomProvider';

const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000;

const ChatScreen = () => {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const { token } = useContext(AuthContext);

  const fetchChats = async (attempt = 0) => {
    try {
      if (!token) {
        navigation.navigate('Login');
        return;
      }

      const {
        data: { data },
      } = await axios.get(`${SERVER_URL}/chat/fetch`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setChats(data);
      setError(null);
      setRetryCount(0);
    } catch (err) {
      if (attempt < MAX_RETRIES) {
        const delay = INITIAL_RETRY_DELAY * Math.pow(2, attempt);
        setError(`Failed to fetch chats. Retrying in ${delay / 1000} seconds...`);
        setTimeout(() => {
          setRetryCount(attempt + 1);
          fetchChats(attempt + 1);
        }, delay);
      } else {
        setError(`Failed to fetch chats after ${MAX_RETRIES} attempts. Please try again.`);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchChats();
    setRefreshing(false);
  }, []);

  const handleChatPress = (item) => {
    navigation.navigate('Message', { chatData: item });
  };

  if (loading && !refreshing) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      {error ? (
        <View className="flex-1 items-center justify-center p-4">
          <Text className="mb-4 text-red-500">{error}</Text>
          {retryCount >= MAX_RETRIES && (
            <TouchableOpacity
              className="rounded-lg bg-primary px-4 py-2"
              onPress={() => {
                setLoading(true);
                setRetryCount(0);
                fetchChats(0);
              }}>
              <Text className="text-white">Retry</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <FlatList
          data={chats}
          keyExtractor={(item) => item.chatId}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          renderItem={({ item }) => (
            <TouchableOpacity
              className="mb-2 flex-row items-center border bg-white p-4"
              onPress={() => handleChatPress(item)}>
              <View className="relative">
                <Image
                  source={{
                    uri: item.profilePhoto || 'https://via.placeholder.com/50',
                  }}
                  className="h-12 w-12 rounded-full"
                />
              </View>
              <View className="ml-4 flex-1">
                <Text className="text-lg font-semibold text-text">{item.otherParticipantName}</Text>
                <Text className="mt-1 text-highlight">{item.lastMessage}</Text>
              </View>
              <View className="items-end">
                <Text className="text-sm text-highlight">
                  {new Date(item.lastMessageTimestamp).toLocaleDateString()}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

export default ChatScreen;
