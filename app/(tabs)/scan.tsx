import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import { CameraView, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import { useRouter } from 'expo-router';
import { X, Keyboard, Camera } from 'lucide-react-native';
import { lookupBarcode, createClothingItem } from '@/services/barcodeApi';
import { saveToHistory } from '@/services/storage';

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
        Alert.alert('Erreur', response.error || 'Produit non trouvé', [
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
      Alert.alert('Erreur', 'Le code doit contenir au moins 4 caractères');
      return;
    }
    processBarcode(manualBarcode.trim());
  };

  if (!permission) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Camera size={64} color="#4361EE" />
        <Text style={styles.permissionTitle}>Accès à la caméra</Text>
        <Text style={styles.permissionText}>
          Lya a besoin d'accéder à votre caméra pour scanner les codes-barres
        </Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Autoriser l'accès</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (showManualInput) {
    return (
      <View style={styles.manualContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => setShowManualInput(false)}>
          <X size={28} color="#1A1A2E" />
        </TouchableOpacity>

        <View style={styles.manualContent}>
          <Keyboard size={48} color="#4361EE" />
          <Text style={styles.manualTitle}>Entrer le code manuellement</Text>
          <Text style={styles.manualSubtitle}>
            Saisissez le code-barres ou la référence du vêtement
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Ex: 3614271303851"
            placeholderTextColor="#9CA3AF"
            keyboardType="default"
            value={manualBarcode}
            onChangeText={setManualBarcode}
            autoFocus
          />

          <TouchableOpacity
            style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
            onPress={handleManualSubmit}
            disabled={isLoading}
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
          <TouchableOpacity onPress={() => router.back()}>
            <X size={28} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>Scanner</Text>
          <View style={{ width: 28 }} />
        </View>

        {/* Scan area */}
        <View style={styles.scanArea}>
          <View style={styles.scanFrame} />
          <Text style={styles.scanHint}>
            {isLoading ? 'Recherche en cours...' : 'Placez le code-barres dans le cadre'}
          </Text>
        </View>

        {/* Bottom actions */}
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.manualButton}
            onPress={() => setShowManualInput(true)}
          >
            <Text style={styles.manualButtonText}>Entrer manuellement</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    backgroundColor: '#1A1A2E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1A1A2E',
    marginTop: 24,
    marginBottom: 8,
  },
  permissionText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  permissionButton: {
    backgroundColor: '#4361EE',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  manualContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 60,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 24,
    zIndex: 10,
  },
  manualContent: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  manualTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1A1A2E',
    marginTop: 20,
    marginBottom: 8,
  },
  manualSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
  },
  input: {
    width: '100%',
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 16,
    fontSize: 18,
    color: '#1A1A2E',
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#4361EE',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 30,
    marginTop: 24,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
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
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  topBarTitle: {
    color: '#FFFFFF',
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
    borderRadius: 24,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  scanHint: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    marginTop: 24,
    textAlign: 'center',
  },
  bottomBar: {
    alignItems: 'center',
    paddingBottom: 50,
  },
  manualButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 25,
  },
  manualButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
});
