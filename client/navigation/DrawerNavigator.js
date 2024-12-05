import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import TabNavigator from './TabNavigator';
import { LANGUAGES } from '../i18n/i18n';
import Events from '../screens/Events';
import Settings from '../screens/Settings';
import ProfileScreen from '../screens/ProfileScreen';

const Drawer = createDrawerNavigator();

const drawerConfig = {
  screenOptions: {
    headerShown: false,
    drawerStyle: {
      backgroundColor: '#FFFFFF',
      width: 280,
      borderTopRightRadius: 25,
      borderBottomRightRadius: 25,
      paddingTop: 30,
      paddingHorizontal: 8,
      elevation: 15,
      shadowColor: '#000000',
      shadowOffset: { width: 5, height: 0 },
      shadowOpacity: 0.15,
      shadowRadius: 15,
    },
    drawerItemStyle: {
      borderRadius: 12,
      paddingVertical: 5,
      marginVertical: 4,
      marginHorizontal: 8,
      paddingLeft: 4,
    },
    drawerLabelStyle: {
      fontSize: 15,
      fontWeight: '600',
      marginLeft: 8,
      paddingVertical: 8,
    },
    drawerIconStyle: {
      marginRight: 2,
      marginLeft: -4,
    },
    drawerActiveBackgroundColor: '#F0F7FF',
    drawerActiveTintColor: '#0066FF',
    drawerInactiveTintColor: '#404040',
    drawerPressColor: '#E6EFFF',
    drawerItemPressOpacity: 0.7,
  },
};

const getDrawerIcon =
  (name) =>
  ({ focused, color, size }) => (
    <Ionicons
      name={name}
      size={24}
      color={color}
      style={{
        transform: [{ scale: focused ? 1.1 : 1 }],
        opacity: focused ? 1 : 0.85,
      }}
    />
  );

export default function DrawerNavigator() {
  const { i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  useEffect(() => {
    loadStoredLanguage();
  }, []);

  const loadStoredLanguage = async () => {
    try {
      const storedLang = await AsyncStorage.getItem('user-language');
      if (storedLang) {
        setSelectedLanguage(storedLang);
      }
    } catch (error) {
      console.error('Error loading language:', error);
    }
  };

  const handleLanguageChange = async (lang) => {
    try {
      await AsyncStorage.setItem('user-language', lang);
      setSelectedLanguage(lang);
      await i18n.changeLanguage(lang);
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  return (
    <Drawer.Navigator
      screenOptions={drawerConfig.screenOptions}
      drawerContent={(props) => (
        <View style={{ flex: 1 }}>
          <DrawerContentScrollView {...props}>
            <DrawerItemList {...props} />
          </DrawerContentScrollView>

          {/* Language Selector at bottom */}
          <View className="border-t border-gray-200 p-4">
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
      )}>
      <Drawer.Screen
        name="MainTabs"
        component={TabNavigator}
        options={{
          title: 'Home',
          drawerIcon: getDrawerIcon('home'),
          // drawerItemStyle: { display: 'none' },
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          drawerIcon: getDrawerIcon('person'),
          headerShown: true,
        }}
      />
      <Drawer.Screen
        name="Events"
        component={Events}
        options={{
          drawerIcon: getDrawerIcon('calendar'),
          headerShown: true,
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={Settings}
        options={{
          drawerIcon: getDrawerIcon('settings'),
          headerShown: true,
        }}
      />
    </Drawer.Navigator>
  );
}
