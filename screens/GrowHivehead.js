import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// You can import COLORS from your constants file if needed
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

export default function GrowHiveHead() {
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
    width: '120%',
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -105,
    marginLeft: -20,
    paddingTop: 62,
    paddingBottom: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#e0e7ef',
    paddingVertical: 10,
    zIndex: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    marginBottom: 20,
  },
  logoText: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 24,
    letterSpacing: 0.5,
    paddingRight:10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  header: {
    fontSize: 24,
    fontFamily: 'Poppins_700Bold',
    color: '#22223B',
  },
});
