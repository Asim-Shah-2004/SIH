import { SERVER_URL } from '@env';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  Animated,
  Modal,
} from 'react-native';

import PaymentModal from '../components/events/PaymentModal';
import { useAuth } from '../providers/AuthProvider';
// import { donationCampaigns } from '../constants/donations/donationData';

const formatIndianNumber = (num) => {
  if (num >= 10000000) {
    // 1 crore or more
    return `₹${(num / 10000000).toFixed(2)} Cr`;
  } else if (num >= 100000) {
    // 1 lakh or more
    return `₹${(num / 100000).toFixed(2)} L`;
  } else {
    return `₹${num.toLocaleString('en-IN')}`;
  }
};

const DonationPortal = ({ navigation }) => {
  const [donationAmount, setDonationAmount] = useState('');
  const [donationHistory, setDonationHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCause, setSelectedCause] = useState({});
  const { token, role } = useAuth();
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  const fetchDonationHistory = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/users/donations`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDonationHistory(response.data);
    } catch (error) {
      console.error('Error fetching donation history:', error);
      alert('Failed to load donation history. Please try again later.');
    }
  };

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/donationcampaigns`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }); // Use this if testing on physical device
        setCampaigns(response.data); // Update campaigns with fetched data
        setSelectedCause(response.data[0]); // Set the first cause as selected
      } catch (error) {
        console.error('Error fetching donation data:', error);
        alert('Failed to load donation campaigns. Please try again later.');
      }
    };

    fetchCampaigns();
  }, []);

  useEffect(() => {
    fetchDonationHistory();
  }, []);

  const handleDonation = (amount) => {
    if (amount && !isNaN(amount) && amount > 0) {
      setPaymentModalOpen(true);
    } else {
      alert('Please enter a valid donation amount');
    }
  };

  const handlePaymentComplete = ({ amount, itemId, transaction }) => {
    // Refresh donation history from server to get latest data
    fetchDonationHistory();

    // Update campaign data
    setCampaigns((prevCampaigns) => {
      return prevCampaigns.map((campaign) => {
        if (campaign.id === itemId) {
          return {
            ...campaign,
            raised: campaign.raised + Number(amount),
            donors: campaign.donors + 1,
          };
        }
        return campaign;
      });
    });

    // Update selected cause
    setSelectedCause((prev) => ({
      ...prev,
      raised: prev.raised + Number(amount),
      donors: prev.donors + 1,
    }));

    setDonationAmount('');
    setPaymentModalOpen(false);
  };

  const selectCause = (item) => {
    setSelectedCause(item);
    setDonationAmount('');
  };

  const renderDonationGoal = ({ item }) => (
    <Animated.View className="mb-4 overflow-hidden rounded-2xl bg-white shadow-lg">
      <Image source={{ uri: item.image }} className="h-48 w-full" resizeMode="cover" />
      <View className="absolute right-4 top-4 z-20 rounded-full bg-white/90 px-3 py-1">
        <Text className="text-xs font-medium text-gray-700">{item.category}</Text>
      </View>

      <View className="px-4 py-5">
        <Text className="mb-2 text-xl font-bold text-gray-900">{item.title}</Text>
        <Text className="mb-4 text-base text-gray-600">{item.description}</Text>

        {/* Progress Section */}
        <View className="mb-4">
          <View className="mb-2 flex-row items-center justify-between">
            <View>
              <Text className="text-2xl font-bold text-blue-600">
                {formatIndianNumber(item.raised)}
              </Text>
              <Text className="text-xs text-gray-500">
                raised of {formatIndianNumber(item.goal)} goal
              </Text>
            </View>
            <View className="items-end">
              <Text className="text-lg font-semibold text-gray-800">
                {item.donors.toLocaleString('en-IN')}
              </Text>
              <Text className="text-xs text-gray-500">supporters</Text>
            </View>
          </View>
          <View className="h-2 w-full rounded-full bg-gray-100">
            <View
              className="h-2 rounded-full bg-blue-500"
              style={{ width: `${(item.raised / item.goal) * 100}%` }}
            />
          </View>
        </View>

        {/* Impact Card */}
        <View className="mb-4 flex-row items-center rounded-xl bg-blue-50 p-3">
          <MaterialCommunityIcons name="target" size={24} color="#2563EB" />
          <Text className="ml-2 flex-1 text-sm text-blue-700">{item.impact}</Text>
        </View>

        {/* Campaign Manager - Modern Design */}
        <View className="mb-4 flex-row items-center rounded-xl bg-gray-50 p-3">
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e' }}
            className="h-10 w-10 rounded-full"
          />
          <View className="ml-3 flex-1">
            <Text className="text-sm font-semibold text-gray-900">{item.campaignManager.name}</Text>
            <Text className="text-xs text-gray-500">{item.campaignManager.role}</Text>
          </View>
          <TouchableOpacity className="rounded-full bg-white p-2 shadow">
            <MaterialCommunityIcons name="email-outline" size={20} color="#4B5563" />
          </TouchableOpacity>
        </View>

        {/* Modern Donation Amounts with Indian Format - Updated Colors */}
        <View className="mb-4">
          <View className="flex-row flex-wrap gap-2">
            {item.suggestedDonations.map((amount, index) => (
              <TouchableOpacity
                key={index}
                className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3"
                onPress={() => setDonationAmount(amount.toString())}>
                <Text className="text-base font-medium text-blue-600">
                  {formatIndianNumber(amount)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Tax Benefits - Green Color */}
        <Text className="mb-4 text-sm font-medium text-emerald-600">{item.taxBenefits}</Text>

        <TouchableOpacity
          className="rounded-xl bg-blue-500 px-4 py-3"
          onPress={() => selectCause(item)}>
          <Text className="text-center text-base font-bold text-white">Select This Cause</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  const renderDonationHistory = ({ item }) => (
    <View className="mb-2 rounded-lg bg-white p-4 shadow-md">
      <Text className="font-bold text-green-600">{formatIndianNumber(Number(item.amount))}</Text>
      <View className="mt-1 flex-row justify-between">
        <Text className="text-xs text-gray-500">
          {new Date(item.transactionDate).toLocaleString()}
        </Text>
        <View className="rounded-full bg-blue-100 px-2 py-1">
          <Text className="text-xs font-medium text-blue-700">{item.transactionMethod}</Text>
        </View>
      </View>
      <Text className="mt-1 text-xs text-gray-500">Transaction ID: {item.user}</Text>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50">
      {/* Modern Donation Input with Indian Format */}
      <View className="px-4 pb-2 pt-4">
        {role === 'alumni' ? (
          <View className="rounded-xl border border-gray-100 bg-white p-3 shadow-lg">
            <View className="mb-2 flex-row items-center justify-between">
              <Text className="text-lg font-bold text-gray-900">Make a Donation</Text>
              <TouchableOpacity
                className="rounded-lg bg-gray-100 p-2"
                onPress={() => setShowHistory(true)}>
                <MaterialCommunityIcons name="history" size={20} color="#4B5563" />
              </TouchableOpacity>
            </View>
            <View className="flex-row gap-2">
              <View className="flex-1 flex-row items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3">
                <View className="flex-row items-center">
                  <Text className="text-xl text-gray-400">₹</Text>
                  <TextInput
                    className="ml-2 h-12 w-36 text-xl font-medium text-gray-900"
                    placeholder="Enter Amount"
                    keyboardType="numeric"
                    value={donationAmount}
                    onChangeText={(text) => setDonationAmount(text)}
                  />
                </View>
                {donationAmount ? (
                  <Text className="text-sm text-gray-500">
                    {formatIndianNumber(Number(donationAmount))}
                  </Text>
                ) : null}
              </View>
              <TouchableOpacity
                className="rounded-lg bg-blue-500 px-4"
                onPress={() => handleDonation(donationAmount)}>
                <View className="h-12 items-center justify-center">
                  <Text className="text-md font-bold text-white">Donate</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => {}}
            className="mx-4 my-4 rounded-lg bg-blue-600 px-5 py-3">
            <Text className="text-center font-bold text-white">Post a New Donation</Text>
          </TouchableOpacity>
        )}

        {/* Add Selected Cause Display */}
        {selectedCause.id && (
          <View className="mt-3 rounded-xl border border-blue-100 bg-blue-50 p-3">
            <Text className="mb-1 text-sm font-medium text-gray-600">Selected Campaign:</Text>
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-base font-bold text-gray-900">{selectedCause.title}</Text>
                <Text className="text-sm text-gray-600">
                  {formatIndianNumber(selectedCause.raised)} raised of{' '}
                  {formatIndianNumber(selectedCause.goal)}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setSelectedCause({})}
                className="rounded-full bg-white p-2">
                <MaterialCommunityIcons name="close" size={16} color="#4B5563" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* Donation History Modal */}
      <Modal
        animationType="slide"
        transparent
        visible={showHistory}
        onRequestClose={() => setShowHistory(false)}>
        <View className="flex-1 justify-end bg-black/50">
          <View className="h-3/4 rounded-t-3xl bg-white p-6">
            <View className="mb-6 flex-row items-center justify-between">
              <Text className="text-2xl font-bold text-gray-900">Your Donations</Text>
              <TouchableOpacity
                onPress={() => setShowHistory(false)}
                className="rounded-full bg-gray-100 p-2">
                <MaterialCommunityIcons name="close" size={24} color="#4B5563" />
              </TouchableOpacity>
            </View>
            {donationHistory.length > 0 ? (
              <FlatList
                data={donationHistory}
                renderItem={renderDonationHistory}
                keyExtractor={(_, index) => index.toString()}
                showsVerticalScrollIndicator={false}
                contentContainerClassName="pb-6"
                decelerationRate="normal"
                bounces
                removeClippedSubviews
                maxToRenderPerBatch={10}
                initialNumToRender={5}
              />
            ) : (
              <View className="flex-1 items-center justify-center">
                <MaterialCommunityIcons name="gift-outline" size={48} color="#9CA3AF" />
                <Text className="mt-4 text-center text-gray-500">No donations yet</Text>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* Campaigns Section */}
      <View className="flex-1 px-4">
        <Text className="my-4 text-2xl font-bold text-gray-900">Featured Campaigns</Text>
        <FlatList
          data={campaigns}
          renderItem={renderDonationGoal}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          decelerationRate="normal"
          bounces
          bouncesZoom
          maintainVisibleContentPosition={{
            minIndexForVisible: 0,
          }}
          removeClippedSubviews
          maxToRenderPerBatch={5}
          windowSize={5}
          initialNumToRender={3}
        />
      </View>

      <PaymentModal
        open={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        onPaymentComplete={handlePaymentComplete}
        type="donation"
        amount={donationAmount}
        title={selectedCause.title}
        itemId={selectedCause.id}
      />
    </View>
  );
};

export default DonationPortal;
