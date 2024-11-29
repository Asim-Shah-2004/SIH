import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';

const InputBar = ({
  message,
  setMessage,
  handleSend,
  handleAttachment,
  handleImagePicker,
  isRecording,
  startRecording,
  stopRecording,
}) => (
  <View className="flex-row items-center gap-1 border-t border-accent/10 bg-white p-3">
    <View className="flex-1 flex-row items-center gap-2 rounded-full bg-accent/5 px-3 py-2">
      <TouchableOpacity>
        <Ionicons name="happy-outline" size={24} color="#2C3F4A" />
      </TouchableOpacity>
      <TextInput
        className="flex-1 text-text"
        placeholder="Type a message..."
        placeholderTextColor="#34495E"
        value={message}
        onChangeText={setMessage}
        multiline
      />
      <TouchableOpacity onPress={handleAttachment}>
        <Ionicons name="attach" size={22} color="#2C3F4A" />
      </TouchableOpacity>
    </View>

    {message.trim().length > 0 ? (
      <TouchableOpacity className="rounded-full bg-primary p-3" onPress={handleSend}>
        <Ionicons name="send" size={20} color="#fff" />
      </TouchableOpacity>
    ) : (
      <View className="flex-row gap-2">
        <TouchableOpacity
          className="rounded-full bg-accent/5 p-3"
          onPress={() => handleImagePicker(true)}>
          <Ionicons name="camera" size={20} color="#2C3F4A" />
        </TouchableOpacity>
        <TouchableOpacity
          className="rounded-full bg-accent/5 p-3"
          onPressIn={startRecording}
          onPressOut={stopRecording}>
          <Ionicons
            name={isRecording ? 'radio-button-on' : 'mic'}
            size={20}
            color={isRecording ? '#ff0000' : '#2C3F4A'}
          />
        </TouchableOpacity>
      </View>
    )}
  </View>
);

export default InputBar;
