import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, FontSizes, Shadows } from '../constants/theme';
import { SafetyTip } from '../types';

interface SafetyTipCardProps {
  tip: SafetyTip;
}

export const SafetyTipCard: React.FC<SafetyTipCardProps> = ({ tip }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return Colors.status.danger;
      case 'medium':
        return Colors.status.warning;
      default:
        return Colors.accent.green;
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'alert-circle';
      case 'medium':
        return 'warning';
      default:
        return 'information-circle';
    }
  };

  return (
    <View style={[styles.container, Shadows.small]}>
      <View style={styles.header}>
        <View style={[styles.priorityIndicator, { backgroundColor: getPriorityColor(tip.priority) }]}>
          <Ionicons
            name={getPriorityIcon(tip.priority)}
            size={16}
            color={Colors.secondary.white}
          />
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{tip.title}</Text>
          <Text style={styles.category}>{tip.category}</Text>
        </View>
      </View>
      <Text style={styles.description}>{tip.description}</Text>
      {tip.location && (
        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={14} color={Colors.text.secondary} />
          <Text style={styles.location}>{tip.location}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.secondary.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  priorityIndicator: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 2,
  },
  category: {
    fontSize: FontSizes.xs,
    color: Colors.text.secondary,
  },
  description: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    lineHeight: 20,
    marginBottom: Spacing.sm,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: FontSizes.xs,
    color: Colors.text.secondary,
    marginLeft: 4,
  },
});