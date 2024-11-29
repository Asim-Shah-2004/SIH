import './global.css';
import React, { useEffect } from 'react';
import { StatusBar, SafeAreaView, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';


// Import your screens
import Login from './screens/Login';
import Register from './screens/Register';
import Chat from './screens/Chat';
import Notifications from './screens/Notifications';
import HomePage from './screens/onboarding';
import Map from './screens/Map';
import DrawerNavigator from './navigators/DrawerNavigator';

const Stack = createNativeStackNavigator();

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);
    const [loading, setLoading] = React.useState(true); // For showing a loader until AsyncStorage is checked

    useEffect(() => {
        (async () => {
            try {
                // const value = await AsyncStorage.getItem('isLoggedIn');
                // console.log('Data read:', value);
                // setIsLoggedIn(value === 'true');
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
                    <Stack.Screen name="Map" component={Map} />
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