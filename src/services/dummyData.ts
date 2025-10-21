import { User, SafetyTip, Document, SafetyAlert, GeofenceZone } from '../types';

export const mockUser: User = {
  id: '1',
  name: 'Navyansh Kesarwani',
  email: 'navyanshkesarwani@gmail.com',
  phone: '+91 98765 43210',
  profileImage: 'https://via.placeholder.com/150',
  currentLocation: {
    latitude: 28.6139,
    longitude: 77.2090,
    address: 'Manipal University Jaipur, Rajasthan, India',
    timestamp: new Date(),
  },
  safetyScore: 85,
  digitalId: 'TID123456789',
  emergencyContacts: [
    {
      id: '1',
      name: 'Mayank Saxena',
      phone: '+91 98765 43211',
      relationship: 'Friend',
    },
    {
      id: '2',
      name: 'Vansh Agarwal',
      phone: '+91 98765 43212',
      relationship: 'Friend',
    },
    {
      id: '3',
      name: 'Praver Agarwal',
      phone: '+91 98765 43213',
      relationship: 'Friend',
    },
    {
      id: '4',
      name: 'Aashi Tiwari',
      phone: '+91 98765 43213',
      relationship: 'Friend',
    },
    {
      id: '5',
      name: 'Tanisha Srivastava',
      phone: '+91 98765 43213',
      relationship: 'Friend',
    }
  ],
  travelItinerary: [
    {
      id: '1',
      destination: 'India Gate',
      expectedArrival: new Date('2025-09-04T15:00:00'),
      status: 'pending',
    },
    {
      id: '2',
      destination: 'Red Fort',
      expectedArrival: new Date('2025-09-04T17:30:00'),
      status: 'pending',
    },
  ],
  preferences: {
    language: 'English',
    notifications: true,
    familyTracking: true,
    automaticAlerts: true,
    dataSharing: 'selective',
  },
  tripStats: {
    daysTravel: 3,
    placesVisited: 12,
    safeHours: 68,
    areasVisitedToday: 5,
  },
};

export const mockSafetyTips: SafetyTip[] = [
  {
    id: '1',
    title: 'Stay in Well-Lit Areas',
    description: 'Avoid dimly lit streets and alleys, especially after sunset.',
    category: 'General Safety',
    location: 'Delhi',
    priority: 'high',
  },
  {
    id: '2',
    title: 'Keep Emergency Numbers Handy',
    description: 'Save local police (100) and ambulance (108) numbers in your phone.',
    category: 'Emergency Preparedness',
    priority: 'high',
  },
  {
    id: '3',
    title: 'Inform Someone About Your Plans',
    description: 'Let family or friends know your itinerary and expected return time.',
    category: 'Communication',
    priority: 'medium',
  },
  {
    id: '4',
    title: 'Use Official Transportation',
    description: 'Prefer registered taxis, metro, or government buses for safer travel.',
    category: 'Transportation',
    location: 'Delhi',
    priority: 'medium',
  },
];

export const mockDocuments: Document[] = [
  {
    id: '1',
    name: 'Aadhaar Card',
    type: 'identity',
    category: 'Government ID',
    uploadDate: new Date('2025-09-01'),
    verified: true,
    blockchainVerified: true,
    fileUri: 'mock://documents/aadhaar.pdf',
    thumbnailUri: 'mock://thumbnails/aadhaar.jpg',
  },
  {
    id: '2',
    name: 'Train Ticket - Delhi to Agra',
    type: 'travel',
    category: 'Transportation',
    uploadDate: new Date('2025-09-03'),
    verified: true,
    blockchainVerified: false,
    fileUri: 'mock://documents/train_ticket.pdf',
    thumbnailUri: 'mock://thumbnails/train_ticket.jpg',
  },
  {
    id: '3',
    name: 'Hotel Booking Confirmation',
    type: 'travel',
    category: 'Accommodation',
    uploadDate: new Date('2025-09-02'),
    verified: true,
    blockchainVerified: true,
    fileUri: 'mock://documents/hotel_booking.pdf',
    thumbnailUri: 'mock://thumbnails/hotel_booking.jpg',
  },
  {
    id: '4',
    name: 'Medical Prescription',
    type: 'emergency',
    category: 'Medical',
    uploadDate: new Date('2025-08-30'),
    verified: true,
    blockchainVerified: true,
    fileUri: 'mock://documents/prescription.pdf',
    thumbnailUri: 'mock://thumbnails/prescription.jpg',
  },
];

export const mockSafetyAlerts: SafetyAlert[] = [
  {
    id: '1',
    type: 'warning',
    title: 'Heavy Traffic Alert',
    message: 'Expect delays on NH-44 due to construction work. Plan alternate routes.',
    location: {
      latitude: 28.6139,
      longitude: 77.2090,
      address: 'NH-44, Delhi',
      timestamp: new Date(),
    },
    timestamp: new Date(),
    acknowledged: false,
  },
  {
    id: '2',
    type: 'info',
    title: 'Tourist Area Update',
    message: 'Connaught Place has increased security presence during festival season.',
    location: {
      latitude: 28.6304,
      longitude: 77.2177,
      address: 'Connaught Place, Delhi',
      timestamp: new Date(),
    },
    timestamp: new Date(),
    acknowledged: true,
  },
];

// Circular geofence zones for Delhi regions - displayed as large heatmaps
export const mockCircularGeofenceZones = [
  {
    id: '1',
    name: 'Old Delhi - Chandni Chowk',
    type: 'restricted',
    center: { latitude: 28.6506, longitude: 77.2334, timestamp: new Date() },
    radius: 1200, // meters - increased for better visibility
    description: 'High crime rate area - pickpocketing, theft, and overcrowding. Avoid after sunset.',
    riskLevel: 'high',
  },
  {
    id: '2',
    name: 'Karol Bagh Market',
    type: 'restricted',
    center: { latitude: 28.6519, longitude: 77.1909, timestamp: new Date() },
    radius: 1000,
    description: 'Tourist targeting scams and pickpocketing incidents reported frequently.',
    riskLevel: 'high',
  },
  {
    id: '3',
    name: 'Paharganj - Main Bazaar',
    type: 'restricted',
    center: { latitude: 28.6428, longitude: 77.2167, timestamp: new Date() },
    radius: 900,
    description: 'Drug-related activities, harassment of tourists, unsafe accommodation areas.',
    riskLevel: 'high',
  },
  {
    id: '4',
    name: 'Sadar Bazaar',
    type: 'restricted',
    center: { latitude: 28.6692, longitude: 77.2265, timestamp: new Date() },
    radius: 800,
    description: 'Wholesale market with heavy vehicle traffic and poor security infrastructure.',
    riskLevel: 'medium',
  },
  {
    id: '5',
    name: 'Lajpat Nagar Market',
    type: 'warning',
    center: { latitude: 28.5665, longitude: 77.2434, timestamp: new Date() },
    radius: 700,
    description: 'Crowded market area - risk of pickpocketing and bag snatching.',
    riskLevel: 'medium',
  },
  {
    id: '6',
    name: 'Jahangirpuri',
    type: 'restricted',
    center: { latitude: 28.7264, longitude: 77.1644, timestamp: new Date() },
    radius: 1400, // Large area
    description: 'High crime residential area with frequent incidents of violence and robbery.',
    riskLevel: 'high',
  },
  {
    id: '7',
    name: 'Seelampur',
    type: 'restricted',
    center: { latitude: 28.6743, longitude: 77.2744, timestamp: new Date() },
    radius: 1100,
    description: 'Communal tension prone area with limited police presence.',
    riskLevel: 'high',
  },
  {
    id: '8',
    name: 'Govindpuri',
    type: 'warning',
    center: { latitude: 28.5434, longitude: 77.2734, timestamp: new Date() },
    radius: 800,
    description: 'Slum area with poor lighting and inadequate security measures.',
    riskLevel: 'medium',
  },
];

export const mockGeofenceZones: GeofenceZone[] = [];

export const mockTouristDensityData = [
  { latitude: 28.6139, longitude: 77.2090, density: 'high', count: 150 },
  { latitude: 28.6129, longitude: 77.2100, density: 'high', count: 120 },
  { latitude: 28.6149, longitude: 77.2080, density: 'medium', count: 80 },
  { latitude: 28.6159, longitude: 77.2070, density: 'medium', count: 60 },
  { latitude: 28.6109, longitude: 77.2110, density: 'low', count: 30 },
  { latitude: 28.6179, longitude: 77.2050, density: 'low', count: 20 },
];

// Large danger zones for better visibility
export const mockDangerZoneData = [
  // Old Delhi area - High crime rate
  { latitude: 28.6562, longitude: 77.2410, weight: 1.0, radius: 0.008 },
  { latitude: 28.6580, longitude: 77.2420, weight: 0.9, radius: 0.006 },
  { latitude: 28.6570, longitude: 77.2400, weight: 0.8, radius: 0.005 },
  { latitude: 28.6590, longitude: 77.2430, weight: 0.7, radius: 0.004 },
  
  // Karol Bagh area - Pickpocketing incidents
  { latitude: 28.6519, longitude: 77.1909, weight: 0.8, radius: 0.007 },
  { latitude: 28.6530, longitude: 77.1920, weight: 0.7, radius: 0.005 },
  { latitude: 28.6540, longitude: 77.1930, weight: 0.6, radius: 0.004 },
  
  // Paharganj area - Tourist area with risks
  { latitude: 28.6428, longitude: 77.2167, weight: 0.9, radius: 0.006 },
  { latitude: 28.6440, longitude: 77.2180, weight: 0.8, radius: 0.005 },
  { latitude: 28.6450, longitude: 77.2190, weight: 0.7, radius: 0.004 },
  
  // Sadar Bazaar - Crowded area
  { latitude: 28.6692, longitude: 77.2265, weight: 0.7, radius: 0.005 },
  { latitude: 28.6700, longitude: 77.2275, weight: 0.6, radius: 0.004 },
  
  // Chandni Chowk - Very crowded tourist area
  { latitude: 28.6506, longitude: 77.2334, weight: 0.85, radius: 0.007 },
  { latitude: 28.6520, longitude: 77.2345, weight: 0.75, radius: 0.005 },
  { latitude: 28.6495, longitude: 77.2320, weight: 0.65, radius: 0.004 },
];

export const mockNearbyServices = [
  {
    id: '1',
    name: 'All India Institute of Medical Sciences',
    type: 'hospital',
    location: { latitude: 28.5672, longitude: 77.2100, timestamp: new Date() },
    distance: '2.5 km',
    phone: '+91-11-2659-8666',
  },
  {
    id: '2',
    name: 'Connaught Place Police Station',
    type: 'police',
    location: { latitude: 28.6304, longitude: 77.2177, timestamp: new Date() },
    distance: '0.8 km',
    phone: '100',
  },
  {
    id: '3',
    name: 'India Gate',
    type: 'attraction',
    location: { latitude: 28.6129, longitude: 77.2295, timestamp: new Date() },
    distance: '1.2 km',
    phone: 'N/A',
  },
  {
    id: '4',
    name: 'Red Fort',
    type: 'attraction',
    location: { latitude: 28.6562, longitude: 77.2410, timestamp: new Date() },
    distance: '3.5 km',
    phone: 'N/A',
  },
];