import { View, Text } from 'react-native';

const DateSeparator = ({ date }) => {
  return (
    <View className="my-2 flex flex-row items-center justify-center">
      <View className="h-[1px] flex-1 bg-gray-300" />
      <Text className="mx-4 text-sm text-gray-500">{date}</Text>
      <View className="h-[1px] flex-1 bg-gray-300" />
    </View>
  );
};

export default DateSeparator;
