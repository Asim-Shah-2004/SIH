import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Animated,
} from 'react-native';
import Timeline from 'react-native-timeline-flatlist';

const { width, height } = Dimensions.get('window');
const numColumns = 2;

const categories = ['All', 'Technology', 'Business', 'Science', 'Arts'];

const ALUMNI_DATA = [
  {
    id: '1',
    name: 'Jane Doe',
    graduationYear: 2010,
    achievement: 'Global Tech Innovator',
    category: 'Technology',
    image: 'https://randomuser.me/api/portraits/women/68.jpg',
    timeline: [
      {
        year: 2020,
        title: 'Graduated College',
        description: 'Completed B.Tech with honors',
        icon: 'school',
      },
      {
        year: 2022,
        title: 'Started Tech Company',
        description: 'Founded InnovateTech Solutions',
        icon: 'business',
      },
      {
        year: 2024,
        title: 'Global Recognition',
        description: 'Featured in Forbes 30 under 30',
        icon: 'stars',
      },
    ],
  },
  {
    id: '2',
    name: 'John Smith',
    graduationYear: 2012,
    achievement: 'Social Impact Leader',
    category: 'Science',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    timeline: [
      {
        year: 2012,
        title: 'University Graduation',
        description: 'Graduated with Masters in Social Sciences',
        icon: 'school',
      },
      {
        year: 2015,
        title: 'NGO Foundation',
        description: 'Started GlobalChange Initiative',
        icon: 'people',
      },
      {
        year: 2020,
        title: 'UN Recognition',
        description: 'Received UN Social Impact Award',
        icon: 'military-tech',
      },
    ],
  },
  {
    id: '3',
    name: 'Emily Chang',
    graduationYear: 2015,
    achievement: 'Startup Founder',
    category: 'Business',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    timeline: [
      {
        year: 2015,
        title: 'Graduated College',
        description: 'Completed BBA with honors',
        icon: 'school',
      },
      {
        year: 2017,
        title: 'Founded Startup',
        description: 'Started TechSavvy Inc.',
        icon: 'business',
      },
      {
        year: 2021,
        title: 'Series A Funding',
        description: 'Raised $10M in Series A',
        icon: 'attach-money',
      },
    ],
  },
  {
    id: '4',
    name: 'Michael Rodriguez',
    graduationYear: 2008,
    achievement: 'Environmental Sustainability Expert',
    category: 'Science',
    image: 'https://randomuser.me/api/portraits/men/85.jpg',
    timeline: [
      {
        year: 2008,
        title: 'Graduated College',
        description: 'Completed Environmental Science degree',
        icon: 'school',
      },
      {
        year: 2010,
        title: 'Joined Green Earth',
        description: 'Started working at Green Earth Organization',
        icon: 'nature',
      },
      {
        year: 2018,
        title: 'Published Research',
        description: 'Published research on climate change',
        icon: 'book',
      },
    ],
  },
  {
    id: '5',
    name: 'Sarah Kim',
    graduationYear: 2018,
    achievement: 'AI Research Pioneer',
    category: 'Technology',
    image: 'https://randomuser.me/api/portraits/women/79.jpg',
    timeline: [
      {
        year: 2018,
        title: 'Graduated College',
        description: 'Completed Computer Science degree',
        icon: 'school',
      },
      {
        year: 2019,
        title: 'Joined AI Lab',
        description: 'Started working at AI Research Lab',
        icon: 'computer',
      },
      {
        year: 2022,
        title: 'Breakthrough in AI',
        description: 'Developed new AI algorithm',
        icon: 'insights',
      },
    ],
  },
];

const HallOfFame = () => {
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Filter alumni based on search and category
  const filteredAlumni = ALUMNI_DATA.filter(
    (alumni) =>
      (selectedCategory === 'All' || alumni.category === selectedCategory) &&
      (alumni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alumni.achievement.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>Hall of Fame</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Search alumni..."
        placeholderTextColor="#666"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        horizontal
        data={categories}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => setSelectedCategory(item)}
            style={[styles.categoryTab, selectedCategory === item && styles.categoryTabActive]}>
            <Text style={styles.categoryText}>{item}</Text>
          </TouchableOpacity>
        )}
        style={styles.categoriesList}
      />
    </View>
  );

  const Modal = ({ alumni, onClose }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }, []);

    const timelineData =
      alumni.timeline?.map((item) => ({
        time: item.year,
        title: item.title,
        description: item.description,
        icon: (
          <LinearGradient
            colors={['#4A90E2', '#6A5ACD']}
            style={styles.timelineIconGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}>
            <MaterialIcons name={item.icon} size={20} color="#fff" />
          </LinearGradient>
        ),
      })) || [];

    return (
      <Animated.View style={[styles.modalBackground, { opacity: fadeAnim }]}>
        <LinearGradient
          colors={['#1E1E2E', '#2D2D44']}
          style={styles.detailModal}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}>
          <View style={styles.modalHeader}>
            <Image source={{ uri: alumni.image }} style={styles.modalImage} />
            <View style={styles.modalHeaderText}>
              <Text style={styles.modalName}>{alumni.name}</Text>
              <Text style={styles.modalAchievement}>{alumni.achievement}</Text>
            </View>
          </View>

          <View style={styles.timelineContainer}>
            <Timeline
              data={timelineData}
              timeStyle={styles.timelineTime}
              titleStyle={styles.timelineTitle}
              descriptionStyle={styles.timelineDescription}
              columnFormat="single-column-left"
              lineColor="transparent"
              circleColor="transparent"
              listViewContainerStyle={styles.timelineList}
              innerCircle="icon"
              separator={false}
              detailContainerStyle={styles.timelineDetail}
              renderDetail={(rowData, sectionID, rowID) => (
                <Animated.View
                  style={[
                    styles.timelineDetailContainer,
                    {
                      transform: [
                        {
                          translateX: fadeAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [50, 0],
                          }),
                        },
                      ],
                    },
                  ]}>
                  <View style={styles.timelineDetailContent}>
                    <Text style={styles.timelineYear}>{rowData.time}</Text>
                    <Text style={styles.timelineTitle}>{rowData.title}</Text>
                    <Text style={styles.timelineDescription}>{rowData.description}</Text>
                  </View>
                </Animated.View>
              )}
            />
          </View>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <MaterialIcons name="close" size={24} color="#fff" />
          </TouchableOpacity>
        </LinearGradient>
      </Animated.View>
    );
  };

  const renderAlumni = ({ item }) => (
    <TouchableOpacity style={styles.gridCard} onPress={() => setSelectedAlumni(item)}>
      <LinearGradient
        colors={['#2A2D3E', '#1F1F2C']}
        style={styles.cardContent}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}>
        <Image source={{ uri: item.image }} style={styles.gridImage} />
        <Text style={styles.gridName}>{item.name}</Text>
        <Text style={styles.gridYear}>{item.graduationYear}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}

      <FlatList
        data={filteredAlumni}
        renderItem={renderAlumni}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No alumni found</Text>
          </View>
        )}
      />

      {selectedAlumni && <Modal alumni={selectedAlumni} onClose={() => setSelectedAlumni(null)} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090909',
  },
  headerContainer: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#111',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 15,
  },
  searchInput: {
    backgroundColor: '#222',
    borderRadius: 12,
    padding: 12,
    color: '#fff',
    marginBottom: 15,
  },
  categoriesList: {
    marginBottom: 10,
  },
  categoryTab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: '#222',
  },
  categoryTabActive: {
    backgroundColor: '#fff',
  },
  categoryText: {
    color: '#fff',
    fontWeight: '600',
  },
  grid: {
    padding: 10,
  },
  gridCard: {
    flex: 1 / numColumns,
    margin: 8,
    height: 200,
    borderRadius: 15,
    overflow: 'hidden',
  },
  cardContent: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
  },
  gridImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  gridName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  gridYear: {
    color: '#aaa',
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    color: '#666',
    fontSize: 18,
  },
  modalBackground: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailModal: {
    width: width * 0.85,
    height: '80%',
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  modalHeaderText: {
    marginLeft: 15,
    flex: 1,
  },
  modalImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#4A90E2',
  },
  modalName: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  modalAchievement: {
    color: '#aaa',
    fontSize: 16,
  },
  timelineContainer: {
    flex: 1,
    width: '100%',
  },
  timelineIconGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineDetailContainer: {
    marginBottom: 20,
    marginLeft: 20,
  },
  timelineDetailContent: {
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    borderLeftWidth: 4,
    borderLeftColor: '#4A90E2',
    padding: 15,
    borderRadius: 10,
  },
  timelineTime: {
    color: '#4A90E2',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  timelineTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  timelineDescription: {
    color: '#ccc',
    fontSize: 14,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    padding: 10,
  },
});

export default HallOfFame;
