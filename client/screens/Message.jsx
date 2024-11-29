import { Audio } from 'expo-av';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import React, { useState, useRef } from 'react';
import { View, ScrollView, Text, Alert } from 'react-native';

import InputBar from '../components/message/InputBar';
import MessageBubble from '../components/message/MessageBubble';
import { sampleMessages } from '../constants/messageData';
import { formatMessageDate, groupMessagesByDate } from '../utils/dateUtils';

const DateSeparator = ({ date }) => (
  <View className="my-4 flex-row items-center">
    <View className="h-[1px] flex-1 bg-accent" />
    <Text className="mx-4 text-xs text-highlight">{date}</Text>
    <View className="h-[1px] flex-1 bg-accent" />
  </View>
);

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

const MessageScreen = ({ route }) => {
  const { chatData } = route.params;
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(sampleMessages);
  const scrollViewRef = useRef();
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState(null);

  const handleSend = () => {
    if (message.trim().length === 0) return;

    setMessages([
      ...messages,
      {
        id: messages.length + 1,
        type: 'text',
        text: message,
        sender: 'me',
        timestamp: new Date().getTime(),
      },
    ]);
    setMessage('');
  };

  // Handle document attachment
  const handleAttachment = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (result.assets && result.assets.length > 0) {
        const file = result.assets[0];

        if (file.size > MAX_FILE_SIZE) {
          Alert.alert('Error', 'File size must be less than 10MB');
          return;
        }

        const newMessage = {
          id: messages.length + 1,
          type: 'document',
          fileName: file.name,
          fileSize: file.size,
          uri: file.uri,
          mimeType: file.mimeType,
          sender: 'me',
          timestamp: new Date().getTime(),
        };
        setMessages([...messages, newMessage]);
      }
    } catch (error) {
      Alert.alert('Error', 'Could not attach document');
    }
  };

  // Handle camera/image
  const handleImagePicker = async (useCamera = false) => {
    try {
      const method = useCamera
        ? ImagePicker.launchCameraAsync
        : ImagePicker.launchImageLibraryAsync;
      const result = await method({
        mediaTypes: ['images'],
        quality: 0.8,
        allowsEditing: true,
      });

      if (!result.canceled) {
        const newMessage = {
          id: messages.length + 1,
          type: 'image',
          uri: result.assets[0].uri,
          sender: 'me',
          timestamp: new Date().getTime(),
        };
        setMessages([...messages, newMessage]);
      }
    } catch (error) {
      Alert.alert('Error', 'Could not access camera/gallery');
    }
  };

  // Handle audio recording
  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);
    } catch (error) {
      Alert.alert('Error', 'Could not start recording');
    }
  };

  const stopRecording = async () => {
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);
      setIsRecording(false);

      const newMessage = {
        id: messages.length + 1,
        type: 'audio',
        uri,
        sender: 'me',
        timestamp: new Date().getTime(),
      };
      setMessages([...messages, newMessage]);
    } catch (error) {
      Alert.alert('Error', 'Could not stop recording');
    }
  };

  const renderMessages = () => {
    const groupedMessages = groupMessagesByDate(messages);
    return Object.entries(groupedMessages).map(([date, msgs]) => (
      <View key={date}>
        <DateSeparator date={formatMessageDate(msgs[0].timestamp)} />
        {msgs.map((msg) => (
          <MessageBubble key={msg.id} {...msg} />
        ))}
      </View>
    ));
  };

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        ref={scrollViewRef}
        className="flex-1 px-4"
        onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}>
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
