import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';

const donationData = [
    { id: '1', title: 'Children Education', goal: 500000, raised: 120000 },
    { id: '2', title: 'Disaster Relief', goal: 1000000, raised: 750000 },
    { id: '3', title: 'Healthcare for the Poor', goal: 2000000, raised: 1800000 },
];

const DonationPortal = ({ navigation }) => {
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
        <View className="bg-white p-4 mb-4 rounded-lg shadow-md">
            <Text className="text-lg font-bold mb-2">{item.title}</Text>
            <View className="mb-3">
                <Text className="text-gray-700">
                    Raised: ₹{item.raised} / Goal: ₹{item.goal}
                </Text>
                <View className="h-2 bg-gray-300 rounded-full mt-1">
                    <View
                        className="h-2 bg-blue-500 rounded-full"
                        style={{ width: `${(item.raised / item.goal) * 100}%` }}
                    />
                </View>
            </View>
            <TouchableOpacity
                className="bg-blue-500 py-2 px-4 rounded-lg"
                onPress={() => handleDonation(donationAmount)}
            >
                <Text className="text-white text-center font-bold">Donate Now</Text>
            </TouchableOpacity>
        </View>
    );

    const renderDonationHistory = ({ item }) => (
        <View className="bg-white p-4 mb-2 rounded-lg shadow-md">
            <Text className="text-green-600 font-bold">₹{item.amount}</Text>
            <Text className="text-gray-500">{item.date}</Text>
        </View>
    );

    return (
        <View className="flex-1 p-5 bg-gray-100">
            {/* Donation Input Section */}
            <View className="bg-white p-5 rounded-lg shadow-md mb-6">
                <Text className="text-lg font-bold mb-3">Enter Donation Amount</Text>
                <TextInput
                    className="h-10 border border-gray-300 rounded px-3 text-lg mb-4"
                    placeholder="₹0"
                    keyboardType="numeric"
                    value={donationAmount}
                    onChangeText={(text) => setDonationAmount(text)}
                />
                <TouchableOpacity
                    className="bg-blue-500 py-3 rounded-lg"
                    onPress={() => handleDonation(donationAmount)}
                >
                    <Text className="text-white text-center font-bold">Donate Now</Text>
                </TouchableOpacity>
            </View>

            {/* Donation Goals Section */}
            <Text className="text-xl font-bold mb-4">Current Donation Campaigns</Text>
            <FlatList
                data={donationData}
                renderItem={renderDonationGoal}
                keyExtractor={(item) => item.id}
            />

            {/* Donation History Section */}
            <Text className="text-xl font-bold mt-6 mb-4">Donation History</Text>
            <FlatList
                data={donationHistory}
                renderItem={renderDonationHistory}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
    );
};

export default DonationPortal;
