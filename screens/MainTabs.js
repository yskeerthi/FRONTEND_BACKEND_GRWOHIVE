import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import HomeStackScreen from './HomeStackScreen';
import SearchStackScreen from './SearchStackScreen';
import ScheduleStackScreen from './ScheduleStackScreen';
import HackathonsStackScreen from './HackathonsStackScreen';
import ProfileScreen from './ProfileScreen';

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

const Tab = createBottomTabNavigator();

function GrowHiveTitle() {
  return (
    <Text style={{
      fontFamily: 'Poppins_700Bold',
      fontSize: 32, // Increased font size
      color: COLORS.logoGreen,
      textAlign: 'center',
      width: '100%',
      textShadowColor: COLORS.shadow, // Shadow color
      textShadowOffset: { width: 0, height: 3 }, // Shadow offset
      textShadowRadius: 8, // Shadow blur
      textShadowOpacity: 0.3, // For iOS only
      elevation: 8, // For Android shadow
    }}>
      <Text style={{ color: COLORS.logoGreen }}>Grow</Text>
      <Text style={{ color: COLORS.logoBlue }}>Hive</Text>
    </Text>
  );
}

function Hamburger({ color }) {
  const navigation = useNavigation();
  const openDrawer = () => {
    const parent = navigation.getParent('MainDrawer');
    if (parent && parent.openDrawer) {
      parent.openDrawer();
    }
  };
  return (
    <Feather
      name="menu"
      size={26}
      color={color || COLORS.text}
      style={{ marginLeft: 18 }}
      onPress={openDrawer}
    />
  );
}

function HomeHeaderRight() {
  return (
    <>
      <Ionicons
        name="notifications-outline"
        size={24}
        color={COLORS.text}
        style={{ marginRight: 18 }}
        onPress={() => {
          // Notification logic here
        }}
      />
    </>
  );
}

export default function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: true,
        headerTitle: route.name === 'Home'
          ? () => <GrowHiveTitle />
          : "",
        headerLeft: route.name === 'Home'
          ? () => <Hamburger color={COLORS.text} />
          : undefined,
        headerRight: route.name === 'Home'
          ? () => <HomeHeaderRight />
          : undefined,
        headerTitleAlign: 'center',
        headerStyle: route.name === 'Home'
          ? {
              height: 130, // Increased header height
              backgroundColor: COLORS.background,
              elevation: 8, // Android shadow
              shadowColor: COLORS.shadow, // iOS shadow
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.25,
              shadowRadius: 10,
              borderBottomWidth: 0,
            }
          : {},
        tabBarActiveTintColor: COLORS.secondary,
        tabBarInactiveTintColor: COLORS.muted,
        tabBarStyle: { height: 65, paddingBottom: 10, backgroundColor: COLORS.background, borderTopColor: '#e5e7eb' },
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'Home') {
            return <Ionicons name="home" size={size} color={color} />;
          } else if (route.name === 'Search') {
            return <Ionicons name="search" size={size} color={color} />;
          } else if (route.name === 'Schedule') {
            return <Feather name="calendar" size={size} color={color} />;
          } else if (route.name === 'Hackathons') {
            return <MaterialCommunityIcons name="bee" size={size} color={color} />;
          } else if (route.name === 'Profile') {
            return <Ionicons name="person-circle" size={size} color={color} />;
          }
        }
      })}
    >
      <Tab.Screen name="Home" component={HomeStackScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Search" component={SearchStackScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Schedule" component={ScheduleStackScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Hackathons" component={HackathonsStackScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}
