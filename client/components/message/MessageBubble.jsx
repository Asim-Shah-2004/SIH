import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';

import { formatMessageTime } from '../../utils/dateUtils';

const MessageBubble = ({ type, text, sender, timestamp, uri, fileName, fileSize, mimeType }) => {
  const [sound, setSound] = useState();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    return sound ? () => sound.unloadAsync() : undefined;
  }, [sound]);

  const handleAudioPlayback = async () => {
    if (sound) {
      if (isPlaying) {
        await sound.pauseAsync();
        setIsPlaying(false);
      } else {
        await sound.playAsync();
        setIsPlaying(true);
      }
    } else {
      setIsLoading(true);
      try {
        const { sound: audioSound } = await Audio.Sound.createAsync({ uri });
        setSound(audioSound);
        await audioSound.playAsync();
        setIsPlaying(true);

        // Handle playback finished
        audioSound.setOnPlaybackStatusUpdate((status) => {
          if (status.didJustFinish) {
            setIsPlaying(false);
          }
        });
      } catch (error) {
        console.log('Error loading audio:', error);
      }
      setIsLoading(false);
    }
  };

  const handleDocumentPress = async () => {
    if (isDownloading) return;

    try {
      setIsDownloading(true);
      const permissions = await MediaLibrary.requestPermissionsAsync();

      if (!permissions.granted) {
        Alert.alert('Permission needed', 'Please allow access to save files');
        return;
      }

      const callback = (downloadProgress) => {
        const progress =
          (downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite) * 100;
        setDownloadProgress(progress);
      };

      const localUri = `${FileSystem.documentDirectory}${fileName}`;
      const downloadResumable = FileSystem.createDownloadResumable(uri, localUri, {}, callback);

      const { uri: fileUri } = await downloadResumable.downloadAsync();

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: mimeType || 'application/octet-stream',
          dialogTitle: 'Open with...',
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Could not download the file. Please try again.');
    } finally {
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  };

  return (
    <View
      className={`mb-2 max-w-[80%] ${
        sender === 'me' ? 'self-end bg-primary' : 'self-start bg-white'
      } rounded-2xl px-4 py-2.5 shadow-sm ${sender === 'them' && 'border border-accent/10'}`}>
      {type === 'text' && (
        <Text className={`${sender === 'me' ? 'text-white' : 'text-text'} text-[15px]`}>
          {text}
        </Text>
      )}
      {type === 'image' && (
        <Image source={{ uri }} className="h-48 w-48 rounded-lg" resizeMode="cover" />
      )}
      {type === 'document' && (
        <TouchableOpacity
          className="flex-row items-center gap-2"
          onPress={handleDocumentPress}
          disabled={isDownloading}>
          <View className="relative">
            <Ionicons
              name="document-outline"
              size={24}
              className={sender === 'me' ? 'text-white' : 'text-text'}
            />
            {isDownloading && (
              <View className="absolute inset-0 flex items-center justify-center">
                <View className="h-5 w-5 animate-spin rounded-full border-2 border-accent border-t-primary" />
              </View>
            )}
          </View>
          <View>
            <Text className={sender === 'me' ? 'text-white' : 'text-text'}>{fileName}</Text>
            <Text className={`text-xs ${sender === 'me' ? 'text-white/70' : 'text-highlight/70'}`}>
              {isDownloading
                ? `Downloading... ${downloadProgress.toFixed(0)}%`
                : `${(fileSize / 1024).toFixed(1)} KB`}
            </Text>
          </View>
        </TouchableOpacity>
      )}
      {type === 'audio' && (
        <View className="flex-row items-center gap-3">
          <TouchableOpacity
            onPress={handleAudioPlayback}
            disabled={isLoading}
            className="rounded-full bg-accent/10 p-2">
            {isLoading ? (
              <View className="h-5 w-5 animate-spin rounded-full border-2 border-accent border-t-primary" />
            ) : (
              <Ionicons
                name={isPlaying ? 'pause' : 'play'}
                size={20}
                className={sender === 'me' ? 'text-white' : 'text-text'}
              />
            )}
          </TouchableOpacity>
          <Text className={sender === 'me' ? 'text-white' : 'text-text'}>Voice message</Text>
        </View>
      )}
      <Text
        className={`text-xs ${sender === 'me' ? 'text-white/70' : 'text-highlight/70'} mt-1 text-right`}>
        {formatMessageTime(timestamp)}
      </Text>
    </View>
  );
};

export default MessageBubble;