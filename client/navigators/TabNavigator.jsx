import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../screens/Home';
import CustomHeader from '../components/CustomHeader';
import Donations from '../screens/Donations';
import Jobs from '../screens/Jobs';
import NewPost from '../screens/NewPost';
import ProfileScreen from '../screens/profileScreen';
import Connections from '../screens/Connections';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator ();

export default TabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                header: () => <CustomHeader />,
                tabBarStyle: {
                    height: 70,
                    paddingBottom: 10,
                    paddingTop: 10,
                    backgroundColor: '#FFFFFF',
                    borderTopWidth: 1,
                    borderTopColor: '#F0F0F0',
                    elevation: 8,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: -2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                },
                tabBarActiveTintColor: '#007AFF',
                tabBarInactiveTintColor: '#8E8E93',
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '500',
                },
            }}
        >
            <Tab.Screen
                name="Home"
                component={Home}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home" color={color} size={26} />
                    ),
                }}
            />
            <Tab.Screen
                name="Donations"
                component={Donations}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="compass" color={color} size={26} />
                    ),
                }}
            />
            <Tab.Screen
                name="Post"
                component={NewPost}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="add-circle" color={color} size={26} />
                    ),
                }}
            />
            <Tab.Screen
                name="Jobs"
                component={Jobs}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="pulse" color={color} size={26} />
                    ),
                }}
            />
            <Tab.Screen
                name="Connect"
                component={Connections}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person" color={color} size={26} />
                    ),
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person" color={color} size={26} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};