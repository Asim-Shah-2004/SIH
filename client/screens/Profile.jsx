import { SERVER_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {
  Briefcase,
  Github,
  Globe,
  Link2,
  Linkedin,
  Twitter,
  Calendar,
  Mail,
  Phone,
  Settings,
  User,
  Bookmark,
  Share,
  Heart,
  Eye,
  Medal,
  Send,
} from 'lucide-react-native';
import { useState, useEffect } from 'react';
import { Image, Pressable, Text, View, FlatList, Linking } from 'react-native';

import Post from '../components/home/Post';
import Badge from '../components/profile/Badge';
import Card from '../components/profile/Card';
import LinkText from '../components/profile/LinkText';
import ReadMore from '../components/profile/ReadMore';
import StatItem from '../components/profile/StatItem';
import { myPost } from '../constants/posts/myPost';
import { DEFAULT_ALUMNI_DATA } from '../constants/profileData';

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
  const [editingPostId, setEditingPostId] = useState(null);

  const handleEdit = (postId) => {
    setEditingPostId(postId);
    // Add your edit logic here
  };

  const handleDelete = (postId) => {
    // Add your delete logic here
    console.log('Deleting post:', postId);
  };

  const postsToShow = showAllPosts ? myPost : myPost.slice(0, 1);

  const renderItem = ({ item }) => (
    <View className="mb-4 rounded-lg bg-white p-4 shadow-md">
      <Post key={item.userId} postData={item} />
      {editingPostId === item.userId && (
        <Text className="mt-2 text-sm text-gray-600">Edit Mode for Post {item.userId}</Text>
      )}
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
  );

  const ListFooterComponent = () =>
    !showAllPosts && (
      <Pressable onPress={() => setShowAllPosts(true)} className="mt-4 rounded-md bg-gray-200 p-2">
        <Text className="text-center text-blue-500">See All Posts</Text>
      </Pressable>
    );

  return (
    <FlatList
      data={postsToShow}
      renderItem={renderItem}
      keyExtractor={(item) => item.userId.toString()}
      ListFooterComponent={ListFooterComponent}
    />
  );
};

const ProfileScreen = ({ route }) => {
  const [activeSection, setActiveSection] = useState('about');
  const data = { ...DEFAULT_ALUMNI_DATA };

  useEffect(() => {
    const fetchData = async () => {
      const id = route.params._id;
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('Token not found');
      }
      // Fetch user data based on route.params.id
      console.log('Fetching user data for:', route.params._id);
      try {
        const response = await axios.get(`${SERVER_URL}/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('User data:', response.data);
        console.log(response.data.fullName);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, []);

  const renderHeader = () => (
    <>
      {/* Cover Section */}
      <View className="relative h-40">
        <Image
          source={{ uri: data.coverPhoto }}
          className="h-full w-full bg-gray-100"
          style={{ opacity: 0.95 }}
        />
        <View className="absolute right-4 top-6 flex-row space-x-3">
          <Pressable className="rounded-full bg-white/90 p-3 shadow">
            <Share size={20} className="text-text" />
          </Pressable>
          <Pressable className="rounded-full bg-white/90 p-3 shadow">
            <Settings size={20} className="text-text" />
          </Pressable>
        </View>
      </View>

      {/* Profile Info Card */}
      <View className="mx-4 -mt-20 rounded-xl bg-background p-5 shadow-lg">
        <Image
          source={{ uri: data.profilePicture }}
          className="h-28 w-28 rounded-xl border-4 border-background shadow-sm"
        />

        <View className="mt-3 space-y-1">
          <Text className="text-2xl font-bold text-text">{data.name}</Text>
          <Text className="text-text/60 text-base">{data.position}</Text>
          <Text className="text-text/60 text-sm">{`${data.location.city}, ${data.location.country}`}</Text>
        </View>

        <View className="mt-6 flex-row justify-between">
          <StatItem icon={Eye} count={data.stats.followers} label="Followers" />
          <StatItem icon={Heart} count={data.stats.following} label="Following" />
          <StatItem icon={Bookmark} count={data.stats.posts} label="Posts" />
        </View>

        <View className="mt-6 flex-row gap-3">
          <Pressable className="flex-1 flex-row items-center justify-center space-x-2 rounded-lg bg-primary p-3">
            <User size={16} className="text-white" />
            <Text className="text-base font-medium text-white">Connect</Text>
          </Pressable>
          <Pressable className="flex-row items-center justify-center space-x-2 rounded-lg border-2 border-primary p-3">
            <Send size={16} className="text-primary" />
            <Text className="text-base font-medium text-primary">Message</Text>
          </Pressable>
        </View>
      </View>

      {/* Sections */}
      <View className="mt-4 px-4">
        <View className="flex-row flex-wrap gap-2">
          {['About', 'Experience', 'Posts', 'Skills'].map((section) => (
            <Pressable
              key={section}
              onPress={() => setActiveSection(section.toLowerCase())}
              className={`rounded-full px-4 py-2 ${
                activeSection === section.toLowerCase()
                  ? 'bg-primary'
                  : 'border border-gray-200 bg-white'
              }`}>
              <Text
                className={`text-base font-medium ${
                  activeSection === section.toLowerCase() ? 'text-white' : 'text-text/60'
                }`}>
                {section}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </>
  );

  const renderContent = () => (
    <View className="p-4">
      {activeSection === 'about' && (
        <View className="space-y-6">
          <View>
            <Text className="mb-2 text-lg font-semibold text-text">About</Text>
            <ReadMore numberOfLines={3} className="text-text/80 text-base leading-relaxed">
              <LinkText text={data.bio} />
            </ReadMore>
          </View>

          <View className="rounded-xl bg-white p-4 shadow">
            <Text className="mb-4 text-lg font-semibold text-text">Contact Information</Text>
            {[
              { icon: Mail, value: data.email },
              { icon: Phone, value: data.phone },
              { icon: Calendar, value: `Batch of ${data.batch}` },
            ].map((item, i) => (
              <View key={i} className="mb-3 flex-row items-center space-x-3">
                <item.icon size={20} className="text-primary" />
                <LinkText text={item.value} className="text-text/80 text-base" />
              </View>
            ))}
          </View>

          <View className="rounded-xl bg-white p-5 shadow-lg">
            <Text className="mb-4 text-lg font-semibold text-text">Social Links</Text>
            {Object.entries(data.socialLinks).map(([platform, url], i) => (
              <Pressable
                key={i}
                onPress={() => Linking.openURL(url.startsWith('http') ? url : `https://${url}`)}
                className="mb-4 flex-row items-center space-x-4">
                <View className="bg-primary/10 rounded-full p-3">{getSocialIcon(platform)}</View>
                <Text className="flex-1 text-base font-medium text-text">{platform}</Text>
                <Link2 size={16} className="text-primary" />
              </Pressable>
            ))}
          </View>
        </View>
      )}

      {activeSection === 'posts' && (
        <View className="space-y-4">
          <Text className="text-lg font-semibold text-text">Posts</Text>
          <PostsSection myPost={myPost} />
        </View>
      )}

      {activeSection === 'experience' && (
        <View className="space-y-4">
          {data.workExperience.map((work, index) => (
            <Card
              key={index}
              icon={<Briefcase size={18} className="text-primary" />}
              title={work.position}
              subtitle={work.company}
              meta={work.duration}
              description={work.description}
            />
          ))}
        </View>
      )}

      {activeSection === 'skills' && (
        <View className="space-y-6">
          <View>
            <Text className="mb-4 text-lg font-semibold text-text">Skills</Text>
            <View className="flex-row flex-wrap gap-2">
              {data.skills.map((skill, index) => (
                <Badge key={index} className="bg-primary/10">
                  <Text className="text-sm font-medium text-primary">{skill}</Text>
                </Badge>
              ))}
            </View>
          </View>

          <View className="rounded-xl bg-white p-5 shadow-md">
            <Text className="mb-4 text-lg font-semibold text-text">Certifications</Text>
            {data.certifications.map((cert, index) => (
              <View key={index} className="mb-3 flex-row items-center justify-between">
                <View className="flex-row items-center space-x-3">
                  <Medal size={20} className="text-primary" />
                  <Text className="text-base font-medium text-text">{cert.name}</Text>
                </View>
                <Text className="text-text/60 text-sm">{cert.year}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );

  return (
    <FlatList
      className="flex-1 bg-gray-50"
      ListHeaderComponent={() => (
        <>
          {renderHeader()}
          {renderContent()}
        </>
      )}
      data={[]} // Empty data array since we're only using header
      renderItem={() => null}
    />
  );
};

export default ProfileScreen;
