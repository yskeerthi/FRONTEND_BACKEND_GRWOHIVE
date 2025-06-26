
import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import styles from './HackathonStyles'; 
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { COLORS } from './constants';
export default function HackathonsStackScreen() {

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedHackathon, setSelectedHackathon] = useState(null);
  const [name, setName] = useState('');
  const [commitment, setCommitment] = useState('');

  const handleJoinNow = (hackathon) => {
    setSelectedHackathon(hackathon);
    setModalVisible(true);
    setName('');
    setCommitment('');
  };
  const handleJoinTeam = () => {
    setModalVisible(false);
    setTimeout(() => {
      Alert.alert('Success', 'You are successfully part of this team!');
    }, 300);
  };
  const hackathons = [
    {
      id: 1,
      color: '#f2eaff',
      icon: '📅',
      title: 'CodeFest 2023',
      org: 'TechHub',
      date: 'June 15-17, 2023',
      loc: 'Bangalore, India',
      desc: 'Build innovative solutions for real-world problems in this 48-hour coding marathon.',
      avatars: [
        'https://randomuser.me/api/portraits/men/32.jpg',
        'https://randomuser.me/api/portraits/women/44.jpg',
        'https://randomuser.me/api/portraits/men/54.jpg',
      ],
      participants: 42,
      btnColor: '#a084fa',
    },
    {
      id: 2,
      color: '#eaf3ff',
      icon: '🧠',
      title: 'AI Summit Hackathon',
      org: 'DataMinds',
      date: 'July 8-10, 2023',
      loc: 'Delhi, India',
      desc: 'Create cutting-edge AI solutions to tackle challenges in healthcare, education, and sustainability.',
      avatars: [
        'https://randomuser.me/api/portraits/men/65.jpg',
        'https://randomuser.me/api/portraits/women/66.jpg',
      ],
      participants: 38,
      btnColor: '#4ea5ff',
    },
    {
      id: 3,
      color: '#eafcf2',
      icon: '🌱',
      title: 'GreenTech Hackathon',
      org: 'Ecoinovate',
      date: 'August 5-7, 2023',
      loc: 'Hyderabad, India',
      desc: 'Innovate for a sustainable future with eco-friendly tech solutions.',
      avatars: [
        'https://randomuser.me/api/portraits/women/77.jpg',
      ],
      participants: 29,
      btnColor: '#4edfa5',
    },
  ];
  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
       <View style={styles.headerContainer}>
                  <Text style={styles.logoText}>
                    <Text style={{ color: COLORS.logoGreen }}>Grow</Text>
                    <Text style={{ color: COLORS.logoBlue }}>Hive</Text>
                  </Text>
              </View>
      <Text style={styles.header}>Hackathons</Text>
      <Image
        source={{ uri: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80' }}
        style={styles.banner}
        resizeMode="cover"
      />
      <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
        {hackathons.map((h) => (
          <View key={h.id} style={styles.card}>
            <View style={styles.iconRow}>
              <View style={[styles.iconBox, { backgroundColor: h.color }]}>
                <Text style={styles.iconText}>{h.icon}</Text>
              </View>
              <Text style={styles.cardTitle}>{h.title}</Text>
            </View>
            <Text style={styles.cardSubTitle}>Organized by {h.org}</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoText}>🗓️ {h.date}</Text>
              <Text style={styles.dot}>•</Text>
              <Text style={styles.infoText}>📍 {h.loc}</Text>
            </View>
            <Text style={styles.cardDesc}>{h.desc}</Text>
            <View style={styles.participantsRow}>
              {h.avatars.map((a, idx) => (
                <Image key={idx} source={{ uri: a }} style={styles.avatar} />
              ))}
              <Text style={styles.participantsText}>{h.participants} participants</Text>
              <TouchableOpacity
                style={[styles.joinBtn, { backgroundColor: h.btnColor }]}
                onPress={() => handleJoinNow(h)}
              >
                <Text style={styles.joinBtnText}>Join Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Join {selectedHackathon?.title}</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              value={name}
              onChangeText={setName}
              placeholderTextColor="#aaa"
            />
            <TextInput
              style={styles.input}
              placeholder="Commitment (%)"
              value={commitment}
              onChangeText={setCommitment}
              keyboardType="numeric"
              maxLength={3}
              placeholderTextColor="#aaa"
            />
            <TouchableOpacity
              style={styles.modalBtn}
              onPress={handleJoinTeam}
              disabled={!name || !commitment}
            >
              <Text style={styles.modalBtnText}>Join Team</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
