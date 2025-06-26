import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PremiumScreen = ({ navigation }) => {
  const [selectedPlan, setSelectedPlan] = useState('3months');

  const pricingPlans = [
    {
      id: '12months',
      duration: '12',
      period: 'months',
      price: '$6.00/mt',
      label: 'SAVE 50%',
      labelColor: '#4CAF50',
    },
    {
      id: '3months',
      duration: '3',
      period: 'months',
      price: '$9.00/mt',
      label: 'SAVE 25%',
      labelColor: '#FF9800',
      recommended: true,
    },
    {
      id: '1month',
      duration: '1',
      period: 'month',
      price: '$12.00/mt',
      label: '',
      labelColor: '#999',
    },
  ];

  const handlePlanSelect = (planId) => {
    setSelectedPlan(planId);
  };

  const handleSubscribe = () => {
    const selectedPlanData = pricingPlans.find(plan => plan.id === selectedPlan);
    console.log('Subscribe to:', selectedPlanData);
    // Handle subscription logic here
  };

  const renderPricingCard = (plan) => {
    const isSelected = selectedPlan === plan.id;
    
    return (
      <TouchableOpacity
        key={plan.id}
        style={[
          styles.pricingCard,
          isSelected && styles.selectedCard,
          plan.recommended && styles.recommendedCard,
        ]}
        onPress={() => handlePlanSelect(plan.id)}
        activeOpacity={0.7}
      >
        {plan.label && (
          <View style={[styles.labelContainer, { backgroundColor: plan.labelColor }]}>
            <Text style={styles.labelText}>{plan.label}</Text>
          </View>
        )}
        
        <Text style={[styles.duration, isSelected && styles.selectedText]}>
          {plan.duration}
        </Text>
        <Text style={[styles.period, isSelected && styles.selectedText]}>
          {plan.period}
        </Text>
        <Text style={[styles.price, isSelected && styles.selectedText]}>
          {plan.price}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation?.goBack()}
          >
            <Ionicons name="chevron-back" size={24} color="#FF9800" />
          </TouchableOpacity>
        </View>

        {/* Illustration */}
        <View style={styles.illustrationContainer}>
          <View style={styles.illustration}>
            <View style={styles.personContainer}>
              <View style={styles.person} />
              <View style={styles.phone} />
            </View>
            <View style={styles.sparkle1}>
              <Ionicons name="sparkles" size={20} color="#FF9800" />
            </View>
            <View style={styles.sparkle2}>
              <Ionicons name="add" size={16} color="#FF9800" />
            </View>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>Upgrade to Premium</Text>
        <Text style={styles.subtitle}>
          Unlimited swipes, Likes, Matches and so more!
        </Text>

        {/* Pricing Cards */}
        <View style={styles.pricingContainer}>
          {pricingPlans.map(renderPricingCard)}
        </View>

        {/* Subscribe Button */}
        <TouchableOpacity 
          style={styles.subscribeButton}
          onPress={handleSubscribe}
          activeOpacity={0.8}
        >
          <Text style={styles.subscribeButtonText}>
            Get {pricingPlans.find(p => p.id === selectedPlan)?.duration} Month{pricingPlans.find(p => p.id === selectedPlan)?.duration !== '1' ? 's' : ''} / {pricingPlans.find(p => p.id === selectedPlan)?.price.replace('/mt', '')}
          </Text>
        </TouchableOpacity>

        {/* FAQ Section */}
        <View style={styles.faqSection}>
          <Text style={styles.faqQuestion}>When will I be billed?</Text>
          <Text style={styles.faqAnswer}>
            Your iTunes Account will be billed at the end of your trial period if applicable/upon confirmation of your subscription.
          </Text>

          <Text style={styles.faqQuestion}>Does My subscription Auto Renew?</Text>
          <Text style={styles.faqAnswer}>
            Yes. You can disable this at any time with just one tap on the app store.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF3E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustrationContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  illustration: {
    width: 150,
    height: 150,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  personContainer: {
    width: 80,
    height: 100,
    position: 'relative',
  },
  person: {
    width: 60,
    height: 80,
    backgroundColor: '#4A90E2',
    borderRadius: 15,
    position: 'absolute',
    top: 0,
    left: 10,
  },
  phone: {
    width: 20,
    height: 35,
    backgroundColor: '#333',
    borderRadius: 5,
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  sparkle1: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  sparkle2: {
    position: 'absolute',
    top: 40,
    left: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF9800',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  pricingContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 30,
    gap: 10,
  },
  pricingCard: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    position: 'relative',
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedCard: {
    borderColor: '#FF9800',
    backgroundColor: '#FFF8F0',
  },
  recommendedCard: {
    transform: [{ scale: 1.05 }],
  },
  labelContainer: {
    position: 'absolute',
    top: -8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  labelText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  duration: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  period: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  price: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  selectedText: {
    color: '#FF9800',
  },
  subscribeButton: {
    backgroundColor: '#FF9800',
    marginHorizontal: 20,
    paddingVertical: 18,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#FF9800',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  subscribeButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  faqSection: {
    paddingHorizontal: 20,
    marginTop: 40,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 20,
  },
  faqAnswer: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default PremiumScreen;