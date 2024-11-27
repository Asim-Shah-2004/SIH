import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { LucideChevronRight } from 'lucide-react-native';

const ProfilePage = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://via.placeholder.com/150' }}
          style={styles.profileImage}
        />
        <View style={styles.profileInfo}>
          <Text style={styles.name}>Mayank Kundnani</Text>
          <Text style={styles.title}>CSE AIML 2026</Text>
        </View>
        <LucideChevronRight color="#999" size={24} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Resume</Text>
        <Text style={styles.sectionContent}>ADD</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>4K</Text>
        <Text style={styles.sectionContent}>10</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>100M</Text>
        <Text style={styles.sectionContent}>-</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  profileImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  title: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  sectionContent: {
    fontSize: 18,
    color: '#333',
  },
});

export default ProfilePage;