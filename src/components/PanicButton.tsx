import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, BorderRadius, FontSizes, Shadows } from '../constants/theme';

const { width } = Dimensions.get('window');

interface PanicButtonProps {
  onPress?: () => void;
  size?: number;
}

export const PanicButton: React.FC<PanicButtonProps> = ({
  onPress,
  size = width * 0.4,
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const handlePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    
    Alert.alert(
      'Emergency Alert',
      'Are you sure you want to send an emergency alert to your contacts?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Send Alert',
          style: 'destructive',
          onPress: () => {
            onPress?.();
            // Here you would implement actual emergency functionality
            Alert.alert('Alert Sent', 'Emergency alert has been sent to your contacts.');
          },
        },
      ]
    );
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
        isPressed && styles.pressed,
        Shadows.large,
      ]}
      onPress={handlePress}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      activeOpacity={0.8}
    >
      <Ionicons
        name="alert-circle"
        size={size * 0.3}
        color={Colors.secondary.white}
      />
      <Text style={[styles.text, { fontSize: size * 0.08 }]}>EMERGENCY</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.status.danger,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: Spacing.lg,
  },
  pressed: {
    transform: [{ scale: 0.95 }],
  },
  text: {
    color: Colors.secondary.white,
    fontWeight: 'bold',
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
});