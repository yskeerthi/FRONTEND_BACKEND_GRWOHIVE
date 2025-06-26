import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import WelcomeScreen from './Loginscreens/WelcomeScreen';
import HomeStackScreen from './screens/HomeStackScreen';
import SearchStackScreen from './screens/SearchStackScreen';
import ScheduleStackScreen from './screens/ScheduleStackScreen';
import HackathonsStackScreen from './screens/HackathonsStackScreen';
import SignupScreen from './Loginscreens/SignupScreen';
import ConnectionsScreen from './screens/connectionscreen';
import CustomDrawerContent from './screens/CustomDrawerContent';
import { navigationRef } from './screens/navigationref';
import HomeHeader from './screens/HomeHeader';
import { COLORS } from './screens/constants';
import ChatListScreen from './screens/ChatListScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import SavedScreen from './screens/SavedScreen';
import ChatProfileScreen from './screens/ChatScreen';
import ContactScreen from './screens/ContactScreen';
import PremiumScreen from './screens/PremiumScreen';
import ProfileScreen from './screens/ProfileScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import ChangePasswordScreen from './screens/ChangePasswordScreen';
import SettingsScreen from './screens/SettingsScreen';
import LoginScreen from './Loginscreens/LoginScreen';
import PersonalDetailsScreen from './screens/PersonalDetailsScreen';
import { ThemeProvider } from './screens/ThemeContext'; // <-- Your custom ThemeProvider
import DateOfBirthScreen from './screens/DateofBirthScreen';
import SkillsPage from './screens/SkillsPage';
import UploadCertificatesScreen from './screens/UploadCertificatesScreen';
import { ReportScreen } from './screens/ReportScreen';
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function MainTabs({ navigation }) {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: route.name === 'Home',
        header: route.name === 'Home'
          ? () => <HomeHeader navigation={navigation} />
          : undefined,
        tabBarActiveTintColor: COLORS.secondary,
        tabBarInactiveTintColor: COLORS.muted,
        tabBarStyle: {
          height: 65,
          paddingBottom: 10,
          backgroundColor: COLORS.background,
          borderTopColor: '#e5e7eb'
        },
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
      <Tab.Screen name="Home" component={HomeStackScreen} options={{ title: 'Home' }} />
      <Tab.Screen name="Search" component={SearchStackScreen} options={{ headerShown: false, title: 'Search' }} />
      <Tab.Screen name="Schedule" component={ScheduleStackScreen} options={{ headerShown: false, title: 'Schedule' }} />
      <Tab.Screen name="Hackathons" component={HackathonsStackScreen} options={{ headerShown: false, title: 'Hackathons' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false, title: 'Profile' }} />
    </Tab.Navigator>
  );
}

function MainStack() {
  return (
    
    <Stack.Navigator>
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Signup"
        component={SignupScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DateofBirthScreen"
        component={DateOfBirthScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PersonalDetailsScreen"
        component={ PersonalDetailsScreen} // Assuming ContinuedSignupScreen is part of SignupScreen
        options={{ headerShown: false }}
        />
        <Stack.Screen
        name="SkillsPage"
        component={SkillsPage}
        options={{ headerShown: false }}
        />
        <Stack.Screen
        name="UploadCertificatesScreen" 
          component={UploadCertificatesScreen}
        options={{ headerShown: false }}
        />
        {/* <Stack.Screen
        name="UploadCertificatesScreen"
        component={UploadCertificatesScreen}
        options={{ headerShown: false }}/> */}
      <Stack.Screen
      name="Login"
      component={LoginScreen}
      options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Tabs"
        component={MainTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ReportScreen"
        component={ReportScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
  name="ChatList"
  component={ChatListScreen}
  options={{
    title: 'Chats',
    headerTitleStyle: {
      fontFamily: 'Poppins_700Bold',
      color: COLORS.primary,
      fontSize: 24,
      paddingLeft: -15,
    },
    headerTitleAlign: 'center',
    headerStyle: {
      backgroundColor: COLORS.background,
      elevation: 0,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.18,
      shadowRadius: 4,
      elevation: 8,
    },
  }}
/>

      <Stack.Screen
        name="Chat"
        component={ChatProfileScreen}
        options={{ headerTitle: 'Chat' }}
      />
      <Stack.Screen
        name="NotificationsScreen"
        component={NotificationsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePasswordScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
    name="MainTabs"
    component={MainTabs}
    options={{ headerShown: false }}
    />
    </Stack.Navigator>
    

  );
}

export default function App() {
  return (
    <ThemeProvider>
      <NavigationContainer ref={navigationRef}>
        <Drawer.Navigator
          id="MainDrawer"
          screenOptions={{
            headerShown: false,
            drawerStyle: {
              backgroundColor: '#fff',
              width: 240,
            },
            overlayColor: 'rgba(0,0,0,0.3)',
          }}
          drawerContent={props => <CustomDrawerContent {...props} />}
        >
          <Drawer.Screen name="MainStack" component={MainStack} />
          <Drawer.Screen
            name="ConnectionsScreen"
            component={ConnectionsScreen}
            options={{
              drawerLabel: () => null,
              title: null,
              drawerIcon: () => null,
              drawerItemStyle: { height: 0 },
            }}
          />
          <Drawer.Screen
            name="SavedScreen"
            component={SavedScreen}
            options={{
              drawerLabel: () => null,
              title: null,
              drawerIcon: () => null,
              drawerItemStyle: { height: 0 },
            }}
          />
          <Drawer.Screen
            name="PremiumScreen"
            component={PremiumScreen}
            options={{
              drawerLabel: () => null,
              title: null,
              drawerIcon: () => null,
              drawerItemStyle: { height: 0 },
            }}
          />
          <Drawer.Screen
            name="ContactScreen"
            component={ContactScreen}
            options={{
              drawerLabel: () => null,
              title: null,
              drawerIcon: () => null,
              drawerItemStyle: { height: 0 },
            }}
          />
        </Drawer.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}
