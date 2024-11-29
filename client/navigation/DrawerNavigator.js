import { Ionicons } from '@expo/vector-icons';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';

import TabNavigator from './TabNavigator';
import Events from '../screens/Events';
import Settings from '../screens/Settings';
import ProfileScreen from '../screens/profileScreen';

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
  const navigation = useNavigation();
  return (
    <Drawer.Navigator screenOptions={drawerConfig.screenOptions}>
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
          headerShown: true
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={Settings}
        options={{
          drawerIcon: getDrawerIcon('settings'),
          headerShown: true
        }}
      />
    </Drawer.Navigator>
  );
}
