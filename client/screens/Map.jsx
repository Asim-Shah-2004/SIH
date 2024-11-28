import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Modal } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const MapScreen = () => {
    const [location, setLocation] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);

    const users = [
        // Users in India
        { id: 1, name: 'John Doe', latitude: 28.6139, longitude: 77.2090, profilePhoto: require('../assets/profile.jpg') }, // New Delhi
        { id: 2, name: 'Jane Smith', latitude: 19.0760, longitude: 72.8777, profilePhoto: require('../assets/profile.jpg') }, // Mumbai
        { id: 3, name: 'Alice Johnson', latitude: 12.9716, longitude: 77.5946, profilePhoto: require('../assets/profile.jpg') }, // Bangalore
        { id: 4, name: 'Bob Brown', latitude: 22.5726, longitude: 88.3639, profilePhoto: require('../assets/profile.jpg') }, // Kolkata
        { id: 5, name: 'Charlie Davis', latitude: 13.0827, longitude: 80.2707, profilePhoto: require('../assets/profile.jpg') }, // Chennai
        { id: 6, name: 'David Wilson', latitude: 17.385044, longitude: 78.486671, profilePhoto: require('../assets/profile.jpg') }, // Hyderabad
        { id: 7, name: 'Eva Martinez', latitude: 23.0225, longitude: 72.5714, profilePhoto: require('../assets/profile.jpg') }, // Ahmedabad
        { id: 8, name: 'Frank White', latitude: 26.8467, longitude: 80.9462, profilePhoto: require('../assets/profile.jpg') }, // Lucknow
        { id: 9, name: 'Grace Green', latitude: 28.7041, longitude: 77.1025, profilePhoto: require('../assets/profile.jpg') }, // Delhi
        { id: 10, name: 'Henry Clark', latitude: 19.2183, longitude: 84.7915, profilePhoto: require('../assets/profile.jpg') }, // Bhubaneswar

        // Users outside of India
        { id: 11, name: 'Isla Turner', latitude: 31.5497, longitude: 74.3436, profilePhoto: require('../assets/profile.jpg') }, // Lahore, Pakistan
        { id: 12, name: 'Jack Walker', latitude: 51.5074, longitude: -0.1278, profilePhoto: require('../assets/profile.jpg') }, // London, UK
        { id: 13, name: 'Kathy Scott', latitude: 40.7128, longitude: -74.0060, profilePhoto: require('../assets/profile.jpg') }, // New York, USA
        { id: 14, name: 'Leo Harris', latitude: 48.8566, longitude: 2.3522, profilePhoto: require('../assets/profile.jpg') }, // Paris, France
        { id: 15, name: 'Mona King', latitude: 34.0522, longitude: -118.2437, profilePhoto: require('../assets/profile.jpg') }, // Los Angeles, USA
        { id: 16, name: 'Nina Lee', latitude: 52.5200, longitude: 13.4050, profilePhoto: require('../assets/profile.jpg') }, // Berlin, Germany
        { id: 17, name: 'Oscar Perez', latitude: 40.7306, longitude: -73.9352, profilePhoto: require('../assets/profile.jpg') }, // Brooklyn, USA
        { id: 18, name: 'Penny Lewis', latitude: 43.65107, longitude: -79.347015, profilePhoto: require('../assets/profile.jpg') }, // Toronto, Canada
        { id: 19, name: 'Quinn Allen', latitude: -33.8688, longitude: 151.2093, profilePhoto: require('../assets/profile.jpg') }, // Sydney, Australia
        { id: 20, name: 'Rachel Adams', latitude: 35.6895, longitude: 139.6917, profilePhoto: require('../assets/profile.jpg') } // Tokyo, Japan
    ];

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') return;

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location.coords);
        })();
    }, []);

    if (!location) return <Text>Loading...</Text>;

    const handleMarkerPress = (user) => {
        // console.log('User selected:', user);
        setSelectedUser(user);
    };

    const handleCloseModal = () => {
        setSelectedUser(null);
        // console.log('Modal closed');
    };

    return (
        <View style={{ flex: 1 }}>
            <MapView
                style={{ flex: 1 }}
                provider={MapView.PROVIDER_OSM}
                initialRegion={{
                    latitude: 21.1458,  // Center of Nagpur
                    longitude: 79.0882, // Center of Nagpur // Center of India (New Delhi)
                    latitudeDelta: 23,  // Increased to zoom out more
                    longitudeDelta: 23, // Increased to zoom out more
                }}
                showsUserLocation={true}
            >
                {/* Markers for users */}
                {users.map((user) => (
                    <Marker
                        key={user.id}
                        coordinate={{
                            latitude: user.latitude,
                            longitude: user.longitude
                        }}
                        onPress={() => handleMarkerPress(user)}
                    >
                        <Image
                            source={user.profilePhoto}
                            style={{ width: 40, height: 40, borderRadius: 20 }}
                        />
                    </Marker>
                ))}
            </MapView>

            {/* Modal to display user details */}
            <Modal
                visible={!!selectedUser} // Show modal when a user is selected
                transparent={true}
                animationType="slide"
                onRequestClose={handleCloseModal}
            >
                {selectedUser && (
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Image
                                source={selectedUser.profilePhoto}
                                style={styles.profileImage}
                            />
                            <Text style={styles.userName}>{selectedUser.name}</Text>
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={() => console.log('View Profile')}
                                >
                                    <Text style={styles.buttonText}>View Profile</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={() => console.log('Connect')}
                                >
                                    <Text style={styles.buttonText}>Connect</Text>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={handleCloseModal}
                            >
                                <Text style={styles.closeButtonText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        width: '80%',
        maxWidth: 300,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        marginVertical: 10,
    },
    button: {
        backgroundColor: '#4CAF50',
        paddingVertical: 10,
        paddingHorizontal: 15,
        margin: 5,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 14,
    },
    closeButton: {
        marginTop: 20,
        padding: 10,
    },
    closeButtonText: {
        color: 'blue',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default MapScreen;
