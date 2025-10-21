import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import { Colors, Spacing, BorderRadius, FontSizes, Shadows } from '../../src/constants/theme';
import { DocumentCard } from '../../src/components/DocumentCard';
import { mockDocuments, mockUser } from '../../src/services/dummyData';
import { Document } from '../../src/types';

export default function DocumentsScreen() {
  const [documents, setDocuments] = useState(mockDocuments);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showQRModal, setShowQRModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadingDocument, setUploadingDocument] = useState<string | null>(null);

  const categories = [
    { key: 'all', label: 'All Documents', icon: 'document-text-outline' },
    { key: 'identity', label: 'Identity', icon: 'card-outline' },
    { key: 'travel', label: 'Travel', icon: 'airplane-outline' },
    { key: 'emergency', label: 'Emergency', icon: 'medical-outline' },
  ];

  const filteredDocuments = selectedCategory === 'all' 
    ? documents 
    : documents.filter(doc => doc.type === selectedCategory);

  const handleUploadDocument = (type: Document['type']) => {
    setUploadingDocument(type);
    setShowUploadModal(false);
    
    // Simulate document upload process
    setTimeout(() => {
      const newDoc: Document = {
        id: Date.now().toString(),
        name: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Document`,
        type,
        category: type === 'identity' ? 'Government ID' : 
                 type === 'travel' ? 'Transportation' : 'Medical',
        uploadDate: new Date(),
        verified: false,
        blockchainVerified: false,
        fileUri: 'mock://documents/new_document.pdf',
        thumbnailUri: 'mock://thumbnails/new_document.jpg',
      };
      
      setDocuments(prev => [...prev, newDoc]);
      setUploadingDocument(null);
      Alert.alert('Success', 'Document uploaded successfully!');
    }, 2000);
  };

  const handleVerifyDocument = (documentId: string) => {
    Alert.alert(
      'Verify Document',
      'This will start the verification process. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Verify',
          onPress: () => {
            setDocuments(prev =>
              prev.map(doc =>
                doc.id === documentId
                  ? { ...doc, verified: true, blockchainVerified: true }
                  : doc
              )
            );
            Alert.alert('Success', 'Document verification initiated!');
          },
        },
      ]
    );
  };

  const generateDigitalTouristId = () => {
    const qrData = JSON.stringify({
      id: mockUser.digitalId,
      name: mockUser.name,
      phone: mockUser.phone,
      safetyScore: mockUser.safetyScore,
      verified: true,
      timestamp: new Date().toISOString(),
    });
    
    return qrData;
  };

  const getDocumentStats = () => {
    const total = documents.length;
    const verified = documents.filter(doc => doc.verified).length;
    const blockchainSecured = documents.filter(doc => doc.blockchainVerified).length;
    
    return { total, verified, blockchainSecured };
  };

  const stats = getDocumentStats();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Document Vault</Text>
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={() => setShowUploadModal(true)}
          >
            <Ionicons name="add" size={24} color={Colors.secondary.white} />
          </TouchableOpacity>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, Shadows.small]}>
            <Text style={styles.statNumber}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total Documents</Text>
          </View>
          <View style={[styles.statCard, Shadows.small]}>
            <Text style={[styles.statNumber, { color: Colors.accent.green }]}>
              {stats.verified}
            </Text>
            <Text style={styles.statLabel}>Verified</Text>
          </View>
          <View style={[styles.statCard, Shadows.small]}>
            <Text style={[styles.statNumber, { color: Colors.primary.blue }]}>
              {stats.blockchainSecured}
            </Text>
            <Text style={styles.statLabel}>Blockchain Secured</Text>
          </View>
        </View>

        {/* Digital Tourist ID */}
        <View style={[styles.digitalIdCard, Shadows.medium]}>
          <View style={styles.digitalIdHeader}>
            <View style={styles.digitalIdInfo}>
              <Text style={styles.digitalIdTitle}>Digital Tourist ID</Text>
              <Text style={styles.digitalIdSubtitle}>
                Tourist ID: {mockUser.digitalId}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.qrButton}
              onPress={() => setShowQRModal(true)}
            >
              <Ionicons name="qr-code-outline" size={24} color={Colors.primary.blue} />
            </TouchableOpacity>
          </View>
          <Text style={styles.digitalIdDescription}>
            Share your verified tourist identity securely with authorities and service providers.
          </Text>
        </View>

        {/* Category Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryContainer}
          contentContainerStyle={styles.categoryContent}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.key}
              style={[
                styles.categoryButton,
                selectedCategory === category.key && styles.categoryButtonActive,
              ]}
              onPress={() => setSelectedCategory(category.key)}
            >
              <Ionicons
                name={category.icon as any}
                size={20}
                color={
                  selectedCategory === category.key
                    ? Colors.secondary.white
                    : Colors.text.secondary
                }
              />
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category.key && styles.categoryTextActive,
                ]}
              >
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Documents List */}
        <View style={styles.documentsContainer}>
          {uploadingDocument && (
            <View style={[styles.uploadingCard, Shadows.small]}>
              <ActivityIndicator size="small" color={Colors.primary.blue} />
              <Text style={styles.uploadingText}>
                Uploading {uploadingDocument} document...
              </Text>
            </View>
          )}
          
          {filteredDocuments.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="document-outline" size={64} color={Colors.text.light} />
              <Text style={styles.emptyText}>No documents found</Text>
              <Text style={styles.emptySubtext}>
                Tap the + button to upload your first document
              </Text>
            </View>
          ) : (
            filteredDocuments.map((document) => (
              <DocumentCard
                key={document.id}
                document={document}
                onPress={() => {
                  Alert.alert('Document Details', `Viewing ${document.name}`);
                }}
                onVerify={() => handleVerifyDocument(document.id)}
              />
            ))
          )}
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* QR Code Modal */}
      <Modal
        visible={showQRModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowQRModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.qrModalContent}>
            <View style={styles.qrHeader}>
              <Text style={styles.qrTitle}>Digital Tourist ID</Text>
              <TouchableOpacity onPress={() => setShowQRModal(false)}>
                <Ionicons name="close" size={24} color={Colors.text.secondary} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.qrContainer}>
              <QRCode
                value={generateDigitalTouristId()}
                size={200}
                color={Colors.text.primary}
                backgroundColor={Colors.secondary.white}
              />
            </View>
            
            <View style={styles.qrInfo}>
              <Text style={styles.qrUserName}>{mockUser.name}</Text>
              <Text style={styles.qrUserId}>ID: {mockUser.digitalId}</Text>
              <Text style={styles.qrSafetyScore}>
                Safety Score: {mockUser.safetyScore}%
              </Text>
            </View>
            
            <Text style={styles.qrInstructions}>
              Scan this QR code to verify your identity and share your tourist credentials.
            </Text>
          </View>
        </View>
      </Modal>

      {/* Upload Modal */}
      <Modal
        visible={showUploadModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowUploadModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.uploadModalContent}>
            <Text style={styles.uploadModalTitle}>Upload Document</Text>
            <Text style={styles.uploadModalSubtitle}>
              Choose document type to upload
            </Text>
            
            {categories.slice(1).map((category) => (
              <TouchableOpacity
                key={category.key}
                style={styles.uploadOption}
                onPress={() => handleUploadDocument(category.key as Document['type'])}
              >
                <View style={styles.uploadOptionIcon}>
                  <Ionicons
                    name={category.icon as any}
                    size={24}
                    color={Colors.primary.blue}
                  />
                </View>
                <Text style={styles.uploadOptionText}>{category.label} Documents</Text>
                <Ionicons name="chevron-forward" size={20} color={Colors.text.light} />
              </TouchableOpacity>
            ))}
            
            <TouchableOpacity
              style={styles.cancelUploadButton}
              onPress={() => setShowUploadModal(false)}
            >
              <Text style={styles.cancelUploadText}>Cancel</Text>
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
  uploadButton: {
    backgroundColor: Colors.primary.blue,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.secondary.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
    marginHorizontal: Spacing.xs,
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
  digitalIdCard: {
    backgroundColor: Colors.secondary.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  digitalIdHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  digitalIdInfo: {
    flex: 1,
  },
  digitalIdTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  digitalIdSubtitle: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
  },
  qrButton: {
    padding: Spacing.sm,
  },
  digitalIdDescription: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    lineHeight: 18,
  },
  categoryContainer: {
    marginBottom: Spacing.lg,
  },
  categoryContent: {
    paddingHorizontal: Spacing.lg,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondary.white,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    marginRight: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.secondary.lightGray,
  },
  categoryButtonActive: {
    backgroundColor: Colors.primary.blue,
    borderColor: Colors.primary.blue,
  },
  categoryText: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    marginLeft: Spacing.xs,
    fontWeight: '500',
  },
  categoryTextActive: {
    color: Colors.secondary.white,
  },
  documentsContainer: {
    flex: 1,
  },
  uploadingCard: {
    backgroundColor: Colors.secondary.white,
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  uploadingText: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    marginLeft: Spacing.sm,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl,
    paddingHorizontal: Spacing.lg,
  },
  emptyText: {
    fontSize: FontSizes.lg,
    color: Colors.text.secondary,
    marginTop: Spacing.md,
    fontWeight: '500',
  },
  emptySubtext: {
    fontSize: FontSizes.sm,
    color: Colors.text.light,
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrModalContent: {
    backgroundColor: Colors.secondary.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    width: '90%',
    maxWidth: 350,
    alignItems: 'center',
  },
  qrHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: Spacing.lg,
  },
  qrTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  qrContainer: {
    padding: Spacing.lg,
    backgroundColor: Colors.secondary.lightGray,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.lg,
  },
  qrInfo: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  qrUserName: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  qrUserId: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  qrSafetyScore: {
    fontSize: FontSizes.sm,
    color: Colors.accent.green,
    fontWeight: '500',
  },
  qrInstructions: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  uploadModalContent: {
    backgroundColor: Colors.secondary.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    width: '90%',
    maxWidth: 400,
  },
  uploadModalTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  uploadModalSubtitle: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  uploadOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.secondary.lightGray,
  },
  uploadOptionIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.primary.blue + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  uploadOptionText: {
    flex: 1,
    fontSize: FontSizes.md,
    color: Colors.text.primary,
    fontWeight: '500',
  },
  cancelUploadButton: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
    marginTop: Spacing.lg,
  },
  cancelUploadText: {
    fontSize: FontSizes.md,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  bottomPadding: {
    height: 20,
  },
});