import { SERVER_URL } from '@env';
import { Feather, AntDesign } from '@expo/vector-icons';
import axios from 'axios';
import { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';

import { useAuth } from '../../providers/AuthProvider';
import CustomAlertModal from '../CustomAlertModal';

const PaymentModal = ({
  open,
  onClose,
  onPaymentComplete,
  type = 'donation', // new prop
  amount,
  title,
  itemId, // can be campaignId or eventId
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [transactionDetails, setTransactionDetails] = useState(null);
  const { token } = useAuth();
  const screenHeight = Dimensions.get('window').height;

  const displayConfig = {
    donation: {
      title: 'Donating',
      icon: <AntDesign name="heart" size={50} color="#ec4899" />,
      thankTitle: 'Thank you for your donation!',
      amountPrefix: '₹',
      summaryText: `for ${title}`,
    },
    event: {
      title: 'Registering',
      icon: <AntDesign name="checkcircle" size={50} color="#22c55e" />,
      thankTitle: 'Successfully Registered!',
      amountPrefix: '₹',
      summaryText: `for ${title}`,
    },
  };

  const config = displayConfig[type];

  const handlePayment = async (method) => {
    setIsProcessing(true);
    setPaymentMethod(method);

    try {
      let response;
      if (type === 'donation') {
        response = await axios.post(
          `${SERVER_URL}/donationcampaigns/${itemId}/donate`,
          {
            amount: Number(amount),
            transactionMethod: method,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTransactionDetails(response.data.transaction);
      } else if (type === 'event') {
        response = await axios.post(
          `${SERVER_URL}/events/${itemId}/register`,
          {
            amount: Number(amount),
            transactionMethod: method,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTransactionDetails(response.data.registration); // Store registration details
      }

      setIsProcessing(false);
      setShowThankYou(true);
    } catch (error) {
      setIsProcessing(false);
      alert(error.response?.data?.message || 'Payment failed. Please try again.');
      onClose();
    }
  };

  const handleThankYouClose = () => {
    setShowThankYou(false);
    onPaymentComplete({
      amount: transactionDetails?.amount || amount,
      itemId,
      transaction: transactionDetails,
    });
  };

  if (!open) return null;

  return (
    <>
      <Modal
        animationType="slide"
        transparent
        visible={open}
        statusBarTranslucent
        onRequestClose={onClose}>
        <View className="flex-1 justify-end bg-black/60">
          <View
            className="rounded-t-[32px] bg-white shadow-2xl"
            style={{ maxHeight: screenHeight * 0.95 }}>
            {/* Close Button */}
            <View className="absolute right-4 top-2 z-10">
              <TouchableOpacity className="mb-4 h-12 w-10 p-2" onPress={onClose}>
                <Feather name="x" size={24} color="#6B7280" strokeWidth={2} />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: 24,
                paddingBottom: 20,
              }}>
              {/* Title */}
              <Text className="mb-4 mt-6 text-3xl font-bold tracking-tight text-gray-900">
                Payment Method
              </Text>

              {/* Amount and Title Display */}
              <View className="mb-6 rounded-xl bg-blue-50 p-4">
                <Text className="text-sm text-gray-600">{config.title}</Text>
                <Text className="text-2xl font-bold text-gray-900">
                  {config.amountPrefix}
                  {amount}
                </Text>
                <Text className="mt-1 text-base text-gray-600">to {title}</Text>
              </View>

              {/* Payment Options */}
              {isProcessing ? (
                <View className="flex-1 items-center justify-center">
                  <ActivityIndicator size="large" color="#2563EB" />
                  <Text className="mt-4 text-lg text-gray-600">Processing payment...</Text>
                </View>
              ) : (
                <View className="mb-4 space-y-6">
                  <TouchableOpacity
                    onPress={() => handlePayment('UPI')}
                    className="mb-2 flex-row items-center gap-2 space-x-3 rounded-xl bg-blue-50 p-3">
                    <Text className="text-lg font-semibold text-blue-800">UPI</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handlePayment('Net Banking')}
                    className="mb-2 flex-row items-center gap-2 space-x-3 rounded-xl bg-green-50 p-3">
                    <Text className="text-lg font-semibold text-green-800">Net Banking</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handlePayment('Credit/Debit Card')}
                    className="flex-row items-center gap-2 space-x-3 rounded-xl bg-yellow-50 p-3">
                    <Text className="text-lg font-semibold text-yellow-800">Credit/Debit Card</Text>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <CustomAlertModal
        visible={showThankYou}
        onClose={handleThankYouClose}
        icon={
          <View className="items-center">
            {config.icon}
            <View className="mt-2 items-center">
              <Text className="text-lg font-bold text-gray-900">
                {config.amountPrefix}
                {amount}
              </Text>
              <Text className="text-sm text-gray-600">{config.summaryText}</Text>
              {transactionDetails && (
                <Text className="mt-2 text-xs text-gray-500">
                  Transaction ID: {transactionDetails._id}
                </Text>
              )}
            </View>
          </View>
        }
        title={config.thankTitle}
        subtitle={`Payment successful via ${paymentMethod}`}
        variant="single"
      />
    </>
  );
};

export default PaymentModal;
