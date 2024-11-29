import React, { useEffect, useRef } from 'react';
import { Text, Animated } from 'react-native';

const StatItem = ({ label, value }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(animatedValue, {
      toValue: 1,
      tension: 50,
      friction: 5,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      className="items-center px-4 py-2"
      style={{
        transform: [{ scale: animatedValue }],
        opacity: animatedValue,
      }}>
      <Text className="text-2xl font-bold text-white">{value}</Text>
      <Text className="mt-1 text-base text-white/80">{label}</Text>
    </Animated.View>
  );
};

export default StatItem;
