import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Modal,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const COLORS = {
  primary: '#34e3b0',
  secondary: '#2563eb',
  accent: '#F472B6',
  background: '#f6fbfa',
  card: '#fff',
  text: '#23272F',
  muted: '#6b7280',
  shadow: '#e0e7ef',
  logoBlue: '#2563eb',
  logoGreen: '#34e3b0',
};

const FloatingLabelInput = ({
  icon,
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
}) => (
  <View style={styles.inputWrapper}>
    <View style={styles.labelContainer}>
      <Ionicons name={icon} size={16} color={COLORS.text} />
      <Text style={styles.labelText}>{label}</Text>
    </View>
    <TextInput
      style={styles.textInput}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={COLORS.muted}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
    />
  </View>
);

const DropdownInput = ({ icon, label, value, onSelect, options, placeholder }) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleSelect = (item) => {
    onSelect(item);
    setIsVisible(false);
  };

  return (
    <View style={styles.inputWrapper}>
      <View style={styles.labelContainer}>
        <Ionicons name={icon} size={16} color={COLORS.text} />
        <Text style={styles.labelText}>{label}</Text>
      </View>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setIsVisible(true)}
      >
        <Text style={[styles.dropdownText, !value && { color: COLORS.muted }]}>
          {value || placeholder}
        </Text>
        <Ionicons name="chevron-down" size={20} color={COLORS.text} />
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select {label}</Text>
            <FlatList
              data={options}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.optionItem}
                  onPress={() => handleSelect(item)}
                >
                  <Text style={styles.optionText}>{item}</Text>
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const EditProfileScreen = () => {
  const navigation = useNavigation();

  const [name, setName] = useState('Srujana Balam');
  const [username, setUsername] = useState('srujana_balam');
  const [domain, setDomain] = useState('Full Stack Development');
  const [college, setCollege] = useState('Aditya College of Engineering');
  const [phone, setPhone] = useState('9493933007');
  const [email, setEmail] = useState('22MH1A42E9@acoe.edu.in');
  const [skillsTheyHave, setSkillsTheyHave] = useState('HTML, CSS, JS, React, Node');
  const [skillsTheyWant, setSkillsTheyWant] = useState('');
  const [bio, setBio] = useState('');
  const [blockedUsers, setBlockedUsers] = useState('');
  const [reportedUsers, setReportedUsers] = useState('');

  const domainOptions = [
    'Full Stack Development',
    'Frontend Development',
    'Backend Development',
    'Mobile App Development',
    'Data Science',
    'Machine Learning',
    'Artificial Intelligence',
    'DevOps',
    'Cloud Computing',
    'Cybersecurity',
    'UI/UX Design',
    'Digital Marketing',
    'Game Development',
    'Blockchain Development',
    'Software Testing',
  ];

  const collegeOptions = [
    'Aditya College of Engineering',
    'Acharya Nagarjuna University',
    'Andhra University',
    'GITAM University',
    'Vignan University',
    'VIT-AP University',
    'SRM University AP',
    'K L University',
    'Amrita Vishwa Vidyapeetham',
    'Centurion University',
    'RGUKT Nuzvidu',
    'RGUKT Srikakulam',
    'JNTU Anantapur',
    'JNTU Kakinada',
    'SVU Tirupati',
    'Sree Vidyanikethan Engineering College',
    'Gayatri Vidya Parishad College of Engineering',
    'Pragati Engineering College',
    'CMR College of Engineering & Technology',
    'Vignan Institute of Technology & Science',
  ];

  const handleSave = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <FloatingLabelInput icon="person" label="Name" value={name} onChangeText={setName} />
          <FloatingLabelInput icon="person-circle" label="Username" value={username} onChangeText={setUsername} />
          <DropdownInput icon="briefcase" label="Domain" value={domain} onSelect={setDomain} options={domainOptions} placeholder="Select your domain" />
          <DropdownInput icon="school" label="College" value={college} onSelect={setCollege} options={collegeOptions} placeholder="Select your college" />
          <FloatingLabelInput icon="call" label="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
          <FloatingLabelInput icon="mail" label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
          <FloatingLabelInput icon="checkmark-circle" label="Skills They Have" value={skillsTheyHave} onChangeText={setSkillsTheyHave} placeholder="e.g., HTML, CSS, JavaScript, etc." />
          <FloatingLabelInput icon="code-slash" label="Skills They Want" value={skillsTheyWant} onChangeText={setSkillsTheyWant} placeholder="e.g., React, Node.js, Python, etc." />
          <FloatingLabelInput icon="information-circle" label="Bio" value={bio} onChangeText={setBio} placeholder="Tell us about yourself..." />
          <FloatingLabelInput icon="ban" label="Blocked Users" value={blockedUsers} onChangeText={setBlockedUsers} placeholder="Comma separated usernames" />
          <FloatingLabelInput icon="alert-circle" label="Reported Users" value={reportedUsers} onChangeText={setReportedUsers} placeholder="Comma separated usernames" />

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.background,
    paddingTop: 40,
  },
  backButton: {
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: COLORS.text,
    fontFamily: 'Poppins_700Bold',
  },
  inputWrapper: {
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: COLORS.text,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingTop: 18,
    paddingBottom: 10,
    backgroundColor: COLORS.card,
    position: 'relative',
  },
  labelContainer: {
    position: 'absolute',
    top: -10,
    left: 12,
    backgroundColor: COLORS.card,
    paddingHorizontal: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  labelText: {
    marginLeft: 5,
    fontSize: 13,
    color: COLORS.text,
    fontWeight: '600',
    fontFamily: 'Poppins_400Regular',
  },
  textInput: {
    fontSize: 16,
    color: COLORS.text,
    paddingTop: 2,
    fontFamily: 'Poppins_400Regular',
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 2,
    minHeight: 20,
  },
  dropdownText: {
    fontSize: 16,
    color: COLORS.text,
    flex: 1,
    fontFamily: 'Poppins_400Regular',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.card,
    width: '85%',
    maxHeight: '70%',
    borderRadius: 15,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    color: COLORS.text,
    fontFamily: 'Poppins_700Bold',
  },
  optionItem: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.shadow,
  },
  optionText: {
    fontSize: 16,
    color: COLORS.text,
    fontFamily: 'Poppins_400Regular',
  },
  closeButton: {
    backgroundColor: '#34e3b0',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
  },
  closeButtonText: {
    color: COLORS.card,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins_700Bold',
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  saveText: {
    color: COLORS.card,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins_700Bold',
  },
});

export default EditProfileScreen;
