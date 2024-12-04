import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import debounce from 'lodash/debounce';
import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

const NewJob = () => {
  const scrollViewRef = useRef(null);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    salary: '',
    type: 'Full-time',
    experience: '',
    skills: [],
    benefits: [],
    description: '',
    requirements: [],
    jdPdf: null,
  });

  const [currentSkill, setCurrentSkill] = useState('');
  const [currentBenefit, setCurrentBenefit] = useState('');
  const [currentRequirement, setCurrentRequirement] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Debounced change handler
  const debouncedHandleChange = useCallback(
    debounce((name, value) => {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }, 300),
    []
  );

  const handleChange = (name, value) => {
    debouncedHandleChange(name, value);
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Optimized array handler
  const addToArray = useCallback((field, value, setter) => {
    const trimmedValue = value.trim();
    if (!trimmedValue) return;

    setFormData((prev) => {
      if (prev[field].includes(trimmedValue)) {
        Alert.alert('Already exists', `This ${field.slice(0, -1)} is already added`);
        return prev;
      }
      if (prev[field].length >= 10) {
        Alert.alert('Limit reached', `Maximum 10 ${field} allowed`);
        return prev;
      }
      return {
        ...prev,
        [field]: [...prev[field], trimmedValue],
      };
    });
    setter('');
  }, []);

  const removeFromArray = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleFileUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });

      if (result.type === 'success') {
        setFormData((prev) => ({ ...prev, jdPdf: result }));
        Alert.alert('Success', 'PDF uploaded successfully');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to upload document');
    }
  };

  const validateForm = () => {
    const requiredFields = ['title', 'company', 'location', 'salary', 'experience', 'description'];
    const newErrors = {};

    requiredFields.forEach((field) => {
      if (!formData[field]?.trim()) {
        newErrors[field] = 'This field is required';
      }
    });

    if (formData.skills.length === 0) newErrors.skills = 'Add at least one skill';
    if (formData.requirements.length === 0) newErrors.requirements = 'Add at least one requirement';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please complete all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      Alert.alert('Success', 'Job posted successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to post job');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Optimized array input renderer
  const renderArrayInput = (
    label,
    value,
    setValue,
    arrayField,
    placeholder = 'Add item',
    required = false
  ) => (
    <View style={styles.arrayInputContainer}>
      <Text style={[styles.label, required && styles.requiredLabel]}>
        {label} {required && '*'} ({formData[arrayField].length}/10)
      </Text>
      <View style={styles.arrayInputWrapper}>
        <TextInput
          style={styles.arrayInput}
          placeholder={placeholder}
          value={value}
          onChangeText={setValue}
          maxLength={50}
          returnKeyType="done"
          onSubmitEditing={() => addToArray(arrayField, value, setValue)}
        />
        <TouchableOpacity
          activeOpacity={0.7}
          style={[styles.addButton, formData[arrayField].length >= 10 && styles.addButtonDisabled]}
          disabled={formData[arrayField].length >= 10}
          onPress={() => addToArray(arrayField, value, setValue)}>
          <Text style={styles.plusIcon}>+</Text>
        </TouchableOpacity>
      </View>
      {errors[arrayField] && <Text style={styles.errorText}>{errors[arrayField]}</Text>}
      <View style={styles.tagContainer}>
        {formData[arrayField].map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.tag}
            onPress={() => removeFromArray(arrayField, index)}>
            <Text style={styles.tagText}>{item}</Text>
            <Ionicons name="close" size={16} color="white" />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator
        bounces={false}
        overScrollMode="never"
        keyboardShouldPersistTaps="handled">
        <View style={styles.formContainer}>
          <Text style={styles.title}>Post a New Job</Text>

          {/* Basic Information Inputs */}
          <View style={styles.inputGroup}>
            <TextInput
              style={[styles.input, errors.title && styles.errorInput]}
              placeholder="Job Title *"
              placeholderTextColor="#999"
              value={formData.title}
              onChangeText={(val) => handleChange('title', val)}
            />
            {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
          </View>

          {/* Repeat similar pattern for other text inputs */}
          {['company', 'location', 'salary', 'experience', 'description'].map((field) => (
            <View key={field} style={styles.inputGroup}>
              <TextInput
                style={[styles.input, errors[field] && styles.errorInput]}
                placeholder={`${field.charAt(0).toUpperCase() + field.slice(1)} *`}
                placeholderTextColor="#999"
                value={formData[field]}
                onChangeText={(val) => handleChange(field, val)}
              />
              {errors[field] && <Text style={styles.errorText}>{errors[field]}</Text>}
            </View>
          ))}

          {/* Dynamic Array Inputs */}
          {renderArrayInput('Skills', currentSkill, setCurrentSkill, 'skills', 'Add a skill', true)}

          {renderArrayInput(
            'Benefits',
            currentBenefit,
            setCurrentBenefit,
            'benefits',
            'Add a benefit'
          )}

          {renderArrayInput(
            'Requirements',
            currentRequirement,
            setCurrentRequirement,
            'requirements',
            'Add a requirement',
            true
          )}

          {/* File Upload */}
          <TouchableOpacity style={styles.uploadButton} onPress={handleFileUpload}>
            <Ionicons name="cloud-upload" size={24} color="white" />
            <Text style={styles.uploadButtonText}>
              {formData.jdPdf ? 'PDF Uploaded' : 'Upload Job Description'}
            </Text>
          </TouchableOpacity>

          {/* Submit Button */}
          <Pressable
            style={({ pressed }) => [
              styles.submitButton,
              pressed && styles.submitButtonPressed,
              isSubmitting && styles.submitButtonDisabled,
            ]}
            disabled={isSubmitting}
            onPress={handleSubmit}>
            {isSubmitting ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.submitButtonText}>Post Job</Text>
            )}
          </Pressable>
        </View>
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FB',
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingVertical: 15,
    paddingHorizontal: 15,
    paddingBottom: 50, // Add extra padding at bottom
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  errorInput: {
    borderColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 5,
  },
  arrayInputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  requiredLabel: {
    color: '#EF4444',
  },
  arrayInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  arrayInput: {
    flex: 1,
    height: 50,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginRight: 10,
  },
  addButton: {
    width: 50,
    height: 50,
    backgroundColor: '#3B82F6',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addButtonPressed: {
    backgroundColor: '#2563EB',
    transform: [{ scale: 0.98 }],
  },
  addButtonDisabled: {
    backgroundColor: '#94A3B8',
    opacity: 0.5,
  },
  addButtonContent: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusIcon: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
    lineHeight: 30,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  tagText: {
    color: 'white',
    marginRight: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  uploadButton: {
    flexDirection: 'row',
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  uploadButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  submitButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  submitButtonPressed: {
    transform: [{ scale: 0.98 }],
    backgroundColor: '#2563EB',
  },
  submitButtonDisabled: {
    backgroundColor: '#94A3B8',
    opacity: 0.7,
  },
  bottomSpacing: {
    height: 100, // Extra space at bottom
  },
});

export default NewJob;
