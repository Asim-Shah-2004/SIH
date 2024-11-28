import React from 'react';
import { View, Button, Alert, StyleSheet } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { Linking } from 'react-native';

export default function App() {
    const authenticateAndSendSMS = async (phoneNumber, message) => {
        try {
            // Check if hardware supports biometric authentication
            const hasHardware = await LocalAuthentication.hasHardwareAsync();
            if (!hasHardware) {
                Alert.alert('Error', 'Your device does not support biometric authentication.');
                return;
            }

            // Check if fingerprints are enrolled
            const isEnrolled = await LocalAuthentication.isEnrolledAsync();
            if (!isEnrolled) {
                Alert.alert('Error', 'No fingerprints are enrolled on this device.');
                return;
            }

            // Authenticate the user
            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: 'Authenticate to Send SMS',
                fallbackLabel: 'Enter PIN',
            });

            if (result.success) {
                // Open SMS app if authentication succeeds
                const smsURL = `sms:${phoneNumber}?body=${encodeURIComponent(message)}`;
                Linking.canOpenURL(smsURL)
                    .then((supported) => {
                        if (supported) {
                            return Linking.openURL(smsURL);
                        } else {
                            Alert.alert('Error', 'Unable to open the messaging app.');
                        }
                    })
                    .catch((err) => console.error('Error:', err));
            } else {
                Alert.alert('Authentication Failed', 'Could not authenticate using biometrics.');
            }
        } catch (error) {
            console.error('Authentication Error:', error);
            Alert.alert('Error', 'An error occurred during authentication.');
        }
    };

    return (
        <View style={styles.container}>
            <Button
                title="Send SMS"
                onPress={() =>
                    authenticateAndSendSMS('+91 7045514680', 'Hello! This is a test message from React Native.')
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
    },
});
