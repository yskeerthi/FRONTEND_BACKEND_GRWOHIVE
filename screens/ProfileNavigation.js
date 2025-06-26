import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import ProfileScreen from './ProfileScreen';
import EditProfileScreen from './EditProfileScreen';
import ChangePasswordScreen from './ChangePasswordScreen'; // import the screen
import SettingsScreen from './SettingsScreen';

const Stack = createNativeStackNavigator();

export default function ProfileNavigation() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
