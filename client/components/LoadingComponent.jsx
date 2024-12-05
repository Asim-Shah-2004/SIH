import { View, Text, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { BounceIn, FadeOut } from 'react-native-reanimated';
import { FontAwesome } from '@expo/vector-icons';

const LoadingComponent = () => {
    return (
        <LinearGradient
            colors={['#1e3c72', '#2a5298']}
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
            <Animated.View
                entering={BounceIn}
                exiting={FadeOut}
                className="items-center space-y-6"
            >
                <FontAwesome name="graduation-cap" size={80} color="white" />
                <ActivityIndicator size="large" color="white" />
                <Text className="text-white text-xl font-semibold text-center">
                    Building your Alumni Network...
                </Text>
                <Text className="text-white text-sm italic">
                    Connecting dreams and aspirations
                </Text>
            </Animated.View>
        </LinearGradient>
    );
}

export default LoadingComponent;