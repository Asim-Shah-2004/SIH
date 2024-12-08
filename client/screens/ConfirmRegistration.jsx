import { MaterialIcons } from '@expo/vector-icons';
import { View, Text, ScrollView, Linking, TouchableOpacity } from 'react-native';

const Section = ({ title, children }) => (
  <View className="mb-6">
    <Text className="mb-3 text-xl font-bold text-gray-800">{title}</Text>
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
          <View className="rounded-xl bg-white p-4 shadow-sm">
            <Text className="text-2xl font-bold text-gray-900">{personal_info.full_name}</Text>
            <Text className="mt-2 text-gray-600">{personal_info.email}</Text>
            <Text className="text-gray-600">{personal_info.phone}</Text>
            <View className="mt-3 flex-row space-x-4">
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
            <View key={index} className="mb-3 rounded-xl bg-white p-4 shadow-sm">
              <Text className="text-lg font-semibold">{edu.institution}</Text>
              <Text className="text-gray-700">
                {edu.degree} • {edu.major}
              </Text>
              <Text className="text-gray-600">{edu.graduation_year}</Text>
              {edu.honors && <Text className="mt-1 text-gray-600">{edu.honors}</Text>}
            </View>
          ))}
        </Section>

        {/* Experience */}
        <Section title="Experience">
          {experience.map((exp, index) => (
            <View key={index} className="mb-3 rounded-xl bg-white p-4 shadow-sm">
              <Text className="text-lg font-semibold">{exp.company}</Text>
              <Text className="text-gray-700">{exp.position}</Text>
              <Text className="text-gray-600">
                {exp.start_date} - {exp.end_date || 'Present'}
              </Text>
              <View className="mt-2">
                {exp.responsibilities.map((resp, idx) => (
                  <View key={idx} className="mt-1 flex-row items-start">
                    <Text className="flex-1 text-gray-600">{resp}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </Section>

        {/* Projects */}
        <Section title="Projects">
          {projects.map((project, index) => (
            <View key={index} className="mb-3 rounded-xl bg-white p-4 shadow-sm">
              <Text className="text-lg font-semibold">{project.name}</Text>
              <Text className="mt-1 text-gray-600">{project.description}</Text>
              <View className="mt-2 flex-row flex-wrap">
                {project.technologies.map((tech, idx) => (
                  <Text
                    key={idx}
                    className="mb-2 mr-2 rounded-full bg-gray-100 px-2 py-1 text-gray-600">
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
            <View key={index} className="mb-3 rounded-xl bg-white p-4 shadow-sm">
              <Text className="text-lg font-semibold">{achievement.title}</Text>
              <Text className="mt-1 text-gray-600">{achievement.description}</Text>
              {achievement.date && <Text className="mt-1 text-gray-500">{achievement.date}</Text>}
            </View>
          ))}
        </Section>
      </View>
    </ScrollView>
  );
};

export default ConfirmRegistration;
