import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useFonts, Poppins_700Bold, Poppins_400Regular, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import GrowHiveHead from './GrowHivehead';
import { COLORS } from './constants'; // Adjust the import path as necessary

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [profileImage, setProfileImage] = useState(require('../assets/profile.jpeg'));
  const [userName, setUserName] = useState('Keerthi Chodistti');

  let [fontsLoaded] = useFonts({
    Poppins_700Bold,
    Poppins_400Regular,
    Poppins_600SemiBold,
  });

  if (!fontsLoaded) {
    return <Text style={{ textAlign: 'center', marginTop: 50 }}>Loading...</Text>;
  }

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'We need permission to access your gallery.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage({ uri: result.assets[0].uri });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <GrowHiveHead />
      <ScrollView>
        {/* Profile Row with Image and Name */}
        <View style={styles.profileRow}>
          <View style={styles.profileImageWrapper}>
            <Image source={profileImage} style={styles.profileImage} />
            <TouchableOpacity onPress={pickImage} style={styles.editIcon}>
              <Ionicons name="add" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.name}>{userName}</Text>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <StatsBlock label="Connections" count="25" />
          <StatsBlock label="Courses Learned" count="10" />
          <StatsBlock label="Hackathons" count="3" />
        </View>

        {/* Section Rows */}
        <SectionRow
          icon="person-circle-outline"
          label="Personal Information"
          onPress={() => navigation.navigate('EditProfile')}
        />
        <SectionRow
          icon="lock-closed-outline"
          label="Change Password"
          onPress={() => navigation.navigate('ChangePassword')}
        />
        <SectionRow
          icon="settings-outline"
          label="Settings"
          onPress={() => navigation.navigate('Settings')}
        />
        <SectionRow
          icon="alert-circle-outline"
          label="Blocked Users"
          onPress={() => navigation.navigate('BlockedUsers')}
        />
        <SectionRow
          icon="alert-octagon-outline"
          label="Reported Users"
          onPress={() => navigation.navigate('ReportedUsers')}
        />
        <SectionRow
          icon="log-out-outline"
          label="Log Out"
          onPress={() => {
            // Add your logout logic here
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

// Stats Block Component
const StatsBlock = ({ label, count }) => (
  <View style={styles.statBox}>
    <Text style={styles.statNumber}>{count}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

// Section Row Component
const SectionRow = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.sectionRow} onPress={onPress}>
    <View style={styles.sectionLeft}>
      <Ionicons name={icon} size={22} color="#0D2A64" />
      <Text style={styles.sectionText}>{label}</Text>
    </View>
    {label === 'Personal Information' && (
      <MaterialCommunityIcons name="square-edit-outline" size={20} color="#0D2A64" />
    )}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
    paddingTop: 80,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    color: '#222',
    marginLeft: 20,
    fontFamily: 'Poppins_700Bold',
  },
  profileImageWrapper: {
    position: 'relative',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#34e3b0',
    borderRadius: 8,
    padding: 6,
    borderWidth: 2,
    borderColor: '#fff',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    color: '#0D2A64',
    fontFamily: 'Poppins_600SemiBold',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontFamily: 'Poppins_400Regular',
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionText: {
    fontSize: 16,
    marginLeft: 12,
    color: '#333',
    fontFamily: 'Poppins_600SemiBold',
  },
});

export default ProfileScreen;
