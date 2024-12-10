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
  Pressable,
  TextInput, 
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import axios from "axios"
import { useAuth } from '../providers/AuthProvider';
import { SERVER_URL } from '@env';

const ChangePasswordModal = ({ 
  isVisible, 
  onClose, 
  onChangePassword,
  onForgotPassword 
}) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChangePassword = async () => {
    // Validate passwords match
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }
  
    try {
      const token = await AsyncStorage.getItem('token');
    
      if (!token) {
        Alert.alert('Error', 'No authentication token found. Please log in again.');
        return;
      }
    
      const verifyResponse = await axios.post(`${SERVER_URL}/users/verifyPassword`, 
        { password: oldPassword },
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );
    
      if (verifyResponse.data.success) {
        const changeResponse = await axios.post(`${SERVER_URL}/users/changePassword`, 
          { newPassword },
          { 
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            } 
          }
        );
    
        if (changeResponse.data.success) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          
          Alert.alert(
            'Success', 
            'Your password has been changed successfully',
            [{ text: 'OK', onPress: () => onClose() }]
          );
  
          // Reset password fields
          setOldPassword('');
          setNewPassword('');
          setConfirmPassword('');
        } else {
          throw new Error('Password change failed');
        }
      }
    } catch (error) {
      console.error('Password change error:', error);
    
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      
      if (error.response) {
        switch (error.response.status) {
          case 401:
            Alert.alert('Error', 'Current password is incorrect');
            break;
          case 400:
            Alert.alert('Error', 'Invalid password. Please try again.');
            break;
          default:
            Alert.alert('Error', error.response.data.message || 'Failed to change password');
        }
      } else if (error.request) {
        Alert.alert('Error', 'No response from server. Please check your connection.');
      } else {
        Alert.alert('Error', error.message || 'An unexpected error occurred');
      }
    }
  };

  const PasswordInput = ({ 
    placeholder, 
    value, 
    onChangeText, 
    showPassword, 
    onToggleVisibility 
  }) => (
    <View style={styles.passwordInputContainer}>
      <View style={styles.passwordInputWrapper}>
        <Ionicons 
          name="lock-closed-outline" 
          size={22} 
          color="#8E8E93" 
          style={styles.inputIcon}
        />
        <TextInput
          placeholder={placeholder}
          placeholderTextColor="#8E8E93"
          secureTextEntry={!showPassword}
          value={value}
          onChangeText={onChangeText}
          style={styles.passwordInput}
        />
        <TouchableOpacity 
          onPress={onToggleVisibility}
          style={styles.passwordVisibilityToggle}
        >
          <Ionicons 
            name={showPassword ? "eye-off-outline" : "eye-outline"} 
            size={22} 
            color="#8E8E93" 
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <Modal 
      visible={isVisible} 
      animationType="slide" 
      presentationStyle="formSheet"
      transparent={true}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity 
              onPress={onClose} 
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.pageTitle}>Change Password</Text>
          </View>

          <View style={styles.modalContent}>
            <PasswordInput 
              placeholder="Current Password"
              value={oldPassword}
              onChangeText={setOldPassword}
              showPassword={showOldPassword}
              onToggleVisibility={() => setShowOldPassword(!showOldPassword)}
            />

            <View style={styles.softDivider} />

            <PasswordInput 
              placeholder="New Password"
              value={newPassword}
              onChangeText={setNewPassword}
              showPassword={showNewPassword}
              onToggleVisibility={() => setShowNewPassword(!showNewPassword)}
            />

            <View style={styles.softDivider} />

            <PasswordInput 
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              showPassword={showConfirmPassword}
              onToggleVisibility={() => setShowConfirmPassword(!showConfirmPassword)}
            />

            <TouchableOpacity 
              style={styles.changePasswordButton} 
              onPress={handleChangePassword}
            >
              <Text style={styles.changePasswordButtonText}>
                Change Password
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.forgotPasswordLink}
              onPress={onForgotPassword}
            >
              <Text style={styles.forgotPasswordText}>
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Add these styles to the existing styles object
const additionalStyles = {
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  modalContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  passwordInputContainer: {
    marginVertical: 10,
  },
  passwordInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(142, 142, 147, 0.12)',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 50,
  },
  inputIcon: {
    marginRight: 10,
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  passwordVisibilityToggle: {
    padding: 5,
  },
  changePasswordButton: {
    backgroundColor: '#0A84FF',
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  changePasswordButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  forgotPasswordLink: {
    alignItems: 'center',
    marginTop: 15,
  },
  forgotPasswordText: {
    color: '#0A84FF',
    fontSize: 15,
    fontWeight: '500',
  },
};

// Merge the additional styles with the existing styles


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
    helpSupport: false,
    changePassword: false
  });


  const handlePasswordChange = async (oldPassword, newPassword) => {
    try {

      const token = await AsyncStorage.getItem('token')

      if (!token) throw new Error('Token not found');

      // First, verify the old password
      const verifyResponse = await axios.post(`http://localhost:3000/user/verifyPassword`, 
        { password: oldPassword },
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );

      console.log(verifyResponse)

      // If verification is successful, proceed to change password
      if (verifyResponse.data.success) {
        const changeResponse = await axios.post(`http://localhost:3000/user/changePassword`, 
          { newPassword },
          { 
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            } 
          }
        );

        // Success scenario
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        
        Alert.alert(
          'Success', 
          'Your password has been changed successfully',
          [{ text: 'OK', onPress: () => toggleModal('changePassword') }]
        );
      }
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      
      // Handle different error scenarios
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        switch (error.response.status) {
          case 401:
            Alert.alert('Error', 'Current password is incorrect');
            break;
          case 400:
            Alert.alert('Error', 'Invalid password. Please try again.');
            break;
          default:
            Alert.alert('Error', 'Failed to change password. Please try again.');
        }
      } else if (error.request) {
        // The request was made but no response was received
        Alert.alert('Error', 'No response from server. Please check your connection.');
      } else {
        // Something happened in setting up the request that triggered an Error
        Alert.alert('Error', 'An unexpected error occurred.');
      }
    }
  };

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
            title="Change Password" 
            description="Manage account security"
            onPress={() => toggleModal('changePassword')}
          />
        </SettingsSection>

        <ChangePasswordModal
        isVisible={modalStates.changePassword}
        onClose={() => toggleModal('changePassword')}
        onChangePassword={handlePasswordChange}
        onForgotPassword={() => {
          // Close change password modal and open help & support
          toggleModal('changePassword');
          toggleModal('helpSupport');
        }}
      />

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

Object.assign(styles, additionalStyles);

export default Settings;