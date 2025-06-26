import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MainTabs from './MainTabs';
import ContactScreen from './ContactScreen' ; // Your non-tab screen

const Stack = createStackNavigator();

export default function MainStackScreen() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={MainTabs} />
      <Stack.Screen name="Contact" component={Contact} />
      {/* Add other non-tab screens here if needed */}
    </Stack.Navigator>
  );
}
