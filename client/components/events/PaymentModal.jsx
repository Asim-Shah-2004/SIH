import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions,
  ActivityIndicator,
} from 'react-native';

const PaymentModal = ({ open, onClose, onPaymentComplete }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const screenHeight = Dimensions.get('window').height;

  const handlePayment = (method) => {
    setIsProcessing(true);

    // Simulate the processing of payment
    setTimeout(() => {
      setIsProcessing(false);
      Alert.alert('Thank you!', `Payment successful via ${method}`);
      onPaymentComplete(); // Close both modals
    }, 3000); // Simulating 3 seconds for processing
  };

  if (!open) return null;

  return (
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

            {/* Payment Options */}
            {isProcessing ? (
              <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" color="#2563EB" />
                <Text className="mt-4 text-lg text-gray-600">Processing payment...</Text>
              </View>
            ) : (
              <View className="mb-4 space-y-4">
                <TouchableOpacity
                  onPress={() => handlePayment('UPI')}
                  className="flex-row items-center gap-2 space-x-3 rounded-xl bg-blue-50 p-3">
                  <Text className="text-lg font-semibold text-blue-800">UPI</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handlePayment('Net Banking')}
                  className="flex-row items-center gap-2 space-x-3 rounded-xl bg-green-50 p-3">
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
  );
};

export default PaymentModal;
