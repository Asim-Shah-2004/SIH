import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import Markdown from 'react-native-markdown-display';

import CommentModal from './CommentModal';

const Post = ({ postData, updateComments }) => {
  const [showComments, setShowComments] = useState(false);

  const handleComments = (show) => {
    setShowComments(!show);
  };

  // Format date to relative time
  const getRelativeTime = (date) => {
    if (!date) return 'unknown';
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
    if (!postData?.reactions) return {};
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
          source={{
            uri:
              postData?.connection_info?.profile_picture ||
              `https://ui-avatars.com/api/?name=User&background=random`,
          }}
          className="h-12 w-12 rounded-full"
        />
        <View className="ml-3 flex-1">
          <Text className="text-base font-semibold text-gray-800">
            {postData?.connection_info?.name || `User ${postData?.post_id?.slice(-4)}`}
          </Text>
          <Text className="text-sm text-gray-500">{getRelativeTime(postData?.createdAt)}</Text>
        </View>
      </View>

      {/* Post Content */}
      {postData?.text && (
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
      )}

      {/* Media Content */}
      {/* {postData?.media?.length > 0 && (
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
      )} */}

      {true && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-3">
          {/* Placeholder Media Items */}
          {[1, 2, 3, 4, 5].map((item, index) => (
            <View key={index} className="mx-4 mb-3">
              {index < 3 ? (
                // Placeholder Images
                <Image
                  source={{
                    uri: `https://via.placeholder.com/300x200?text=Image+${index + 1}`,
                  }}
                  className="h-[100px] w-[150px] rounded-lg"
                />
              ) : (
                // Placeholder Videos
                <View className="flex h-[100px] w-[150px] items-center justify-center rounded-lg bg-gray-300">
                  <Text className="text-white">Video {index - 2}</Text>
                </View>
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

          <Text className="ml-auto text-gray-500" onPress={() => handleComments(showComments)}>
            {postData?.comments?.length || 0} comments • {postData?.shares?.length || 0} shares
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View className="flex-row justify-around border-t border-gray-200 py-2">
        <TouchableOpacity className="flex-row items-center">
          <Feather name="thumbs-up" size={20} color="#6b7280" />
          <Text className="ml-1.5 text-gray-500">Like</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-row items-center" onPress={() => setShowComments(true)}>
          <Feather name="message-circle" size={20} color="#6b7280" />
          <Text className="ml-1.5 text-gray-500">Comment</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-row items-center">
          <Feather name="share-2" size={20} color="#6b7280" />
          <Text className="ml-1.5 text-gray-500">Share</Text>
        </TouchableOpacity>
      </View>

      {/* Comment Modal */}
      <CommentModal
        isVisible={showComments}
        onClose={() => setShowComments(false)}
        postData={postData}
        updateComments={updateComments}
      />
    </LinearGradient>
  );
};

export default Post;
