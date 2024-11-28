import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const MapScreen = () => {
    const [location, setLocation] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);

    const users = [
        { id: 1, name: 'User 1', latitude: 28.6139, longitude: 77.2090, profilePhoto: require('../assets/profile.jpg') },
        { id: 2, name: 'User 2', latitude: 19.0760, longitude: 72.8777, profilePhoto: require('../assets/profile.jpg') }
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

    return (
        <View style={{ flex: 1 }}>
            <MapView
                style={{ flex: 1 }}
                initialRegion={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            >
                {users.map((user) => (
                    <Marker
                        key={user.id}
                        coordinate={{
                            latitude: user.latitude,
                            longitude: user.longitude
                        }}
                        onPress={() => setSelectedUser(user)}
                    >
                        <Image
                            source={user.profilePhoto}
                            style={{ width: 40, height: 40, borderRadius: 20 }}
                        />
                    </Marker>
                ))}
            </MapView>

            <Modal
                visible={!!selectedUser}
                transparent={true}
                animationType="slide"
            >
                {selectedUser && (
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Image
                                source={selectedUser.profilePhoto}
                                style={styles.profileImage}
                            />
                            <Text>{selectedUser.name}</Text>
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={() => console.log('View Profile')}
                                >
                                    <Text>View Profile</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={() => console.log('Connect')}
                                >
                                    <Text>Connect</Text>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity onPress={() => setSelectedUser(null)}>
                                <Text>Close</Text>
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
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center'
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%'
    },
    button: {
        backgroundColor: 'lightblue',
        padding: 10,
        borderRadius: 5
    }
});

export default MapScreen;