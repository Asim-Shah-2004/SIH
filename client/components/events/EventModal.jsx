import { Feather } from '@expo/vector-icons';
import { useState, useCallback, useEffect } from 'react';
import { View, Text, Modal, Image, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SERVER_URL } from '@env';
import axios from 'axios';
import PaymentModal from './PaymentModal';
import { useAuth } from '../../providers/AuthProvider';

const EventModal = ({ open, onClose, event, role }) => {
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [registeredUsers, setRegisteredUsers] = useState([]); // Initialize as empty array
  const screenHeight = Dimensions.get('window').height;
  console.log(role);
  // console.log(event._id);

  // Memoized handleRegister function
  const handleRegister = useCallback(() => {
    setPaymentModalOpen(true);
  }, []);

  const handlePaymentComplete = () => {
    setPaymentModalOpen(false);
    onClose();

  };

  const { token } = useAuth();

  useEffect(() => {
    const fetchRegisteredUsers = async () => {
      if (open && event?._id) {
        try {
          const response = await axios.get(`${SERVER_URL}/events/${event._id}/registered`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.data) {
            console.log(response.data);
            setRegisteredUsers(response.data); // Make sure to access response.data
          }
        } catch (error) {
          console.error('Error fetching registered users:', error);
          setRegisteredUsers([]); // Set to empty array on error
        }
      }
    };

    fetchRegisteredUsers();
  }, [open, event]);

  const defaultProfilePhoto = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';

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
                <Feather name="x" size={24} color="#6B7280" strokeWidth={2} />
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
                  <Feather name="calendar" size={24} color="#2563EB" />
                  <View>
                    <Text className="text-sm font-semibold text-blue-800">Date & Time</Text>
                    <Text className="text-gray-600">{`${event.date}, ${event.time}`}</Text>
                  </View>
                </View>

                <View className="flex-row items-center gap-2 space-x-3 rounded-xl bg-green-50 p-3">
                  <Feather name="map-pin" size={24} color="#16A34A" />
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
                    <Feather name="star" size={20} color="#EAB308" fill="#EAB308" />
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

              {
                role === "college" && (
                  <View className="mb-4 space-y-3">
                    <View className="flex-row items-center justify-between rounded-xl bg-gray-50 p-4">
                      <View className="flex-row items-center space-x-3">
                        <View>
                          <Text className="font-semibold text-gray-900">Total Registered</Text>
                          <Text className="text-sm text-gray-600">{event.registeredCount}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                )
              }

              {
                role == 'college' && (
                  <View className="mb-6">
                    <View className="mb-4 flex-row items-center justify-between">
                      <Text className="text-xl font-bold text-gray-900">Registered Users</Text>
                      <View className="flex-shrink-0 rounded-full bg-blue-100 px-3 py-1 -ml-16">
                        <Text className="font-medium text-blue-800">
                          {registeredUsers.length} Total
                        </Text>
                      </View>
                    </View>
                    <View className="space-y-3">
                      {registeredUsers && registeredUsers.length > 0 ? (
                        registeredUsers.map((user, index) => (
                          <View
                            key={index}
                            className="flex-row items-center justify-between rounded-xl bg-gray-50/80 p-4 shadow-sm">
                            <View className="flex-row items-center">
                              <Image
                                source={{ uri: user.profilePhoto || defaultProfilePhoto }}
                                className="h-12 w-12 rounded-full border-2 border-white shadow"
                                defaultSource={{ uri: defaultProfilePhoto }}
                              />
                              <View className="ml-4">
                                <Text className="text-base font-semibold text-gray-900">{user.fullName}</Text>
                                <Text className="text-sm text-gray-500">Registered</Text>
                              </View>
                            </View>
                            <View className="rounded-full bg-blue-100 px-3 py-1">
                              <Text className="font-medium text-blue-800">
                                {index + 1}
                              </Text>
                            </View>
                          </View>
                        ))
                      ) : (
                        <View className="rounded-xl bg-gray-50 p-8">
                          <Text className="text-center text-gray-500">No registrations yet</Text>
                        </View>
                      )}
                    </View>
                  </View>
                )
              }


              {/* Register Button with Active Opacity */}
              {role != "college" && (
                <TouchableOpacity
                  onPress={handleRegister}
                  className="mx-4 mt-4 rounded-xl bg-blue-600 py-4 shadow-lg"
                  activeOpacity={0.8}>
                  <Text className="text-center text-lg font-bold tracking-wide text-white">
                    Register for Event
                  </Text>
                </TouchableOpacity>)

              }

            </ScrollView>
          </View>
        </View>

        {role === 'college' && (
          <View>

          </View>
        )}
      </Modal>
      <PaymentModal
        open={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        onPaymentComplete={handlePaymentComplete}
        type="event"
        amount={event.price}
        title={event.title}
        itemId={event.id}
      />
    </>
  );
};

export default EventModal;
