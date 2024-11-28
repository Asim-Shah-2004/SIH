import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from 'react-native';

export default function App() {
    const [step, setStep] = useState(1); // Step 1: Registration, Step 2: OTP Verification
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phoneNumber: '',
    });
    const [otp, setOtp] = useState('');
    const [generatedOtp, setGeneratedOtp] = useState('');

    // Handle input changes
    const handleInputChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    // Generate OTP and move to verification step
    const handleRegistration = () => {
        const { username, email, phoneNumber } = formData;

        if (!username || !email || !phoneNumber) {
            Alert.alert('Error', 'All fields are required.');
            return;
        }

        // Generate a random 6-digit OTP
        const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedOtp(randomOtp);

        Alert.alert(
            'OTP Sent',
            `An OTP has been sent to ${phoneNumber}: ${randomOtp} (for testing purposes)`
        );

        setStep(2); // Move to OTP verification step
    };

    // Verify the OTP
    const handleVerifyOtp = () => {
        if (otp === generatedOtp) {
            Alert.alert('Success', 'Registration Successful!');
            setFormData({ username: '', email: '', phoneNumber: '' });
            setOtp('');
            setGeneratedOtp('');
            setStep(1); // Reset to registration step
        } else {
            Alert.alert('Error', 'Invalid OTP. Please try again.');
        }
    };

    return (
        <View style={styles.container}>
            {step === 1 ? (
                // Registration Form
                <>
                    <Text style={styles.title}>Registration</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Username"
                        value={formData.username}
                        onChangeText={(value) => handleInputChange('username', value)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        keyboardType="email-address"
                        value={formData.email}
                        onChangeText={(value) => handleInputChange('email', value)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Phone Number"
                        keyboardType="phone-pad"
                        value={formData.phoneNumber}
                        onChangeText={(value) => handleInputChange('phoneNumber', value)}
                    />
                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleRegistration}
                    >
                        <Text style={styles.buttonText}>Register</Text>
                    </TouchableOpacity>
                </>
            ) : (
                // OTP Verification Form
                <>
                    <Text style={styles.title}>OTP Verification</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter OTP"
                        keyboardType="number-pad"
                        value={otp}
                        onChangeText={setOtp}
                    />
                    <TouchableOpacity style={styles.button} onPress={handleVerifyOtp}>
                        <Text style={styles.buttonText}>Verify OTP</Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingHorizontal: 15,
        marginVertical: 10,
        borderColor: '#ddd',
        borderWidth: 1,
    },
    button: {
        width: '100%',
        height: 50,
        backgroundColor: '#007bff',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
