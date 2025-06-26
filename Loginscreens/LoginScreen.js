import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Alert, // Import Alert for user feedback
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Ellipse, Circle } from 'react-native-svg';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Entypo } from '@expo/vector-icons';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { COLORS } from '../screens/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
const { width, height } = Dimensions.get('window');

const API_BASE_URL = 'http://192.168.137.1:5000/api/auth';

export default function LoginScreen({ navigation }) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  let [fontsLoaded] = useFonts({
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

 const handleLogin = async () => {
  if (!email || !password) {
    Alert.alert('Login Error', 'Please enter both email and password.');
    return;
  }

  setLoading(true);
  console.log('Attempting login with:', { email, password });

  try {
    const response = await axios.post(`${API_BASE_URL}/login`, {
      email,
      password,
    });

    console.log('Login success response data:', response.data);

    const {
      token,
      _id: userId,
      name,
      email: userEmail,
      ...profileData
    } = response.data;

    // ✅ Store in SecureStore (secure tokens/profile)
    await SecureStore.setItemAsync('userToken', token);
    await SecureStore.setItemAsync('userId', userId);
    await SecureStore.setItemAsync('userName', name);
    await SecureStore.setItemAsync('userEmail', userEmail);
    await SecureStore.setItemAsync('userProfile', JSON.stringify(profileData));

    // ✅ Store in AsyncStorage (for ChatList screen)
    await AsyncStorage.setItem('currentUserId', userId);
    await AsyncStorage.setItem('currentUserName', name);

    Alert.alert('Login Success', 'You have been successfully logged in!');
    console.log('Navigating to MainTabs...');

    navigation.reset({
      index: 0,
      routes: [{ name: 'MainTabs' }],
    });
  } catch (error) {
    console.error('Login error:', error.response ? error.response.data : error.message);
    let errorMessage = 'An unexpected error occurred. Please try again.';
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message.includes('Network Error')) {
      errorMessage = 'Network error. Please check your internet connection and backend server.';
    }

    Alert.alert('Login Failed', errorMessage);
  } finally {
    setLoading(false);
    console.log('Login process finished.');
  }
};

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Layered Gradient & Blob Background */}
      <View style={StyleSheet.absoluteFill}>
        <LinearGradient
          colors={['#33e6b3', '#1fa2ff', '#0a8fd8']}
          style={{ flex: 1 }}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        <Svg height={height} width={width} style={{ position: 'absolute' }}>
          <Ellipse
            cx={width * 0.8}
            cy={height * 0.1}
            rx={110}
            ry={60}
            fill="#fff"
            fillOpacity={0.14}
          />
          <Circle
            cx={width * 0.18}
            cy={height * 0.22}
            r={70}
            fill="#33e6b3"
            fillOpacity={0.08}
          />
          <Ellipse
            cx={width * 0.5}
            cy={height * 0.93}
            rx={180}
            ry={80}
            fill="#1fa2ff"
            fillOpacity={0.09}
          />
        </Svg>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustKeyboardInsets={true}
        >
          <Text style={styles.title}>Login</Text>
          <Text style={styles.subtitle}>Welcome back! Please sign in to continue.</Text>

          <View style={styles.form}>
            <Text style={styles.inputHeading}>Email</Text>
            <View style={styles.inputWithIcon}>
              <MaterialCommunityIcons
                name="email-outline"
                size={22}
                color={COLORS.muted}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                placeholderTextColor={COLORS.muted}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading} // Disable input when loading
              />
            </View>

            <Text style={styles.inputHeading}>Password</Text>
            <View style={styles.inputWithIcon}>
              <MaterialCommunityIcons
                name="lock-outline"
                size={22}
                color={COLORS.muted}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                secureTextEntry={!passwordVisible}
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                placeholderTextColor={COLORS.muted}
                autoCapitalize="none"
                editable={!loading} // Disable input when loading
              />
              <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)} disabled={loading}>
                <Entypo
                  name={passwordVisible ? 'eye' : 'eye-with-line'}
                  size={22}
                  color={COLORS.muted}
                  style={{ marginLeft: 8 }}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.forgotPassword} disabled={loading}>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin} // Call the new handleLogin function
              disabled={loading} // Disable button while loading
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.loginText}>Login</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don’t have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')} disabled={loading}>
              <Text style={styles.signupLink}> Sign up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 90,
    paddingBottom: 40,
  },
  title: {
    fontSize: 34,
    color: '#fff',
    fontFamily: 'Poppins_700Bold',
    marginBottom: 4,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(30,41,59,0.18)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#f1f5f9',
    fontFamily: 'Poppins_600SemiBold',
    marginBottom: 32,
    textAlign: 'center',
    opacity: 0.88,
  },
  form: {
    width: '88%',
    marginBottom: 18,
  },
  inputHeading: {
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
    color: 'white',
    alignSelf: 'flex-start',
    marginBottom: 4,
    marginTop: 12,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.2,
    borderColor: COLORS.muted,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.92)',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 13,
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    color: COLORS.text,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
    marginTop: 2,
  },
  forgotText: {
    color: COLORS.secondary,
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
  },
  loginButton: {
    backgroundColor: COLORS.secondary, // Changed to secondary as per your code
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: 'center',
    width: '100%',
    marginTop: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.16,
    shadowRadius: 8,
    elevation: 3,
  },
  loginText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Poppins_700Bold',
    letterSpacing: 0.5,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 28,
  },
  signupText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
  },
  signupLink: {
    color: COLORS.secondary,
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
    marginLeft: 2,
  },
});
