import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useFonts, Poppins_700Bold, Poppins_400Regular, Poppins_600SemiBold } from '@expo-google-fonts/poppins';

import { COLORS } from './constants';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';

const notifications = {
  Today: [
    {
      id: 0,
      user: 'GrowHive',
      message: 'Meeting scheduled at 5:00 PM.',
      time: 'Just now',
      avatar: require('../assets/user.png'),
      actions: ['Join Now'],
    },
  ],
  'Last 7 days': [
    {
      id: 1,
      user: 'Vijay',
      message: 'requested to follow you.',
      time: '1d',
      avatar: require('../assets/user.png'),
      actions: ['Confirm', 'Delete'],
    },
    {
      id: 2,
      user: 'Rohitha',
      message: 'accepted your follow request.',
      time: '2d',
      avatar: require('../assets/user.png'),
      actions: ['Following'],
    },
    {
      id: 3,
      user: 'Rohitha',
      message: 'started following you.',
      time: '2d',
      avatar: require('../assets/user.png'),
      actions: ['Following'],
    },
  ],
  'Last 30 days': [
    {
      id: 4,
      user: 'Venu',
      message: 'liked your photo.',
      time: '2w',
      avatar: require('../assets/logo.jpg'),
    },
    {
      id: 5,
      user: 'venu',
      message: 'started following you.',
      time: '2w',
      avatar: require('../assets/logo.jpg'),
      actions: ['Following'],
    },
    {
      id: 6,
      user: 'srujana_balam and Nagendra',
      message: 'accepted your follow request.',
      time: '2w',
      avatar: require('../assets/user.png'),
    },
  ],
};

export default function NotificationsScreen() {
  const navigation = useNavigation();

  let [fontsLoaded] = useFonts({
    Poppins_700Bold,
    Poppins_400Regular,
    Poppins_600SemiBold,
  });

  if (!fontsLoaded) {
    return <Text style={{ textAlign: 'center', marginTop: 50 }}>Loading...</Text>;
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Custom header with shadow */}
      <View style={styles.customHeader}>
        <Ionicons
          name="chevron-back"
          size={28}
          color="#0D2A64"
          onPress={() => navigation.goBack()}
          style={{ paddingRight: 10 }}
        />
        <Text style={styles.headerTitle}>Notifications</Text>
        {/* Empty View to balance the layout */}
        <View style={{ width: 28 }} />
      </View>

      <ScrollView style={styles.container}>
        {Object.entries(notifications).map(([section, items]) => (
          <View key={section}>
            <Text style={styles.sectionTitle}>{section}</Text>
            {items.map((item) => (
              <View key={item.id} style={styles.notificationRow}>
                <Image source={item.avatar} style={styles.avatar} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.message}>
                    <Text style={styles.username}>{item.user} </Text>
                    {item.message}
                  </Text>
                  <Text style={styles.time}>{item.time}</Text>
                </View>
                {item.actions?.map((action) => (
                  <TouchableOpacity
                    key={action}
                    style={[
                      styles.actionButton,
                      action === 'Confirm'
                        ? styles.confirm
                        : action === 'Delete'
                        ? styles.delete
                        : styles.following,
                    ]}
                  >
                    <Text
                      style={[
                        styles.actionText,
                        action === 'Delete' && { color: '#333' },
                      ]}
                    >
                      {action}
                    </Text>
                  </TouchableOpacity>
                ))}
                {item.photo && (
                  <Image source={item.photo} style={styles.photoThumb} />
                )}
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 12,
    paddingTop: 34,
  },
  customHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 12,
    paddingBottom: 10,
    backgroundColor: COLORS.background,
    justifyContent: 'space-between',
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    // Shadow for Android
    elevation: 6,
    zIndex: 10,
  },
  headerTitle: {
    color: COLORS.secondary,
    fontSize: 22,
    fontFamily: 'Poppins_700Bold',
    flex: 1,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Poppins_700Bold',
    color: COLORS.secondary,
    marginBottom: 8,
  },
  notificationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginRight: 10,
  },
  message: {
    fontSize: 14,
    color: COLORS.text,
    fontFamily: 'Poppins_400Regular',
  },
  username: {
    fontFamily: 'Poppins_600SemiBold',
    color: COLORS.text,
  },
  time: {
    fontSize: 12,
    color: COLORS.muted,
    fontFamily: 'Poppins_400Regular',
  },
  actionButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginLeft: 6,
  },
  confirm: {
    backgroundColor: COLORS.primary,
  },
  delete: {
    backgroundColor: COLORS.shadow,
  },
  following: {
    backgroundColor: COLORS.primary,
  },
  actionText: {
    fontSize: 13,
    color: COLORS.card,
    fontFamily: 'Poppins_400Regular',
  },
  photoThumb: {
    width: 40,
    height: 40,
    marginLeft: 10,
    borderRadius: 6,
  },
});
