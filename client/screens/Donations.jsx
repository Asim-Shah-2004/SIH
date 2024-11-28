import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Image } from 'react-native';

const donationData = [
    { id: '1', title: 'Children Education', goal: 500000, raised: 120000 },
    { id: '2', title: 'Disaster Relief', goal: 1000000, raised: 750000 },
    { id: '3', title: 'Healthcare for the Poor', goal: 2000000, raised: 1800000 },
];

const DonationPortal = () => {
    const [donationAmount, setDonationAmount] = useState('');
    const [donationHistory, setDonationHistory] = useState([]);

    const handleDonation = (amount) => {
        if (amount && !isNaN(amount) && amount > 0) {
            setDonationHistory([...donationHistory, { amount, date: new Date().toLocaleString() }]);
            setDonationAmount('');
            alert('Thank you for your donation!');
        } else {
            alert('Please enter a valid donation amount');
        }
    };

    const renderDonationGoal = ({ item }) => (
        <View style={styles.donationCard}>
            <Text style={styles.donationTitle}>{item.title}</Text>
            <View style={styles.progressContainer}>
                <Text style={styles.progressText}>
                    Raised: ₹{item.raised} / Goal: ₹{item.goal}
                </Text>
                <View style={styles.progressBar}>
                    <View
                        style={[
                            styles.progressFill,
                            { width: `${(item.raised / item.goal) * 100}%` },
                        ]}
                    />
                </View>
            </View>
            <TouchableOpacity
                style={styles.donateButton}
                onPress={() => handleDonation(donationAmount)}
            >
                <Text style={styles.donateButtonText}>Donate Now</Text>
            </TouchableOpacity>
        </View>
    );

    const renderDonationHistory = ({ item }) => (
        <View style={styles.historyCard}>
            <Text style={styles.historyAmount}>₹{item.amount}</Text>
            <Text style={styles.historyDate}>{item.date}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Donation Input Section */}
            <View style={styles.donationInputSection}>
                <Text style={styles.inputLabel}>Enter Donation Amount</Text>
                <TextInput
                    style={styles.donationInput}
                    placeholder="₹0"
                    keyboardType="numeric"
                    value={donationAmount}
                    onChangeText={(text) => setDonationAmount(text)}
                />
                <TouchableOpacity
                    style={styles.donateButton}
                    onPress={() => handleDonation(donationAmount)}
                >
                    <Text style={styles.donateButtonText}>Donate Now</Text>
                </TouchableOpacity>
            </View>

            {/* Donation Goals Section */}
            <Text style={styles.sectionTitle}>Current Donation Campaigns</Text>
            <FlatList
                data={donationData}
                renderItem={renderDonationGoal}
                keyExtractor={(item) => item.id}
            />

            {/* Donation History Section */}
            <Text style={styles.sectionTitle}>Donation History</Text>
            <FlatList
                data={donationHistory}
                renderItem={renderDonationHistory}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f4f4f4',
    },
    donationInputSection: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 8,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    donationInput: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingLeft: 10,
        fontSize: 16,
        marginBottom: 15,
    },
    donateButton: {
        backgroundColor: '#3498db',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
    },
    donateButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    donationCard: {
        backgroundColor: '#fff',
        padding: 16,
        marginBottom: 20,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    donationTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    progressContainer: {
        marginBottom: 12,
    },
    progressText: {
        fontSize: 14,
        color: '#34495e',
    },
    progressBar: {
        height: 10,
        backgroundColor: '#ddd',
        borderRadius: 5,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#3498db',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    historyCard: {
        backgroundColor: '#fff',
        padding: 16,
        marginBottom: 10,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    historyAmount: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#27ae60',
    },
    historyDate: {
        fontSize: 14,
        color: '#7f8c8d',
        marginTop: 5,
    },
});

export default DonationPortal;
