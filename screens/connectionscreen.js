import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  View, Text, TouchableOpacity, FlatList, Image, Modal, Animated, TextInput, Dimensions, StyleSheet, Alert
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { TabView, SceneMap } from 'react-native-tab-view';
import { useFocusEffect } from '@react-navigation/native';
import GrowHiveHeader from './GrowHiveHeader.js';
import styles from './ConnectionStyles.js';
import { COLORS } from './constants';
import * as SecureStore from "expo-secure-store";
import { IP } from "../Config/config";

const SCREEN_WIDTH = Dimensions.get('window').width;
const BASE_URL = `${IP}/api/connection`;

const SORT_OPTIONS = [
  { key: 'default', label: 'Default' },
  { key: 'latest', label: 'Sort by Latest' },
  { key: 'earliest', label: 'Sort by Earliest' },
];

// Cache for user ID to avoid repeated SecureStore calls
let cachedUserId = null;

// --- ANIMATED CARD ---
const AnimatedCard = React.memo(({ children, index }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200 + index * 30, // Reduced animation time
      useNativeDriver: true,
    }).start();
  }, [fadeAnim, index]);

  return (
    <Animated.View style={{ 
      opacity: fadeAnim, 
      transform: [{ scale: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [0.98, 1] }) }] 
    }}>
      {children}
    </Animated.View>
  );
});

// --- LOADING INDICATOR ---
function LoadingSpinner() {
  const spinValue = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const spin = () => {
      spinValue.setValue(0);
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000, // Faster spin
        useNativeDriver: true,
      }).start(() => spin());
    };
    spin();
  }, []);

  const rotate = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 60 }}>
      <Animated.View style={{ transform: [{ rotate }] }}>
        <Feather name="loader" size={32} color={COLORS.secondary} />
      </Animated.View>
      <Text style={{ marginTop: 16, color: COLORS.secondary, fontSize: 16 }}>Loading...</Text>
    </View>
  );
}

// --- SEARCH BAR ---
const StylishSearchBar = React.memo(({ value, onChange, onClear }) => {
  return (
    <View style={styles.searchBar}>
      <Feather name="search" size={20} color={COLORS.secondary} />
      <TextInput
        style={styles.searchInput}
        placeholder="Search connections"
        placeholderTextColor="#94a3b8"
        value={value}
        onChangeText={onChange}
        returnKeyType="search"
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={onClear}>
          <Feather name="x-circle" size={20} color={COLORS.secondary} style={{ marginRight: 2 }} />
        </TouchableOpacity>
      )}
    </View>
  );
});

// --- OPTIMIZED CARDS WITH STABLE KEYS ---
const ConnectionCard = React.memo(({ person, onMessage, onDots, index }) => {
  const imageUrl = useMemo(() => 
    person.image || `https://i.pravatar.cc/64?img=${(person._id?.slice(-2) || '10')}`,
    [person.image, person._id]
  );

  const handleMessage = useCallback(() => onMessage(person), [onMessage, person._id]);
  const handleDots = useCallback(() => onDots(person), [onDots, person._id]);

  return (
    <View style={styles.card}>
      <Image source={{ uri: imageUrl }} style={styles.avatar} />
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text style={styles.cardName}>{person.name}</Text>
        <Text style={styles.cardEdu}>{person.education}</Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 0 }}>
        <TouchableOpacity style={styles.messageBtn} onPress={handleMessage}>
          <Text style={styles.messageBtnText}>Message</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.dotsBtn} onPress={handleDots}>
          <Feather name="more-vertical" size={22} color="#888" />
        </TouchableOpacity>
      </View>
    </View>
  );
}, (prevProps, nextProps) => {
  // Custom comparison to prevent unnecessary re-renders
  return prevProps.person._id === nextProps.person._id &&
         prevProps.person.name === nextProps.person.name &&
         prevProps.person.education === nextProps.person.education &&
         prevProps.index === nextProps.index;
});

const SentCard = React.memo(({ person, onWithdraw, index, isLoading }) => {
  const imageUrl = useMemo(() => 
    person.toUserId?.image || `https://i.pravatar.cc/64?img=${(person.toUserId?._id?.slice(-2) || '10')}`,
    [person.toUserId?.image, person.toUserId?._id]
  );

  const handleWithdraw = useCallback(() => onWithdraw(person), [onWithdraw, person._id]);

  return (
    <View style={styles.card}>
      <Image source={{ uri: imageUrl }} style={styles.avatar} />
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text style={styles.cardName}>{person.toUserId?.name}</Text>
        <Text style={styles.cardEdu}>{person.toUserId?.education}</Text>
      </View>
      <View style={{ justifyContent: 'center', alignItems: 'flex-end', flex: 0 }}>
        <TouchableOpacity
          style={[styles.messageBtn, isLoading && { opacity: 0.6 }]}
          onPress={handleWithdraw}
          disabled={isLoading}
        >
          <Text style={[styles.messageBtnText, { color: COLORS.secondary }]}>
            {isLoading ? 'Withdrawing...' : 'Sent'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}, (prevProps, nextProps) => {
  return prevProps.person._id === nextProps.person._id &&
         prevProps.person.toUserId?.name === nextProps.person.toUserId?.name &&
         prevProps.isLoading === nextProps.isLoading &&
         prevProps.index === nextProps.index;
});

const ReceivedCard = React.memo(({ person, onAccept, onReject, index, isLoading }) => {
  const imageUrl = useMemo(() => 
    person.fromUserId?.image || `https://i.pravatar.cc/64?img=${(person.fromUserId?._id?.slice(-2) || '10')}`,
    [person.fromUserId?.image, person.fromUserId?._id]
  );

  const handleAccept = useCallback(() => onAccept(person), [onAccept, person._id]);

  return (
    <View style={styles.card}>
      <Image source={{ uri: imageUrl }} style={styles.avatar} />
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text style={styles.cardName}>{person.fromUserId?.name}</Text>
        <Text style={styles.cardEdu}>{person.fromUserId?.education}</Text>
      </View>
      <View style={{ justifyContent: 'center', alignItems: 'flex-end', flex: 0 }}>
        <TouchableOpacity
          style={[styles.messageBtn, isLoading && { opacity: 0.6 }]}
          onPress={handleAccept}
          disabled={isLoading}
        >
          <Text style={[styles.messageBtnText, { color: COLORS.secondary }]}>Accept</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}, (prevProps, nextProps) => {
  return prevProps.person._id === nextProps.person._id &&
         prevProps.person.fromUserId?.name === nextProps.person.fromUserId?.name &&
         prevProps.isLoading === nextProps.isLoading &&
         prevProps.index === nextProps.index;
});

// --- MAIN SCREEN ---
export default function ConnectionsScreen({ navigation }) {
  const [index, setIndex] = useState(2);
  const [routes] = useState([
    { key: 'sent', title: 'Sent' },
    { key: 'received', title: 'Received' },
    { key: 'connections', title: 'Connections' },
  ]);

  const [currentUserId, setCurrentUserId] = useState(cachedUserId);
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [connections, setConnections] = useState([]);

  const [loadingSent, setLoadingSent] = useState(true);
  const [loadingReceived, setLoadingReceived] = useState(true);
  const [loadingConnections, setLoadingConnections] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const [withdrawModal, setWithdrawModal] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [search, setSearch] = useState('');
  const [sortDropdown, setSortDropdown] = useState(false);
  const [sortBy, setSortBy] = useState('default');
  const [showSortBar, setShowSortBar] = useState(false);
  const [dotsMenu, setDotsMenu] = useState({ visible: false, person: null });
  const [sortBarAnim] = useState(new Animated.Value(0));
  const indicatorAnim = useRef(new Animated.Value(2)).current;

  // Refs for managing intervals
  const intervalRef = useRef(null);
  const isScreenFocused = useRef(false);

  // Optimized user ID initialization
  const initializeUserId = useCallback(async () => {
    if (cachedUserId) {
      setCurrentUserId(cachedUserId);
      return cachedUserId;
    }

    try {
      const id = await SecureStore.getItemAsync("userId");
      cachedUserId = id;
      setCurrentUserId(id);
      return id;
    } catch (error) {
      console.error('Error getting user ID:', error);
      Alert.alert('Error', 'Failed to get user ID');
      return null;
    }
  }, []);

  // Optimized API functions with data comparison
  const createFetchFunction = useCallback((endpoint, setter, loadingSetter, cacheKey) => {
    return async (showLoading = false) => {
      const userId = currentUserId || await initializeUserId();
      if (!userId) return;

      try {
        if (showLoading) {
          loadingSetter(true);
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

        const response = await fetch(`${BASE_URL}/${endpoint}/${userId}`, {
          signal: controller.signal,
          headers: {
            'Cache-Control': 'no-cache', // Disable cache for real-time updates
          }
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const newData = await response.json();
        
        // Only update state if data actually changed
        setter(prevData => {
          const dataToCompare = newData || [];
          const prevDataToCompare = prevData || [];
          
          // Compare array lengths first (quick check)
          if (dataToCompare.length !== prevDataToCompare.length) {
            return dataToCompare;
          }
          
          // Deep compare by stringifying (for small arrays this is efficient)
          const newDataString = JSON.stringify(dataToCompare.map(item => ({
            _id: item._id,
            status: item.status,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt
          })));
          
          const prevDataString = JSON.stringify(prevDataToCompare.map(item => ({
            _id: item._id,
            status: item.status,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt
          })));
          
          // Only update if data actually changed
          return newDataString !== prevDataString ? dataToCompare : prevData;
        });
      } catch (error) {
        if (error.name === 'AbortError') {
          console.log('Fetch aborted due to timeout');
        } else {
          console.error(`Error fetching ${cacheKey}:`, error);
          // Only show alert on initial load or manual refresh
          if (showLoading) {
            Alert.alert('Error', `Failed to load ${cacheKey}`);
          }
        }
      } finally {
        if (showLoading) {
          loadingSetter(false);
        }
      }
    };
  }, [currentUserId, initializeUserId]);

  const fetchSentRequests = useMemo(() => 
    createFetchFunction('sent', setSentRequests, setLoadingSent, 'sent'),
    [createFetchFunction]
  );

  const fetchReceivedRequests = useMemo(() => 
    createFetchFunction('received', setReceivedRequests, setLoadingReceived, 'received'),
    [createFetchFunction]
  );

  const fetchConnections = useMemo(() => 
    createFetchFunction('connections', setConnections, setLoadingConnections, 'connections'),
    [createFetchFunction]
  );

  // Function to fetch all data
  const fetchAllData = useCallback((showLoading = false) => {
    if (currentUserId) {
      fetchSentRequests(showLoading);
      fetchReceivedRequests(showLoading);
      fetchConnections(showLoading);
    }
  }, [currentUserId, fetchSentRequests, fetchReceivedRequests, fetchConnections]);

  // Start interval for fetching data every second
  const startDataFetching = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    // Fetch immediately with loading indicators
    fetchAllData(true);
    
    // Then set up interval for background updates (without loading indicators)
    intervalRef.current = setInterval(() => {
      if (isScreenFocused.current && currentUserId) {
        fetchAllData(false); // Background updates without loading indicators
      }
    }, 1000); // Fetch every 1 second
  }, [fetchAllData, currentUserId]);

  // Stop interval
  const stopDataFetching = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Initialize user ID and start fetching
  useEffect(() => {
    let mounted = true;

    const initAndFetch = async () => {
      const userId = await initializeUserId();
      if (userId && mounted) {
        startDataFetching();
      }
    };

    initAndFetch();
    
    return () => { 
      mounted = false;
      stopDataFetching();
    };
  }, [initializeUserId, startDataFetching, stopDataFetching]);

  // Use focus effect to start/stop fetching when screen is focused/unfocused
  useFocusEffect(
    useCallback(() => {
      isScreenFocused.current = true;
      
      if (currentUserId) {
        startDataFetching();
      }

      return () => {
        isScreenFocused.current = false;
        stopDataFetching();
      };
    }, [currentUserId, startDataFetching, stopDataFetching])
  );

  // Restart fetching when userId changes
  useEffect(() => {
    if (currentUserId && isScreenFocused.current) {
      startDataFetching();
    }
  }, [currentUserId, startDataFetching]);

  // Optimized withdraw with immediate UI update and prevention of background updates
  const withdrawRequest = useCallback(async (requestId) => {
    try {
      setActionLoading(requestId);

      // Temporarily stop background fetching to prevent conflicts
      stopDataFetching();

      // Optimistic update - remove immediately from UI
      setSentRequests(prev => prev.filter(req => req._id !== requestId));

      const response = await fetch(`${BASE_URL}/withdraw/${requestId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const result = await response.json();
        Alert.alert('Success', result.message || 'Request withdrawn successfully');
        
        // Wait a bit then restart background fetching
        setTimeout(() => {
          if (isScreenFocused.current) {
            startDataFetching();
          }
        }, 2000);
      } else {
        // Revert optimistic update on failure
        await fetchSentRequests(true);
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to withdraw request');
        
        // Restart background fetching
        if (isScreenFocused.current) {
          startDataFetching();
        }
      }
    } catch (error) {
      console.error('Error withdrawing request:', error);
      Alert.alert('Error', error.message || 'Failed to withdraw request');
      
      // Restart background fetching on error
      if (isScreenFocused.current) {
        startDataFetching();
      }
    } finally {
      setActionLoading(null);
    }
  }, [fetchSentRequests, stopDataFetching, startDataFetching]);

  const acceptRequest = useCallback(async (requestId) => {
    try {
      setActionLoading(requestId);
      
      // Temporarily stop background fetching to prevent conflicts
      stopDataFetching();
      
      // Optimistic update
      setReceivedRequests(prev => prev.filter(req => req._id !== requestId));

      const response = await fetch(`${BASE_URL}/accept/${requestId}`, {
        method: 'PUT',
      });

      if (response.ok) {
        fetchConnections(true); // Force refresh connections
        Alert.alert('Success', 'Request accepted successfully');
        
        // Wait a bit then restart background fetching
        setTimeout(() => {
          if (isScreenFocused.current) {
            startDataFetching();
          }
        }, 2000);
      } else {
        await fetchReceivedRequests(true); // Revert on failure
        throw new Error('Failed to accept request');
        
        // Restart background fetching
        if (isScreenFocused.current) {
          startDataFetching();
        }
      }
    } catch (error) {
      console.error('Error accepting request:', error);
      Alert.alert('Error', 'Failed to accept request');
      
      // Restart background fetching on error
      if (isScreenFocused.current) {
        startDataFetching();
      }
    } finally {
      setActionLoading(null);
    }
  }, [fetchConnections, fetchReceivedRequests, stopDataFetching, startDataFetching]);

  // Memoized filter function
  const getFilteredConnections = useMemo(() => {
    let filtered = connections.filter(item => {
      const displayUser = item.fromUserId?._id === currentUserId ? item.toUserId : item.fromUserId;
      const userName = displayUser?.name || '';
      const userEducation = displayUser?.education || '';
      return userName.toLowerCase().includes(search.toLowerCase()) ||
             userEducation.toLowerCase().includes(search.toLowerCase());
    });

    if (sortBy === 'latest') {
      filtered = [...filtered].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'earliest') {
      filtered = [...filtered].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    return filtered;
  }, [connections, currentUserId, search, sortBy]);

  // Optimized handlers
  const handleMessage = useCallback((person) => {
    navigation?.navigate('ChatScreen', { user: person });
  }, [navigation]);

  const handleWithdraw = useCallback((person) => {
    setSelectedPerson(person);
    setWithdrawModal(true);
  }, []);

  const confirmWithdraw = useCallback(async () => {
    if (selectedPerson?._id) {
      await withdrawRequest(selectedPerson._id);
      setWithdrawModal(false);
      setSelectedPerson(null);
    }
  }, [selectedPerson, withdrawRequest]);

  // Tab scenes with optimized FlatLists
  const renderScene = useMemo(() => SceneMap({
    sent: () => (
      <View style={{ flex: 1 }}>
        {loadingSent ? (
          <LoadingSpinner />
        ) : (
          <FlatList
            data={sentRequests}
            keyExtractor={(item) => `sent-${item._id}`}
            renderItem={({ item, index }) => (
              <SentCard
                person={item}
                onWithdraw={handleWithdraw}
                index={index}
                isLoading={actionLoading === item._id}
              />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20, paddingTop: 8 }}
            ListEmptyComponent={
              <Text style={{ textAlign: 'center', marginTop: 40, color: COLORS.muted }}>
                No sent requests.
              </Text>
            }
            removeClippedSubviews={true}
            maxToRenderPerBatch={10}
            windowSize={10}
            initialNumToRender={8}
            getItemLayout={(data, index) => (
              { length: 80, offset: 80 * index, index }
            )}
          />
        )}
      </View>
    ),
    received: () => (
      <View style={{ flex: 1 }}>
        {loadingReceived ? (
          <LoadingSpinner />
        ) : (
          <FlatList
            data={receivedRequests}
            keyExtractor={(item) => `received-${item._id}`}
            renderItem={({ item, index }) => (
              <ReceivedCard
                person={item}
                onAccept={(person) => acceptRequest(person._id)}
                onReject={() => {}} // Implement if needed
                index={index}
                isLoading={actionLoading === item._id}
              />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20, paddingTop: 8 }}
            ListEmptyComponent={
              <Text style={{ textAlign: 'center', marginTop: 40, color: COLORS.muted }}>
                No received requests.
              </Text>
            }
            removeClippedSubviews={true}
            maxToRenderPerBatch={10}
            windowSize={10}
            initialNumToRender={8}
            getItemLayout={(data, index) => (
              { length: 80, offset: 80 * index, index }
            )}
          />
        )}
      </View>
    ),
    connections: () => (
      <View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, marginBottom: -4 }}>
          <View style={{ flex: 1 }}>
            <StylishSearchBar
              value={search}
              onChange={setSearch}
              onClear={() => setSearch('')}
            />
          </View>
          <TouchableOpacity
            style={{
              marginRight: 18,
              marginLeft: 2,
              backgroundColor: '#e0e7ef',
              borderRadius: 12,
              padding: 8,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => setSortDropdown(!sortDropdown)}
          >
            <MaterialCommunityIcons name="swap-vertical" size={22} color={COLORS.secondary} />
          </TouchableOpacity>
        </View>
        {loadingConnections ? (
          <LoadingSpinner />
        ) : (
          <FlatList
            data={getFilteredConnections}
            keyExtractor={(item) => `connection-${item._id}`}
            renderItem={({ item, index }) => {
              const displayUser = item.fromUserId?._id === currentUserId ? item.toUserId : item.fromUserId;
              return (
                <ConnectionCard
                  person={displayUser}
                  onMessage={handleMessage}
                  onDots={() => {}} // Implement if needed
                  index={index}
                />
              );
            }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20, paddingTop: 8 }}
            ListEmptyComponent={
              <Text style={{ textAlign: 'center', marginTop: 40, color: COLORS.muted }}>
                No connections yet.
              </Text>
            }
            removeClippedSubviews={true}
            maxToRenderPerBatch={10}
            windowSize={10}
            initialNumToRender={8}
            getItemLayout={(data, index) => (
              { length: 80, offset: 80 * index, index }
            )}
          />
        )}
      </View>
    ),
  }), [
    loadingSent, loadingReceived, loadingConnections,
    sentRequests, receivedRequests, getFilteredConnections,
    actionLoading, handleWithdraw, acceptRequest, handleMessage,
    search, currentUserId
  ]);

  if (!currentUserId) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.background }}>
        <GrowHiveHeader />
        <LoadingSpinner />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <GrowHiveHeader />
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: SCREEN_WIDTH }}
        swipeEnabled
        lazy={true}
        renderLazyPlaceholder={() => <LoadingSpinner />}
      />

      {/* Withdraw Modal */}
      <Modal
        transparent
        visible={withdrawModal}
        animationType="fade"
        onRequestClose={() => setWithdrawModal(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.25)',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <View style={{
            backgroundColor: '#fff',
            borderRadius: 16,
            padding: 28,
            width: '80%',
            alignItems: 'center',
          }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.secondary, marginBottom: 12 }}>
              Withdraw Connection
            </Text>
            <Text style={{ color: COLORS.secondary, fontSize: 15, textAlign: 'center' }}>
              Are you sure you want to withdraw connection request to {selectedPerson?.toUserId?.name}?
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 28, width: '100%' }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: '#e0e7ef',
                  borderRadius: 8,
                  paddingVertical: 10,
                  marginRight: 8,
                  alignItems: 'center'
                }}
                onPress={() => setWithdrawModal(false)}
              >
                <Text style={{ color: COLORS.secondary, fontWeight: 'bold' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: '#fff',
                  borderRadius: 8,
                  paddingVertical: 10,
                  marginLeft: 8,
                  alignItems: 'center',
                  borderWidth: 1.7,
                  borderColor: COLORS.secondary,
                }}
                onPress={confirmWithdraw}
              >
                <Text style={{ color: COLORS.secondary, fontWeight: 'bold' }}>Withdraw</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}