import { Ionicons } from '@expo/vector-icons';
import { View, Text, ScrollView, Image, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../providers/AuthProvider';

const MyProfile = () => {
  const { user, updateUser  } = useAuth();
  const [editedUser, setEditedUser] = useState(user);
  const [isEditing, setIsEditing] = useState({
    basic: false,
    education: false,
    skills: false,
    workExperience: false
  });

  const handleSave = async () => {
    try {
      console.log('Updated User Object:', editedUser); // Add this line to see the updated user object
      await updateUser(editedUser);
      setIsEditing({
        basic: false,
        education: false,
        skills: false,
        workExperience: false
      });
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error); // Add error logging
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setEditedUser(prev => ({
        ...prev,
        profilePhoto: result.assets[0].uri
      }));
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
                  onChangeText={(text) => setEditedUser(prev => ({ ...prev, bio: text }))}
                  placeholder="Bio"
                />
                <EditableField
                  value={editedUser.phone}
                  onChangeText={(text) => setEditedUser(prev => ({ ...prev, phone: text }))}
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
                      setEditedUser(prev => ({ ...prev, education: newEducation }));
                    }}
                    placeholder="Degree"
                  />
                  <EditableField
                    value={edu.institution}
                    onChangeText={(text) => {
                      const newEducation = [...editedUser.education];
                      newEducation[index] = { ...edu, institution: text };
                      setEditedUser(prev => ({ ...prev, education: newEducation }));
                    }}
                    placeholder="Institution"
                  />
                  <EditableField
                    value={edu.yearOfGraduation.toString()}
                    onChangeText={(text) => {
                      const newEducation = [...editedUser.education];
                      newEducation[index] = { ...edu, yearOfGraduation: text };
                      setEditedUser(prev => ({ ...prev, education: newEducation }));
                    }}
                    placeholder="Year of Graduation"
                  />
                  <TouchableOpacity
                    onPress={() => {
                      const newEducation = editedUser.education.filter((_, i) => i !== index);
                      setEditedUser(prev => ({ ...prev, education: newEducation }));
                    }}
                    className="bg-red-500 p-2 rounded-md mt-2"
                  >
                    <Text className="text-white text-center">Remove</Text>
                  </TouchableOpacity>
                </View>
              ))}
              <TouchableOpacity
                onPress={() => {
                  setEditedUser(prev => ({
                    ...prev,
                    education: [...prev.education, { degree: '', institution: '', yearOfGraduation: '' }]
                  }));
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
                          setEditedUser(prev => ({ ...prev, skills: newSkills }));
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
                  value=""
                  onChangeText={(text) => {
                    if (text.endsWith(' ')) {
                      setEditedUser(prev => ({
                        ...prev,
                        skills: [...prev.skills, text.trim()]
                      }));
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
                      setEditedUser(prev => ({ ...prev, workExperience: newWork }));
                    }}
                    placeholder="Work Experience"
                  />
                  <TouchableOpacity
                    onPress={() => {
                      const newWork = editedUser.workExperience.filter((_, i) => i !== index);
                      setEditedUser(prev => ({ ...prev, workExperience: newWork }));
                    }}
                    className="bg-red-500 p-2 rounded-md mt-2"
                  >
                    <Text className="text-white text-center">Remove</Text>
                  </TouchableOpacity>
                </View>
              ))}
              <TouchableOpacity
                onPress={() => {
                  setEditedUser(prev => ({
                    ...prev,
                    workExperience: [...prev.workExperience, '']
                  }));
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
