import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';

import { useAuth } from '../providers/AuthProvider';

const Settings = ({ navigation }) => {
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [privateProfile, setPrivateProfile] = useState(false);
  const { setRole, setIsLoggedIn, setToken } = useAuth();

  const handleLogout = async () => {
    console.log('Logging out...');

    const clearStorage = async () => {
      try {
        await AsyncStorage.clear();
        setRole(null);
        setIsLoggedIn(false);
        setToken(null);
        console.log('AsyncStorage cleared');
      } catch (e) {
        console.error('Failed to clear AsyncStorage', e);
      }
    };

    await clearStorage();
  };

  const SettingItem = ({ icon, title, value, onPress, isSwitch }) => (
    <TouchableOpacity style={styles.settingItem} onPress={isSwitch ? null : onPress}>
      <View style={styles.settingLeft}>
        <Ionicons name={icon} size={24} color="#666" />
        <Text style={styles.settingText}>{title}</Text>
      </View>
      {isSwitch ? (
        <Switch value={value} onValueChange={onPress} />
      ) : (
        <Ionicons name="chevron-forward" size={24} color="#666" />
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profile</Text>
        <SettingItem icon="person-outline" title="Edit Profile" onPress={() => { }} />
        <SettingItem icon="key-outline" title="Change Password" onPress={() => { }} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <SettingItem
          icon="notifications-outline"
          title="Push Notifications"
          value={notifications}
          onPress={() => setNotifications(!notifications)}
          isSwitch
        />
        <SettingItem
          icon="mail-outline"
          title="Email Updates"
          value={emailUpdates}
          onPress={() => setEmailUpdates(!emailUpdates)}
          isSwitch
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Privacy</Text>
        <SettingItem
          icon="lock-closed-outline"
          title="Private Profile"
          value={privateProfile}
          onPress={() => setPrivateProfile(!privateProfile)}
          isSwitch
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>General</Text>
        <SettingItem icon="document-outline" title="Terms of Service" onPress={() => { }} />
        <SettingItem icon="shield-outline" title="Privacy Policy" onPress={() => { }} />
        <SettingItem icon="information-circle-outline" title="About" onPress={() => { }} />
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    backgroundColor: 'white',
    marginVertical: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    marginLeft: 12,
    color: '#333',
  },
  logoutButton: {
    margin: 16,
    backgroundColor: '#ff4444',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Settings;
