import React, { useState, useRef } from "react";
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
  Alert,
  ActivityIndicator,
  Modal,
  Animated,
  Easing,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Ellipse, Circle } from "react-native-svg";
import AntDesign from "react-native-vector-icons/AntDesign";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { BlurView } from "expo-blur";
import { COLORS } from "../screens/constants";
import {
  useFonts,
  Poppins_700Bold,
  Poppins_400Regular,
  Poppins_600SemiBold,
  Poppins_500Medium,
} from "@expo-google-fonts/poppins";
import axios from "axios";

const { width, height } = Dimensions.get("window");

const API_BASE_URL = 'http://192.168.137.1:5000/api/auth';
// Custom Email Alert Component
const CustomEmailAlert = ({ 
  visible, 
  onClose, 
  onVerifyPress, 
  title = "Email Verification Required", 
  message = "Please verify your email address before creating your account. This helps us keep your account secure." 
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    if (visible) {
      // Show animation
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();

      // Pulse animation for the icon
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();

      return () => pulse.stop();
    } else {
      // Hide animation
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="none"
      statusBarTranslucent={true}
    >
      <Animated.View 
        style={[
          alertStyles.overlay,
          {
            opacity: opacityAnim,
          }
        ]}
      >
        <BlurView intensity={20} style={StyleSheet.absoluteFill} />
        
        <Animated.View
          style={[
            alertStyles.alertContainer,
            {
              transform: [
                { scale: scaleAnim },
                { translateY: slideAnim }
              ],
            },
          ]}
        >
          {/* Gradient Background */}
          <LinearGradient
            colors={['#ffffff', '#f8fafc']}
            style={alertStyles.alertBackground}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {/* Decorative Elements */}
            <View style={alertStyles.decorativeCircle1} />
            <View style={alertStyles.decorativeCircle2} />
            
            {/* Icon with Pulse Animation */}
            <Animated.View 
              style={[
                alertStyles.iconContainer,
                {
                  transform: [{ scale: pulseAnim }]
                }
              ]}
            >
              <LinearGradient
                colors={['#ff6b6b', '#ee5a24']}
                style={alertStyles.iconGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <MaterialCommunityIcons 
                  name="email-alert-outline" 
                  size={32} 
                  color="#fff" 
                />
              </LinearGradient>
            </Animated.View>

            {/* Content */}
            <View style={alertStyles.contentContainer}>
              <Text style={alertStyles.alertTitle}>{title}</Text>
              <Text style={alertStyles.alertMessage}>{message}</Text>
            </View>

            {/* Action Buttons */}
            <View style={alertStyles.buttonContainer}>
              <TouchableOpacity
                style={alertStyles.verifyButton}
                onPress={onVerifyPress}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#33e6b3', '#1fa2ff']}
                  style={alertStyles.verifyButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <MaterialCommunityIcons 
                    name="email-check-outline" 
                    size={20} 
                    color="#fff" 
                    style={alertStyles.buttonIcon}
                  />
                  <Text style={alertStyles.verifyButtonText}>Verify Email</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={alertStyles.laterButton}
                onPress={onClose}
                activeOpacity={0.7}
              >
                <Text style={alertStyles.laterButtonText}>Maybe Later</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

export default function SignupScreen({ navigation }) {
  const [passwordVisible, setPasswordVisible] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // UI states
  const [loading, setLoading] = useState(false);
  const [otpSending, setOtpSending] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [showOtpField, setShowOtpField] = useState(false);
  const [showVerifyIcon, setShowVerifyIcon] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const [showEmailAlert, setShowEmailAlert] = useState(false);

  // Create refs for OTP inputs
  const otpRefs = useRef([]);

  const [fontsLoaded] = useFonts({
    Poppins_700Bold,
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_500Medium,
  });

  if (!fontsLoaded) return null;

  // Email validation with .com check
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isCompleteEmail = (email) => {
    return email.includes("@") && email.includes(".") && email.endsWith(".com");
  };

  // Handle email input change
  const handleEmailChange = (text) => {
    setEmail(text);
    setShowVerifyIcon(isCompleteEmail(text) && !isEmailVerified);
    if (isEmailVerified) {
      setIsEmailVerified(false);
      setShowOtpField(false);
      setOtpValues(["", "", "", "", "", ""]);
    }
  };

  // Handle OTP input change with auto-focus
  const handleOtpChange = (value, index) => {
    const newOtpValues = [...otpValues];
    newOtpValues[index] = value;
    setOtpValues(newOtpValues);

    // Auto focus next input if value is entered
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }

    // Auto focus previous input if value is deleted
    if (!value && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  // Handle backspace in OTP inputs
  const handleOtpKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace" && !otpValues[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  // Send OTP for email verification
  const handleVerifyEmail = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email address.");
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert("Error", "Please enter a valid email address.");
      return;
    }

    setOtpSending(true);
    console.log("Sending OTP to:", email);

    try {
      const response = await axios.post(`${API_BASE_URL}/send`, {
        email: email.toLowerCase().trim(),
      });

      console.log("OTP sent successfully:", response.data);
      Alert.alert(
        "Success",
        "Verification code sent to your email address. Please check your inbox."
      );

      setShowOtpField(true);
      setShowVerifyIcon(false);
      startResendCooldown();
    } catch (error) {
      console.error(
        "Send OTP error:",
        error.response ? error.response.data : error.message
      );
      const errorMessage =
        error.response?.data?.message ||
        "Failed to send verification code. Please try again.";
      Alert.alert("Error", errorMessage);
    } finally {
      setOtpSending(false);
    }
  };

  // Verify OTP
  const handleVerifyOTP = async () => {
    const otpString = otpValues.join("");
    if (!otpString || otpString.length !== 6) {
      Alert.alert("Error", "Please enter a valid 6-digit verification code.");
      return;
    }

    setLoading(true);
    console.log("Verifying OTP:", otpString);

    try {
      const verifyResponse = await axios.post(`${API_BASE_URL}/verify`, {
        email: email.toLowerCase().trim(),
        otp: otpString.trim(),
      });

      console.log("OTP verified successfully:", verifyResponse.data);
      Alert.alert("Success", "Email verified successfully!");

      setIsEmailVerified(true);
      setShowOtpField(false);
      setShowVerifyIcon(false);
    } catch (error) {
      console.error(
        "OTP verification error:",
        error.response ? error.response.data : error.message
      );
      const errorMessage =
        error.response?.data?.message ||
        "Verification failed. Please try again.";
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Main signup function
const handleSignup = async () => {
  if (!name || !email || !password) {
    Alert.alert("Error", "Please fill in all fields.");
    return;
  }

  if (!isEmailVerified) {
    setShowEmailAlert(true);
    return;
  }

  if (password.length < 6) {
    Alert.alert("Error", "Password must be at least 6 characters long.");
    return;
  }

  setLoading(true);
  console.log("Attempting signup...");

  try {
    const response = await axios.post(`${API_BASE_URL}/signup`, {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
    });

    console.log("Signup success response:", response.data);
    Alert.alert("Success", "Account created successfully!");

    console.log("Resetting navigation stack to DateofBirthScreen...");

    // ✅ Reset navigation stack so going back exits app
    navigation.reset({
      index: 0,
      routes: [
        {
          name: "DateofBirthScreen",
          params: {
            userToken: response.data.token,
            userId: response.data._id,
          },
        },
      ],
    });

  } catch (error) {
    console.error(
      "Signup error:",
      error.response ? error.response.data : error.message
    );

    Alert.alert(
      "Signup Failed",
      error.response?.data?.message || "Something went wrong."
    );
  } finally {
    setLoading(false);
    console.log("Signup process finished.");
  }
};

  // Resend OTP with cooldown
  const handleResendOTP = async () => {
    if (resendCooldown > 0) return;

    setOtpSending(true);
    try {
      await axios.post(`${API_BASE_URL}/send`, {
        email: email.toLowerCase().trim(),
      });

      Alert.alert("Success", "Verification code resent successfully!");
      startResendCooldown();
    } catch (error) {
      console.error("Resend OTP error:", error);
      Alert.alert(
        "Error",
        "Failed to resend verification code. Please try again."
      );
    } finally {
      setOtpSending(false);
    }
  };

  // Start resend cooldown timer
  const startResendCooldown = () => {
    setResendCooldown(60);
    const timer = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Alert handlers
  const handleVerifyFromAlert = () => {
    setShowEmailAlert(false);
    // Focus on email input or trigger verification
    if (isCompleteEmail(email)) {
      handleVerifyEmail();
    } else {
      Alert.alert("Error", "Please enter a valid email address first.");
    }
  };

  const handleCloseAlert = () => {
    setShowEmailAlert(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Layered Gradient & Blob Background */}
      <View style={StyleSheet.absoluteFill}>
        <LinearGradient
          colors={["#33e6b3", "#1fa2ff", "#0a8fd8"]}
          style={{ flex: 1 }}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        <Svg height={height} width={width} style={{ position: "absolute" }}>
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
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustKeyboardInsets={true}
        >
          {/* Title */}
          <Text style={styles.titleText}>Create Account</Text>
          <Text style={styles.subtitleText}>
            Join us and start your journey!
          </Text>

          {/* Signup Form */}
          <View style={styles.form}>
            {/* Name Input */}
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor={COLORS.muted}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />

            {/* Email Input with Verify Icon */}
            <View style={styles.emailContainer}>
              <TextInput
                style={[
                  styles.input,
                  styles.emailInput,
                  isEmailVerified && styles.verifiedInput,
                ]}
                placeholder="Email"
                placeholderTextColor={COLORS.muted}
                value={email}
                onChangeText={handleEmailChange}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isEmailVerified}
              />
              {showVerifyIcon && (
                <TouchableOpacity
                  style={styles.verifyIcon}
                  onPress={handleVerifyEmail}
                  disabled={otpSending}
                >
                  {otpSending ? (
                    <ActivityIndicator size="small" color="#33e6b3" />
                  ) : (
                    <MaterialCommunityIcons
                      name="email-check-outline"
                      size={24}
                      color="#33e6b3"
                    />
                  )}
                </TouchableOpacity>
              )}
              {isEmailVerified && (
                <View style={styles.verifiedIcon}>
                  <MaterialCommunityIcons
                    name="check-circle"
                    size={24}
                    color="#22c55e"
                  />
                </View>
              )}
            </View>

            {/* OTP Input (shows when email verification is initiated) */}
            {showOtpField && !isEmailVerified && (
              <View style={styles.otpContainer}>
                <Text style={styles.otpLabel}>Enter verification code</Text>
                <View style={styles.otpBoxContainer}>
                  {otpValues.map((value, index) => (
                    <TextInput
                      key={index}
                      ref={(ref) => (otpRefs.current[index] = ref)}
                      style={[
                        styles.otpBox,
                        value ? styles.otpBoxFilled : null,
                      ]}
                      value={value}
                      onChangeText={(text) => {
                        if (text.length <= 1) {
                          handleOtpChange(text, index);
                        }
                      }}
                      onKeyPress={(e) => handleOtpKeyPress(e, index)}
                      keyboardType="numeric"
                      maxLength={1}
                      textAlign="center"
                      textAlignVertical="center"
                      selectTextOnFocus
                      multiline={false}
                      numberOfLines={1}
                    />
                  ))}
                </View>

                <TouchableOpacity
                  style={styles.verifyOtpButton}
                  onPress={handleVerifyOTP}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.verifyOtpButtonText}>Verify Code</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.resendButton}
                  onPress={handleResendOTP}
                  disabled={resendCooldown > 0 || otpSending}
                >
                  <Text
                    style={[
                      styles.resendText,
                      { opacity: resendCooldown > 0 ? 0.5 : 1 },
                    ]}
                  >
                    {resendCooldown > 0
                      ? `Resend code in ${resendCooldown}s`
                      : "Resend verification code"}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Password Input */}
            <View style={styles.passwordInput}>
              <TextInput
                style={[
                  styles.input,
                  { flex: 1, marginBottom: 0, paddingRight: 50 },
                ]}
                placeholder="Password"
                placeholderTextColor={COLORS.muted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!passwordVisible}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setPasswordVisible(!passwordVisible)}
                style={styles.eyeIcon}
              >
                <MaterialCommunityIcons
                  name={passwordVisible ? "eye" : "eye-off"}
                  size={22}
                  color={COLORS.muted}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Divider with OR */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Signup */}
          <View style={styles.socialRow}>
            <TouchableOpacity
              style={[styles.socialBtn, { backgroundColor: "#fff" }]}
            >
              <AntDesign name="google" size={28} color="#EA4335" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.socialBtn, { backgroundColor: "#22223B" }]}
            >
              <FontAwesome name="github" size={28} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.socialBtn, { backgroundColor: "#0A66C2" }]}
            >
              <AntDesign name="linkedin-square" size={28} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Signup Button */}
          <TouchableOpacity
            style={styles.signupButton}
            onPress={handleSignup}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Sign Up</Text>
            )}
          </TouchableOpacity>

          {/* Already have an account */}
          <TouchableOpacity
            onPress={() => navigation.navigate("Login")}
            style={styles.loginLink}
          >
            <Text style={styles.loginText}>
              Already have an account?{" "}
              <Text style={styles.loginLinkText}>Sign In</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Custom Email Alert */}
      <CustomEmailAlert
        visible={showEmailAlert}
        onClose={handleCloseAlert}
        onVerifyPress={handleVerifyFromAlert}
        title="Email Verification Required"
        message="Please verify your email address before creating your account. This helps us keep your account secure and ensures you receive important updates."
      />
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    paddingTop: 70,
    paddingBottom: 40,
    marginTop: 70,
  },
  titleText: {
    fontSize: 34,
    fontFamily: "Poppins_700Bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 4,
    letterSpacing: 1,
    textShadowColor: "rgba(30,41,59,0.18)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  subtitleText: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: "#f1f5f9",
    textAlign: "center",
    marginBottom: 28,
    opacity: 0.85,
  },
  form: {
    width: "88%",
    marginTop: 0,
    marginBottom: 12,
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: 16,
    paddingVertical: 15,
    paddingHorizontal: 20,
    fontSize: 16,
    color: COLORS.text,
    fontFamily: "Poppins_400Regular",
    marginBottom: 18,
    borderWidth: 1.5,
    borderColor: "rgba(0,0,0,0.04)",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },
  emailContainer: {
    position: "relative",
    marginBottom: 18,
  },
  emailInput: {
    paddingRight: 55,
    marginBottom: 0,
  },
  verifiedInput: {
    borderColor: "#22c55e",
    borderWidth: 2,
  },
  verifyIcon: {
    position: "absolute",
    right: 15,
    top: 15,
    zIndex: 2,
    padding: 5,
  },
  verifiedIcon: {
    position: "absolute",
    right: 15,
    top: 15,
    zIndex: 2,
    padding: 5,
  },

    otpContainer: {
    marginBottom: 18,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  otpLabel: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    color: "#fff",
    marginBottom: 15,
    textAlign: "center",
  },
  otpBoxContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    width: "85%",
    gap: 8,
  },
 

  otpBox: {
    flex: 1,
    height: 50,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 12,
    fontSize: 20,
    fontFamily: "Poppins_600SemiBold",
    color: COLORS.text,
    textAlign: "center",
    textAlignVertical: "center", // Add this for Android
    borderWidth: 2,
    borderColor: "rgba(51, 230, 179, 0.3)",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    // Remove the commented elevation
    justifyContent: "center", // Add this
    alignItems: "center", // Add this
    includeFontPadding: false, // Add this for Android to remove extra padding
    paddingTop: 0, // Add this
    paddingBottom: 0, // Add this
  },

  otpBoxFilled: {
    borderColor: "#33e6b3",
    backgroundColor: "rgba(51, 230, 179, 0.1)",
    textAlign: "center",
    textAlignVertical: "center", // Add this for Android consistency
  },
  verifyOtpButton: {
    backgroundColor: "#33e6b3",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 14,
    marginBottom: 12,
    shadowColor: "#33e6b3",
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
    width: "80%",
  },
  verifyOtpButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    textAlign: "center",
  },
  resendButton: {
    paddingVertical: 8,
  },
  resendText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 13,
    fontFamily: "Poppins_400Regular",
    textAlign: "center",
    textDecorationLine: "underline",
  },

  passwordInput: {
    position: "relative",
    marginBottom: 18,
  },
  eyeIcon: {
    position: "absolute",
    right: 16,
    top: 15,
    zIndex: 2,
    padding: 5,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
    width: "80%",
    alignSelf: "center",
  },
  dividerLine: {
    flex: 1,
    height: 1.5,
    backgroundColor: "rgba(255,255,255,0.35)",
    borderRadius: 1,
  },
  dividerText: {
    marginHorizontal: 12,
    color: "#fff",
    fontFamily: "Poppins_600SemiBold",
    fontSize: 15,
    opacity: 0.8,
    letterSpacing: 1,
  },
  socialRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 22,
    gap: 18,
  },
  socialBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 6,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 4,
  },
  signupButton: {
    backgroundColor: "#33e6b3",
    borderRadius: 16,
    paddingVertical: 17,
    marginTop: 8,
    marginBottom: 8,
    shadowColor: "#33e6b3",
    shadowOpacity: 0.18,
    shadowRadius: 6,
    // elevation: 3,
    width: "88%",
    alignSelf: "center",
  },
  disabledButton: {
    backgroundColor: "rgba(51, 230, 179, 0.5)",
    shadowOpacity: 0.1,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Poppins_600SemiBold",
    textAlign: "center",
    letterSpacing: 0.7,
  },
  loginText: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: "#e0e7ef",
    textAlign: "center",
    marginTop: 8,
  },
  loginLinkText: {
    color: "#33e6b3",
    fontFamily: "Poppins_600SemiBold",
  },
  loginLink: {
    marginTop: 8,
  },
});

const additionalStyles = StyleSheet.create({
  emailInputFocused: {
    borderColor: "#33e6b3",
    borderWidth: 2,
    backgroundColor: "rgba(255,255,255,0.95)",
  },

  emailInputWithIcon: {
    paddingRight: 55,
    marginBottom: 0,
    backgroundColor: "rgba(255,255,255,0.95)", // Ensure consistent background
  },
});


  


// Add this StyleSheet definition after your existing styles and before the export

const alertStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  alertContainer: {
    width: '90%',
    maxWidth: 340,
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
  },
  alertBackground: {
    padding: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  decorativeCircle1: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(51, 230, 179, 0.1)',
  },
  decorativeCircle2: {
    position: 'absolute',
    bottom: -40,
    left: -40,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(31, 162, 255, 0.08)',
  },
  iconContainer: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  iconGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#ff6b6b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  contentContainer: {
    marginBottom: 24,
  },
  alertTitle: {
    fontSize: 20,
    fontFamily: 'Poppins_700Bold',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  alertMessage: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 4,
  },
  buttonContainer: {
    gap: 12,
  },
  verifyButton: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#33e6b3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  verifyButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    gap: 8,
  },
  buttonIcon: {
    marginRight: 4,
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    letterSpacing: 0.5,
  },
  laterButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 16,
    backgroundColor: 'rgba(148, 163, 184, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
  },
  laterButtonText: {
    color: '#64748b',
    fontSize: 14,
    fontFamily: 'Poppins_500Medium',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
});