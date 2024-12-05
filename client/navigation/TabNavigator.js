import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';
import { TouchableOpacity, StyleSheet, Platform, Dimensions } from 'react-native';

import MainHeader from './components/MainHeader';
import Connections from '../screens/Connections';
import Donations from '../screens/Donations';
import HallofFame from '../screens/HallofFame';
import Home from '../screens/Home';
import Jobs from '../screens/Jobs';

const Tab = createBottomTabNavigator();

const { width } = Dimensions.get('window');
const isSmallDevice = width < 375;
const isLargeDevice = width >= 768;

const tabConfig = {
  screenOptions: ({ navigation }) => ({
    header: () => <MainHeader />,
    tabBarShowLabel: false,
    tabBarHideOnKeyboard: true,
    tabBarStyle: {
      backgroundColor: '#000',
      height: isSmallDevice ? 50 : isLargeDevice ? 70 : 60,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowOffset: {
        width: 0,
        height: -2,
      },
      shadowRadius: 4,
      borderTopWidth: 0,
      paddingHorizontal: 10,
      paddingBottom: Platform.OS === 'ios' ? 20 : 0,
    },
    tabBarActiveTintColor: '#fff',
    tabBarInactiveTintColor: '#7A7A7A',
    tabBarButton: (props) => (
      <TouchableOpacity
        activeOpacity={0.6}
        {...props}
        style={[props.style, styles.tabButton]}
        onPress={(e) => {
          if (Platform.OS === 'web') {
            e.preventDefault();
          }

          // Handle haptics only on mobile
          if (Platform.OS !== 'web') {
            if (props.accessibilityState?.selected) {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            } else {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }
          }

          // Navigate to the screen
          const screen = props?.children?.props?.href?.split('/').pop();
          if (screen) {
            navigation.navigate(screen);
          }

          props.onPress?.(e);
        }}
      />
    ),
  }),
};

const getTabIcon =
  (name) =>
    ({ focused, color, size }) => {
      const iconSize = isSmallDevice ? size : isLargeDevice ? size * 1.3 : size + 4;
      return (
        <Ionicons
          name={focused ? name : `${name}-outline`}
          size={focused ? iconSize + 6 : iconSize + 2}
          color={color}
          style={[styles.icon, focused && styles.activeIcon]}
        />
      );
    };

const styles = StyleSheet.create({
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: isSmallDevice ? 8 : isLargeDevice ? 14 : 10,
    minHeight: 44, // Minimum touch target size
  },
  icon: {
    transform: [{ scale: 1 }],
  },
  activeIcon: {
    transform: [{ scale: isSmallDevice ? 1.05 : 1.1 }],
  },
});

const tabs = [
  { name: 'Home', component: Home, icon: 'home' },
  { name: 'Donations', component: Donations, icon: 'gift' },
  { name: 'Jobs', component: Jobs, icon: 'briefcase' },
  { name: 'Connect', component: Connections, icon: 'people' },
  { name: 'HallofFame', component: HallofFame, icon: 'trophy' },
];

const TabNavigator = () => {
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
};

export default TabNavigator;
