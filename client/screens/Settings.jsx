import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Switch,
  SafeAreaView,
  Linking,
  Modal,
  Pressable
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';

import { useAuth } from '../providers/AuthProvider';

// Internal Terms of Service Component
const TermsOfServiceScreen = ({ isVisible, onClose }) => {
  return (
    <Modal 
      visible={isVisible} 
      animationType="slide" 
      presentationStyle="formSheet"
    >
      <SafeAreaView style={styles.container}>
        <ScrollView 
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.modalHeader}>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#000" />
            </Pressable>
            <Text style={styles.pageTitle}>Terms of Service</Text>
          </View>
          
          <View style={styles.contentSection}>
            <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
            <Text style={styles.paragraph}>
              By using this Alumni Network platform, you agree to these Terms of Service. Continued use constitutes acceptance of these terms.
            </Text>

            <Text style={styles.sectionTitle}>2. User Eligibility</Text>
            <Text style={styles.paragraph}>
              Platform access is strictly for verified alumni. Users must maintain account accuracy and confidentiality.
            </Text>

            <Text style={styles.sectionTitle}>3. Community Guidelines</Text>
            <Text style={styles.paragraph}>
              Users agree to:
              - Engage in respectful communication
              - Protect personal and others' privacy
              - Avoid discriminatory or offensive content
              - Use platform for professional networking
            </Text>

            <Text style={styles.sectionTitle}>4. Data Usage</Text>
            <Text style={styles.paragraph}>
              User data is used for networking, communication, and platform improvements. Detailed usage outlined in our Privacy Policy.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

// Internal Privacy Policy Component
const PrivacyPolicyScreen = ({ isVisible, onClose }) => {
  return (
    <Modal 
      visible={isVisible} 
      animationType="slide" 
      presentationStyle="formSheet"
    >
      <SafeAreaView style={styles.container}>
        <ScrollView 
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.modalHeader}>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#000" />
            </Pressable>
            <Text style={styles.pageTitle}>Privacy Policy</Text>
          </View>
          
          <View style={styles.contentSection}>
            <Text style={styles.sectionTitle}>1. Information Collection</Text>
            <Text style={styles.paragraph}>
              We collect:
              - Personal contact information
              - Professional background
              - Educational history
              - Communication preferences
            </Text>

            <Text style={styles.sectionTitle}>2. Data Usage</Text>
            <Text style={styles.paragraph}>
              Information is used for:
              - Alumni networking
              - Professional opportunities
              - Platform personalization
              - Communication of relevant updates
            </Text>

            <Text style={styles.sectionTitle}>3. Data Protection</Text>
            <Text style={styles.paragraph}>
              We implement:
              - Encryption technologies
              - Secure access controls
              - Regular security audits
              - Compliance with data protection regulations
            </Text>

            <Text style={styles.sectionTitle}>4. User Rights</Text>
            <Text style={styles.paragraph}>
              Users can:
              - Request data access
              - Correct personal information
              - Opt-out of communications
              - Request data deletion
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

// Internal Help & Support Component
const HelpAndSupportScreen = ({ isVisible, onClose }) => {
  const supportOptions = [
    {
      icon: 'mail-outline',
      title: 'Email Support',
      description: 'alumni.support@institution.edu',
      onPress: () => Linking.openURL('mailto:alumni.support@institution.edu')
    },
    {
      icon: 'call-outline',
      title: 'Phone Support',
      description: '+1 (555) 123-4567',
      onPress: () => Linking.openURL('tel:+15551234567')
    },
    {
      icon: 'chatbubble-ellipses-outline',
      title: 'Live Chat',
      description: 'Available 9 AM - 5 PM EST',
      onPress: () => {/* Future implementation */}
    }
  ];

  return (
    <Modal 
      visible={isVisible} 
      animationType="slide" 
      presentationStyle="formSheet"
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.modalHeader}>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#000" />
          </Pressable>
          <Text style={styles.pageTitle}>Help & Support</Text>
        </View>
        
        <ScrollView 
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.contentSection}>
            {supportOptions.map((option, index) => (
              <View key={option.title}>
                <TouchableOpacity 
                  style={styles.supportItem} 
                  onPress={option.onPress}
                >
                  <View style={styles.supportItemContent}>
                    <Ionicons 
                      name={option.icon} 
                      size={24} 
                      color="#8E8E93" 
                      style={styles.supportIcon}
                    />
                    <View style={styles.supportTextContainer}>
                      <Text style={styles.supportTitle}>{option.title}</Text>
                      <Text style={styles.supportDescription}>
                        {option.description}
                      </Text>
                    </View>
                    <Ionicons 
                      name="chevron-forward" 
                      size={20} 
                      color="rgba(142, 142, 147, 0.5)" 
                    />
                  </View>
                </TouchableOpacity>
                {index < supportOptions.length - 1 && (
                  <View style={styles.softDivider} />
                )}
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

// Main Settings Component
const Settings = ({ navigation }) => {
  const [settings, setSettings] = useState({
    notifications: {
      push: true,
      email: true,
      marketing: false,
    },
    privacy: {
      profileVisibility: false,
      dataSharing: false,
    },
  });

  const [modalStates, setModalStates] = useState({
    termsOfService: false,
    privacyPolicy: false,
    helpSupport: false
  });

  const { setRole, setIsLoggedIn, setToken } = useAuth();

  const handleLogout = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    
    try {
      await AsyncStorage.clear();
      setRole(null);
      setIsLoggedIn(false);
      setToken(null);
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const toggleSetting = (category, setting) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: !prev[category][setting]
      }
    }));
  };

  const toggleModal = (modalName) => {
    setModalStates(prev => ({
      ...prev,
      [modalName]: !prev[modalName]
    }));
  };

  const SettingItem = ({ 
    icon, 
    title, 
    description, 
    onPress, 
    switchValue, 
    isSwitch = false 
  }) => (
    <TouchableOpacity 
      style={styles.settingItem} 
      onPress={isSwitch ? null : onPress}
    >
      <View style={styles.settingContent}>
        <View style={styles.settingLeft}>
          <View style={styles.iconContainer}>
            <Ionicons 
              name={icon} 
              size={22} 
              color="#8E8E93" 
              style={styles.settingIcon}
            />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.settingTitle}>{title}</Text>
            {description && (
              <Text style={styles.settingDescription} numberOfLines={1}>
                {description}
              </Text>
            )}
          </View>
        </View>
        {isSwitch ? (
          <Switch 
            value={switchValue} 
            onValueChange={() => onPress()}
            trackColor={{ 
              false: "rgba(142, 142, 147, 0.16)", 
              true: "rgba(10, 132, 255, 0.3)" 
            }}
            thumbColor={switchValue ? "#0A84FF" : "#8E8E93"}
            ios_backgroundColor="rgba(142, 142, 147, 0.16)"
            style={styles.switchStyle}
          />
        ) : (
          <Ionicons 
            name="chevron-forward" 
            size={20} 
            color="rgba(142, 142, 147, 0.5)" 
          />
        )}
      </View>
    </TouchableOpacity>
  );

  const SettingsSection = ({ title, children }) => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        {/* Account Section */}
        <SettingsSection title="Account">
          <SettingItem 
            icon="person-outline" 
            title="Edit Profile" 
            description="Manage personal information"
            onPress={() => navigation.navigate('EditProfile')}
          />
          <View style={styles.softDivider} />
          <SettingItem 
            icon="lock-closed-outline" 
            title="Security" 
            description="Password and authentication"
            onPress={() => navigation.navigate('Security')}
          />
        </SettingsSection>

        {/* Notifications Section */}
        <SettingsSection title="Notifications">
          <SettingItem 
            icon="notifications-outline"
            title="Push Notifications"
            isSwitch
            switchValue={settings.notifications.push}
            onPress={() => toggleSetting('notifications', 'push')}
          />
          <View style={styles.softDivider} />
          <SettingItem 
            icon="mail-outline"
            title="Email Updates"
            isSwitch
            switchValue={settings.notifications.email}
            onPress={() => toggleSetting('notifications', 'email')}
          />
          <View style={styles.softDivider} />
          <SettingItem 
            icon="megaphone-outline"
            title="Marketing Notifications"
            isSwitch
            switchValue={settings.notifications.marketing}
            onPress={() => toggleSetting('notifications', 'marketing')}
          />
        </SettingsSection>

        {/* Privacy Section */}
        <SettingsSection title="Privacy">
          <SettingItem 
            icon="eye-off-outline"
            title="Profile Visibility"
            isSwitch
            switchValue={settings.privacy.profileVisibility}
            onPress={() => toggleSetting('privacy', 'profileVisibility')}
          />
          <View style={styles.softDivider} />
          <SettingItem 
            icon="shield-checkmark-outline"
            title="Data Sharing"
            isSwitch
            switchValue={settings.privacy.dataSharing}
            onPress={() => toggleSetting('privacy', 'dataSharing')}
          />
        </SettingsSection>

        {/* Legal Section */}
        <SettingsSection title="Support">
          <SettingItem 
            icon="document-text-outline"
            title="Terms of Service"
            description="Review our terms"
            onPress={() => toggleModal('termsOfService')}
          />
          <View style={styles.softDivider} />
          <SettingItem 
            icon="shield-outline"
            title="Privacy Policy"
            description="How we protect your data"
            onPress={() => toggleModal('privacyPolicy')}
          />
          <View style={styles.softDivider} />
          <SettingItem 
            icon="help-circle-outline"
            title="Help & Support"
            description="Get assistance"
            onPress={() => toggleModal('helpSupport')}
          />
        </SettingsSection>

        {/* Logout */}
        <TouchableOpacity 
          style={styles.logoutButton} 
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal Screens */}
      <TermsOfServiceScreen 
        isVisible={modalStates.termsOfService} 
        onClose={() => toggleModal('termsOfService')} 
      />
      <PrivacyPolicyScreen 
        isVisible={modalStates.privacyPolicy} 
        onClose={() => toggleModal('privacyPolicy')} 
      />
      <HelpAndSupportScreen 
        isVisible={modalStates.helpSupport} 
        onClose={() => toggleModal('helpSupport')} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  scrollViewContent: {
    paddingVertical: 10,
  },
  sectionContainer: {
    backgroundColor: 'white',
    marginBottom: 12,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8E8E93',
    paddingHorizontal: 16,
    paddingVertical: 8,
    textTransform: 'uppercase',
  },
  settingItem: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingIcon: {
    opacity: 0.7,
  },
  textContainer: {
    justifyContent: 'center',
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  settingDescription: {
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 4,
  },
  softDivider: {
    height: 1,
    backgroundColor: 'rgba(142, 142, 147, 0.12)',
    marginHorizontal: 16,
  },
  switchStyle: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
  },
  logoutButton: {
    marginHorizontal: 16,
    marginTop: 15,
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '600',
  },
  // Modal-specific styles
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  closeButton: {
    marginRight: 15,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
  },
  contentSection: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  paragraph: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
    marginBottom: 15,
  },
  supportItem: {
    paddingVertical: 15,
    paddingHorizontal: 16,
  },
  supportItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  supportIcon: {
    marginRight: 15,
  },
  supportTextContainer: {
    flex: 1,
  },
  supportTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  supportDescription: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 4,
  },
});

// Prop Types (Optional but recommended)
// Settings.propTypes = {
//   navigation: PropTypes.shape({
//     navigate: PropTypes.func.isRequired,
//   }).isRequired,
// };

export default Settings;