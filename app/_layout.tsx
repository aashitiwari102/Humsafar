import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, useTheme } from '../src/context/ThemeContext';

function RootLayoutContent() {
  const { isDarkMode, colors } = useTheme();
  
  return (
    <>
      <StatusBar 
        style={isDarkMode ? "light" : "dark"} 
        backgroundColor={colors.secondary.background} 
      />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootLayoutContent />
    </ThemeProvider>
  );
}