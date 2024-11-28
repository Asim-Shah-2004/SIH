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
  StyleSheet
} from 'react-native';
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
      name: 'Alice Brown',
      title: 'UI/UX Designer at Creative Labs',
      avatar: 'https://via.placeholder.com/60',
      isVerified: true
    },
    timestamp: '5h',
    content: {
      text: 'Just wrapped up a new redesign for our mobile app! The new look is sleek, intuitive, and user-friendly. Can\'t wait for everyone to try it out. 🙌 #UXDesign #MobileApp',
      images: ['https://via.placeholder.com/600/401'],
    },
    metrics: {
      likes: 758,
      comments: 52,
      shares: 22
    },
    reactions: [
      { type: 'heart', count: 532 },
      { type: 'thumbsUp', count: 130 }
    ],
    comments: [
      {
        id: 'c2',
        author: {
          name: 'George White',
          avatar: 'https://via.placeholder.com/40',
          title: 'Senior Developer'
        },
        text: 'The redesign looks amazing! Great job, Alice! 👏',
        timestamp: '4h',
        likes: 18
      }
    ],
    isLiked: true,
    isBookmarked: false
  },
  {
    id: '3',
    author: {
      name: 'Bob Miller',
      title: 'Chief Technology Officer at InnovateX',
      avatar: 'https://via.placeholder.com/60',
      isVerified: true
    },
    timestamp: '1d',
    content: {
      text: 'Looking forward to attending the Global Tech Conference this year! I\'ll be speaking on AI innovations and their impact on industries. Let\'s connect! 🤖 #TechConference #AIRevolution',
      images: ['https://via.placeholder.com/600/402'],
    },
    metrics: {
      likes: 342,
      comments: 12,
      shares: 8
    },
    reactions: [
      { type: 'thumbsUp', count: 215 },
      { type: 'star', count: 127 }
    ],
    comments: [
      {
        id: 'c3',
        author: {
          name: 'Lisa Johnson',
          avatar: 'https://via.placeholder.com/40',
          title: 'AI Specialist'
        },
        text: 'I\'m excited to see your talk, Bob! AI is such an exciting field right now! 🌟',
        timestamp: '1d',
        likes: 10
      }
    ],
    isLiked: true,
    isBookmarked: true
  },
  {
    id: '4',
    author: {
      name: 'Sarah Lee',
      title: 'Data Scientist at DataVision',
      avatar: 'https://via.placeholder.com/60',
      isVerified: true
    },
    timestamp: '2d',
    content: {
      text: 'Just finished a fascinating data analysis project on predicting customer behavior patterns. The results are promising and could lead to big insights for the business! 📊 #DataScience #MachineLearning',
      images: ['https://via.placeholder.com/600/403'],
    },
    metrics: {
      likes: 890,
      comments: 60,
      shares: 37
    },
    reactions: [
      { type: 'thumbsUp', count: 611 },
      { type: 'celebrate', count: 220 }
    ],
    comments: [
      {
        id: 'c4',
        author: {
          name: 'Matthew Clark',
          avatar: 'https://via.placeholder.com/40',
          title: 'Business Analyst'
        },
        text: 'This sounds amazing, Sarah! Would love to see the findings sometime. 👀',
        timestamp: '2d',
        likes: 14
      }
    ],
    isLiked: false,
    isBookmarked: true
  },
  {
    id: '5',
    author: {
      name: 'David King',
      title: 'Marketing Strategist at NextGen Solutions',
      avatar: 'https://via.placeholder.com/60',
      isVerified: false
    },
    timestamp: '3d',
    content: {
      text: 'Happy to share the new marketing campaign I\'ve been working on! It\'s all about customer engagement and innovative advertising techniques. Stay tuned! 📈 #MarketingCampaign #CustomerEngagement',
      images: ['https://via.placeholder.com/600/404'],
    },
    metrics: {
      likes: 1123,
      comments: 78,
      shares: 54
    },
    reactions: [
      { type: 'thumbsUp', count: 1002 },
      { type: 'heart', count: 121 }
    ],
    comments: [
      {
        id: 'c5',
        author: {
          name: 'Emily Turner',
          avatar: 'https://via.placeholder.com/40',
          title: 'Social Media Manager'
        },
        text: 'Looking forward to seeing this campaign in action! 💥',
        timestamp: '2d',
        likes: 29
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
      style={styles.container}
    >
      <ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollViewContent}
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
  <View style={styles.createPostCard}>
    <LinearGradient
      colors={['#ffffff', '#f8f9fa']}
      style={styles.createPostCardGradient}
    >
      <View style={styles.createPostCardHeader}>
        <Image
          source={{ uri: 'https://via.placeholder.com/40' }}
          style={styles.avatar}
        />
        <TouchableOpacity
          style={styles.createPostInput}
        >
          <Text style={styles.createPostText}>Share your thoughts...</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.createPostButtons}>
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
    style={styles.postButton}
  >
    {icon}
    <Text style={styles.postButtonText}>{label}</Text>
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
    <View style={styles.postCard}>
      {/* Post Header */}
      <View style={styles.postHeader}>
        <View style={styles.postHeaderRow}>
          <Image
            source={{ uri: post.author.avatar }}
            style={styles.avatar}
          />
          <View style={styles.postHeaderText}>
            <View style={styles.postHeaderNameRow}>
              <Text style={styles.authorName}>{post.author.name}</Text>
              {post.author.isVerified && (
                <Award size={16} color="#0077B5" />
              )}
            </View>
            <Text style={styles.authorTitle}>{post.author.title}</Text>
            <Text style={styles.timestamp}>{post.timestamp}</Text>
          </View>
        </View>
        {post.trending && (
          <View style={styles.trendingBadge}>
            <TrendingUp size={16} color="#0077B5" />
            <Text style={styles.trendingText}>Trending</Text>
          </View>
        )}
      </View>
      <Text style={styles.postContent}>{post.content.text}</Text>
      {post.content.images.length > 0 && (
        <Image
          source={{ uri: post.content.images[0] }}
          style={styles.postImage}
        />
      )}
      <View style={styles.postActions}>
        {/* Like, Comment, Share buttons */}
        <TouchableOpacity
          onPress={handleLike}
          style={styles.actionButton}
        >
          <ThumbsUp size={18} color={post.isLiked ? '#0077B5' : '#888'} />
          <Text style={styles.actionButtonText}>{post.metrics.likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
        >
          <MessageCircle size={18} color="#888" />
          <Text style={styles.actionButtonText}>{post.metrics.comments}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
        >
          <Share2 size={18} color="#888" />
          <Text style={styles.actionButtonText}>{post.metrics.shares}</Text>
        </TouchableOpacity>
      </View>
      {/* Comments Section */}
      <View style={styles.commentSection}>
        {post.comments.map(comment => (
          <View key={comment.id} style={styles.comment}>
            <Image
              source={{ uri: comment.author.avatar }}
              style={styles.commentAvatar}
            />
            <View style={styles.commentText}>
              <Text style={styles.commentAuthor}>{comment.author.name}</Text>
              <Text style={styles.commentContent}>{comment.text}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollViewContent: {
    paddingBottom: 4,
  },
  createPostCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 3,
    borderRadius: 8,
  },
  createPostCardGradient: {
    borderRadius: 12,
    padding: 16,
  },
  createPostCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 16,
  },
  createPostInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  createPostText: {
    color: '#888',
  },
  createPostButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  postButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postButtonText: {
    marginLeft: 8,
    color: '#0077B5',
    fontSize: 14,
  },
  postCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 3,
    borderRadius: 8,
  },
  postHeader: {
    marginBottom: 8,
  },
  postHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postHeaderText: {
    marginLeft: 12,
  },
  postHeaderNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  authorTitle: {
    fontSize: 14,
    color: '#888',
  },
  timestamp: {
    fontSize: 12,
    color: '#888',
  },
  trendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  trendingText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#0077B5',
  },
  postContent: {
    fontSize: 16,
    marginBottom: 8,
    lineHeight: 24,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButtonText: {
    marginLeft: 4,
    color: '#888',
  },
  commentSection: {
    marginTop: 8,
  },
  comment: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  commentText: {
    marginLeft: 8,
  },
  commentAuthor: {
    fontWeight: 'bold',
  },
  commentContent: {
    marginTop: 4,
    fontSize: 14,
    color: '#555',
  },
});

export default AlumniPostsFeed;
