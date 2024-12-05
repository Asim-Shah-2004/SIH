import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import AuthNavigator from './AuthNavigator';
import DrawerNavigator from './DrawerNavigator';
import NewJob from '../components/jobs/NewJob';
import { AuthContext } from '../providers/CustomProvider';
import AlumniDirectory from '../screens/AlumniDirectory';
import Chat from '../screens/Chat';
import Message from '../screens/Message';
import Notifications from '../screens/Notifications';
import MessageHeader from './components/MessageHeader';
// import Map from '../screens/Map';

const Stack = createNativeStackNavigator();

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

export default function AppNavigator() {
  const { isLoggedIn } = React.useContext(AuthContext);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack.Navigator screenOptions={screenConfig.headerlessScreens}>
        {!isLoggedIn ? (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : (
          <>
            <Stack.Screen name="MainDrawer" component={DrawerNavigator} />
            <Stack.Screen name="Chat" component={Chat} options={screenConfig.headerScreens} />
            <Stack.Screen name="Message" component={Message} options={screenConfig.messageScreen} />
            <Stack.Screen
              name="Alerts"
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
            {/* <Stack.Screen
              name="Map"
              component={Map}
              options={{
                ...screenConfig.headerScreens,
                title: 'Alumni Map',
              }}
            /> */}
            <Stack.Screen
              name="Directory"
              component={AlumniDirectory}
              options={{
                ...screenConfig.headerScreens,
                title: 'Alumni Directory',
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </GestureHandlerRootView>
  );
}
