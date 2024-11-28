import './global.css';

import React from 'react';
import { StatusBar, SafeAreaView, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import CustomHeader from './components/CustomHeader';
import Home from './screens/Home';
import About from './screens/About';
import New from './screens/New';
import Other from './screens/Other';
import Login from './screens/Login';
import Register from './screens/Register';
import Chat from './screens/Chat';
import Notifications from './screens/Notifications';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const App = () => {
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <NavigationContainer>
                <Stack.Navigator>
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
                        name="Tabs"
                        component={TabNavigator}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen name="Chat" component={Chat} />
                    <Stack.Screen name="Notifications" component={Notifications} />
                </Stack.Navigator>
            </NavigationContainer>
        </SafeAreaView>
    );
};

const TabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                header: () => <CustomHeader />,
                tabBarActiveTintColor: 'blue',
                tabBarInactiveTintColor: 'gray',
            }}
        >
            <Tab.Screen
                name="Home"
                component={Home}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home-outline" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="About"
                component={About}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="information-circle-outline" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="New"
                component={New}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="add-circle-outline" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="Other"
                component={Other}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="grid-outline" color={color} size={size} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});

export default App;
