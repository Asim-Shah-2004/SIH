import React, { useState } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Award,
  Briefcase,
  Github,
  Globe,
  GraduationCap,
  Link2,
  Linkedin,
  Twitter,
  Trophy
} from 'lucide-react-native';

import Badge from '../components/profile/Badge';
import Card from '../components/profile/Card';
import LinkText from '../components/profile/LinkText';
import ReadMore from '../components/profile/ReadMore';
import StatItem from '../components/profile/StatItem';
import { DEFAULT_ALUMNI_DATA } from '../constants/profileData';

const SectionTitle = ({ children }) => (
  <Text className="text-base font-bold text-gray-800 mb-2">{children}</Text>
);

const getSocialIcon = (platform) => {
  const iconSize = 20;
  const iconColor = "text-primary";
  switch (platform.toLowerCase()) {
    case 'github':
      return <Github size={iconSize} className={iconColor} />;
    case 'linkedin':
      return <Linkedin size={iconSize} className={iconColor} />;
    case 'twitter':
      return <Twitter size={iconSize} className={iconColor} />;
    case 'portfolio':
      return <Globe size={iconSize} className={iconColor} />;
    default:
      return <Link2 size={iconSize} className={iconColor} />;
  }
};

const ProfileScreen = ({ route = {} }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const data = { ...DEFAULT_ALUMNI_DATA, ...(route.params?.alumni || {}) };

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 16 }}>
      {/* Header Section */}
      <LinearGradient
        colors={['#2C3E8D', '#3498DB']} // Using actual color values
        className="pb-4 bg-gradient-to-r from-primary to-secondary"
      >
        <View className="px-4 pt-6 items-center">
          <Image
            source={{ uri: data.profilePicture }}
            className="w-20 h-20 rounded-full border-2 border-background"
          />
          <Text className="text-lg font-bold mt-2 text-text">{data.name}</Text>
          <ReadMore numberOfLines={3} className="text-text/90 text-sm mb-4">
            <LinkText text={data.bio} className="text-text/90" />
          </ReadMore>

          <View className="flex-row justify-center space-x-6">
            {[
              ['Posts', data.posts],
              ['Followers', data.followers],
              ['Following', data.following]
            ].map(([label, value]) => (
              <StatItem key={label} label={label} value={value} />
            ))}
          </View>
        </View>
      </LinearGradient>

      {/* Main Content */}
      <View className="p-4 space-y-6">
        {/* Action Buttons */}
        <View className="flex-row space-x-2">
          <Pressable
            onPress={() => setIsFollowing(!isFollowing)}
            className={`flex-1 py-2 rounded-lg items-center ${isFollowing ? 'bg-accent' : 'bg-primary'}`}
          >
            <Text className={isFollowing ? 'text-text' : 'text-accent'}>
              {isFollowing ? 'Following' : 'Follow'}
            </Text>
          </Pressable>
          <Pressable className="flex-1 py-2 rounded-lg items-center border border-primary">
            <Text className="text-primary">Message</Text>
          </Pressable>
        </View>

        {/* Basic Info */}
        <View>
          <SectionTitle>Basic Information</SectionTitle>
          <Card
            icon={<GraduationCap size={20} className="text-primary" />}
            title={data.department}
            subtitle={`Batch of ${data.batch}`}
            meta={`Roll Number: ${data.rollNumber}`}
          />
        </View>

        {/* Work Experience */}
        <View>
          <SectionTitle>Work Experience</SectionTitle>
          {data.workExperience.map((work, index) => (
            <Card
              key={index}
              icon={<Briefcase size={20} className="text-primary" />}
              title={work.position}
              subtitle={work.company}
              meta={work.duration}
              description={work.description}
            />
          ))}
        </View>

        {/* Education */}
        <View>
          <SectionTitle>Education</SectionTitle>
          {data.education.map((edu, index) => (
            <Card
              key={index}
              icon={<GraduationCap size={20} className="text-primary" />}
              title={edu.degree}
              subtitle={edu.university}
              meta={`Graduated ${edu.graduationYear} • GPA: ${edu.gpa}`}
            />
          ))}
        </View>

        {/* Skills */}
        <View>
          <SectionTitle>Skills</SectionTitle>
          <View className="flex-row flex-wrap">
            {data.skills.map((skill, index) => (
              <Badge key={index}>{skill}</Badge>
            ))}
          </View>
        </View>

        {/* Achievements */}
        <View>
          <SectionTitle>Achievements</SectionTitle>
          {data.achievements.map((achievement, index) => (
            <Card
              key={index}
              icon={<Trophy size={20} className="text-primary" />}
              title={achievement.title}
              subtitle={achievement.year}
              description={achievement.description}
            />
          ))}
        </View>

        {/* Social Links */}
        <View>
          <SectionTitle>Social Links</SectionTitle>
          {Object.entries(data.socialLinks).map(([platform, url], index) => (
            <Card
              key={index}
              icon={getSocialIcon(platform)}
              title={platform.charAt(0).toUpperCase() + platform.slice(1)}
              subtitle={<LinkText text={url} className="text-gray-600 text-base" />}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;