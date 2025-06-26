import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  ActivityIndicator,
  Alert,
  BackHandler,
} from 'react-native';
import DateTimePicker from 'react-native-ui-datepicker';
import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import {
  useFonts,
  Poppins_700Bold,
  Poppins_600SemiBold,
  Poppins_500Medium,
  Poppins_400Regular,
} from '@expo-google-fonts/poppins';
import axios from 'axios';

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

const { width } = Dimensions.get('window');

const API_BASE_URL = 'http://192.168.137.1:5000/api/auth';

export default function DateOfBirthScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date(2003, 4, 6));
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const { userToken, userId } = route.params || {};

  const [fontsLoaded] = useFonts({
    Poppins_700Bold,
    Poppins_600SemiBold,
    Poppins_500Medium,
    Poppins_400Regular,
  });

  const translateX = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: 1 - Math.abs(translateX.value) / width,
  }));

  // ✅ Prevent hardware/gesture back and exit the app
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        BackHandler.exitApp();
        return true;
      };

      const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => backHandler.remove(); // ✅ Correct way to remove listener
    }, [])
  );

  const formatDate = (date) => {
    if (!date) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const handleNext = async () => {
    if (!selectedDate) {
      Alert.alert('Error', 'Please select your date of birth.');
      return;
    }

    setLoading(true);

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
      };

      await axios.put(
        `${API_BASE_URL}/complete-profile`,
        { dateOfBirth: selectedDate.toISOString() },
        config
      );

      navigation.navigate('PersonalDetailsScreen', { userToken, userId });
    } catch (error) {
      Alert.alert(
        'Update Failed',
        error.response?.data?.message || 'Failed to save date of birth. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.secondary} />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Animated.View style={[styles.container, animatedStyle]}>
        <Text style={styles.title}>Date of Birth</Text>
        <Text style={styles.selectedDateText}>{formatDate(selectedDate)}</Text>
        <Text style={styles.subtitle}>
          Tell us your birth date to personalize your experience.
        </Text>

        <View style={styles.card}>
          <DateTimePicker
            mode="single"
            date={selectedDate}
            onChange={({ date }) => date && setSelectedDate(date)}
            locale="en"
            calendarTextStyle={{
              color: COLORS.text,
              fontFamily: 'Poppins_500Medium',
            }}
            headerTextStyle={{
              color: COLORS.secondary,
              fontFamily: 'Poppins_700Bold',
              fontSize: 20,
            }}
            selectedItemColor={COLORS.primary}
            selectedTextStyle={{
              color: COLORS.primary,
              fontFamily: 'Poppins_700Bold',
            }}
            selectedItemBackgroundColor="transparent"
            todayTextStyle={{
              color: COLORS.primary,
              fontFamily: 'Poppins_700Bold',
            }}
            dayContainerStyle={{
              borderRadius: 20,
            }}
            style={styles.datePickerStyle}
          />
        </View>

        <Pressable
          onPress={handleNext}
          style={styles.nextButton}
          android_ripple={{ color: COLORS.primary }}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.card} size="small" />
          ) : (
            <Text style={styles.nextButtonText}>Next</Text>
          )}
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 70,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Poppins_700Bold',
    color: COLORS.text,
    marginBottom: 4,
    alignSelf: 'flex-start',
  },
  selectedDateText: {
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold',
    color: COLORS.secondary,
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.muted,
    marginBottom: 30,
    alignSelf: 'flex-start',
    lineHeight: 22,
    fontFamily: 'Poppins_600SemiBold',
  },
  card: {
    width: '100%',
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 20,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 40,
  },
  datePickerStyle: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    padding: 0,
  },
  nextButton: {
    backgroundColor: COLORS.secondary,
    borderRadius: 12,
    paddingHorizontal: 36,
    paddingVertical: 12,
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
