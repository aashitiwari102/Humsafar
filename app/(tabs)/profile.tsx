import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Modal,
  Switch,
  Alert,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Spacing, BorderRadius, FontSizes, Shadows, Colors } from '../../src/constants/theme';
import { useTheme } from '../../src/context/ThemeContext';
import { CircularProgress } from '../../src/components/CircularProgress';
import { mockUser } from '../../src/services/dummyData';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const { colors, toggleTheme, isDarkMode } = useTheme();
  const [user, setUser] = useState(mockUser);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिन्दी (Hindi)', flag: '🇮🇳' },
    { code: 'bn', name: 'বাংলা (Bengali)', flag: '🇧🇩' },
    { code: 'te', name: 'తెలుగు (Telugu)', flag: '🇮🇳' },
    { code: 'ta', name: 'தமிழ் (Tamil)', flag: '🇮🇳' },
    { code: 'mr', name: 'मराठी (Marathi)', flag: '🇮🇳' },
    { code: 'gu', name: 'ગુજરાતી (Gujarati)', flag: '🇮🇳' },
  ];

  const privacyOptions = [
    { key: 'minimal', label: 'Minimal', description: 'Share only essential safety information' },
    { key: 'selective', label: 'Selective', description: 'Choose what to share case by case' },
    { key: 'full', label: 'Full Sharing', description: 'Share all data for maximum safety' },
  ];

  const helpItems = [
    { icon: 'help-circle-outline', title: 'FAQs', description: 'Common questions and answers' },
    { icon: 'call-outline', title: 'Emergency Helpline', description: '100 (Police) • 108 (Ambulance)' },
    { icon: 'chatbubble-outline', title: 'Contact Support', description: 'Get help with the app' },
    { icon: 'book-outline', title: 'Safety Guidelines', description: 'Tourist safety best practices' },
  ];

  const getSafetyScoreDescription = (score: number) => {
    if (score >= 90) return 'Excellent - Very safe travel patterns';
    if (score >= 80) return 'Good - Generally safe with minor risks';
    if (score >= 70) return 'Fair - Some safety concerns identified';
    if (score >= 60) return 'Poor - Multiple safety issues detected';
    return 'Critical - Immediate safety attention needed';
  };

  const updateLanguage = (languageCode: string) => {
    setUser(prev => ({
      ...prev,
      preferences: { ...prev.preferences, language: languageCode },
    }));
    setShowLanguageModal(false);
    Alert.alert('Language Updated', 'App language has been changed successfully');
  };

  const updatePrivacySetting = (setting: string) => {
    setUser(prev => ({
      ...prev,
      preferences: { ...prev.preferences, dataSharing: setting as any },
    }));
    setShowPrivacyModal(false);
    Alert.alert('Privacy Updated', 'Data sharing preferences have been updated');
  };

  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity style={styles.editButton}>
            <Ionicons name="pencil-outline" size={20} color={Colors.primary.blue} />
          </TouchableOpacity>
        </View>

        {/* Profile Info */}
        <View style={[styles.profileCard, Shadows.medium]}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <Image
                source={{ uri: user.profileImage || 'https://via.placeholder.com/150' }}
                style={styles.avatar}
              />
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark-circle" size={20} color={Colors.accent.green} />
              </View>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
              <Text style={styles.userPhone}>{user.phone}</Text>
              <Text style={styles.digitalId}>Tourist ID: {user.digitalId}</Text>
            </View>
          </View>
          
          <View style={styles.safetyScoreSection}>
            <Text style={styles.sectionTitle}>Current Safety Score</Text>
            <View style={styles.scoreContainer}>
              <CircularProgress
                percentage={user.safetyScore}
                size={80}
                strokeWidth={8}
              />
              <View style={styles.scoreInfo}>
                <Text style={styles.scoreDescription}>
                  {getSafetyScoreDescription(user.safetyScore)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Trip Statistics */}
        <View style={[styles.section, Shadows.small]}>
          <Text style={styles.sectionTitle}>Trip Statistics</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{user.tripStats.daysTravel}</Text>
              <Text style={styles.statLabel}>Days Traveled</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{user.tripStats.placesVisited}</Text>
              <Text style={styles.statLabel}>Places Visited</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{user.tripStats.safeHours}h</Text>
              <Text style={styles.statLabel}>Safe Hours</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{user.tripStats.areasVisitedToday}</Text>
              <Text style={styles.statLabel}>Areas Today</Text>
            </View>
          </View>
        </View>

        {/* App Preferences */}
        <View style={[styles.section, Shadows.small]}>
          <Text style={styles.sectionTitle}>App Preferences</Text>
          
          <TouchableOpacity
            style={styles.preferenceItem}
            onPress={() => setShowLanguageModal(true)}
          >
            <View style={styles.preferenceLeft}>
              <Ionicons name="language-outline" size={20} color={Colors.primary.blue} />
              <View style={styles.preferenceInfo}>
                <Text style={styles.preferenceName}>Language</Text>
                <Text style={styles.preferenceValue}>
                  {languages.find(lang => lang.code === user.preferences.language)?.name || 'English'}
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.text.light} />
          </TouchableOpacity>

          <View style={styles.preferenceItem}>
            <View style={styles.preferenceLeft}>
              <Ionicons name="notifications-outline" size={20} color={colors.primary.blue} />
              <View style={styles.preferenceInfo}>
                <Text style={[styles.preferenceName, { color: colors.text.primary }]}>Notifications</Text>
                <Text style={[styles.preferenceValue, { color: colors.text.secondary }]}>Safety alerts and updates</Text>
              </View>
            </View>
            <Switch
              value={user.preferences.notifications}
              onValueChange={(value) =>
                setUser(prev => ({
                  ...prev,
                  preferences: { ...prev.preferences, notifications: value },
                }))
              }
              trackColor={{ false: colors.secondary.gray, true: colors.accent.green }}
              thumbColor={colors.secondary.white}
            />
          </View>

          <View style={styles.preferenceItem}>
            <View style={styles.preferenceLeft}>
              <Ionicons 
                name={isDarkMode ? "moon" : "sunny"} 
                size={20} 
                color={colors.primary.blue} 
              />
              <View style={styles.preferenceInfo}>
                <Text style={[styles.preferenceName, { color: colors.text.primary }]}>Dark Mode</Text>
                <Text style={[styles.preferenceValue, { color: colors.text.secondary }]}>
                  {isDarkMode ? 'Dark theme enabled' : 'Light theme enabled'}
                </Text>
              </View>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.secondary.gray, true: colors.accent.green }}
              thumbColor={colors.secondary.white}
            />
          </View>

          <TouchableOpacity
            style={styles.preferenceItem}
            onPress={() => setShowPrivacyModal(true)}
          >
            <View style={styles.preferenceLeft}>
              <Ionicons name="shield-outline" size={20} color={Colors.primary.blue} />
              <View style={styles.preferenceInfo}>
                <Text style={styles.preferenceName}>Data Privacy</Text>
                <Text style={styles.preferenceValue}>
                  {user.preferences.dataSharing.charAt(0).toUpperCase() + 
                   user.preferences.dataSharing.slice(1)} sharing
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.text.light} />
          </TouchableOpacity>
        </View>

        {/* Emergency Information */}
        <View style={[styles.section, Shadows.small]}>
          <Text style={styles.sectionTitle}>Emergency Information</Text>
          
          <View style={styles.emergencyItem}>
            <Ionicons name="medical-outline" size={20} color={Colors.status.danger} />
            <View style={styles.emergencyInfo}>
              <Text style={styles.emergencyLabel}>Blood Type</Text>
              <Text style={styles.emergencyValue}>O+ (Add in settings)</Text>
            </View>
          </View>
          
          <View style={styles.emergencyItem}>
            <Ionicons name="fitness-outline" size={20} color={Colors.status.danger} />
            <View style={styles.emergencyInfo}>
              <Text style={styles.emergencyLabel}>Medical Conditions</Text>
              <Text style={styles.emergencyValue}>None reported</Text>
            </View>
          </View>
          
          <View style={styles.emergencyItem}>
            <Ionicons name="warning-outline" size={20} color={Colors.status.danger} />
            <View style={styles.emergencyInfo}>
              <Text style={styles.emergencyLabel}>Allergies</Text>
              <Text style={styles.emergencyValue}>None reported</Text>
            </View>
          </View>
        </View>

        {/* Support & Help */}
        <View style={[styles.section, Shadows.small]}>
          <Text style={styles.sectionTitle}>Support & Help</Text>
          {helpItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.helpItem}>
              <View style={styles.helpLeft}>
                <Ionicons name={item.icon as any} size={20} color={Colors.primary.blue} />
                <View style={styles.helpInfo}>
                  <Text style={styles.helpTitle}>{item.title}</Text>
                  <Text style={styles.helpDescription}>{item.description}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.text.light} />
            </TouchableOpacity>
          ))}
        </View>

        {/* App Version */}
        <View style={[styles.section, Shadows.small]}>
          <View style={styles.versionContainer}>
            <Text style={styles.versionText}>HumSafar v1.0.0</Text>
            <Text style={styles.versionSubtext}>
              Made with ❤️ for tourist safety in India
            </Text>
          </View>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Language Selection Modal */}
      <Modal
        visible={showLanguageModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Language</Text>
              <TouchableOpacity onPress={() => setShowLanguageModal(false)}>
                <Ionicons name="close" size={24} color={Colors.text.secondary} />
              </TouchableOpacity>
            </View>
            
            {languages.map((language) => (
              <TouchableOpacity
                key={language.code}
                style={[
                  styles.languageOption,
                  user.preferences.language === language.code && styles.languageOptionSelected
                ]}
                onPress={() => updateLanguage(language.code)}
              >
                <Text style={styles.languageFlag}>{language.flag}</Text>
                <Text style={[
                  styles.languageName,
                  user.preferences.language === language.code && styles.languageNameSelected
                ]}>
                  {language.name}
                </Text>
                {user.preferences.language === language.code && (
                  <Ionicons name="checkmark" size={20} color={Colors.primary.blue} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* Privacy Settings Modal */}
      <Modal
        visible={showPrivacyModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPrivacyModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Data Privacy Settings</Text>
              <TouchableOpacity onPress={() => setShowPrivacyModal(false)}>
                <Ionicons name="close" size={24} color={Colors.text.secondary} />
              </TouchableOpacity>
            </View>
            
            {privacyOptions.map((option) => (
              <TouchableOpacity
                key={option.key}
                style={[
                  styles.privacyOption,
                  user.preferences.dataSharing === option.key && styles.privacyOptionSelected
                ]}
                onPress={() => updatePrivacySetting(option.key)}
              >
                <View style={styles.privacyOptionContent}>
                  <Text style={[
                    styles.privacyOptionTitle,
                    user.preferences.dataSharing === option.key && styles.privacyOptionTitleSelected
                  ]}>
                    {option.label}
                  </Text>
                  <Text style={styles.privacyOptionDescription}>
                    {option.description}
                  </Text>
                </View>
                {user.preferences.dataSharing === option.key && (
                  <Ionicons name="checkmark" size={20} color={Colors.primary.blue} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.secondary.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    backgroundColor: colors.secondary.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
    marginBottom: Spacing.md,
  },
  headerTitle: {
    fontSize: FontSizes.xxl,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  editButton: {
    padding: Spacing.sm,
  },
  profileCard: {
    backgroundColor: colors.secondary.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: Spacing.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.secondary.lightGray,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.secondary.white,
    borderRadius: 12,
    padding: 2,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: FontSizes.sm,
    color: colors.text.secondary,
    marginBottom: 2,
  },
  userPhone: {
    fontSize: FontSizes.sm,
    color: colors.text.secondary,
    marginBottom: 2,
  },
  digitalId: {
    fontSize: FontSizes.xs,
    color: colors.primary.blue,
    fontWeight: '500',
  },
  safetyScoreSection: {
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.secondary.lightGray,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  scoreInfo: {
    flex: 1,
    marginLeft: Spacing.lg,
  },
  scoreDescription: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    lineHeight: 18,
  },
  section: {
    backgroundColor: colors.secondary.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: Spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: (width - Spacing.lg * 4) / 2,
    alignItems: 'center',
    paddingVertical: Spacing.md,
    marginBottom: Spacing.sm,
  },
  statNumber: {
    fontSize: FontSizes.xxl,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.secondary.lightGray,
  },
  preferenceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  preferenceInfo: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  preferenceName: {
    fontSize: FontSizes.md,
    fontWeight: '500',
    color: Colors.text.primary,
    marginBottom: 2,
  },
  preferenceValue: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
  },
  emergencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.secondary.lightGray,
  },
  emergencyInfo: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  emergencyLabel: {
    fontSize: FontSizes.md,
    fontWeight: '500',
    color: Colors.text.primary,
    marginBottom: 2,
  },
  emergencyValue: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
  },
  helpItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.secondary.lightGray,
  },
  helpLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  helpInfo: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  helpTitle: {
    fontSize: FontSizes.md,
    fontWeight: '500',
    color: Colors.text.primary,
    marginBottom: 2,
  },
  helpDescription: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  versionText: {
    fontSize: FontSizes.md,
    color: Colors.text.secondary,
    fontWeight: '500',
    marginBottom: 4,
  },
  versionSubtext: {
    fontSize: FontSizes.sm,
    color: Colors.text.light,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.secondary.white,
    borderTopLeftRadius: BorderRadius.lg,
    borderTopRightRadius: BorderRadius.lg,
    padding: Spacing.lg,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.secondary.lightGray,
  },
  modalTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.secondary.lightGray,
  },
  languageOptionSelected: {
    backgroundColor: Colors.primary.blue + '10',
  },
  languageFlag: {
    fontSize: FontSizes.xl,
    marginRight: Spacing.md,
  },
  languageName: {
    flex: 1,
    fontSize: FontSizes.md,
    color: Colors.text.secondary,
  },
  languageNameSelected: {
    color: Colors.primary.blue,
    fontWeight: '500',
  },
  privacyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.secondary.lightGray,
  },
  privacyOptionSelected: {
    backgroundColor: Colors.primary.blue + '10',
  },
  privacyOptionContent: {
    flex: 1,
  },
  privacyOptionTitle: {
    fontSize: FontSizes.md,
    fontWeight: '500',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  privacyOptionTitleSelected: {
    color: Colors.primary.blue,
  },
  privacyOptionDescription: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    lineHeight: 18,
  },
  bottomPadding: {
    height: 20,
  },
});