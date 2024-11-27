import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView 
} from 'react-native';
import tw from 'twrnc';

const DEFAULT_ALUMNI_DATA = {
  name: "John Doe",
  username: "@johndoe",
  profilePicture: "https://via.placeholder.com/150",
  bio: "Passionate alumnus | Tech Enthusiast | Career Mentor",
  followers: 1234,
  following: 567,
  posts: 42,
  recentPosts: [
    { id: '1', image: "https://via.placeholder.com/150" },
    { id: '2', image: "https://via.placeholder.com/150" },
    { id: '3', image: "https://via.placeholder.com/150" }
  ],
  workExperience: [{
    company: "Tech Innovations Inc.",
    position: "Senior Software Engineer",
    duration: "2020 - Present"
  }],
  education: {
    degree: "Computer Science",
    graduationYear: 2019,
    university: "Alumni University"
  }
};

const AlumniProfilePage = ({ route = {} }) => {
  // Safely extract alumni data, using DEFAULT_ALUMNI_DATA as fallback
  const { alumni = DEFAULT_ALUMNI_DATA } = route.params || {};
  const [isFollowing, setIsFollowing] = useState(false);

  // Merge passed alumni data with default data to ensure all fields exist
  const profileData = {
    ...DEFAULT_ALUMNI_DATA,
    ...alumni,
    // Ensure nested objects are also merged
    workExperience: alumni?.workExperience || DEFAULT_ALUMNI_DATA.workExperience,
    education: { 
      ...DEFAULT_ALUMNI_DATA.education, 
      ...alumni?.education 
    },
    recentPosts: alumni?.recentPosts || DEFAULT_ALUMNI_DATA.recentPosts
  };

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <ScrollView>
        {/* Profile Header */}
        <View style={tw`flex-row items-center p-4 border-b border-gray-200`}>
          <Image 
            source={{ uri: profileData.profilePicture }} 
            style={tw`w-24 h-24 rounded-full mr-5`}
          />
          <View style={tw`flex-row flex-1 justify-around`}>
            <View style={tw`items-center`}>
              <Text style={tw`text-lg font-bold`}>{profileData.posts}</Text>
              <Text style={tw`text-xs text-gray-500`}>Posts</Text>
            </View>
            <View style={tw`items-center`}>
              <Text style={tw`text-lg font-bold`}>{profileData.followers}</Text>
              <Text style={tw`text-xs text-gray-500`}>Followers</Text>
            </View>
            <View style={tw`items-center`}>
              <Text style={tw`text-lg font-bold`}>{profileData.following}</Text>
              <Text style={tw`text-xs text-gray-500`}>Following</Text>
            </View>
          </View>
        </View>

        {/* Profile Info */}
        <View style={tw`px-4 mt-3`}>
          <Text style={tw`text-xl font-bold`}>{profileData.name}</Text>
          <Text style={tw`text-gray-500`}>{profileData.username}</Text>
          <Text style={tw`mt-2 text-gray-700`}>{profileData.bio}</Text>
        </View>

        {/* Action Buttons */}
        <View style={tw`flex-row justify-between px-4 mt-4`}>
          <TouchableOpacity 
            style={tw`w-[45%] p-3 rounded-md items-center ${
              isFollowing 
                ? 'bg-gray-200' 
                : 'bg-blue-500'
            }`}
            onPress={handleFollowToggle}
          >
            <Text style={tw`font-bold ${
              isFollowing 
                ? 'text-black' 
                : 'text-white'
            }`}>
              {isFollowing ? 'Following' : 'Follow'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={tw`w-[45%] p-3 rounded-md border border-blue-500 items-center`}
          >
            <Text style={tw`text-blue-500 font-bold`}>Message</Text>
          </TouchableOpacity>
        </View>

        {/* Professional Experience */}
        <View style={tw`p-4 border-t border-gray-200`}>
          <Text style={tw`text-lg font-bold mb-3`}>Professional Experience</Text>
          {profileData.workExperience.map((job, index) => (
            <View key={index} style={tw`mb-3`}>
              <Text style={tw`text-base font-semibold`}>{job.position}</Text>
              <Text style={tw`text-gray-600`}>{job.company}</Text>
              <Text style={tw`text-xs text-gray-500`}>{job.duration}</Text>
            </View>
          ))}

          <Text style={tw`text-lg font-bold mt-4 mb-3`}>Education</Text>
          <View>
            <Text style={tw`text-base font-semibold`}>
              {profileData.education.degree}
            </Text>
            <Text style={tw`text-gray-600`}>
              {profileData.education.university}
            </Text>
            <Text style={tw`text-xs text-gray-500`}>
              Graduated: {profileData.education.graduationYear}
            </Text>
          </View>
        </View>

        {/* Recent Posts */}
        <View style={tw`p-4 border-t border-gray-200`}>
          <Text style={tw`text-lg font-bold mb-3`}>Recent Posts</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={tw`flex-row`}
          >
            {profileData.recentPosts.map((post) => (
              <Image 
                key={post.id}
                source={{ uri: post.image }}
                style={tw`w-24 h-24 rounded-lg mr-3`}
              />
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AlumniProfilePage;