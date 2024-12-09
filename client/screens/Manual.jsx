import { SERVER_URL } from '@env';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';

const CITY_COORDINATES = {
  Mumbai: { latitude: 19.076, longitude: 72.8777 },
  Delhi: { latitude: 28.6139, longitude: 77.209 },
  Bangalore: { latitude: 12.9716, longitude: 77.5946 },
};

const Manual = ({ route, navigation }) => {
  const resumeData = route.params?.resumeData || null;

  // Initialize empty data structures for education and experience
  const emptyEducation = [
    {
      degree: '',
      university: '',
      graduationYear: '',
      major: '',
      honors: '',
    },
  ];

  const emptyExperience = [
    {
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      description: '',
    },
  ];

  // Process resumeData only if it exists
  const newEDU = resumeData
    ? resumeData.education.map((edu) => ({
        degree: edu.degree,
        university: edu.institution,
        graduationYear: edu.graduation_year,
        major: edu.major,
        honors: edu.honors,
      }))
    : emptyEducation;

  const newJOB = resumeData
    ? resumeData.experience.map((exp) => ({
        company: exp.company,
        position: exp.position,
        startDate: exp.start_date,
        endDate: exp.end_date,
        description: exp.responsibilities[0],
      }))
    : emptyExperience;

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
    confirmPassword: '',
    city: resumeData?.personal_info?.city || '',
    state: resumeData?.personal_info?.state || '',
    country: resumeData?.personal_info?.country || '',
    languages: resumeData?.personal_info?.languages || [],
    about: resumeData?.personal_info?.about || '',
  });

  const [passwordError, setPasswordError] = useState('');
  const [errors, setErrors] = useState({});

  const skillSuggestions = [
    'React',
    'JavaScript',
    'Python',
    'Design',
    'Marketing',
    'Data Analysis',
    'Machine Learning',
    'UI/UX',
    'Communication',
  ];
  const interestSuggestions = [
    'Technology',
    'Travel',
    'Photography',
    'Cooking',
    'Sports',
    'Music',
    'Reading',
    'Art',
    'Fitness',
    'Gaming',
  ];

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      base64: true,
    });

    if (!result.canceled) {
      const base64Image = result.assets[0].base64;
      setFormData((prev) => ({
        ...prev,
        profilePic: base64Image,
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
      password: 'defaultPassword123', // You might want to handle this differently
      isUniversityGeneratedPassword: true,
      profilePhoto: formData.profilePic,
      phone: formData.phoneNumber,
      address: formData.location,
      education: formData.education.map((edu) => ({
        degree: edu.degree,
        institution: edu.university,
        yearOfGraduation: parseInt(edu.graduationYear, 10),
      })),
      workExperience: formData.workExperience.map((exp) => ({
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

  const validateFields = () => {
    const newErrors = {};
    const requiredFields = {
      name: 'Full Name',
      email: 'Email',
      password: 'Password',
      phoneNumber: 'Phone Number',
      city: 'City',
      state: 'State',
      country: 'Country',
    };

    Object.entries(requiredFields).forEach(([field, label]) => {
      if (!formData[field]) {
        newErrors[field] = `${label} is required`;
      }
    });

    // Validate arrays
    if (!formData.skills?.length) newErrors.skills = 'At least one skill is required';
    if (!formData.languages?.length) newErrors.languages = 'At least one language is required';
    if (!formData.interests?.length) newErrors.interests = 'At least one interest is required';

    // Validate education
    if (!formData.education?.[0]?.degree || !formData.education?.[0]?.university) {
      newErrors.education = 'Education details are required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateFields()) {
      Alert.alert('Missing Information', 'Please fill in all required fields');
      return;
    }

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
        city: formData.city,
        state: formData.state,
        country: formData.country,
        education: formData.education.map((edu) => ({
          degree: edu.degree,
          institution: edu.university,
          yearOfGraduation: parseInt(edu.graduationYear, 10) || null,
        })),
        workExperience: formData.workExperience.map((exp) => ({
          companyName: exp.company,
          role: exp.position,
          startDate: exp.startDate ? new Date(exp.startDate) : null,
          endDate: exp.endDate === 'Present' ? null : new Date(exp.endDate),
          description: exp.description,
        })),
        skills: formData.skills || [],
        projects: [],
        certifications: [],
        languages: formData.languages,
        location: {
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
        },
        bio: formData.bio || '',
        about: formData.about,
        interests: formData.interests || [],
        website: '',
      };

      console.log('Sending data:', JSON.stringify(formattedData, null, 2));

      const response = await fetch(`${SERVER_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(formattedData), // Make sure to stringify!
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
      Alert.alert('Registration Failed', error.message || 'Please check your data and try again');
    }
  };

  const isFormValid = () => {
    const requiredFields = ['name', 'email', 'password', 'phoneNumber', 'city', 'state', 'country'];
    const hasRequiredFields = requiredFields.every((field) => formData[field]);
    const hasArrays =
      formData.skills?.length && formData.languages?.length && formData.interests?.length;
    const hasEducation = formData.education?.[0]?.degree && formData.education?.[0]?.university;

    return hasRequiredFields && hasArrays && hasEducation;
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <ScrollView className="space-y-4 p-4">
            <Text style={styles.heading}>Basic Information</Text>

            <TouchableOpacity onPress={pickImage} style={styles.imagePickerContainer}>
              {formData.profilePic ? (
                <Image source={{ uri: formData.profilePic }} style={styles.profileImage} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Text style={styles.imagePlaceholderText}>Add Profile Picture</Text>
                </View>
              )}
            </TouchableOpacity>

            {renderInput('Full Name', 'name', { placeholder: 'Enter your full name' })}
            {renderInput('Email', 'email', {
              placeholder: 'Enter your email',
              keyboardType: 'email-address',
            })}
            {renderInput('Phone Number', 'phoneNumber', {
              placeholder: 'Enter your phone number',
              keyboardType: 'numeric',
            })}
            {renderInput('Location', 'location', { placeholder: 'Where are you based?' })}
            {renderInput('City', 'city', { placeholder: 'Enter your city' })}
            {renderInput('State', 'state', { placeholder: 'Enter your state' })}
            {renderInput('Country', 'country', { placeholder: 'Enter your country' })}

            <View className="mb-6 rounded-xl bg-white p-4 shadow-sm">
              <Text className="mb-3 text-lg font-semibold">Languages</Text>
              <View className="flex-row flex-wrap gap-2">
                {['English', 'Hindi', 'Spanish', 'French', 'German', 'Chinese'].map(
                  (lang, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => {
                        setFormData((prev) => ({
                          ...prev,
                          languages: prev.languages.includes(lang)
                            ? prev.languages.filter((l) => l !== lang)
                            : [...prev.languages, lang],
                        }));
                      }}
                      className={`rounded-full border px-4 py-2 ${
                        formData.languages.includes(lang)
                          ? 'border-black bg-black'
                          : 'border-gray-200 bg-gray-100'
                      }`}>
                      <Text
                        className={
                          formData.languages.includes(lang) ? 'text-white' : 'text-gray-700'
                        }>
                        {lang}
                      </Text>
                    </TouchableOpacity>
                  )
                )}
              </View>
              {errors.languages && (
                <Text className="mt-2 text-xs text-red-500">{errors.languages}</Text>
              )}
            </View>
          </ScrollView>
        );

      case 2:
        return (
          <ScrollView className="space-y-4 p-4">
            <Text style={styles.heading}>Profile Details</Text>

            {renderInput('Current Position', 'currentPosition', {
              placeholder: "What's your current role?",
            })}
            {renderInput('New Password', 'password', {
              placeholder: 'Enter new password',
              secureTextEntry: true,
            })}
            {renderInput('Confirm Password', 'confirmPassword', {
              placeholder: 'Confirm your password',
              secureTextEntry: true,
            })}
            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
            {renderInput('Bio', 'bio', {
              placeholder: 'Tell us about yourself',
              multiline: true,
              style: styles.textArea,
            })}
          </ScrollView>
        );

      case 3:
        return (
          <ScrollView className="space-y-4 p-4">
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
                      setFormData((prev) => ({ ...prev, workExperience: newExp }));
                    }}
                    style={styles.input}
                  />
                  <TextInput
                    placeholder="Position"
                    value={exp.position}
                    onChangeText={(text) => {
                      const newExp = [...formData.workExperience];
                      newExp[index].position = text;
                      setFormData((prev) => ({ ...prev, workExperience: newExp }));
                    }}
                    style={styles.input}
                  />
                  <TextInput
                    placeholder="Start Date"
                    value={exp.startDate}
                    onChangeText={(text) => {
                      const newExp = [...formData.workExperience];
                      newExp[index].duration = text;
                      setFormData((prev) => ({ ...prev, workExperience: newExp }));
                    }}
                    style={styles.input}
                  />
                  <TextInput
                    placeholder="End Date"
                    value={exp.endDate}
                    onChangeText={(text) => {
                      const newExp = [...formData.workExperience];
                      newExp[index].duration = text;
                      setFormData((prev) => ({ ...prev, workExperience: newExp }));
                    }}
                    style={styles.input}
                  />
                  <TextInput
                    placeholder="Description"
                    value={exp.description}
                    onChangeText={(text) => {
                      const newExp = [...formData.workExperience];
                      newExp[index].description = text;
                      setFormData((prev) => ({ ...prev, workExperience: newExp }));
                    }}
                    multiline
                    style={[styles.input, styles.textArea]}
                  />
                </View>
              ))}
              <TouchableOpacity
                onPress={() => {
                  setFormData((prev) => ({
                    ...prev,
                    workExperience: [
                      ...prev.workExperience,
                      {
                        company: '',
                        position: '',
                        duration: '',
                        description: '',
                      },
                    ],
                  }));
                }}
                style={styles.addButton}>
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
                      setFormData((prev) => ({ ...prev, education: newEdu }));
                    }}
                    style={styles.input}
                  />
                  <TextInput
                    placeholder="Graduation Year"
                    value={edu.graduationYear}
                    onChangeText={(text) => {
                      const newEdu = [...formData.education];
                      newEdu[index].graduationYear = text;
                      setFormData((prev) => ({ ...prev, education: newEdu }));
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
                      setFormData((prev) => ({ ...prev, education: newEdu }));
                    }}
                    style={styles.input}
                  />
                </View>
              ))}
              <TouchableOpacity
                onPress={() => {
                  setFormData((prev) => ({
                    ...prev,
                    education: [
                      ...prev.education,
                      {
                        degree: '',
                        graduationYear: '',
                        university: '',
                        cgpa: '',
                      },
                    ],
                  }));
                }}
                style={styles.addButton}>
                <Text style={styles.addButtonText}>+ Add Education</Text>
              </TouchableOpacity>
              {errors.education && <Text style={styles.errorMessage}>{errors.education}</Text>}
            </View>

            <View className="mb-6 rounded-xl bg-white p-4 shadow-sm">
              <Text className="mb-3 text-lg font-semibold">Skills</Text>
              <View className="flex-row flex-wrap gap-2">
                {skillSuggestions.map((skill, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      setFormData((prev) => ({
                        ...prev,
                        skills: prev.skills.includes(skill)
                          ? prev.skills.filter((s) => s !== skill)
                          : [...prev.skills, skill],
                      }));
                    }}
                    className={`rounded-full border px-4 py-2 ${
                      formData.skills.includes(skill)
                        ? 'border-black bg-black'
                        : 'border-gray-200 bg-gray-100'
                    }`}>
                    <Text
                      className={formData.skills.includes(skill) ? 'text-white' : 'text-gray-700'}>
                      {skill}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {errors.skills && <Text className="mt-2 text-xs text-red-500">{errors.skills}</Text>}
            </View>

            <View className="mb-6 rounded-xl bg-white p-4 shadow-sm">
              <Text className="mb-3 text-lg font-semibold">Interests</Text>
              <View className="flex-row flex-wrap gap-2">
                {interestSuggestions.map((interest, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      setFormData((prev) => ({
                        ...prev,
                        interests: prev.interests.includes(interest)
                          ? prev.interests.filter((i) => i !== interest)
                          : [...prev.interests, interest],
                      }));
                    }}
                    className={`rounded-full border px-4 py-2 ${
                      formData.interests.includes(interest)
                        ? 'border-black bg-black'
                        : 'border-gray-200 bg-gray-100'
                    }`}>
                    <Text
                      className={
                        formData.interests.includes(interest) ? 'text-white' : 'text-gray-700'
                      }>
                      {interest}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {errors.interests && (
                <Text className="mt-2 text-xs text-red-500">{errors.interests}</Text>
              )}
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
      backgroundColor: '#ffffff',
      padding: 16,
      borderRadius: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
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
      borderWidth: 1,
      borderColor: '#e0e0e0',
    },
    chipSelected: {
      backgroundColor: '#000',
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
    nextButtonDisabled: {
      backgroundColor: '#cccccc',
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
    inputRequired: {
      borderColor: '#ff4444',
    },
    requiredIndicator: {
      color: '#ff4444',
      marginLeft: 4,
    },
    errorMessage: {
      color: '#ff4444',
      fontSize: 12,
      marginTop: 4,
    },
    ...additionalStyles,
  });

  const renderInput = (label, field, options = {}) => (
    <View style={styles.inputContainer}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.requiredIndicator}>*</Text>
      </View>
      <TextInput
        {...options}
        value={formData[field]}
        onChangeText={(text) => {
          setFormData((prev) => ({ ...prev, [field]: text }));
          setErrors((prev) => ({ ...prev, [field]: null }));
        }}
        style={[styles.input, errors[field] && styles.inputRequired]}
      />
      {errors[field] && <Text style={styles.errorMessage}>{errors[field]}</Text>}
    </View>
  );

  const renderFooter = () => (
    <View style={styles.footer}>
      <View style={styles.navigationButtons}>
        {step > 1 && (
          <TouchableOpacity
            onPress={() => setStep((prev) => prev - 1)}
            style={[styles.button, styles.backButton]}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={() => {
            if (step < 3) setStep((prev) => prev + 1);
            else handleSubmit();
          }}
          disabled={step === 3 && !isFormValid()}
          style={[
            styles.button,
            styles.nextButton,
            step === 3 && !isFormValid() && styles.nextButtonDisabled,
          ]}>
          <Text style={styles.nextButtonText}>{step === 3 ? 'Submit' : 'Next'}</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.stepIndicator}>Step {step} of 3</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderStep()}
      {renderFooter()}
    </View>
  );
};

export default Manual;
