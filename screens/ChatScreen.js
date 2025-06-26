import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
  Alert,
  Image,
  Pressable,
  Dimensions,
  SafeAreaView,
  Platform,
  StatusBar,
  Keyboard,
  KeyboardAvoidingView,
  Linking,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import socket from '../utils/socket';
import axios from 'axios';

const API_URL = 'http://192.168.137.1:5000';
const { width, height } = Dimensions.get('window');

const COLORS = {
  primary: '#34e3b0',
  secondary: '#34e3b0',
  background: '#f6fbfa',
  ownMessage: '#E8F4EA',
  otherMessage: '#FFFFFF',
  recording: '#34e3b0',
};

export default function ChatScreen({ navigation, route }) {
  const { otherUserId, otherUserName } = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUserId, setCurrentUserId] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [audioPermission, setAudioPermission] = useState(false);
  const [sound, setSound] = useState(null);
  const [playingMessageId, setPlayingMessageId] = useState(null);
  const [playbackPosition, setPlaybackPosition] = useState({});
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [inputContainerHeight, setInputContainerHeight] = useState(0);
  // NEW STATES FOR WHATSAPP FEATURES
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  const flatRef = useRef(null);
  const recordingTimer = useRef(null);
  const isStartingOrStopping = useRef(false);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => <Text style={styles.headerTitle}>{otherUserName}</Text>,
      headerRight: () => (
        <TouchableOpacity onPress={() => setMenuVisible(true)} style={{ paddingRight: 12 }}>
          <Ionicons name="ellipsis-vertical" size={24} color="white" />
        </TouchableOpacity>
      ),
      headerStyle: { backgroundColor: COLORS.primary },
      headerTintColor: 'white',
    });
  }, [otherUserName, navigation]);

  const scrollToBottom = useCallback(() => {
    if (flatRef.current) {
      requestAnimationFrame(() => {
        flatRef.current.scrollToEnd({ animated: true });
      });
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      const id = await AsyncStorage.getItem('currentUserId') || 'user1';
      setCurrentUserId(id);

      await setupAudio();

      socket.connect();
      socket.emit('setup', id);

      socket.on('receiveMessage', (msg) => {
        if (msg.senderId === otherUserId && msg.receiverId === id) {
          setMessages((prev) => [...prev, msg]);
          scrollToBottom();
        }
      });

      // NEW: Listen for message status updates
      socket.on('messageDelivered', (data) => {
        if (data.senderId === id) {
          setMessages(prev => prev.map(msg => 
            msg.id === data.messageId 
              ? { ...msg, status: 'delivered' } 
              : msg
          ));
        }
      });

      socket.on('messageSeen', (data) => {
        if (data.senderId === id) {
          setMessages(prev => prev.map(msg => 
            msg.id === data.messageId 
              ? { ...msg, status: 'seen' } 
              : msg
          ));
        }
      });

      // NEW: Simulate network status
      const networkInterval = setInterval(() => {
        setIsOnline(Math.random() > 0.1); // 90% online
      }, 10000);

      try {
        const res = await axios.get(`${API_URL}/api/messages/history/${id}/${otherUserId}`);
        setMessages(res.data);
        scrollToBottom();
      } catch (error) {
        console.error('Error fetching messages:', error);
        Alert.alert('Error', 'Failed to load message history.');
      }

      return () => clearInterval(networkInterval);
    };
    init();

    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (e) => {
      setKeyboardHeight(e.endCoordinates.height);
      setTimeout(() => scrollToBottom(), 100);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
      setTimeout(() => scrollToBottom(), 100);
    });

    return () => {
      socket.off('receiveMessage');
      socket.off('messageDelivered');
      socket.off('messageSeen');
      socket.disconnect();
      if (recordingTimer.current) clearInterval(recordingTimer.current);
      if (recording) recording.stopAndUnloadAsync().catch(() => {});
      if (sound) sound.unloadAsync().catch(() => {});
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [otherUserId, scrollToBottom]);

const setupAudio = async () => {
  try {
    const { status } = await Audio.requestPermissionsAsync();
    setAudioPermission(status === 'granted');
    
    if (status !== 'granted') {
      Alert.alert(
        'Permission Denied',
        'Microphone access is required for voice messages. Please enable it in Settings.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => Linking.openSettings() },
        ]
      );
      return;
    }

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });
  } catch (error) {
    console.error('Audio setup error:', error.message);
    Alert.alert(
      'Error',
      'Failed to initialize audio. Please check your microphone and try again.'
    );
  }
};

const uploadAudio = async (audioUri, messageId) => {
  if (!audioUri || !messageId) {
    console.error('Invalid audio URI or message ID:', { audioUri, messageId });
    Alert.alert('Error', 'Invalid audio file.');
    return null;
  }

  try {
    const formData = new FormData();
    formData.append('audio', {
      uri: audioUri,
      name: `audio-${messageId}.m4a`,
      type: 'audio/m4a',
    });

    const uploadRes = await axios.post(`${API_URL}/api/upload-audio`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 30000, // 30-second timeout
    });

    if (!uploadRes.data.url) {
      throw new Error('No URL returned from server');
    }

    return uploadRes.data.url;
  } catch (error) {
    console.error('Audio upload error:', error.response?.data || error.message);
    Alert.alert(
      'Error',
      'Failed to upload audio. Please check your network and try again.'
    );
    return null;
  }
};
  // New function to upload documents
  const uploadDocument = async (documentUri, fileName, messageId) => {
    const formData = new FormData();
    formData.append('document', {
      uri: documentUri,
      name: fileName,
      type: 'application/octet-stream',
    });

    try {
      const uploadRes = await axios.post(`${API_URL}/api/upload-document`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return uploadRes.data.url;
    } catch (error) {
      console.error('Error uploading document:', error.response?.data || error.message);
      Alert.alert('Error', 'Failed to upload document file.');
      return null;
    }
  };

  // Function to open document in browser
  const openDocumentInBrowser = async (documentUrl, fileName) => {
    try {
      // Check if the URL can be opened
      const supported = await Linking.canOpenURL(documentUrl);
      
      if (supported) {
        await Linking.openURL(documentUrl);
      } else {
        // Fallback: try to open with Google Docs viewer for PDFs
        const googleDocsUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(documentUrl)}`;
        const canOpenGoogleDocs = await Linking.canOpenURL(googleDocsUrl);
        
        if (canOpenGoogleDocs) {
          await Linking.openURL(googleDocsUrl);
        } else {
          Alert.alert('Error', 'Cannot open this document. Please install a PDF viewer app.');
        }
      }
    } catch (error) {
      console.error('Error opening document:', error);
      Alert.alert('Error', 'Failed to open document.');
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const payload = {
      id: Date.now().toString(),
      senderId: currentUserId,
      receiverId: otherUserId,
      text: newMessage,
      type: 'text',
      createdAt: new Date().toISOString(),
      status: 'sent', // NEW: Initial status
    };

    setMessages((prev) => [...prev, payload]);
    setNewMessage('');
    setIsTyping(false); // NEW: Stop typing indicator
    socket.emit('sendMessage', payload);

    try {
      await axios.post(`${API_URL}/api/messages/send`, payload);
      
      // NEW: Simulate message status updates
      setTimeout(() => {
        if (isOnline) {
          setMessages(prev => prev.map(msg => 
            msg.id === payload.id 
              ? { ...msg, status: 'delivered' } 
              : msg
          ));
          
          // Simulate seen after 3 seconds
          setTimeout(() => {
            setMessages(prev => prev.map(msg => 
              msg.id === payload.id 
                ? { ...msg, status: 'seen' } 
                : msg
            ));
          }, 3000);
        }
      }, 1000);
      
    } catch (error) {
      console.error('Error sending message payload:', error);
      Alert.alert('Error', 'Failed to send message. Please try again.');
    }

    scrollToBottom();
  };

 const sendImage = async (source = 'gallery') => {
  try {
    // Check permissions
    const permissionType = source === 'camera' ? 'camera' : 'mediaLibrary';
    const permissionResult = await ImagePicker[`request${permissionType.charAt(0).toUpperCase() + permissionType.slice(1)}PermissionsAsync`]();
    
    if (!permissionResult.granted) {
      Alert.alert('Permission Denied', `Please enable ${source} access in Settings.`);
      return;
    }

    let result;
    if (source === 'camera') {
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });
    }

    if (!result.canceled && result.assets.length > 0) {
      const img = result.assets[0];
      const payload = {
        id: Date.now().toString(),
        senderId: currentUserId,
        receiverId: otherUserId,
        text: img.uri,
        type: 'image',
        createdAt: new Date().toISOString(),
        status: 'sent', // NEW: Initial status
      };
      setMessages((prev) => [...prev, payload]);
      socket.emit('sendMessage', payload);
      await axios.post(`${API_URL}/api/messages/send`, payload);
      
      // NEW: Simulate status updates for images too
      setTimeout(() => {
        if (isOnline) {
          setMessages(prev => prev.map(msg => 
            msg.id === payload.id 
              ? { ...msg, status: 'delivered' } 
              : msg
          ));
          setTimeout(() => {
            setMessages(prev => prev.map(msg => 
              msg.id === payload.id 
                ? { ...msg, status: 'seen' } 
                : msg
            ));
          }, 3000);
        }
      }, 1000);
      
      scrollToBottom();
    }
  } catch (error) {
    console.error(`Error ${source === 'camera' ? 'capturing' : 'selecting'} image:`, error);
    Alert.alert('Error', `Failed to ${source === 'camera' ? 'capture' : 'select'} image. Please try again.`);
  }
};
  const sendDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ 
        type: '*/*',
        copyToCacheDirectory: true,
      });
      
      if (!result.canceled && result.assets.length > 0) {
        const file = result.assets[0];
        const messageId = Date.now().toString();
        
        // Upload document to server and get public URL
        const publicDocumentUrl = await uploadDocument(file.uri, file.name, messageId);
        
        if (!publicDocumentUrl) {
          Alert.alert('Error', 'Failed to upload document. Message not sent.');
          return;
        }

        const payload = {
          id: messageId,
          senderId: currentUserId,
          receiverId: otherUserId,
          text: publicDocumentUrl, // Store the public URL
          type: 'document',
          fileName: file.name,
          fileSize: file.size,
          mimeType: file.mimeType,
          createdAt: new Date().toISOString(),
          status: 'sent', // NEW: Initial status
        };
        
        setMessages((prev) => [...prev, payload]);
        socket.emit('sendMessage', payload);
        
        try {
          await axios.post(`${API_URL}/api/messages/send`, payload);
          
          // NEW: Simulate status updates for documents
          setTimeout(() => {
            if (isOnline) {
              setMessages(prev => prev.map(msg => 
                msg.id === payload.id 
                  ? { ...msg, status: 'delivered' } 
                  : msg
              ));
              setTimeout(() => {
                setMessages(prev => prev.map(msg => 
                  msg.id === payload.id 
                    ? { ...msg, status: 'seen' } 
                    : msg
                ));
              }, 3000);
            }
          }, 1000);
          
        } catch (error) {
          console.error('Error sending document message:', error);
          Alert.alert('Error', 'Failed to save document message.');
        }
        
        scrollToBottom();
      }
    } catch (error) {
      console.error('Error sending document:', error);
      Alert.alert('Error', 'Failed to send document. Please try again.');
    }
  };

  const startRecording = async () => {
    if (!audioPermission) {
      Alert.alert('Permission Denied', 'Microphone access is required to record voice messages.');
      return;
    }

    if (isStartingOrStopping.current || isRecording) {
      return;
    }

    isStartingOrStopping.current = true;

    try {
      if (sound) {
        await sound.unloadAsync();
        setSound(null);
        setPlayingMessageId(null);
      }

      if (recording) {
        try {
          await recording.stopAndUnloadAsync();
        } catch (err) {
          console.error('Error cleaning up previous recording:', err);
        }
        setRecording(null);
      }

      setIsRecording(true);
      setRecordingDuration(0);

      const recordingOptions = {
        android: {
          extension: '.m4a',
          outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
          audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
          sampleRate: 44100,
          numberOfChannels: 1,
          bitRate: 128000,
        },
        ios: {
          extension: '.m4a',
          audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
          sampleRate: 44100,
          numberOfChannels: 1,
          bitRate: 128000,
        },
      };
      const { recording: newRecording } = await Audio.Recording.createAsync(recordingOptions);
      setRecording(newRecording);
      recordingTimer.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Recording failed to start:', error);
      Alert.alert('Error', 'Failed to start recording.');
      setIsRecording(false);
      setRecording(null);
      setRecordingDuration(0);
      if (recordingTimer.current) {
        clearInterval(recordingTimer.current);
        recordingTimer.current = null;
      }
    } finally {
      isStartingOrStopping.current = false;
    }
  };

  const stopRecording = async () => {
    if (isStartingOrStopping.current || !recording) {
      setIsRecording(false);
      setRecording(null);
      setRecordingDuration(0);
      if (recordingTimer.current) {
        clearInterval(recordingTimer.current);
        recordingTimer.current = null;
      }
      isStartingOrStopping.current = false;
      return;
    }

    isStartingOrStopping.current = true;

    try {
      if (recordingTimer.current) {
        clearInterval(recordingTimer.current);
        recordingTimer.current = null;
      }

      const uri = recording.getURI();
      await recording.stopAndUnloadAsync();
      setRecording(null);

      if (uri && recordingDuration >= 1) {
        const messageId = Date.now().toString();
        const publicAudioUrl = await uploadAudio(uri, messageId);

        if (!publicAudioUrl) {
          Alert.alert('Error', 'Failed to upload audio. Message not sent.');
          return;
        }

        const payload = {
          id: messageId,
          senderId: currentUserId,
          receiverId: otherUserId,
          text: publicAudioUrl,
          type: 'audio',
          duration: recordingDuration,
          createdAt: new Date().toISOString(),
          status: 'sent', // NEW: Initial status
        };

        setMessages((prev) => [...prev, payload]);
        socket.emit('sendMessage', payload);

        try {
          await axios.post(`${API_URL}/api/messages/send`, payload);
          
          // NEW: Simulate status updates for audio
          setTimeout(() => {
            if (isOnline) {
              setMessages(prev => prev.map(msg => 
                msg.id === payload.id 
                  ? { ...msg, status: 'delivered' } 
                  : msg
              ));
              setTimeout(() => {
                setMessages(prev => prev.map(msg => 
                  msg.id === payload.id 
                    ? { ...msg, status: 'seen' } 
                    : msg
                ));
              }, 3000);
            }
          }, 1000);
          
        } catch (error) {
          console.error('Error sending voice message payload:', error);
          Alert.alert('Error', 'Failed to save voice message.');
        }

        scrollToBottom();
      } else {
        Alert.alert('Recording Too Short', 'Voice message must be at least 1 second long.');
      }
    } catch (error) {
      console.error('Error during stop recording or sending:', error);
      Alert.alert('Error', 'Failed to stop recording or send voice message.');
    } finally {
      setIsRecording(false);
      setRecording(null);
      setRecordingDuration(0);
      if (recordingTimer.current) {
        clearInterval(recordingTimer.current);
        recordingTimer.current = null;
      }
      isStartingOrStopping.current = false;
    }
  };

  const toggleVoicePlayback = async (audioUri, messageId) => {
    if (!audioUri || typeof audioUri !== 'string') {
      Alert.alert('Error', 'Invalid audio file.');
      return;
    }

    try {
      if (playingMessageId === messageId && sound) {
        const status = await sound.getStatusAsync();
        if (status.isLoaded && status.isPlaying) {
          await sound.pauseAsync();
          setPlayingMessageId(null);
          return;
        }
      }
      if (sound) {
        await sound.unloadAsync();
        setSound(null);
      }
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUri },
        { shouldPlay: true, isLooping: false }
      );
      setSound(newSound);
      setPlayingMessageId(messageId);
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          if (status.didJustFinish) {
            setPlayingMessageId(null);
            setPlaybackPosition((prev) => ({ ...prev, [messageId]: 0 }));
          } else if (status.isPlaying) {
            const position = Math.floor(status.positionMillis / 1000);
            setPlaybackPosition((prev) => ({ ...prev, [messageId]: position }));
          }
        }
      });
    } catch (error) {
      console.error('Voice playback failed:', error);
      Alert.alert('Playback Error', 'Failed to play audio.');
    }
  };

  const openImageModal = (imageUri) => {
    setSelectedImage(imageUri);
    setImageModalVisible(true);
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })}, ${date.getFullYear()}`;
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (fileName, mimeType) => {
    if (!fileName && !mimeType) return 'document';
    
    const extension = fileName ? fileName.split('.').pop().toLowerCase() : '';
    const type = mimeType ? mimeType.toLowerCase() : '';
    
    if (extension === 'pdf' || type.includes('pdf')) return 'document-text';
    if (['doc', 'docx'].includes(extension) || type.includes('word')) return 'document-text';
    if (['xls', 'xlsx'].includes(extension) || type.includes('sheet')) return 'grid';
    if (['ppt', 'pptx'].includes(extension) || type.includes('presentation')) return 'easel';
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension) || type.includes('image')) return 'image';
    if (['mp4', 'avi', 'mov'].includes(extension) || type.includes('video')) return 'videocam';
    if (['mp3', 'wav', 'aac'].includes(extension) || type.includes('audio')) return 'musical-notes';
    if (['zip', 'rar', '7z'].includes(extension) || type.includes('zip')) return 'archive';
    
    return 'document';
  };

  // NEW: Function to get tick icon based on message status
  const getTickIcon = (status) => {
    switch (status) {
      case 'sent':
        return <Ionicons name="checkmark" size={14} color="#999" />; // Single tick
      case 'delivered':
        return (
          <View style={styles.doubleTickContainer}>
            <Ionicons name="checkmark" size={14} color="#999" style={styles.firstTick} />
            <Ionicons name="checkmark" size={14} color="#999" style={styles.secondTick} />
          </View>
        ); // Double tick gray
      case 'seen':
        return (
          <View style={styles.doubleTickContainer}>
            <Ionicons name="checkmark" size={14} color="#4FC3F7" style={styles.firstTick} />
            <Ionicons name="checkmark" size={14} color="#4FC3F7" style={styles.secondTick} />
          </View>
        ); // Double tick blue
      default:
        return <Ionicons name="checkmark" size={14} color="#999" />;
    }
  };

  // NEW: Handle text input changes with typing indicator
  const handleTextChange = (text) => {
    setNewMessage(text);
    setIsTyping(text.length > 0);
  };

  const onInputContainerLayout = (event) => {
    const { height } = event.nativeEvent.layout;
    if (height !== inputContainerHeight) {
      setInputContainerHeight(height);
    }
  };

  const renderMessage = useCallback(
    ({ item, index }) => {
      const isOwnMessage = item.senderId === currentUserId;
      const isPlaying = playingMessageId === item.id;
      const currentPosition = playbackPosition[item.id] || 0;
      const messageId = item.id || index.toString();

      const showDate =
        index === 0 ||
        new Date(item.createdAt).toDateString() !==
          new Date(messages[index - 1]?.createdAt).toDateString();

      return (
        <View>
          {showDate && (
            <View style={styles.dateContainer}>
              <Text style={styles.dateText}>{formatDate(item.createdAt)}</Text>
            </View>
          )}

          <View
            style={[
              styles.messageContainer,
              isOwnMessage ? styles.ownMessageContainer : styles.otherMessageContainer,
            ]}
          >
            <Pressable onLongPress={() => console.log('Long pressed message:', item.id)}>
              <View
                style={[
                  styles.messageBubble,
                  isOwnMessage ? styles.ownMessage : styles.otherMessage,
                ]}
              >
                {item.type === 'image' ? (
                  <TouchableOpacity onPress={() => openImageModal(item.text)}>
                    <Image source={{ uri: item.text }} style={styles.imageMessage} />
                  </TouchableOpacity>
                ) : item.type === 'audio' ? (
                  <TouchableOpacity
                    onPress={() => toggleVoicePlayback(item.text, messageId)}
                    style={styles.voiceMessage}
                  >
                    <View
                      style={[
                        styles.playButton,
                        isOwnMessage ? styles.playButtonOwn : styles.playButtonOther,
                      ]}
                    >
                      <Ionicons
                        name={isPlaying ? 'pause' : 'play'}
                        size={20}
                        color={isOwnMessage ? COLORS.primary : 'white'}
                      />
                    </View>

                    <View style={styles.voiceInfo}>
                      <View style={styles.waveform}>
                        {[...Array(20)].map((_, i) => (
                          <View
                            key={i}
                            style={[
                              styles.waveBar,
                              {
                                height: Math.random() * 20 + 8,
                                backgroundColor: isOwnMessage ? '#25D366' : '#128C7E',
                                opacity:
                                  isPlaying && (currentPosition / (item.duration || 1)) * 20 > i
                                    ? 1
                                    : 0.4,
                              },
                            ]}
                          />
                        ))}
                      </View>

                      <Text
                        style={[styles.voiceTime, { color: isOwnMessage ? '#25D366' : '#666' }]}
                      >
                        {isPlaying
                          ? formatDuration(currentPosition)
                          : formatDuration(item.duration || 0)}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ) : item.type === 'document' ? (
                  <TouchableOpacity 
                    style={styles.documentMessage}
                    onPress={() => openDocumentInBrowser(item.text, item.fileName)}
                  >
                    <View style={styles.documentIconContainer}>
                      <Ionicons
                       name={getFileIcon(item.fileName, item.mimeType)}
                        size={32}
                        color={isOwnMessage ? COLORS.primary : '#666'}
                      />
                    </View>
                    <View style={styles.documentInfo}>
                      <Text style={[styles.documentName, { color: isOwnMessage ? '#333' : '#333' }]} numberOfLines={1}>
                        {item.fileName || 'Document'}
                      </Text>
                      <Text style={[styles.documentSize, { color: isOwnMessage ? '#666' : '#666' }]}>
                        {formatFileSize(item.fileSize)}
                      </Text>
                    </View>
                    <Ionicons
                      name="download"
                      size={20}
                      color={isOwnMessage ? COLORS.primary : '#666'}
                      style={styles.downloadIcon}
                    />
                  </TouchableOpacity>
                ) : (
                  <Text style={[styles.messageText, { color: isOwnMessage ? '#333' : '#333' }]}>
                    {item.text}
                  </Text>
                )}

                <View style={styles.messageFooter}>
                  <Text style={[styles.timeText, { color: isOwnMessage ? '#666' : '#666' }]}>
                    {formatTime(item.createdAt)}
                  </Text>
                  {isOwnMessage && (
                    <View style={styles.messageStatus}>
                      {getTickIcon(item.status)}
                    </View>
                  )}
                </View>
              </View>
            </Pressable>
          </View>
        </View>
      );
    },
    [currentUserId, playingMessageId, playbackPosition, messages, toggleVoicePlayback, openImageModal, openDocumentInBrowser, getFileIcon, formatFileSize, formatTime, getTickIcon]
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      {/* NEW: Network status indicator */}
      {!isOnline && (
        <View style={styles.offlineContainer}>
          <Text style={styles.offlineText}>No network connection</Text>
        </View>
      )}

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatRef}
          data={messages}
          keyExtractor={(item, index) => item.id?.toString() || index.toString()}
          renderItem={renderMessage}
          style={styles.messagesList}
          contentContainerStyle={[
            styles.messagesContent,
            { paddingBottom: Math.max(inputContainerHeight + keyboardHeight, 60) }
          ]}
          onContentSizeChange={() => scrollToBottom()}
        />

        <View 
          style={[
            styles.inputContainer,
            { bottom: keyboardHeight },
            isRecording && styles.recordingContainer
          ]}
          onLayout={onInputContainerLayout}
        >
          {/* NEW: Typing indicator */}
          {isTyping && (
            <View style={styles.typingIndicator}>
              <Text style={styles.typingText}>typing...</Text>
            </View>
          )}

          {isRecording ? (
            <View style={styles.recordingIndicator}>
              <View style={styles.recordingLeft}>
                <View style={styles.recordingDot} />
                <Text style={styles.recordingText}>Recording...</Text>
                <Text style={styles.recordingTime}>{formatDuration(recordingDuration)}</Text>
              </View>
              <TouchableOpacity onPress={stopRecording} style={styles.stopButton}>
                <Ionicons name="stop" size={24} color="white" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.inputRow}>
              <View style={styles.textInputContainer}>
                <TextInput
                  style={styles.textInput}
                  value={newMessage}
                  onChangeText={handleTextChange}
                  placeholder="Type a message..."
                  placeholderTextColor="#999"
                  multiline
                  maxLength={1000}
                />
                <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.attachButton}>
                  <Ionicons name="attach" size={24} color="#666" />
                </TouchableOpacity>
              </View>

              {newMessage.trim() ? (
                <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
                  <Ionicons name="send" size={20} color="white" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPressIn={startRecording}
                  onPressOut={stopRecording}
                  style={styles.voiceButton}
                >
                  <Ionicons name="mic" size={24} color="white" />
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </KeyboardAvoidingView>

      {/* Attachment Menu Modal */}
      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setMenuVisible(false)}>
          <View style={styles.menuContainer}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                sendImage('gallery');
              }}
            >
              <Ionicons name="images" size={24} color={COLORS.primary} />
              <Text style={styles.menuText}>Photo & Video Library</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                sendDocument();
              }}
            >
              <Ionicons name="document" size={24} color={COLORS.primary} />
              <Text style={styles.menuText}>Document</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                sendImage('camera');
              }}
            >
              <Ionicons name="camera" size={24} color={COLORS.primary} />
              <Text style={styles.menuText}>Camera</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      {/* Image View Modal */}
      <Modal
        visible={imageModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setImageModalVisible(false)}
      >
        <Pressable style={styles.imageModalOverlay} onPress={() => setImageModalVisible(false)}>
          <View style={styles.imageModalContainer}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setImageModalVisible(false)}
            >
              <Ionicons name="close" size={30} color="white" />
            </TouchableOpacity>
            {selectedImage && (
              <Image source={{ uri: selectedImage }} style={styles.fullScreenImage} />
            )}
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  // NEW: Offline indicator styles
  offlineContainer: {
    backgroundColor: '#ff4444',
    paddingVertical: 4,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  offlineText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  dateContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  dateText: {
    backgroundColor: '#E0E0E0',
    color: '#666',
    fontSize: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
  messageContainer: {
    marginVertical: 4,
    flexDirection: 'row',
  },
  ownMessageContainer: {
    justifyContent: 'flex-end',
  },
  otherMessageContainer: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: width * 0.75,
    borderRadius: 12,
    padding: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  ownMessage: {
    backgroundColor: COLORS.ownMessage,
    borderBottomRightRadius: 4,
  },
  otherMessage: {
    backgroundColor: COLORS.otherMessage,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
    gap: 4,
  },
  timeText: {
    fontSize: 11,
  },
  messageStatus: {
    marginLeft: 4,
  },
  // NEW: Tick styles for message status
  doubleTickContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  firstTick: {
    position: 'absolute',
    left: -3,
  },
  secondTick: {
    position: 'absolute',
    left: 3,
  },
  // NEW: Typing indicator styles
  typingIndicator: {
    backgroundColor: 'rgba(52, 227, 176, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
    marginLeft: 16,
  },
  typingText: {
    color: COLORS.primary,
    fontSize: 12,
    fontStyle: 'italic',
  },
  imageMessage: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginBottom: 4,
  },
  voiceMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    minWidth: 180,
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  playButtonOwn: {
    backgroundColor: 'rgba(37, 211, 102, 0.2)',
  },
  playButtonOther: {
    backgroundColor: COLORS.primary,
  },
  voiceInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  waveform: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 30,
    marginBottom: 4,
  },
  waveBar: {
    width: 3,
    marginHorizontal: 1,
    borderRadius: 1.5,
  },
  voiceTime: {
    fontSize: 12,
    fontWeight: '500',
  },
  documentMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 227, 176, 0.1)',
    borderRadius: 8,
    padding: 12,
    minWidth: 200,
  },
  documentIconContainer: {
    marginRight: 12,
  },
  documentInfo: {
    flex: 1,
  },
  documentName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  documentSize: {
    fontSize: 12,
  },
  downloadIcon: {
    marginLeft: 8,
  },
  inputContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  recordingContainer: {
    backgroundColor: COLORS.recording,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  textInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    maxHeight: 80,
    paddingVertical: 4,
  },
  attachButton: {
    marginLeft: 8,
    padding: 4,
  },
  sendButton: {
    backgroundColor: COLORS.primary,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  voiceButton: {
    backgroundColor: COLORS.primary,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  recordingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  recordingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ff4444',
    marginRight: 8,
  },
  recordingText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    marginRight: 12,
  },
  recordingTime: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  stopButton: {
    backgroundColor: '#ff4444',
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  menuContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  menuText: {
    fontSize: 16,
    marginLeft: 16,
    color: '#333',
  },
  imageModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
    padding: 8,
  },
  fullScreenImage: {
    width: width,
    height: height * 0.7,
    resizeMode: 'contain',
  },
});