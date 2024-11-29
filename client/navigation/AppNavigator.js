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
      className: 'bg-background',
    },
    headerTintColor: 'rgb(var(--color-text))',
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
