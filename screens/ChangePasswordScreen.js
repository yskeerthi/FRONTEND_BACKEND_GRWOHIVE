import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import LottieView from 'lottie-react-native';

const ChangePasswordScreen = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChangePassword = () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match.');
      return;
    }
    Alert.alert('Success', 'Password changed successfully!');
    // Add your backend logic here
  };

  return (
    <SafeAreaView style={styles.container}>
      
      <LottieView
        source={require('../assets/password-lock.json')}
        autoPlay
        loop
        style={styles.animation}
      />

      <Text style={styles.title}>Change Password</Text>

      <TextInput
        style={styles.input}
        placeholder="Old Password"
        secureTextEntry
        onChangeText={setOldPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="New Password"
        secureTextEntry
        onChangeText={setNewPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm New Password"
        secureTextEntry
        onChangeText={setConfirmPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
        <Text style={styles.buttonText}>Update Password</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ChangePasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    backgroundColor: '#f4faff',
    paddingTop:50,
  },
  animation: {
    width: 180,
    height: 180,
    alignSelf: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0D2A64',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#34e3b0',
    padding: 14,
    borderRadius: 8,
    marginTop: 16,
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: '600',
  },
});
