import React from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { COLORS } from './constants';

export default function HomeHeader() {
  const navigation = useNavigation();
  const openDrawer = () => {
    const parent = navigation.getParent('MainDrawer');
    if (parent && parent.openDrawer) {
      parent.openDrawer();
    }
  };

const openChatList = () => {
  navigation.navigate('ChatList');
};
  const openNotifications = () => {
    navigation.navigate('NotificationsScreen');
  };
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: COLORS.background,
        height: 80,
        paddingTop: Platform.OS === 'ios' ? 44 : 32,
        paddingHorizontal: 8,
        borderBottomWidth: 0,
        elevation: 0,
      }}
    >
      {/* Hamburger */}
      <TouchableOpacity onPress={openDrawer} style={{ padding: 8, zIndex: 2 }}>
        <Feather
          name="menu"
          size={25}
          color={COLORS.text}
        />
      </TouchableOpacity>

      {/* Centered Title */}
      <View style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 30,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
        pointerEvents: 'none',
      }}>
        <Text style={{
          fontFamily: 'Poppins_700Bold',
          fontSize: 24,
          textAlign: 'center',
        }}>
          <Text style={{ color: COLORS.logoGreen }}>Grow</Text>
          <Text style={{ color: COLORS.logoBlue }}>Hive</Text>
        </Text>
      </View>

      {/* Right icons */}
      <View style={{ flexDirection: 'row', alignItems: 'center', zIndex: 2 }}>
        <TouchableOpacity onPress={openChatList}>
          <Feather
            name="send"
            size={24}
            color={COLORS.text}
            style={{ marginRight: 18 }}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={openNotifications}>
          <Ionicons
            name="notifications-outline"
            size={24}
            color={COLORS.text}
            style={{ marginRight: 8 }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
