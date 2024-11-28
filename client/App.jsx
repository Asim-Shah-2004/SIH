import './global.css';
import React from 'react';
import { StatusBar, SafeAreaView, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';

// Import your screens
import CustomHeader from './components/CustomHeader';
import Home from './screens/Home';
import About from './screens/About';
import New from './screens/New';
import Other from './screens/Other';
import Login from './screens/Login';
import Register from './screens/Register';
import Chat from './screens/Chat';
import Notifications from './screens/Notifications';
import HomePage from './screens/onboarding';
import Settings from './screens/Settings';

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
                name="Explore"
                component={About}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="compass" color={color} size={26} />
                    ),
                }}
            />
            <Tab.Screen
                name="New"
                component={New}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="add-circle" color={color} size={26} />
                    ),
                }}
            />
            <Tab.Screen
                name="Activity"
                component={Other}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="pulse" color={color} size={26} />
                    ),
                }}
            />
            <Tab.Screen
                name="Profile"
                component={Other}
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
                            style={{ marginLeft: 4,marginRight: 8 }}
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
                            style={{ marginLeft: 4,marginRight: 8 }}
                        />
                    ),
                }}
            />
            <Drawer.Screen 
                name="Events" 
                component={Settings} 
                options={{
                    drawerIcon: ({ color, size }) => (
                        <Ionicons 
                            name="calendar" 
                            size={size} 
                            color={color}
                            style={{ marginLeft: 4,marginRight: 8 }}
                        />
                    ),
                }}
            />
        </Drawer.Navigator>
    );
};

// Main App Navigation
const App = () => {
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
            <NavigationContainer>
                <Stack.Navigator>
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