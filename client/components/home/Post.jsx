import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import Markdown from 'react-native-markdown-display';

const Post = ({ postData }) => {
  const [showAllComments, setShowAllComments] = useState(false);

  // Format date to relative time
  const getRelativeTime = (date) => {
    const now = new Date();
    const posted = new Date(date);
    const diff = Math.floor((now - posted) / 1000); // seconds

    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return posted.toLocaleDateString();
  };

  // Get reaction counts
  const getReactionCounts = () => {
    const counts = {};
    postData.reactions.forEach((reaction) => {
      counts[reaction.type] = (counts[reaction.type] || 0) + 1;
    });
    return counts;
  };

  const reactionIcons = {
    like: <Feather name="thumbs-up" size={16} color="#0a66c2" />,
    love: <Feather name="heart" size={16} color="#e11d48" />,
    wow: <Feather name="star" size={16} color="#eab308" />,
  };

  return (
    <LinearGradient
      colors={['#ffffff', '#f8fafc']}
      className="my-2 overflow-hidden rounded-xl shadow-sm">
      {/* Post Header */}
      <View className="flex-row items-center p-4">
        <Image
          source={{ uri: `https://ui-avatars.com/api/?name=User&background=random` }}
          className="h-12 w-12 rounded-full"
        />
        <View className="ml-3 flex-1">
          <Text className="text-base font-semibold text-gray-800">
            User {postData.userId.slice(-4)}
          </Text>
          <Text className="text-sm text-gray-500">{getRelativeTime(postData.createdAt)}</Text>
        </View>
      </View>

      {/* Post Content */}
      <View className="mt-3 px-4">
        <Markdown
          style={{
            body: { fontSize: 15, lineHeight: 22, color: '#374151' },
            heading1: { fontSize: 24, fontWeight: 'bold', marginVertical: 12 },
            heading2: { fontSize: 20, fontWeight: 'bold', marginVertical: 10 },
            link: { color: '#0a66c2' },
            list: { marginLeft: 20 },
          }}>
          {postData.text}
        </Markdown>
      </View>

      {/* Media Content */}
      {postData.media && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-3">
          {postData.media.map((item, index) => (
            <View key={index} className="mx-4 mb-3">
              {item.type === 'image' && (
                <Image source={{ uri: item.url }} className="h-[200px] w-[300px] rounded-lg" />
              )}
              {item.description && (
                <Text className="mt-1 text-xs text-gray-500">{item.description}</Text>
              )}
            </View>
          ))}
        </ScrollView>
      )}

      {/* Reactions & Stats */}
      <View className="border-t border-gray-200 p-4">
        <View className="flex-row items-center">
          <View className="flex-row items-center">
            {Object.entries(getReactionCounts()).map(([type, count], index) => (
              <View key={type} className="mr-2 flex-row items-center">
                {reactionIcons[type]}
                <Text className="ml-1 text-gray-500">{count}</Text>
              </View>
            ))}
          </View>
          <Text className="ml-auto text-gray-500">
            {postData.comments.length} comments • {postData.shares.length} shares
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View className="flex-row justify-around border-t border-gray-200 py-2">
        <TouchableOpacity className="flex-row items-center">
          <Feather name="thumbs-up" size={20} color="#6b7280" />
          <Text className="ml-1.5 text-gray-500">Like</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-row items-center">
          <Feather name="message-circle" size={20} color="#6b7280" />
          <Text className="ml-1.5 text-gray-500">Comment</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-row items-center">
          <Feather name="share-2" size={20} color="#6b7280" />
          <Text className="ml-1.5 text-gray-500">Share</Text>
        </TouchableOpacity>
      </View>

      {/* Comments Section */}
      {postData.comments.length > 0 && (
        <View className="bg-gray-50 p-4">
          <FlatList
            data={showAllComments ? postData.comments : postData.comments.slice(0, 2)}
            renderItem={({ item }) => (
              <View className="mb-3">
                <View className="flex-row items-center">
                  <Image
                    source={{ uri: `https://ui-avatars.com/api/?name=User&background=random` }}
                    className="h-8 w-8 rounded-full"
                  />
                  <View className="ml-2 flex-1">
                    <Text className="font-medium">User {item.userId.slice(-4)}</Text>
                    <Text>{item.text}</Text>
                    <View className="mt-1 flex-row">
                      <Text className="text-xs text-gray-500">
                        {getRelativeTime(item.createdAt)} • {item.likes.length} likes
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            )}
          />
          {postData.comments.length > 2 && (
            <TouchableOpacity onPress={() => setShowAllComments(!showAllComments)}>
              <Text className="font-medium text-blue-600">
                {showAllComments ? 'Show less' : `View all ${postData.comments.length} comments`}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </LinearGradient>
  );
};

export default Post;
