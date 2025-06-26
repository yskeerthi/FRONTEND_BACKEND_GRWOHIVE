import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
  Modal,
} from "react-native";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import { PieChart } from "react-native-svg-charts";

export const ReportScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedSliceIndex, setSelectedSliceIndex] = useState(null);

  // Modal states
  const [isRejectModalVisible, setIsRejectModalVisible] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [onholdReason, setOnholdReason] = useState("");

  // Sample data - in real app, this would come from your API/database
  const [reports, setReports] = useState([
    {
      id: "1",
      caseNumber: "CS001",
      department: "IT Support",
      subject:
        "Computer not working properly. Screen keeps freezing and applications crash frequently.",
      status: "onhold",
      priority: "High",
      date: "2024-01-15",
      assignedTo: "John Doe",
      lastUpdated: "2024-01-16",
      solution: "",
      createdOn: "2024-01-15",
      completedOn: null,
      isAccepted: null, // null = not reviewed, true = accepted, false = rejected
      onholdReason: "",
    },
    {
      id: "2",
      caseNumber: "CS002",
      department: "HR",
      subject:
        "Leave request issue - unable to submit annual leave application through portal.",
      status: "completed",
      priority: "Medium",
      date: "2024-01-10",
      assignedTo: "Jane Smith",
      lastUpdated: "2024-01-12",
      solution: "Portal access issue completed by updating user permissions",
      createdOn: "2024-01-10",
      completedOn: "2024-01-12",
      isAccepted: null,
      onholdReason: "",
    },
    {
      id: "3",
      caseNumber: "CS003",
      department: "Finance",
      subject:
        "Expense reimbursement query regarding travel expenses from last month.",
      status: "progress",
      priority: "Low",
      date: "2024-01-08",
      assignedTo: "Mike Johnson",
      lastUpdated: "2024-01-08",
      solution: "",
      createdOn: "2024-01-08",
      completedOn: null,
      isAccepted: null,
      onholdReason: "",
    },
    {
      id: "4",
      caseNumber: "CS004",
      department: "Operations",
      subject:
        "Equipment maintenance request for office printer and scanner.",
      status: "new",
      priority: "Medium",
      date: "2024-01-05",
      assignedTo: "",
      lastUpdated: "2024-01-05",
      solution: "",
      createdOn: "2024-01-05",
      completedOn: null,
      isAccepted: null,
      onholdReason: "",
    },
    {
      id: "5",
      caseNumber: "CS005",
      department: "IT Support",
      subject:
        "Password reset issue - unable to access company email account.",
      status: "completed",
      priority: "High",
      date: "2024-01-03",
      assignedTo: "John Doe",
      lastUpdated: "2024-01-03",
      solution: "Password reset completed and account access restored",
      createdOn: "2024-01-03",
      completedOn: "2024-01-03",
      isAccepted: true,
      onholdReason: "",
    },
    {
      id: "6",
      caseNumber: "CS006",
      department: "Marketing",
      subject:
        "Social media account access issue - unable to login to company Instagram.",
      status: "completed",
      priority: "Low",
      date: "2024-01-20",
      assignedTo: "Sarah Wilson",
      lastUpdated: "2024-01-20",
      solution: "Reset password and updated security settings",
      createdOn: "2024-01-20",
      completedOn: "2024-01-20",
      isAccepted: false,
      onholdReason: "",
    },
  ]);

  const statusOptions = ["All", "new", "progress", "onhold", "completed"];
  const sortOptions = [
    { label: "Date (newest)", value: "date" },
    { label: "Priority", value: "priority" },
    { label: "Status", value: "status" },
    { label: "Department", value: "department" },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "new":
        return "#4DA8DA";
      case "progress":
        return "#EF4444";
      case "onhold":
        return "#F59E0B";
      case "completed":
        return "#10B981";
      default:
        return "#6B7280";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "#EF4444";
      case "Medium":
        return "#F59E0B";
      case "Low":
        return "#10B981";
      default:
        return "#6B7280";
    }
  };

  const handleAcceptReport = (id) => {
    Alert.alert(
      "Accept Resolution",
      "Are you satisfied with the resolution of this report?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Accept",
          style: "default",
          onPress: () => {
            setReports((prev) =>
              prev.map((report) =>
                report.id === id ? { ...report, isAccepted: true } : report
              )
            );
          },
        },
      ]
    );
  };

  const handleRejectReport = (id) => {
    setSelectedReportId(id);
    setIsRejectModalVisible(true);
  };

  const submitRejectReport = () => {
    if (!onholdReason.trim()) {
      Alert.alert(
        "Error",
        "Please provide a reason for putting this report on hold."
      );
      return;
    }

    setReports((prev) =>
      prev.map((report) =>
        report.id === selectedReportId
          ? {
              ...report,
              isAccepted: false,
              status: "onhold",
              onholdReason: onholdReason.trim(),
              lastUpdated: new Date().toISOString(),
            }
          : report
      )
    );

    // Reset modal state
    setIsRejectModalVisible(false);
    setSelectedReportId(null);
    setOnholdReason("");

    Alert.alert(
      "Success",
      "Report has been put on hold and will require further action."
    );
  };

  const closeRejectModal = () => {
    setIsRejectModalVisible(false);
    setSelectedReportId(null);
    setOnholdReason("");
  };

  const filteredAndSortedReports = reports.filter((report) => {
    const matchesSearch =
      !searchText ||
      report.caseNumber.toLowerCase().includes(searchText.toLowerCase()) ||
      report.department.toLowerCase().includes(searchText.toLowerCase()) ||
      report.subject.toLowerCase().includes(searchText.toLowerCase());

    const matchesStatus =
      filterStatus === "All" || report.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const statusCounts = reports.reduce((acc, report) => {
    acc[report.status] = (acc[report.status] || 0) + 1;
    return acc;
  }, {});

  const pieData = [
    {
      value: statusCounts["new"] || 0,
      svg: { fill: "#4DA8DA", onPress: () => setSelectedSliceIndex(0) },
      key: "new",
      label: "New",
    },
    {
      value: statusCounts["progress"] || 0,
      svg: { fill: "#EF4444", onPress: () => setSelectedSliceIndex(1) },
      key: "progress",
      label: "Progress",
    },
    {
      value: statusCounts["onhold"] || 0,
      svg: { fill: "#F59E0B", onPress: () => setSelectedSliceIndex(2) },
      key: "onhold",
      label: "OnHold",
    },
    {
      value: statusCounts["completed"] || 0,
      svg: { fill: "#10B981", onPress: () => setSelectedSliceIndex(3) },
      key: "completed",
      label: "Completed",
    },
  ].filter((item) => item.value > 0);

  // Status helpers for roadmap
  const getStatusIndex = (status) => {
    switch (status) {
      case "new":
        return 0;
      case "progress":
        return 1;
      case "onhold":
        return 2;
      case "completed":
        return 3;
      default:
        return 0;
    }
  };

  const getStageColor = (stage) => {
    switch (stage.toLowerCase()) {
      case "new":
        return "#4DA8DA";
      case "progress":
        return "#EF4444";
      case "onhold":
        return "#F59E0B";
      case "completed":
        return "#10B981";
      default:
        return "#6b7280";
    }
  };

  // Render roadmap for each report
  const renderRoadmap = (report) => {
    const stages = ["new", "progress", "onhold", "completed"];
    const currentIndex = getStatusIndex(report.status);

    return (


      
      <View>
        <View style={styles.roadmapContainer}>
          {stages.map((stage, index) => {
            const isActive = index <= currentIndex;
            const isCompleted = index < currentIndex;
            const isCurrent = index === currentIndex;
            const color = isActive ? getStageColor(stage) : "#D1D5DB";
            const isLast = index === stages.length - 1;

            return (
              <React.Fragment key={stage}>
                <View style={styles.roadmapStep}>
                  <View
                    style={[
                      styles.roadmapCircle,
                      {
                        backgroundColor: color,
                        borderWidth: isCurrent ? 3 : 1,
                        borderColor: isCurrent ? color : "transparent",
                        transform: [{ scale: isCurrent ? 1.2 : 1 }],
                      },
                    ]}
                  >
                    {isCompleted && (
                      <MaterialIcons name="check" size={12} color="white" />
                    )}
                  </View>
                  <Text
                    style={[
                      styles.roadmapLabel,
                      {
                        color: color,
                        fontWeight: isCurrent ? "bold" : "normal",
                      },
                    ]}
                  >
                    {stage}
                  </Text>
                </View>
                {!isLast && (
                  <View style={styles.roadmapLineContainer}>
                    <View
                      style={[
                        styles.roadmapLine,
                        {
                          borderColor:
                            isCompleted || (isCurrent && index < currentIndex)
                              ? getStageColor(stage)
                              : "#D1D5DB",
                        },
                      ]}
                    />
                  </View>
                )}
              </React.Fragment>
            );
          })}
        </View>

        {/* Progress Report */}
        <View
          style={[
            styles.progressReport,
            { borderColor: getStageColor(report.status) },
          ]}
        >
          <Text style={styles.progressTitle}>Progress Report</Text>

          {report.status === "new" && (
            <>
              <Text style={styles.progressText}>
                Status: new Issue Received
              </Text>
              <Text style={styles.progressText}>
                Created On: {new Date(report.createdOn).toLocaleDateString()}
              </Text>
              <Text style={styles.progressText}>
                Priority: {report.priority}
              </Text>
            </>
          )}

          {report.status === "progress" && (
            <>
              <Text style={styles.progressText}>
                Status: Awaiting Assignment
              </Text>
              <Text style={styles.progressText}>
                Created On: {new Date(report.createdOn).toLocaleDateString()}
              </Text>
              <Text style={styles.progressText}>
                Department: {report.department}
              </Text>
            </>
          )}

          {report.status === "onhold" && (
            <>
              <Text style={styles.progressText}>
                Assigned To: {report.assignedTo}
              </Text>
              <Text style={styles.progressText}>
                Department: {report.department}
              </Text>
              <Text style={styles.progressText}>
                Started On: {new Date(report.date).toLocaleDateString()}
              </Text>
              {report.onholdReason && (
                <Text style={styles.progressText}>
                  Onhold Reason: {report.onholdReason}
                </Text>
              )}
            </>
          )}

          {report.status === "completed" && (
            <>
              <Text style={styles.progressText}>Status: completed</Text>
              <Text style={styles.progressText}>
                Solution: {report.solution || "Issue completed successfully"}
              </Text>
              <Text style={styles.progressText}>
                Completed On:{" "}
                {report.completedOn
                  ? new Date(report.completedOn).toLocaleDateString()
                  : "Recently"}
              </Text>
              <Text style={styles.progressText}>
                completed By: {report.assignedTo}
              </Text>

              {/* Resolution Status */}
              {report.isAccepted === true && (
                <View style={styles.resolutionStatus}>
                  <MaterialIcons
                    name="check-circle"
                    size={16}
                    color="#10B981"
                  />
                  <Text
                    style={[
                      styles.progressText,
                      { color: "#10B981", marginLeft: 4 },
                    ]}
                  >
                    Resolution Accepted
                  </Text>
                </View>
              )}

              {report.isAccepted === false && (
                <View style={styles.resolutionStatus}>
                  <MaterialIcons name="cancel" size={16} color="#EF4444" />
                  <Text
                    style={[
                      styles.progressText,
                      { color: "#EF4444", marginLeft: 4 },
                    ]}
                  >
                    Resolution Rejected - Requires Further Action
                  </Text>
                  {report.onholdReason && (
                    <Text
                      style={[
                        styles.progressText,
                        { color: "#EF4444", marginLeft: 4, marginTop: 4 },
                      ]}
                    >
                      Reason: {report.onholdReason}
                    </Text>
                  )}
                </View>
              )}
            </>
          )}

          <Text style={styles.lastUpdateText}>
            Last updated: {new Date(report.lastUpdated).toLocaleTimeString()}
          </Text>
        </View>

        {/* Accept/Reject Buttons - Only show for completed status and not yet reviewed */}
        {report.status === "completed" && report.isAccepted === null && (
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity
              style={styles.acceptButton}
              onPress={() => handleAcceptReport(report.id)}
            >
              <MaterialIcons name="check-circle" size={20} color="white" />
              <Text style={styles.acceptButtonText}>Accept Resolution</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.rejectButton}
              onPress={() => handleRejectReport(report.id)}
            >
              <MaterialIcons name="cancel" size={20} color="white" />
              <Text style={styles.rejectButtonText}>Reject & Reopen</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  const renderReportItem = ({ item }) => (
    <View style={styles.reportCard}>
      <Text style={styles.title}>Subject:{item.subject}</Text>
      <Text style={styles.label}>
        Case Number: <Text style={styles.value}>{item.caseNumber}</Text>
      </Text>
      <Text style={styles.label}>
        Department: <Text style={styles.value}>{item.department}</Text>
      </Text>
      <Text style={styles.label}>
        Status:{" "}
        <Text style={[styles.value, { color: getStatusColor(item.status) }]}>
          {item.status}
        </Text>
      </Text>
      <Text style={styles.label}>
        Priority:{" "}
        <Text
          style={[styles.value, { color: getPriorityColor(item.priority) }]}
        >
          {item.priority}
        </Text>
      </Text>

      <Text style={styles.label}>Progress:</Text>
      {renderRoadmap(item)}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.navigate("ContactScreen")}
          style={styles.backButton}
        >
          <MaterialIcons name="arrow-back" size={24} color="#4A90E2" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Report Management</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Chart Section */}
      <Text style={styles.heading}>Report Summary</Text>

      <PieChart style={styles.pieChart} data={pieData} innerRadius="70%" />

      {/* Legend for the donut chart */}
      <View style={styles.legendContainer}>
        {pieData.map((item, index) => (
          <View key={item.key} style={styles.legendItem}>
            <View
              style={[styles.legendColor, { backgroundColor: item.svg.fill }]}
            />
            <Text style={styles.legendText}>
              {item.label} ({item.value})
            </Text>
          </View>
        ))}
      </View>

      {selectedSliceIndex !== null && selectedSliceIndex < pieData.length && (
        <View style={styles.pieLabel}>
          <Text style={styles.labelText}>
            {pieData[selectedSliceIndex].label}:{" "}
            {pieData[selectedSliceIndex].value}
          </Text>
        </View>
      )}

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Feather name="search" size={20} color="#7C7C7C" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search reports..."
            placeholderTextColor="#B0B0B0"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Status:</Text>
            {statusOptions.map((status) => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.filterChip,
                  filterStatus === status && styles.activeFilterChip,
                ]}
                onPress={() => setFilterStatus(status)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    filterStatus === status && styles.activeFilterChipText,
                  ]}
                >
                  {status}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Reports List */}
      {filteredAndSortedReports.length > 0 ? (
        <FlatList
          data={filteredAndSortedReports}
          renderItem={renderReportItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyState}>
          <MaterialIcons name="folder-open" size={64} color="#B0B0B0" />
          <Text style={styles.emptyTitle}>No reports found</Text>
          <Text style={styles.emptySubtitle}>
            Try adjusting your search or filter criteria
          </Text>
        </View>
      )}

      {/* Reject Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isRejectModalVisible}
        onRequestClose={closeRejectModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Reject Resolution</Text>
              <TouchableOpacity
                onPress={closeRejectModal}
                style={styles.modalCloseButton}
              >
                <MaterialIcons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              Please provide a reason for rejecting this resolution and putting
              the report on hold:
            </Text>

            <TextInput
              style={styles.modalTextInput}
              placeholder="Enter reason for putting on hold..."
              placeholderTextColor="#B0B0B0"
              value={onholdReason}
              onChangeText={setOnholdReason}
              multiline={true}
              numberOfLines={4}
              textAlignVertical="top"
            />

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={closeRejectModal}
              >
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalSubmitButton}
                onPress={submitRejectReport}
              >
                <Text style={styles.modalSubmitButtonText}>
                  Submit & Put On Hold
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E8E8E8",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2C3E50",
  },
  placeholder: {
    width: 32,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    color: "#2C3E50",
    textAlign: "center",
  },
  pieChart: {
    height: 200,
    marginBottom: 16,
  },
  legendContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
    marginVertical: 4,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#2C3E50",
  },
  pieLabel: {
    alignItems: "center",
    marginBottom: 20,
  },
  labelText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C3E50",
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "#2C3E50",
  },
  filtersContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  filterSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2C3E50",
    marginRight: 10,
  },
  filterChip: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },
  activeFilterChip: {
    backgroundColor: "#4A90E2",
    borderColor: "#4A90E2",
  },
  filterChipText: {
    fontSize: 12,
    color: "#7C7C7C",
    fontWeight: "500",
  },
  activeFilterChipText: {
    color: "#FFFFFF",
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  reportCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 18,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  title: {
    fontSize: 14,
    // fontWeight: "bold",
    fontWeight:600,
    marginBottom: 8,
    color: "gray",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 6,
    color: "#5D6D7E",
  },
  value: {
    fontWeight: "400",
    color: "#2C3E50",
  },
  // Enhanced Roadmap Styles
  roadmapContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16,
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  roadmapStep: {
    alignItems: "center",
    zIndex: 2,
  },
  roadmapCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginBottom: 8,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  roadmapLabel: {
    fontSize: 11,
    textAlign: "center",
    fontWeight: "500",
    maxWidth: 60,
  },
  roadmapLineContainer: {
    flex: 1,
    height: 2,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
    marginTop: -18,
    zIndex: 1,
  },
  roadmapLine: {
    width: "100%",
    height: 1,
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 1,
  },
  progressReport: {
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 14,
    marginTop: 12,
    backgroundColor: "#F8F9FA",
  },
  progressTitle: {
    fontWeight: "bold",
    marginBottom: 8,
    fontSize: 14,
    color: "#2C3E50",
  },
  progressText: {
    fontSize: 13,
    color: "#5D6D7E",
    marginBottom: 4,
  },
  resolutionStatus: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 4,
  },
  lastUpdateText: {
    fontSize: 11,
    color: "#85929E",
    marginTop: 6,
    fontStyle: "italic",
  },
  // Action Buttons Styles
  actionButtonsContainer: {
    flexDirection: "row",
    marginTop: 16,
    gap: 12,
  },
  acceptButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#10B981",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  acceptButtonText: {
    color: "white",
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "600",
  },
  rejectButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EF4444",
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    borderRadius: 10,
  },
  rejectButtonText: {
    color: "white",
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#292F3F",
    borderRadius: 12,
    padding: 20,
    width: "90%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
    textAlign: "center",
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#D1D5DB",
    marginBottom: 16,
    textAlign: "center",
  },
  textInput: {
    backgroundColor: "#1F2937",
    borderRadius: 8,
    padding: 12,
    color: "#fff",
    fontSize: 14,
    textAlignVertical: "top",
    marginBottom: 16,
    minHeight: 100,
  },
  modalButtonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 80,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#6b7280",
  },
  submitButton: {
    backgroundColor: "#ef4444",
  },
});
