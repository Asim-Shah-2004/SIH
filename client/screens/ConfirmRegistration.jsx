import { View, Text, ScrollView, Linking, TouchableOpacity } from 'react-native';
import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';

const Section = ({ title, children }) => (
  <View className="mb-6">
    <Text className="text-xl font-bold text-gray-800 mb-3">{title}</Text>
    {children}
  </View>
);

const ConfirmRegistration = ({ route }) => {
  const { resumeData } = route.params;
  console.log('Resume data:', resumeData);
  const { personal_info, education, experience, projects, achievements } = resumeData;

  const handleLink = (url) => {
    Linking.openURL(url);
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-6">
        {/* Personal Info */}
        <Section title="Personal Information">
          <View className="bg-white rounded-xl p-4 shadow-sm">
            <Text className="text-2xl font-bold text-gray-900">{personal_info.full_name}</Text>
            <Text className="text-gray-600 mt-2">{personal_info.email}</Text>
            <Text className="text-gray-600">{personal_info.phone}</Text>
            <View className="flex-row mt-3 space-x-4">
              {personal_info.linkedin && (
                <TouchableOpacity onPress={() => handleLink(personal_info.linkedin)}>
                  <Text className="text-blue-500">LinkedIn</Text>
                </TouchableOpacity>
              )}
              {personal_info.github && (
                <TouchableOpacity onPress={() => handleLink(personal_info.github)}>
                  <Text className="text-blue-500">GitHub</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </Section>

        {/* Education */}
        <Section title="Education">
          {education.map((edu, index) => (
            <View key={index} className="bg-white rounded-xl p-4 mb-3 shadow-sm">
              <Text className="text-lg font-semibold">{edu.institution}</Text>
              <Text className="text-gray-700">{edu.degree} • {edu.major}</Text>
              <Text className="text-gray-600">{edu.graduation_year}</Text>
              {edu.honors && <Text className="text-gray-600 mt-1">{edu.honors}</Text>}
            </View>
          ))}
        </Section>

        {/* Experience */}
        <Section title="Experience">
          {experience.map((exp, index) => (
            <View key={index} className="bg-white rounded-xl p-4 mb-3 shadow-sm">
              <Text className="text-lg font-semibold">{exp.company}</Text>
              <Text className="text-gray-700">{exp.position}</Text>
              <Text className="text-gray-600">{exp.start_date} - {exp.end_date || 'Present'}</Text>
              <View className="mt-2">
                {exp.responsibilities.map((resp, idx) => (
                  <View key={idx} className="flex-row items-start mt-1">
                    <Text className="text-gray-600 flex-1">{resp}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </Section>

        {/* Projects */}
        <Section title="Projects">
          {projects.map((project, index) => (
            <View key={index} className="bg-white rounded-xl p-4 mb-3 shadow-sm">
              <Text className="text-lg font-semibold">{project.name}</Text>
              <Text className="text-gray-600 mt-1">{project.description}</Text>
              <View className="flex-row flex-wrap mt-2">
                {project.technologies.map((tech, idx) => (
                  <Text key={idx} className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full mr-2 mb-2">
                    {tech}
                  </Text>
                ))}
              </View>
            </View>
          ))}
        </Section>

        {/* Achievements */}
        <Section title="Achievements">
          {achievements.map((achievement, index) => (
            <View key={index} className="bg-white rounded-xl p-4 mb-3 shadow-sm">
              <Text className="text-lg font-semibold">{achievement.title}</Text>
              <Text className="text-gray-600 mt-1">{achievement.description}</Text>
              {achievement.date && (
                <Text className="text-gray-500 mt-1">{achievement.date}</Text>
              )}
            </View>
          ))}
        </Section>
      </View>
    </ScrollView>
  );
};

export default ConfirmRegistration;