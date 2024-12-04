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
  Trophy,
  MessageCircle,
} from 'lucide-react-native';
import React, { useState } from 'react';
import { Image, Pressable, ScrollView, Text, View, FlatList } from 'react-native';

import Post from '../components/home/Post';
import Badge from '../components/profile/Badge';
import Card from '../components/profile/Card';
import LinkText from '../components/profile/LinkText';
import ReadMore from '../components/profile/ReadMore';
import StatItem from '../components/profile/StatItem';
import { myPost } from '../constants/posts/myPost';
import { DEFAULT_ALUMNI_DATA } from '../constants/profileData';

const SectionTitle = ({ children }) => (
  <Text className="mb-2 text-base font-bold text-gray-800">{children}</Text>
);

const getSocialIcon = (platform) => {
  const iconSize = 20;
  const iconColor = 'text-primary';
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

const PostsSection = ({ myPost }) => {
  const [showAllPosts, setShowAllPosts] = useState(false);
  const [editingPostId, setEditingPostId] = useState(null); // to track which post is being edited

  const handleEdit = (postId) => {
    setEditingPostId(postId);
    // You can handle editing logic here (open modal, navigate to edit screen, etc.)
  };

  const handleDelete = (postId) => {
    // Handle delete logic here
    console.log(`Deleting post with id ${postId}`);
  };

  // Limit the number of posts shown initially
  const postsToShow = showAllPosts ? myPost : myPost.slice(0, 1); // Show first post initially, all if 'See All' clicked

  return (
    <View className="space-y-4">
      <FlatList
        data={postsToShow}
        renderItem={({ item }) => (
          <View className="mb-4 rounded-lg bg-white p-4 shadow-md">
            <Post key={item.userId} postData={item} />
            {editingPostId === item.userId && (
              <Text className="mt-2 text-sm text-gray-600">Edit Mode for Post {item.userId}</Text>
            )}

            {/* Edit and Delete buttons */}
            <View className="mt-4 flex-row items-center justify-between">
              <Pressable
                onPress={() => handleEdit(item.userId)}
                className="mr-2 flex-1 rounded-md bg-blue-500 py-2">
                <Text className="text-center text-white">Edit</Text>
              </Pressable>
              <Pressable
                onPress={() => handleDelete(item.userId)}
                className="ml-2 flex-1 rounded-md bg-red-500 py-2">
                <Text className="text-center text-white">Delete</Text>
              </Pressable>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.userId.toString()}
      />

      {/* Show "See All Posts" button if not showing all posts */}
      {!showAllPosts && (
        <Pressable
          onPress={() => setShowAllPosts(true)}
          className="mt-4 rounded-md bg-gray-200 p-2">
          <Text className="text-center text-blue-500">See All Posts</Text>
        </Pressable>
      )}
    </View>
  );
};

const ProfileScreen = ({ route = {} }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const data = { ...DEFAULT_ALUMNI_DATA, ...(route.params?.alumni || {}) };

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 16 }}>
      {/* Header Section */}
      <LinearGradient
        colors={['#2C3E8D', '#3498DB']} // Using actual color values
        className="bg-gradient-to-r from-primary to-secondary pb-4">
        <View className="items-center px-4 pt-6">
          <Image
            source={{ uri: data.profilePicture }}
            className="h-20 w-20 rounded-full border-2 border-background"
          />
          <Text className="mt-2 text-lg font-bold text-text">{data.name}</Text>
          <ReadMore numberOfLines={3} className="mb-4 text-sm text-text/90">
            <LinkText text={data.bio} className="text-text/90" />
          </ReadMore>

          <View className="flex-row justify-center space-x-6">
            {[
              ['Posts', data.posts],
              ['Followers', data.followers],
              ['Following', data.following],
            ].map(([label, value]) => (
              <StatItem key={label} label={label} value={value} />
            ))}
          </View>
        </View>
      </LinearGradient>

      {/* Main Content */}
      <View className="space-y-6 p-4">
        {/* Action Buttons */}
        <View className="flex-row space-x-2">
          <Pressable
            onPress={() => setIsFollowing(!isFollowing)}
            className={`flex-1 items-center rounded-lg py-2 ${isFollowing ? 'bg-accent' : 'bg-primary'}`}>
            <Text className={isFollowing ? 'text-text' : 'text-accent'}>
              {isFollowing ? 'Following' : 'Follow'}
            </Text>
          </Pressable>
          <Pressable className="flex-1 items-center rounded-lg border border-primary py-2">
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

        <PostsSection myPost={myPost} />

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
              subtitle={<LinkText text={url} className="text-base text-gray-600" />}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;
