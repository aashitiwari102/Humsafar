# Humsafar

Humsafar is a multimodal AI-powered mobile and web app that enhances tourist safety using AI, Blockchain, Geo-fencing, and GPS tracking.

Each traveller gets a blockchain-based digital ID to securely store essential documents. The system employs AI-driven anomaly detection and real-time monitoring to calculate a Tourist Safety Score. In emergencies, a one-tap panic button or automatic alerts (triggered by anomalies or geo-fence breaches) notify authorities and contacts instantly.

By integrating text, voice, GPS, and blockchain data, Humsafar ensures smart, real-time protection and situational awareness for travellers.

## Prerequisites

- Node.js (version 18 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development on macOS)
- Android Studio and Android SDK (for Android development)

## Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd humsafar
   ```

2. **Install Expo CLI globally** (if not already installed)
   ```bash
   npm install -g @expo/cli
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

## Running the App

### Development Server
```bash
npm start
```

This will start the Metro bundler and show a QR code that you can scan with the Expo Go app.

### Platform-specific Commands

**iOS Simulator:**
```bash
npm run ios
```

**Android Emulator:**
```bash
npm run android
```

**Web Browser:**
```bash
npm run web
```

## Project Structure

This project uses Expo Router for navigation and includes the following key dependencies:

- **Navigation**: Expo Router
- **Maps**: React Native Maps
- **QR Codes**: React Native QR Code SVG
- **Icons**: Expo Vector Icons
- **Location**: Expo Location
- **Haptics**: Expo Haptics

## Development

The app uses TypeScript for type safety. Make sure to follow TypeScript best practices when contributing.

## Testing

To test on a physical device:

1. Install the Expo Go app from the App Store (iOS) or Google Play Store (Android)
2. Run `npm start`
3. Scan the QR code with your device's camera (iOS) or with the Expo Go app (Android)
