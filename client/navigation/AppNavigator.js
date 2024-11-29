import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AuthNavigator from './AuthNavigator';
import DrawerNavigator from './DrawerNavigator';
import Chat from '../screens/Chat';
import Notifications from '../screens/Notifications';
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
          <Stack.Screen
            name="Notifications"
            component={Notifications}
            options={screenConfig.headerScreens}
          />
          {/* <Stack.Screen name="Map" component={Map} options={screenConfig.headerScreens} /> */}
        </>
      )}
    </Stack.Navigator>
  );
}
