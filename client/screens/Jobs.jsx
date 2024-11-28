import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

const jobsData = [
    { id: '1', title: 'Software Engineer', company: 'TechCorp', location: 'Mumbai, India', salary: '₹10,00,000' },
    { id: '2', title: 'Data Scientist', company: 'DataX', location: 'Bangalore, India', salary: '₹12,00,000' },
    { id: '3', title: 'Product Manager', company: 'InnovateCo', location: 'Delhi, India', salary: '₹15,00,000' },
    { id: '4', title: 'UI/UX Designer', company: 'Designify', location: 'Pune, India', salary: '₹8,00,000' },
];

const JobPortal = () => {
    const renderJob = ({ item }) => (
        <View style={styles.jobCard}>
            <Text style={styles.jobTitle}>{item.title}</Text>
            <Text style={styles.jobCompany}>{item.company}</Text>
            <Text style={styles.jobLocation}>{item.location}</Text>
            <Text style={styles.jobSalary}>{item.salary}</Text>
            <TouchableOpacity style={styles.applyButton}>
                <Text style={styles.applyButtonText}>Apply Now</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={jobsData}
                renderItem={renderJob}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.flatListContainer}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',  // Light gray-blue (background)
        paddingVertical: 20,
        paddingHorizontal: 16,
    },
    flatListContainer: {
        paddingBottom: 20,
    },
    jobCard: {
        backgroundColor: '#FFFFFF', // White
        padding: 16,
        marginBottom: 16,
        borderRadius: 8,
        shadowColor: '#000000',  // Shadow effect
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,  // Shadow for Android
    },
    jobTitle: {
        color: '#2C3E8D',  // Deep blue (primary)
        fontSize: 18,
        fontWeight: 'bold',
    },
    jobCompany: {
        color: '#3498DB',  // Bright blue (secondary)
        fontSize: 16,
        marginTop: 5,
    },
    jobLocation: {
        color: '#2C3F4A',  // Dark navy gray (text)
        fontSize: 14,
        marginTop: 5,
    },
    jobSalary: {
        color: '#34495E',  // Highlight gray
        fontSize: 14,
        marginTop: 5,
    },
    applyButton: {
        backgroundColor: '#3498DB',  // Bright blue (secondary)
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginTop: 16,
    },
    applyButtonText: {
        color: '#FFFFFF',  // White text
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default JobPortal;
