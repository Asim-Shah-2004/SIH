import { SERVER_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Audio } from 'expo-av';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

export class MessageService {
  static async uploadMedia(buffer, type, mimeType) {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.post(
        `${SERVER_URL}/media/upload`,
        {
          type,
          buffer: buffer.toString('base64'),
          mimeType,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.id;
    } catch (error) {
      console.error('Error uploading media:', error);
      Alert.alert('Error', 'Could not upload media');
      return null;
    }
  }

  static async handleDocumentAttachment() {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (result.canceled) return null;

      if (result.assets && result.assets.length > 0) {
        const file = result.assets[0];

        if (file.size > MAX_FILE_SIZE) {
          Alert.alert('Error', 'File size must be less than 10MB');
          return null;
        }
        
        // Upload document and get ID
        const response = await fetch(file.uri);
        const buffer = await response.arrayBuffer();
        const mediaId = await this.uploadMedia(buffer, 'document', file.mimeType);

        if (!mediaId) return null;

        return {
          type: 'document',
          fileName: file.name,
          fileSize: file.size,
          uri: mediaId,
          timestamp: Date.now(),
        };
      }
    } catch (error) {
      Alert.alert('Error', 'Could not attach document');
      return null;
    }
  }

  static async handleImagePicker(useCamera = false) {
    try {
      const method = useCamera
        ? ImagePicker.launchCameraAsync
        : ImagePicker.launchImageLibraryAsync;

      const result = await method({
        mediaTypes: ['images'],
        allowsEditing: true,
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        const mediaId = await this.uploadMedia(result.assets[0].base64, 'image', 'image/jpeg');

        if (!mediaId) return null;

        return {
          type: 'image',
          uri: mediaId,
          timestamp: Date.now(),
        };
      }
    } catch (error) {
      Alert.alert('Error', 'Could not access camera/gallery');
      return null;
    }
  }

  static async startRecording() {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      return recording;
    } catch (error) {
      Alert.alert('Error', 'Could not start recording');
      return null;
    }
  }

  static async stopRecording(recording) {
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();

      // Convert audio to base64
      const response = await fetch(uri);
      const buffer = await response.arrayBuffer();
      const mediaId = await this.uploadMedia(buffer, 'audio', 'audio/mpeg');

      if (!mediaId) return null;

      return {
        type: 'audio',
        uri: mediaId,
        timestamp: Date.now(),
      };
    } catch (error) {
      Alert.alert('Error', 'Could not stop recording');
      return null;
    }
  }
}
