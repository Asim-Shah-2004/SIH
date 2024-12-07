import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Platform, ToastAndroid, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { MaterialIcons } from '@expo/vector-icons';
import { ML_SERVER_URL } from '@env';

const RegisterScreen = ({ navigation }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [response, setResponse] = useState(null);
  // console.log('Server URL:', SERVER_URL);

  const showToast = (message) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert('Notice', message);
    }
  };

  const handleResumeUpload = async () => {
    try {
      console.log('Starting file picker...');
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf'],
        copyToCacheDirectory: true,
        multiple: false
      });

      console.log('Document picker result:', result);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setIsProcessing(true);
        showToast('Processing your resume...');
        const selectedFile = result.assets[0];
        console.log('Selected file details:', selectedFile);

        const formData = new FormData();
        formData.append('resume', {
          uri: selectedFile.uri,
          type: selectedFile.mimeType,
          name: selectedFile.name
        });

        try {
          const response = await fetch(`${ML_SERVER_URL}/api/upload-resume/`, {
            method: 'POST',
            body: formData,
            headers: {
              'Accept': 'application/json',
              'ngrok-skip-browser-warning': 'true',
            },
          });

          console.log('Server response status:', response.status);
          
          if (response.ok) {
            const data = await response.json();
            console.log('Server response:', data);
            setResponse(data);
            showToast('Resume uploaded successfully!');
            navigation.navigate('Manual', { resumeData: data });
          } else {
            const errorText = await response.text();
            showToast(`Upload failed: ${response.status}`);
            console.error('Server error:', errorText);
            setResponse({ error: `Server error: ${response.status}` });
          }
        } catch (error) {
          showToast('Network request failed');
          console.error('Network error:', error);
          setResponse({ error: 'Network request failed' });
        }
      } else {
        showToast('File selection cancelled');
      }
    } catch (error) {
      showToast('Failed to pick file');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <View className="flex-1 bg-gray-50 p-6">
      <View className="flex-1 justify-center">
        {isProcessing ? (
          <View className="items-center">
            <ActivityIndicator size="large" color="#000000" />
            <Text className="mt-4 text-center text-gray-600">
              Processing your resume...
            </Text>
          </View>
        ) : (
          <>
            <TouchableOpacity
              onPress={handleResumeUpload}
              className="aspect-video items-center justify-center rounded-3xl border-2 border-black bg-white p-8 shadow-sm active:bg-gray-50">
              <MaterialIcons name="file-upload" size={48} color="#000000" />
              <Text className="mt-4 text-center text-2xl font-bold text-gray-900">
                Upload Resume (PDF only)
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

export default RegisterScreen;
