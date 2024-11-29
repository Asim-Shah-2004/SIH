import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View, Text, Image } from 'react-native';

import { formatMessageTime } from '../../utils/dateUtils';

const MessageBubble = ({ type, text, sender, timestamp, uri, fileName, fileSize }) => (
  <View
    className={`mb-2 max-w-[80%] ${
      sender === 'me' ? 'self-end bg-primary' : 'self-start bg-white'
    } rounded-2xl px-4 py-2.5 shadow-sm ${sender === 'them' && 'border border-accent/10'}`}>
    {type === 'text' && (
      <Text className={`${sender === 'me' ? 'text-white' : 'text-text'} text-[15px]`}>{text}</Text>
    )}
    {type === 'image' && (
      <Image source={{ uri }} className="h-48 w-48 rounded-lg" resizeMode="cover" />
    )}
    {type === 'document' && (
      <View className="flex-row items-center gap-2">
        <Ionicons name="document-outline" size={24} color={sender === 'me' ? 'white' : '#2C3F4A'} />
        <View>
          <Text className={sender === 'me' ? 'text-white' : 'text-text'}>{fileName}</Text>
          <Text className={`text-xs ${sender === 'me' ? 'text-white/70' : 'text-highlight/70'}`}>
            {(fileSize / 1024).toFixed(1)} KB
          </Text>
        </View>
      </View>
    )}
    {type === 'audio' && (
      <View className="flex-row items-center gap-2">
        <Ionicons name="musical-note" size={24} color={sender === 'me' ? 'white' : '#2C3F4A'} />
        <Text className={sender === 'me' ? 'text-white' : 'text-text'}>Voice message</Text>
      </View>
    )}
    <Text
      className={`text-xs ${sender === 'me' ? 'text-white/70' : 'text-highlight/70'} mt-1 text-right`}>
      {formatMessageTime(timestamp)}
    </Text>
  </View>
);

export default MessageBubble;
