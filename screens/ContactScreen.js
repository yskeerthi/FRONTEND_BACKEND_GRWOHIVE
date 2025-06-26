import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  ScrollView,
  StyleSheet,
  Animated,
  Pressable,
  Modal,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import LottieView from "lottie-react-native";
import { Svg, Path } from "react-native-svg";
import { useFocusEffect } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import axios from "axios";

const SERVICE_NOW_INSTANCE_URL = "https://dev210958.service-now.com/";
const SERVICE_NOW_USERNAME = "saibhanu";
const SERVICE_NOW_PASSWORD = "22A91A05k0@2003"; // or use an API token

const AUTH = {
  username: SERVICE_NOW_USERNAME,
  password: SERVICE_NOW_PASSWORD,
};

const ContactScreen = ({ navigation }) => {
  const [userDetails, setUserDetails] = useState(null);
  const [hasPostedToServiceNow, setHasPostedToServiceNow] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [department, setDepartment] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [recentReports, setRecentReports] = useState([
    {
      id: "1",
      department: "IT Support",
      subject: "Simple",

      description: "Computer not working properly",
      status: "In Progress",
      date: "2024-01-15",
      caseNumber: "CS001",
    },
    {
      id: "2",
      department: "HR",
      subject: "Simple",
      description: "Leave request issue",
      status: "Resolved",
      date: "2024-01-10",
      caseNumber: "CS002",
    },
    {
      id: "3",
      department: "Finance",
      subject: "Simple",
      description: "Expense reimbursement query",
      status: "Pending",
      date: "2024-01-08",
      caseNumber: "CS003",
    },
  ]);

  const departments = [
    "IT Support",
    "HR",
    "Finance",
    "Operations",
    "Marketing",
    "Legal",
    "Facilities",
    "Other",
  ];


  useFocusEffect(
  React.useCallback(() => {
    const postToServiceNowViaBackend = async () => {
      try {
        const storedUserId = await SecureStore.getItemAsync("userId");
        if (!storedUserId) {
          Alert.alert("Error", "No user ID found. Please log in again.");
          return;
        }

        // 1. Fetch user info from your own backend (optional for display)
        const res = await axios.get(`http://192.168.137.1:5000/api/auth/user/${storedUserId}`);
        setUserDetails(res.data);

        // 2. Call your new backend endpoint to post to ServiceNow
        const snRes = await axios.post(
          `http://192.168.137.1:5000/api/auth/post-user/${storedUserId}`
        );

        if (snRes.data?.message) {
          console.log(snRes.data.message); // "Already posted" or "User posted successfully"
        }
      } catch (error) {
        console.error("Error posting to ServiceNow:", error.response?.data || error.message);
        Alert.alert("Error", "Failed to sync with ServiceNow.");
      }
    };

    postToServiceNowViaBackend();
  }, [])
);






  const iconAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const handleCreateCase = () => {
    if (!department || !description) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    // Create new case
    const newCase = {
      id: Date.now().toString(),
      department,
      description,
      status: "Pending",
      date: new Date().toISOString().split("T")[0],
      caseNumber: `CS${String(recentReports.length + 1).padStart(3, "0")}`,
    };

    // Add to recent reports
    setRecentReports((prev) => [newCase, ...prev]);

    // Animate success
    Animated.timing(iconAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      Alert.alert(
        "Success!",
        `Case ${newCase.caseNumber} created successfully`
      );
      setModalVisible(false);
      setDepartment("");
      setDescription("");
      setSubject("");
      setDropdownVisible(false);
      iconAnim.setValue(0);
    });
  };

  const handleReportManagement = () => {
    navigation.navigate("MainStack", {
      screen: "ReportScreen",
    });
  };

  const handleDepartmentSelect = (selectedDept) => {
    setDepartment(selectedDept);
    setDropdownVisible(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Resolved":
        return "#10B981";
      case "In Progress":
        return "#F59E0B";
      case "Pending":
        return "#EF4444";
      default:
        return "#6B7280";
    }
  };

  const renderReportItem = ({ item }) => (
    <View style={styles.reportCard}>
      <View style={styles.reportHeader}>
        <Text style={styles.caseNumber}>{item.caseNumber}</Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.status) },
          ]}
        >
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      <Text style={styles.reportDepartment}>{item.department}</Text>
      <Text style={styles.reportDescription} numberOfLines={2}>
        {item.description}
      </Text>
      <Text style={styles.reportDate}>Created: {item.date}</Text>
    </View>
  );

  const renderDropdownItem = ({ item }) => (
    <TouchableOpacity
      style={styles.dropdownItem}
      onPress={() => handleDepartmentSelect(item)}
    >
      <Text style={styles.dropdownItemText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <LottieView
        source={require("../assets/Animation - 1749013885897.json")}
        autoPlay
        loop
        style={styles.lottie}
      />

      <Text style={styles.header}>Features</Text>

      {/* Create Case Button */}
      <TouchableOpacity
        style={styles.createCaseButton}
        onPress={() => setModalVisible(true)}
      >
        <View style={styles.buttonContent}>
          <MaterialIcons name="add-circle" size={24} color="#fff" />
          <Text style={styles.buttonText}>Create Case</Text>
        </View>
      </TouchableOpacity>

      {/* Report Management Button */}
      <TouchableOpacity
        style={styles.reportManagementButton}
        onPress={handleReportManagement}
      >
        <View style={styles.buttonContent}>
          <MaterialIcons name="assessment" size={24} color="#fff" />
          <Text style={styles.buttonText}>Report Management</Text>
        </View>
      </TouchableOpacity>

      {/* Recent Reports Section */}
      <View style={styles.recentReportsSection}>
        <Text style={styles.sectionTitle}>Recent Reports</Text>
        {recentReports.length > 0 ? (
          <FlatList
            data={recentReports}
            renderItem={renderReportItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyState}>
            <MaterialIcons name="inbox" size={48} color="#9CA3AF" />
            <Text style={styles.emptyText}>No reports yet</Text>
          </View>
        )}
      </View>

      {/* Create Case Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          setDropdownVisible(false);
        }}
      >
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyboardView}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Create New Case</Text>
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(false);
                    setDropdownVisible(false);
                  }}
                  style={styles.closeButton}
                >
                  <MaterialIcons name="close" size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>

              <ScrollView
                style={styles.modalBody}
                contentContainerStyle={{ paddingBottom: 30 }}
                keyboardShouldPersistTaps="handled"
              >
                <Text style={styles.inputLabel}>Department</Text>

                {/* Dropdown Container */}
                <View style={styles.dropdownContainer}>
                  <TouchableOpacity
                    style={styles.dropdownButton}
                    onPress={() => setDropdownVisible(!dropdownVisible)}
                  >
                    <Text
                      style={[
                        styles.dropdownButtonText,
                        !department && styles.placeholderText,
                      ]}
                    >
                      {department || "Select Department"}
                    </Text>
                    <MaterialIcons
                      name={
                        dropdownVisible
                          ? "keyboard-arrow-up"
                          : "keyboard-arrow-down"
                      }
                      size={24}
                      color="#6B7280"
                    />
                  </TouchableOpacity>

                  {dropdownVisible && (
                    <View style={styles.dropdownList}>
                      <FlatList
                        data={departments}
                        renderItem={renderDropdownItem}
                        keyExtractor={(item) => item}
                        scrollEnabled={false}
                        ItemSeparatorComponent={() => (
                          <View style={styles.dropdownSeparator} />
                        )}
                      />
                    </View>
                  )}
                </View>

                <Text style={styles.inputLabel}>Subject</Text>

                <TextInput
                  style={styles.subject}
                  placeholder="Enter Subject"
                  value={subject}
                  onChangeText={setSubject}
                  multiline={false}
                  numberOfLines={1}
                  textAlignVertical="top"
                />

                <Text style={styles.inputLabel}>Description</Text>
                <TextInput
                  style={styles.descriptionInput}
                  placeholder="Describe your issue or request..."
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />

                <Pressable style={styles.sendButton} onPress={handleCreateCase}>
                  <Animated.View
                    style={[
                      styles.iconWrapper,
                      { transform: [{ scale: iconAnim }] },
                    ]}
                  >
                    <MaterialIcons name="send" size={20} color="#fff" />
                  </Animated.View>
                  <Text style={styles.sendText}>Send</Text>
                </Pressable>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#F7F9FA",
  },
  lottie: {
    width: 200,
    height: 200,
    alignSelf: "center",
    marginTop: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "left",
    color: "#1F2937",
    marginLeft: "35",
  },
  createCaseButton: {
    backgroundColor: "#10B981",
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  reportManagementButton: {
    backgroundColor: "#3B82F6",
    marginHorizontal: 20,
    marginBottom: 30,
    borderRadius: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  recentReportsSection: {
    marginHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 16,
  },
  reportCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  reportHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  caseNumber: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F2937",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  reportDepartment: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 4,
  },
  reportDescription: {
    fontSize: 16,
    color: "#374151",
    marginBottom: 8,
    lineHeight: 20,
  },
  reportDate: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#9CA3AF",
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginHorizontal: 20,
    maxHeight: "80%",
    width: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    padding: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  // Dropdown Styles
  dropdownContainer: {
    marginBottom: 8,
    position: "relative",
    zIndex: 1000,
  },
  dropdownButton: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: 48,
  },
  dropdownButtonText: {
    fontSize: 16,
    color: "#374151",
  },
  placeholderText: {
    color: "#9CA3AF",
  },
  dropdownList: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    marginTop: 4,
    maxHeight: 200,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  dropdownItem: {
    padding: 12,
    backgroundColor: "#fff",
  },
  dropdownItemText: {
    fontSize: 16,
    color: "#374151",
  },
  dropdownSeparator: {
    height: 1,
    backgroundColor: "#F3F4F6",
  },
  descriptionInput: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    height: 100,
    marginBottom: 8,
  },

  subject: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 8,
    fontSize: 16,
    height: 50,
    marginBottom: 8,
  },
  sendButton: {
    flexDirection: "row",
    backgroundColor: "#10B981",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  iconWrapper: {
    marginRight: 8,
  },
  sendText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ContactScreen;
