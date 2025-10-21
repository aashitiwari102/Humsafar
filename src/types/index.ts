export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  profileImage?: string;
  currentLocation?: Location;
  safetyScore: number;
  digitalId: string;
  emergencyContacts: EmergencyContact[];
  travelItinerary: TravelItinerary[];
  preferences: UserPreferences;
  tripStats: TripStats;
}

export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
  timestamp: Date;
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
}

export interface TravelItinerary {
  id: string;
  destination: string;
  expectedArrival: Date;
  status: 'pending' | 'completed' | 'delayed';
}

export interface UserPreferences {
  language: string;
  notifications: boolean;
  familyTracking: boolean;
  automaticAlerts: boolean;
  dataSharing: 'minimal' | 'selective' | 'full';
}

export interface TripStats {
  daysTravel: number;
  placesVisited: number;
  safeHours: number;
  areasVisitedToday: number;
}

export interface Document {
  id: string;
  name: string;
  type: 'identity' | 'travel' | 'emergency';
  category: string;
  uploadDate: Date;
  verified: boolean;
  blockchainVerified: boolean;
  fileUri: string;
  thumbnailUri?: string;
}

export interface SafetyAlert {
  id: string;
  type: 'warning' | 'danger' | 'info';
  title: string;
  message: string;
  location?: Location;
  timestamp: Date;
  acknowledged: boolean;
}

export interface GeofenceZone {
  id: string;
  name: string;
  type: 'safe' | 'warning' | 'restricted';
  coordinates: Location[];
  description?: string;
}

export interface CircularGeofenceZone {
  id: string;
  name: string;
  type: 'safe' | 'warning' | 'restricted';
  center: Location;
  radius: number; // in meters
  description: string;
  riskLevel: 'low' | 'medium' | 'high';
}

export interface SafetyTip {
  id: string;
  title: string;
  description: string;
  category: string;
  location?: string;
  priority: 'low' | 'medium' | 'high';
}