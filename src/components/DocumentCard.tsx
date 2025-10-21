import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, FontSizes, Shadows } from '../constants/theme';
import { Document } from '../types';

interface DocumentCardProps {
  document: Document;
  onPress?: () => void;
  onVerify?: () => void;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  onPress,
  onVerify,
}) => {
  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'identity':
        return 'card-outline';
      case 'travel':
        return 'airplane-outline';
      case 'emergency':
        return 'medical-outline';
      default:
        return 'document-outline';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'identity':
        return Colors.primary.blue;
      case 'travel':
        return Colors.accent.green;
      case 'emergency':
        return Colors.status.danger;
      default:
        return Colors.secondary.gray;
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, Shadows.small]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: getTypeColor(document.type) + '20' }]}>
            <Ionicons
              name={getDocumentIcon(document.type)}
              size={24}
              color={getTypeColor(document.type)}
            />
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{document.name}</Text>
            <Text style={styles.category}>{document.category}</Text>
          </View>
          <View style={styles.statusContainer}>
            {document.verified && (
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark-circle" size={16} color={Colors.accent.green} />
              </View>
            )}
            {document.blockchainVerified && (
              <View style={styles.blockchainBadge}>
                <Ionicons name="shield-checkmark" size={16} color={Colors.primary.blue} />
              </View>
            )}
          </View>
        </View>

        <View style={styles.details}>
          <Text style={styles.uploadDate}>
            Uploaded: {document.uploadDate.toLocaleDateString()}
          </Text>
          <View style={styles.verificationStatus}>
            <Text style={[
              styles.verificationText,
              { color: document.verified ? Colors.accent.green : Colors.status.warning }
            ]}>
              {document.verified ? 'Verified' : 'Pending Verification'}
            </Text>
            {document.blockchainVerified && (
              <Text style={styles.blockchainText}>• Blockchain Secured</Text>
            )}
          </View>
        </View>

        {!document.verified && (
          <TouchableOpacity style={styles.verifyButton} onPress={onVerify}>
            <Text style={styles.verifyButtonText}>Verify Document</Text>
          </TouchableOpacity>
        )}
      </View>

      {document.thumbnailUri && (
        <View style={styles.thumbnailContainer}>
          <Image
            source={{ uri: document.thumbnailUri }}
            style={styles.thumbnail}
            resizeMode="cover"
          />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.secondary.white,
    borderRadius: BorderRadius.md,
    marginVertical: Spacing.xs,
    marginHorizontal: Spacing.lg,
    overflow: 'hidden',
  },
  content: {
    padding: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.sm,
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
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verifiedBadge: {
    marginLeft: Spacing.xs,
  },
  blockchainBadge: {
    marginLeft: Spacing.xs,
  },
  details: {
    marginBottom: Spacing.sm,
  },
  uploadDate: {
    fontSize: FontSizes.xs,
    color: Colors.text.light,
    marginBottom: 4,
  },
  verificationStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verificationText: {
    fontSize: FontSizes.sm,
    fontWeight: '500',
  },
  blockchainText: {
    fontSize: FontSizes.sm,
    color: Colors.primary.blue,
    fontWeight: '500',
    marginLeft: Spacing.xs,
  },
  verifyButton: {
    backgroundColor: Colors.primary.blue,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    alignSelf: 'flex-start',
  },
  verifyButtonText: {
    fontSize: FontSizes.sm,
    color: Colors.secondary.white,
    fontWeight: '500',
  },
  thumbnailContainer: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    width: 60,
    height: 60,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
});