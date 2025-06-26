import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, StatusBar, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts, Poppins_700Bold, Poppins_400Regular } from '@expo-google-fonts/poppins';
import { COLORS } from '../screens/constants';

const { width } = Dimensions.get('window');

// Example: Place girl pic (meet.png) just above main avatar, others spread out
const avatars = [
  // Left-top
  { top: 300, left: 40, bg: '#E0F7FA', img: require('../assets/hackathons.png'), size: 60, transform: [{ rotate: '-10deg' }] },
  // Center above main avatar (girl pic)
  { top: 150, left: width / 2 - 35, bg: '#C7FFD8', img: require('../assets/meet.png'), size: 60, transform: [{ rotate: '4deg' }] },
  // Right-top
  { top: 290, left: width - 110, bg: '#D1E8FF', img: require('../assets/reviews.png'), size: 60, transform: [{ rotate: '-7deg' }] },
];

export default function GetStartedScreen({ navigation }) {
  const [fontsLoaded] = useFonts({ Poppins_700Bold, Poppins_400Regular });

  // Animation refs
  const slideUp = useRef(new Animated.Value(100)).current;
  const growhiveAnim = useRef(new Animated.Value(0)).current;
  const stickerAnims = avatars.map(() => useRef(new Animated.Value(0)).current);
  const mainAvatarAnim = useRef(new Animated.Value(0)).current;
  const titleAnim = useRef(new Animated.Value(0)).current;
  const subtitleAnim = useRef(new Animated.Value(0)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(slideUp, {
      toValue: 0,
      duration: 650,
      useNativeDriver: true,
      easing: Easing.out(Easing.exp),
    }).start();

    Animated.timing(growhiveAnim, {
      toValue: 1,
      duration: 500,
      delay: 350,
      useNativeDriver: true,
      easing: Easing.out(Easing.exp),
    }).start();

    stickerAnims.forEach((anim, idx) => {
      Animated.timing(anim, {
        toValue: 1,
        duration: 500,
        delay: 500 + idx * 120,
        useNativeDriver: true,
        easing: Easing.out(Easing.exp),
      }).start();
    });

    Animated.spring(mainAvatarAnim, {
      toValue: 1,
      delay: 850,
      useNativeDriver: true,
      friction: 6,
      tension: 80,
    }).start();

    Animated.timing(titleAnim, {
      toValue: 1,
      duration: 400,
      delay: 1100,
      useNativeDriver: true,
    }).start();
    Animated.timing(subtitleAnim, {
      toValue: 1,
      duration: 400,
      delay: 1250,
      useNativeDriver: true,
    }).start();
    Animated.timing(buttonAnim, {
      toValue: 1,
      duration: 400,
      delay: 1400,
      useNativeDriver: true,
    }).start();
  }, []);

  if (!fontsLoaded) return null;

  return (
    <Animated.View style={{ flex: 1, transform: [{ translateY: slideUp }] }}>
      <LinearGradient
        colors={['#34e3b0','#f6fbfa']}
        style={styles.gradient}
        start={{ x: 0.1, y: 0.8 }}
        end={{ x: 1, y: 0 }}
      >
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

        {/* Animated GrowHive Title */}
        <Animated.Text
  style={[
    styles.growhive,
    {
      opacity: growhiveAnim,
      transform: [
        {
          translateY: growhiveAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [-30, 0],
          }),
        },
      ],
    },
  ]}
>
  <Text style={{ color: '#34e3b0', fontFamily: 'Poppins_700Bold' }}>Grow</Text>
  <Text style={{ color: '#2563eb', fontFamily: 'Poppins_700Bold' }}>Hive</Text>
</Animated.Text>


        {/* Animated Stickers */}
        {avatars.map((a, idx) => (
          <Animated.View
            key={idx}
            style={[
              {
                position: 'absolute',
                top: a.top,
                left: a.left,
                backgroundColor: a.bg,
                width: a.size + 30,
                height: a.size + 30,
                borderRadius: 18,
                justifyContent: 'center',
                alignItems: 'center',
                elevation: 3,
                shadowColor: '#000',
                shadowOpacity: 0.10,
                shadowOffset: { width: 0, height: 4 },
                shadowRadius: 8,
                transform: [
                  ...a.transform,
                  { scale: stickerAnims[idx].interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }) },
                  { translateY: stickerAnims[idx].interpolate({ inputRange: [0, 1], outputRange: [40, 0] }) },
                ],
                opacity: stickerAnims[idx],
              },
            ]}
          >
            <Image
              source={a.img}
              style={{
                width: a.size + 45,
                height: a.size + 45,
                borderRadius: (a.size + 45) / 3,
                resizeMode: 'cover',
              }}
            />
          </Animated.View>
        ))}

        {/* Animated Main Avatar */}
        <Animated.View
          style={[
            styles.mainAvatarContainer,
            {
              transform: [
                {
                  scale: mainAvatarAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.7, 1],
                  }),
                },
                {
                  translateY: mainAvatarAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [60, 0],
                  }),
                },
              ],
              opacity: mainAvatarAnim,
            },
          ]}
        >
          <View style={styles.mainAvatarBg}>
            <Image
              source={require('../assets/people.png')}
              style={styles.mainAvatar}
            />
          </View>
        </Animated.View>

        {/* Animated Text Section */}
        <Animated.View
          style={[
            styles.textSection,
            {
              opacity: titleAnim,
              transform: [
                {
                  translateY: titleAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [30, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
            Let's Get Started..
          </Text>
        </Animated.View>

        <Animated.View
          style={[
            { width: '85%', alignItems: 'center', opacity: subtitleAnim },
            {
              transform: [
                {
                  translateY: subtitleAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.subtitle}>
            Unlock a world of limitless skills and knowledge with GrowHive, where sharing is caring!
          </Text>
        </Animated.View>

        {/* Animated Join Now Button and Login */}
        <Animated.View
          style={{
            opacity: buttonAnim,
            transform: [{
              translateY: buttonAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [30, 0],
              }),
            }],
            width: '100%',
            alignItems: 'center',
          }}
        >
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.joinButton}
            onPress={() => navigation.navigate('Signup')}
          >
            <Text style={styles.joinButtonText}>Join Now</Text>
          </TouchableOpacity>
          <Text style={styles.loginText}>
            Already have an account?{' '}
            <Text style={styles.loginLink} onPress={() => navigation.navigate('Login')}>
              Login
            </Text>
          </Text>
        </Animated.View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingTop: 40,
  },
  growhive: {
    position: 'absolute',
    top: 30,
    alignSelf: 'center',
    fontSize: 30,
    color: '#fff',
    fontFamily: 'Poppins_700Bold',
    letterSpacing: 2,
    textShadowColor: 'rgba(0,0,0,0.10)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 2,
    zIndex: 10,
    paddingTop: 30,
  },
  mainAvatarContainer: {
    position: 'absolute',
    top: 390,
    left: width / 2 - 80,
    zIndex: 2,
  },
  mainAvatarBg: {
    backgroundColor: '#fff',
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.secondary,
    shadowOpacity: 0.13,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 20,
    elevation: 6,
  },
  mainAvatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
  },
  textSection: {
    marginTop: 320,
    width: '85%',
    alignItems: 'center',
    marginBottom: 0,
  },
  title: {
    fontSize: 32,
    color: 'white',
    marginBottom: 8,
    letterSpacing: 0.5,
    fontFamily: 'Poppins_700Bold',
    textAlign: 'center',
    alignSelf: 'center',
    width: '100%',
    textShadowColor: 'rgba(0,0,0,0.10)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 15,
    color: '#e3f7f0',
    opacity: 0.9,
    marginBottom: 16,
    fontFamily: 'Poppins_400Regular',
    textAlign: 'center',
    lineHeight: 20,
  },
  joinButton: {
    width: '80%',
    backgroundColor: '#2D68C4',
    borderRadius: 16,
    paddingVertical: 13,
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.11,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 2,
  },
  joinButtonText: {
    color: '#fff',
    fontSize: 17,
    fontFamily: 'Poppins_700Bold',
    letterSpacing: 0.2,
  },
  loginText: {
    color: '#e3f7f0',
    fontSize: 13,
    marginBottom: 28,
    textAlign: 'center',
    fontFamily: 'Poppins_400Regular',
  },
  loginLink: {
    color: '#fff',
    fontFamily: 'Poppins_700Bold',
    textDecorationLine: 'underline',
  },
});
