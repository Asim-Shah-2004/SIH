import { View, Text, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
    BounceIn, 
    FadeOut, 
    useAnimatedStyle, 
    withRepeat, 
    withSpring, 
    withSequence,
    withTiming,
    useSharedValue, 
    withDelay 
} from 'react-native-reanimated';
import { FontAwesome } from '@expo/vector-icons';
import { useEffect } from 'react';

const { width, height } = Dimensions.get('window');

const LoadingComponent = () => {
    const scale = useSharedValue(1);
    const opacity = useSharedValue(1);
    const translateY = useSharedValue(0);

    useEffect(() => {
        scale.value = withRepeat(
            withSequence(
                withTiming(1.2, { duration: 1000 }),
                withTiming(1, { duration: 1000 })
            ),
            -1,
            true
        );

        translateY.value = withRepeat(
            withSequence(
                withSpring(-10),
                withSpring(0)
            ),
            -1,
            true
        );
    }, []);

    const iconStyle = useAnimatedStyle(() => ({
        transform: [
            { scale: scale.value },
            { translateY: translateY.value }
        ]
    }));

    const Particle = ({ delay }) => {
        const particleTranslateY = useSharedValue(height);
        const particleOpacity = useSharedValue(0);

        useEffect(() => {
            particleTranslateY.value = withDelay(
                delay,
                withRepeat(
                    withTiming(-height, { duration: 3000 }),
                    -1
                )
            );
            particleOpacity.value = withDelay(
                delay,
                withRepeat(
                    withSequence(
                        withTiming(1, { duration: 1000 }),
                        withTiming(0, { duration: 2000 })
                    ),
                    -1
                )
            );
        }, []);

        return (
            <Animated.View
                style={[{
                    position: 'absolute',
                    width: 4,
                    height: 4,
                    backgroundColor: 'rgba(255,255,255,0.5)',
                    borderRadius: 2,
                    left: Math.random() * width,
                }, {
                    transform: [{ translateY: particleTranslateY }],
                    opacity: particleOpacity
                }]}
            />
        );
    };

    return (
        <LinearGradient
            colors={['#1e3c72', '#2a5298', '#1e3c72']}
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
            {[...Array(15)].map((_, i) => (
                <Particle key={i} delay={i * 200} />
            ))}
            
            <Animated.View
                entering={BounceIn}
                exiting={FadeOut}
                className="items-center space-y-8"
            >
                <Animated.View style={iconStyle}>
                    <FontAwesome name="graduation-cap" size={100} color="white" />
                </Animated.View>

                <View className="items-center space-y-3">
                    <Animated.Text 
                        entering={BounceIn.delay(300)}
                        className="text-white text-2xl font-bold text-center"
                    >
                        AlumniConnect
                    </Animated.Text>
                    <Animated.Text 
                        entering={BounceIn.delay(600)}
                        className="text-white text-lg font-semibold text-center"
                    >
                        Building Bridges Between Generations
                    </Animated.Text>
                </View>

                <View className="flex-row space-x-2">
                    {[...Array(3)].map((_, i) => (
                        <Animated.View
                            key={i}
                            style={{
                                width: 10,
                                height: 10,
                                borderRadius: 5,
                                backgroundColor: 'white',
                            }}
                            entering={BounceIn.delay(900 + i * 200)}
                        />
                    ))}
                </View>
            </Animated.View>
        </LinearGradient>
    );
}

export default LoadingComponent;