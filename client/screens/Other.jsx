import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';

export default function Other() {
    return (
        <View className="flex-1 bg-[#F4F1DE]">
            {/* Header */}
            <View className="bg-[#E7DFD5] p-5 items-center">
                <Text className="text-[#2D3142] text-2xl font-bold">About This App</Text>
            </View>

            {/* Content */}
            <ScrollView className="p-5">
                {/* Intro Section */}
                <Text className="text-[#2D3142] text-lg text-center mb-5">
                    Welcome to our Alumni Association app! Connect, network, and stay engaged 
                    with your fellow alumni through our intuitive platform.
                </Text>

                {/* Feature Cards */}
                <View className="bg-white p-4 rounded-lg shadow-md mb-4 border border-[#8D6E63]/20">
                    <Text className="text-lg text-[#4A6741] font-bold mb-2">Feature 1: Network Connections</Text>
                    <Text className="text-[#2D3142]">
                        Easily connect with alumni across different batches, industries, and locations.
                    </Text>
                </View>

                <View className="bg-white p-4 rounded-lg shadow-md mb-4 border border-[#8D6E63]/20">
                    <Text className="text-lg text-[#4A6741] font-bold mb-2">Feature 2: Event Management</Text>
                    <Text className="text-[#2D3142]">
                        Stay updated with alumni events, reunions, and professional meetups.
                    </Text>
                </View>

                {/* Styled List */}
                <View className="my-5">
                    <Text className="text-lg text-[#4A6741] font-bold mb-3">What this app offers:</Text>
                    {[
                        'Professional Networking',
                        'Alumni Directory',
                        'Event Invitations',
                        'Career Resources'
                    ].map((item, index) => (
                        <View key={index} className="flex-row items-center mb-2">
                            <View className="w-3 h-3 rounded-full bg-[#7BAE7F] mr-3" />
                            <Text className="text-[#2D3142] text-base">{item}</Text>
                        </View>
                    ))}
                </View>

                {/* Back Button */}
                <TouchableOpacity 
                    className="bg-[#8D6E63] py-3 px-6 rounded-lg self-center mt-5"
                    onPress={() => navigation.goBack()}
                >
                    <Text className="text-white text-base font-bold">Go Back</Text>
                </TouchableOpacity>
            </ScrollView>

            {/* Footer */}
            <View className="bg-[#E7DFD5] p-4 items-center">
                <Text className="text-[#2D3142] text-sm">
                    Connecting Alumni, Building Futures
                </Text>
            </View>
        </View>
    );
}