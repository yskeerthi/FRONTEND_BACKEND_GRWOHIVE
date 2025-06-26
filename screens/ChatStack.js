// ChatStack.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ChatListScreen from './ChatListScreen';
import ChatScreen from './ChatScreen';

const Stack = createStackNavigator();

export default function ChatStack() {
  return (
    <Stack.Navigator>   
      <Stack.Screen
        name="ChatList"
        component={ChatListScreen}
        options={{ title: 'Chats' }}
      />
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={{ headerShown: false }} // ChatScreen sets its own header
      />
    </Stack.Navigator>
  );
}
