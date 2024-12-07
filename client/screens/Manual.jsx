import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { CheckIcon, XIcon } from 'lucide-react-native';

const Manual = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    profilePic: null,
    bio: '',
    workExperience: [],
    education: [],
    skills: [],
    interests: [],
    currentPosition: '',
    email: '',
    phoneNumber: '',
    location: ''
  });
  const [usernameAvailability, setUsernameAvailability] = useState(null);

  const skillSuggestions = [
    'React', 'JavaScript', 'Python', 'Design', 'Marketing', 
    'Data Analysis', 'Machine Learning', 'UI/UX', 'Communication'
  ];
  const interestSuggestions = [
    'Technology', 'Travel', 'Photography', 'Cooking', 'Sports', 
    'Music', 'Reading', 'Art', 'Fitness', 'Gaming'
  ];

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setFormData(prev => ({
        ...prev,
        profilePic: result.assets[0].uri
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

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <ScrollView className="p-4 space-y-4">
            <Text style={styles.heading}>Basic Information</Text>
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
              <Text style={styles.label}>Username</Text>
              <View className="relative">
                <TextInput
                  placeholder="Choose a unique username"
                  value={formData.username}
                  onChangeText={async (text) => {
                    setFormData(prev => ({...prev, username: text}));
                    if (text.length > 2) {
                      const available = await checkUsernameAvailability(text);
                      setUsernameAvailability(available);
                    } else {
                      setUsernameAvailability(null);
                    }
                  }}
                  style={styles.input}
                />
                {usernameAvailability !== null && (
                  <View style={styles.iconContainer}>
                    {usernameAvailability ? 
                      <CheckIcon color="green" size={20} /> : 
                      <XIcon color="red" size={20} />
                    }
                  </View>
                )}
              </View>
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
          </ScrollView>
        );
      
      case 2:
        return (
          <ScrollView className="p-4 space-y-4">
            <Text style={styles.heading}>Profile Details</Text>
            
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
              <Text style={styles.label}>Current Position</Text>
              <TextInput
                placeholder="What's your current role?"
                value={formData.currentPosition}
                onChangeText={(text) => setFormData(prev => ({...prev, currentPosition: text}))}
                style={styles.input}
              />
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
                    placeholder="Duration (years)"
                    value={exp.duration}
                    onChangeText={(text) => {
                      const newExp = [...formData.workExperience];
                      newExp[index].duration = text;
                      setFormData(prev => ({...prev, workExperience: newExp}));
                    }}
                    keyboardType="numeric"
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
                  <TextInput
                    placeholder="CGPA"
                    value={edu.cgpa}
                    onChangeText={(text) => {
                      const newEdu = [...formData.education];
                      newEdu[index].cgpa = text;
                      setFormData(prev => ({...prev, education: newEdu}));
                    }}
                    keyboardType="decimal-pad"
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
                console.log('Form submitted:', formData);
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
});

export default Manual;