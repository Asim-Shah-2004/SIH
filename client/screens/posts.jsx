import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Animated,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import tw from 'twrnc';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  Image as ImageIcon,
  Link,
  Send,
  ThumbsUp,
  Award,
  Briefcase,
  Hash,
  TrendingUp
} from 'lucide-react-native';

const SAMPLE_POSTS = [
    {
      id: '1',
      author: {
        name: 'John Doe',
        title: 'Senior Software Engineer at Tech Innovations Inc.',
        avatar: 'https://via.placeholder.com/60',
        isVerified: true
      },
      timestamp: '2h',
      content: {
        text: 'Excited to announce that our team just launched a major feature that will revolutionize how our users interact with the platform! 🚀\n\nProud of everyone\'s hard work and dedication. #TechInnovation #Engineering',
        images: ['https://via.placeholder.com/600/400'],
      },
      metrics: {
        likes: 1234,
        comments: 89,
        shares: 45
      },
      reactions: [
        { type: 'thumbsUp', count: 892 },
        { type: 'celebrate', count: 342 }
      ],
      comments: [
        {
          id: 'c1',
          author: {
            name: 'Jane Smith',
            avatar: 'https://via.placeholder.com/40',
            title: 'Product Manager'
          },
          text: 'Congratulations to the entire team! This is a game-changer! 🎉',
          timestamp: '1h',
          likes: 24
        }
      ],
      isLiked: false,
      isBookmarked: false
    },
    {
      id: '2',
      author: {
        name: 'Sarah Lee',
        title: 'Marketing Strategist at Creative Minds Co.',
        avatar: 'https://via.placeholder.com/60',
        isVerified: true
      },
      timestamp: '5h',
      content: {
        text: 'Just wrapped up an incredible campaign launch! 🎯\n\nHuge thanks to the team for their creativity and energy. #Marketing #Teamwork',
        images: ['https://via.placeholder.com/600/300', 'https://via.placeholder.com/600/301'],
      },
      metrics: {
        likes: 1045,
        comments: 76,
        shares: 29
      },
      reactions: [
        { type: 'thumbsUp', count: 720 },
        { type: 'love', count: 325 }
      ],
      comments: [
        {
          id: 'c2',
          author: {
            name: 'Tom Wilson',
            avatar: 'https://via.placeholder.com/40',
            title: 'Graphic Designer'
          },
          text: 'This campaign looks amazing! Kudos to the team! 🎨👏',
          timestamp: '4h',
          likes: 17
        }
      ],
      isLiked: true,
      isBookmarked: false
    },
    {
      id: '3',
      author: {
        name: 'Emily Davis',
        title: 'CEO at Startup Accelerator',
        avatar: 'https://via.placeholder.com/60',
        isVerified: true
      },
      timestamp: '8h',
      content: {
        text: 'Thrilled to announce our latest investment in an innovative green tech company. 🌱\n\nLooking forward to seeing their impact on sustainability! #Innovation #GreenTech',
        images: []
      },
      metrics: {
        likes: 893,
        comments: 56,
        shares: 32
      },
      reactions: [
        { type: 'celebrate', count: 512 },
        { type: 'love', count: 381 }
      ],
      comments: [
        {
          id: 'c3',
          author: {
            name: 'Rachel Green',
            avatar: 'https://via.placeholder.com/40',
            title: 'Investor Relations Manager'
          },
          text: 'This is such an exciting initiative. Great work! 💡',
          timestamp: '7h',
          likes: 12
        }
      ],
      isLiked: false,
      isBookmarked: true
    },
    {
      id: '4',
      author: {
        name: 'James Carter',
        title: 'AI Researcher at FutureTech Labs',
        avatar: 'https://via.placeholder.com/60',
        isVerified: false
      },
      timestamp: '1d',
      content: {
        text: 'Sharing my latest research paper on generative AI. 📄\n\nWould love to hear your feedback! #AI #MachineLearning',
        images: ['https://via.placeholder.com/600/500']
      },
      metrics: {
        likes: 675,
        comments: 48,
        shares: 23
      },
      reactions: [
        { type: 'lightbulb', count: 452 },
        { type: 'love', count: 223 }
      ],
      comments: [
        {
          id: 'c4',
          author: {
            name: 'Anna Taylor',
            avatar: 'https://via.placeholder.com/40',
            title: 'AI Engineer'
          },
          text: 'Excited to read this! Generative AI is fascinating. 🧠',
          timestamp: '23h',
          likes: 8
        }
      ],
      isLiked: true,
      isBookmarked: false
    },
    {
      id: '5',
      author: {
        name: 'Michael Brown',
        title: 'Freelance Photographer',
        avatar: 'https://via.placeholder.com/60',
        isVerified: false
      },
      timestamp: '3d',
      content: {
        text: 'Captured these breathtaking shots during my recent trip to Iceland. ❄️\n\nNature is truly the greatest artist. #Photography #Travel',
        images: ['https://via.placeholder.com/600/200', 'https://via.placeholder.com/600/201']
      },
      metrics: {
        likes: 2045,
        comments: 112,
        shares: 54
      },
      reactions: [
        { type: 'love', count: 1320 },
        { type: 'celebrate', count: 725 }
      ],
      comments: [
        {
          id: 'c5',
          author: {
            name: 'Chris Evans',
            avatar: 'https://via.placeholder.com/40',
            title: 'Travel Blogger'
          },
          text: 'These pictures are stunning! Makes me want to visit Iceland soon! 🌍📷',
          timestamp: '2d',
          likes: 42
        }
      ],
      isLiked: false,
      isBookmarked: true
    },
    {
      id: '6',
      author: {
        name: 'Laura Kim',
        title: 'Data Scientist at Analytics Pro',
        avatar: 'https://via.placeholder.com/60',
        isVerified: true
      },
      timestamp: '5d',
      content: {
        text: 'Just published my thoughts on the future of AI ethics. 🤖⚖️\n\nWould love to hear your perspective. #DataScience #AIethics',
        images: []
      },
      metrics: {
        likes: 1323,
        comments: 65,
        shares: 37
      },
      reactions: [
        { type: 'lightbulb', count: 812 },
        { type: 'celebrate', count: 511 }
      ],
      comments: [
        {
          id: 'c6',
          author: {
            name: 'Kevin Lee',
            avatar: 'https://via.placeholder.com/40',
            title: 'Ethics Researcher'
          },
          text: 'This is such an important topic. Thanks for sharing your insights! 🙌',
          timestamp: '4d',
          likes: 19
        }
      ],
      isLiked: true,
      isBookmarked: false
    }
  ];
  

const AlumniPostsFeed = () => {
  const [posts, setPosts] = useState(SAMPLE_POSTS);
  const scrollY = useRef(new Animated.Value(0)).current;

  const updatePost = (postId, updates) => {
    setPosts(currentPosts => 
      currentPosts.map(post => 
        post.id === postId 
          ? { ...post, ...updates }
          : post
      )
    );
  };

  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    scrollY.setValue(offsetY);
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={tw`flex-1 bg-gray-100`}
    >
      <ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={tw`pb-4`}
        showsVerticalScrollIndicator={false}
      >
        {/* Create Post Card */}
        <CreatePostCard />
        
        {/* Posts Feed */}
        {posts.map(post => (
          <PostCard 
            key={post.id} 
            post={post} 
            onUpdate={updatePost}
          />
        ))}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const CreatePostCard = () => (
  <View style={tw`bg-white p-4 mb-2 shadow-sm`}>
    <LinearGradient
      colors={['#ffffff', '#f8f9fa']}
      style={tw`rounded-xl p-4`}
    >
      <View style={tw`flex-row items-center mb-4`}>
        <Image
          source={{ uri: 'https://via.placeholder.com/40' }}
          style={tw`w-10 h-10 rounded-full mr-3`}
        />
        <TouchableOpacity 
          style={tw`flex-1 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200`}
        >
          <Text style={tw`text-gray-600`}>Share your thoughts...</Text>
        </TouchableOpacity>
      </View>
      <View style={tw`flex-row justify-around pt-2 border-t border-gray-100`}>
        <PostButton
          icon={<ImageIcon size={20} color="#0077B5" />}
          label="Photo"
        />
        <PostButton
          icon={<Link size={20} color="#0077B5" />}
          label="Link"
        />
        <PostButton
          icon={<Briefcase size={20} color="#0077B5" />}
          label="Job"
        />
      </View>
    </LinearGradient>
  </View>
);

const PostButton = ({ icon, label }) => (
  <TouchableOpacity 
    style={tw`flex-row items-center px-4 py-2 rounded-lg hover:bg-gray-50`}
  >
    {icon}
    <Text style={tw`ml-2 text-gray-700 font-medium`}>{label}</Text>
  </TouchableOpacity>
);

const PostCard = ({ post, onUpdate }) => {
    const [isCommenting, setIsCommenting] = useState(false);
    const [commentText, setCommentText] = useState('');
    const likeAnimation = useRef(new Animated.Value(1)).current;
  
    const handleLike = () => {
      Animated.sequence([
        Animated.spring(likeAnimation, {
          toValue: 1.2,
          useNativeDriver: true,
        }),
        Animated.spring(likeAnimation, {
          toValue: 1,
          useNativeDriver: true,
        })
      ]).start();
      
      onUpdate(post.id, { isLiked: !post.isLiked });
    };
  
    return (
      <View style={tw`bg-white mb-2 shadow-sm`}>
        {/* Post Header */}
        <View style={tw`p-4`}>
          <View style={tw`flex-row items-center justify-between mb-3`}>
            <View style={tw`flex-row items-center flex-1`}>
              <Image
                source={{ uri: post.author.avatar }}
                style={tw`w-12 h-12 rounded-full mr-3`}
              />
              <View style={tw`flex-1`}>
                <View style={tw`flex-row items-center`}>
                  <Text style={tw`font-bold text-gray-900 mr-1`}>
                    {post.author.name}
                  </Text>
                  {post.author.isVerified && (
                    <Award size={16} color="#0077B5" />
                  )}
                </View>
                <Text style={tw`text-gray-600 text-sm`}>{post.author.title}</Text>
                <Text style={tw`text-gray-500 text-xs mt-1`}>{post.timestamp}</Text>
              </View>
            </View>
            {post.trending && (
              <View style={tw`flex-row items-center bg-blue-50 px-2 py-1 rounded-full mr-2`}>
                <TrendingUp size={14} color="#0077B5" />
                <Text style={tw`text-blue-600 text-xs ml-1`}>Trending</Text>
              </View>
            )}
            <TouchableOpacity style={tw`p-2`}>
              <MoreHorizontal size={20} color="#666" />
            </TouchableOpacity>
          </View>
  
          {/* Post Content */}
          <Text style={tw`text-gray-800 leading-6 mb-3 text-base`}>
            {post.content.text}
          </Text>
  
          {/* Tags - Added null check */}
          {post.content.tags && post.content.tags.length > 0 && (
            <View style={tw`flex-row flex-wrap mb-3`}>
              {post.content.tags.map((tag, index) => (
                <TouchableOpacity 
                  key={index}
                  style={tw`flex-row items-center bg-gray-100 rounded-full px-3 py-1 mr-2 mb-2`}
                >
                  <Hash size={14} color="#666" />
                  <Text style={tw`text-gray-700 text-sm ml-1`}>{tag}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
  
          {post.content.images?.map((image, index) => (
            <Image
              key={index}
              source={{ uri: image }}
              style={tw`w-full h-64 rounded-xl mb-3`}
              resizeMode="cover"
            />
          ))}
        </View>
  
        {/* Metrics Bar */}
        <View style={tw`px-4 flex-row items-center justify-between py-2 border-t border-gray-100`}>
          <View style={tw`flex-row items-center`}>
            <View style={tw`flex-row items-center -space-x-2`}>
              {post.reactions?.map((reaction, index) => (
                <View
                  key={index}
                  style={tw`w-6 h-6 rounded-full bg-blue-500 items-center justify-center border-2 border-white`}
                >
                  <ThumbsUp size={12} color="#fff" />
                </View>
              ))}
            </View>
            <Text style={tw`text-gray-600 text-sm ml-2`}>
              {post.metrics.likes.toLocaleString()}
            </Text>
          </View>
          <Text style={tw`text-gray-600 text-sm`}>
            {post.metrics.comments} comments • {post.metrics.shares} shares
          </Text>
        </View>

      {/* Action Buttons */}
      <View style={tw`flex-row justify-around py-1 border-t border-gray-100`}>
        <ActionButton
          icon={
            <Animated.View style={{ transform: [{ scale: likeAnimation }] }}>
              <Heart 
                size={20} 
                color={post.isLiked ? '#0077B5' : '#666'}
                fill={post.isLiked ? '#0077B5' : 'none'}
              />
            </Animated.View>
          }
          label="Like"
          onPress={handleLike}
        />
        
        <ActionButton
          icon={<MessageCircle size={20} color="#666" />}
          label="Comment"
          onPress={() => setIsCommenting(true)}
        />

        <ActionButton
          icon={<Share2 size={20} color="#666" />}
          label="Share"
        />

        {/* <ActionButton
          icon={
            <Bookmark 
              size={20} 
              color={post.isBookmarked ? '#0077B5' : '#666'}
              fill={post.isBookmarked ? '#0077B5' : 'none'}
            />
          }
          label="Save"
        /> */}
      </View>

      {/* Comments Section */}
      {(isCommenting || post.comments.length > 0) && (
        <View style={tw`border-t border-gray-100 pt-4 bg-gray-50`}>
          {post.comments.map(comment => (
            <CommentCard key={comment.id} comment={comment} />
          ))}
          
          {/* Add Comment Input */}
          <View style={tw`p-4 flex-row items-center`}>
            <Image
              source={{ uri: 'https://via.placeholder.com/40' }}
              style={tw`w-8 h-8 rounded-full mr-3`}
            />
            <View style={tw`flex-1 flex-row items-center bg-white rounded-full px-4 border border-gray-200`}>
              <TextInput
                style={tw`flex-1 py-2 text-gray-700`}
                placeholder="Add a comment..."
                value={commentText}
                onChangeText={setCommentText}
              />
              <TouchableOpacity>
                <Send size={20} color="#0077B5" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const ActionButton = ({ icon, label, onPress }) => (
  <TouchableOpacity 
    style={tw`flex-row items-center px-4 py-2 rounded-lg`}
    onPress={onPress}
  >
    {icon}
    <Text style={tw`ml-2 text-gray-600`}>{label}</Text>
  </TouchableOpacity>
);

const CommentCard = ({ comment }) => (
  <View style={tw`px-4 mb-4 flex-row`}>
    <Image
      source={{ uri: comment.author.avatar }}
      style={tw`w-8 h-8 rounded-full mr-3`}
    />
    <View style={tw`flex-1 bg-white rounded-2xl p-3 border border-gray-200`}>
      <View style={tw`flex-row items-center mb-1`}>
        <Text style={tw`font-bold text-gray-900 mr-2`}>
          {comment.author.name}
        </Text>
        <Text style={tw`text-gray-500 text-xs`}>
          {comment.author.title}
        </Text>
      </View>
      <Text style={tw`text-gray-800`}>{comment.text}</Text>
      <View style={tw`flex-row items-center mt-2`}>
        <TouchableOpacity style={tw`mr-4`}>
          <Text style={tw`text-gray-500 text-sm`}>Like • {comment.likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={tw`text-gray-500 text-sm`}>Reply</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

export default AlumniPostsFeed;