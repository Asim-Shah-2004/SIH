// components/CustomHeader.js
import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Drawer from './Drawer';

export default function CustomHeader() {
    const navigation = useNavigation();

    const handleChatPress = () => {
        navigation.navigate('Chat');
    };

    const handleNotificationsPress = () => {
        navigation.navigate('Notifications');
    };
    return (
        <View style={styles.headerContainer}>
            {/* <Drawer /> */}
            <TouchableOpacity>
                <Ionicons name="person-circle-outline" size={30} color="black" />
            </TouchableOpacity>
            <TextInput
                style={styles.searchBar}
                placeholder="Search"
                placeholderTextColor="#999"
            />
            <View style={styles.iconsContainer}>
                <TouchableOpacity onPress={handleChatPress}>
                    <Ionicons name="chatbubbles-outline" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleNotificationsPress}>
                    <Ionicons name="notifications-outline" size={24} color="black" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        height: 60,
        backgroundColor: '#f8f8f8',
        elevation: 4,
    },
    searchBar: {
        flex: 1,
        marginHorizontal: 10,
        paddingHorizontal: 10,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#e0e0e0',
        color: '#000',
    },
    iconsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconSpacing: {
        marginLeft: 10,
    },
});
