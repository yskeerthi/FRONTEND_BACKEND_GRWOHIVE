import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  Modal,
  Easing,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { BlurView } from "expo-blur";

const { width, height } = Dimensions.get("window");

const CustomEmailAlert = ({
  visible,
  onClose,
  onVerifyPress,
  title = "Email Verification Required",
  message = "Please verify your email address before creating your account. This helps us keep your account secure.",
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
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
          styles.overlay,
          {
            opacity: opacityAnim,
          },
        ]}
      >
        <BlurView intensity={20} style={StyleSheet.absoluteFill} />

        <Animated.View
          style={[
            styles.alertContainer,
            {
              transform: [{ scale: scaleAnim }, { translateY: slideAnim }],
            },
          ]}
        >
          {/* Gradient Background */}
          <LinearGradient
            colors={["#ffffff", "#f8fafc"]}
            style={styles.alertBackground}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {/* Decorative Elements */}
            <View style={styles.decorativeCircle1} />
            <View style={styles.decorativeCircle2} />

            {/* Icon with Pulse Animation */}
            <Animated.View
              style={[
                styles.iconContainer,
                {
                  transform: [{ scale: pulseAnim }],
                },
              ]}
            >
              <LinearGradient
                colors={["#ff6b6b", "#ee5a24"]}
                style={styles.iconGradient}
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
            <View style={styles.contentContainer}>
              <Text style={styles.alertTitle}>{title}</Text>
              <Text style={styles.alertMessage}>{message}</Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.verifyButton}
                onPress={onVerifyPress}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={["#33e6b3", "#1fa2ff"]}
                  style={styles.verifyButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <MaterialCommunityIcons
                    name="email-check-outline"
                    size={20}
                    color="#fff"
                    style={styles.buttonIcon}
                  />
                  <Text style={styles.verifyButtonText}>Verify Email</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.laterButton}
                onPress={onClose}
                activeOpacity={0.7}
              >
                <Text style={styles.laterButtonText}>Maybe Later</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  alertContainer: {
    width: width * 0.9,
    maxWidth: 380,
    borderRadius: 24,
    overflow: "hidden",
    elevation: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
  },
  alertBackground: {
    padding: 0,
    position: "relative",
    overflow: "hidden",
  },
  decorativeCircle1: {
    position: "absolute",
    top: -30,
    right: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(51, 230, 179, 0.1)",
  },
  decorativeCircle2: {
    position: "absolute",
    bottom: -20,
    left: -20,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(31, 162, 255, 0.08)",
  },
  iconContainer: {
    alignSelf: "center",
    marginTop: 32,
    marginBottom: 20,
    elevation: 8,
    shadowColor: "#ff6b6b",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  iconGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  alertTitle: {
    fontSize: 22,
    fontFamily: "Poppins_700Bold",
    color: "#1a202c",
    textAlign: "center",
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  alertMessage: {
    fontSize: 15,
    fontFamily: "Poppins_400Regular",
    color: "#4a5568",
    textAlign: "center",
    lineHeight: 22,
    opacity: 0.9,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 28,
    gap: 12,
  },
  verifyButton: {
    borderRadius: 16,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#33e6b3",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  verifyButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 8,
  },
  buttonIcon: {
    marginRight: 4,
  },
  verifyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    letterSpacing: 0.5,
  },
  laterButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: "rgba(74, 85, 104, 0.1)",
    alignItems: "center",
  },
  laterButtonText: {
    color: "#718096",
    fontSize: 15,
    fontFamily: "Poppins_500Medium",
  },
});

export default CustomEmailAlert;
