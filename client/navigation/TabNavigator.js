import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import MainHeader from './components/MainHeader';
import Connections from '../screens/Connections';
import Donations from '../screens/Donations';
import Home from '../screens/Home';
import Jobs from '../screens/Jobs';
import NewPost from '../screens/NewPost';

const Tab = createBottomTabNavigator();

const tabConfig = {
  screenOptions: {
    header: () => <MainHeader />,
    tabBarStyle: {
      height: 60,
      paddingHorizontal: 5,
      paddingBottom: 8,
      paddingTop: 8,
      backgroundColor: '#FFFFFF',
      borderTopWidth: 0,
      elevation: 10,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: -3 },
      shadowOpacity: 0.15,
      shadowRadius: 10,
    },
    tabBarActiveTintColor: '#0066FF',
    tabBarInactiveTintColor: '#7A7A7A',
    tabBarLabelStyle: {
      fontSize: 11,
      fontWeight: '600',
      marginBottom: 4,
    },
    tabBarItemStyle: {
      paddingVertical: 5,
    },
    tabBarPressColor: '#E6EFFF',
    tabBarPressOpacity: 0.8,
  },
};

const getTabIcon =
  (name) =>
  ({ focused, color, size }) => (
    <Ionicons
      name={name}
      size={size}
      color={color}
      style={{
        transform: [{ scale: focused ? 1.1 : 1 }],
        opacity: focused ? 1 : 0.8,
      }}
    />
  );

const tabs = [
  { name: 'Home', component: Home, icon: 'home' },
  { name: 'Donations', component: Donations, icon: 'gift' },
  { name: 'NewPost', component: NewPost, icon: 'add-circle' },
  { name: 'Jobs', component: Jobs, icon: 'briefcase' },
  { name: 'Connect', component: Connections, icon: 'people' },
];

export default function TabNavigator() {
  return (
    <Tab.Navigator screenOptions={tabConfig.screenOptions}>
      {tabs.map(({ name, component, icon }) => (
        <Tab.Screen
          key={name}
          name={name}
          component={component}
          options={{
            tabBarIcon: getTabIcon(icon),
          }}
        />
      ))}
    </Tab.Navigator>
  );
}
