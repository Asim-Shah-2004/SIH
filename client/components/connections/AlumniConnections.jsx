import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ScrollView } from 'react-native';

import UserCard from '../../utils/UserCard'; // Importing the UserCard component
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
// import { connectHandler } from '../../utils/connectHandler';

const AlumniRecommendations = () => {
    const navigation = useNavigation();
    const [interestRecommendations, setInterestRecommendations] = useState([]);
    const [locationRecommendations, setLocationRecommendations] = useState([]);
    const [overallRecommendations, setOverallRecommendations] = useState([]);
    const [professionRecommendations, setProfessionRecommendations] = useState([]);

    useEffect(() => {
        const getRecommendations = async () => {
            try {
                const response = await axios.post('http://192.168.1.6:8000/api/get_comprehensive_recommendations/', {
                    "email": "raywridesh@example.org"
                });
                setInterestRecommendations(response.data.interest_recommendations);
                setLocationRecommendations(response.data.location_recommendations);
                setOverallRecommendations(response.data.overall_recommendations);
                setProfessionRecommendations(response.data.profession_recommendations);
            } catch (err) {
                console.error('Error:', err);
            }
        };
        getRecommendations();
    }, []);

    const renderRecommendationItem = ({ item }) => (
        <UserCard
            alumni={item}
        />
    );

    return (
        <ScrollView contentContainerStyle={{ paddingBottom: 16 }} className="bg-gray-100 p-4">
            {/* Alumni Map Button */}
            <View className="flex-row justify-evenly">
                <View className="mb-4 flex-row justify-between">
                    <TouchableOpacity
                        className="rounded-md bg-blue-700 px-4 py-2"
                        onPress={() => navigation.navigate('Map')}>
                        <Text className="text-base font-semibold text-white">Alumni Map</Text>
                    </TouchableOpacity>
                </View>
                <View className="mb-4 flex-row justify-between">
                    <TouchableOpacity
                        className="rounded-md bg-blue-700 px-4 py-2"
                        onPress={() => navigation.navigate('Directory')}>
                        <Text className="text-base font-semibold text-white">Alumni Directory</Text>
                    </TouchableOpacity>
                </View>
                <View className="mb-4 flex-row justify-between">
                    <TouchableOpacity
                        className="rounded-md bg-blue-700 px-4 py-2"
                        onPress={() => navigation.navigate('All')}>
                        <Text className="text-base font-semibold text-white">All</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Alumni Recommendations based on different categories */}
            <Text className="mb-3 text-lg font-bold">Alumni Recommendations</Text>

            <Text className="mb-3 text-lg font-bold">Overall</Text>
            <FlatList
                data={overallRecommendations}
                keyExtractor={(item) => item._id}
                renderItem={renderRecommendationItem} // Using the UserCard component here
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingVertical: 12 }}
                ItemSeparatorComponent={() => <View style={{ width: 15 }} />} // Spacing between cards
            />

            <Text className="mb-3 text-lg font-bold">Based on Interests</Text>
            <FlatList
                data={interestRecommendations}
                keyExtractor={(item) => item._id}
                renderItem={renderRecommendationItem} // Using the UserCard component here
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingVertical: 12 }}
                ItemSeparatorComponent={() => <View style={{ width: 15 }} />} // Spacing between cards
            />

            <Text className="mb-3 text-lg font-bold">Based on Profession</Text>
            <FlatList
                data={professionRecommendations}
                keyExtractor={(item) => item._id}
                renderItem={renderRecommendationItem} // Using the UserCard component here
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingVertical: 12 }}
                ItemSeparatorComponent={() => <View style={{ width: 12 }} />} // Spacing between cards
            />

            <Text className="mb-3 text-lg font-bold">Based on Location</Text>
            <FlatList
                data={locationRecommendations}
                keyExtractor={(item) => item._id}
                renderItem={renderRecommendationItem} // Using the UserCard component here
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingVertical: 12 }}
                ItemSeparatorComponent={() => <View style={{ width: 12 }} />} // Spacing between cards
            />
        </ScrollView>
    );
};

export default AlumniRecommendations;
