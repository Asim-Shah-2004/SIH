// screens/LoginScreen.js
import { SERVER_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

import { LANGUAGES, changeLanguage } from '../i18n/i18n';
import { AuthContext } from '../providers/CustomProvider';

const LoginScreen = () => {
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('alumni');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const { setRole, setIsLoggedIn, setToken } = useContext(AuthContext);

  const ROLES = [
    { label: 'Alumni', value: 'alumni' },
    { label: 'College', value: 'college' },
  ];

  const handleRoleChange = (role) => {
    setSelectedRole(role);
  };

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
      const response = await axios.post(`${SERVER_URL}/auth/login`, {
        email,
        password,
        role: selectedRole,
      });
      try {
        await AsyncStorage.setItem('isLoggedIn', 'true');
        await AsyncStorage.setItem('role', selectedRole);
        await AsyncStorage.setItem('user-language', selectedLanguage);
        await AsyncStorage.setItem('token', response.data.token);
        setToken(response.data.token);
        setIsLoggedIn(true);
        setRole(selectedRole);
        console.log('Data saved in AsyncStorage');
      } catch (e) {
        console.error('Error saving data', e);
      }
    } catch (error) {
      console.error('Error logging in:', error);
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
      <View className="border-t border-gray-200 p-4">
        <View className="mx-auto w-40">
          <Picker
            selectedValue={selectedRole}
            onValueChange={handleRoleChange}
            className="rounded-xl bg-gray-50">
            {ROLES.map((role) => (
              <Picker.Item key={role.value} label={role.label} value={role.value} />
            ))}
          </Picker>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;
