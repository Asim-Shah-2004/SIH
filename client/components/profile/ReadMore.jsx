import React, { useState, useRef } from 'react';
import { Text, View, TouchableOpacity, Animated } from 'react-native';

const ReadMore = ({ children, numberOfLines, className }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    Animated.spring(animation, {
      toValue: isExpanded ? 0 : 1,
      useNativeDriver: true,
      tension: 40,
      friction: 7,
    }).start();
  };

  return (
    <View>
      <Animated.View
        style={{
          transform: [
            {
              scale: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1.02],
              }),
            },
          ],
        }}>
        <Text numberOfLines={isExpanded ? undefined : numberOfLines} className={className}>
          {children}
        </Text>
      </Animated.View>
      {children.length > 150 && (
        <TouchableOpacity onPress={toggleExpand} className="mt-2">
          <Text className="text-base font-semibold text-secondary">
            {isExpanded ? '▲ Show less' : '▼ Read more'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ReadMore;
