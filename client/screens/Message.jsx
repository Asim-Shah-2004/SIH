import React, { useState, useRef } from 'react';
import { View, ScrollView } from 'react-native';

import DateSeparator from '../components/message/DateSeparator';
import InputBar from '../components/message/InputBar';
import MessageBubble from '../components/message/MessageBubble';
import { sampleMessages } from '../constants/messageData';
import { formatMessageDate, groupMessagesByDate } from '../utils/dateUtils';
import { MessageService } from '../utils/messageUtils';

const MessageScreen = ({ route }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(sampleMessages);
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState(null);
  const scrollViewRef = useRef();

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

  const handleAttachment = async () => {
    const newMessage = await MessageService.handleDocumentAttachment(messages);
    if (newMessage) {
      setMessages([...messages, newMessage]);
    }
  };

  const handleImagePicker = async (useCamera = false) => {
    const newMessage = await MessageService.handleImagePicker(messages, useCamera);
    if (newMessage) {
      setMessages([...messages, newMessage]);
    }
  };

  const startRecording = async () => {
    const newRecording = await MessageService.startRecording();
    if (newRecording) {
      setRecording(newRecording);
      setIsRecording(true);
    }
  };

  const stopRecording = async () => {
    const newMessage = await MessageService.stopRecording(recording, messages);
    if (newMessage) {
      setMessages([...messages, newMessage]);
      setRecording(null);
      setIsRecording(false);
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
