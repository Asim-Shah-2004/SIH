import { SERVER_URL } from '@env';
import axios from 'axios';
import React, { useState, useRef, useEffect, useContext } from 'react';
import { View, ScrollView, Text } from 'react-native';

import DateSeparator from '../components/message/DateSeparator';
import InputBar from '../components/message/InputBar';
import MessageBubble from '../components/message/MessageBubble';
import { sampleMessages } from '../constants/messageData';
import { AuthContext } from '../providers/CustomProvider';
import { useSocket } from '../providers/SocketProvider';
import { formatMessageDate, groupMessagesByDate } from '../utils/dateUtils';
import { MessageService } from '../utils/messageUtils';

const MessageScreen = ({ route }) => {
  const { chatData } = route.params;
  const socket = useSocket();
  const { user, token } = useContext(AuthContext);

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState(null);
  const [uploadingMessages, setUploadingMessages] = useState({}); // Track uploading messages
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const scrollViewRef = useRef();

  useEffect(() => {
    if (!socket) return;

    // Join chat room
    socket.emit('joinChat', chatData.chatId);

    // Listen for new messages
    socket.on('receiveMessage', (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    // Fetch chat history
    fetchMessages();

    return () => {
      socket.emit('leaveChat', chatData.chatId);
      socket.off('receiveMessage');
    };
  }, [socket, chatData.chatId]);

  const fetchMessages = async (pageNum = page) => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    try {
      const response = await axios.get(
        `${SERVER_URL}/chat/${chatData.chatId}/messages?page=${pageNum}&limit=50`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { messages: chatMessages, pagination } = response.data.data;

      if (pageNum === 1) setMessages(chatMessages);
      else setMessages((prev) => [...chatMessages, ...prev]); // Prepend older messages

      setHasMore(pagination.hasMore);
      setPage(pageNum);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoadingMore(false);
      setLoading(false);
    }
  };

  const handleScroll = (event) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;

    // Check if user is near the top to load more messages
    if (contentOffset.y < 100 && hasMore && !isLoadingMore) {
      fetchMessages(page + 1);
    }
  };

  const handleSend = () => {
    if (message.trim().length === 0 || !socket) return;

    const newMessage = {
      type: 'text',
      text: message,
      sender: user.email,
      timestamp: Date.now(),
    };

    socket.emit('sendMessage', {
      chatId: chatData.chatId,
      message: newMessage,
    });

    // Optimistically add message to UI
    setMessages((prev) => [...prev, { ...newMessage, sender: user.email }]);
    setMessage('');
  };

  const handleMediaSend = async (messagePromise, tempId) => {
    // Add temporary message with uploading state
    const tempMessage = {
      id: tempId,
      timestamp: Date.now(),
      sender: user.email,
      isUploading: true,
      uploadFailed: false,
    };
    setMessages((prev) => [...prev, tempMessage]);
    setUploadingMessages((prev) => ({ ...prev, [tempId]: true }));

    try {
      const newMessage = await messagePromise;
      if (newMessage) {
        socket.emit('sendMessage', {
          chatId: chatData.chatId,
          message: newMessage,
        });
        // Replace temp message with actual message
        setMessages((prev) =>
          prev.map((msg) => (msg.id === tempId ? { ...newMessage, sender: user.email } : msg))
        );
      } else {
        // Handle upload failure
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === tempId ? { ...msg, uploadFailed: true, isUploading: false } : msg
          )
        );
      }
    } catch (error) {
      // Handle error state
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempId ? { ...msg, uploadFailed: true, isUploading: false } : msg
        )
      );
    } finally {
      setUploadingMessages((prev) => {
        const newState = { ...prev };
        delete newState[tempId];
        return newState;
      });
    }
  };

  const handleAttachment = async () => {
    if (!socket) return;
    const tempId = `temp-${Date.now()}`;
    handleMediaSend(MessageService.handleDocumentAttachment(), tempId);
  };

  const handleImagePicker = async (useCamera = false) => {
    const tempId = `temp-${Date.now()}`;
    handleMediaSend(MessageService.handleImagePicker(useCamera), tempId);
  };

  const startRecording = async () => {
    const newRecording = await MessageService.startRecording();
    if (newRecording) {
      setRecording(newRecording);
      setIsRecording(true);
    }
  };

  const stopRecording = async () => {
    const tempId = `temp-${Date.now()}`;
    handleMediaSend(MessageService.stopRecording(recording), tempId);
    setRecording(null);
    setIsRecording(false);
  };

  const renderMessages = () => {
    const groupedMessages = groupMessagesByDate(messages);
    return Object.entries(groupedMessages).map(([date, msgs]) => (
      <View key={`date-group-${date}`}>
        <DateSeparator date={formatMessageDate(msgs[0].timestamp)} />
        {msgs.map((msg) => (
          <MessageBubble
            key={msg._id || `temp-${msg.timestamp}`}
            {...msg}
            isUploading={!!uploadingMessages[msg._id]}
          />
        ))}
      </View>
    ));
  };

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        ref={scrollViewRef}
        className="flex-1 px-4"
        onScroll={handleScroll}
        scrollEventThrottle={16} // Improve scroll performance
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
        }}
        onContentSizeChange={() => {
          scrollViewRef.current?.scrollToEnd({ animated: false });
        }}>
        {isLoadingMore && (
          <View className="items-center py-2">
            <Text>Loading...</Text>
          </View>
        )}
        {renderMessages()}
      </ScrollView>

      <InputBar
        message={message}
        setMessage={setMessage}
        handleSend={handleSend}
        handleAttachment={handleAttachment}
        handleImagePicker={handleImagePicker}
        isRecording={isRecording}
        startRecording={startRecording}
        stopRecording={stopRecording}
      />
    </View>
  );
};

export default MessageScreen;
