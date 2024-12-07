import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { CheckIcon, XIcon } from 'lucide-react-native';
import {SERVER_URL} from '@env';

const CITY_COORDINATES = {
  'Mumbai': { latitude: 19.0760, longitude: 72.8777 },
  'Delhi': { latitude: 28.6139, longitude: 77.2090 },
  'Bangalore': { latitude: 12.9716, longitude: 77.5946 }
};

const Manual = ({route, navigation}) => { 
  const resumeData = route.params?.resumeData || null;
  
  // Initialize empty data structures for education and experience
  const emptyEducation = [{
    degree: '',
    university: '',
    graduationYear: '',
    major: '',
    honors: ''
  }];

  const emptyExperience = [{
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    description: ''
  }];

  // Process resumeData only if it exists
  const newEDU = resumeData ? resumeData.education.map(edu => ({ 
    degree: edu.degree,
    university: edu.institution, 
    graduationYear: edu.graduation_year,
    major: edu.major,
    honors: edu.honors
  })) : emptyEducation;

  const newJOB = resumeData ? resumeData.experience.map(exp => ({ 
    company: exp.company, 
    position: exp.position, 
    startDate: exp.start_date,
    endDate: exp.end_date, 
    description: exp.responsibilities[0]
  })) : emptyExperience;

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: resumeData?.personal_info?.full_name || '',
    profilePic: resumeData?.personal_info?.profile_picture || null,
    bio: resumeData?.personal_info?.summary || '',
    workExperience: newJOB,
    education: newEDU,
    skills: resumeData?.personal_info?.skills || [],
    interests: resumeData?.personal_info?.interests || [],
    currentPosition: resumeData?.personal_info?.current_position || '',
    email: resumeData?.personal_info?.email || '',
    phoneNumber: resumeData?.personal_info?.phone || '',
    location: resumeData?.personal_info?.location || '',
    password: '',
    confirmPassword: ''
  });

  const [passwordError, setPasswordError] = useState('');
  
  const skillSuggestions = [
    'React', 'JavaScript', 'Python', 'Design', 'Marketing', 
    'Data Analysis', 'Machine Learning', 'UI/UX', 'Communication'
  ];
  const interestSuggestions = [
    'Technology', 'Travel', 'Photography', 'Cooking', 'Sports', 
    'Music', 'Reading', 'Art', 'Fitness', 'Gaming'
  ];

  const convertImageToBase64 = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error converting image:', error);
      return null;
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const base64Image = await convertImageToBase64(result.assets[0].uri);
      setFormData(prev => ({
        ...prev,
        profilePic: base64Image
      }));
    }
  };

  const checkUsernameAvailability = async (username) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(username.length >= 3);
      }, 500);
    });
  };

  const getRandomCityCoordinates = () => {
    const cities = Object.values(CITY_COORDINATES);
    return cities[Math.floor(Math.random() * cities.length)];
  };

  const prepareDataForSubmission = () => {
    const coordinates = getRandomCityCoordinates();
    
    // Format the data according to the backend schema
    const formattedData = {
      fullName: formData.name,
      email: formData.email,
      password: "defaultPassword123", // You might want to handle this differently
      isUniversityGeneratedPassword: true,
      profilePhoto: formData.profilePic,
      phone: formData.phoneNumber,
      address: formData.location,
      education: formData.education.map(edu => ({
        degree: edu.degree,
        institution: edu.university,
        yearOfGraduation: parseInt(edu.graduationYear),
      })),
      workExperience: formData.workExperience.map(exp => ({
        companyName: exp.company,
        role: exp.position,
        startDate: new Date(exp.startDate),
        endDate: exp.endDate === 'Present' ? null : new Date(exp.endDate),
        description: exp.description,
      })),
      skills: formData.skills,
      projects: [], // Add if you have project data
      certifications: [], // Add if you have certification data
      languages: [], // Add if you have language data
      location: coordinates,
      connections: [],
      receivedRequests: [],
      sentRequests: [],
      notifications: [],
      bio: formData.bio,
      interests: formData.interests,
      website: '', // Add if you have website data
    };

    return formattedData;
  };

  const handleSubmit = async () => {
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match');
      setStep(2);
      return;
    }

    try {
      const coordinates = getRandomCityCoordinates();
      
      // Prepare data according to schema
      const formattedData = {
        fullName: formData.name,
        email: formData.email,
        password: formData.password,
        isUniversityGeneratedPassword: false,
        profilePhoto: formData.profilePic,
        phone: formData.phoneNumber,
        address: formData.location,
        education: formData.education.map(edu => ({
          degree: edu.degree,
          institution: edu.university,
          yearOfGraduation: parseInt(edu.graduationYear) || null,
        })),
        workExperience: formData.workExperience.map(exp => ({
          companyName: exp.company,
          role: exp.position,
          startDate: exp.startDate ? new Date(exp.startDate) : null,
          endDate: exp.endDate === 'Present' ? null : new Date(exp.endDate),
          description: exp.description,
        })),
        skills: formData.skills || [],
        projects: [],
        certifications: [],
        languages: [],
        location: {
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
        },
        bio: formData.bio || '',
        interests: formData.interests || [],
        website: '',
      };

      console.log('Sending data:', JSON.stringify(formattedData, null, 2));

      const response = await fetch(`${SERVER_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(formattedData),  // Make sure to stringify!
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server error:', errorText);
        throw new Error(`Registration failed: ${errorText}`);
      }

      const data = await response.json();
      console.log('Registration successful:', data);
      
      // Navigate to login or next screen
      navigation.navigate('Login');
      
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert(
        'Registration Failed',
        error.message || 'Please check your data and try again'
      );
    }
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <ScrollView className="p-4 space-y-4">
            <Text style={styles.heading}>Basic Information</Text>
            
            <TouchableOpacity 
              onPress={pickImage}
              style={styles.imagePickerContainer}
            >
              {formData.profilePic ? (
                <Image 
                  source={{ uri: formData.profilePic }} 
                  style={styles.profileImage}
                />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Text style={styles.imagePlaceholderText}>Add Profile Picture</Text>
                </View>
              )}
            </TouchableOpacity>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                placeholder="Enter your full name"
                value={formData.name}
                onChangeText={(text) => setFormData(prev => ({...prev, name: text}))}
                style={styles.input}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                placeholder="Enter your email"
                value={formData.email}
                onChangeText={(text) => setFormData(prev => ({...prev, email: text}))}
                keyboardType="email-address"
                style={styles.input}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                placeholder="Enter your phone number"
                value={formData.phoneNumber}
                onChangeText={(text) => {
                  const cleaned = text.replace(/\D/g, '');
                  setFormData(prev => ({...prev, phoneNumber: cleaned.slice(0, 10)}));
                }}
                keyboardType="numeric"
                style={styles.input}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Location</Text>
              <TextInput
                placeholder="Where are you based?"
                value={formData.location}
                onChangeText={(text) => setFormData(prev => ({...prev, location: text}))}
                style={styles.input}
              />
            </View>
          </ScrollView>
        );
      
      case 2:
        return (
          <ScrollView className="p-4 space-y-4">
            <Text style={styles.heading}>Profile Details</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Current Position</Text>
              <TextInput
                placeholder="What's your current role?"
                value={formData.currentPosition}
                onChangeText={(text) => setFormData(prev => ({...prev, currentPosition: text}))}
                style={styles.input}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>New Password</Text>
              <TextInput
                placeholder="Enter new password"
                value={formData.password}
                onChangeText={(text) => {
                  setFormData(prev => ({...prev, password: text}));
                  setPasswordError('');
                }}
                secureTextEntry
                style={styles.input}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChangeText={(text) => {
                  setFormData(prev => ({...prev, confirmPassword: text}));
                  setPasswordError('');
                }}
                secureTextEntry
                style={[styles.input, passwordError ? styles.inputError : null]}
              />
              {passwordError ? (
                <Text style={styles.errorText}>{passwordError}</Text>
              ) : null}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Bio</Text>
              <TextInput
                placeholder="Tell us about yourself"
                value={formData.bio}
                onChangeText={(text) => setFormData(prev => ({...prev, bio: text}))}
                multiline
                style={[styles.input, styles.textArea]}
              />
            </View>
          </ScrollView>
        );

      case 3:
        return (
          <ScrollView className="p-4 space-y-4">
            <Text style={styles.heading}>Professional Details</Text>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Work Experience</Text>
              {formData.workExperience.map((exp, index) => (
                <View key={index} style={styles.experienceCard}>
                  <TextInput
                    placeholder="Company Name"
                    value={exp.company}
                    onChangeText={(text) => {
                      const newExp = [...formData.workExperience];
                      newExp[index].company = text;
                      setFormData(prev => ({...prev, workExperience: newExp}));
                    }}
                    style={styles.input}
                  />
                  <TextInput
                    placeholder="Position"
                    value={exp.position}
                    onChangeText={(text) => {
                      const newExp = [...formData.workExperience];
                      newExp[index].position = text;
                      setFormData(prev => ({...prev, workExperience: newExp}));
                    }}
                    style={styles.input}
                  />
                  <TextInput
                    placeholder="Start Date"
                    value={exp.startDate}
                    onChangeText={(text) => {
                      const newExp = [...formData.workExperience];
                      newExp[index].duration = text;
                      setFormData(prev => ({...prev, workExperience: newExp}));
                    }}
                    style={styles.input}
                  />
                  <TextInput
                    placeholder="End Date"
                    value={exp.endDate}
                    onChangeText={(text) => {
                      const newExp = [...formData.workExperience];
                      newExp[index].duration = text;
                      setFormData(prev => ({...prev, workExperience: newExp}));
                    }}
                    style={styles.input}
                  />
                  <TextInput
                    placeholder="Description"
                    value={exp.description}
                    onChangeText={(text) => {
                      const newExp = [...formData.workExperience];
                      newExp[index].description = text;
                      setFormData(prev => ({...prev, workExperience: newExp}));
                    }}
                    multiline
                    style={[styles.input, styles.textArea]}
                  />
                </View>
              ))}
              <TouchableOpacity
                onPress={() => {
                  setFormData(prev => ({
                    ...prev,
                    workExperience: [...prev.workExperience, {
                      company: '',
                      position: '',
                      duration: '',
                      description: ''
                    }]
                  }));
                }}
                style={styles.addButton}
              >
                <Text style={styles.addButtonText}>+ Add Work Experience</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Education</Text>
              {formData.education.map((edu, index) => (
                <View key={index} style={styles.educationCard}>
                  <TextInput
                    placeholder="Degree"
                    value={edu.degree}
                    onChangeText={(text) => {
                      const newEdu = [...formData.education];
                      newEdu[index].degree = text;
                      setFormData(prev => ({...prev, education: newEdu}));
                    }}
                    style={styles.input}
                  />
                  <TextInput
                    placeholder="Graduation Year"
                    value={edu.graduationYear}
                    onChangeText={(text) => {
                      const newEdu = [...formData.education];
                      newEdu[index].graduationYear = text;
                      setFormData(prev => ({...prev, education: newEdu}));
                    }}
                    keyboardType="numeric"
                    style={styles.input}
                  />
                  <TextInput
                    placeholder="University"
                    value={edu.university}
                    onChangeText={(text) => {
                      const newEdu = [...formData.education];
                      newEdu[index].university = text;
                      setFormData(prev => ({...prev, education: newEdu}));
                    }}
                    style={styles.input}
                  />
                </View>
              ))}
              <TouchableOpacity
                onPress={() => {
                  setFormData(prev => ({
                    ...prev,
                    education: [...prev.education, {
                      degree: '',
                      graduationYear: '',
                      university: '',
                      cgpa: ''
                    }]
                  }));
                }}
                style={styles.addButton}
              >
                <Text style={styles.addButtonText}>+ Add Education</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Skills</Text>
              <View style={styles.chipContainer}>
                {skillSuggestions.map((skill, index) => (
                  <TouchableOpacity 
                    key={index}
                    onPress={() => {
                      if (!formData.skills.includes(skill)) {
                        setFormData(prev => ({
                          ...prev, 
                          skills: [...prev.skills, skill]
                        }));
                      }
                    }}
                    style={[
                      styles.chip,
                      formData.skills.includes(skill) && styles.chipSelected
                    ]}
                  >
                    <Text style={[
                      styles.chipText,
                      formData.skills.includes(skill) && styles.chipTextSelected
                    ]}>{skill}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Interests</Text>
              <View style={styles.chipContainer}>
                {interestSuggestions.map((interest, index) => (
                  <TouchableOpacity 
                    key={index}
                    onPress={() => {
                      if (!formData.interests.includes(interest)) {
                        setFormData(prev => ({
                          ...prev, 
                          interests: [...prev.interests, interest]
                        }));
                      }
                    }}
                    style={[
                      styles.chip,
                      formData.interests.includes(interest) && styles.chipSelected
                    ]}
                  >
                    <Text style={[
                      styles.chipText,
                      formData.interests.includes(interest) && styles.chipTextSelected
                    ]}>{interest}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
        );
    }
  };

  const additionalStyles = StyleSheet.create({
    inputError: {
      borderColor: '#ff4444',
    },
    errorText: {
      color: '#ff4444',
      fontSize: 12,
      marginTop: 4,
    },
  });

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f5f5f5',
    },
    heading: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#1a1a1a',
      marginBottom: 20,
    },
    inputContainer: {
      marginBottom: 16,
    },
    label: {
      fontSize: 16,
      fontWeight: '600',
      color: '#4a4a4a',
      marginBottom: 8,
    },
    input: {
      backgroundColor: '#fff',
      borderRadius: 8,
      padding: 12,
      borderWidth: 1,
      borderColor: '#e0e0e0',
      fontSize: 16,
    },
    textArea: {
      height: 100,
      textAlignVertical: 'top',
    },
    imagePickerContainer: {
      alignItems: 'center',
      marginBottom: 20,
    },
    profileImage: {
      width: 120,
      height: 120,
      borderRadius: 60,
    },
    imagePlaceholder: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: '#e0e0e0',
      justifyContent: 'center',
      alignItems: 'center',
    },
    imagePlaceholderText: {
      color: '#666',
      textAlign: 'center',
      padding: 10,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 12,
      color: '#1a1a1a',
    },
    chipContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    chip: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      backgroundColor: '#e0e0e0',
    },
    chipSelected: {
      backgroundColor: '#1a1a1a',
    },
    chipText: {
      color: '#4a4a4a',
    },
    chipTextSelected: {
      color: '#fff',
    },
    footer: {
      padding: 16,
      backgroundColor: '#fff',
      borderTopWidth: 1,
      borderTopColor: '#e0e0e0',
    },
    navigationButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    button: {
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
      minWidth: 120,
    },
    backButton: {
      backgroundColor: '#e0e0e0',
    },
    nextButton: {
      backgroundColor: '#1a1a1a',
    },
    backButtonText: {
      color: '#4a4a4a',
      fontSize: 16,
      fontWeight: '600',
      textAlign: 'center',
    },
    nextButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
      textAlign: 'center',
    },
    stepIndicator: {
      textAlign: 'center',
      color: '#666',
    },
    iconContainer: {
      position: 'absolute',
      right: 12,
      top: 12,
    },
    experienceCard: {
      backgroundColor: '#fff',
      padding: 16,
      borderRadius: 8,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: '#e0e0e0',
    },
    
    educationCard: {
      backgroundColor: '#fff',
      padding: 16,
      borderRadius: 8,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: '#e0e0e0',
    },
    
    addButton: {
      backgroundColor: '#f0f0f0',
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 8,
    },
    
    addButtonText: {
      color: '#1a1a1a',
      fontSize: 16,
      fontWeight: '600',
    },
    ...additionalStyles,
  });

  return (
    <View style={styles.container}>
      {renderStep()}
      <View style={styles.footer}>
        <View style={styles.navigationButtons}>
          {step > 1 && (
            <TouchableOpacity 
              onPress={() => setStep(prev => prev - 1)}
              style={[styles.button, styles.backButton]}
            >
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            onPress={() => {
              if (step < 3) setStep(prev => prev + 1);
              else {
                handleSubmit();
              }
            }}
            style={[styles.button, styles.nextButton]}
          >
            <Text style={styles.nextButtonText}>
              {step === 3 ? 'Submit' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.stepIndicator}>Step {step} of 3</Text>
      </View>
    </View>
  );
};

export default Manual;