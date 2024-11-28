import './global.css';
import React, { useEffect } from 'react';
import { StatusBar, SafeAreaView, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import your screens
import CustomHeader from './components/CustomHeader';
import Home from './screens/Home';
import Events from './screens/Events';
import NewPost from './screens/NewPost';
import Jobs from './screens/Jobs';
import Login from './screens/Login';
import Register from './screens/Register';
import Chat from './screens/Chat';
import Notifications from './screens/Notifications';
import HomePage from './screens/onboarding';
import Settings from './screens/Settings';
import ProfileScreen from './screens/profileScreen';
import Donations from './screens/Donations';
import Connections from './screens/Connections';
// import Map from './screens/Map';

// Create Navigators
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

// Tab Navigator
const TabNavigator = () => {
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

// Drawer Navigator
const DrawerNavigator = () => {
    return (
        <Drawer.Navigator
            screenOptions={{
                headerShown: false,
                drawerStyle: {
                    backgroundColor: '#ffffff',
                    width: 300,
                    borderTopRightRadius: 20,
                    borderBottomRightRadius: 20,
                    paddingTop: 20,
                },
                drawerItemStyle: {
                    borderRadius: 10,
                    paddingVertical: 4,
                    marginHorizontal: 12,
                },
                drawerLabelStyle: {
                    fontSize: 16,
                    fontWeight: '500',
                    marginLeft: -16,
                    paddingVertical: 6,
                },
                drawerActiveBackgroundColor: '#e7f3ff',
                drawerActiveTintColor: '#131313',
                drawerInactiveTintColor: '#5f6368',
            }}
            initialRouteName="MainTabs"
        >
            <Drawer.Screen
                name="MainTabs"
                component={TabNavigator}
                options={{
                    title: 'Home',
                    drawerIcon: ({ color, size }) => (
                        <Ionicons
                            name="home"
                            size={size}
                            color={color}
                            style={{ marginLeft: 4, marginRight: 8 }}
                        />
                    ),
                }}
            />
            <Drawer.Screen
                name="Settings"
                component={Settings}
                options={{
                    drawerIcon: ({ color, size }) => (
                        <Ionicons
                            name="settings"
                            size={size}
                            color={color}
                            style={{ marginLeft: 4, marginRight: 8 }}
                        />
                    ),
                }}
            />
            <Drawer.Screen
                name="Events"
                component={Events}
                options={{
                    drawerIcon: ({ color, size }) => (
                        <Ionicons
                            name="calendar"
                            size={size}
                            color={color}
                            style={{ marginLeft: 4, marginRight: 8 }}
                        />
                    ),
                }}
            />
        </Drawer.Navigator>
    );
};

// Main App Navigation
const App = () => {
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);
    const [loading, setLoading] = React.useState(true); // For showing a loader until AsyncStorage is checked

    useEffect(() => {
        (async () => {
            try {
                const value = await AsyncStorage.getItem('isLoggedIn');
                console.log('Data read:', value);
                setIsLoggedIn(value === 'true');
            } catch (e) {
                console.error('Error reading AsyncStorage:', e);
            } finally {
                delayFunc = async () => {
                    setTimeout(() => setLoading(false), 1000); // Done checking, hide the loader
                }
                await delayFunc(); // Done checking, hide the loader
            }
        })();
    }, []);

    if (loading) {
        return (
            <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={{ marginTop: 10, fontSize: 16, color: '#8E8E93', fontWeight: '500' }}>
                    Please wait, loading your experience...
                </Text>
            </SafeAreaView>
        );
    }


    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
            <NavigationContainer>
                <Stack.Navigator initialRouteName={isLoggedIn ? 'MainDrawer' : 'Onboarding'}>
                    <Stack.Screen
                        name="Onboarding"
                        component={HomePage}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="Login"
                        component={Login}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="Register"
                        component={Register}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="MainDrawer"
                        component={DrawerNavigator}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen name="Chat" component={Chat} />
                    <Stack.Screen name="Notifications" component={Notifications} />
                    {/* <Stack.Screen name="Map" component={Map} /> */}
                </Stack.Navigator>
            </NavigationContainer>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});

export default App;