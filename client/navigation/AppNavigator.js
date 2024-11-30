import { Ionicons } from '@expo/vector-icons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

import AuthNavigator from './AuthNavigator';
import DrawerNavigator from './DrawerNavigator';
import Chat from '../screens/Chat';
import Message from '../screens/Message';
import NewJob from '../screens/NewJob';
import Notifications from '../screens/Notifications';
// import Map from '../screens/Map';

const Stack = createNativeStackNavigator();

const MessageHeader = ({ navigation, route }) => {
  const { chatData } = route.params;
  return (
    <View className="flex-row items-center justify-between border-b border-accent/10 bg-white px-4 py-3">
      <View className="flex-1 flex-row items-center">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3">
          <Ionicons name="arrow-back" size={24} color="#2C3F4A" />
        </TouchableOpacity>
        <Image source={{ uri: chatData.avatar }} className="h-10 w-10 rounded-full" />
        <View className="ml-3">
          <Text className="text-lg font-semibold text-text">{chatData.name}</Text>
          <Text className="text-xs text-highlight/70">Online</Text>
        </View>
      </View>
      <View className="flex-row gap-4">
        <TouchableOpacity className="rounded-full bg-primary/5 p-2">
          <Ionicons name="call" size={20} color="#2C3E8D" />
        </TouchableOpacity>
        <TouchableOpacity className="rounded-full bg-primary/5 p-2">
          <Ionicons name="videocam" size={20} color="#2C3E8D" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const screenConfig = {
  headerlessScreens: { headerShown: false },
  headerScreens: {
    headerShown: true,
    headerStyle: {
      backgroundColor: '#FFFFFF',
      elevation: 0,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
    },
    headerTintColor: '#000000',
    headerTitleStyle: {
      fontSize: 18,
      fontWeight: '600',
    },
    headerShadowVisible: false,
  },
  messageScreen: {
    headerShown: true,
    header: (props) => <MessageHeader {...props} />,
    headerStyle: {
      height: 0, // Remove default header space
    },
    headerShadowVisible: false,
  },
};

export default function AppNavigator({ isLoggedIn }) {
  return (
    <Stack.Navigator screenOptions={screenConfig.headerlessScreens}>
      {!isLoggedIn ? (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      ) : (
        <>
          <Stack.Screen name="MainDrawer" component={DrawerNavigator} />
          <Stack.Screen name="Chat" component={Chat} options={screenConfig.headerScreens} />
          <Stack.Screen name="Message" component={Message} options={screenConfig.messageScreen} />
          <Stack.Screen
            name="Notifications"
            component={Notifications}
            options={screenConfig.headerScreens}
          />
          {/* <Stack.Screen name="Map" component={Map} options={screenConfig.headerScreens} /> */}
          <Stack.Screen
            name="NewJob"
            component={NewJob}
            options={{
              ...screenConfig.headerScreens,
              title: 'Post a New Job',
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
