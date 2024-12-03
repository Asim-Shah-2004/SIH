import { SERVER_URL } from '@env';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';

import EventCard from '../components/events/EventCard';
import EventModal from '../components/events/EventModal';
// import { eventsData } from '../constants/events/eventData';

const EventsPage = () => {
  const [eventsData, setEventsData] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true); // To handle loading state
  const [error, setError] = useState(null); // To handle errors

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${SERVER_URL}/events`);
      setEventsData(response.data); // Assuming the response has the correct structure
      console.log('Data received');
    } catch (err) {
      setError('Failed to fetch events. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleCardClick = (event) => {
    setSelectedEvent(event);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  return (
    <View className="flex-1 bg-gray-100 px-4 py-6">
      <Text className="mb-6 text-2xl font-bold text-gray-900">Upcoming Events</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text className="text-red-500 text-center">{error}</Text>
      ) : (
        <ScrollView>
          {eventsData.map((event) => (
            <EventCard key={event.id} event={event} onClick={() => handleCardClick(event)} />
          ))}
        </ScrollView>
      )}
      <EventModal open={!!selectedEvent} onClose={handleCloseModal} event={selectedEvent} />
    </View>
  );
};

export default EventsPage;
