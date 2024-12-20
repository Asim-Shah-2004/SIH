import { SERVER_URL } from '@env';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import * as Haptics from 'expo-haptics';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import Markdown, { MarkdownIt } from 'react-native-markdown-display';
import Animated, {
  withSpring,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
} from 'react-native-reanimated';

import { useAuth } from '../../providers/AuthProvider';
import { formatMessageTime } from '../../utils/dateUtils';

const MessageBubble = ({
  type,
  text,
  sender,
  senderName,
  timestamp,
  uri,
  fileName,
  fileSize,
  mimeType,
  isUploading,
  uploadFailed,
  showSenderName = false,
}) => {
  const [sound, setSound] = useState();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [lastTap, setLastTap] = useState(null);
  const { user } = useAuth();
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

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
        const downloadResumable = FileSystem.createDownloadResumable(
          `${SERVER_URL}/media/audio/${uri}`,
          FileSystem.documentDirectory + 'temp_audio.m4a'
        );

        const { uri: audioUri } = await downloadResumable.downloadAsync();
        const { sound: audioSound } = await Audio.Sound.createAsync({ uri: audioUri });
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
      const downloadResumable = FileSystem.createDownloadResumable(
        `${SERVER_URL}/media/document/${uri}`,
        localUri,
        {},
        callback
      );

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

  const handleDoubleTap = () => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;

    if (lastTap && now - lastTap < DOUBLE_PRESS_DELAY) {
      const newLikeState = !isLiked;
      setIsLiked(newLikeState);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      if (newLikeState) {
        scale.value = withSequence(withSpring(1.5), withSpring(1));
        opacity.value = withSpring(1);
      } else {
        opacity.value = withSpring(0);
      }
    }
    setLastTap(now);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const renderUploadingState = () => {
    if (isUploading) {
      return (
        <View className="absolute right-2 top-2">
          <ActivityIndicator size="small" color={sender === user.email ? 'white' : '#0000ff'} />
        </View>
      );
    }
    if (uploadFailed) {
      return (
        <View className="absolute right-2 top-2">
          <Ionicons name="alert-circle" size={20} color="red" />
        </View>
      );
    }
    return null;
  };

  const renderSenderName = () => {
    if (showSenderName && sender !== user.email) {
      return <Text className="text-sm font-medium text-black">{senderName}</Text>;
    }
    return null;
  };

  return (
    <TouchableOpacity onPress={handleDoubleTap} activeOpacity={0.9}>
      <View
        className={`relative mb-2 max-w-[80%] ${
          sender === user.email ? 'self-end bg-primary' : 'self-start bg-white'
        } rounded-2xl px-4 py-2.5 shadow-sm ${sender !== user.email && 'border-accent/10 border'}`}>
        {renderUploadingState()}
        {type === 'text' && (
          <>
            {renderSenderName()}
            <Markdown
              markdownit={MarkdownIt({ linkify: true }).disable([
                'hr',
                'blockquote',
                'fence',
                'table',
                'image',
              ])}
              style={{
                text: {
                  fontSize: 15,
                },
                body: {
                  fontSize: 15,
                },
                paragraph: {
                  flexWrap: 'wrap',
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  marginBottom: 4,
                },
                link: {
                  color: '#2563eb',
                  textDecorationLine: 'underline',
                },
                heading1: {
                  marginTop: 4,
                  marginBottom: 4,
                  fontSize: 20,
                  fontWeight: 'bold',
                },
                heading2: {
                  marginTop: 4,
                  marginBottom: 4,
                  fontSize: 18,
                  fontWeight: 'bold',
                },
                code_block: {
                  padding: 4,
                  borderRadius: 4,
                  fontFamily: 'monospace',
                },
                bullet_list: {
                  color: '#fff',
                },
                ordered_list: {
                  color: '#fff',
                },
              }}
              rules={{
                textgroup: (node, children) => {
                  return (
                    <Text
                      className={`${sender === user.email ? 'text-white' : 'text-text'} `}
                      key={node.key}>
                      {children}
                    </Text>
                  );
                },
                text: (node) => {
                  return <Text key={node.key}>{node.content}</Text>;
                },
              }}>
              {text}
            </Markdown>
          </>
        )}
        {type === 'image' && (
          <>
            {renderSenderName()}
            <Image
              source={{ uri: `${SERVER_URL}/media/image/${uri}` }}
              className="h-48 w-48 rounded-lg"
              resizeMode="cover"
            />
          </>
        )}
        {type === 'document' && (
          <>
            {renderSenderName()}
            <TouchableOpacity
              className="flex-row items-center gap-2"
              onPress={handleDocumentPress}
              disabled={isDownloading}>
              <View className="relative">
                <Ionicons
                  name="document-outline"
                  size={24}
                  className={sender === user.email ? 'text-white' : 'text-text'}
                />
                {isDownloading && (
                  <View className="absolute inset-0 flex items-center justify-center">
                    <View className="h-5 w-5 animate-spin rounded-full border-2 border-accent border-t-primary" />
                  </View>
                )}
              </View>
              <View>
                <Text className={sender === user.email ? 'text-white' : 'text-text'}>{fileName}</Text>
                <Text
                  className={`text-xs ${sender === user.email ? 'text-white/70' : 'text-highlight/70'}`}>
                  {isDownloading
                    ? `Downloading... ${downloadProgress.toFixed(0)}%`
                    : `${(fileSize / 1024).toFixed(1)} KB`}
                </Text>
              </View>
            </TouchableOpacity>
          </>
        )}
        {type === 'audio' && (
          <>
            {renderSenderName()}
            <View className="flex-row items-center gap-3">
              <TouchableOpacity
                onPress={handleAudioPlayback}
                disabled={isLoading}
                className="bg-accent/10 rounded-full p-2">
                {isLoading ? (
                  <View className="h-5 w-5 animate-spin rounded-full border-2 border-accent border-t-primary" />
                ) : (
                  <Ionicons
                    name={isPlaying ? 'pause' : 'play'}
                    size={20}
                    className={sender === user.email ? 'text-white' : 'text-text'}
                  />
                )}
              </TouchableOpacity>
              <Text className={sender === user.email ? 'text-white' : 'text-text'}>
                Voice message
              </Text>
            </View>
          </>
        )}
        <View className="flex-row items-center justify-end gap-1">
          <Animated.View style={animatedStyle}>
            <Ionicons
              name="heart"
              size={16}
              color={sender === user.email ? '#ffffff' : '#FF0000'}
            />
          </Animated.View>
          <Text
            className={`text-xs ${sender === user.email ? 'text-white/70' : 'text-highlight/70'} mt-1`}>
            {formatMessageTime(timestamp)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default MessageBubble;
