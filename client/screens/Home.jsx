// screens/Home.js
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function Home({ navigation }) {
    return (
        <View style={styles.container} >
            <Text style={styles.text}>This is the Home Screen</Text>
            <Text className="font-bold bg-blue-700">Hello, Global Styles!</Text>
            <Button title="Go to About" onPress={() => navigation.navigate('About')} />
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
