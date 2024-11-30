import { Audio } from 'expo-av';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

export class MessageService {
  static async handleDocumentAttachment(messages) {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (result.assets && result.assets.length > 0) {
        const file = result.assets[0];

        if (file.size > MAX_FILE_SIZE) {
          Alert.alert('Error', 'File size must be less than 10MB');
          return null;
        }

        return {
          id: messages.length + 1,
          type: 'document',
          fileName: file.name,
          fileSize: file.size,
          uri: file.uri,
          mimeType: file.mimeType,
          sender: 'me',
          timestamp: new Date().getTime(),
        };
      }
    } catch (error) {
      Alert.alert('Error', 'Could not attach document');
      return null;
    }
  }

  static async handleImagePicker(messages, useCamera = false) {
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
        return {
          id: messages.length + 1,
          type: 'image',
          uri: result.assets[0].uri,
          sender: 'me',
          timestamp: new Date().getTime(),
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

  static async stopRecording(recording, messages) {
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();

      return {
        id: messages.length + 1,
        type: 'audio',
        uri,
        sender: 'me',
        timestamp: new Date().getTime(),
      };
    } catch (error) {
      Alert.alert('Error', 'Could not stop recording');
      return null;
    }
  }
}
