import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import EventCard from '../components/events/EventCard';
import EventModal from '../components/events/EventModal';
import { eventsData } from '../constants/events/eventData';

const EventsPage = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleCardClick = (event) => {
    setSelectedEvent(event);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  return (
    <View className="flex-1 bg-gray-100 px-4 py-6">
      <Text className="mb-6 text-2xl font-bold text-gray-900">Upcoming Events</Text>
      <ScrollView>
        {eventsData.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onClick={() => handleCardClick(event)}
          />
        ))}
      </ScrollView>
      <EventModal open={!!selectedEvent} onClose={handleCloseModal} event={selectedEvent} />
    </View>
  );
};

export default EventsPage;
