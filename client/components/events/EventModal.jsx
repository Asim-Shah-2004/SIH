import React, { useState, useCallback } from 'react';
import { View, Text, Modal, Image, ScrollView, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { X, Calendar, MapPin, Star } from 'lucide-react-native'; // Corrected import to lucide-react-native
import PaymentModal from './PaymentModal'; // Corrected import to local PaymentModal

const EventModal = ({ open, onClose, event }) => {
    if (!open || !event) return null;

    const [paymentModalOpen, setPaymentModalOpen] = useState(false);
    const screenHeight = Dimensions.get('window').height;

    // Memoized handleRegister function
    const handleRegister = useCallback(() => {
        setPaymentModalOpen(true);
    }, [event, onClose]);

    const handlePaymentComplete = () => {
        setPaymentModalOpen(false); // Close Payment Modal after payment selection
        onClose(); // Close the Event Modal
    };

    return (
        <>
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
                        {/* Drag indicator for intuitive gesture interaction */}
                        <View className="self-center my-4 w-12 h-1 bg-gray-300 rounded-full" />

                        {/* Close Button with Enhanced Styling */}
                        <View className="absolute top-2 right-4 z-10">
                            <TouchableOpacity
                                className="w-10 h-12 p-2 mb-4"
                                onPress={onClose}
                            >
                                <X size={24} color="#6B7280" strokeWidth={2} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView
                            // className='mt-4'
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{
                                paddingHorizontal: 24,
                                paddingBottom: 20
                            }}
                        >
                            {/* Event Header with Vibrant Title */}
                            <Text className="mt-6 mb-4 text-3xl font-bold text-gray-900 tracking-tight">
                                {event.title}
                            </Text>

                            {/* Info Cards with Enhanced Spacing */}
                            <View className="space-y-4 mb-4">
                                <View className="flex-row items-center space-x-3 bg-blue-50 p-3 rounded-xl gap-2">
                                    <Calendar size={24} color="#2563EB" />
                                    <View>
                                        <Text className="text-sm font-semibold text-blue-800">Date & Time</Text>
                                        <Text className="text-gray-600">{`${event.date}, ${event.time}`}</Text>
                                    </View>
                                </View>

                                <View className="flex-row items-center space-x-3 bg-green-50 p-3 rounded-xl gap-2">
                                    <MapPin size={24} color="#16A34A" />
                                    <View>
                                        <Text className="text-sm font-semibold text-green-800">Location</Text>
                                        <Text className="text-gray-600">{event.location}</Text>
                                    </View>
                                </View>
                            </View>

                            {/* Speakers Section */}
                            <Text className="text-xl font-bold text-gray-900 mb-4">Speakers</Text>
                            <View className="space-y-4 mb-4">
                                {event.speakers.map((speaker, index) => (
                                    <View
                                        key={index}
                                        className="flex-row items-center space-x-4 bg-gray-50 p-3 rounded-xl"
                                    >
                                        <Image
                                            source={{ uri: speaker.image }}
                                            className="h-16 w-16 rounded-full border-2 border-white shadow-md"
                                        />
                                        <View className="flex-1">
                                            <Text className="font-semibold text-gray-900">{speaker.name}</Text>
                                            <Text className="text-sm text-gray-600">{speaker.role}</Text>
                                        </View>
                                        <Star size={20} color="#EAB308" fill="#EAB308" />
                                    </View>
                                ))}
                            </View>

                            {/* Agenda Section */}
                            <Text className="text-xl font-bold text-gray-900 mb-4">Agenda</Text>
                            <Text className="text-gray-700 leading-relaxed mb-4">
                                {event.agenda}
                            </Text>

                            {/* Sponsors Section */}
                            <Text className="text-xl font-bold text-gray-900 mb-4">Sponsors</Text>
                            <View className="flex-row flex-wrap mb-4">
                                {event.sponsors.map((sponsor, index) => (
                                    <View
                                        key={index}
                                        className="bg-gray-100 px-3 py-1 rounded-full m-1"
                                    >
                                        <Text className="text-gray-700">{sponsor}</Text>
                                    </View>
                                ))}
                            </View>

                            {/* Register Button with Active Opacity */}
                            <TouchableOpacity
                                onPress={handleRegister}
                                className="mt-4 mx-4 bg-blue-600 py-4 rounded-xl shadow-lg"
                                activeOpacity={0.8}
                            >
                                <Text className='text-center text-white text-lg font-bold tracking-wide'>
                                    Register for Event
                                </Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
            <PaymentModal
                open={paymentModalOpen}
                onClose={() => setPaymentModalOpen(false)}
                onPaymentComplete={handlePaymentComplete}
            />
        </>
    );
};

export default EventModal;
