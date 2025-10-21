import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Modal,
  FlatList,
} from 'react-native';
import MapView, { Marker, Polygon, Heatmap, Circle, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { Colors, Spacing, BorderRadius, FontSizes, Shadows } from '../../src/constants/theme';
import { 
  mockUser, 
  mockGeofenceZones, 
  mockCircularGeofenceZones,
  mockTouristDensityData, 
  mockNearbyServices,
  mockDangerZoneData
} from '../../src/services/dummyData';

type FilterType = 'all' | 'hospitals' | 'police' | 'attractions';

export default function MapScreen() {
  const [location, setLocation] = useState(mockUser.currentLocation);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterType[]>(['all']);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showGeofences, setShowGeofences] = useState(true);
  const [showTourists, setShowTourists] = useState(true);
  const [showDangerZones, setShowDangerZones] = useState(true);
  const [showCircularGeofences, setShowCircularGeofences] = useState(true);

  const filters = [
    { key: 'all' as FilterType, label: 'All Services', icon: 'map-outline' },
    { key: 'hospitals' as FilterType, label: 'Hospitals', icon: 'medical-outline' },
    { key: 'police' as FilterType, label: 'Police Stations', icon: 'shield-outline' },
    { key: 'attractions' as FilterType, label: 'Attractions', icon: 'camera-outline' },
  ];

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Location permission is required for this feature');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        address: 'Current Location',
        timestamp: new Date(),
      });
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const getFilteredServices = () => {
    if (activeFilters.includes('all')) {
      return mockNearbyServices;
    }
    
    return mockNearbyServices.filter(service => {
      if (activeFilters.includes('hospitals') && service.type === 'hospital') return true;
      if (activeFilters.includes('police') && service.type === 'police') return true;
      if (activeFilters.includes('attractions') && service.type === 'attraction') return true;
      return false;
    });
  };

  const toggleFilter = (filter: FilterType) => {
    if (filter === 'all') {
      setActiveFilters(['all']);
    } else {
      const newFilters = activeFilters.includes(filter)
        ? activeFilters.filter(f => f !== filter)
        : [...activeFilters.filter(f => f !== 'all'), filter];
      
      setActiveFilters(newFilters.length === 0 ? ['all'] : newFilters);
    }
  };

  const getMarkerColor = (type: string) => {
    switch (type) {
      case 'hospital':
        return Colors.status.danger;
      case 'police':
        return Colors.primary.blue;
      case 'attraction':
        return Colors.accent.green;
      default:
        return Colors.secondary.gray;
    }
  };

  const getMarkerIcon = (type: string) => {
    switch (type) {
      case 'hospital':
        return 'medical';
      case 'police':
        return 'shield';
      case 'attraction':
        return 'camera';
      default:
        return 'location';
    }
  };

  const getGeofenceColor = (type: string) => {
    switch (type) {
      case 'safe':
        return Colors.accent.green + '40';
      case 'warning':
        return Colors.status.warning + '40';
      case 'restricted':
        return Colors.status.danger + '40';
      default:
        return Colors.secondary.gray + '40';
    }
  };

  const getGeofenceStrokeColor = (type: string) => {
    switch (type) {
      case 'safe':
        return Colors.accent.green;
      case 'warning':
        return Colors.status.warning;
      case 'restricted':
        return Colors.status.danger;
      default:
        return Colors.secondary.gray;
    }
  };

  const heatmapPoints = mockTouristDensityData.map(point => ({
    latitude: point.latitude,
    longitude: point.longitude,
    weight: point.count / 100, // Normalize weight
  }));

  // Danger zone heatmap points with higher visibility
  const dangerZonePoints = mockDangerZoneData.map(point => ({
    latitude: point.latitude,
    longitude: point.longitude,
    weight: point.weight,
  }));

  // Convert circular geofences to large heatmap circles like the reference image
  const circularGeofenceHeatmapPoints = mockCircularGeofenceZones.map(zone => {
    const baseWeight = zone.riskLevel === 'high' ? 1.0 : zone.riskLevel === 'medium' ? 0.8 : 0.5;
    const points = [];
    
    // Create concentric circles for better heatmap effect
    const radiusInDegrees = zone.radius * 0.000009; // Convert meters to degrees
    const numRings = 4; // Number of concentric circles
    const pointsPerRing = 12; // Points per ring
    
    // Center point with maximum weight
    points.push({
      latitude: zone.center.latitude,
      longitude: zone.center.longitude,
      weight: baseWeight,
    });
    
    // Create concentric rings
    for (let ring = 1; ring <= numRings; ring++) {
      const ringRadius = (radiusInDegrees * ring) / numRings;
      const ringWeight = baseWeight * (1 - (ring - 1) / numRings * 0.7); // Decrease weight towards edges
      
      for (let point = 0; point < pointsPerRing; point++) {
        const angle = (point / pointsPerRing) * 2 * Math.PI;
        const lat = zone.center.latitude + Math.cos(angle) * ringRadius;
        const lng = zone.center.longitude + Math.sin(angle) * ringRadius;
        
        points.push({
          latitude: lat,
          longitude: lng,
          weight: ringWeight,
        });
      }
    }
    
    // Add extra density points for smoother gradient
    const densityPoints = 8;
    for (let i = 0; i < densityPoints; i++) {
      const angle = (i / densityPoints) * 2 * Math.PI;
      const distance = radiusInDegrees * 0.3; // Inner area
      const lat = zone.center.latitude + Math.cos(angle) * distance;
      const lng = zone.center.longitude + Math.sin(angle) * distance;
      
      points.push({
        latitude: lat,
        longitude: lng,
        weight: baseWeight * 0.9,
      });
    }
    
    return points;
  }).flat();

  if (!location) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Ionicons name="location-outline" size={64} color={Colors.text.light} />
          <Text style={styles.loadingText}>Loading map...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
        showsUserLocation
        showsMyLocationButton={false}
        showsCompass={false}
        toolbarEnabled={false}
      >
        {/* Current Location Marker */}
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          title="You are here"
          description={location.address}
        >
          <View style={styles.userMarker}>
            <View style={styles.userMarkerInner} />
          </View>
        </Marker>

        {/* Service Markers */}
        {getFilteredServices().map((service) => (
          <Marker
            key={service.id}
            coordinate={{
              latitude: service.location.latitude,
              longitude: service.location.longitude,
            }}
            title={service.name}
            description={`${service.distance} • ${service.phone}`}
          >
            <View style={[styles.serviceMarker, { backgroundColor: getMarkerColor(service.type) }]}>
              <Ionicons
                name={getMarkerIcon(service.type) as any}
                size={16}
                color={Colors.secondary.white}
              />
            </View>
          </Marker>
        ))}

        {/* Tourist Density Heatmap */}
        {showHeatmap && heatmapPoints.length > 0 && (
          <Heatmap
            points={heatmapPoints}
            opacity={0.4}
            radius={40}
            maxIntensity={1}
            gradientSmoothing={10}
            heatmapMode="POINTS_DENSITY"
          />
        )}

        {/* Danger Zone Heatmap - More prominent */}
        {showDangerZones && dangerZonePoints.length > 0 && (
          <Heatmap
            points={dangerZonePoints}
            opacity={0.8}
            radius={80}
            maxIntensity={1}
            gradientSmoothing={5}
            heatmapMode="POINTS_WEIGHT"
            gradient={{
              colors: ['rgba(255, 0, 0, 0)', 'rgba(255, 165, 0, 0.5)', 'rgba(255, 0, 0, 0.8)'],
              startPoints: [0.0, 0.5, 1.0],
              colorMapSize: 256,
            }}
          />
        )}

        {/* Circular Geofence Zone Heatmaps - Large visible danger zones */}
        {showCircularGeofences && circularGeofenceHeatmapPoints.length > 0 && (
          <Heatmap
            points={circularGeofenceHeatmapPoints}
            opacity={0.8}
            radius={120}
            maxIntensity={1}
            gradientSmoothing={10}
            heatmapMode="POINTS_WEIGHT"
            gradient={{
              colors: [
                'rgba(0, 0, 255, 0)',      // Transparent blue (outermost)
                'rgba(0, 150, 255, 0.3)',  // Light blue
                'rgba(0, 255, 0, 0.5)',    // Green
                'rgba(255, 255, 0, 0.7)',  // Yellow
                'rgba(255, 150, 0, 0.8)',  // Orange
                'rgba(255, 0, 0, 0.9)'     // Red (center)
              ],
              startPoints: [0.0, 0.2, 0.4, 0.6, 0.8, 1.0],
              colorMapSize: 512,
            }}
          />
        )}

        {/* Circular Geofence Markers with Info */}
        {showCircularGeofences && mockCircularGeofenceZones.map((zone) => (
          <Marker
            key={`geofence-${zone.id}`}
            coordinate={{
              latitude: zone.center.latitude,
              longitude: zone.center.longitude,
            }}
            title={zone.name}
            description={zone.description}
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <View style={[
              styles.geofenceMarker,
              {
                backgroundColor: zone.riskLevel === 'high' ? Colors.status.danger :
                               zone.riskLevel === 'medium' ? Colors.status.warning :
                               Colors.accent.green
              }
            ]}>
              <Ionicons
                name="warning"
                size={14}
                color={Colors.secondary.white}
              />
            </View>
          </Marker>
        ))}


        {/* Other Tourists (Anonymous) */}
        {showTourists && mockTouristDensityData.map((point, index) => (
          <Marker
            key={`tourist-${index}`}
            coordinate={{
              latitude: point.latitude + (Math.random() - 0.5) * 0.001,
              longitude: point.longitude + (Math.random() - 0.5) * 0.001,
            }}
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <View style={styles.touristDot} />
          </Marker>
        ))}
      </MapView>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Safety Map</Text>
          <Text style={styles.headerSubtitle}>
            {showGeofences && 'Safe Zone • '}
            {mockNearbyServices.length} services nearby
          </Text>
        </View>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={getCurrentLocation}
        >
          <Ionicons name="refresh" size={20} color={Colors.primary.blue} />
        </TouchableOpacity>
      </View>

      {/* Filter Button */}
      <TouchableOpacity
        style={[styles.filterButton, Shadows.medium]}
        onPress={() => setShowFilters(true)}
      >
        <Ionicons name="options-outline" size={20} color={Colors.secondary.white} />
        <Text style={styles.filterButtonText}>Filters</Text>
      </TouchableOpacity>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity
          style={[styles.actionButton, Shadows.small]}
          onPress={getCurrentLocation}
        >
          <Ionicons name="locate" size={20} color={Colors.primary.blue} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, Shadows.small]}
          onPress={() => setShowHeatmap(!showHeatmap)}
        >
          <Ionicons
            name={showHeatmap ? 'eye' : 'eye-off'}
            size={20}
            color={showHeatmap ? Colors.accent.green : Colors.secondary.gray}
          />
        </TouchableOpacity>
      </View>

      {/* Legend */}
      <View style={[styles.legend, Shadows.small]}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: Colors.status.danger }]} />
          <Text style={styles.legendText}>High Risk Areas</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: Colors.status.warning }]} />
          <Text style={styles.legendText}>Medium Risk Areas</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: Colors.accent.green }]} />
          <Text style={styles.legendText}>Low Risk Areas</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: Colors.primary.blue, opacity: 0.6 }]} />
          <Text style={styles.legendText}>Tourist Density</Text>
        </View>
      </View>

      {/* Filter Modal */}
      <Modal
        visible={showFilters}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFilters(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.filterModal}>
            <View style={styles.filterHeader}>
              <Text style={styles.filterTitle}>Map Filters</Text>
              <TouchableOpacity onPress={() => setShowFilters(false)}>
                <Ionicons name="close" size={24} color={Colors.text.secondary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>Services</Text>
            <FlatList
              data={filters}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.filterOption,
                    activeFilters.includes(item.key) && styles.filterOptionActive
                  ]}
                  onPress={() => toggleFilter(item.key)}
                >
                  <Ionicons
                    name={item.icon as any}
                    size={20}
                    color={activeFilters.includes(item.key) ? Colors.primary.blue : Colors.text.secondary}
                  />
                  <Text style={[
                    styles.filterOptionText,
                    activeFilters.includes(item.key) && styles.filterOptionTextActive
                  ]}>
                    {item.label}
                  </Text>
                  {activeFilters.includes(item.key) && (
                    <Ionicons name="checkmark" size={20} color={Colors.primary.blue} />
                  )}
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.key}
            />

            <Text style={styles.sectionTitle}>Map Layers</Text>
            <TouchableOpacity
              style={styles.filterOption}
              onPress={() => setShowCircularGeofences(!showCircularGeofences)}
            >
              <Ionicons
                name="location-outline"
                size={20}
                color={showCircularGeofences ? Colors.status.danger : Colors.text.secondary}
              />
              <Text style={[
                styles.filterOptionText,
                showCircularGeofences && { color: Colors.status.danger, fontWeight: '500' }
              ]}>
                Restricted Areas
              </Text>
              {showCircularGeofences && (
                <Ionicons name="checkmark" size={20} color={Colors.status.danger} />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.filterOption}
              onPress={() => setShowHeatmap(!showHeatmap)}
            >
              <Ionicons
                name="analytics-outline"
                size={20}
                color={showHeatmap ? Colors.primary.blue : Colors.text.secondary}
              />
              <Text style={[
                styles.filterOptionText,
                showHeatmap && styles.filterOptionTextActive
              ]}>
                Tourist Density
              </Text>
              {showHeatmap && (
                <Ionicons name="checkmark" size={20} color={Colors.primary.blue} />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.filterOption}
              onPress={() => setShowTourists(!showTourists)}
            >
              <Ionicons
                name="people-outline"
                size={20}
                color={showTourists ? Colors.primary.blue : Colors.text.secondary}
              />
              <Text style={[
                styles.filterOptionText,
                showTourists && styles.filterOptionTextActive
              ]}>
                Other Tourists
              </Text>
              {showTourists && (
                <Ionicons name="checkmark" size={20} color={Colors.primary.blue} />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.filterOption}
              onPress={() => setShowDangerZones(!showDangerZones)}
            >
              <Ionicons
                name="warning-outline"
                size={20}
                color={showDangerZones ? Colors.status.danger : Colors.text.secondary}
              />
              <Text style={[
                styles.filterOptionText,
                showDangerZones && { color: Colors.status.danger, fontWeight: '500' }
              ]}>
                Danger Zones
              </Text>
              {showDangerZones && (
                <Ionicons name="checkmark" size={20} color={Colors.status.danger} />
              )}
            </TouchableOpacity>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: FontSizes.lg,
    color: Colors.text.secondary,
    marginTop: Spacing.md,
  },
  map: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 50,
    left: Spacing.lg,
    right: Spacing.lg,
    backgroundColor: Colors.secondary.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...Shadows.medium,
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
  },
  refreshButton: {
    padding: Spacing.sm,
  },
  filterButton: {
    position: 'absolute',
    top: 120,
    right: Spacing.lg,
    backgroundColor: Colors.primary.blue,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  filterButtonText: {
    color: Colors.secondary.white,
    fontSize: FontSizes.sm,
    fontWeight: '500',
    marginLeft: Spacing.xs,
  },
  quickActions: {
    position: 'absolute',
    bottom: 120,
    right: Spacing.lg,
  },
  actionButton: {
    backgroundColor: Colors.secondary.white,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  legend: {
    position: 'absolute',
    bottom: 120,
    left: Spacing.lg,
    backgroundColor: Colors.secondary.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: Spacing.sm,
  },
  legendText: {
    fontSize: FontSizes.xs,
    color: Colors.text.secondary,
  },
  userMarker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.primary.blue,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.secondary.white,
  },
  userMarkerInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.secondary.white,
  },
  serviceMarker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.secondary.white,
  },
  touristDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.secondary.gray,
    opacity: 0.6,
  },
  geofenceMarker: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.secondary.white,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  filterModal: {
    backgroundColor: Colors.secondary.white,
    borderTopLeftRadius: BorderRadius.lg,
    borderTopRightRadius: BorderRadius.lg,
    padding: Spacing.lg,
    maxHeight: '80%',
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.secondary.lightGray,
  },
  filterTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  sectionTitle: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.text.primary,
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.secondary.lightGray,
  },
  filterOptionActive: {
    backgroundColor: Colors.primary.blue + '10',
  },
  filterOptionText: {
    flex: 1,
    fontSize: FontSizes.md,
    color: Colors.text.secondary,
    marginLeft: Spacing.md,
  },
  filterOptionTextActive: {
    color: Colors.primary.blue,
    fontWeight: '500',
  },
});