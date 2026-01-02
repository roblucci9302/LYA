import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import { CameraView, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import { useRouter } from 'expo-router';
import { X, Type, Camera, Scan, Keyboard } from 'lucide-react-native';
import { lookupBarcode, createClothingItem } from '@/services/barcodeApi';
import { saveToHistory } from '@/services/storage';
import { Colors, BorderRadius, Shadows } from '@/constants/Theme';

export default function ScanScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualBarcode, setManualBarcode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleBarCodeScanned = async ({ data }: BarcodeScanningResult) => {
    if (scanned || isLoading) return;
    setScanned(true);
    await processBarcode(data);
  };

  const processBarcode = async (barcode: string) => {
    setIsLoading(true);
    try {
      const response = await lookupBarcode(barcode);

      if (response.success) {
        const item = createClothingItem(barcode, response);
        await saveToHistory(item);

        router.replace({
          pathname: '/result',
          params: { itemId: item.id, barcode: item.barcode },
        });
      } else {
        Alert.alert('Article non trouvé', response.error || 'Veuillez réessayer', [
          { text: 'Réessayer', onPress: () => setScanned(false) },
        ]);
      }
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue', [
        { text: 'Réessayer', onPress: () => setScanned(false) },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualSubmit = () => {
    if (manualBarcode.trim().length < 4) {
      Alert.alert('Code invalide', 'Le code doit contenir au moins 4 caractères');
      return;
    }
    processBarcode(manualBarcode.trim());
  };

  if (!permission) {
    return (
      <View style={styles.centerContainer}>
        <View style={styles.loadingSpinner}>
          <Scan size={32} color={Colors.primary} strokeWidth={2} />
        </View>
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <View style={styles.permissionCard}>
          <View style={styles.permissionIcon}>
            <Camera size={40} color={Colors.primary} strokeWidth={1.5} />
          </View>
          <Text style={styles.permissionTitle}>Accès à la caméra</Text>
          <Text style={styles.permissionText}>
            Pour scanner les codes-barres de vos vêtements, Lya a besoin d'accéder à votre caméra.
          </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Autoriser l'accès</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (showManualInput) {
    return (
      <View style={styles.manualContainer}>
        {/* Header */}
        <View style={styles.manualHeader}>
          <TouchableOpacity onPress={() => setShowManualInput(false)} style={styles.backButton}>
            <X size={24} color={Colors.textPrimary} strokeWidth={2} />
          </TouchableOpacity>
          <Text style={styles.manualHeaderTitle}>Saisie manuelle</Text>
          <View style={{ width: 44 }} />
        </View>

        <View style={styles.manualContent}>
          <View style={styles.manualIconContainer}>
            <Keyboard size={48} color={Colors.primary} strokeWidth={1.5} />
          </View>

          <Text style={styles.manualTitle}>Entrez le code</Text>
          <Text style={styles.manualSubtitle}>
            Saisissez le code-barres ou la référence inscrite sur l'étiquette de votre vêtement.
          </Text>

          <View style={styles.inputCard}>
            <TextInput
              style={styles.input}
              placeholder="Ex: 3760123456789"
              placeholderTextColor={Colors.textLight}
              value={manualBarcode}
              onChangeText={setManualBarcode}
              autoFocus
              autoCapitalize="characters"
              keyboardType="default"
            />
          </View>

          <TouchableOpacity
            style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
            onPress={handleManualSubmit}
            disabled={isLoading}
            activeOpacity={0.9}
          >
            <Text style={styles.submitButtonText}>
              {isLoading ? 'Recherche...' : 'Rechercher'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.cameraContainer}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        barcodeScannerSettings={{
          barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e', 'code128', 'code39'],
        }}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      />

      {/* Overlay */}
      <View style={styles.overlay}>
        {/* Top bar */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
            <X size={24} color={Colors.textWhite} strokeWidth={2} />
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>Scanner</Text>
          <View style={{ width: 44 }} />
        </View>

        {/* Scan area */}
        <View style={styles.scanArea}>
          {/* Scan frame with rounded corners */}
          <View style={styles.scanFrame}>
            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />
            <View style={[styles.corner, styles.cornerBL]} />
            <View style={[styles.corner, styles.cornerBR]} />

            {/* Animated scan line */}
            <View style={styles.scanLineContainer}>
              <View style={styles.scanLine} />
            </View>
          </View>

          <View style={styles.hintContainer}>
            <Text style={styles.scanHint}>
              {isLoading ? 'Analyse en cours...' : 'Placez le code-barres dans le cadre'}
            </Text>
          </View>
        </View>

        {/* Bottom actions */}
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.manualButton}
            onPress={() => setShowManualInput(true)}
            activeOpacity={0.9}
          >
            <Type size={20} color={Colors.textWhite} strokeWidth={2} />
            <Text style={styles.manualButtonText}>Saisie manuelle</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingSpinner: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.xl,
    backgroundColor: `${Colors.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  loadingText: {
    color: Colors.textSecondary,
    fontSize: 16,
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  permissionCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xxl,
    padding: 32,
    alignItems: 'center',
    width: '100%',
    ...Shadows.medium,
  },
  permissionIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: `${Colors.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  permissionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  permissionText: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  permissionButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: BorderRadius.xl,
    ...Shadows.large,
  },
  permissionButtonText: {
    color: Colors.textWhite,
    fontSize: 16,
    fontWeight: '600',
  },
  manualContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  manualHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.small,
  },
  manualHeaderTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  manualContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    alignItems: 'center',
  },
  manualIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: `${Colors.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  manualTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  manualSubtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  inputCard: {
    width: '100%',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    padding: 4,
    marginBottom: 24,
    ...Shadows.small,
  },
  input: {
    fontSize: 18,
    color: Colors.textPrimary,
    textAlign: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  submitButton: {
    width: '100%',
    backgroundColor: Colors.primary,
    paddingVertical: 18,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    ...Shadows.large,
  },
  submitButtonDisabled: {
    backgroundColor: Colors.textLight,
  },
  submitButtonText: {
    color: Colors.textWhite,
    fontSize: 17,
    fontWeight: '600',
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  overlay: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBarTitle: {
    color: Colors.textWhite,
    fontSize: 18,
    fontWeight: '600',
  },
  scanArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanFrame: {
    width: 280,
    height: 280,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderColor: Colors.primary,
  },
  cornerTL: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: BorderRadius.lg,
  },
  cornerTR: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: BorderRadius.lg,
  },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: BorderRadius.lg,
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: BorderRadius.lg,
  },
  scanLineContainer: {
    position: 'absolute',
    top: '50%',
    left: 20,
    right: 20,
  },
  scanLine: {
    height: 3,
    backgroundColor: Colors.primary,
    borderRadius: 2,
    opacity: 0.8,
  },
  hintContainer: {
    marginTop: 32,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: BorderRadius.full,
  },
  scanHint: {
    color: Colors.textWhite,
    fontSize: 14,
    textAlign: 'center',
  },
  bottomBar: {
    alignItems: 'center',
    paddingBottom: 60,
    paddingHorizontal: 24,
  },
  manualButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderRadius: BorderRadius.xl,
    ...Shadows.large,
  },
  manualButtonText: {
    color: Colors.textWhite,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
});
