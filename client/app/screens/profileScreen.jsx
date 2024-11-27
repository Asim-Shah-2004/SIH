import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView,
  Animated,
  Dimensions
} from 'react-native';
import tw from 'twrnc';
import { LinearGradient } from 'expo-linear-gradient';

const DEFAULT_ALUMNI_DATA = {
  name: "John Doe",
  username: "@johndoe",
  profilePicture: "https://via.placeholder.com/150",
  coverPhoto: "https://via.placeholder.com/800x200",
  bio: "Passionate alumnus | Tech Enthusiast | Career Mentor",
  followers: 1234,
  following: 567,
  posts: 42,
  recentPosts: [
    { id: '1', image: "https://via.placeholder.com/150", likes: 234 },
    { id: '2', image: "https://via.placeholder.com/150", likes: 187 },
    { id: '3', image: "https://via.placeholder.com/150", likes: 342 }
  ],
  workExperience: [{
    company: "Tech Innovations Inc.",
    position: "Senior Software Engineer",
    duration: "2020 - Present",
    logo: "https://via.placeholder.com/50"
  }],
  education: {
    degree: "Computer Science",
    graduationYear: 2019,
    university: "Alumni University",
    logo: "https://via.placeholder.com/50"
  },
  skills: ["React Native", "JavaScript", "Python", "AWS", "UI/UX Design"]
};

const SCREEN_WIDTH = Dimensions.get('window').width;

const AlumniProfilePage = ({ route = {} }) => {
  const { alumni = DEFAULT_ALUMNI_DATA } = route.params || {};
  const [isFollowing, setIsFollowing] = useState(false);
  const scrollY = new Animated.Value(0);

  const profileData = {
    ...DEFAULT_ALUMNI_DATA,
    ...alumni,
    workExperience: alumni?.workExperience || DEFAULT_ALUMNI_DATA.workExperience,
    education: { ...DEFAULT_ALUMNI_DATA.education, ...alumni?.education },
    recentPosts: alumni?.recentPosts || DEFAULT_ALUMNI_DATA.recentPosts,
    skills: alumni?.skills || DEFAULT_ALUMNI_DATA.skills
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <ScrollView>
        {/* Header Section with Linear Gradient */}
        <LinearGradient
          colors={['#4a90e2', '#357abd']}
          style={tw`w-full`}
        >
          {/* Profile Info */}
          <View style={tw`px-4 pt-8 items-center`}>
            <Image 
              source={{ uri: profileData.profilePicture }} 
              style={tw`w-24 h-24 rounded-full border-4 border-white`}
            />
            <Text style={tw`text-xl font-bold mt-3 text-white`}>{profileData.name}</Text>
            <Text style={tw`text-white opacity-80 mb-2`}>{profileData.username}</Text>
            <Text style={tw`text-white text-center mb-4 opacity-90 px-4`}>
              {profileData.bio}
            </Text>

            {/* Stats Row */}
            <View style={tw`flex-row justify-around w-full py-4`}>
              <View style={tw`items-center`}>
                <Text style={tw`text-xl font-bold text-white`}>{profileData.posts}</Text>
                <Text style={tw`text-white opacity-80`}>Posts</Text>
              </View>
              <View style={tw`items-center`}>
                <Text style={tw`text-xl font-bold text-white`}>{profileData.followers}</Text>
                <Text style={tw`text-white opacity-80`}>Followers</Text>
              </View>
              <View style={tw`items-center`}>
                <Text style={tw`text-xl font-bold text-white`}>{profileData.following}</Text>
                <Text style={tw`text-white opacity-80`}>Following</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Main Content */}
        <View style={tw`bg-white px-4 pt-4`}>
          {/* Action Buttons */}
          <View style={tw`flex-row justify-between mb-6`}>
            <TouchableOpacity 
              style={tw`flex-1 mr-2 py-3 rounded-xl ${
                isFollowing ? 'bg-gray-100' : 'bg-blue-500'
              }`}
              onPress={() => setIsFollowing(!isFollowing)}
            >
              <Text style={tw`text-center font-bold ${
                isFollowing ? 'text-gray-700' : 'text-white'
              }`}>
                {isFollowing ? 'Following' : 'Follow'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={tw`flex-1 ml-2 py-3 rounded-xl border border-blue-500`}
            >
              <Text style={tw`text-center text-blue-500 font-bold`}>Message</Text>
            </TouchableOpacity>
          </View>

          {/* Skills Section */}
          <Text style={tw`text-2xl font-bold mb-4`}>Skills</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={tw`mb-6`}
          >
            {profileData.skills.map((skill, index) => (
              <View 
                key={index}
                style={tw`mr-2 px-6 py-3 bg-blue-50 rounded-full`}
              >
                <Text style={tw`text-blue-600 text-base`}>{skill}</Text>
              </View>
            ))}
          </ScrollView>

          {/* Professional Experience */}
          <Text style={tw`text-2xl font-bold mb-4`}>Professional Experience</Text>
          {profileData.workExperience.map((job, index) => (
            <View key={index} style={tw`flex-row items-center mb-6 bg-gray-50 p-4 rounded-xl`}>
              <Image 
                source={{ uri: job.logo }} 
                style={tw`w-16 h-16 rounded-lg mr-4`}
              />
              <View style={tw`flex-1`}>
                <Text style={tw`text-xl font-bold text-gray-800`}>{job.position}</Text>
                <Text style={tw`text-gray-600 text-base`}>{job.company}</Text>
                <Text style={tw`text-gray-500 mt-1`}>{job.duration}</Text>
              </View>
            </View>
          ))}

          {/* Education */}
          <Text style={tw`text-2xl font-bold mb-4`}>Education</Text>
          <View style={tw`flex-row items-center mb-6 bg-gray-50 p-4 rounded-xl`}>
            <Image 
              source={{ uri: profileData.education.logo }} 
              style={tw`w-16 h-16 rounded-lg mr-4`}
            />
            <View style={tw`flex-1`}>
              <Text style={tw`text-xl font-bold text-gray-800`}>{profileData.education.degree}</Text>
              <Text style={tw`text-gray-600 text-base`}>{profileData.education.university}</Text>
              <Text style={tw`text-gray-500 mt-1`}>Graduated: {profileData.education.graduationYear}</Text>
            </View>
          </View>

          {/* Recent Posts */}
          <Text style={tw`text-2xl font-bold mb-4`}>Recent Posts</Text>
          <View style={tw`flex-row flex-wrap justify-between mb-6`}>
            {profileData.recentPosts.map((post) => (
              <View key={post.id} style={tw`w-[${(SCREEN_WIDTH - 48) / 3}px] mb-4`}>
                <Image 
                  source={{ uri: post.image }}
                  style={tw`w-full h-28 rounded-xl`}
                />
                <Text style={tw`text-gray-600 text-sm mt-1`}>{post.likes} likes</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AlumniProfilePage;