import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, TouchableOpacity, Alert, Linking } from 'react-native';
import * as Contacts from 'expo-contacts';

export default function App() {
    const [contacts, setContacts] = useState([]); // To store contacts
    const [hasPermission, setHasPermission] = useState(false); // To track permission status

    // Request permissions when the component mounts
    useEffect(() => {
        const getPermissions = async () => {
            const { status } = await Contacts.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        };

        getPermissions();
    }, []);

    // Fetch contacts from the device
    const fetchContacts = async () => {
        if (!hasPermission) {
            alert('Permission to access contacts was denied.');
            return;
        }

        const { data } = await Contacts.getContactsAsync({
            fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
        });

        if (data.length > 0) {
            setContacts(data);
        } else {
            alert('No contacts found on the device.');
        }
    };

    // Function to make a call
    const makeCall = (phoneNumber) => {
        if (!phoneNumber) {
            Alert.alert('Error', 'This contact has no phone number.');
            return;
        }
        const url = `tel:${phoneNumber}`;
        Linking.canOpenURL(url)
            .then((supported) => {
                if (supported) {
                    Linking.openURL(url);
                } else {
                    Alert.alert('Error', 'Unable to make a call from this device.');
                }
            })
            .catch((err) => console.error(err));
    };

    return (
        <View style={styles.container}>
            <Button title="Load Contacts" onPress={fetchContacts} />
            {contacts.length > 0 ? (
                <FlatList
                    data={contacts}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.contactItem}>
                            <Text style={styles.contactName}>{item.name || 'No Name'}</Text>
                            <Text style={styles.contactNumber}>
                                {item.phoneNumbers?.[0]?.number || 'No Phone Number'}
                            </Text>
                            {item.phoneNumbers?.[0]?.number && (
                                <TouchableOpacity
                                    style={styles.callButton}
                                    onPress={() => makeCall(item.phoneNumbers[0].number)}
                                >
                                    <Text style={styles.callButtonText}>Call</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    )}
                />
            ) : (
                <Text style={styles.noContactsText}>No contacts loaded yet.</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f8f8f8',
    },
    contactItem: {
        padding: 15,
        marginVertical: 8,
        backgroundColor: '#ffffff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 1 },
        elevation: 3,
    },
    contactName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    contactNumber: {
        fontSize: 14,
        color: '#555',
        marginBottom: 5,
    },
    noContactsText: {
        marginTop: 20,
        fontSize: 16,
        color: '#999',
        textAlign: 'center',
    },
    callButton: {
        marginTop: 5,
        padding: 10,
        backgroundColor: '#007bff',
        borderRadius: 5,
    },
    callButtonText: {
        color: '#fff',
        fontSize: 14,
        textAlign: 'center',
    },
});
