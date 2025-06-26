import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { navigationRef } from './navigationref';

export default function CustomDrawerContent(props) {
  let [fontsLoaded] = useFonts({ Poppins_400Regular, Poppins_700Bold });
  if (!fontsLoaded) return null;

  const goToTab = (tabName) => {
    props.navigation.closeDrawer();
    setTimeout(() => {
      if (navigationRef.isReady()) {
        navigationRef.navigate('Tabs', { screen: tabName });
      }
    }, 300);
  };

  const goToConnections = () => {
    props.navigation.closeDrawer();
    setTimeout(() => {
      if (navigationRef.isReady()) {
        navigationRef.navigate('ConnectionsScreen');
      }
    }, 300);
  };

  // Bookmarks screen
  const goToSavedScreen = () => {
    props.navigation.closeDrawer();
    setTimeout(() => {
      if (navigationRef.isReady()) {
        navigationRef.navigate('SavedScreen'); // Correct name
      }
    }, 300);
  };
  const goToContactScreen = () => {
    props.navigation.closeDrawer();
    setTimeout(() => {
      if (navigationRef.isReady()) {
        navigationRef.navigate('ContactScreen'); // Correct name
      }
    }, 300);
  };
    const goToPremiumScreen = () => {
    props.navigation.closeDrawer();
    setTimeout(() => {
      if (navigationRef.isReady()) {
        navigationRef.navigate('PremiumScreen'); // Correct name
      }
    }, 300);
  };
  return (
    <View style={styles.drawerContainer}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <Text style={styles.menuHeader}>Menu</Text>
        <DrawerItem
          onPress={() => goToTab('Profile')}
          icon={<Ionicons name="person-outline" size={22} color="#222" />}
          text="Personal Details"
        />
        <DrawerItem
          onPress={goToConnections}
          icon={<Feather name="users" size={22} color="#222" />}
          text="Connections"
        />
        <DrawerItem
        onPress={goToPremiumScreen}
          icon={<MaterialCommunityIcons name="crown-outline" size={22} color="#222" />}
          text="Premium"
        />
        <DrawerItem
          onPress={() => goToTab('Schedule')}
          icon={<Feather name="calendar" size={22} color="#222" />}
          text="Time Table"
        />
        <DrawerItem
          onPress={goToSavedScreen}
          icon={<Ionicons name="bookmark-outline" size={22} color="#222" />}
          text="Saved"
        />
        <DrawerItem
          onPress={goToContactScreen}
          icon={<Ionicons name="help-circle-outline" size={22} color="#222" />}
          text="Help and feedback"
        />
      </ScrollView>
      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={styles.closeDrawerBtn}
          onPress={() => props.navigation.closeDrawer()}
        >
          <Feather name="log-out" size={28} color="#222" />
        </TouchableOpacity>
        <View style={styles.privacyRow}>
          <Text style={styles.privacyText}>Privacy Policy • Terms of Policy</Text>
        </View>
      </View>
    </View>
  );
}

function DrawerItem({ onPress, icon, text }) {
  return (
    <>
      <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
        {icon}
        {text ? <Text style={styles.menuText}>{text}</Text> : null}
      </TouchableOpacity>
      <View style={styles.divider} />
    </>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: "#fff",
    alignSelf: 'flex-start',
    paddingTop: 44,
    paddingBottom: 0,
    justifyContent: 'space-between'
  },
  menuHeader: {
    fontFamily: "Poppins_700Bold",
    fontSize: 24,
    marginTop: 10,
    marginBottom: 18,
    textAlign: 'left',
    color: "#222",
    letterSpacing: 0.5,
    paddingLeft: 18
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 18,
    backgroundColor: "transparent",
    width: '100%',
    borderRadius: 6,
    marginBottom: 0
  },
  menuText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 16,
    marginLeft: 18,
    color: "#222",
    flexShrink: 1
  },
  divider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginLeft: 18,
    marginRight: 18,
    marginBottom: 8,
    marginTop: 8,
    width: '100%',
    alignSelf: 'center'
  },
  privacyRow: {
    marginTop: 8,
    marginBottom: 18,
    alignItems: "flex-start",
    paddingLeft: 18
  },
  privacyText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
    color: "#aaa"
  },
  bottomSection: {
    borderTopWidth: 1,
    borderTopColor: "#222",
    paddingVertical: 0,
    paddingBottom: 0,
    alignItems: 'flex-start',
    justifyContent: 'flex-end'
  },
  closeDrawerBtn: {
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    paddingVertical: 16,
    paddingLeft: 12,
    marginBottom: 0,
  }
});
