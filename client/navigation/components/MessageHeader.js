import { Ionicons } from '@expo/vector-icons';
import { View, Text, Image, TouchableOpacity } from 'react-native';

const MessageHeader = ({ navigation, route }) => {
  const { chatData } = route.params;
  const defaultImage = 'https://via.placeholder.com/40';

  const handleVideoCall = () => {
    navigation.navigate('Call', {
      chatData,
      roomId: `${chatData?.id}-video` || 'default-room',
    });
  };

  return (
    <View className="border-accent/10 flex-row items-center justify-between border-b bg-white px-4 py-3">
      <View className="flex-1 flex-row items-center">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3">
          <Ionicons name="arrow-back" size={24} color="#2C3F4A" />
        </TouchableOpacity>
        <Image
          source={{
            uri: chatData.profilePhoto || defaultImage,
          }}
          className="h-10 w-10 rounded-full"
        />
        <View className="ml-3">
          <Text className="text-lg font-semibold text-text">{chatData.otherParticipantName}</Text>
          {/* TODO */}
          {/* <Text className="text-highlight/70 text-xs">Online</Text> */}
        </View>
      </View>
      <View className="flex-row gap-4">
        <TouchableOpacity className="bg-primary/5 rounded-full p-2" onPress={handleVideoCall}>
          <Ionicons name="videocam" size={20} color="#2C3E8D" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MessageHeader;
