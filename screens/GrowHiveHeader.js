import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from './constants';

export default function GrowHiveHeader() {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.logoText}>
        <Text style={{ color: COLORS.logoGreen }}>Grow</Text>
        <Text style={{ color: COLORS.logoBlue }}>Hive</Text>
      </Text>
    </View>
    
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
marginTop:-10,
    paddingTop: 52,
    paddingBottom: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#e0e7ef',
    zIndex: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
  },
  logoText: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 24,
    letterSpacing: 0.5,
  }
});
