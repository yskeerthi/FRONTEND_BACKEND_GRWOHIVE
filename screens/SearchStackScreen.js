// import React, { useState, useEffect, useCallback } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   FlatList,
//   Image,
//   ScrollView,
//   ActivityIndicator,
// } from 'react-native';
// import { Ionicons, AntDesign } from '@expo/vector-icons';
// import {
//   useFonts,
//   Poppins_700Bold,
//   Poppins_400Regular,
//   Poppins_600SemiBold,
// } from '@expo-google-fonts/poppins';
// import { createStackNavigator } from '@react-navigation/stack';
// import { useFocusEffect, useNavigation } from '@react-navigation/native';
// import * as SecureStore from 'expo-secure-store';
// import axios from 'axios';

// import styles from './SearchStyles';
// import GrowHiveHeader from './GrowHiveHeader';
// import { COLORS } from './constants';
// import DomainProfileScreen from './DomainProfileScreen';
// import { IP } from '../Config/config';

// const API_BASE_URL = `${IP}/api/connection`;
// const REFRESH_INTERVAL = 10000;

// function ProfileCard({ person, onPress, userId, connectionStatuses, setConnectionStatuses }) {
//   const [localPending, setLocalPending] = useState(false);
//   const currentStatus = connectionStatuses[person._id] || person.connectionStatus || 'none';

//   const handleConnect = async () => {
//     try {
//       setLocalPending(true);
//       await axios.post(`${API_BASE_URL}/request`, {
//         fromUserId: userId,
//         toUserId: person._id,
//       });
//       setConnectionStatuses((prev) => ({ ...prev, [person._id]: 'pending' }));
//     } catch (err) {
//       console.error(err);
//       alert('Error sending connection');
//       setLocalPending(false);
//     }
//   };

//   const getSkillName = (skill) => (typeof skill === 'object' ? skill.skill || skill.name || 'Unknown Skill' : skill);

//   const getIconProps = () => {
//     if (localPending && currentStatus === 'none') return { name: 'clockcircleo', color: COLORS.gray };
//     switch (currentStatus) {
//       case 'accepted': return { name: 'checkcircleo', color: COLORS.success || '#10B981' };
//       case 'pending': return { name: 'clockcircleo', color: COLORS.gray };
//       default: return { name: 'adduser', color: COLORS.primary };
//     }
//   };

//   const { name: iconName, color: iconColor } = getIconProps();
//   const isDisabled = ['pending', 'accepted'].includes(currentStatus) || localPending;

//   useEffect(() => {
//     if (['pending', 'accepted'].includes(currentStatus)) setLocalPending(false);
//   }, [currentStatus]);

//   return (
//     <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
//       <View style={styles.card}>
//         <Image source={{ uri: person.profileImageUrl || 'https://i.pravatar.cc/64?img=1' }} style={styles.avatar} />
//         <View style={{ flex: 1 }}>
//           <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
//             <View style={{ flex: 1 }}>
//               <Text style={styles.cardName}>{person.name}</Text>
//               <Text style={styles.cardEdu}>{person.education}, {person.university}</Text>
//             </View>
//             <TouchableOpacity onPress={handleConnect} disabled={isDisabled} style={{ padding: 5 }}>
//               <AntDesign name={iconName} size={20} color={iconColor} />
//             </TouchableOpacity>
//           </View>
//           <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 5 }}>
//             {(person.skillsOwned || []).map((skill, idx) => (
//               <View key={idx} style={styles.skillTag}><Text style={styles.skillText}>{getSkillName(skill)}</Text></View>
//             ))}
//           </View>
//           <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
//             {(person.skillsToLearn || []).map((want, idx) => (
//               <View key={idx} style={styles.wantTag}><Text style={styles.wantText}>Want to learn: {getSkillName(want)}</Text></View>
//             ))}
//           </View>
//         </View>
//       </View>
//     </TouchableOpacity>
//   );
// }

// function SearchScreen() {
//   const [skill, setSkill] = useState('All Skills');
//   const [searchText, setSearchText] = useState('');
//   const [userList, setUserList] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [userId, setUserId] = useState(null);
//   const [connectionStatuses, setConnectionStatuses] = useState({});
//   const [availableSkills, setAvailableSkills] = useState(['All Skills']);
//   const navigation = useNavigation();

//   let [fontsLoaded] = useFonts({ Poppins_700Bold, Poppins_400Regular, Poppins_600SemiBold });

//   // Extract unique skills from all users
//   const extractSkillsFromUsers = (users) => {
//     const skillsSet = new Set(['All Skills']);
    
//     users.forEach(user => {
//       // Extract from skillsOwned
//       if (user.skillsOwned && Array.isArray(user.skillsOwned)) {
//         user.skillsOwned.forEach(skill => {
//           const skillName = typeof skill === 'object' ? skill.skill || skill.name : skill;
//           if (skillName && typeof skillName === 'string') {
//             skillsSet.add(skillName);
//           }
//         });
//       }
      
//       // Extract from skillsToLearn
//       if (user.skillsToLearn && Array.isArray(user.skillsToLearn)) {
//         user.skillsToLearn.forEach(skill => {
//           const skillName = typeof skill === 'object' ? skill.skill || skill.name : skill;
//           if (skillName && typeof skillName === 'string') {
//             skillsSet.add(skillName);
//           }
//         });
//       }
//     });
    
//     return Array.from(skillsSet).sort((a, b) => {
//       if (a === 'All Skills') return -1;
//       if (b === 'All Skills') return 1;
//       return a.localeCompare(b);
//     });
//   };

//   const fetchUsersAndStatuses = async (isBackground = false) => {
//     try {
//       const id = userId || await SecureStore.getItemAsync('userId');
//       if (!userId) setUserId(id);

//       const usersRes = await axios.get(`${API_BASE_URL}/user`, {
//         params: { currentUserId: id },
//       });

//       const statusRes = await axios.post(`${API_BASE_URL}/try`, {
//         fromUserId: id,
//       });

//       const statusMap = {};
//       statusRes.data.forEach((user) => {
//         statusMap[user._id] = user.connectionStatus;
//       });

//       setUserList(usersRes.data);
//       setConnectionStatuses(statusMap);
      
//       // Extract and set available skills
//       const skills = extractSkillsFromUsers(usersRes.data);
//       setAvailableSkills(skills);
      
//       if (!isBackground) setLoading(false);
//     } catch (err) {
//       console.error('Error fetching data:', err.message);
//       if (!isBackground) setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUsersAndStatuses();
//   }, []);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       if (userId) fetchUsersAndStatuses(true);
//     }, REFRESH_INTERVAL);
//     return () => clearInterval(interval);
//   }, [userId]);

//   useFocusEffect(useCallback(() => {
//     if (userId) fetchUsersAndStatuses(true);
//   }, [userId]));

//   // Enhanced filtering logic
//   const filteredData = userList.filter((person) => {
//     // Skill filter logic
//     const skillMatch = skill === 'All Skills' || 
//       (person.skillsOwned || []).some((s) => {
//         const skillName = typeof s === 'object' ? s.skill || s.name : s;
//         return skillName?.toLowerCase().trim() === skill.toLowerCase().trim();
//       });

//     // Comprehensive search logic
//     const searchMatch = !searchText.trim() || (() => {
//       const searchLower = searchText.toLowerCase().trim();
      
//       // Search in name (username)
//       const nameMatch = person.name?.toLowerCase().includes(searchLower);
      
//       // Search in education
//       const educationMatch = person.education?.toLowerCase().includes(searchLower);
      
//       // Search in university
//       const universityMatch = person.university?.toLowerCase().includes(searchLower);
      
//       // Search in skills owned
//       const skillsOwnedMatch = (person.skillsOwned || []).some(skill => {
//         const skillName = typeof skill === 'object' ? skill.skill || skill.name : skill;
//         return skillName?.toLowerCase().includes(searchLower);
//       });
      
//       // Search in skills to learn
//       const skillsToLearnMatch = (person.skillsToLearn || []).some(skill => {
//         const skillName = typeof skill === 'object' ? skill.skill || skill.name : skill;
//         return skillName?.toLowerCase().includes(searchLower);
//       });
      
//       return nameMatch || educationMatch || universityMatch || skillsOwnedMatch || skillsToLearnMatch;
//     })();

//     return skillMatch && searchMatch;
//   });

//   if (!fontsLoaded) return <View style={styles.container} />;
//   if (loading) return <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 100 }} />;

//   return (
//     <View style={{ flex: 1, backgroundColor: COLORS.background }}>
//       <GrowHiveHeader />
//       <View style={styles.container}>
//         <View style={styles.searchBar}>
//           <Ionicons name="search" size={20} color="#b5b5b5" style={{ marginRight: 10 }} />
//           <TextInput
//             placeholder="Search by name, education, university, or skills..."
//             placeholderTextColor="#b5b5b5"
//             style={styles.searchInput}
//             value={searchText}
//             onChangeText={setSearchText}
//           />
//         </View>

//         <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
//           {availableSkills.map((skillItem) => (
//             <TouchableOpacity
//               key={skillItem}
//               onPress={() => setSkill(skillItem)}
//               style={[
//                 styles.filterChip, 
//                 { backgroundColor: skill === skillItem ? '#34e3b0' : '#f3f4f6' }
//               ]}
//             >
//               <Text style={[
//                 styles.filterText, 
//                 { color: skill === skillItem ? '#fff' : '#23272F' }
//               ]}>
//                 {skillItem}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </ScrollView>

//         <View style={styles.content}>
//           {filteredData.length > 0 ? (
//             <FlatList
//               data={filteredData}
//               keyExtractor={(item) => item._id}
//               renderItem={({ item }) => (
//                 <ProfileCard
//                   person={item}
//                   userId={userId}
//                   connectionStatuses={connectionStatuses}
//                   setConnectionStatuses={setConnectionStatuses}
//                   onPress={() => navigation.navigate('DomainProfile', { person: item })}
//                 />
//               )}
//               showsVerticalScrollIndicator={false}
//               contentContainerStyle={{ paddingBottom: 20 }}
//             />
//           ) : (
//             <View style={styles.centerEmpty}>
//               <Text style={styles.emptyText}>
//                 {searchText.trim() || skill !== 'All Skills' 
//                   ? 'No profiles match your search criteria.' 
//                   : 'No profiles found.'
//                 }
//               </Text>
//             </View>
//           )}
//         </View>
//       </View>
//     </View>
//   );
// }

// const Stack = createStackNavigator();
// export default function SearchStackScreen() {
//   return (
//     <Stack.Navigator>
//       <Stack.Screen name="SearchMain" component={SearchScreen} options={{ headerShown: false }} />
//       <Stack.Screen name="DomainProfile" component={DomainProfileScreen} options={{ title: 'Profile' }} />
//     </Stack.Navigator>
//   );
// }

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import {
  useFonts,
  Poppins_700Bold,
  Poppins_400Regular,
  Poppins_600SemiBold,
} from '@expo-google-fonts/poppins';
import { createStackNavigator } from '@react-navigation/stack';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

import styles from './SearchStyles';
import GrowHiveHeader from './GrowHiveHeader';
import { COLORS } from './constants';
import DomainProfileScreen from './DomainProfileScreen';
import { IP } from '../Config/config';

const API_BASE_URL = `${IP}/api/connection`;
const REFRESH_INTERVAL = 10000;

function ProfileCard({ person, onPress, userId, connectionStatuses, setConnectionStatuses }) {
  const [localPending, setLocalPending] = useState(false);
  const currentStatus = connectionStatuses[person._id] || person.connectionStatus || 'none';

  const handleConnect = async () => {
    try {
      setLocalPending(true);
      await axios.post(`${API_BASE_URL}/request`, {
        fromUserId: userId,
        toUserId: person._id,
      });
      setConnectionStatuses((prev) => ({ ...prev, [person._id]: 'pending' }));
    } catch (err) {
      console.error(err);
      alert('Error sending connection');
      setLocalPending(false);
    }
  };

  const getSkillName = (skill) => {
    if (typeof skill === 'object') {
      return skill.skill || skill.name || skill.skillName || 'Unknown Skill';
    }
    return skill || 'Unknown Skill';
  };

  const getIconProps = () => {
    if (localPending && currentStatus === 'none') return { name: 'clockcircleo', color: COLORS.gray };
    switch (currentStatus) {
      case 'accepted': return { name: 'checkcircleo', color: COLORS.success || '#10B981' };
      case 'pending': return { name: 'clockcircleo', color: COLORS.gray };
      default: return { name: 'adduser', color: COLORS.primary };
    }
  };

  const { name: iconName, color: iconColor } = getIconProps();
  const isDisabled = ['pending', 'accepted'].includes(currentStatus) || localPending;

  useEffect(() => {
    if (['pending', 'accepted'].includes(currentStatus)) setLocalPending(false);
  }, [currentStatus]);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <View style={styles.card}>
        <Image source={{ uri: person.profileImageUrl || 'https://i.pravatar.cc/64?img=1' }} style={styles.avatar} />
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardName}>{person.name}</Text>
              <Text style={styles.cardEdu}>{person.education}, {person.university}</Text>
            </View>
            <TouchableOpacity onPress={handleConnect} disabled={isDisabled} style={{ padding: 5 }}>
              <AntDesign name={iconName} size={20} color={iconColor} />
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 5 }}>
            {(person.skillsOwned || []).map((skill, idx) => (
              <View key={idx} style={styles.skillTag}>
                <Text style={styles.skillText}>{getSkillName(skill)}</Text>
              </View>
            ))}
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {(person.skillsToLearn || []).map((want, idx) => (
              <View key={idx} style={styles.wantTag}>
                <Text style={styles.wantText}>Want to learn: {getSkillName(want)}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function SearchScreen() {
  const [skill, setSkill] = useState('All Skills');
  const [searchText, setSearchText] = useState('');
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [connectionStatuses, setConnectionStatuses] = useState({});
  const [availableSkills, setAvailableSkills] = useState(['All Skills']);
  const navigation = useNavigation();

  let [fontsLoaded] = useFonts({ Poppins_700Bold, Poppins_400Regular, Poppins_600SemiBold });

  // Helper function to safely extract skill name with better fallbacks
  const getSkillName = (skill) => {
    if (typeof skill === 'object' && skill !== null) {
      return skill.skill || skill.name || skill.skillName || skill.title || 'Unknown Skill';
    }
    return skill || 'Unknown Skill';
  };

  // Extract unique skills from all users with improved logic
  const extractSkillsFromUsers = (users) => {
    const skillsSet = new Set(['All Skills']);
    
    users.forEach(user => {
      // Extract from skillsOwned
      if (user.skillsOwned && Array.isArray(user.skillsOwned)) {
        user.skillsOwned.forEach(skill => {
          const skillName = getSkillName(skill);
          if (skillName && typeof skillName === 'string' && skillName !== 'Unknown Skill') {
            skillsSet.add(skillName.trim());
          }
        });
      }
      
      // Extract from skillsToLearn
      if (user.skillsToLearn && Array.isArray(user.skillsToLearn)) {
        user.skillsToLearn.forEach(skill => {
          const skillName = getSkillName(skill);
          if (skillName && typeof skillName === 'string' && skillName !== 'Unknown Skill') {
            skillsSet.add(skillName.trim());
          }
        });
      }
    });
    
    return Array.from(skillsSet).sort((a, b) => {
      if (a === 'All Skills') return -1;
      if (b === 'All Skills') return 1;
      return a.localeCompare(b, undefined, { sensitivity: 'base' });
    });
  };

  const fetchUsersAndStatuses = async (isBackground = false) => {
    try {
      const id = userId || await SecureStore.getItemAsync('userId');
      if (!userId) setUserId(id);

      const usersRes = await axios.get(`${API_BASE_URL}/user`, {
        params: { currentUserId: id },
      });

      const statusRes = await axios.post(`${API_BASE_URL}/try`, {
        fromUserId: id,
      });

      const statusMap = {};
      statusRes.data.forEach((user) => {
        statusMap[user._id] = user.connectionStatus;
      });

      setUserList(usersRes.data);
      setConnectionStatuses(statusMap);
      
      // Extract and set available skills
      const skills = extractSkillsFromUsers(usersRes.data);
      setAvailableSkills(skills);
      
      if (!isBackground) setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err.message);
      if (!isBackground) setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersAndStatuses();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (userId) fetchUsersAndStatuses(true);
    }, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [userId]);

  useFocusEffect(useCallback(() => {
    if (userId) fetchUsersAndStatuses(true);
  }, [userId]));

  // Enhanced filtering logic with better skill matching
  const filteredData = userList.filter((person) => {
    // Skill filter logic - exact match but case insensitive
    const skillMatch = skill === 'All Skills' || 
      (person.skillsOwned || []).some((s) => {
        const skillName = getSkillName(s);
        return skillName && skillName.toLowerCase().trim() === skill.toLowerCase().trim();
      }) ||
      (person.skillsToLearn || []).some((s) => {
        const skillName = getSkillName(s);
        return skillName && skillName.toLowerCase().trim() === skill.toLowerCase().trim();
      });

    // Enhanced search logic with partial matching
    const searchMatch = !searchText.trim() || (() => {
      const searchLower = searchText.toLowerCase().trim();
      
      // Search in name (username)
      const nameMatch = person.name?.toLowerCase().includes(searchLower);
      
      // Search in education
      const educationMatch = person.education?.toLowerCase().includes(searchLower);
      
      // Search in university
      const universityMatch = person.university?.toLowerCase().includes(searchLower);
      
      // Search in skills owned with partial matching
      const skillsOwnedMatch = (person.skillsOwned || []).some(skill => {
        const skillName = getSkillName(skill);
        return skillName && skillName.toLowerCase().includes(searchLower);
      });
      
      // Search in skills to learn with partial matching
      const skillsToLearnMatch = (person.skillsToLearn || []).some(skill => {
        const skillName = getSkillName(skill);
        return skillName && skillName.toLowerCase().includes(searchLower);
      });
      
      return nameMatch || educationMatch || universityMatch || skillsOwnedMatch || skillsToLearnMatch;
    })();

    return skillMatch && searchMatch;
  });

  if (!fontsLoaded) return <View style={styles.container} />;
  if (loading) return <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 100 }} />;

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <GrowHiveHeader />
      <View style={styles.container}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#b5b5b5" style={{ marginRight: 10 }} />
          <TextInput
            placeholder="Search by name education ....."
            placeholderTextColor="#b5b5b5"
            style={styles.searchInput}
            value={searchText}
            onChangeText={setSearchText}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          {availableSkills.map((skillItem) => (
            <TouchableOpacity
              key={skillItem}
              onPress={() => setSkill(skillItem)}
              style={[
                styles.filterChip, 
                { backgroundColor: skill === skillItem ? '#34e3b0' : '#f3f4f6' }
              ]}
            >
              <Text style={[
                styles.filterText, 
                { color: skill === skillItem ? '#fff' : '#23272F' }
              ]}>
                {skillItem}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.content}>
          {filteredData.length > 0 ? (
            <FlatList
              data={filteredData}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <ProfileCard
                  person={item}
                  userId={userId}
                  connectionStatuses={connectionStatuses}
                  setConnectionStatuses={setConnectionStatuses}
                  onPress={() => navigation.navigate('DomainProfile', { person: item })}
                />
              )}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          ) : (
            <View style={styles.centerEmpty}>
              <Text style={styles.emptyText}>
                {searchText.trim() || skill !== 'All Skills' 
                  ? 'No profiles match your search criteria.' 
                  : 'No profiles found.'
                }
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const Stack = createStackNavigator();
export default function SearchStackScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="SearchMain" component={SearchScreen} options={{ headerShown: false }} />
      <Stack.Screen name="DomainProfile" component={DomainProfileScreen} options={{ title: 'Profile' }} />
    </Stack.Navigator>
  );
}