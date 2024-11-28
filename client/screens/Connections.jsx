import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';

const AlumniRecommendations = ({ navigation }) => {
    const recommendations = [
        {
            id: 1,
            name: 'Blah Blah',
            title: 'SDE at JP Morgan',
            connection: '173 other mutual connections',
        },
        {
            id: 2,
            name: 'Nina Rose',
            title: 'SDE Hackathon Finalist at Microsoft',
            connection: '299 other mutual connections',
        },
        {
            id: 3,
            name: 'John Doe',
            title: 'Product Manager at Google',
            connection: '87 other mutual connections',
        },
        {
            id: 4,
            name: 'Jane Smith',
            title: 'Data Scientist at Amazon',
            connection: '42 other mutual connections',
        },
    ];

    const renderRecommendationItem = ({ item }) => (
        <View style={styles.recommendationCard}>
            <View style={styles.profileContainer}>
                <Image
                    source={require('../assets/profile.jpg')}
                    style={styles.profileImage}
                />
                <View>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.title}>{item.title}</Text>
                </View>
            </View>
            <View style={styles.connectionContainer}>
                {/* <Text style={styles.connection}>{item.connection}</Text> */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.connectButton}>
                        <Text style={styles.connectButtonText}>View Profile</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.connectButton}>
                        <Text style={styles.connectButtonText}>Connect</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.tabContainer}>
                <TouchableOpacity style={styles.tab} onPress={() => navigation.navigate('Map')}>
                    <Text style={styles.tabText}>Alumni Map</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>Alumni Recommendations</Text>

            <Text style={styles.sectionTitle}>Based on Location</Text>
            <FlatList
                data={recommendations}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderRecommendationItem}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.recommendationsContainer}
            />

            <Text style={styles.sectionTitle}>Based on Interests</Text>
            <FlatList
                data={recommendations}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderRecommendationItem}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.recommendationsContainer}
            />

            <Text style={styles.sectionTitle}>Based on Batch</Text>
            <FlatList
                data={recommendations}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderRecommendationItem}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.recommendationsContainer}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f3f3f3',
        padding: 16,
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    tab: {
        backgroundColor: '#0077b6',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 4,
    },
    tabText: {
        color: 'white',
        fontSize: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    recommendationsContainer: {
        paddingVertical: 12,
    },
    recommendationCard: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        marginRight: 16,
        width: 260,
    },
    profileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    profileImage: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 12,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    title: {
        fontSize: 14,
        color: '#666',
    },
    connectionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    connection: {
        fontSize: 12,
        color: '#666',
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    connectButton: {
        backgroundColor: '#0077b6',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 4,
        marginLeft: 8,
    },
    connectButtonText: {
        color: 'white',
        fontSize: 14,
    },
});

export default AlumniRecommendations;