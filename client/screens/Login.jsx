// screens/LoginScreen.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

import { LANGUAGES, changeLanguage } from '../i18n/i18n';

const LoginScreen = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');

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

  const handleLogin = async () => {
    try {
      await AsyncStorage.setItem('isLoggedIn', 'true');
      console.log('Data saved');
    } catch (e) {
      console.error('Error saving data', e);
    }
    navigation.navigate('MainDrawer');
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

  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 justify-center p-6">
        <Text className="mb-8 text-center text-3xl font-bold text-gray-800">{t('auth.login')}</Text>

        {/* Consistent input styling */}
        <TextInput
          className="mb-4 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3"
          placeholder={t('auth.email')}
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          className="mb-6 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3"
          placeholder={t('auth.password')}
          value={password}
          secureTextEntry
          onChangeText={setPassword}
        />

        <TouchableOpacity
          className="mb-4 w-full rounded-xl bg-blue-500 px-4 py-4"
          onPress={handleLogin}>
          <Text className="text-center text-lg font-bold text-white">{t('auth.loginButton')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="w-full rounded-xl px-4 py-4"
          onPress={() => navigation.navigate('Register')}>
          <Text className="text-center font-semibold text-blue-500">{t('auth.noAccount')}</Text>
        </TouchableOpacity>
      </View>

      {/* Compact language picker */}
      <View className="border-t border-gray-200 p-4">
        <View className="mx-auto w-40">
          <Picker
            selectedValue={selectedLanguage}
            onValueChange={handleLanguageChange}
            className="rounded-xl bg-gray-50">
            {LANGUAGES.map((lang) => (
              <Picker.Item key={lang.code} label={lang.label} value={lang.code} />
            ))}
          </Picker>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;
