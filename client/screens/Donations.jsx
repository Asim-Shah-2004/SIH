import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, ScrollView } from 'react-native';

import { donationCampaigns } from '../constants/donationData';

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
    <View className="mb-4 overflow-hidden rounded-xl bg-white shadow-lg">
      <Image source={{ uri: item.image }} className="h-48 w-full" />
      <View className="p-4">
        <Text className="mb-2 text-xl font-bold text-gray-900">{item.title}</Text>
        <Text className="mb-4 text-base text-gray-600">{item.description}</Text>

        {/* Progress Section */}
        <View className="mb-4">
          <View className="mb-2 flex-row justify-between">
            <Text className="font-semibold text-gray-700">
              ₹{item.raised.toLocaleString()} raised
            </Text>
            <Text className="text-gray-600">of ₹{item.goal.toLocaleString()}</Text>
          </View>
          <View className="mt-1 h-2 rounded-full bg-gray-300">
            <View
              className="h-2 rounded-full bg-blue-500"
              style={{ width: `${(item.raised / item.goal) * 100}%` }}
            />
          </View>
        </View>

        {/* Impact & Donors Info */}
        <View className="mb-4 flex-row justify-between">
          <Text className="text-sm text-gray-600">{item.impact}</Text>
          <Text className="text-sm font-semibold text-blue-600">{item.donors} donors</Text>
        </View>

        {/* Campaign Manager */}
        <View className="mb-4 flex-row items-center">
          <View className="flex-1">
            <Text className="text-sm font-semibold text-gray-700">Campaign Manager:</Text>
            <Text className="text-sm text-gray-600">{item.campaignManager.name}</Text>
            <Text className="text-xs text-gray-500">{item.campaignManager.role}</Text>
          </View>
        </View>

        {/* Testimonials Section */}
        {item.testimonials && (
          <View className="mb-4">
            <Text className="mb-2 font-semibold text-gray-700">Impact Stories:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {item.testimonials.map((testimonial, index) => (
                <View key={index} className="mr-4 w-48 rounded-lg bg-gray-50 p-3">
                  <Image source={{ uri: testimonial.image }} className="h-12 w-12 rounded-full" />
                  <Text className="mt-2 text-sm italic text-gray-600">"{testimonial.message}"</Text>
                  <Text className="mt-1 text-xs font-semibold">
                    {testimonial.name}, {testimonial.year}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Suggested Donations */}
        <View className="mb-4">
          <Text className="mb-2 text-sm text-gray-600">Suggested Amounts:</Text>
          <View className="flex-row flex-wrap gap-2">
            {item.suggestedDonations.map((amount, index) => (
              <TouchableOpacity
                key={index}
                className="rounded-full bg-blue-50 px-4 py-2"
                onPress={() => setDonationAmount(amount.toString())}>
                <Text className="text-blue-600">₹{amount.toLocaleString()}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Tax Benefits Info */}
        <Text className="mb-4 text-xs text-green-600">{item.taxBenefits}</Text>

        <TouchableOpacity
          className="rounded-lg bg-blue-500 px-4 py-2"
          onPress={() => handleDonation(donationAmount)}>
          <Text className="text-center font-bold text-white">Donate Now</Text>
        </TouchableOpacity>
      </View>
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
        data={donationCampaigns}
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
