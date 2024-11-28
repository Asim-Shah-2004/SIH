// screens/About.js
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function About({ navigation }) {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>This is the Other Screen</Text>
            <Button title="Go Back" onPress={() => navigation.goBack()} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 20,
    },
});
