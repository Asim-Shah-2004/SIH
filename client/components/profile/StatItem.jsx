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
      style={{
        transform: [{ scale: animatedValue }],
        opacity: animatedValue,
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
      }}
    >
      <Text style={{ 
        fontSize: 24, 
        fontWeight: 'bold',
        color: '#FFF'  // White text for better contrast
      }}>
        {value}
      </Text>
      <Text style={{ 
        fontSize: 16,
        color: '#ECF0F1',  // Light gray text for secondary info
        fontWeight: '500'
      }}>
        {label}
      </Text>
    </Animated.View>
  );
};

export default StatItem;