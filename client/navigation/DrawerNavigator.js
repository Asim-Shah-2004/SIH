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
import { View, TouchableOpacity, Text } from 'react-native';

import TabNavigator from './TabNavigator';
import { LANGUAGES } from '../i18n/i18n';
import Events from '../screens/Events';
import ProfileScreen from '../screens/MyProfile';
import Settings from '../screens/Settings';

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

const CustomDrawerItem = ({ label, icon, onPress, focused }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: focused ? '#F0F7FF' : 'transparent',
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginVertical: 4,
        marginHorizontal: 8,
      }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {icon({ focused, color: focused ? '#0066FF' : '#404040', size: 24 })}
        <Text
          style={{
            marginLeft: 8,
            color: focused ? '#0066FF' : '#404040',
            fontSize: 15,
            fontWeight: '600',
          }}>
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

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

  const CustomDrawerContent = (props) => {
    const currentRoute = props.state.routeNames[props.state.index];
    
    const handleNavigation = (routeName) => {
      props.navigation.closeDrawer();
      if (currentRoute !== routeName) {
        props.navigation.reset({
          index: 0,
          routes: [{ name: routeName }],
        });
      }
    };

    return (
      <View style={{ flex: 1 }}>
        <DrawerContentScrollView {...props}>
          <CustomDrawerItem
            label="Home"
            icon={getDrawerIcon('home')}
            onPress={() => handleNavigation('MainTabs')}
            focused={currentRoute === 'MainTabs'}
          />
          <CustomDrawerItem
            label="My Profile"
            icon={getDrawerIcon('person')}
            onPress={() => handleNavigation('MyProfile')}
            focused={currentRoute === 'MyProfile'}
          />
          <CustomDrawerItem
            label="Events"
            icon={getDrawerIcon('calendar')}
            onPress={() => handleNavigation('Events')}
            focused={currentRoute === 'Events'}
          />
          <CustomDrawerItem
            label="Settings"
            icon={getDrawerIcon('settings')}
            onPress={() => handleNavigation('Settings')}
            focused={currentRoute === 'Settings'}
          />
        </DrawerContentScrollView>

        {/* Language Selector */}
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
    );
  };

  return (
    <Drawer.Navigator
      screenOptions={drawerConfig.screenOptions}
      drawerContent={(props) => <CustomDrawerContent {...props} />}>
      <Drawer.Screen
        name="MainTabs"
        component={TabNavigator}
        options={{
          title: 'Home',
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="MyProfile"
        component={ProfileScreen}
        options={{
          headerShown: true,
          title: 'My Profile',
        }}
      />
      <Drawer.Screen
        name="Events"
        component={Events}
        options={{
          headerShown: true,
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={Settings}
        options={{
          headerShown: true,
        }}
      />
    </Drawer.Navigator>
  );
}
