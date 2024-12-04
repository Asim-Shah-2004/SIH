import { LinearGradient } from 'expo-linear-gradient';
import {
  ThumbsUpIcon,
  MessageCircleIcon,
  ShareIcon,
  HeartIcon,
  StarIcon,
} from 'lucide-react-native';
import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, FlatList } from 'react-native';

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
    like: <ThumbsUpIcon size={16} color="#0a66c2" />,
    love: <HeartIcon size={16} color="#e11d48" />,
    wow: <StarIcon size={16} color="#eab308" />,
  };

  return (
    <LinearGradient
      colors={['#ffffff', '#f8fafc']}
      style={{
        marginVertical: 8,
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
      }}>
      {/* Post Header */}
      <View style={{ padding: 16, flexDirection: 'row', alignItems: 'center' }}>
        <Image
          source={{ uri: `https://ui-avatars.com/api/?name=User&background=random` }}
          style={{ width: 48, height: 48, borderRadius: 24 }}
        />
        <View style={{ marginLeft: 12, flex: 1 }}>
          <Text style={{ fontWeight: '600', fontSize: 16, color: '#1f2937' }}>
            User {postData.userId.slice(-4)}
          </Text>
          <Text style={{ fontSize: 13, color: '#6b7280' }}>
            {getRelativeTime(postData.createdAt)}
          </Text>
        </View>
      </View>

      {/* Post Content */}
      <View style={{ paddingHorizontal: 16 }}>
        <Text style={{ fontSize: 15, lineHeight: 22, color: '#374151' }}>{postData.text}</Text>
      </View>

      {/* Media Content */}
      {postData.media && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 12 }}>
          {postData.media.map((item, index) => (
            <View key={index} style={{ marginHorizontal: 16, marginBottom: 12 }}>
              {item.type === 'image' && (
                <Image
                  source={{ uri: item.url }}
                  style={{
                    width: 300,
                    height: 200,
                    borderRadius: 8,
                  }}
                />
              )}
              {item.description && (
                <Text style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>
                  {item.description}
                </Text>
              )}
            </View>
          ))}
        </ScrollView>
      )}

      {/* Reactions & Stats */}
      <View style={{ padding: 16, borderTopWidth: 1, borderTopColor: '#e5e7eb' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {Object.entries(getReactionCounts()).map(([type, count], index) => (
              <View
                key={type}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginRight: 8,
                }}>
                {reactionIcons[type]}
                <Text style={{ marginLeft: 4, color: '#6b7280' }}>{count}</Text>
              </View>
            ))}
          </View>
          <Text style={{ marginLeft: 'auto', color: '#6b7280' }}>
            {postData.comments.length} comments • {postData.shares.length} shares
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          paddingVertical: 8,
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
        }}>
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}>
          <ThumbsUpIcon size={20} color="#6b7280" />
          <Text style={{ marginLeft: 6, color: '#6b7280' }}>Like</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}>
          <MessageCircleIcon size={20} color="#6b7280" />
          <Text style={{ marginLeft: 6, color: '#6b7280' }}>Comment</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}>
          <ShareIcon size={20} color="#6b7280" />
          <Text style={{ marginLeft: 6, color: '#6b7280' }}>Share</Text>
        </TouchableOpacity>
      </View>

      {/* Comments Section */}
      {postData.comments.length > 0 && (
        <View style={{ padding: 16, backgroundColor: '#f8fafc' }}>
          <FlatList
            data={showAllComments ? postData.comments : postData.comments.slice(0, 2)}
            renderItem={({ item }) => (
              <View style={{ marginBottom: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Image
                    source={{ uri: `https://ui-avatars.com/api/?name=User&background=random` }}
                    style={{ width: 32, height: 32, borderRadius: 16 }}
                  />
                  <View style={{ marginLeft: 8, flex: 1 }}>
                    <Text style={{ fontWeight: '500' }}>User {item.userId.slice(-4)}</Text>
                    <Text>{item.text}</Text>
                    <View style={{ flexDirection: 'row', marginTop: 4 }}>
                      <Text style={{ color: '#6b7280', fontSize: 12 }}>
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
              <Text style={{ color: '#0a66c2', fontWeight: '500' }}>
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
