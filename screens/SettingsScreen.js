import React, { useState } from 'react';
import {
  View,
  Text,
  Switch,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Modal,
  Animated,
  Dimensions,
  Pressable,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from './ThemeContext'; // Your custom ThemeContext

const faqData = [
  {
    question: 'How to report a bug?',
    answer:
      'You can report bugs by contacting our support team via the "Report a Bug" option in the app or emailing support@growhive.com.',
  },
  {
    question: 'How do I reset my password?',
    answer:
      'Go to the login screen and tap on "Forgot Password". Follow the instructions to reset your password via email.',
  },
  {
    question: 'Can I access courses offline?',
    answer:
      'Currently, offline access is not supported. Make sure you have an active internet connection to use the app.',
  },
  {
    question: 'How to contact support?',
    answer:
      'You can reach out to our support team via the Contact Us section or email support@growhive.com.',
  },
];

const TERMS_CONTENT = `
About GrowHive

GrowHive is a platform designed to help learners and professionals connect, grow, and succeed. We provide access to curated courses, hackathons, networking opportunities, and more.

Terms of Service

1. Acceptance: By using GrowHive, you agree to comply with our terms and policies.
2. Usage: You must use the app for lawful purposes only. Any misuse, including harassment or spamming, will result in account suspension.
3. Content: All content is for personal use. Redistribution or commercial use without permission is prohibited.
4. Privacy: We respect your privacy and handle your data according to our Privacy Policy.
5. Support: For any issues, contact our support team at support@growhive.com.

For detailed terms, please visit our website or contact support.
`;

const PRIVACY_CONTENT = `
Privacy Policy

At GrowHive, your privacy is important to us. This policy explains how we collect, use, and protect your personal information.

1. Information Collection: We collect information you provide when registering, using features, or contacting support.
2. Use of Data: Your data is used to improve our services, personalize your experience, and communicate with you.
3. Data Sharing: We do not sell or share your personal data with third parties except as required by law.
4. Security: We implement industry-standard measures to protect your data.
5. Your Choices: You can update your information or request deletion by contacting support@growhive.com.

For more details, please contact our team or visit our website.
`;

const { width } = Dimensions.get('window');

const SettingsScreen = () => {
  const { darkTheme, setDarkTheme } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [expandedFAQIndex, setExpandedFAQIndex] = useState(null);

  // Modal for Terms of Service
  const [termsVisible, setTermsVisible] = useState(false);
  const termsSlideAnim = useState(new Animated.Value(width))[0];

  // Modal for Privacy Policy
  const [privacyVisible, setPrivacyVisible] = useState(false);
  const privacySlideAnim = useState(new Animated.Value(width))[0];

  const openTermsModal = () => {
    setTermsVisible(true);
    Animated.timing(termsSlideAnim, {
      toValue: 0,
      duration: 350,
      useNativeDriver: false,
    }).start();
  };

  const closeTermsModal = () => {
    Animated.timing(termsSlideAnim, {
      toValue: width,
      duration: 300,
      useNativeDriver: false,
    }).start(() => setTermsVisible(false));
  };

  const openPrivacyModal = () => {
    setPrivacyVisible(true);
    Animated.timing(privacySlideAnim, {
      toValue: 0,
      duration: 350,
      useNativeDriver: false,
    }).start();
  };

  const closePrivacyModal = () => {
    Animated.timing(privacySlideAnim, {
      toValue: width,
      duration: 300,
      useNativeDriver: false,
    }).start(() => setPrivacyVisible(false));
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // Add your delete account logic here
            console.log('Account deleted');
          },
        },
      ]
    );
  };

  const toggleFAQ = (index) => {
    setExpandedFAQIndex(expandedFAQIndex === index ? null : index);
  };

  const themeStyles = darkTheme ? darkStyles : {};

  return (
    <SafeAreaView style={[styles.container, themeStyles.container]}>
      <Text style={[styles.title, themeStyles.title]}>Settings</Text>

      {/* Notifications Toggle */}
      <View style={[styles.settingRow, themeStyles.settingRow]}>
        <Text style={[styles.settingLabel, themeStyles.settingLabel]}>Notifications</Text>
        <Switch
          trackColor={{ false: '#ccc', true: '#5786ed' }}
          thumbColor={notificationsEnabled ? '#2563eb' : '#999'}
          onValueChange={() => setNotificationsEnabled((prev) => !prev)}
          value={notificationsEnabled}
        />
      </View>

      {/* Dark Theme Toggle */}
      <View style={[styles.settingRow, themeStyles.settingRow]}>
        <Text style={[styles.settingLabel, themeStyles.settingLabel]}>Dark Theme</Text>
        <Switch
          trackColor={{ false: '#ccc', true: '#23272F' }}
          thumbColor={darkTheme ? '#23272F' : '#999'}
          onValueChange={setDarkTheme}
          value={darkTheme}
        />
      </View>

      {/* App Version */}
      <View style={[styles.settingRow, themeStyles.settingRow]}>
        <Text style={[styles.settingLabel, themeStyles.settingLabel]}>App Version</Text>
        <Text style={[styles.settingLabel, themeStyles.settingLabel]}>1.0.0</Text>
      </View>

      {/* Divider */}
      

      {/* Terms & Policy */}
      <View style={styles.termsSection}>
        <TouchableOpacity style={styles.termsButton} onPress={openTermsModal}>
          <Text style={styles.termsButtonText}>Terms of Service</Text>
        </TouchableOpacity>
        <View style={[styles.line, themeStyles.line]} />
        <TouchableOpacity style={styles.termsButton} onPress={openPrivacyModal}>
          <Text style={styles.termsButtonText}>Privacy Policy</Text>
        </TouchableOpacity>
      </View>

      {/* Divider */}
      <View style={[styles.divider, themeStyles.divider]} />

      {/* FAQ Section */}
      <View style={styles.faqSection}>
        <Text style={[styles.faqTitle, themeStyles.faqTitle]}>FAQs</Text>
        {faqData.map((item, index) => (
          <View key={index} style={styles.faqItem}>
            <TouchableOpacity
              style={styles.faqQuestionContainer}
              onPress={() => toggleFAQ(index)}
            >
              <Text style={[styles.faqQuestion, themeStyles.faqQuestion]}>{item.question}</Text>
              <Ionicons
                name={expandedFAQIndex === index ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={darkTheme ? '#fff' : '#000'}
              />
            </TouchableOpacity>
            {expandedFAQIndex === index && (
              <Text style={[styles.faqAnswer, themeStyles.faqAnswer]}>{item.answer}</Text>
            )}
          </View>
        ))}
      </View>

      {/* Delete Account */}
      <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
        <Text style={styles.deleteButtonText}>Delete Account</Text>
      </TouchableOpacity>

      {/* Terms of Service Modal */}
      <Modal
        visible={termsVisible}
        transparent
        animationType="none"
        onRequestClose={closeTermsModal}
      >
        <Pressable style={styles.modalBackdrop} onPress={closeTermsModal}>
          <Animated.View
            style={[
              styles.modalContainer,
              themeStyles.modalContainer,
              { transform: [{ translateX: termsSlideAnim }] },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, themeStyles.modalTitle]}>Terms of Service</Text>
              <TouchableOpacity onPress={closeTermsModal}>
                <Ionicons name="close" size={24} color={darkTheme ? "#fff" : "#23272F"} />
              </TouchableOpacity>
            </View>
            <ScrollView style={{ flex: 1 }}>
              <Text style={[styles.modalContent, themeStyles.modalContent]}>
                {TERMS_CONTENT}
              </Text>
            </ScrollView>
          </Animated.View>
        </Pressable>
      </Modal>

      {/* Privacy Policy Modal */}
      <Modal
        visible={privacyVisible}
        transparent
        animationType="none"
        onRequestClose={closePrivacyModal}
      >
        <Pressable style={styles.modalBackdrop} onPress={closePrivacyModal}>
          <Animated.View
            style={[
              styles.modalContainer,
              themeStyles.modalContainer,
              { transform: [{ translateX: privacySlideAnim }] },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, themeStyles.modalTitle]}>Privacy Policy</Text>
              <TouchableOpacity onPress={closePrivacyModal}>
                <Ionicons name="close" size={24} color={darkTheme ? "#fff" : "#23272F"} />
              </TouchableOpacity>
            </View>
            <ScrollView style={{ flex: 1 }}>
              <Text style={[styles.modalContent, themeStyles.modalContent]}>
                {PRIVACY_CONTENT}
              </Text>
            </ScrollView>
          </Animated.View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6fbfa',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Poppins_700Bold',
    color: '#23272F',
    marginBottom: 10,
    paddingTop: 30,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e7ef',
  },
  settingLabel: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    color: '#23272F',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e7ef',
    marginVertical: 10,
  },
  termsSection: {
    marginTop: 0,
    marginBottom: 0,
    backgroundColor: 'transparent',
  },
  termsButton: {
    paddingVertical: 12,
    paddingHorizontal: 0,
  },
  termsButtonText: {
    color: '#2563eb',
    fontFamily: 'Poppins_700Bold',
    fontSize: 15,
  },
  line: {
    height: 1,
    backgroundColor: '#e0e7ef',
    marginVertical: 0,
  },
  faqSection: {
    marginTop: 20,
  },
  faqTitle: {
    fontSize: 20,
    fontFamily: 'Poppins_700Bold',
    color: '#000',
    marginBottom: 10,
  },
  faqItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e7ef',
  },
  faqQuestionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    fontSize: 16,
    fontFamily: 'Poppins_700Bold',
    color: '#000',
    flex: 1,
  },
  faqAnswer: {
    marginTop: 8,
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#6b7280',
    lineHeight: 20,
  },
  deleteButton: {
    marginTop: 30,
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins_700Bold',
    color: '#dc2626',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  modalContainer: {
    width: '85%',
    height: '100%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    padding: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Poppins_700Bold',
    color: '#23272F',
  },
  modalContent: {
    fontSize: 15,
    fontFamily: 'Poppins_400Regular',
    color: '#23272F',
    lineHeight: 22,
  },
});

// Dark theme overrides
const darkStyles = StyleSheet.create({
  container: {
    backgroundColor: '#18181b',
  },
  title: {
    color: '#fff',
  },
  settingRow: {
    borderBottomColor: '#333',
  },
  settingLabel: {
    color: '#fff',
  },
  divider: {
    backgroundColor: '#333',
  },
  line: {
    backgroundColor: '#333',
  },
  faqTitle: {
    color: '#fff',
  },
  faqQuestion: {
    color: '#fff',
  },
  faqAnswer: {
    color: '#d1d5db',
  },
  modalContainer: {
    backgroundColor: '#23272F',
  },
  modalTitle: {
    color: '#fff',
  },
  modalContent: {
    color: '#fff',
  },
});
