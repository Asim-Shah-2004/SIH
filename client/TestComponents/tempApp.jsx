import { View, Text, Image, ImageBackground, ScrollView, Button, StyleSheet, TextInput } from "react-native";
import image from "./assets/image.png";
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function App() {
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState("");

    const fetchUser = async () => {
        try {
            setError(""); // Clear previous error
            setUserData(null); // Clear previous data
            const response = await axios.post("http://192.168.1.4:3500/user/login", {
                email: "omkar@gmail.com",
                password: "omkar",
                role: "student"
            });

            if (response.data) {
                setUserData(response.data);
            } else {
                setError("User not found");
            }
        } catch (err) {
            console.error("Error fetching user:", err);
            setError("User not found");
        }
    };

    return (
        <View style={{ backgroundColor: 'plum', flex: 1, padding: 60 }}>
            <ScrollView>
                {/* <ImageBackground source={{ uri: 'https://picsum.photos/200' }} style={{ width: 200, height: 200 }}>
          <Text><Text style={{ color: 'white' }}>Hello</Text>World</Text>
        </ImageBackground> */}

                <View style={{ backgroundColor: 'lightgreen', width: 200, height: 200 }}>
                    <Text><Text style={{ color: 'white' }}>Hello</Text>World</Text>
                </View>
                <View style={{ backgroundColor: 'lightblue', width: 200, height: 200 }}>
                    <Text><Text style={{ color: 'white' }}>Hello</Text>World</Text>
                </View>

                {/* <Image source={image} style={{ width: 200, height: 200 }} />
        <Image source={{ uri: 'https://picsum.photos/200' }} style={{ width: 200, height: 200 }} /> */}

                {/* <Text>
          It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).
        </Text> */}
                <View style={styles.buttonContainer}>
                    <Button title="Get User" onPress={fetchUser} />
                </View>

                {/* Display User Details */}
                {userData ? (
                    <View style={styles.userContainer}>
                        <Text style={styles.userText}>Name: {userData.username}</Text>
                        <Text style={styles.userText}>Email: {userData.email}</Text>
                        <Text style={styles.userText}>Role: {userData.role}</Text>
                    </View>
                ) : (
                    error && <Text style={styles.errorText}>Data Issues</Text>
                )}
                <Student />
            </ScrollView>
        </View>
    );
}

const Student = () => {
    const [test, setTest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [answers, setAnswers] = useState({});

    // Fetch the test when the component mounts
    useEffect(() => {
        const fetchTest = async () => {
            try {
                const response = await axios.get('http://192.168.1.4:3500/test/test'); // Backend URL to get the test
                setTest(response.data); // Set the fetched test to state
                setLoading(false); // Stop loading once data is fetched
                console.log(response.data);
            } catch (error) {
                setError(error.message); // Set error message if there's an issue
                setLoading(false); // Stop loading in case of error
            }
        };

        fetchTest();
    }, []);

    // Handle answer changes
    const handleAnswerChange = (index, value) => {
        setAnswers((prevAnswers) => ({
            ...prevAnswers,
            [index]: value, // Store the answer with the question index
        }));
    };

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            // Send answers to the server
            const response = await axios.post('http://localhost:3500/test/evaluate', { answers });
            alert('Test submitted successfully!');
            console.log(response.data); // You can handle the response as needed
        } catch (error) {
            alert('Error submitting the test!');
            console.error(error);
        }
    };

    if (loading) {
        return <Text>Loading...</Text>; // Show loading state while fetching test
    }

    if (error) {
        return <Text>Error: {error}</Text>; // Show error if fetching test fails
    }

    return (
        <View>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginVertical: 10 }}>{test.name}</Text>
            {test.questions.map((question, index) => (
                <View key={index} style={{ marginVertical: s10 }}>
                    <Text>{`${index + 1}. ${question}`}</Text>
                    <TextInput
                        style={{
                            borderWidth: 1,
                            borderColor: 'gray',
                            borderRadius: 5,
                            padding: 10,
                            marginTop: 5,
                        }}
                        placeholder={`Answer for: ${question}`}
                        value={answers[index] || ''}
                        onChangeText={(value) => handleAnswerChange(index, value)}
                    />
                </View>
            ))}
            <Button title="Submit Test" onPress={handleSubmit} />
        </View>
    );
};

const styles = StyleSheet.create({
    buttonContainer: {
        marginVertical: 20,
        alignItems: "center",
    },
    userContainer: {
        marginTop: 20,
        padding: 15,
        backgroundColor: "white",
        borderRadius: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
    },
    userText: {
        fontSize: 16,
        marginBottom: 10,
    },
    errorText: {
        color: "red",
        marginTop: 20,
        fontSize: 16,
        textAlign: "center",
    },
});