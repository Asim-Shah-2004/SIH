import { X, Calendar, MapPin, Star } from 'lucide-react-native';
import React, { useState, useCallback } from 'react';
import { View, Text, Modal, Image, ScrollView, TouchableOpacity, Dimensions } from 'react-native';

import PaymentModal from './PaymentModal';

const EventModal = ({ open, onClose, event }) => {
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const screenHeight = Dimensions.get('window').height;

  // Memoized handleRegister function
  const handleRegister = useCallback(() => {
    setPaymentModalOpen(true);
  }, []);

  const handlePaymentComplete = () => {
    setPaymentModalOpen(false);
    onClose();
  };

  if (!open || !event) return null;

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
            style={{ maxHeight: screenHeight * 0.95 }} // Adjusted max height for better fit
          >
            {/* Drag indicator for intuitive gesture interaction */}
            <View className="my-4 h-1 w-12 self-center rounded-full bg-gray-300" />

            {/* Close Button with Enhanced Styling */}
            <View className="absolute right-4 top-2 z-10">
              <TouchableOpacity className="mb-4 h-12 w-10 p-2" onPress={onClose}>
                <X size={24} color="#6B7280" strokeWidth={2} />
              </TouchableOpacity>
            </View>

            <ScrollView
              // className='mt-4'
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: 24,
                paddingBottom: 20,
              }}>
              {/* Event Header with Vibrant Title */}
              <Text className="mb-4 mt-6 text-3xl font-bold tracking-tight text-gray-900">
                {event.title}
              </Text>

              {/* Info Cards with Enhanced Spacing */}
              <View className="mb-4 space-y-4">
                <View className="flex-row items-center gap-2 space-x-3 rounded-xl bg-blue-50 p-3">
                  <Calendar size={24} color="#2563EB" />
                  <View>
                    <Text className="text-sm font-semibold text-blue-800">Date & Time</Text>
                    <Text className="text-gray-600">{`${event.date}, ${event.time}`}</Text>
                  </View>
                </View>

                <View className="flex-row items-center gap-2 space-x-3 rounded-xl bg-green-50 p-3">
                  <MapPin size={24} color="#16A34A" />
                  <View>
                    <Text className="text-sm font-semibold text-green-800">Location</Text>
                    <Text className="text-gray-600">{event.location}</Text>
                  </View>
                </View>
              </View>

              {/* Speakers Section */}
              <Text className="mb-4 text-xl font-bold text-gray-900">Speakers</Text>
              <View className="mb-4 space-y-4">
                {event.speakers.map((speaker, index) => (
                  <View
                    key={index}
                    className="flex-row items-center space-x-4 rounded-xl bg-gray-50 p-3">
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
              <Text className="mb-4 text-xl font-bold text-gray-900">Agenda</Text>
              <Text className="mb-4 leading-relaxed text-gray-700">{event.agenda}</Text>

              {/* Sponsors Section */}
              <Text className="mb-4 text-xl font-bold text-gray-900">Sponsors</Text>
              <View className="mb-4 flex-row flex-wrap">
                {event.sponsors.map((sponsor, index) => (
                  <View key={index} className="m-1 rounded-full bg-gray-100 px-3 py-1">
                    <Text className="text-gray-700">{sponsor}</Text>
                  </View>
                ))}
              </View>

              {/* Register Button with Active Opacity */}
              <TouchableOpacity
                onPress={handleRegister}
                className="mx-4 mt-4 rounded-xl bg-blue-600 py-4 shadow-lg"
                activeOpacity={0.8}>
                <Text className="text-center text-lg font-bold tracking-wide text-white">
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
