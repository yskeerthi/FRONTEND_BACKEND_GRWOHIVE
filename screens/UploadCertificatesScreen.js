import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { useNavigation, useRoute, CommonActions } from '@react-navigation/native';
import * as DocumentPicker from 'expo-document-picker';
import { COLORS } from '../screens/constants'; // Adjust path if needed
import { MaterialIcons, AntDesign } from '@expo/vector-icons';
import { useFonts, Poppins_700Bold, Poppins_600SemiBold, Poppins_400Regular } from '@expo-google-fonts/poppins';
import axios from 'axios';

// IMPORTANT: Use your CURRENT LOCAL IP
const API_BASE_URL = 'http://192.168.137.1:5000'; // Set this to your backend

export default function UploadCertificatesScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { userToken, userId } = route.params || {};

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [certificationIds, setCertificationIds] = useState({}); // Store certification IDs
  const [workLinks, setWorkLinks] = useState('');
  const [achievements, setAchievements] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  let [fontsLoaded] = useFonts({
    Poppins_700Bold,
    Poppins_600SemiBold,
    Poppins_400Regular,
  });

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setKeyboardVisible(false)
    );
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  if (!fontsLoaded) return null;

  const pickDocument = async () => {
    try {
      let result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        multiple: true,
      });
      if (!result.canceled && result.assets) {
        setSelectedFiles(prevFiles => {
          const newFiles = result.assets.filter(
            (newFile) => !prevFiles.some((existingFile) => existingFile.uri === newFile.uri)
          );
          return [...prevFiles, ...newFiles];
        });
      }
    } catch (error) {
      Alert.alert('Error', 'There was an error selecting the document.');
    }
  };

  const removeFile = (uriToRemove) => {
    Alert.alert(
      "Remove File",
      "Are you sure you want to remove this file from the list?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Remove", onPress: () => {
          setSelectedFiles(prevFiles => prevFiles.filter(file => file.uri !== uriToRemove));
          setCertificationIds(prevIds => {
            const newIds = { ...prevIds };
            delete newIds[uriToRemove];
            return newIds;
          });
        }}
      ]
    );
  };

  const handleCertificationIdChange = (uri, text) => {
    setCertificationIds(prevIds => ({
      ...prevIds,
      [uri]: text,
    }));
  };

  const validateCertificationId = async (certId) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/validate-certification-id`,
        { certificationId: certId },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userToken}`,
          },
        }
      );
      return response.data.isValid;
    } catch (error) {
      console.error('Certification ID validation error:', error);
      return false;
    }
  };

  const handleUploadAndFinish = async () => {
    if (!workLinks.trim() || !achievements.trim()) {
      Alert.alert('Error', 'Please fill in Work Links and Achievements.');
      return;
    }

    // Validate all certification IDs
    for (const uri of Object.keys(certificationIds)) {
      const certId = certificationIds[uri];
      if (!certId || certId.trim() === '') {
        Alert.alert('Error', 'Please enter a Certification ID for all uploaded files.');
        return;
      }
      const isValid = await validateCertificationId(certId);
      if (!isValid) {
        Alert.alert('Error', `Invalid Certification ID: ${certId}`);
        return;
      }
    }

    setLoading(true);
    try {
      // 1. Upload Certificates (if any) with Certification IDs
      let uploadedCertificatesData = [];
      if (selectedFiles.length > 0) {
        const formData = new FormData();
        selectedFiles.forEach((file) => {
          formData.append('certificates', {
            uri: file.uri,
            name: file.name,
            type: file.mimeType || 'application/pdf',
          });
          formData.append('certificationIds', certificationIds[file.uri] || '');
        });
        const uploadResponse = await axios.post(
          `${API_BASE_URL}/api/upload/certificates`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${userToken}`,
            },
          }
        );
        uploadedCertificatesData = uploadResponse.data.uploadedFiles;
        Alert.alert('Upload Success', 'Certificates uploaded!');
      }

      // 2. Update Work Links and Achievements
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`,
        },
      };
      const profileUpdatePayload = {
        workLinks,
        achievements,
      };
      await axios.put(
        `${API_BASE_URL}/api/auth/complete-profile`,
        profileUpdatePayload,
        config
      );
      Alert.alert('Success', 'Profile details saved! You are all set.');

      // 3. Navigate to MainTabs and reset navigation stack
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'MainTabs' }],
        })
      );
    } catch (error) {
      Alert.alert(
        'Setup Failed',
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : `Failed to complete setup. ${error.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: keyboardVisible ? 200 : 40 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.heading}>Upload Certificates</Text>
        <Text style={styles.catchyTag}>Showcase your skills and achievements—upload your certificates now!</Text>

        <TouchableOpacity style={styles.uploadBox} onPress={pickDocument} disabled={loading}>
          <AntDesign name="cloudupload" size={36} color={COLORS.primary} />
          <Text style={styles.uploadText}>
            {selectedFiles.length > 0 ? `${selectedFiles.length} file(s) selected` : 'Please upload in .pdf'}
          </Text>
        </TouchableOpacity>

        {selectedFiles.length > 0 && (
          <View style={styles.fileListContainer}>
            <Text style={styles.fileListHeader}>Selected Files:</Text>
            <FlatList
              data={selectedFiles}
              keyExtractor={(item) => item.uri}
              renderItem={({ item }) => (
                <View style={styles.fileItem}>
                  <MaterialIcons name="insert-drive-file" size={20} color={COLORS.text} />
                  <View style={styles.fileItemContent}>
                    <Text style={styles.fileName}>{item.name}</Text>
                    <TextInput
                      style={styles.certIdInput}
                      placeholder="Enter Certification ID"
                      placeholderTextColor={COLORS.muted}
                      value={certificationIds[item.uri] || ''}
                      onChangeText={(text) => handleCertificationIdChange(item.uri, text)}
                      editable={!loading}
                    />
                  </View>
                  <TouchableOpacity onPress={() => removeFile(item.uri)} style={styles.removeFileButton}>
                    <AntDesign name="closecircleo" size={16} color={COLORS.muted} />
                  </TouchableOpacity>
                </View>
              )}
              scrollEnabled={false}
            />
          </View>
        )}

        <Text style={styles.label}>Work Links</Text>
        <TextInput
          style={styles.input}
          placeholder="Paste your work links here"
          placeholderTextColor={COLORS.muted}
          value={workLinks}
          onChangeText={setWorkLinks}
          editable={!loading}
        />

        <Text style={styles.label}>Achievements</Text>
        <TextInput
          style={[styles.input, styles.achievementsInput]}
          placeholder="Enter your achievements"
          placeholderTextColor={COLORS.muted}
          value={achievements}
          onChangeText={setAchievements}
          multiline
          textAlignVertical="top"
          editable={!loading}
        />

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack} disabled={loading}>
            <MaterialIcons name="arrow-back" size={28} color={COLORS.secondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.nextButton} onPress={handleUploadAndFinish} disabled={loading}>
            {loading ? (
              <ActivityIndicator color={COLORS.card} size="small" />
            ) : (
              <Text style={styles.buttonText}>Finish Setup</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 24,
  },
  heading: {
    fontSize: 26,
    color: COLORS.text,
    marginBottom: 8,
    fontFamily: 'Poppins_700Bold',
    marginTop: 50,
  },
  catchyTag: {
    fontFamily: 'Poppins_600SemiBold',
    color: COLORS.secondary,
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 18,
  },
  uploadBox: {
    backgroundColor: COLORS.card,
    borderColor: COLORS.primary,
    borderWidth: 2,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    flexDirection: 'column',
    gap: 8,
  },
  uploadText: {
    color: COLORS.primary,
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    marginTop: 8,
  },
  label: {
    color: COLORS.text,
    fontFamily: 'Poppins_600SemiBold',
    marginBottom: 6,
    marginTop: 12,
    fontSize: 16,
  },
  input: {
    backgroundColor: COLORS.card,
    borderColor: COLORS.shadow,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    color: COLORS.text,
    marginBottom: 10,
    fontFamily: 'Poppins_400Regular',
    fontSize: 15,
  },
  achievementsInput: {
    height: 120,
    paddingTop: 12,
    paddingBottom: 12,
  },
  fileListContainer: {
    width: '100%',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  fileListHeader: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: COLORS.text,
    marginBottom: 10,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.shadow,
  },
  fileItemContent: {
    flex: 1,
    marginLeft: 10,
  },
  fileName: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: COLORS.text,
    marginBottom: 4,
  },
  certIdInput: {
    backgroundColor: COLORS.card,
    borderColor: COLORS.shadow,
    borderWidth: 1,
    borderRadius: 6,
    padding: 8,
    color: COLORS.text,
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
  },
  removeFileButton: {
    padding: 5,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.shadow,
    elevation: 1,
  },
  nextButton: {
    backgroundColor: COLORS.secondary,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  buttonText: {
    color: COLORS.card,
    fontFamily: 'Poppins_700Bold',
    fontSize: 16,
  },
});