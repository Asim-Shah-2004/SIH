import { Ionicons } from '@expo/vector-icons';
import { View, Text, ScrollView, Image, TextInput, TouchableOpacity, Alert, ToastAndroid } from 'react-native';
import { useState, useCallback } from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { useAuth } from '../providers/AuthProvider';

const MyProfile = () => {
  const { user, updateUser } = useAuth();
  const [editedUser, setEditedUser] = useState(user);
  const [isEditing, setIsEditing] = useState({
    basic: false,
    education: false,
    skills: false,
    workExperience: false,
    photo: false  // Add this line
  });
  const [newSkill, setNewSkill] = useState(''); // Add this line for local state

  const showSaveReminder = useCallback(() => {
    ToastAndroid.show('Remember to save your changes!', ToastAndroid.SHORT);
  }, []);

  const handleUserChange = (updatedUser) => {
    setEditedUser(updatedUser);
    showSaveReminder();
  };

  const handleSave = async () => {
    try {
      console.log('Updated User Object:', editedUser); // Add this line to see the updated user object
      await updateUser(editedUser);
      setIsEditing({
        basic: false,
        education: false,
        skills: false,
        workExperience: false,
        photo: false  // Add this line
      });
      // Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error); // Add error logging
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
        base64: true, // Enable base64
      });

      if (!result.canceled) {
        // Get base64 directly if available, otherwise read the file
        let base64Image;
        if (result.assets[0].base64) {
          base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
        } else {
          const base64 = await FileSystem.readAsStringAsync(result.assets[0].uri, {
            encoding: FileSystem.EncodingType.Base64,
          });
          base64Image = `data:image/jpeg;base64,${base64}`;
        }

        handleUserChange({
          ...editedUser,
          profilePhoto: base64Image
        });
        setIsEditing(prev => ({ ...prev, photo: true })); // Add this line
      }
    } catch (error) {
      console.error('Error picking image:', error);
      ToastAndroid.show('Failed to process image', ToastAndroid.SHORT);
    }
  };

  const Section = ({ title, children, editable, section }) => (
    <View className="mb-4 rounded-xl bg-white p-4 shadow-md">
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-xl font-semibold text-gray-800">{title}</Text>
        {editable && (
          <TouchableOpacity 
            onPress={() => setIsEditing(prev => ({ ...prev, [section]: !prev[section] }))}
          >
            <Ionicons 
              name={isEditing[section] ? "save-outline" : "create-outline"} 
              size={24} 
              color="#666" 
            />
          </TouchableOpacity>
        )}
      </View>
      {children}
    </View>
  );

  const InfoItem = ({ icon, text }) => (
    <View className="mb-2 flex-row items-center">
      <Ionicons name={icon} size={20} color="#666" className="mr-2" />
      <Text className="ml-2 text-gray-700">{text}</Text>
    </View>
  );

  const EditableField = ({ value, onChangeText, placeholder }) => (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      className="border border-gray-300 rounded-md p-2 mb-2"
      placeholder={placeholder}
    />
  );

  return (
    <ScrollView className="flex-1 bg-gray-100">
      {/* Cover Photo */}
      <View className="h-40 bg-blue-500" />

      {/* Profile Header */}
      <View className="-mt-20 px-4">
        <View className="rounded-xl bg-white p-4 shadow-lg">
          <View className="-mt-24 items-center">
            <TouchableOpacity onPress={pickImage}>
              <Image
                source={{ uri: editedUser.profilePhoto }}
                className="mb-2 h-32 w-32 rounded-full border-4 border-white shadow-lg"
              />
              <View className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-2">
                <Ionicons name="camera" size={20} color="white" />
              </View>
            </TouchableOpacity>

            <Text className="mt-2 text-2xl font-bold text-gray-900">{editedUser.fullName}</Text>
            
            {/* Add edit button for basic info */}
            <View className="w-full items-end">
              <TouchableOpacity 
                onPress={() => setIsEditing(prev => ({ ...prev, basic: !prev.basic }))}
                className="p-2"
              >
                <Ionicons 
                  name={isEditing.basic ? "save-outline" : "create-outline"} 
                  size={24} 
                  color="#666" 
                />
              </TouchableOpacity>
            </View>

            {isEditing.basic ? (
              <View className="w-full px-4">
                <EditableField
                  value={editedUser.bio}
                  onChangeText={(text) => handleUserChange({ ...editedUser, bio: text })}
                  placeholder="Bio"
                />
                <EditableField
                  value={editedUser.phone}
                  onChangeText={(text) => handleUserChange({ ...editedUser, phone: text })}
                  placeholder="Phone"
                />
              </View>
            ) : (
              <View className="w-full px-4">
                <Text className="mt-1 text-center text-gray-600">{editedUser.bio}</Text>
                <View className="mt-4 flex-row justify-around border-t border-gray-200 pt-4">
                  <InfoItem icon="mail-outline" text={editedUser.email} />
                  <InfoItem icon="call-outline" text={editedUser.phone} />
                </View>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Main Content */}
      <View className="mt-4 px-4">
        {/* Education */}
        <Section title="Education" editable section="education">
          {isEditing.education ? (
            <>
              {editedUser.education.map((edu, index) => (
                <View key={index} className="mb-3">
                  <EditableField
                    value={edu.degree}
                    onChangeText={(text) => {
                      const newEducation = [...editedUser.education];
                      newEducation[index] = { ...edu, degree: text };
                      handleUserChange({ ...editedUser, education: newEducation });
                    }}
                    placeholder="Degree"
                  />
                  <EditableField
                    value={edu.institution}
                    onChangeText={(text) => {
                      const newEducation = [...editedUser.education];
                      newEducation[index] = { ...edu, institution: text };
                      handleUserChange({ ...editedUser, education: newEducation });
                    }}
                    placeholder="Institution"
                  />
                  <EditableField
                    value={edu.yearOfGraduation.toString()}
                    onChangeText={(text) => {
                      const newEducation = [...editedUser.education];
                      newEducation[index] = { ...edu, yearOfGraduation: text };
                      handleUserChange({ ...editedUser, education: newEducation });
                    }}
                    placeholder="Year of Graduation"
                  />
                  <TouchableOpacity
                    onPress={() => {
                      const newEducation = editedUser.education.filter((_, i) => i !== index);
                      handleUserChange({ ...editedUser, education: newEducation });
                    }}
                    className="bg-red-500 p-2 rounded-md mt-2"
                  >
                    <Text className="text-white text-center">Remove</Text>
                  </TouchableOpacity>
                </View>
              ))}
              <TouchableOpacity
                onPress={() => {
                  handleUserChange({
                    ...editedUser,
                    education: [...editedUser.education, { degree: '', institution: '', yearOfGraduation: '' }]
                  });
                }}
                className="bg-blue-500 p-2 rounded-md"
              >
                <Text className="text-white text-center">Add Education</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              {user.education.map((edu, index) => (
                <View key={index} className="mb-3 border-b border-gray-100 pb-3">
                  <Text className="text-lg font-bold text-gray-800">{edu.degree}</Text>
                  <Text className="text-gray-600">{edu.institution}</Text>
                  <Text className="text-sm text-gray-500">Class of {edu.yearOfGraduation}</Text>
                </View>
              ))}
            </>
          )}
        </Section>

        {/* Skills */}
        <Section title="Skills" editable section="skills">
          {isEditing.skills ? (
            <>
              <View className="-m-1 flex-row flex-wrap">
                {editedUser.skills.map((skill, index) => (
                  <View key={index} className="m-1">
                    <View className="flex-row items-center bg-blue-100 rounded-full px-4 py-2">
                      <Text className="text-blue-800">{skill}</Text>
                      <TouchableOpacity
                        onPress={() => {
                          const newSkills = editedUser.skills.filter((_, i) => i !== index);
                          handleUserChange({ ...editedUser, skills: newSkills });
                        }}
                        className="ml-2"
                      >
                        <Ionicons name="close-circle" size={20} color="red" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
              <View className="mt-2">
                <EditableField
                  value={newSkill}
                  onChangeText={(text) => {
                    setNewSkill(text);
                    if (text.endsWith(' ')) {
                      const skillToAdd = text.trim();
                      if (skillToAdd) {
                        handleUserChange({
                          ...editedUser,
                          skills: [...editedUser.skills, skillToAdd]
                        });
                        setNewSkill(''); // Reset the input after adding
                      }
                    }
                  }}
                  placeholder="Add skill (press space to add)"
                />
              </View>
            </>
          ) : (
            <View className="-m-1 flex-row flex-wrap">
              {user.skills.map((skill, index) => (
                <View key={index} className="m-1 rounded-full bg-blue-100 px-4 py-2">
                  <Text className="text-blue-800">{skill}</Text>
                </View>
              ))}
            </View>
          )}
        </Section>

        {/* Languages */}
        <Section title="Languages">
          <View className="-m-1 flex-row flex-wrap">
            {user.languages.map((language, index) => (
              <View key={index} className="m-1 rounded-full bg-green-100 px-4 py-2">
                <Text className="text-green-800">{language}</Text>
              </View>
            ))}
          </View>
        </Section>

        {/* Interests */}
        <Section title="Interests">
          <View className="-m-1 flex-row flex-wrap">
            {user.interests.map((interest, index) => (
              <View key={index} className="m-1 rounded-full bg-purple-100 px-4 py-2">
                <Text className="text-purple-800">{interest}</Text>
              </View>
            ))}
          </View>
        </Section>

        {/* Work Experience */}
        <Section title="Work Experience" editable section="workExperience">
          {isEditing.workExperience ? (
            <>
              {editedUser.workExperience.map((work, index) => (
                <View key={index} className="mb-3">
                  <EditableField
                    value={work}
                    onChangeText={(text) => {
                      const newWork = [...editedUser.workExperience];
                      newWork[index] = text;
                      handleUserChange({ ...editedUser, workExperience: newWork });
                    }}
                    placeholder="Work Experience"
                  />
                  <TouchableOpacity
                    onPress={() => {
                      const newWork = editedUser.workExperience.filter((_, i) => i !== index);
                      handleUserChange({ ...editedUser, workExperience: newWork });
                    }}
                    className="bg-red-500 p-2 rounded-md mt-2"
                  >
                    <Text className="text-white text-center">Remove</Text>
                  </TouchableOpacity>
                </View>
              ))}
              <TouchableOpacity
                onPress={() => {
                  handleUserChange({
                    ...editedUser,
                    workExperience: [...editedUser.workExperience, '']
                  });
                }}
                className="bg-blue-500 p-2 rounded-md"
              >
                <Text className="text-white text-center">Add Work Experience</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              {user.workExperience.length > 0 && (
                <>
                  {user.workExperience.map((work, index) => (
                    <View key={index} className="mb-3 border-b border-gray-100 pb-3">
                      <Text className="text-gray-800">{work}</Text>
                    </View>
                  ))}
                </>
              )}
            </>
          )}
        </Section>
      </View>

      {/* Save Button */}
      {Object.values(isEditing).some(Boolean) && (
        <View className="px-4 mb-10">
          <TouchableOpacity
            onPress={handleSave}
            className="bg-blue-500 p-4 rounded-xl"
          >
            <Text className="text-white text-center font-bold text-lg">Save Changes</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Bottom Padding */}
      <View className="h-10" />
    </ScrollView>
  );
};

export default MyProfile;
