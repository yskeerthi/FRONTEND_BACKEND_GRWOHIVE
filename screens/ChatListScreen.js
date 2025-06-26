import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet
} from 'react-native';
import axios from 'axios';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import socket from '../utils/socket'; // ✅ Add this

const API_URL = "http://192.168.137.1:5000";

const ChatListScreen = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const storedId = await AsyncStorage.getItem('currentUserId');
      if (!storedId) {
        console.warn('⚠️ No currentUserId found');
        setLoading(false);
        return;
      }

      setCurrentUserId(storedId);

      // ✅ Socket.IO user setup for real-time
      socket.emit("setup", storedId);

      // ✅ Get all users except current user
      const res = await axios.get(`${API_URL}/api/auth/all-users/${storedId}`);
      setUsers(res.data);
    } catch (error) {
      console.error("❌ Failed to fetch users:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) fetchUsers();
  }, [isFocused]);

  const openChat = (otherUserId, otherUserName) => {
    navigation.navigate('Chat', {
      otherUserId,
      otherUserName,
    });
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <FlatList
      data={users}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.chatItem}
          onPress={() => openChat(item._id, item.name)}
        >
          <Text style={styles.name}>{item.name}</Text>
        </TouchableOpacity>
      )}
      ListEmptyComponent={() => (
        <Text style={styles.emptyText}>No users found</Text>
      )}
    />
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
  },
});

export default ChatListScreen;
