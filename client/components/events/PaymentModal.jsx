import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, Alert, Dimensions, ActivityIndicator } from 'react-native';
import { X } from 'lucide-react-native';

const PaymentModal = ({ open, onClose, onPaymentComplete }) => {
    if (!open) return null;

    const screenHeight = Dimensions.get('window').height;
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState(null);
    const [processingMessage, setProcessingMessage] = useState('');

    const handlePayment = (method) => {
        setPaymentMethod(method);
        setIsProcessing(true);

        // Simulate the processing of payment
        setTimeout(() => {
            setIsProcessing(false);
            Alert.alert('Thank you!', `Payment successful via ${method}`);

            onPaymentComplete(); // Close both modals
        }, 3000); // Simulating 3 seconds for processing
    };

    return (
        <Modal
            animationType="slide"
            transparent
            visible={open}
            statusBarTranslucent
            onRequestClose={onClose}
        >
            <View className="flex-1 bg-black/60 justify-end">
                <View
                    className="bg-white rounded-t-[32px] shadow-2xl"
                    style={{ maxHeight: screenHeight * 0.95 }} // Adjusted max height for better fit
                >
                    {/* Close Button */}
                    <View className="absolute top-2 right-4 z-10">
                        <TouchableOpacity
                            className="w-10 h-12 p-2 mb-4"
                            onPress={onClose}
                        >
                            <X size={24} color="#6B7280" strokeWidth={2} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            paddingHorizontal: 24,
                            paddingBottom: 20
                        }}
                    >
                        {/* Title */}
                        <Text className="mt-6 mb-4 text-3xl font-bold text-gray-900 tracking-tight">
                            Payment Method
                        </Text>

                        {/* Payment Options */}
                        {isProcessing ? (
                            <View className="flex-1 justify-center items-center">
                                <ActivityIndicator size="large" color="#2563EB" />
                                <Text className="mt-4 text-lg text-gray-600">Processing payment...</Text>
                            </View>
                        ) : (
                            <View className="space-y-4 mb-4">
                                <TouchableOpacity
                                    onPress={() => handlePayment('UPI')}
                                    className="flex-row items-center space-x-3 bg-blue-50 p-3 rounded-xl gap-2"
                                >
                                    <Text className="text-lg font-semibold text-blue-800">UPI</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => handlePayment('Net Banking')}
                                    className="flex-row items-center space-x-3 bg-green-50 p-3 rounded-xl gap-2"
                                >
                                    <Text className="text-lg font-semibold text-green-800">Net Banking</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => handlePayment('Credit/Debit Card')}
                                    className="flex-row items-center space-x-3 bg-yellow-50 p-3 rounded-xl gap-2"
                                >
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
