import React from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFonts, Poppins_700Bold, Poppins_400Regular } from '@expo-google-fonts/poppins';

export const COLORS = {
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

const bookmarkedCourses = [
  {
    id: '1',
    title: 'Learn Web Development',
    time: '2h 30m',
    tutor: 'Sudha',
    learners: 24,
    image: require('../assets/user.png'),
  },
  {
    id: '2',
    title: 'Learn JavaScript',
    time: '3h 15m',
    tutor: 'Srujana',
    learners: 36,
    image: require('../assets/user.png'),
  },
  {
    id: '3',
    title: 'Learn Mobile App Dev',
    time: '4h 45m',
    tutor: 'Reethu',
    learners: 18,
    image: require('../assets/user.png'),
  },
  {
    id: '4',
    title: 'UI/UX Design Basics',
    time: '5h 20m',
    tutor: 'Rohitha',
    learners: 42,
    image: require('../assets/user.png'),
  },
  {
    id: '5',
    title: 'UI/UX Design Basics',
    time: '5h 20m',
    tutor: 'Alekhya',
    learners: 42,
    image: require('../assets/user.png'),
  },
];

const SavedScreen = ({ navigation }) => {
  let [fontsLoaded] = useFonts({
    Poppins_700Bold,
    Poppins_400Regular,
  });

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" style={{ flex: 1, marginTop: 100 }} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Bookmarks</Text>
      <FlatList
        data={bookmarkedCourses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={item.image} style={styles.image} />
            <View style={styles.cardContent}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.tutor}>- {item.tutor}</Text>
              <Text style={styles.time}>{item.time}</Text>
              <View style={styles.learnerRow}>
                <Ionicons name="person-circle-outline" size={24} color="#999" />
                <Text style={styles.learners}>{item.learners} learners</Text>
              </View>
            </View>
            <TouchableOpacity>
              <Ionicons name="bookmark" size={24} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

export default SavedScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 20,
  },
  heading: {
    fontSize: 22,
    fontFamily: 'Poppins_700Bold',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 30,
    color: COLORS.secondary,
  },
  card: {
    backgroundColor: COLORS.card,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
  },
  title: {
    fontFamily: 'Poppins_400Regular',
    fontWeight: 'normal',
    color: COLORS.text,
    fontSize: 14,
  },
  tutor: {
    fontFamily: 'Poppins_400Regular',
    color: COLORS.muted,
    fontSize: 12,
  },
  time: {
    fontFamily: 'Poppins_400Regular',
    color: COLORS.muted,
    fontSize: 12,
  },
  learnerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  learners: {
    fontFamily: 'Poppins_400Regular',
    marginLeft: 4,
    fontSize: 12,
    color: COLORS.text,
  },
});
