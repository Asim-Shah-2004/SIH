import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, Alert } from 'react-native';
// import * as DocumentPicker from 'expo-document-picker';

const NewJob = () => {
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    company: '',
    logo: '',
    location: '',
    salary: '',
    type: 'Full-time',
    experience: '',
    skills: '',
    benefits: '',
    description: '',
    postedDate: '',
    department: '',
    vacancies: 1,
    requirements: '',
    jdPdf: '',
    postedBy: { name: '' },
  });

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  // const handleFileChange = async () => {
  //     let result = await DocumentPicker.getDocumentAsync({ type: 'application/pdf' });
  //     if (result.type === 'success') {
  //         setFormData({ ...formData, jdPdf: result.name });
  //         Alert.alert('Pick successful');
  //     } else {
  //         Alert.alert('Please select a PDF file');
  //     }
  // };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <View>
      <Text>New Job</Text>
      <TextInput
        placeholder="Job ID"
        value={formData.id}
        onChangeText={(value) => handleChange('id', value)}
        required
      />
      <TextInput
        placeholder="Title"
        value={formData.title}
        onChangeText={(value) => handleChange('title', value)}
        required
      />
      <TextInput
        placeholder="Company"
        value={formData.company}
        onChangeText={(value) => handleChange('company', value)}
        required
      />
      <TextInput
        placeholder="Logo URL"
        value={formData.logo}
        onChangeText={(value) => handleChange('logo', value)}
        required
      />
      <TextInput
        placeholder="Location"
        value={formData.location}
        onChangeText={(value) => handleChange('location', value)}
        required
      />
      <TextInput
        placeholder="Salary"
        value={formData.salary}
        onChangeText={(value) => handleChange('salary', value)}
        required
      />
      {/* <Picker
                selectedValue={formData.type}
                onValueChange={(value) => handleChange('type', value)}
                required
            >
                <Picker.Item label="Full-time" value="Full-time" />
                <Picker.Item label="Part-time" value="Part-time" />
                <Picker.Item label="Contract" value="Contract" />
                <Picker.Item label="Internship" value="Internship" />
            </Picker> */}
      <TextInput
        placeholder="Experience"
        value={formData.experience}
        onChangeText={(value) => handleChange('experience', value)}
        required
      />
      <TextInput
        placeholder="Skills"
        value={formData.skills}
        onChangeText={(value) => handleChange('skills', value)}
        required
      />
      <TextInput
        placeholder="Benefits"
        value={formData.benefits}
        onChangeText={(value) => handleChange('benefits', value)}
      />
      <TextInput
        placeholder="Description"
        value={formData.description}
        onChangeText={(value) => handleChange('description', value)}
        required
      />
      <TextInput
        placeholder="Posted Date"
        value={formData.postedDate}
        onChangeText={(value) => handleChange('postedDate', value)}
        required
      />
      <TextInput
        placeholder="Department"
        value={formData.department}
        onChangeText={(value) => handleChange('department', value)}
      />
      <TextInput
        placeholder="Vacancies"
        value={formData.vacancies}
        onChangeText={(value) => handleChange('vacancies', value)}
      />
      <TextInput
        placeholder="Requirements"
        value={formData.requirements}
        onChangeText={(value) => handleChange('requirements', value)}
      />
      {/* <TouchableOpacity onPress={handleFileChange}>
                <Text>Upload JD (PDF only)</Text>
            </TouchableOpacity> */}
      <TextInput
        placeholder="Posted By (Name)"
        value={formData.postedBy.name}
        onChangeText={(value) => handleChange('postedBy.name', value)}
        required
      />
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
};

export default NewJob;
