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
    <View className="mb-4 rounded-lg bg-white p-4 shadow-md">
      <Text className="mb-2 text-lg font-bold">{item.title}</Text>
      <View className="mb-3">
        <Text className="text-gray-700">
          Raised: ₹{item.raised} / Goal: ₹{item.goal}
        </Text>
        <View className="mt-1 h-2 rounded-full bg-gray-300">
          <View
            className="h-2 rounded-full bg-blue-500"
            style={{ width: `${(item.raised / item.goal) * 100}%` }}
          />
        </View>
      </View>
      <TouchableOpacity
        className="rounded-lg bg-blue-500 px-4 py-2"
        onPress={() => handleDonation(donationAmount)}>
        <Text className="text-center font-bold text-white">Donate Now</Text>
      </TouchableOpacity>
    </View>
  );

  const renderDonationHistory = ({ item }) => (
    <View className="mb-2 rounded-lg bg-white p-4 shadow-md">
      <Text className="font-bold text-green-600">₹{item.amount}</Text>
      <Text className="text-gray-500">{item.date}</Text>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-100 p-5">
      {/* Donation Input Section */}
      <View className="mb-6 rounded-lg bg-white p-5 shadow-md">
        <Text className="mb-3 text-lg font-bold">Enter Donation Amount</Text>
        <TextInput
          className="mb-4 h-10 rounded border border-gray-300 px-3 text-lg"
          placeholder="₹0"
          keyboardType="numeric"
          value={donationAmount}
          onChangeText={(text) => setDonationAmount(text)}
        />
        <TouchableOpacity
          className="rounded-lg bg-blue-500 py-3"
          onPress={() => handleDonation(donationAmount)}>
          <Text className="text-center font-bold text-white">Donate Now</Text>
        </TouchableOpacity>
      </View>

      {/* Donation Goals Section */}
      <Text className="mb-4 text-xl font-bold">Current Donation Campaigns</Text>
      <FlatList
        data={donationData}
        renderItem={renderDonationGoal}
        keyExtractor={(item) => item.id}
      />

      {/* Donation History Section */}
      <Text className="mb-4 mt-6 text-xl font-bold">Donation History</Text>
      <FlatList
        data={donationHistory}
        renderItem={renderDonationHistory}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

export default DonationPortal;
