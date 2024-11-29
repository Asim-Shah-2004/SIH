import React from 'react';
import { Text, Linking } from 'react-native';

const LinkText = ({ text, className }) => {
  const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)|([\w\d-]+\.[a-z]{2,}\/?[^\s]*)/g;
  const parts = text.split(urlRegex);

  return parts.map((part, index) => {
    if (part && urlRegex.test(part)) {
      return (
        <Text
          key={index}
          className="text-secondary underline"
          onPress={() => Linking.openURL(part.startsWith('http') ? part : `https://${part}`)}>
          {part}
        </Text>
      );
    }
    return (
      <Text key={index} className={className}>
        {part}
      </Text>
    );
  });
};

export default LinkText;
