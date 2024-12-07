import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const Button = ({ text, nav, navigation }) => {
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate(nav)}
      className="w-full rounded-full bg-black p-4 active:bg-gray-800">
      <Text className="text-center text-base font-semibold text-white">{text}</Text>
    </TouchableOpacity>
  );
};

export default Button;
