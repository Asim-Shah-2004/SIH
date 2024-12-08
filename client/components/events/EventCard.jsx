import { View, Text, TouchableOpacity, Image } from 'react-native';

const EventCard = ({ event, onClick }) => {
  return (
    <TouchableOpacity
      className="mb-4 overflow-hidden rounded-lg border bg-white shadow-lg"
      onPress={onClick}>
      <Image source={{ uri: event.image }} className="h-40 w-full" />
      <View className="p-4">
        <Text className="mb-1 text-lg font-bold text-gray-900">{event.title}</Text>
        <Text className="text-sm text-gray-600">
          {event.date} • {event.location}
        </Text>
        <Text className="mt-2 text-base font-semibold text-blue-600">{event.price}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default EventCard;
