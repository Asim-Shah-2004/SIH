import { View, Text, ScrollView, Image } from 'react-native'
import React, { useContext } from 'react'
import { AuthContext } from '../providers/CustomProvider'
import { Ionicons } from '@expo/vector-icons' // Make sure to install expo/vector-icons

const MyProfile = () => {
  const { user } = useContext(AuthContext)

  const Section = ({ title, children }) => (
    <View className="mb-4 bg-white rounded-xl p-4 shadow-md">
      <Text className="text-xl font-semibold mb-3 text-gray-800">{title}</Text>
      {children}
    </View>
  )

  const InfoItem = ({ icon, text }) => (
    <View className="flex-row items-center mb-2">
      <Ionicons name={icon} size={20} color="#666" className="mr-2" />
      <Text className="text-gray-700 ml-2">{text}</Text>
    </View>
  )

  return (
    <ScrollView className="flex-1 bg-gray-100">
      {/* Cover Photo */}
      <View className="h-40 bg-blue-500" />
      
      {/* Profile Header */}
      <View className="px-4 -mt-20">
        <View className="bg-white rounded-xl p-4 shadow-lg">
          <View className="items-center -mt-24">
            {user.profilePhoto && (
              <Image
                source={{ uri: `${user.profilePhoto}` }}
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg mb-2"
              />
            )}
            <Text className="text-2xl font-bold text-gray-900 mt-2">{user.fullName}</Text>
            <Text className="text-gray-600 text-center px-4 mt-1">{user.bio}</Text>
          </View>

          {/* Quick Info */}
          <View className="flex-row justify-around mt-4 pt-4 border-t border-gray-200">
            <InfoItem icon="mail-outline" text={user.email} />
            <InfoItem icon="call-outline" text={user.phone} />
          </View>
        </View>
      </View>

      {/* Main Content */}
      <View className="px-4 mt-4">
        {/* Education */}
        <Section title="Education">
          {user.education.map((edu, index) => (
            <View key={index} className="mb-3 border-b border-gray-100 pb-3">
              <Text className="font-bold text-gray-800 text-lg">{edu.degree}</Text>
              <Text className="text-gray-600">{edu.institution}</Text>
              <Text className="text-gray-500 text-sm">Class of {edu.yearOfGraduation}</Text>
            </View>
          ))}
        </Section>

        {/* Skills */}
        <Section title="Skills">
          <View className="flex-row flex-wrap -m-1">
            {user.skills.map((skill, index) => (
              <View key={index} className="bg-blue-100 rounded-full px-4 py-2 m-1">
                <Text className="text-blue-800">{skill}</Text>
              </View>
            ))}
          </View>
        </Section>

        {/* Languages */}
        <Section title="Languages">
          <View className="flex-row flex-wrap -m-1">
            {user.languages.map((language, index) => (
              <View key={index} className="bg-green-100 rounded-full px-4 py-2 m-1">
                <Text className="text-green-800">{language}</Text>
              </View>
            ))}
          </View>
        </Section>

        {/* Interests */}
        <Section title="Interests">
          <View className="flex-row flex-wrap -m-1">
            {user.interests.map((interest, index) => (
              <View key={index} className="bg-purple-100 rounded-full px-4 py-2 m-1">
                <Text className="text-purple-800">{interest}</Text>
              </View>
            ))}
          </View>
        </Section>

        {/* Work Experience */}
        {user.workExperience.length > 0 && (
          <Section title="Work Experience">
            {user.workExperience.map((work, index) => (
              <View key={index} className="mb-3 border-b border-gray-100 pb-3">
                <Text className="text-gray-800">{work}</Text>
              </View>
            ))}
          </Section>
        )}
      </View>
      
      {/* Bottom Padding */}
      <View className="h-10" />
    </ScrollView>
  )
}

export default MyProfile