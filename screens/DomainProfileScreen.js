import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "./constants";

const { width } = Dimensions.get("window");
import { IP } from "../Config/config";
const API_BASE_URL = `${IP}/api/auth`;

const domainColorMap = {
  "Web Development": "#34D399",
  "Artificial Intelligence": "#8BD0EC",
  "Machine Learning": "#A32769",
  "UI/UX Design": "#3B82F6",
  Cybersecurity: "#FF8A5C",
  Blockchain: "#7E57C2",
  "Cloud Computing": "#4DD0E1",
  "Data Science": "#F59E0B",
  "Internet of Things": "#00BFA5",
  "Mobile App Development": "#F472B6",
  Backend: "#8BD0EC",
  "Mobile Development": "#F472B6",
  Design: "#3B82F6",
};

const domainHeadingColor = "#3B82F6";
const preferredSkillColors = ["#34D399", "#3B82F6", "#8BD0EC"];

const skillColorMap = {
  HTML: "#34D399",
  CSS: "#3B82F6",
  JavaScript: "#8BD0EC",
  ReactJS: "#A32769",
  "React Native": "#3B82F6",
  Flutter: "#34D399",
  "Node.js": "#3B82F6",
  MongoDB: "#8BD0EC",
  Figma: "#34D399",
  "Adobe XD": "#3B82F6",
  Solidity: "#60A5FA",
  Ethereum: "#34D399",
};

export default function DomainProfileScreen({ route }) {
  const { person } = route.params;
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connectionCount, setConnectionCount] = useState(0);

  // const fetchProfileData = async () => {
  //   try {
  //     setLoading(true);
  //     const userId = person.id || person._id;
  //     const response = await fetch(
  //       `${API_BASE_URL}/profile/${userId}`
  //     );
  //     const result = await response.json();
  //     if (result.success) {
  //       setProfileData(result.data);
  //       setError(null);
  //     } else {
  //       setError(result.message || "Failed to fetch profile data");
  //     }
  //   } catch (err) {
  //     console.error("Error fetching profile:", err);
  //     setError("Network error. Please check your connection.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const userId = person.id || person._id;

      // Fetch profile
      const response = await fetch(`${API_BASE_URL}/profile/${userId}`);
      const result = await response.json();

      if (result.success) {
        setProfileData(result.data);
        setError(null);
      } else {
        setError(result.message || "Failed to fetch profile data");
      }

      // Fetch connection count
      const connectionRes = await fetch(`${IP}/api/connection/count/${userId}`);
      const connectionJson = await connectionRes.json();
      setConnectionCount(connectionJson.count || 0);
    } catch (err) {
      console.error("Error fetching profile or connection count:", err);
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text>Loading profile...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>{error}</Text>
        <TouchableOpacity onPress={fetchProfileData} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      {/* Profile Header Section */}
      <View style={styles.topProfileSectionVertical}>
        <View style={styles.profileImageContainerVertical}>
          <View style={styles.bubbleWrapper}>
            <View style={[styles.bubble, styles.bubble1]} />
            <View style={[styles.bubble, styles.bubble2]} />
            <View style={[styles.bubble, styles.bubble3]} />
            <View style={[styles.bubble, styles.bubble4]} />
          </View>
          <Image
            source={{ uri: profileData.image }}
            style={styles.profileImageVertical}
          />
        </View>

        <View style={styles.nameAndDetailsContainerVertical}>
          <Text style={styles.profileNameVertical}>
            {profileData.fullName || profileData.name}
          </Text>
          <Text style={styles.usernameText}>
            @
            {profileData.username ||
              profileData.name?.toLowerCase().replace(/\s+/g, "")}
          </Text>
          <Text style={styles.connectionText}>
            {connectionCount} connection{connectionCount === 1 ? "" : "s"}
          </Text>
        </View>
      </View>

      {/* Ratings Section */}
      <Text style={styles.sectionHeader}>Ratings</Text>
      <View style={styles.reviewChartContainer}>
        <View style={styles.starContainer}>
          <View style={styles.starsOnly}>
            {Array.from({ length: 5 }, (_, i) => (
              <Ionicons
                key={i}
                name={
                  i < Math.floor(profileData.rating || 0)
                    ? "star"
                    : i < (profileData.rating || 0)
                    ? "star-half"
                    : "star-outline"
                }
                size={20}
                color="#FFD700"
                style={{
                  marginRight: 10,

                  textShadowRadius: 1,

                  elevation: 2,
                }}
              />
            ))}
          </View>
          <Text style={styles.ratingNumber}>
            {typeof profileData.rating === "number"
              ? profileData.rating.toFixed(1)
              : "N/A"}
            /5
          </Text>
        </View>
      </View>

      {/* Personal Info Section */}
      <View style={styles.sectionTitleContainer}>
        <Text style={styles.sectionTitle}>Personal Info</Text>
      </View>

      <View style={styles.sectionContent}>
        <View
          style={[
            styles.detailItem,
            { borderLeftColor: COLORS.primary, backgroundColor: "#34D39920" },
          ]}
        >
          <Text style={styles.detailLabelBold}>Branch</Text>
          <Text style={styles.detailValueNormal}>{profileData.branch}</Text>
        </View>
        <View
          style={[
            styles.detailItem,
            { borderLeftColor: COLORS.secondary, backgroundColor: "#3B82F620" },
          ]}
        >
          <Text style={styles.detailLabelBold}>University</Text>
          <Text style={styles.detailValueNormal}>{profileData.university}</Text>
        </View>
        <View
          style={[
            styles.detailItem,
            { borderLeftColor: "#8BD0EC", backgroundColor: "#8BD0EC20" },
          ]}
        >
          <Text style={styles.detailLabelBold}>Location</Text>
          <Text style={styles.detailValueNormal}>{profileData.location}</Text>
        </View>

        {/* Skills Owned Section */}
        {profileData.domains?.length > 0 && (
          <>
            <Text style={[styles.sectionTitleAlt, { marginLeft: 10 }]}>
              Skills Owned
            </Text>
            {profileData.domains.map((domainObj, index) => (
              <View key={index}>
                <Text
                  style={[
                    styles.domainHeadingGeneric,
                    {
                      color:
                        domainColorMap[domainObj.name] || domainHeadingColor,
                      borderBottomColor:
                        (domainColorMap[domainObj.name] || domainHeadingColor) +
                        "40",
                      marginLeft: 10,
                    },
                  ]}
                >
                  {domainObj.name}
                </Text>
                <View style={styles.domainCardContainer}>
                  {domainObj.subskills?.map((item, idx) => {
                    const color =
                      skillColorMap[item.skill] ||
                      domainColorMap[domainObj.name] ||
                      COLORS.primary;
                    return (
                      <View
                        key={idx}
                        style={[
                          styles.domainCard,
                          { backgroundColor: color + "15" },
                        ]}
                      >
                        <Text style={styles.domainTitle}>{item.skill}</Text>
                        <Text style={[styles.levelText, { color }]}>
                          {item.level}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            ))}
          </>
        )}

        {/* Skills To Learn Section */}
        {profileData.wantsToLearn?.length > 0 && (
          <>
            <Text style={[styles.sectionTitleAlt, { marginLeft: 10 }]}>
              Skills To Learn
            </Text>
            {profileData.wantsToLearn.map((domainItem, idx) => (
              <View key={idx} style={{ marginBottom: 20 }}>
                <Text
                  style={[
                    styles.domainHeadingGeneric,
                    {
                      color:
                        domainColorMap[domainItem.domain] || domainHeadingColor,
                      borderBottomColor:
                        (domainColorMap[domainItem.domain] ||
                          domainHeadingColor) + "40",
                      marginLeft: 10,
                    },
                  ]}
                >
                  {domainItem.domain}
                </Text>
                <View
                  style={[
                    styles.domainCardContainer,
                    { flexDirection: "row", flexWrap: "wrap" },
                  ]}
                >
                  {domainItem.skills?.map((skill, subIdx) => {
                    const skillColor =
                      domainColorMap[domainItem.domain] ||
                      preferredSkillColors[
                        (subIdx + idx) % preferredSkillColors.length
                      ];
                    return (
                      <View
                        key={subIdx}
                        style={{
                          backgroundColor: skillColor + "15",
                          alignSelf: "flex-start",
                          paddingHorizontal: 12,
                          paddingVertical: 6,
                          borderRadius: 20,
                          marginRight: 8,
                          marginTop: 6,
                        }}
                      >
                        <Text
                          style={[styles.domainTitle, { color: skillColor }]}
                        >
                          {skill}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            ))}
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  retryButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "white",
  },
  scrollViewContent: {
    flexGrow: 1,
    backgroundColor: COLORS.background || "#F2F2F7",
  },
  topProfileSectionVertical: {
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: COLORS.white,
    marginBottom: -8,
  },
  profileImageContainerVertical: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.lightGray,
    justifyContent: "center",
    alignItems: "center",
  },
  bubbleWrapper: {
    position: "absolute",
    width: 120,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
  },
  bubble: {
    position: "absolute",
    borderRadius: 100,
    borderWidth: 1.2,
  },
  bubble1: { width: 20, height: 20, top: 10, left: 10, borderColor: "#3B82F6" },
  bubble2: {
    width: 16,
    height: 16,
    bottom: -10,
    right: 10,
    borderColor: "#34D399",
  },
  bubble3: {
    width: 14,
    height: 14,
    top: 10,
    right: -12,
    borderColor: "#8BD0EC",
  },
  bubble4: {
    width: 10,
    height: 10,
    bottom: 0,
    left: -10,
    borderColor: "#3B82F6",
  },
  profileImageVertical: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  nameAndDetailsContainerVertical: {
    alignItems: "center",
  },
  profileNameVertical: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 19,
    color: COLORS.text,
  },
  usernameText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 13,
    color: "#999",
    marginTop: -4,
    marginBottom: 4,
  },
  connectionText: {
    fontFamily: "Poppins_500Medium",
    fontSize: 13,
    color: "#34D399",
    marginTop: 4,
  },
  sectionHeader: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 18,
    color: "#000",
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 6,
  },
  reviewChartContainer: {
    marginHorizontal: 20,
    padding: 10,
    backgroundColor: "#E6F4F1",
    borderRadius: 10,
    marginBottom: 15,
  },
  starContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 6,
  },
  ratingNumber: {
    fontSize: 12,
    color: "#444",
    fontFamily: "Poppins_600SemiBold",
  },
  starsOnly: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionTitleContainer: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
    color: COLORS.text,
  },
  sectionContent: {
    paddingHorizontal: 10,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    margin: 10,
    paddingVertical: 15,
  },
  detailItem: {
    flexDirection: "column",
    alignItems: "flex-start",
    padding: 8,
    paddingHorizontal: 12,
    borderLeftWidth: 4,
    marginBottom: 12,
    borderRadius: 10,
    gap: 2,
  },
  detailLabelBold: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 13,
    color: COLORS.text,
  },
  detailValueNormal: {
    fontFamily: "Poppins_400Regular",
    fontSize: 13,
    color: COLORS.darkGray,
  },
  sectionTitleAlt: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
    color: COLORS.text,
    marginTop: 20,
    marginBottom: 10,
  },
  domainHeadingGeneric: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 14,
    marginTop: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    paddingBottom: 6,
  },
  domainCardContainer: {
    paddingHorizontal: 10,
    gap: 12,
  },
  domainCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderRadius: 20,
  },
  domainTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 12,
    flexShrink: 1,
  },
  levelText: {
    fontSize: 12,
    fontFamily: "Poppins_600SemiBold",
  },
});
