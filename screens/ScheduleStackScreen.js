import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, ScrollView, ActivityIndicator, Modal } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import styles from './SchedulePageStyles';
import { useFonts, Poppins_700Bold, Poppins_400Regular } from '@expo-google-fonts/poppins';
import { COLORS } from './constants';

// Sample events
const events = [
  {
    id: '1',
    title: 'JavaScript Basics',
    instructor: 'Rahul Verma',
    date: '2023-05-15',
    time: '3:00 PM',
    icon: <MaterialIcons name="event-note" size={24} color="#22C55E" />,
    color: '#D1FAE5',
  },
  {
    id: '2',
    title: 'Web Security Basics',
    instructor: 'Priya Sharma',
    date: '2023-05-17',
    time: '5:30 PM',
    icon: <Ionicons name="shield-checkmark" size={24} color="#60A5FA" />,
    color: '#DBEAFE',
  },
  {
    id: '3',
    title: 'Data Structures',
    instructor: 'Ananya Patel',
    date: '2023-05-23',
    time: '4:00 PM',
    icon: <FontAwesome name="database" size={24} color="#A78BFA" />,
    color: '#EDE9FE',
  },
];

// Helper to get all event dates
const getEventDates = (events) => events.map(e => e.date);

// Helper: days in month
const daysInMonth = (month, year) => new Date(year, month, 0).getDate();

// Calendar Grid Component
function CalendarGrid({ selectedDate, setSelectedDate, month, year, eventDates }) {
  const days = daysInMonth(month, year);
  const firstDay = new Date(year, month - 1, 1).getDay();
  const weeks = [];
  let currentDay = 1 - firstDay;

  for (let w = 0; w < 6; w++) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      if (currentDay > 0 && currentDay <= days) {
        const dateStr = `${year}-${month.toString().padStart(2, '0')}-${currentDay
          .toString()
          .padStart(2, '0')}`;
        week.push(
          <TouchableOpacity
            key={d}
            style={[
              styles.calendarDay,
              selectedDate === dateStr && styles.calendarDaySelected,
              eventDates.includes(dateStr) && styles.calendarDayEvent,
            ]}
            onPress={() => setSelectedDate(dateStr)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.calendarDayText,
                selectedDate === dateStr && styles.calendarDayTextSelected,
                eventDates.includes(dateStr) && styles.calendarDayTextEvent,
              ]}
            >
              {currentDay}
            </Text>
          </TouchableOpacity>
        );
      } else {
        week.push(<View key={d} style={styles.calendarDay} />);
      }
      currentDay++;
    }
    weeks.push(
      <View key={w} style={styles.calendarWeek}>
        {week}
      </View>
    );
  }

  return (
    <View>
      <View style={styles.calendarDaysRow}>
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <Text key={i} style={styles.calendarDayName}>
            {d}
          </Text>
        ))}
      </View>
      {weeks}
    </View>
  );
}

// Year Picker Modal
function YearPicker({ visible, onClose, onSelect, currentYear }) {
  const years = [];
  for (let y = currentYear - 10; y <= currentYear + 10; y++) {
    years.push(y);
  }
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={{
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.2)',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <View style={{
          backgroundColor: '#fff',
          borderRadius: 10,
          padding: 20,
          width: 200,
          maxHeight: 400,
        }}>
          <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 10 }}>Select Year</Text>
          <ScrollView>
            {years.map(y => (
              <TouchableOpacity
                key={y}
                style={{
                  padding: 10,
                  backgroundColor: y === currentYear ? COLORS.logoBlue : 'transparent',
                  borderRadius: 5,
                  marginBottom: 2,
                }}
                onPress={() => {
                  onSelect(y);
                  onClose();
                }}
              >
                <Text style={{
                  color: y === currentYear ? '#fff' : '#222',
                  textAlign: 'center',
                  fontWeight: y === currentYear ? 'bold' : 'normal'
                }}>{y}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity onPress={onClose} style={{ marginTop: 12 }}>
            <Text style={{ color: COLORS.logoBlue, textAlign: 'center' }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

export default function SchedulePage() {
  // Dynamic state for month/year
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1); // 1-12
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(
    `${today.getFullYear()}-${(today.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`
  );
  const [yearPickerVisible, setYearPickerVisible] = useState(false);

  let [fontsLoaded] = useFonts({
    Poppins_700Bold,
    Poppins_400Regular,
  });

  // Navigation handlers
  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  const handlePrevYear = () => setCurrentYear(prev => prev - 1);
  const handleNextYear = () => setCurrentYear(prev => prev + 1);

  // Get event dates for the current month
  const eventDates = getEventDates(events).filter(date =>
    date.startsWith(`${currentYear}-${currentMonth.toString().padStart(2, '0')}`)
  );

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" style={{ flex: 1, marginTop: 100 }} />;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 20 }}>
      <View style={styles.headerContainer}>
        <Text style={styles.logoText}>
          <Text style={{ color: COLORS.logoGreen }}>Grow</Text>
          <Text style={{ color: COLORS.logoBlue }}>Hive</Text>
        </Text>
      </View>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Schedule</Text>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.calendarContainer}>
        <View style={styles.calendarHeaderRow}>
          {/* Month Navigation */}
          <TouchableOpacity onPress={handlePrevMonth}>
            <Ionicons name="chevron-back" size={22} color="#A1A1AA" />
          </TouchableOpacity>
          <Text style={styles.calendarHeader}>
            {new Date(currentYear, currentMonth - 1).toLocaleString('default', {
              month: 'long',
            })}
          </Text>
          <TouchableOpacity onPress={handleNextMonth}>
            <Ionicons name="chevron-forward" size={22} color="#A1A1AA" />
          </TouchableOpacity>

          {/* Year Navigation */}
          <TouchableOpacity onPress={handlePrevYear} style={{ marginLeft: 16 }}>
            <Ionicons name="chevron-back" size={18} color="#A1A1AA" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setYearPickerVisible(true)}>
            <Text style={[styles.calendarHeader, { textDecorationLine: 'underline', marginHorizontal: 4 }]}>
              {currentYear}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNextYear}>
            <Ionicons name="chevron-forward" size={18} color="#A1A1AA" />
          </TouchableOpacity>
        </View>
        <CalendarGrid
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          month={currentMonth}
          year={currentYear}
          eventDates={eventDates}
        />
      </View>

      <YearPicker
        visible={yearPickerVisible}
        onClose={() => setYearPickerVisible(false)}
        onSelect={setCurrentYear}
        currentYear={currentYear}
      />

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.seeRequestsBtn}>
          <Text style={styles.seeRequestsText}>See Requests</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addPartnerBtn}>
          <Text style={styles.addPartnerText}>Add Partner</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.upcomingHeader}>Upcoming Events</Text>
      <FlatList
        data={events}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={[styles.eventCard, { backgroundColor: item.color }]}>
            <View style={styles.eventIcon}>{item.icon}</View>
            <View style={styles.eventInfo}>
              <Text style={styles.eventTitle}>{item.title}</Text>
              <Text style={styles.eventInstructor}>With {item.instructor}</Text>
              <View style={styles.eventTimeRow}>
                <Ionicons name="calendar-outline" size={14} color="#6B7280" />
                <Text style={styles.eventTime}>
                  {new Date(item.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}{' '}
                  · {item.time}
                </Text>
              </View>
            </View>
            <Ionicons name="notifications-outline" size={20} color="#A1A1AA" />
          </View>
        )}
        style={styles.eventsList}
        scrollEnabled={false}
      />
    </ScrollView>
  );
}
