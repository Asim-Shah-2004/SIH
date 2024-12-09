import { View, Text, Pressable } from 'react-native';

const Card = ({ icon, title, subtitle, meta, description, onPress, className = '' }) => (
  <Pressable onPress={onPress}>
    <View
      className={`mb-3 flex-row items-start rounded-lg border border-gray-100 bg-white p-4 shadow-md ${className}`}>
      <View className="bg-primary/10 mr-4 h-10 w-10 items-center justify-center rounded-lg">
        {icon}
      </View>
      <View className="flex-1 space-y-1">
        <Text className="text-lg font-bold text-text">{title}</Text>
        <Text className="text-text/60 text-base font-medium">{subtitle}</Text>
        <Text className="text-text/50 text-sm italic">{meta}</Text>
        {description && <Text className="text-text/60 mt-2 text-sm leading-5">{description}</Text>}
      </View>
    </View>
  </Pressable>
);

export default Card;
