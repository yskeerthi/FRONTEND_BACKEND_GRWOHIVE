import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  Alert,
  StyleSheet,
  Modal,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Icon from "react-native-vector-icons/Feather";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_700Bold,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";

import { COLORS } from "../screens/constants";

// const API_BASE_URL = "http://192.168.137.1:5000/api/auth";
import { IP } from '../Config/config';
const API_BASE_URL = `${IP}/api/auth`;

const PROFICIENCY_OPTIONS = ["Beginner", "Intermediate", "Advanced", "Expert"];

const INITIAL_DOMAIN_OPTIONS = [
  "Select Domain",
  "Create New Category",
  "Artificial Intelligence",
  "Machine Learning",
  "Data Science",
  "Cybersecurity",
  "Web Development",
  "Mobile Development",
  "Blockchain",
  "Game Development",
  "UI/UX Design",
  "Cloud Computing",
  "DevOps",
  "Software Engineering",
  "Database Management",
  "Network Administration",
  "Digital Marketing",
  "Project Management",
  "Quality Assurance",
  "Data Analysis",
  "Business Intelligence",
];

const INITIAL_SKILLS_BY_DOMAIN = {
  "Artificial Intelligence": [
    "Natural Language Processing",
    "Computer Vision",
    "Deep Learning",
    "Neural Networks",
    "Machine Learning Algorithms",
    "AI Ethics",
    "Reinforcement Learning",
    "Expert Systems",
    "Robotics",
    "Speech Recognition",
    "Merchant Acquisition",
    "Smart Payment",
  ],
  "Machine Learning": [
    "Supervised Learning",
    "Unsupervised Learning",
    "Deep Learning",
    "Feature Engineering",
    "Model Evaluation",
    "Ensemble Methods",
    "Merchant Acquisition",
    "Smart Payment",
  ],
  "Data Science": [
    "Data Analysis",
    "Statistical Modeling",
    "Merchant Acquisition",
    "Smart Payment",
  ],
  Cybersecurity: [
    "Network Security",
    "Ethical Hacking",
    "Merchant Acquisition",
    "Smart Payment",
  ],
  "Web Development": [
    "HTML5",
    "CSS3",
    "JavaScript",
    "React.js",
    "Angular",
    "Vue.js",
    "Node.js",
    "REST APIs",
    "GraphQL",
    "MongoDB",
    "PostgreSQL",
    "Responsive Design",
    "Merchant Acquisition",
    "Smart Payment",
  ],
  "Mobile Development": [
    "React Native",
    "Flutter",
    "iOS Development",
    "Android Development",
    "Merchant Acquisition",
    "Smart Payment",
  ],
  Blockchain: [
    "Smart Contracts",
    "Solidity",
    "Ethereum",
    "Bitcoin",
    "DeFi",
    "NFTs",
    "Web3",
    "Cryptocurrency",
    "Blockchain Architecture",
    "Consensus Algorithms",
    "dApps",
    "Tokenomics",
    "Merchant Acquisition",
    "Smart Payment",
  ],
  "Game Development": [
    "Unity",
    "Unreal Engine",
    "C#",
    "C++",
    "Game Design",
    "3D Modeling",
    "Animation",
    "Physics Simulation",
    "Multiplayer Programming",
    "Mobile Games",
    "VR/AR Development",
    "Game Testing",
    "Merchant Acquisition",
    "Smart Payment",
  ],
  "UI/UX Design": [
    "User Research",
    "Wireframing",
    "Prototyping",
    "User Testing",
    "Design Systems",
    "Figma",
    "Adobe XD",
    "Sketch",
    "Information Architecture",
    "Interaction Design",
    "Visual Design",
    "Accessibility",
    "Merchant Acquisition",
    "Smart Payment",
  ],
  "Cloud Computing": [
    "AWS",
    "Microsoft Azure",
    "Google Cloud Platform",
    "Docker",
    "Kubernetes",
    "Serverless Architecture",
    "Microservices",
    "Cloud Security",
    "Infrastructure as Code",
    "Load Balancing",
    "Merchant Acquisition",
    "Smart Payment",
  ],
  DevOps: [
    "CI/CD",
    "Jenkins",
    "Docker",
    "Kubernetes",
    "Terraform",
    "Ansible",
    "Monitoring",
    "Logging",
    "Infrastructure Automation",
    "Configuration Management",
    "Version Control",
    "Agile",
    "Merchant Acquisition",
    "Smart Payment",
  ],
  "Software Engineering": [
    "Object-Oriented Programming",
    "Design Patterns",
    "Software Architecture",
    "Testing",
    "Code Review",
    "Version Control",
    "Agile Methodologies",
    "SOLID Principles",
    "Refactoring",
    "Documentation",
    "Merchant Acquisition",
    "Smart Payment",
  ],
  "Database Management": [
    "SQL",
    "NoSQL",
    "Database Design",
    "Query Optimization",
    "Data Modeling",
    "MySQL",
    "PostgreSQL",
    "MongoDB",
    "Redis",
    "Database Administration",
    "Backup & Recovery",
    "Performance Tuning",
    "Merchant Acquisition",
    "Smart Payment",
  ],
  "Network Administration": [
    "Network Configuration",
    "TCP/IP",
    "DNS",
    "DHCP",
    "VPN",
    "Firewall Management",
    "Network Monitoring",
    "Troubleshooting",
    "Cisco Networking",
    "Network Security",
    "Wireless Networks",
    "Merchant Acquisition",
    "Smart Payment",
  ],
  "Digital Marketing": [
    "SEO",
    "SEM",
    "Social Media Marketing",
    "Content Marketing",
    "Email Marketing",
    "Google Analytics",
    "PPC Advertising",
    "Marketing Automation",
    "Brand Management",
    "Lead Generation",
    "Merchant Acquisition",
    "Smart Payment",
  ],
  "Project Management": [
    "Agile",
    "Scrum",
    "Kanban",
    "Risk Management",
    "Resource Planning",
    "Stakeholder Management",
    "Budget Management",
    "Timeline Management",
    "Team Leadership",
    "Communication",
    "Merchant Acquisition",
    "Smart Payment",
  ],
  "Quality Assurance": [
    "Manual Testing",
    "Automated Testing",
    "Test Planning",
    "Bug Tracking",
    "Performance Testing",
    "Security Testing",
    "API Testing",
    "Mobile Testing",
    "Regression Testing",
    "Test Automation",
    "Merchant Acquisition",
    "Smart Payment",
  ],
  "Data Analysis": [
    "Excel",
    "Python",
    "R",
    "SQL",
    "Tableau",
    "Power BI",
    "Statistical Analysis",
    "Data Cleaning",
    "Data Visualization",
    "Predictive Modeling",
    "Business Intelligence",
    "Merchant Acquisition",
    "Smart Payment",
  ],
  "Business Intelligence": [
    "Data Warehousing",
    "ETL",
    "OLAP",
    "Reporting",
    "Dashboard Development",
    "KPI Development",
    "Business Analytics",
    "Data Governance",
    "Data Quality",
    "Performance Metrics",
    "Merchant Acquisition",
    "Smart Payment",
  ],
};

export default function SkillsPage() {
  const navigation = useNavigation();
  const route = useRoute();
  const { userToken, userId } = route.params || {};

  const [domains, setDomains] = useState([]);
  const [domainOptions, setDomainOptions] = useState(INITIAL_DOMAIN_OPTIONS);
  const [selectedDomain, setSelectedDomain] = useState("Select Domain");
  const [skillsByDomain, setSkillsByDomain] = useState(
    INITIAL_SKILLS_BY_DOMAIN
  );

  const [skillsToLearnList, setSkillsToLearnList] = useState([]);
  const [selectedSkillToLearnDomain, setSelectedSkillToLearnDomain] =
    useState("Select Domain");
  const [selectedSkillToLearn, setSelectedSkillToLearn] =
    useState("Select Skill");

  const [loading, setLoading] = useState(false);

  const [selectedSkillFromDropdown, setSelectedSkillFromDropdown] =
    useState("Select Skill");
  const [proficiency, setProficiency] = useState("");
  const [showProficiencyInput, setShowProficiencyInput] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [activeDomainIndex, setActiveDomainIndex] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [newDomainName, setNewDomainName] = useState("");
  const [skillModalVisible, setSkillModalVisible] = useState(false);
  const [newSkillName, setNewSkillName] = useState("");

  useEffect(() => {
    console.log("SkillsPage mounted.");
    console.log("Received userToken:", userToken ? "Present" : "Not Present");
    console.log("Received userId:", userId || "Not Present");
    if (!userToken) {
      console.warn(
        "SkillsPage: No userToken received. This might cause issues for API calls."
      );
    }
  }, []);

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
    Poppins_600SemiBold,
  });

  if (!fontsLoaded) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: COLORS.background,
        }}
      >
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const getAvailableSkills = (
    domainName,
    domainIndex = null,
    type = "owned"
  ) => {
    if (!domainName || domainName === "Select Domain") return ["Select Skill"];

    let allSkills = skillsByDomain[domainName] || [];
    allSkills = ["Select Skill", "Create New Skill", ...allSkills];

    if (type === "owned" && domainIndex !== null && domains[domainIndex]) {
      const addedSkills = domains[domainIndex].skills.map(
        (skill) => skill.skill
      );
      return allSkills.filter(
        (skill) =>
          skill === "Select Skill" ||
          skill === "Create New Skill" ||
          !addedSkills.includes(skill)
      );
    } else if (type === "learn") {
      const addedSkills = skillsToLearnList
        .filter((skill) => skill.domain === domainName)
        .map((skill) => skill.skill);
      return allSkills.filter(
        (skill) =>
          skill === "Select Skill" ||
          skill === "Create New Skill" ||
          !addedSkills.includes(skill)
      );
    }

    return allSkills;
  };

  const handleAddDomain = () => {
    if (selectedDomain === "Select Domain") {
      Alert.alert("Select Domain", "Please select a domain to add.");
      return;
    }

    if (selectedDomain === "Create New Category") {
      setModalVisible(true);
      return;
    }

    const domainExists = domains.some(
      (domain) => domain.domainName === selectedDomain
    );
    if (domainExists) {
      Alert.alert("Domain Exists", "This domain has already been added.");
      return;
    }

    const newDomain = {
      domainName: selectedDomain,
      skills: [],
    };

    setDomains([...domains, newDomain]);
    setSelectedDomain("Select Domain");
    setActiveDomainIndex(domains.length);
    Alert.alert(
      "Domain Added",
      `${selectedDomain} has been added. You can now add skills to it.`
    );
  };

  const handleCreateDomain = () => {
    if (!newDomainName.trim()) {
      Alert.alert("Error", "Please enter a domain name.");
      return;
    }

    if (domainOptions.includes(newDomainName.trim())) {
      Alert.alert("Error", "This domain already exists.");
      return;
    }

    setDomainOptions([
      ...domainOptions.filter((opt) => opt !== "Create New Category"),
      newDomainName.trim(),
      "Create New Category",
    ]);
    setSkillsByDomain({ ...skillsByDomain, [newDomainName.trim()]: [] });
    setSelectedDomain(newDomainName.trim());
    setNewDomainName("");
    setModalVisible(false);
  };

  const handleRemoveDomain = (domainIndex) => {
    const domain = domains[domainIndex];
    Alert.alert(
      "Remove Domain",
      `Are you sure you want to remove "${domain.domainName}" and all its skills?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          onPress: () => {
            const newDomains = domains.filter(
              (_, index) => index !== domainIndex
            );
            setDomains(newDomains);
            if (activeDomainIndex === domainIndex) {
              setActiveDomainIndex(null);
            } else if (activeDomainIndex > domainIndex) {
              setActiveDomainIndex(activeDomainIndex - 1);
            }
          },
        },
      ]
    );
  };

  const handleAddSkillToDomain = (domainIndex) => {
    if (selectedSkillFromDropdown === "Select Skill") {
      Alert.alert("Select Skill", "Please select a skill to add.");
      return;
    }

    if (selectedSkillFromDropdown === "Create New Skill") {
      setSkillModalVisible(true);
      setActiveDomainIndex(domainIndex);
      return;
    }

    setShowProficiencyInput(true);
    setActiveDomainIndex(domainIndex);
  };

  const handleCreateSkill = () => {
    if (!newSkillName.trim()) {
      Alert.alert("Error", "Please enter a skill name.");
      return;
    }

    const domainName =
      domains[activeDomainIndex]?.domainName || selectedSkillToLearnDomain;
    if (!domainName || domainName === "Select Domain") {
      Alert.alert("Error", "No domain selected.");
      setSkillModalVisible(false);
      return;
    }

    if (skillsByDomain[domainName].includes(newSkillName.trim())) {
      Alert.alert("Error", "This skill already exists in the selected domain.");
      return;
    }

    setSkillsByDomain({
      ...skillsByDomain,
      [domainName]: [...skillsByDomain[domainName], newSkillName.trim()],
    });
    if (activeDomainIndex !== null) {
      setSelectedSkillFromDropdown(newSkillName.trim());
    } else {
      setSelectedSkillToLearn(newSkillName.trim());
    }
    setNewSkillName("");
    setSkillModalVisible(false);
  };

  const handleSaveProficiency = () => {
    if (
      selectedSkillFromDropdown !== "Select Skill" &&
      proficiency.trim() &&
      activeDomainIndex !== null
    ) {
      const newDomains = [...domains];
      newDomains[activeDomainIndex].skills.push({
        skill: selectedSkillFromDropdown,
        proficiency: proficiency.trim(),
      });

      setDomains(newDomains);
      setSelectedSkillFromDropdown("Select Skill");
      setProficiency("");
      setShowProficiencyInput(false);
      setActiveDomainIndex(null);
    } else {
      Alert.alert("Error", "Please select skill and proficiency.");
    }
  };

  const handleEditSkill = (domainIndex, skillIndex) => {
    const skill = domains[domainIndex].skills[skillIndex];
    setEditingSkill({ domainIndex, skillIndex });
    setProficiency(skill.proficiency);
  };

  const handleSaveEditedProficiency = () => {
    if (proficiency.trim() && editingSkill) {
      const newDomains = [...domains];
      newDomains[editingSkill.domainIndex].skills[
        editingSkill.skillIndex
      ].proficiency = proficiency.trim();

      setDomains(newDomains);
      setEditingSkill(null);
      setProficiency("");
    } else {
      Alert.alert("Error", "Please select proficiency.");
    }
  };

  const handleRemoveSkillFromDomain = (domainIndex, skillIndex) => {
    const skill = domains[domainIndex].skills[skillIndex];
    Alert.alert(
      "Remove Skill",
      `Are you sure you want to remove "${skill.skill}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          onPress: () => {
            const newDomains = [...domains];
            newDomains[domainIndex].skills = newDomains[
              domainIndex
            ].skills.filter((_, index) => index !== skillIndex);
            setDomains(newDomains);
          },
        },
      ]
    );
  };

  const handleAddSkillToLearn = () => {
    if (
      selectedSkillToLearnDomain === "Select Domain" ||
      selectedSkillToLearn === "Select Skill"
    ) {
      Alert.alert("Error", "Please select a domain and skill to learn.");
      return;
    }

    if (selectedSkillToLearn === "Create New Skill") {
      setSkillModalVisible(true);
      return;
    }

    const skillToLearn = {
      skill: selectedSkillToLearn,
      domain: selectedSkillToLearnDomain,
    };

    setSkillsToLearnList([...skillsToLearnList, skillToLearn]);
    setSelectedSkillToLearn("Select Skill");
    setSelectedSkillToLearnDomain("Select Domain");
    Alert.alert(
      "Success",
      `"${selectedSkillToLearn}" added to skills to learn.`
    );
  };

  const handleRemoveSkillToLearn = (index) => {
    Alert.alert(
      "Remove Skill",
      `Are you sure you want to remove "${skillsToLearnList[index].skill}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          onPress: () =>
            setSkillsToLearnList(
              skillsToLearnList.filter((_, i) => i !== index)
            ),
        },
      ]
    );
  };

  const handleNext = async () => {
    if (domains.length === 0 && skillsToLearnList.length === 0) {
      Alert.alert(
        "Error",
        "Please add at least one domain with skills or skills to learn."
      );
      return;
    }

    setLoading(true);
    console.log("Attempting to save Skills and Domains...");

    try {
      const allSkillsOwned = domains.reduce((acc, domain) => {
        const domainSkills = domain.skills.map((skill) => ({
          ...skill,
          domain: domain.domainName,
        }));
        return [...acc, ...domainSkills];
      }, []);

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
      };

      const response = await axios.put(
        `${API_BASE_URL}/complete-profile`,
        {
          skillsOwned: allSkillsOwned,
          skillsToLearn: skillsToLearnList,
          domains: domains.map((d) => d.domainName),
        },
        config
      );

      console.log("Skills & Domains update success:", response.data);
      Alert.alert("Success", "Skills and Domains saved!");
      navigation.navigate("UploadCertificatesScreen", { userToken, userId });
    } catch (error) {
      console.error(
        "Skills & Domains update error:",
        error.response ? error.response.data : error.message
      );
      Alert.alert(
        "Update Failed",
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : "Failed to save skills and domains. Please try again."
      );
    } finally {
      setLoading(false);
      console.log("Skills & Domains process finished (loading reset).");
    }
  };

  const handleBack = () => {
    console.log("SkillsPage: Going back.");
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 38 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ marginTop: 36 }} />
        <Text style={styles.title}>Skills & Domains</Text>
        <Text style={styles.subtitle}>
          Add your domains of expertise and showcase your skills in each area.
        </Text>

        {/* Domain Selection */}
        <View style={styles.inputSection}>
          <View style={styles.inputLabelRow}>
            <MaterialIcons name="category" size={22} color={COLORS.secondary} />
            <Text style={styles.inputLabel}>Select Domain</Text>
          </View>
          <View style={styles.domainAddRow}>
            <View style={[styles.pickerWrapper, { flex: 1, marginRight: 10 }]}>
              <Picker
                selectedValue={selectedDomain}
                onValueChange={(itemValue) => setSelectedDomain(itemValue)}
                style={styles.picker}
                dropdownIconColor={COLORS.secondary}
              >
                {domainOptions.map((domain, i) => (
                  <Picker.Item key={i} label={domain} value={domain} />
                ))}
              </Picker>
            </View>
            <TouchableOpacity
              style={styles.addBtn}
              onPress={handleAddDomain}
              disabled={selectedDomain === "Select Domain"}
            >
              <Icon name="plus-circle" size={24} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Display Domains and Their Skills */}
        {domains.map((domain, domainIndex) => (
          <View key={domainIndex} style={styles.domainSection}>
            <View style={styles.domainHeader}>
              <View style={styles.domainTitleRow}>
                <MaterialIcons name="folder" size={20} color={COLORS.primary} />
                <Text style={styles.domainTitle}>{domain.domainName}</Text>
              </View>
              <TouchableOpacity
                style={styles.removeDomainBtn}
                onPress={() => handleRemoveDomain(domainIndex)}
              >
                <MaterialIcons name="delete" size={20} color={COLORS.accent} />
              </TouchableOpacity>
            </View>

            {/* Add Skills to This Domain - Dropdown Selection */}
            {!showProficiencyInput && !editingSkill && (
              <View style={styles.skillAddSection}>
                <View style={styles.skillAddRow}>
                  <View
                    style={[styles.pickerWrapper, { flex: 1, marginRight: 8 }]}
                  >
                    <Picker
                      selectedValue={selectedSkillFromDropdown}
                      onValueChange={(itemValue) =>
                        setSelectedSkillFromDropdown(itemValue)
                      }
                      style={styles.picker}
                      dropdownIconColor={COLORS.secondary}
                    >
                      {getAvailableSkills(
                        domain.domainName,
                        domainIndex,
                        "owned"
                      ).map((skill, i) => (
                        <Picker.Item key={i} label={skill} value={skill} />
                      ))}
                    </Picker>
                  </View>
                  <TouchableOpacity
                    style={styles.addBtn}
                    onPress={() => handleAddSkillToDomain(domainIndex)}
                    disabled={selectedSkillFromDropdown === "Select Skill"}
                  >
                    <Icon name="plus-circle" size={24} color={COLORS.primary} />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Proficiency Input for New Skill */}
            {showProficiencyInput && activeDomainIndex === domainIndex && (
              <View style={styles.proficiencyRow}>
                <Text style={styles.proficiencyLabel}>
                  Proficiency for "{selectedSkillFromDropdown}":
                </Text>
                <View style={styles.dropdownContainer}>
                  {PROFICIENCY_OPTIONS.map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.dropdownOption,
                        proficiency === option && styles.dropdownOptionSelected,
                      ]}
                      onPress={() => setProficiency(option)}
                    >
                      <Text
                        style={[
                          styles.dropdownOptionText,
                          proficiency === option &&
                            styles.dropdownOptionTextSelected,
                        ]}
                      >
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <TouchableOpacity
                  style={styles.saveBtn}
                  onPress={handleSaveProficiency}
                  disabled={!proficiency.trim()}
                >
                  <Text style={styles.saveBtnText}>Save</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Edit Proficiency for Existing Skill */}
            {editingSkill && editingSkill.domainIndex === domainIndex && (
              <View style={styles.proficiencyRow}>
                <Text style={styles.proficiencyLabel}>
                  Edit proficiency for "
                  {domain.skills[editingSkill.skillIndex].skill}":
                </Text>
                <View style={styles.dropdownContainer}>
                  {PROFICIENCY_OPTIONS.map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.dropdownOption,
                        proficiency === option && styles.dropdownOptionSelected,
                      ]}
                      onPress={() => setProficiency(option)}
                    >
                      <Text
                        style={[
                          styles.dropdownOptionText,
                          proficiency === option &&
                            styles.dropdownOptionTextSelected,
                        ]}
                      >
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <TouchableOpacity
                  style={styles.saveBtn}
                  onPress={handleSaveEditedProficiency}
                  disabled={!proficiency.trim()}
                >
                  <Text style={styles.saveBtnText}>Save</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* List of Skills in This Domain */}
            <View style={styles.skillsList}>
              {domain.skills.map((skill, skillIndex) => (
                <View key={skillIndex} style={styles.skillItemRow}>
                  <MaterialIcons
                    name="check-circle"
                    size={20}
                    color={COLORS.primary}
                  />
                  <Text style={styles.skillText}>
                    {skill.skill}{" "}
                    <Text style={styles.skillProficiency}>
                      ({skill.proficiency})
                    </Text>
                  </Text>
                  <TouchableOpacity
                    style={styles.editBtn}
                    onPress={() => handleEditSkill(domainIndex, skillIndex)}
                  >
                    <Icon name="edit-2" size={18} color={COLORS.secondary} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.removeBtn}
                    onPress={() =>
                      handleRemoveSkillFromDomain(domainIndex, skillIndex)
                    }
                  >
                    <MaterialIcons
                      name="close"
                      size={20}
                      color={COLORS.accent}
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* Skills to Learn */}
        <View style={styles.inputSection}>
          <View style={styles.inputLabelRow}>
            <MaterialIcons
              name="lightbulb-outline"
              size={22}
              color={COLORS.primary}
            />
            <Text style={styles.inputLabel}>Skills to Learn</Text>
          </View>

          <View style={styles.skillToLearnSection}>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={selectedSkillToLearnDomain}
                onValueChange={(itemValue) => {
                  setSelectedSkillToLearnDomain(itemValue);
                  setSelectedSkillToLearn("Select Skill");
                }}
                style={styles.picker}
                dropdownIconColor={COLORS.secondary}
              >
                {domainOptions
                  .filter((opt) => opt !== "Create New Category")
                  .map((domain, i) => (
                    <Picker.Item key={i} label={domain} value={domain} />
                  ))}
              </Picker>
            </View>

            {selectedSkillToLearnDomain !== "Select Domain" && (
              <View style={styles.skillAddRow}>
                <View
                  style={[styles.pickerWrapper, { flex: 1, marginRight: 8 }]}
                >
                  <Picker
                    selectedValue={selectedSkillToLearn}
                    onValueChange={(itemValue) =>
                      setSelectedSkillToLearn(itemValue)
                    }
                    style={styles.picker}
                    dropdownIconColor={COLORS.secondary}
                  >
                    {getAvailableSkills(
                      selectedSkillToLearnDomain,
                      null,
                      "learn"
                    ).map((skill, i) => (
                      <Picker.Item key={i} label={skill} value={skill} />
                    ))}
                  </Picker>
                </View>
                <TouchableOpacity
                  style={styles.addBtn}
                  onPress={handleAddSkillToLearn}
                  disabled={
                    selectedSkillToLearn === "Select Skill" ||
                    selectedSkillToLearnDomain === "Select Domain"
                  }
                >
                  <Icon name="plus-circle" size={24} color={COLORS.primary} />
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View style={{ marginTop: 8 }}>
            {skillsToLearnList.map((skillItem, idx) => (
              <View key={idx} style={styles.skillItemRow}>
                <MaterialIcons
                  name="lightbulb-outline"
                  size={20}
                  color={COLORS.secondary}
                />
                <View style={styles.skillToLearnContent}>
                  <Text style={styles.skillText}>{skillItem.skill}</Text>
                  <Text style={styles.skillDomain}>
                    Domain: {skillItem.domain}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.removeBtn}
                  onPress={() => handleRemoveSkillToLearn(idx)}
                >
                  <MaterialIcons name="close" size={20} color={COLORS.accent} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* Navigation Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <MaterialIcons
              name="arrow-back"
              size={28}
              color={COLORS.secondary}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleNext}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.card} size="small" />
            ) : (
              <Text style={styles.nextButtonText}>Next</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal for Creating New Domain */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New Domain</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter domain name"
              placeholderTextColor={COLORS.muted}
              value={newDomainName}
              onChangeText={setNewDomainName}
            />
            <View style={styles.modalButtonRow}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  setModalVisible(false);
                  setNewDomainName("");
                  setSelectedDomain("Select Domain");
                }}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalConfirmButton]}
                onPress={handleCreateDomain}
              >
                <Text style={[styles.modalButtonText, { color: COLORS.card }]}>
                  Create
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal for Creating New Skill */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={skillModalVisible}
        onRequestClose={() => setSkillModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New Skill</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter skill name"
              placeholderTextColor={COLORS.muted}
              value={newSkillName}
              onChangeText={setNewSkillName}
            />
            <View style={styles.modalButtonRow}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  setSkillModalVisible(false);
                  setNewSkillName("");
                  if (activeDomainIndex !== null) {
                    setSelectedSkillFromDropdown("Select Skill");
                  } else {
                    setSelectedSkillToLearn("Select Skill");
                  }
                }}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalConfirmButton]}
                onPress={handleCreateSkill}
              >
                <Text style={[styles.modalButtonText, { color: COLORS.card }]}>
                  Create
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 26,
    paddingTop: 38,
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 28,
    color: COLORS.text,
    marginBottom: 5,
    fontFamily: "Poppins_700Bold",
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.muted,
    marginBottom: 22,
    lineHeight: 22,
    fontFamily: "Poppins_400Regular",
  },
  inputSection: {
    marginBottom: 18,
  },
  inputLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  inputLabel: {
    marginLeft: 8,
    fontSize: 15,
    color: COLORS.text,
    fontFamily: "Poppins_700Bold",
  },
  inputBox: {
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: COLORS.shadow,
    padding: 10,
    minHeight: 44,
    color: COLORS.text,
    fontSize: 15,
    fontFamily: "Poppins_400Regular",
    textAlignVertical: "top",
  },
  domainAddRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  skillAddRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  addBtn: {
    padding: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  domainSection: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.shadow,
    padding: 16,
    marginBottom: 16,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  domainHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.shadow,
  },
  domainTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  domainTitle: {
    marginLeft: 8,
    fontSize: 18,
    color: COLORS.text,
    fontFamily: "Poppins_700Bold",
  },
  removeDomainBtn: {
    padding: 4,
  },
  skillsList: {
    marginTop: 8,
  },
  proficiencyRow: {
    marginTop: 8,
    marginBottom: 8,
    backgroundColor: COLORS.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.shadow,
    padding: 10,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  proficiencyLabel: {
    fontSize: 14,
    color: COLORS.muted,
    fontFamily: "Poppins_400Regular",
    marginBottom: 8,
  },
  dropdownContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 6,
  },
  dropdownOption: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.shadow,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginRight: 10,
    marginBottom: 6,
  },
  dropdownOptionSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  dropdownOptionText: {
    color: COLORS.text,
    fontFamily: "Poppins_400Regular",
    fontSize: 15,
  },
  dropdownOptionTextSelected: {
    color: COLORS.card,
    fontFamily: "Poppins_700Bold",
  },
  saveBtn: {
    marginTop: 10,
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
    width: 100,
    alignSelf: "flex-end",
  },
  saveBtnText: {
    color: COLORS.card,
    fontFamily: "Poppins_700Bold",
    fontSize: 15,
  },
  skillItemRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    backgroundColor: COLORS.background,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: COLORS.shadow,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  skillText: {
    marginLeft: 8,
    fontFamily: "Poppins_400Regular",
    color: COLORS.text,
    fontSize: 15,
    flex: 1,
  },
  skillProficiency: {
    color: COLORS.muted,
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
  },
  editBtn: {
    marginLeft: 8,
    padding: 4,
  },
  removeBtn: {
    marginLeft: 4,
    padding: 4,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 18,
    marginBottom: 8,
  },
  backButton: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.shadow,
    elevation: 1,
  },
  nextButton: {
    backgroundColor: COLORS.secondary,
    borderRadius: 12,
    paddingHorizontal: 40,
    paddingVertical: 13,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  nextButtonText: {
    color: COLORS.card,
    fontFamily: "Poppins_700Bold",
    fontSize: 18,
    letterSpacing: 1,
  },
  pickerWrapper: {
    backgroundColor: COLORS.card,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: COLORS.shadow,
    overflow: "hidden",
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: "100%",
    color: COLORS.text,
    fontFamily: "Poppins_400Regular",
  },
  skillToLearnSection: {
    marginBottom: 10,
  },
  skillToLearnContent: {
    flex: 1,
    marginLeft: 8,
  },
  skillDomain: {
    fontSize: 14,
    color: COLORS.muted,
    fontFamily: "Poppins_400Regular",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: "Poppins_700Bold",
    color: COLORS.text,
    marginBottom: 16,
  },
  modalInput: {
    width: "100%",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.shadow,
    padding: 10,
    minHeight: 44,
    color: COLORS.text,
    fontSize: 15,
    fontFamily: "Poppins_400Regular",
    marginBottom: 16,
  },
  modalButtonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.shadow,
    marginHorizontal: 5,
  },
  modalConfirmButton: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  modalButtonText: {
    fontSize: 15,
    fontFamily: "Poppins_600SemiBold",
    color: COLORS.text,
  },
});
