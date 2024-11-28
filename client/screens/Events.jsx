import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

const eventsData = [
    { id: '1', title: 'Tech Conference 2024', location: 'Mumbai, India', date: '25th December 2024', time: '10:00 AM' },
    { id: '2', title: 'AI & ML Workshop', location: 'Bangalore, India', date: '5th January 2025', time: '02:00 PM' },
    { id: '3', title: 'Product Launch: InnovatePro', location: 'Delhi, India', date: '15th February 2025', time: '11:00 AM' },
    { id: '4', title: 'UX/UI Design Bootcamp', location: 'Pune, India', date: '20th March 2025', time: '09:00 AM' },
];

const EventPortal = () => {
    const renderEvent = ({ item }) => (
        <View style={styles.eventCard}>
            <Text style={styles.eventTitle}>{item.title}</Text>
            <Text style={styles.eventLocation}>{item.location}</Text>
            <Text style={styles.eventDate}>{item.date}</Text>
            <Text style={styles.eventTime}>{item.time}</Text>
            <TouchableOpacity style={styles.registerButton}>
                <Text style={styles.registerButtonText}>Register Now</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={eventsData}
                renderItem={renderEvent}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.flatListContainer}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',  // Light gray-blue (background)
        paddingVertical: 20,
        paddingHorizontal: 16,
    },
    flatListContainer: {
        paddingBottom: 20,
    },
    eventCard: {
        backgroundColor: '#FFFFFF', // White
        padding: 16,
        marginBottom: 16,
        borderRadius: 8,
        shadowColor: '#000000',  // Shadow effect
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,  // Shadow for Android
    },
    eventTitle: {
        color: '#2C3E8D',  // Deep blue (primary)
        fontSize: 18,
        fontWeight: 'bold',
    },
    eventLocation: {
        color: '#3498DB',  // Bright blue (secondary)
        fontSize: 16,
        marginTop: 5,
    },
    eventDate: {
        color: '#2C3F4A',  // Dark navy gray (text)
        fontSize: 14,
        marginTop: 5,
    },
    eventTime: {
        color: '#34495E',  // Highlight gray
        fontSize: 14,
        marginTop: 5,
    },
    registerButton: {
        backgroundColor: '#3498DB',  // Bright blue (secondary)
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginTop: 16,
    },
    registerButtonText: {
        color: '#FFFFFF',  // White text
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default EventPortal;
