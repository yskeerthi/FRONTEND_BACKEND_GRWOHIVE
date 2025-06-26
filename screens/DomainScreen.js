// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   FlatList,
//   Image,
//   ActivityIndicator,
//   Alert,
//   ScrollView,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import {
//   useFonts,
//   Poppins_700Bold,
//   Poppins_400Regular,
//   Poppins_600SemiBold,
// } from "@expo-google-fonts/poppins";
// import { createStackNavigator } from "@react-navigation/stack";
// import styles from "./SearchStyles.js";
// import { COLORS } from "./constants";

// import ChatScreen from "./ChatScreen.js";
// import { IP } from "../Config/config";
// const API_BASE_URL = `${IP}/api/auth`;

// const FALLBACK_EXPERTS = [
//   {
//     id: "1",
//     name: "Test Expert",
//     email: "test@example.com",
//     profileImageUrl: "https://via.placeholder.com/100x100",
//     bio: "Test bio",
//     location: "Test Location",
//     university: "Test University",
//     skills: [
//       { skill: "React", proficiency: "Expert", domain: "Web Development" },
//       { skill: "JavaScript", proficiency: "Expert", domain: "Web Development" },
//     ],
//     wantsToLearn: ["Node.js", "TypeScript"],
//   },
// ];

// function ProfileCard({ person, navigation }) {
//   const [showMessageIcon, setshowMessageIcon] = useState(false);

//   const handleCardPress = () => {
//     navigation.navigate("DomainProfileScreen", { person });
//   };

//   const handleIconPress = () => {
//     if (!showMessageIcon) {
//       setshowMessageIcon(true);
//     }
//   };

//   const skillNames = person.skills?.map((skill) => skill.skill) || [];
//   const wantsToLearn = person.wantsToLearn || [];

//   return (
//     <TouchableOpacity activeOpacity={0.8} onPress={handleCardPress}>
//       <View style={styles.card}>
//         <Image
//           source={{
//             uri: person.profileImageUrl || "https://via.placeholder.com/64",
//           }}
//           style={styles.avatar}
//         />
//         <View style={{ flex: 1 }}>
//           <View
//             style={{
//               flexDirection: "row",
//               alignItems: "center",
//               justifyContent: "space-between",
//             }}
//           >
//             <Text style={styles.cardName}>{person.name}</Text>
//             <View style={{ width: 30, alignItems: "flex-end" }}>
//               <TouchableOpacity onPress={handleIconPress}>
//                 <Ionicons
//                   name={showMessageIcon ? "checkmark-done" : "person-add"}
//                   size={26}
//                   color="#8BD0EC"
//                 />
//               </TouchableOpacity>
//             </View>
//           </View>
//           <Text style={styles.cardEdu}>
//             {person.university}, {person.location}
//           </Text>

//           {/* Skills */}
//           {skillNames.length > 0 && (
//             <View
//               style={{
//                 flexDirection: "row",
//                 flexWrap: "wrap",
//                 marginBottom: 2,
//               }}
//             >
//               {skillNames.map((skill, idx) => (
//                 <View key={idx} style={styles.skillTag}>
//                   <Text style={styles.skillText}>{skill}</Text>
//                 </View>
//               ))}
//             </View>
//           )}

//           {wantsToLearn.length > 0 && (
//             <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
//               {wantsToLearn.map((want, idx) => (
//                 <View key={idx} style={styles.wantTag}>
//                   <Text style={styles.wantText}>{want}</Text>
//                 </View>
//               ))}
//             </View>
//           )}
//         </View>
//       </View>
//     </TouchableOpacity>
//   );
// }

// function DomainScreen({ navigation, route }) {
//   const [experts, setExperts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchText, setSearchText] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [hasNextPage, setHasNextPage] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);
//   const [error, setError] = useState(null);
//   const [searchLoading, setSearchLoading] = useState(false);

//   const searchTimeoutRef = React.useRef(null);

//   const params = route?.params || {};
//   const navState = navigation?.getState?.() || {};
//   const currentRoute = navState?.routes?.[navState?.index] || {};

//   const domainTitle =
//     params.courseTitle ||
//     params.domain ||
//     params.domainTitle ||
//     currentRoute?.params?.courseTitle ||
//     currentRoute?.params?.domain;
//   const domainId =
//     params.courseId ||
//     params.domainId ||
//     currentRoute?.params?.courseId ||
//     currentRoute?.params?.domainId;
//   const courseData = params.courseData || currentRoute?.params?.courseData;

//   useEffect(() => {
//     return () => {
//       if (searchTimeoutRef.current) {
//         clearTimeout(searchTimeoutRef.current);
//       }
//     };
//   }, []);

//   let [fontsLoaded] = useFonts({
//     Poppins_700Bold,
//     Poppins_400Regular,
//     Poppins_600SemiBold,
//   });

//   const fetchExperts = async (
//     page = 1,
//     search = "",
//     testDomain = null,
//     resetData = true
//   ) => {
//     try {
//       if (resetData) {
//         setLoading(page === 1);
//         setSearchLoading(!!search);
//       }
//       setError(null);

//       const targetDomain = testDomain || domainTitle;

//       if (!targetDomain) {
//         throw new Error("No domain title provided");
//       }

//       const encodedDomainName = encodeURIComponent(targetDomain);
//       let endpoint = `/domain-experts/${encodedDomainName}?page=${page}`;

//       const controller = new AbortController();
//       const timeoutId = setTimeout(() => controller.abort(), 15000);

//       const response = await fetch(`${API_BASE_URL}${endpoint}`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Accept: "application/json",
//         },
//         signal: controller.signal,
//       });

//       clearTimeout(timeoutId);

//       const responseText = await response.text();

//       if (!response.ok) {
//         throw new Error(`HTTP ${response.status}: ${responseText}`);
//       }

//       let data;
//       try {
//         data = JSON.parse(responseText);
//       } catch (parseError) {
//         throw new Error(`Invalid JSON response: ${responseText}`);
//       }

//       if (page === 1 || resetData) {
//         setExperts(data.experts || []);
//       } else {
//         setExperts((prev) => [...prev, ...(data.experts || [])]);
//       }

//       setCurrentPage(data.currentPage || 1);
//       setTotalPages(data.totalPages || 1);
//       setHasNextPage(data.hasNextPage || false);
//     } catch (error) {
//       setError(error.message);

//       if (error.name === "AbortError") {
//         Alert.alert(
//           "Timeout",
//           "Request timed out. Please check your internet connection and try again."
//         );
//       } else if (error.message.includes("Network request failed")) {
//         Alert.alert(
//           "Network Error",
//           "Unable to connect to server. Please check if your server is running and accessible."
//         );
//       } else if (error.message.includes("Invalid JSON")) {
//         Alert.alert(
//           "Server Error",
//           "Server returned invalid response. Please check server logs."
//         );
//       } else if (error.message.includes("No domain title provided")) {
//         Alert.alert(
//           "Error",
//           "Domain information is missing. Please go back and try again."
//         );
//       } else {
//         Alert.alert("Error", `Failed to fetch experts: ${error.message}`);
//       }

//       if (page === 1 || resetData) {
//         setExperts([]);
//       }
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//       setSearchLoading(false);
//     }
//   };

//   const clientSideFilter = (experts, searchQuery) => {
//     if (!searchQuery.trim()) return experts;

//     const query = searchQuery.toLowerCase().trim();

//     const filteredExperts = experts.filter((person) => {
//       const nameMatch = person.name?.toLowerCase().includes(query);

//       const universityMatch = person.university?.toLowerCase().includes(query);

//       const skillsMatch =
//         person.skills?.some((skill) => {
//           const skillName = skill.skill?.toLowerCase() || skill.toLowerCase();
//           return skillName.includes(query);
//         }) || false;

//       const locationMatch = person.location?.toLowerCase().includes(query);

//       const wantsToLearnMatch =
//         person.wantsToLearn?.some((want) =>
//           want.toLowerCase().includes(query)
//         ) || false;

//       const bioMatch = person.bio?.toLowerCase().includes(query) || false;

//       const isMatch =
//         nameMatch ||
//         universityMatch ||
//         skillsMatch ||
//         locationMatch ||
//         wantsToLearnMatch ||
//         bioMatch;

//       if (query.includes("react")) {
//         console.log(`👤 ${person.name}:`, {
//           skills: person.skills,
//           skillsMatch,
//           nameMatch,
//           universityMatch,
//           isMatch,
//         });
//       }

//       return isMatch;
//     });

//     return filteredExperts;
//   };

//   useEffect(() => {
//     if (domainTitle) {
//       fetchExperts(1, "", null, true);
//     } else {
//       setExperts(FALLBACK_EXPERTS);
//       setLoading(false);
//     }
//   }, [domainTitle]);

//   const handleSearch = (text) => {
//     setSearchText(text);

//     if (searchTimeoutRef.current) {
//       clearTimeout(searchTimeoutRef.current);
//     }

//     if (text.trim()) {
//       setSearchLoading(true);
//     } else {
//       setSearchLoading(false);
//     }

//     searchTimeoutRef.current = setTimeout(() => {
//       setSearchLoading(false);
//     }, 300);
//   };

//   const handleLoadMore = () => {
//     if (hasNextPage && !loading && !searchLoading) {
//       fetchExperts(currentPage + 1, searchText, null, false);
//     }
//   };

//   const handleRefresh = () => {
//     setRefreshing(true);
//     fetchExperts(1, searchText, null, true);
//   };

//   const clearSearch = () => {
//     setSearchText("");
//     setSearchLoading(false);
//     if (searchTimeoutRef.current) {
//       clearTimeout(searchTimeoutRef.current);
//     }
//   };

//   const renderFooter = () => {
//     if (!hasNextPage) return null;

//     return (
//       <View style={{ padding: 20, alignItems: "center" }}>
//         <ActivityIndicator size="small" color="#4A90E2" />
//         <Text style={{ marginTop: 10, color: "#666" }}>
//           Loading more experts...
//         </Text>
//       </View>
//     );
//   };

//   if (!fontsLoaded) {
//     return (
//       <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//         <ActivityIndicator size="large" color="#4A90E2" />
//       </View>
//     );
//   }

//   const displayedExperts = clientSideFilter(experts, searchText);

//   return (
//     <View style={{ flex: 1, backgroundColor: COLORS.background }}>
//       <View style={styles.container}>
//         <View
//           style={{
//             paddingHorizontal: 16,
//             paddingTop: 16,
//             paddingBottom: 12,
//             backgroundColor: COLORS.background,
//           }}
//         >
//           <View
//             style={{
//               flexDirection: "row",
//               alignItems: "center",
//               backgroundColor: "#f8f9fa",
//               borderRadius: 25,
//               paddingHorizontal: 16,
//               paddingVertical: 12,
//               shadowColor: "#000",
//               shadowOffset: { width: 0, height: 2 },
//               shadowOpacity: 0.1,
//               shadowRadius: 4,
//               elevation: 2,
//               borderWidth: 1,
//               borderColor: searchLoading ? "#4A90E2" : "#e9ecef",
//             }}
//           >
//             {searchLoading ? (
//               <ActivityIndicator
//                 size={20}
//                 color="#4A90E2"
//                 style={{ marginRight: 12 }}
//               />
//             ) : (
//               <Ionicons
//                 name="search-outline"
//                 size={20}
//                 color="#6c757d"
//                 style={{ marginRight: 12 }}
//               />
//             )}
//             <TextInput
//               style={{
//                 flex: 1,
//                 fontSize: 16,
//                 color: "#333",
//                 fontFamily: "Poppins_400Regular",
//                 paddingVertical: 0,
//               }}
//               placeholder="Search by name, university, or skills..."
//               placeholderTextColor="#6c757d"
//               value={searchText}
//               onChangeText={handleSearch}
//               returnKeyType="search"
//               autoCorrect={false}
//               autoCapitalize="none"
//             />
//             {searchText.length > 0 && (
//               <TouchableOpacity
//                 onPress={clearSearch}
//                 style={{
//                   marginLeft: 8,
//                   padding: 4,
//                   borderRadius: 12,
//                   backgroundColor: "#e9ecef",
//                 }}
//               >
//                 <Ionicons name="close" size={16} color="#6c757d" />
//               </TouchableOpacity>
//             )}
//           </View>

//           {/* Search suggestions/hints */}
//           {searchText.length === 0 && (
//             <View
//               style={{
//                 flexDirection: "row",
//                 flexWrap: "wrap",
//                 marginTop: 8,
//                 paddingHorizontal: 4,
//               }}
//             >
//               <Text
//                 style={{
//                   fontSize: 12,
//                   color: "#8c959f",
//                   fontFamily: "Poppins_400Regular",
//                   marginRight: 4,
//                 }}
//               >
//                 Try searching for:
//               </Text>
//               <Text
//                 style={{
//                   fontSize: 12,
//                   color: "#4A90E2",
//                   fontFamily: "Poppins_400Regular",
//                   marginRight: 8,
//                 }}
//               >
//                 "React"
//               </Text>
//               <Text
//                 style={{
//                   fontSize: 12,
//                   color: "#4A90E2",
//                   fontFamily: "Poppins_400Regular",
//                   marginRight: 8,
//                 }}
//               >
//                 "Stanford"
//               </Text>
//               <Text
//                 style={{
//                   fontSize: 12,
//                   color: "#4A90E2",
//                   fontFamily: "Poppins_400Regular",
//                 }}
//               >
//                 "John"
//               </Text>
//             </View>
//           )}
//         </View>

//         <View style={styles.content}>
//           {loading && experts.length === 0 ? (
//             <View
//               style={{
//                 flex: 1,
//                 justifyContent: "center",
//                 alignItems: "center",
//               }}
//             >
//               <ActivityIndicator size="large" color="#4A90E2" />
//               <Text
//                 style={{
//                   marginTop: 16,
//                   fontSize: 16,
//                   color: "#666",
//                   fontFamily: "Poppins_400Regular",
//                 }}
//               >
//                 {searchText ? "Searching experts..." : "Loading experts..."}
//               </Text>
//             </View>
//           ) : error ? (
//             <ScrollView
//               contentContainerStyle={{
//                 flex: 1,
//                 justifyContent: "center",
//                 alignItems: "center",
//                 padding: 20,
//               }}
//               showsVerticalScrollIndicator={false}
//             >
//               <Ionicons name="warning-outline" size={64} color="#FF6B6B" />
//               <Text
//                 style={{
//                   fontSize: 18,
//                   fontWeight: "bold",
//                   color: "#333",
//                   marginTop: 16,
//                   textAlign: "center",
//                   fontFamily: "Poppins_600SemiBold",
//                 }}
//               >
//                 Something went wrong
//               </Text>
//               <Text
//                 style={{
//                   fontSize: 14,
//                   color: "#666",
//                   marginTop: 8,
//                   textAlign: "center",
//                   fontFamily: "Poppins_400Regular",
//                 }}
//               >
//                 {error}
//               </Text>
//               <TouchableOpacity
//                 onPress={() => fetchExperts(1, searchText, null, true)}
//                 style={{
//                   backgroundColor: "#4A90E2",
//                   paddingHorizontal: 24,
//                   paddingVertical: 12,
//                   borderRadius: 25,
//                   marginTop: 16,
//                   shadowColor: "#4A90E2",
//                   shadowOffset: { width: 0, height: 2 },
//                   shadowOpacity: 0.3,
//                   shadowRadius: 4,
//                   elevation: 3,
//                 }}
//               >
//                 <Text
//                   style={{
//                     color: "white",
//                     fontSize: 16,
//                     fontWeight: "bold",
//                     fontFamily: "Poppins_600SemiBold",
//                   }}
//                 >
//                   Try Again
//                 </Text>
//               </TouchableOpacity>
//             </ScrollView>
//           ) : displayedExperts.length > 0 ? (
//             <FlatList
//               data={displayedExperts}
//               keyExtractor={(item) => item.id}
//               renderItem={({ item }) => (
//                 <ProfileCard person={item} navigation={navigation} />
//               )}
//               showsVerticalScrollIndicator={false}
//               contentContainerStyle={{
//                 paddingBottom: 20,
//                 paddingTop: 8,
//               }}
//               onEndReached={handleLoadMore}
//               onEndReachedThreshold={0.1}
//               ListFooterComponent={renderFooter}
//               refreshing={refreshing}
//               onRefresh={handleRefresh}
//               // Enhanced scroll performance
//               removeClippedSubviews={true}
//               maxToRenderPerBatch={10}
//               updateCellsBatchingPeriod={50}
//               initialNumToRender={10}
//               windowSize={10}
//               getItemLayout={undefined} // Let FlatList calculate automatically
//               // Add pull-to-refresh indicator styling
//               refreshControlProps={{
//                 tintColor: "#4A90E2",
//                 colors: ["#4A90E2"],
//                 progressBackgroundColor: "#f8f9fa",
//               }}
//               // Show search results count
//               ListHeaderComponent={
//                 searchText ? (
//                   <View
//                     style={{
//                       paddingHorizontal: 16,
//                       paddingVertical: 8,
//                       backgroundColor: "#f8f9fa",
//                       marginHorizontal: 16,
//                       marginBottom: 8,
//                       borderRadius: 8,
//                     }}
//                   >
//                     <Text
//                       style={{
//                         fontSize: 14,
//                         color: "#666",
//                         fontFamily: "Poppins_400Regular",
//                         textAlign: "center",
//                       }}
//                     >
//                       {displayedExperts.length} result
//                       {displayedExperts.length !== 1 ? "s" : ""} found for "
//                       {searchText}"
//                     </Text>
//                   </View>
//                 ) : null
//               }
//             />
//           ) : (
//             <ScrollView
//               contentContainerStyle={styles.centerEmpty}
//               showsVerticalScrollIndicator={false}
//             >
//               <Ionicons
//                 name="search-outline"
//                 size={64}
//                 color="#ccc"
//                 style={{ marginBottom: 16 }}
//               />
//               <Text
//                 style={[
//                   styles.emptyText,
//                   { fontFamily: "Poppins_600SemiBold" },
//                 ]}
//               >
//                 {searchText
//                   ? `No experts found matching "${searchText}"`
//                   : `No experts found in ${domainTitle || "this domain"}.`}
//               </Text>
//               {searchText ? (
//                 <Text
//                   style={{
//                     fontSize: 14,
//                     color: "#666",
//                     textAlign: "center",
//                     marginTop: 8,
//                     marginBottom: 16,
//                     fontFamily: "Poppins_400Regular",
//                   }}
//                 >
//                   Try searching by name, university, or skills
//                 </Text>
//               ) : null}
//               {searchText && (
//                 <TouchableOpacity
//                   onPress={clearSearch}
//                   style={{
//                     backgroundColor: "#4A90E2",
//                     paddingHorizontal: 24,
//                     paddingVertical: 12,
//                     borderRadius: 25,
//                     marginTop: 16,
//                     shadowColor: "#4A90E2",
//                     shadowOffset: { width: 0, height: 2 },
//                     shadowOpacity: 0.3,
//                     shadowRadius: 4,
//                     elevation: 3,
//                   }}
//                 >
//                   <Text
//                     style={{
//                       color: "white",
//                       fontSize: 16,
//                       fontWeight: "bold",
//                       fontFamily: "Poppins_600SemiBold",
//                     }}
//                   >
//                     Clear Search
//                   </Text>
//                 </TouchableOpacity>
//               )}
//             </ScrollView>
//           )}
//         </View>
//       </View>
//     </View>
//   );
// }

// const Stack = createStackNavigator();

// export default DomainScreen;


import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import {
  useFonts,
  Poppins_700Bold,
  Poppins_400Regular,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";
import { createStackNavigator } from "@react-navigation/stack";
import { useFocusEffect } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import styles from "./SearchStyles.js";
import { COLORS } from "./constants";

import ChatScreen from "./ChatScreen.js";
import { IP } from "../Config/config";
const API_BASE_URL = `${IP}/api/auth`;
const CONNECTION_API_BASE_URL = `${IP}/api/connection`;
const REFRESH_INTERVAL = 10000;

const FALLBACK_EXPERTS = [
  {
    id: "1",
    name: "Test Expert",
    email: "test@example.com",
    profileImageUrl: "https://via.placeholder.com/100x100",
    bio: "Test bio",
    location: "Test Location",
    university: "Test University",
    skills: [
      { skill: "React", proficiency: "Expert", domain: "Web Development" },
      { skill: "JavaScript", proficiency: "Expert", domain: "Web Development" },
    ],
    wantsToLearn: ["Node.js", "TypeScript"],
  },
];

function ProfileCard({ person, navigation, userId, connectionStatuses, setConnectionStatuses }) {
  const [localPending, setLocalPending] = useState(false);
  // Use id instead of _id since backend returns id
  const personId = person.id || person._id;
  const currentStatus = connectionStatuses[personId] || person.connectionStatus || 'none';

  const handleCardPress = () => {
    navigation.navigate("DomainProfileScreen", { person });
  };

  const handleConnect = async () => {
    try {
      setLocalPending(true);
      await axios.post(`${CONNECTION_API_BASE_URL}/request`, {
        fromUserId: userId,
        toUserId: personId,
      });
      setConnectionStatuses((prev) => ({ 
        ...prev, 
        [personId]: 'pending' 
      }));
    } catch (err) {
      console.error('Connection error:', err);
      Alert.alert('Error', 'Failed to send connection request');
      setLocalPending(false);
    }
  };

  const getIconProps = () => {
    if (localPending && currentStatus === 'none') {
      return { name: 'clockcircleo', color: COLORS.gray || '#6B7280' };
    }
    switch (currentStatus) {
      case 'accepted': 
        return { name: 'checkcircleo', color: COLORS.success || '#10B981' };
      case 'pending': 
        return { name: 'clockcircleo', color: COLORS.gray || '#6B7280' };
      default: 
        return { name: 'adduser', color: COLORS.primary || '#8BD0EC' };
    }
  };

  const { name: iconName, color: iconColor } = getIconProps();
  const isDisabled = ['pending', 'accepted'].includes(currentStatus) || localPending;

  useEffect(() => {
    if (['pending', 'accepted'].includes(currentStatus)) {
      setLocalPending(false);
    }
  }, [currentStatus]);

  const skillNames = person.skills?.map((skill) => skill.skill) || [];
  const wantsToLearn = person.wantsToLearn || [];

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={handleCardPress}>
      <View style={styles.card}>
        <Image
          source={{
            uri: person.profileImageUrl || "https://via.placeholder.com/64",
          }}
          style={styles.avatar}
        />
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={styles.cardName}>{person.name}</Text>
            <View style={{ width: 30, alignItems: "flex-end" }}>
              <TouchableOpacity 
                onPress={handleConnect} 
                disabled={isDisabled}
                style={{ padding: 5 }}
              >
                <AntDesign
                  name={iconName}
                  size={20}
                  color={iconColor}
                />
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.cardEdu}>
            {person.university}, {person.location}
          </Text>

          {/* Skills */}
          {skillNames.length > 0 && (
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                marginBottom: 2,
              }}
            >
              {skillNames.map((skill, idx) => (
                <View key={idx} style={styles.skillTag}>
                  <Text style={styles.skillText}>{skill}</Text>
                </View>
              ))}
            </View>
          )}

          {wantsToLearn.length > 0 && (
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {wantsToLearn.map((want, idx) => (
                <View key={idx} style={styles.wantTag}>
                  <Text style={styles.wantText}>{want}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

function DomainScreen({ navigation, route }) {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  
  // Connection related states
  const [userId, setUserId] = useState(null);
  const [connectionStatuses, setConnectionStatuses] = useState({});

  const searchTimeoutRef = React.useRef(null);

  const params = route?.params || {};
  const navState = navigation?.getState?.() || {};
  const currentRoute = navState?.routes?.[navState?.index] || {};

  const domainTitle =
    params.courseTitle ||
    params.domain ||
    params.domainTitle ||
    currentRoute?.params?.courseTitle ||
    currentRoute?.params?.domain;
  const domainId =
    params.courseId ||
    params.domainId ||
    currentRoute?.params?.courseId ||
    currentRoute?.params?.domainId;
  const courseData = params.courseData || currentRoute?.params?.courseData;

  // Initialize userId
  useEffect(() => {
    const initializeUserId = async () => {
      try {
        const id = await SecureStore.getItemAsync('userId');
        setUserId(id);
      } catch (error) {
        console.error('Error getting userId:', error);
      }
    };
    initializeUserId();
  }, []);

  // Fetch connection statuses
  const fetchConnectionStatuses = async (isBackground = false) => {
    if (!userId) return;
    
    try {
      const statusRes = await axios.post(`${CONNECTION_API_BASE_URL}/try`, {
        fromUserId: userId,
      });

      const statusMap = {};
      statusRes.data.forEach((user) => {
        // Handle both id and _id fields
        const userIdField = user.id || user._id;
        statusMap[userIdField] = user.connectionStatus;
      });

      setConnectionStatuses(statusMap);
    } catch (err) {
      console.error('Error fetching connection statuses:', err.message);
    }
  };

  // Refresh connection statuses periodically
  useEffect(() => {
    if (userId) {
      fetchConnectionStatuses();
      const interval = setInterval(() => {
        fetchConnectionStatuses(true);
      }, REFRESH_INTERVAL);
      return () => clearInterval(interval);
    }
  }, [userId]);

  // Refresh on focus
  useFocusEffect(
    useCallback(() => {
      if (userId) {
        fetchConnectionStatuses(true);
      }
    }, [userId])
  );

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  let [fontsLoaded] = useFonts({
    Poppins_700Bold,
    Poppins_400Regular,
    Poppins_600SemiBold,
  });

  const fetchExperts = async (
    page = 1,
    search = "",
    testDomain = null,
    resetData = true
  ) => {
    try {
      if (resetData) {
        setLoading(page === 1);
        setSearchLoading(!!search);
      }
      setError(null);

      const targetDomain = testDomain || domainTitle;

      if (!targetDomain) {
        throw new Error("No domain title provided");
      }

      // Check if userId is available
      if (!userId) {
        console.log("UserId not available yet, waiting...");
        return;
      }

      const encodedDomainName = encodeURIComponent(targetDomain);
      let endpoint = `/domain-experts/${encodedDomainName}?page=${page}`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      // POST request with userId in body
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          userId: userId
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const responseText = await response.text();

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${responseText}`);
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        throw new Error(`Invalid JSON response: ${responseText}`);
      }

      if (page === 1 || resetData) {
        setExperts(data.experts || []);
      } else {
        setExperts((prev) => [...prev, ...(data.experts || [])]);
      }

      setCurrentPage(data.currentPage || 1);
      setTotalPages(data.totalPages || 1);
      setHasNextPage(data.hasNextPage || false);

      // Fetch connection statuses after loading experts
      if (userId) {
        fetchConnectionStatuses();
      }
    } catch (error) {
      setError(error.message);

      if (error.name === "AbortError") {
        Alert.alert(
          "Timeout",
          "Request timed out. Please check your internet connection and try again."
        );
      } else if (error.message.includes("Network request failed")) {
        Alert.alert(
          "Network Error",
          "Unable to connect to server. Please check if your server is running and accessible."
        );
      } else if (error.message.includes("Invalid JSON")) {
        Alert.alert(
          "Server Error",
          "Server returned invalid response. Please check server logs."
        );
      } else if (error.message.includes("No domain title provided")) {
        Alert.alert(
          "Error",
          "Domain information is missing. Please go back and try again."
        );
      } else {
        Alert.alert("Error", `Failed to fetch experts: ${error.message}`);
      }

      if (page === 1 || resetData) {
        setExperts([]);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
      setSearchLoading(false);
    }
  };

  const clientSideFilter = (experts, searchQuery) => {
    if (!searchQuery.trim()) return experts;

    const query = searchQuery.toLowerCase().trim();

    const filteredExperts = experts.filter((person) => {
      const nameMatch = person.name?.toLowerCase().includes(query);

      const universityMatch = person.university?.toLowerCase().includes(query);

      const skillsMatch =
        person.skills?.some((skill) => {
          const skillName = skill.skill?.toLowerCase() || skill.toLowerCase();
          return skillName.includes(query);
        }) || false;

      const locationMatch = person.location?.toLowerCase().includes(query);

      const wantsToLearnMatch =
        person.wantsToLearn?.some((want) =>
          want.toLowerCase().includes(query)
        ) || false;

      const bioMatch = person.bio?.toLowerCase().includes(query) || false;

      const isMatch =
        nameMatch ||
        universityMatch ||
        skillsMatch ||
        locationMatch ||
        wantsToLearnMatch ||
        bioMatch;

      return isMatch;
    });

    return filteredExperts;
  };

  // Update the useEffect that calls fetchExperts - FIXED
  useEffect(() => {
    if (domainTitle && userId) { // Only run when both are available
      fetchExperts(1, "", null, true);
    } else if (!domainTitle) {
      setExperts(FALLBACK_EXPERTS);
      setLoading(false);
    }
  }, [domainTitle, userId]); // Added userId dependency

  const handleSearch = (text) => {
    setSearchText(text);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (text.trim()) {
      setSearchLoading(true);
    } else {
      setSearchLoading(false);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setSearchLoading(false);
    }, 300);
  };

  const handleLoadMore = () => {
    if (hasNextPage && !loading && !searchLoading) {
      fetchExperts(currentPage + 1, searchText, null, false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchExperts(1, searchText, null, true);
  };

  const clearSearch = () => {
    setSearchText("");
    setSearchLoading(false);
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
  };

  const renderFooter = () => {
    if (!hasNextPage) return null;

    return (
      <View style={{ padding: 20, alignItems: "center" }}>
        <ActivityIndicator size="small" color="#4A90E2" />
        <Text style={{ marginTop: 10, color: "#666" }}>
          Loading more experts...
        </Text>
      </View>
    );
  };

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  const displayedExperts = clientSideFilter(experts, searchText);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={styles.container}>
        <View
          style={{
            paddingHorizontal: 16,
            paddingTop: 16,
            paddingBottom: 12,
            backgroundColor: COLORS.background,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#f8f9fa",
              borderRadius: 25,
              paddingHorizontal: 16,
              paddingVertical: 12,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2,
              borderWidth: 1,
              borderColor: searchLoading ? "#4A90E2" : "#e9ecef",
            }}
          >
            {searchLoading ? (
              <ActivityIndicator
                size={20}
                color="#4A90E2"
                style={{ marginRight: 12 }}
              />
            ) : (
              <Ionicons
                name="search-outline"
                size={20}
                color="#6c757d"
                style={{ marginRight: 12 }}
              />
            )}
            <TextInput
              style={{
                flex: 1,
                fontSize: 16,
                color: "#333",
                fontFamily: "Poppins_400Regular",
                paddingVertical: 0,
              }}
              placeholder="Search by name, university, or skills..."
              placeholderTextColor="#6c757d"
              value={searchText}
              onChangeText={handleSearch}
              returnKeyType="search"
              autoCorrect={false}
              autoCapitalize="none"
            />
            {searchText.length > 0 && (
              <TouchableOpacity
                onPress={clearSearch}
                style={{
                  marginLeft: 8,
                  padding: 4,
                  borderRadius: 12,
                  backgroundColor: "#e9ecef",
                }}
              >
                <Ionicons name="close" size={16} color="#6c757d" />
              </TouchableOpacity>
            )}
          </View>

          {/* Search suggestions/hints */}
          {searchText.length === 0 && (
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                marginTop: 8,
                paddingHorizontal: 4,
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  color: "#8c959f",
                  fontFamily: "Poppins_400Regular",
                  marginRight: 4,
                }}
              >
                Try searching for:
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: "#4A90E2",
                  fontFamily: "Poppins_400Regular",
                  marginRight: 8,
                }}
              >
                "React"
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: "#4A90E2",
                  fontFamily: "Poppins_400Regular",
                  marginRight: 8,
                }}
              >
                "Stanford"
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: "#4A90E2",
                  fontFamily: "Poppins_400Regular",
                }}
              >
                "John"
              </Text>
            </View>
          )}
        </View>

        <View style={styles.content}>
          {loading && experts.length === 0 ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator size="large" color="#4A90E2" />
              <Text
                style={{
                  marginTop: 16,
                  fontSize: 16,
                  color: "#666",
                  fontFamily: "Poppins_400Regular",
                }}
              >
                {searchText ? "Searching experts..." : "Loading experts..."}
              </Text>
            </View>
          ) : error ? (
            <ScrollView
              contentContainerStyle={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                padding: 20,
              }}
              showsVerticalScrollIndicator={false}
            >
              <Ionicons name="warning-outline" size={64} color="#FF6B6B" />
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  color: "#333",
                  marginTop: 16,
                  textAlign: "center",
                  fontFamily: "Poppins_600SemiBold",
                }}
              >
                Something went wrong
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: "#666",
                  marginTop: 8,
                  textAlign: "center",
                  fontFamily: "Poppins_400Regular",
                }}
              >
                {error}
              </Text>
              <TouchableOpacity
                onPress={() => fetchExperts(1, searchText, null, true)}
                style={{
                  backgroundColor: "#4A90E2",
                  paddingHorizontal: 24,
                  paddingVertical: 12,
                  borderRadius: 25,
                  marginTop: 16,
                  shadowColor: "#4A90E2",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                  elevation: 3,
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 16,
                    fontWeight: "bold",
                    fontFamily: "Poppins_600SemiBold",
                  }}
                >
                  Try Again
                </Text>
              </TouchableOpacity>
            </ScrollView>
          ) : displayedExperts.length > 0 ? (
            <FlatList
              data={displayedExperts}
              keyExtractor={(item) => item.id || item._id}
              renderItem={({ item }) => (
                <ProfileCard 
                  person={item} 
                  navigation={navigation}
                  userId={userId}
                  connectionStatuses={connectionStatuses}
                  setConnectionStatuses={setConnectionStatuses}
                />
              )}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingBottom: 20,
                paddingTop: 8,
              }}
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.1}
              ListFooterComponent={renderFooter}
              refreshing={refreshing}
              onRefresh={handleRefresh}
              // Enhanced scroll performance
              removeClippedSubviews={true}
              maxToRenderPerBatch={10}
              updateCellsBatchingPeriod={50}
              initialNumToRender={10}
              windowSize={10}
              getItemLayout={undefined} // Let FlatList calculate automatically
              // Add pull-to-refresh indicator styling
              refreshControlProps={{
                tintColor: "#4A90E2",
                colors: ["#4A90E2"],
                progressBackgroundColor: "#f8f9fa",
              }}
              // Show search results count
              ListHeaderComponent={
                searchText ? (
                  <View
                    style={{
                      paddingHorizontal: 16,
                      paddingVertical: 8,
                      backgroundColor: "#f8f9fa",
                      marginHorizontal: 16,
                      marginBottom: 8,
                      borderRadius: 8,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        color: "#666",
                        fontFamily: "Poppins_400Regular",
                        textAlign: "center",
                      }}
                    >
                      {displayedExperts.length} result
                      {displayedExperts.length !== 1 ? "s" : ""} found for "
                      {searchText}"
                    </Text>
                  </View>
                ) : null
              }
            />
          ) : (
            <ScrollView
              contentContainerStyle={styles.centerEmpty}
              showsVerticalScrollIndicator={false}
            >
              <Ionicons
                name="search-outline"
                size={64}
                color="#ccc"
                style={{ marginBottom: 16 }}
              />
              <Text
                style={[
                  styles.emptyText,
                  { fontFamily: "Poppins_600SemiBold" },
                ]}
              >
                {searchText
                  ? `No experts found matching "${searchText}"`
                  : `No experts found in ${domainTitle || "this domain"}.`}
              </Text>
              {searchText ? (
                <Text
                  style={{
                    fontSize: 14,
                    color: "#666",
                    textAlign: "center",
                    marginTop: 8,
                    marginBottom: 16,
                    fontFamily: "Poppins_400Regular",
                  }}
                >
                  Try searching by name, university, or skills
                </Text>
              ) : null}
              {searchText && (
                <TouchableOpacity
                  onPress={clearSearch}
                  style={{
                    backgroundColor: "#4A90E2",
                    paddingHorizontal: 24,
                    paddingVertical: 12,
                    borderRadius: 25,
                    marginTop: 16,
                    shadowColor: "#4A90E2",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.3,
                    shadowRadius: 4,
                    elevation: 3,
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: 16,
                      fontWeight: "bold",
                      fontFamily: "Poppins_600SemiBold",
                    }}
                  >
                    Clear Search
                  </Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          )}
        </View>
      </View>
    </View>
  );
}

const Stack = createStackNavigator();

export default DomainScreen;