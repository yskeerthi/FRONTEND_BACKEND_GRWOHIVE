import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Dimensions,
  Alert,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Picker } from '@react-native-picker/picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useFonts, Poppins_700Bold, Poppins_600SemiBold, Poppins_400Regular } from '@expo-google-fonts/poppins';
import axios from 'axios';
const { width } = Dimensions.get('window');
const COLORS = {
  primary: '#34e3b0',
  secondary: '#2563eb',
  accent: '#F472B6',
  background: '#f6fbfa',
  card: '#fff',
  text: '#23272F',
  muted: '#6b7280',
  shadow: '#e0e7ef',
};
const API_BASE_URL = 'http://192.168.137.1:5000/api/auth'; 
export default function PersonalDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { userToken, userId } = route.params || {};
  const [gender, setGender] = useState('');
  const [education, setEducation] = useState('');
  const [university, setUniversity] = useState('');
  const [location, setLocation] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(''); // Added from previous schema
  const [bio, setBio] = useState(''); // Added from previous schema
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    console.log('PersonalDetailsScreen mounted.');
    console.log('Received userToken:', userToken ? 'Present' : 'Not Present');
    console.log('Received userId:', userId || 'Not Present');
    if (!userToken) {
      console.warn('PersonalDetailsScreen: No userToken received. This might cause issues for API calls.');
    }
  }, []);

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }
  const handleNext = async () => {
    if (!gender || !education || !university || !location || !phoneNumber || !bio) {
      Alert.alert('Error', 'Please fill in all personal details.');
      return;
    }
    setLoading(true);
    console.log('Attempting to save Personal Details...');
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`, // Send the JWT token
        },
      };
      const response = await axios.put(
        `${API_BASE_URL}/complete-profile`,
        { gender, education, university, location, phoneNumber, bio }, // Data to send
        config
      );

      console.log('Personal details update success:', response.data);
      Alert.alert('Success', 'Personal details saved!');

      console.log('Attempting to navigate to SkillsPage...');
      navigation.navigate('SkillsPage', { userToken, userId }); // Pass credentials forward

    } catch (error) {
      console.error('Personal details update error:', error.response ? error.response.data : error.message);
      Alert.alert(
        'Update Failed',
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : 'Failed to save personal details. Please try again.'
      );
    } finally {
      setLoading(false);
      console.log('Personal details process finished (loading reset).');
    }
  };
  const handleBack = () => {
    console.log('PersonalDetailsScreen: Going Back.')
    navigation.goBack();
  }
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 24}
      >
        <ScrollView
          contentContainerStyle={{ paddingBottom: 32 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={{ marginTop: 36 }} />
          <Text style={styles.title}>Personal Details</Text>
          <Text style={styles.subtitle}>
            Provide your personal details to enhance your Skill Swap experience.
          </Text>

          {/* Gender */}
          <View style={styles.inputSection}>
            <View style={styles.inputLabelRow}>
              <MaterialIcons name="person" size={22} color={COLORS.secondary} />
              <Text style={styles.inputLabel}>Gender</Text>
            </View>
            <View style={styles.pickerWrapper}> {/* Use picker wrapper for consistency */}
              <Picker
                selectedValue={gender}
                onValueChange={(itemValue) => setGender(itemValue)}
                style={styles.picker}
                dropdownIconColor={COLORS.secondary}
              >
                <Picker.Item label="Select Gender" value="" />
                <Picker.Item label="Male" value="Male" />
                <Picker.Item label="Female" value="Female" />
                <Picker.Item label="Non-binary" value="Non-binary" />
                <Picker.Item label="Prefer not to say" value="Prefer not to say" />
              </Picker>
            </View>
          </View>


          {/* Education */}
          <View style={styles.inputSection}>
            <View style={styles.inputLabelRow}>
              <MaterialIcons name="school" size={22} color={COLORS.secondary} />
              <Text style={styles.inputLabel}>Education</Text>
            </View>
            <TextInput
              style={styles.inputBox}
              placeholder="Eg: B.Tech Computer Science"
              placeholderTextColor={COLORS.muted}
              value={education}
              onChangeText={setEducation}
              returnKeyType="next"
            />
          </View>

          {/* University */}
          <View style={styles.inputSection}>
            <View style={styles.inputLabelRow}>
              <MaterialIcons name="location-city" size={22} color={COLORS.primary} />
              <Text style={styles.inputLabel}>University</Text>
            </View>
            <TextInput
              style={styles.inputBox}
              placeholder="Eg: IIT Madras"
              placeholderTextColor={COLORS.muted}
              value={university}
              onChangeText={setUniversity}
              returnKeyType="next"
            />
          </View>

          {/* Location */}
          <View style={styles.inputSection}>
            <View style={styles.inputLabelRow}>
              <MaterialIcons name="location-on" size={22} color={COLORS.accent} />
              <Text style={styles.inputLabel}>Location</Text>
            </View>
            <TextInput
              style={styles.inputBox}
              placeholder="Eg: Mumbai, India"
              placeholderTextColor={COLORS.muted}
              value={location}
              onChangeText={setLocation}
              returnKeyType="done"
            />
          </View>
          {/* Phone Number */}
          <View style={styles.inputSection}>
            <View style={styles.inputLabelRow}>
              <MaterialIcons name="phone" size={22} color={COLORS.primary} />
              <Text style={styles.inputLabel}>Phone Number</Text>
            </View>
            <TextInput
              style={styles.inputBox}
              placeholder="e.g., +1234567890"
              placeholderTextColor={COLORS.muted}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
              returnKeyType="next"
            />
          </View>

          {/* Short Bio */}
          <View style={styles.inputSection}>
            <View style={styles.inputLabelRow}>
              <MaterialIcons name="description" size={22} color={COLORS.secondary} />
              <Text style={styles.inputLabel}>Short Bio</Text>
            </View>
            <TextInput
              style={[styles.inputBox, styles.bioInput]}
              placeholder="Tell us about yourself..."
              placeholderTextColor={COLORS.muted}
              value={bio}
              onChangeText={setBio}
              multiline
              numberOfLines={4}
              maxLength={500}
              returnKeyType="done"
            />
          </View>
          {/* Navigation Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <MaterialIcons name="arrow-back" size={28} color={COLORS.secondary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.nextButton} onPress={handleNext} disabled={loading}>
              <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 26,
    paddingTop: 38,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 28,
    color: COLORS.text,
    marginBottom: 5,
    fontFamily: 'Poppins_700Bold',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.muted,
    marginBottom: 22,
    lineHeight: 22,
    fontFamily: 'Poppins_400Regular',
  },
  inputSection: {
    marginBottom: 18,
  },
  inputLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  inputLabel: {
    marginLeft: 8,
    fontSize: 15,
    color: COLORS.text,
    fontFamily: 'Poppins_700Bold',
  },
  inputBox: {
    backgroundColor: COLORS.card,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: COLORS.shadow,
    padding: 10,
    minHeight: 44,
    color: COLORS.text,
    fontSize: 15,
    fontFamily: 'Poppins_400Regular',
    textAlignVertical: 'top',
  },
  genderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  radioCircleSelected: {
    borderColor: COLORS.primary,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  radioLabel: {
    fontFamily: 'Poppins_400Regular',
    color: COLORS.text,
    fontSize: 15,
    marginRight: 8,
  },
  pickerWrapper: { // Added for Picker styling
    backgroundColor: COLORS.card,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: COLORS.shadow,
    overflow: 'hidden', // Ensures the picker itself stays within bounds
    marginBottom: 10,
    
  },
  picker: { // Added for Picker styling
    height: 52, // Adjusted height for better fit
    width: '100%',
    color: COLORS.text,
    fontFamily: 'Poppins_400Regular',
  },
  bioInput: {
    height: 100, // Adjusted height for bio
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 8,
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
    borderRadius: 12,
    paddingHorizontal: 40,
    paddingVertical: 13,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  nextButtonText: {
    color: COLORS.card,
    fontFamily: 'Poppins_700Bold',
    fontSize: 18,
    letterSpacing: 1,
  },
});