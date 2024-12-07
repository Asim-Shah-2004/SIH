// screens/RegisterScreen.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import ReactNativeModal from 'react-native-modal';
import * as DocumentPicker from 'expo-document-picker';

import { LANGUAGES, changeLanguage } from '../i18n/i18n';

const RegisterScreen = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isLanguageModalVisible, setIsLanguageModalVisible] = useState(false);
  const [registrationType, setRegistrationType] = useState(null); // 'manual' or 'resume'
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadStoredLanguage();
  }, []);

  const loadStoredLanguage = async () => {
    try {
      const storedLang = await AsyncStorage.getItem('user-language');
      if (storedLang) {
        setSelectedLanguage(storedLang);
        await handleLanguageChange(storedLang);
      }
    } catch (error) {
      console.error('Error loading language:', error);
    }
  };

  const handleLanguageChange = async (lang) => {
    try {
      await changeLanguage(lang);
      setSelectedLanguage(lang);
      await i18n.changeLanguage(lang);
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  const handleRegister = () => {
    // Perform registration logic here
    navigation.navigate('Login');
  };

  const toggleLanguageModal = () => {
    setIsLanguageModalVisible(!isLanguageModalVisible);
  };

  const handleResumeUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/msword'],
        copyToCacheDirectory: true
      });

      if (result.type === 'success') {
        setIsProcessing(true);
        // Call your ML API here with result.uri
        // const response = await uploadResumeForProcessing(result.uri);
        // setName(response.name);
        // setEmail(response.email);
        // ... set other fields
        setIsProcessing(false);
        setRegistrationType('manual'); // Show form with pre-filled data
      }
    } catch (error) {
      console.error('Error uploading resume:', error);
    }
  };

  if (!registrationType) {
    return (
      <View className="flex-1 bg-gray-50">
        <View className="flex-1 justify-center p-6">
          <Text className="mb-8 text-center text-3xl font-bold tracking-tight text-gray-900">
            {t('auth.register')}
          </Text>
          
          <TouchableOpacity
            onPress={() => setRegistrationType('resume')}
            className="mb-4 rounded-3xl border-2 border-black bg-white p-6 shadow-sm active:bg-gray-50">
            <View className="mb-3 flex-row items-center justify-center">
              <MaterialIcons name="file-upload" size={32} color="#000000" />
            </View>
            <Text className="text-center text-xl font-bold text-gray-900">
              Resume Upload
            </Text>
            <Text className="mt-2 text-center text-gray-600">
              Build your profile automatically from your resume
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setRegistrationType('manual')}
            className="rounded-3xl bg-gray-100 p-6 active:bg-gray-200">
            <View className="mb-3 flex-row items-center justify-center">
              <MaterialIcons name="edit" size={32} color="#374151" />
            </View>
            <Text className="text-center text-xl font-bold text-gray-900">
              Enter Manually
            </Text>
            <Text className="mt-2 text-center text-gray-600">
              Fill in your details step by step
            </Text>
          </TouchableOpacity>
        </View>

        {/* Language selector remains unchanged */}
        <View className="border-t border-gray-200 p-4">
          <TouchableOpacity
            onPress={toggleLanguageModal}
            className="mx-auto flex-row items-center rounded-xl bg-gray-100 px-6 py-3">
            <MaterialIcons name="language" size={24} color="#4B5563" />
            <Text className="ml-2 text-gray-700">
              {LANGUAGES.find(lang => lang.code === selectedLanguage)?.label || 'Select Language'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (registrationType === 'resume') {
    return (
      <View className="flex-1 bg-gray-50 p-6">
        <TouchableOpacity 
          onPress={() => setRegistrationType(null)}
          className="mb-6 flex-row items-center">
          <MaterialIcons name="arrow-back" size={24} color="#000000" />
          <Text className="ml-2 text-gray-900">Back</Text>
        </TouchableOpacity>

        <View className="flex-1 justify-center">
          {isProcessing ? (
            <View className="items-center">
              <ActivityIndicator size="large" color="#000000" />
              <Text className="mt-4 text-center text-gray-600">
                Processing your resume...
              </Text>
            </View>
          ) : (
            <TouchableOpacity
              onPress={handleResumeUpload}
              className="aspect-video items-center justify-center rounded-3xl border-2 border-black bg-white p-8 shadow-sm active:bg-gray-50">
              <MaterialIcons name="file-upload" size={48} color="#000000" />
              <Text className="mt-4 text-center text-2xl font-bold text-gray-900">
                Upload Resume
              </Text>
              <Text className="mt-2 text-center text-gray-600">
                Supported formats: PDF, DOC, DOCX
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <View className="p-6">
        <TouchableOpacity 
          onPress={() => setRegistrationType(null)}
          className="mb-6 flex-row items-center">
          <MaterialIcons name="arrow-back" size={24} color="#4B5563" />
          <Text className="ml-2 text-gray-600">Back</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-1 justify-center p-6">
        <Text className="mb-8 text-center text-3xl font-bold text-gray-800">
          {t('auth.register')}
        </Text>
        <TextInput
          className="mb-4 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3"
          placeholder={t('auth.name')}
          value={name}
          onChangeText={setName}
        />
        <TextInput
          className="mb-4 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3"
          placeholder={t('auth.email')}
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          className="mb-6 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3"
          placeholder={t('auth.password')}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          className="mb-4 w-full rounded-xl bg-blue-500 px-4 py-4"
          onPress={handleRegister}>
          <Text className="text-center text-lg font-bold text-white">
            {t('auth.registerButton')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="w-full rounded-xl px-4 py-4"
          onPress={() => navigation.navigate('Login')}>
          <Text className="text-center font-semibold text-blue-500">{t('auth.haveAccount')}</Text>
        </TouchableOpacity>
      </View>

      {/* Language Selector Button */}
      <View className="border-t border-gray-200 p-4">
        <TouchableOpacity
          onPress={toggleLanguageModal}
          className="mx-auto flex-row items-center rounded-xl bg-gray-100 px-6 py-3">
          <MaterialIcons name="language" size={24} color="#4B5563" />
          <Text className="ml-2 text-gray-700">
            {LANGUAGES.find(lang => lang.code === selectedLanguage)?.label || 'Select Language'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Improved Language Selection Modal */}
      <ReactNativeModal
        isVisible={isLanguageModalVisible}
        onBackdropPress={toggleLanguageModal}
        onSwipeComplete={toggleLanguageModal}
        swipeDirection={['down']}
        useNativeDriver={true}
        backdropTransitionOutTiming={0}
        className="m-0 justify-center"
        customBackdrop={
          <TouchableOpacity
            onPress={toggleLanguageModal}
            className="absolute h-full w-full bg-black/50"
          />
        }
        animationIn="zoomIn"
        animationOut="zoomOut"
        animationInTiming={300}
        animationOutTiming={300}>
        <View className="mx-4 rounded-2xl bg-white">
          <View className="border-b border-gray-100 p-4">
            <View className="flex-row items-center justify-between">
              <Text className="text-xl font-bold text-gray-800">{t('common.selectLanguage')}</Text>
              <TouchableOpacity
                onPress={toggleLanguageModal}
                className="rounded-full bg-gray-100 p-2">
                <MaterialIcons name="close" size={20} color="#4B5563" />
              </TouchableOpacity>
            </View>
          </View>
          
          <View className="max-h-80">
            <ScrollView className="px-4 py-2">
              {LANGUAGES.map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  onPress={() => {
                    handleLanguageChange(lang.code);
                    toggleLanguageModal();
                  }}
                  className={`mb-2 flex-row items-center rounded-xl p-4 active:opacity-70 ${
                    selectedLanguage === lang.code
                      ? 'bg-blue-50 border border-blue-200'
                      : 'bg-gray-50'
                  }`}>
                  <View className="h-8 w-8 items-center justify-center rounded-full bg-white">
                    <Text className="text-lg">{lang.emoji}</Text>
                  </View>
                  <Text
                    className={`ml-3 flex-1 text-lg ${
                      selectedLanguage === lang.code
                        ? 'font-semibold text-blue-600'
                        : 'text-gray-700'
                    }`}>
                    {lang.label}
                  </Text>
                  {selectedLanguage === lang.code && (
                    <MaterialIcons name="check-circle" size={24} color="#2563EB" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </ReactNativeModal>
    </View>
  );
};

export default RegisterScreen;
