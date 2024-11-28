import React from 'react';
import { View, StyleSheet, Dimensions, Text, ScrollView } from 'react-native';

const { width, height } = Dimensions.get('window');

const WhiteRectangle = () => {
    return (
        <View style={styles.container}>
            <View style={styles.rectangle}>
                <ScrollView contentContainerStyle={styles.textContainer}>
                    <Text style={styles.text}>Here is some text inside the white rectangle. </Text>
                    <Text style={styles.text}>More text here...</Text>
                    <Text style={styles.text}>You can add as much text as you need.</Text>
                    <Text style={styles.text}>This text will scroll if it exceeds the screen space.</Text>
                    <Text style={styles.text}>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Text>
                    <Text style={styles.text}>Vivamus lacinia dui in felis venenatis, sit amet feugiat turpis bibendum.</Text>
                    <Text style={styles.text}>Curabitur at nisl a dui consequat vulputate.</Text>
                    <Text style={styles.text}>Suspendisse potenti. Integer vulputate felis nec mi volutpat, in feugiat enim convallis.</Text>
                    <Text style={styles.text}>Nullam ac ante odio. Nulla facilisi. Aliquam non augue ipsum.</Text>
                    <Text style={styles.text}>Cras tincidunt metus nec elit consequat vehicula.</Text>
                    <Text style={styles.text}>Sed eget sollicitudin libero. Aenean posuere quam vitae feugiat auctor.</Text>
                    <Text style={styles.text}>Nam ut sollicitudin lorem, a viverra velit. Integer fringilla velit at metus suscipit, ut eleifend sem lacinia.</Text>
                </ScrollView>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 1,
    },
    rectangle: {
        width: width * 0.75,  // 3/4th of screen width
        height: height,       // Full height of the screen
        backgroundColor: 'white',
        padding: 10,
    },
    textContainer: {
        paddingBottom: 20, // Padding at the bottom of the scroll view
    },
    text: {
        fontSize: 16,
        color: 'black',
        marginBottom: 10, // Add space between text blocks
    },
});

export default WhiteRectangle;
