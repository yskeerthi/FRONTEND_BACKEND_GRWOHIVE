import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  Modal,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import Carousel from "react-native-reanimated-carousel";
import * as SecureStore from "expo-secure-store";
import {
  useFonts,
  Poppins_700Bold,
  Poppins_400Regular,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";
import { createStackNavigator } from "@react-navigation/stack";
import axios from "axios";

import DomainScreen from "./DomainScreen";
import { COLORS, CAROUSEL_DATA } from "./constants";
import styles from "./HomeStyles.js";
import DomainProfileScreen from "./DomainProfileScreen";

import { IP } from "../Config/config";
const API_BASE_URL = `${IP}/api/auth`;

const { width } = Dimensions.get("window");

function LearnerAvatars({ avatars, count }) {
  return (
    <View style={styles.avatarsRow}>
      <View style={styles.avatarsStack}>
        {avatars &&
          avatars
            .slice(0, 2)
            .map((uri, idx) => (
              <Image
                key={idx}
                source={{ uri }}
                style={[
                  styles.avatarImage,
                  idx !== 0 && styles.avatarImageOverlap,
                ]}
                onError={() => console.log("Avatar image failed to load:", uri)}
                defaultSource={require("../assets/Wallet.jpg")}
              />
            ))}
      </View>
      <Text style={styles.avatarsCount}>{count} Domain Experts</Text>
    </View>
  );
}

function CourseCard({ course, onPress }) {
  // Debug logging for course data
  // console.log("CourseCard course data:", JSON.stringify(course, null, 2));

  // Get the title with fallback options
  const courseTitle =
    course.title ||
    course.name ||
    course.domain ||
    course.courseName ||
    "Untitled Course";

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <View style={styles.courseCard}>
        <Image
          source={{ uri: course.image }}
          style={styles.courseImage}
          onError={() =>
            console.log("Course image failed to load:", course.image)
          }
        />
        <View style={{ flex: 1 }}>
          <View style={styles.courseCardHeader}>
            <View style={styles.courseTitleContainer}>
              <Text style={styles.courseTitle}>{courseTitle}</Text>
            </View>
          </View>
          <View style={styles.courseCardFooter}>
            <LearnerAvatars
              avatars={course.learnersAvatars || []}
              count={course.learners || 0}
            />
            <TouchableOpacity>
              <MaterialCommunityIcons
                name={course.bookmarked ? "bookmark" : "bookmark-outline"}
                size={22}
                color={course.bookmarked ? COLORS.secondary : "#bdbdbd"}
                style={styles.bookmarkIcon}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function AllCoursesModal({ visible, onClose, courses, navigation, loading }) {
  return (
    <Modal visible={visible} animationType="slide">
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
        <View
          style={{
            paddingHorizontal: 20,
            paddingTop: 10,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={[styles.sectionTitle, { fontSize: 20 }]}>
            All Free Learning
          </Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={[styles.sectionAction, { fontSize: 16 }]}>Close</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View
            style={[
              styles.centeredContainer,
              { flex: 1, justifyContent: "center" },
            ]}
          >
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={{ marginTop: 10, color: "#666" }}>
              Loading all domains...
            </Text>
          </View>
        ) : (
          <ScrollView
            style={{ flex: 1, marginTop: 10 }}
            showsVerticalScrollIndicator={false}
          >
            <View style={{ paddingHorizontal: 20, paddingBottom: 30 }}>
              {courses && courses.length > 0 ? (
                <>
                  <Text
                    style={{ color: "#666", fontSize: 14, marginBottom: 15 }}
                  >
                    Found {courses.length} domains
                  </Text>
                  {courses.map((course, index) => {
                    console.log(
                      `Rendering course ${index}:`,
                      JSON.stringify(course, null, 2)
                    );

                    // Get the title with fallback options
                    const courseTitle =
                      course.title ||
                      course.name ||
                      course.domain ||
                      course.courseName ||
                      "Untitled Course";

                    return (
                      <CourseCard
                        key={course.id || `course-${index}`}
                        course={course}
                        onPress={() => {
                          console.log(
                            "Course pressed - Full object:",
                            JSON.stringify(course, null, 2)
                          );
                          console.log(
                            "Course title being passed:",
                            courseTitle
                          );
                          console.log("Course ID being passed:", course.id);

                          onClose();
                          navigation.navigate("DomainScreen", {
                            domain: "Web Development", // Use the title with fallback
                            domainId: "web-development",
                            courseData: course, // Pass the full course object for debugging
                          });
                        }}
                      />
                    );
                  })}
                </>
              ) : (
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    paddingTop: 50,
                  }}
                >
                  <Text
                    style={{ color: "#666", fontSize: 16, textAlign: "center" }}
                  >
                    No domains available at the moment.
                  </Text>
                  <Text
                    style={{
                      color: "#999",
                      fontSize: 14,
                      textAlign: "center",
                      marginTop: 10,
                    }}
                  >
                    Please try again later.
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
    </Modal>
  );
}

function HomeScreen({ navigation }) {
  const [fontsLoaded] = useFonts({
    Poppins_700Bold,
    Poppins_400Regular,
    Poppins_600SemiBold,
  });

  const [showAll, setShowAll] = useState(false);
  const [courses, setCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allCoursesLoading, setAllCoursesLoading] = useState(false);
  const [userName, setUserName] = useState("Learner");

  useEffect(() => {
    const fetchUserLearningDomains = async () => {
      try {
        setLoading(true);
        const userId = await SecureStore.getItemAsync("userId");

        if (!userId) {
          console.warn("User ID not found in SecureStore");
          return;
        }

        const res = await axios.get(
          `${API_BASE_URL}/user-learning-domains/${userId}`
        );
        console.log(
          "User Learning Domains Response:",
          // JSON.stringify(res.data, null, 2)
        );

        setUserName(res.data.userName || "Learner");

        // Debug the domains data structure
        const domains = res.data.domains || [];
        console.log("Domains array:", JSON.stringify(domains, null, 2));

        setCourses(domains);
      } catch (err) {
        console.error(
          "Fetch error:",
          err.response?.status,
          err.response?.data || err.message
        );
        Alert.alert("Error", "Could not load your learning domains.");
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserLearningDomains();
  }, []);

  const fetchAllDomains = async () => {
    try {
      setAllCoursesLoading(true);
      console.log("Fetching all domains...");
      const res = await axios.get(`${API_BASE_URL}/all-domains`);
      console.log("All Domains Response:", JSON.stringify(res.data, null, 2));

      // Ensure we're setting an array
      const domainsData = Array.isArray(res.data) ? res.data : [];
      console.log(
        "Processed domains data:",
        JSON.stringify(domainsData, null, 2)
      );

      setAllCourses(domainsData);

      if (domainsData.length === 0) {
        console.warn("No domains returned from API");
      }
    } catch (err) {
      console.error(
        "Error fetching all domains:",
        err.response?.status,
        err.response?.data || err.message
      );
      Alert.alert("Error", "Failed to load all domains.");
      setAllCourses([]);
    } finally {
      setAllCoursesLoading(false);
    }
  };

  const handleSeeAll = async () => {
    console.log(
      "See All clicked, current allCourses length:",
      allCourses.length
    );

    try {
      // Always fetch fresh data when "See All" is clicked
      await fetchAllDomains();
      console.log(
        "Data fetched, opening modal with courses:",
        allCourses.length
      );
      setShowAll(true);
    } catch (error) {
      console.error("Error in handleSeeAll:", error);
      Alert.alert("Error", "Failed to load domains. Please try again.");
    }
  };

  if (!fontsLoaded) return <View style={styles.screenBackground} />;

  const previewCourses = courses.slice(0, 3);

  return (
    <View style={styles.screenBackground}>
      <ScrollView
        style={[styles.scrollView, { marginTop: 0 }]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[styles.greetingContainer, { marginTop: 12, paddingTop: 0 }]}
        >
          <Text style={styles.greetingText}>Hello, {userName}!</Text>
          <Text style={styles.greetingSubText}>Together, We Thrive.</Text>
        </View>

        <View style={styles.carouselContainer}>
          <Carousel
            loop
            width={width - 40}
            height={140}
            autoPlay={true}
            data={CAROUSEL_DATA}
            scrollAnimationDuration={1400}
            style={styles.carousel}
            renderItem={({ item }) => (
              <View style={styles.carouselItem}>
                <Image
                  source={{ uri: item.image }}
                  style={styles.carouselImage}
                  resizeMode="cover"
                />
                <View style={styles.carouselOverlay}>
                  <Text style={styles.carouselTitle}>{item.title}</Text>
                  <Text style={styles.carouselSubtitle}>{item.subtitle}</Text>
                </View>
              </View>
            )}
          />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Free Learning</Text>
          <TouchableOpacity onPress={handleSeeAll}>
            <Text>See All</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.centeredContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={{ marginTop: 10, color: "#666" }}>
              Loading your learning domains...
            </Text>
          </View>
        ) : (
          <View style={styles.coursesContainer}>
            {previewCourses.length > 0 ? (
              previewCourses.map((course) => {
                // Get the title with fallback options
                const courseTitle =
                  course.title ||
                  course.name ||
                  course.domain ||
                  course.courseName ||
                  "Untitled Course";

                console.log(
                  "Rendering preview course:",
                  JSON.stringify(course, null, 2)
                );
                console.log("Using title:", courseTitle);

                return (
                  <CourseCard
                    key={course.id}
                    course={course}
                 

                    onPress={() => {
                      console.log("Preview course pressed:", course);
                      navigation.navigate("Domain", {
                        domainTitle: courseTitle, // Use consistent key
                        domainId: course.id || `course-${index}`, // Ensure ID is always passed
                        courseData: course, // Optional for debugging
                      });
                    }}
                  />
                );
              })
            ) : (
              <View style={styles.centeredContainer}>
                <Text style={{ color: "#666", fontSize: 16 }}>
                  No learning domains found.
                </Text>
                <Text style={{ color: "#999", fontSize: 14, marginTop: 5 }}>
                  Add skills you want to learn in your profile to see relevant
                  domains.
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      <AllCoursesModal
        visible={showAll}
        onClose={() => setShowAll(false)}
        courses={allCourses}
        navigation={navigation}
        loading={allCoursesLoading}
      />
    </View>
  );
}

const Stack = createStackNavigator();

export default function HomeStackScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Domain"
        component={DomainScreen}
        options={{ title: "Domain Profiles", headerShown: false }}
      />
      <Stack.Screen
        name="DomainProfileScreen"
        component={DomainProfileScreen}
        options={{ headerShown: false }}
        />
    </Stack.Navigator>
  );
}


