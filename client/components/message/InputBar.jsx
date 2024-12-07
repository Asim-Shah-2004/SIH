import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import EmojiKeyboard from 'rn-emoji-keyboard';

const InputBar = ({
  message,
  setMessage,
  handleSend,
  handleAttachment,
  handleImagePicker,
  isRecording,
  startRecording,
  stopRecording,
}) => {
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);

  const handleEmojiSelect = (emoji) => {
    setMessage((prev) => prev + emoji.emoji);
  };

  return (
    <View className="border-accent/10 border-t bg-white">
      <EmojiKeyboard
        open={isEmojiPickerOpen}
        onClose={() => setIsEmojiPickerOpen(false)}
        onEmojiSelected={handleEmojiSelect}
        enableSearchBar
        enableRecentlyUsed
        categoryPosition="top"
        height={300}
      />

      <View className="flex-row items-center gap-2 p-2.5">
        <View className="bg-accent/5 flex-1 flex-row items-center gap-3 rounded-2xl px-4 py-2">
          <TouchableOpacity onPress={() => setIsEmojiPickerOpen(true)}>
            <Ionicons name="happy-outline" size={22} className="text-text" />
          </TouchableOpacity>
          <TextInput
            className="max-h-[100px] min-h-[36px] flex-1 text-[15px] leading-[20px] text-text"
            placeholder="Type a message..."
            placeholderTextColor="#94A3B8"
            value={message}
            onChangeText={setMessage}
            multiline
            style={{ paddingTop: 8, paddingBottom: 8 }}
          />
          <TouchableOpacity onPress={handleAttachment}>
            <Ionicons name="attach" size={22} className="text-text" />
          </TouchableOpacity>
        </View>

        {message.trim().length > 0 ? (
          <TouchableOpacity className="rounded-full bg-primary p-3" onPress={handleSend}>
            <Ionicons name="send" size={20} className="text-white" />
          </TouchableOpacity>
        ) : (
          <View className="flex-row gap-2">
            <TouchableOpacity
              className="bg-accent/5 rounded-full p-3"
              onPress={() => handleImagePicker(true)}>
              <Ionicons name="camera" size={20} className="text-text" />
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-accent/5 rounded-full p-3"
              onPressIn={startRecording}
              onPressOut={stopRecording}>
              <Ionicons
                name={isRecording ? 'radio-button-on' : 'mic'}
                size={20}
                className={isRecording ? 'text-primary' : 'text-text'}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

export default InputBar;
