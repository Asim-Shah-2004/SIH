import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';
import { TouchableOpacity, StyleSheet } from 'react-native';

import MainHeader from './components/MainHeader';
import Connections from '../screens/Connections';
import Donations from '../screens/Donations';
import Home from '../screens/Home';
import Jobs from '../screens/Jobs';
import NewPost from '../screens/NewPost';

const Tab = createBottomTabNavigator();

const tabConfig = {
  screenOptions: ({ navigation }) => ({
    header: () => <MainHeader />,
    tabBarShowLabel: false,
    tabBarStyle: {
      position: 'absolute',
      left: 12,
      right: 12,
      elevation: 8,
      backgroundColor: '#000',
      borderRadius: 5,
      height: 60,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowOffset: {
        width: 0,
        height: 6,
      },
      shadowRadius: 8,
      paddingHorizontal: 10,
      borderTopWidth: 0,
    },
    tabBarActiveTintColor: '#fff',
    tabBarInactiveTintColor: '#7A7A7A',
    tabBarButton: (props) => (
      <TouchableOpacity
        activeOpacity={0.6}
        {...props}
        style={[props.style, styles.tabButton]}
        onPress={(e) => {
          // Enhanced haptic feedback
          if (props.accessibilityState?.selected) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          } else {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          }
          props.onPress?.(e);
        }}
      />
    ),
  }),
};

const getTabIcon =
  (name) =>
  ({ focused, color, size }) =>
    (
      <Ionicons
        name={focused ? name : `${name}-outline`}
        size={focused ? size + 6 : size + 2}
        color={color}
        style={[
          styles.icon,
          focused && styles.activeIcon
        ]}
      />
    );

const styles = StyleSheet.create({
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    transform: [{ scale: 1 }],
  },
  activeIcon: {
    transform: [{ scale: 1.1 }],
  }
});

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
