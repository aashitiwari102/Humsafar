import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, FontSizes, Shadows } from '../../src/constants/theme';
import { CircularProgress } from '../../src/components/CircularProgress';
import { StatsCard } from '../../src/components/StatsCard';
import { PanicButton } from '../../src/components/PanicButton';
import { SafetyTipCard } from '../../src/components/SafetyTipCard';
import { mockUser, mockSafetyTips } from '../../src/services/dummyData';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const user = mockUser;
  const safetyTips = mockSafetyTips.slice(0, 3); // Show only 3 tips

  const getCurrentTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.greetingContainer}>
            <Text style={styles.greeting}>{getCurrentTimeGreeting()}</Text>
            <Text style={styles.userName}>{user.name}</Text>
          </View>
          <View style={styles.locationContainer}>
            <Ionicons name="location" size={16} color={Colors.accent.green} />
            <Text style={styles.location}>{user.currentLocation?.address}</Text>
          </View>
        </View>

        {/* Safety Score Section */}
        <View style={[styles.safetyScoreContainer, Shadows.medium]}>
          <Text style={styles.sectionTitle}>Tourist Safety Score</Text>
          <View style={styles.scoreContent}>
            <CircularProgress
              percentage={user.safetyScore}
              size={120}
              strokeWidth={12}
            />
            <View style={styles.scoreInfo}>
              <Text style={styles.scoreLabel}>Current Status</Text>
              <Text style={[
                styles.scoreStatus,
                { color: user.safetyScore >= 80 ? Colors.accent.green : 
                         user.safetyScore >= 60 ? Colors.status.warning : 
                         Colors.status.danger }
              ]}>
                {user.safetyScore >= 80 ? 'Safe' : 
                 user.safetyScore >= 60 ? 'Moderate' : 'High Risk'}
              </Text>
              <Text style={styles.scoreDescription}>
                Based on location, time, and travel patterns
              </Text>
            </View>
          </View>
        </View>

        {/* Emergency Button */}
        <PanicButton />

        {/* Quick Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Overview</Text>
          <StatsCard
            title="Areas Visited Today"
            value={user.tripStats.areasVisitedToday}
            icon="location-outline"
            color={Colors.primary.blue}
          />
          <StatsCard
            title="Safe Hours Traveled"
            value={`${user.tripStats.safeHours}h`}
            icon="time-outline"
            color={Colors.accent.green}
          />
          <StatsCard
            title="Emergency Contacts Active"
            value={user.emergencyContacts.length}
            icon="people-outline"
            color={Colors.status.warning}
          />
        </View>

        {/* Safety Status Indicators */}
        <View style={[styles.statusContainer, Shadows.small]}>
          <View style={styles.statusRow}>
            <View style={styles.statusItem}>
              <View style={[styles.statusIndicator, { backgroundColor: Colors.accent.green }]} />
              <Text style={styles.statusText}>Safe Zone</Text>
            </View>
            <View style={styles.statusItem}>
              <View style={[styles.statusIndicator, { backgroundColor: Colors.accent.green }]} />
              <Text style={styles.statusText}>Family Tracking ON</Text>
            </View>
          </View>
          <View style={styles.statusRow}>
            <View style={styles.statusItem}>
              <View style={[styles.statusIndicator, { backgroundColor: Colors.accent.green }]} />
              <Text style={styles.statusText}>Auto Alerts Active</Text>
            </View>
            <View style={styles.statusItem}>
              <View style={[styles.statusIndicator, { backgroundColor: Colors.primary.blue }]} />
              <Text style={styles.statusText}>GPS Tracking</Text>
            </View>
          </View>
        </View>

        {/* Safety Tips Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Safety Tips for Your Location</Text>
            <Ionicons name="bulb-outline" size={20} color={Colors.status.warning} />
          </View>
          {safetyTips.map((tip) => (
            <SafetyTipCard key={tip.id} tip={tip} />
          ))}
        </View>

        {/* Bottom Padding for Tab Navigation */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondary.lightGray,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    backgroundColor: Colors.secondary.white,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
    marginBottom: Spacing.md,
  },
  greetingContainer: {
    marginBottom: Spacing.sm,
  },
  greeting: {
    fontSize: FontSizes.md,
    color: Colors.text.secondary,
  },
  userName: {
    fontSize: FontSizes.xxl,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    marginLeft: 4,
    flex: 1,
  },
  safetyScoreContainer: {
    backgroundColor: Colors.secondary.white,
    marginHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  scoreContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  scoreInfo: {
    flex: 1,
    marginLeft: Spacing.lg,
  },
  scoreLabel: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  scoreStatus: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  scoreDescription: {
    fontSize: FontSizes.xs,
    color: Colors.text.light,
    lineHeight: 16,
  },
  section: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  statusContainer: {
    backgroundColor: Colors.secondary.white,
    marginHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: Spacing.sm,
  },
  statusText: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
  },
  bottomPadding: {
    height: 20,
  },
});