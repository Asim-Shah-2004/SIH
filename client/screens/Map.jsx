import * as Location from 'expo-location';
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Modal } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import { alumniMapData } from '../constants/alumni/alumniMapData';

const MapScreen = () => {
  const [location, setLocation] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      const location = await Location.getCurrentPositionAsync({});
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
          latitude: 21.1458, // Center of Nagpur
          longitude: 79.0882, // Center of Nagpur // Center of India (New Delhi)
          latitudeDelta: 23, // Increased to zoom out more
          longitudeDelta: 23, // Increased to zoom out more
        }}
        showsUserLocation>
        {alumniMapData.map((user) => (
          <Marker
            key={user.id}
            coordinate={{
              latitude: user.latitude,
              longitude: user.longitude,
            }}
            onPress={() => handleMarkerPress(user)}>
            <Image source={user.profilePhoto} style={{ width: 40, height: 40, borderRadius: 20 }} />
          </Marker>
        ))}
      </MapView>

      <Modal
        visible={!!selectedUser}
        transparent
        animationType="slide"
        onRequestClose={handleCloseModal}>
        {selectedUser && (
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Image source={selectedUser.profilePhoto} style={styles.profileImage} />
              <Text style={styles.userName}>{selectedUser.name}</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={() => console.log('View Profile')}>
                  <Text style={styles.buttonText}>View Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => console.log('Connect')}>
                  <Text style={styles.buttonText}>Connect</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.closeButton} onPress={handleCloseModal}>
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
