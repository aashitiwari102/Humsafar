import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Switch,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, FontSizes, Shadows } from '../../src/constants/theme';
import { mockUser, mockSafetyAlerts } from '../../src/services/dummyData';
import { EmergencyContact, TravelItinerary } from '../../src/types';

export default function SafetyScreen() {
  const [user, setUser] = useState(mockUser);
  const [showAddContact, setShowAddContact] = useState(false);
  const [showAddItinerary, setShowAddItinerary] = useState(false);
  const [newContact, setNewContact] = useState<Partial<EmergencyContact>>({});
  const [newItinerary, setNewItinerary] = useState<Partial<TravelItinerary>>({});

  const getGeofenceStatus = () => {
    return { zone: 'Safe Zone', color: Colors.accent.green, icon: 'shield-checkmark' };
  };

  const getLocationStatus = () => {
    const lastUpdate = new Date(user.currentLocation?.timestamp || new Date());
    const timeDiff = Date.now() - lastUpdate.getTime();
    const minutesAgo = Math.floor(timeDiff / (1000 * 60));
    return `Updated ${minutesAgo} minutes ago`;
  };

  const addEmergencyContact = () => {
    if (newContact.name && newContact.phone && newContact.relationship) {
      const contact: EmergencyContact = {
        id: Date.now().toString(),
        name: newContact.name,
        phone: newContact.phone,
        relationship: newContact.relationship,
      };
      setUser(prev => ({
        ...prev,
        emergencyContacts: [...prev.emergencyContacts, contact],
      }));
      setNewContact({});
      setShowAddContact(false);
      Alert.alert('Success', 'Emergency contact added successfully');
    } else {
      Alert.alert('Error', 'Please fill in all fields');
    }
  };

  const addTravelItinerary = () => {
    if (newItinerary.destination && newItinerary.expectedArrival) {
      const itinerary: TravelItinerary = {
        id: Date.now().toString(),
        destination: newItinerary.destination,
        expectedArrival: newItinerary.expectedArrival,
        status: 'pending',
      };
      setUser(prev => ({
        ...prev,
        travelItinerary: [...prev.travelItinerary, itinerary],
      }));
      setNewItinerary({});
      setShowAddItinerary(false);
      Alert.alert('Success', 'Travel destination added successfully');
    } else {
      Alert.alert('Error', 'Please fill in all fields');
    }
  };

  const geofenceStatus = getGeofenceStatus();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Safety Monitoring</Text>
          <View style={styles.liveIndicator}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        </View>

        {/* Real-time Location Tracker */}
        <View style={[styles.card, Shadows.medium]}>
          <Text style={styles.cardTitle}>Real-time Location</Text>
          <View style={styles.locationInfo}>
            <View style={styles.coordinatesContainer}>
              <Text style={styles.coordinates}>
                {user.currentLocation?.latitude.toFixed(4)}°N, {user.currentLocation?.longitude.toFixed(4)}°E
              </Text>
              <Text style={styles.locationUpdate}>{getLocationStatus()}</Text>
            </View>
            <TouchableOpacity style={styles.refreshButton}>
              <Ionicons name="refresh" size={20} color={Colors.primary.blue} />
            </TouchableOpacity>
          </View>
          <Text style={styles.address}>{user.currentLocation?.address}</Text>
        </View>

        {/* Geo-fence Status */}
        <View style={[styles.card, Shadows.medium]}>
          <Text style={styles.cardTitle}>Geo-fence Status</Text>
          <View style={styles.geofenceContainer}>
            <View style={[styles.geofenceIndicator, { backgroundColor: geofenceStatus.color }]}>
              <Ionicons name={geofenceStatus.icon as any} size={24} color={Colors.secondary.white} />
            </View>
            <View style={styles.geofenceInfo}>
              <Text style={[styles.geofenceZone, { color: geofenceStatus.color }]}>
                {geofenceStatus.zone}
              </Text>
              <Text style={styles.geofenceDescription}>
                You are currently in a monitored safe area with active security presence.
              </Text>
            </View>
          </View>
        </View>

        {/* Emergency Contacts */}
        <View style={[styles.card, Shadows.medium]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Emergency Contacts</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowAddContact(true)}
            >
              <Ionicons name="add" size={20} color={Colors.primary.blue} />
            </TouchableOpacity>
          </View>
          {user.emergencyContacts.map((contact) => (
            <View key={contact.id} style={styles.contactItem}>
              <View style={styles.contactInfo}>
                <Text style={styles.contactName}>{contact.name}</Text>
                <Text style={styles.contactRelation}>{contact.relationship}</Text>
              </View>
              <TouchableOpacity style={styles.callButton}>
                <Ionicons name="call" size={18} color={Colors.accent.green} />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Travel Itinerary */}
        <View style={[styles.card, Shadows.medium]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Travel Itinerary</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowAddItinerary(true)}
            >
              <Ionicons name="add" size={20} color={Colors.primary.blue} />
            </TouchableOpacity>
          </View>
          {user.travelItinerary.map((item) => (
            <View key={item.id} style={styles.itineraryItem}>
              <View style={styles.itineraryInfo}>
                <Text style={styles.destination}>{item.destination}</Text>
                <Text style={styles.arrivalTime}>
                  Expected: {item.expectedArrival.toLocaleTimeString()}
                </Text>
              </View>
              <View style={[
                styles.statusBadge,
                { backgroundColor: item.status === 'pending' ? Colors.status.warning : Colors.accent.green }
              ]}>
                <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Safety Preferences */}
        <View style={[styles.card, Shadows.medium]}>
          <Text style={styles.cardTitle}>Safety Preferences</Text>
          <View style={styles.preferenceItem}>
            <View style={styles.preferenceInfo}>
              <Text style={styles.preferenceName}>Family Tracking</Text>
              <Text style={styles.preferenceDescription}>Share location with family members</Text>
            </View>
            <Switch
              value={user.preferences.familyTracking}
              onValueChange={(value) =>
                setUser(prev => ({
                  ...prev,
                  preferences: { ...prev.preferences, familyTracking: value },
                }))
              }
              trackColor={{ false: Colors.secondary.gray, true: Colors.accent.green }}
              thumbColor={Colors.secondary.white}
            />
          </View>
          <View style={styles.preferenceItem}>
            <View style={styles.preferenceInfo}>
              <Text style={styles.preferenceName}>Automatic Alerts</Text>
              <Text style={styles.preferenceDescription}>Send alerts for unusual activity</Text>
            </View>
            <Switch
              value={user.preferences.automaticAlerts}
              onValueChange={(value) =>
                setUser(prev => ({
                  ...prev,
                  preferences: { ...prev.preferences, automaticAlerts: value },
                }))
              }
              trackColor={{ false: Colors.secondary.gray, true: Colors.accent.green }}
              thumbColor={Colors.secondary.white}
            />
          </View>
        </View>

        {/* Recent Alerts */}
        <View style={[styles.card, Shadows.medium]}>
          <Text style={styles.cardTitle}>Recent Safety Alerts</Text>
          {mockSafetyAlerts.map((alert) => (
            <View key={alert.id} style={styles.alertItem}>
              <View style={[
                styles.alertIcon,
                {
                  backgroundColor: alert.type === 'danger' ? Colors.status.danger :
                                 alert.type === 'warning' ? Colors.status.warning :
                                 Colors.status.info
                }
              ]}>
                <Ionicons
                  name={alert.type === 'danger' ? 'alert-circle' :
                        alert.type === 'warning' ? 'warning' : 'information-circle'}
                  size={16}
                  color={Colors.secondary.white}
                />
              </View>
              <View style={styles.alertContent}>
                <Text style={styles.alertTitle}>{alert.title}</Text>
                <Text style={styles.alertMessage}>{alert.message}</Text>
                <Text style={styles.alertTime}>
                  {alert.timestamp.toLocaleTimeString()}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Add Contact Modal */}
      <Modal
        visible={showAddContact}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddContact(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Emergency Contact</Text>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={newContact.name || ''}
              onChangeText={(text) => setNewContact(prev => ({ ...prev, name: text }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              value={newContact.phone || ''}
              onChangeText={(text) => setNewContact(prev => ({ ...prev, phone: text }))}
              keyboardType="phone-pad"
            />
            <TextInput
              style={styles.input}
              placeholder="Relationship"
              value={newContact.relationship || ''}
              onChangeText={(text) => setNewContact(prev => ({ ...prev, relationship: text }))}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowAddContact(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={addEmergencyContact}
              >
                <Text style={styles.saveButtonText}>Add Contact</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add Itinerary Modal */}
      <Modal
        visible={showAddItinerary}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddItinerary(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Travel Destination</Text>
            <TextInput
              style={styles.input}
              placeholder="Destination"
              value={newItinerary.destination || ''}
              onChangeText={(text) => setNewItinerary(prev => ({ ...prev, destination: text }))}
            />
            <TouchableOpacity
              style={styles.input}
              onPress={() => {
                const now = new Date();
                now.setHours(now.getHours() + 2);
                setNewItinerary(prev => ({ ...prev, expectedArrival: now }));
              }}
            >
              <Text style={styles.inputText}>
                {newItinerary.expectedArrival ?
                  newItinerary.expectedArrival.toLocaleString() :
                  'Select Expected Arrival Time'
                }
              </Text>
            </TouchableOpacity>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowAddItinerary(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={addTravelItinerary}
              >
                <Text style={styles.saveButtonText}>Add Destination</Text>
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
    color: Colors.text.primary,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.status.danger,
    marginRight: Spacing.xs,
  },
  liveText: {
    fontSize: FontSizes.xs,
    fontWeight: 'bold',
    color: Colors.status.danger,
  },
  card: {
    backgroundColor: Colors.secondary.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  cardTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  coordinatesContainer: {
    flex: 1,
  },
  coordinates: {
    fontSize: FontSizes.md,
    fontWeight: '500',
    color: Colors.text.primary,
  },
  locationUpdate: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  refreshButton: {
    padding: Spacing.sm,
  },
  address: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    marginTop: Spacing.sm,
  },
  geofenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  geofenceIndicator: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  geofenceInfo: {
    flex: 1,
  },
  geofenceZone: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    marginBottom: 4,
  },
  geofenceDescription: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    lineHeight: 18,
  },
  addButton: {
    padding: Spacing.sm,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.secondary.lightGray,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: FontSizes.md,
    fontWeight: '500',
    color: Colors.text.primary,
  },
  contactRelation: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
  },
  callButton: {
    padding: Spacing.sm,
  },
  itineraryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.secondary.lightGray,
  },
  itineraryInfo: {
    flex: 1,
  },
  destination: {
    fontSize: FontSizes.md,
    fontWeight: '500',
    color: Colors.text.primary,
  },
  arrivalTime: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  statusText: {
    fontSize: FontSizes.xs,
    fontWeight: 'bold',
    color: Colors.secondary.white,
  },
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.secondary.lightGray,
  },
  preferenceInfo: {
    flex: 1,
  },
  preferenceName: {
    fontSize: FontSizes.md,
    fontWeight: '500',
    color: Colors.text.primary,
  },
  preferenceDescription: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.secondary.lightGray,
  },
  alertIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: FontSizes.md,
    fontWeight: '500',
    color: Colors.text.primary,
    marginBottom: 2,
  },
  alertMessage: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    lineHeight: 18,
    marginBottom: 4,
  },
  alertTime: {
    fontSize: FontSizes.xs,
    color: Colors.text.light,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.secondary.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.secondary.gray,
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    fontSize: FontSizes.md,
    color: Colors.text.primary,
  },
  inputText: {
    fontSize: FontSizes.md,
    color: Colors.text.secondary,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.md,
  },
  modalButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    marginHorizontal: Spacing.xs,
  },
  cancelButton: {
    backgroundColor: Colors.secondary.lightGray,
  },
  saveButton: {
    backgroundColor: Colors.primary.blue,
  },
  cancelButtonText: {
    fontSize: FontSizes.md,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  saveButtonText: {
    fontSize: FontSizes.md,
    color: Colors.secondary.white,
    fontWeight: '500',
  },
  bottomPadding: {
    height: 20,
  },
});