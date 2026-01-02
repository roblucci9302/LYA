import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { ArrowLeft, Camera, Check, X, RotateCcw, Tag } from 'lucide-react-native';
import TextRecognition from '@react-native-ml-kit/text-recognition';
import { Colors, BorderRadius, Shadows } from '@/constants/Theme';
import {
  CARE_SYMBOLS,
  SYMBOLS_BY_CATEGORY,
  CATEGORY_LABELS,
  COMMON_MATERIALS,
  CareSymbol,
} from '@/constants/CareSymbols';
import { saveToHistory } from '@/services/storage';
import { ClothingItem } from '@/types';

export default function LabelScanScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  const [step, setStep] = useState<'photo' | 'material' | 'symbols' | 'processing'>('photo');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [detectedText, setDetectedText] = useState<string>('');
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [selectedSymbols, setSelectedSymbols] = useState<string[]>([]);
  const [itemName, setItemName] = useState<string>('Mon vêtement');
  const [isProcessing, setIsProcessing] = useState(false);

  const takePhoto = async () => {
    if (cameraRef.current) {
      setIsProcessing(true);
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
        });

        if (photo?.uri) {
          setPhotoUri(photo.uri);

          // Utiliser ML Kit pour lire le texte
          try {
            const result = await TextRecognition.recognize(photo.uri);
            if (result.text) {
              setDetectedText(result.text);
              // Essayer de détecter la matière automatiquement
              detectMaterialFromText(result.text);
            }
          } catch (e) {
            console.log('OCR error:', e);
          }

          setStep('material');
        }
      } catch (error) {
        Alert.alert('Erreur', 'Impossible de prendre la photo');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const detectMaterialFromText = (text: string) => {
    const lowerText = text.toLowerCase();
    const materialKeywords: Record<string, string[]> = {
      cotton: ['cotton', 'coton', '100% cotton', '100% coton'],
      polyester: ['polyester', 'polyamide'],
      wool: ['wool', 'laine', 'merino'],
      silk: ['silk', 'soie'],
      linen: ['linen', 'lin'],
      viscose: ['viscose', 'rayon'],
      cashmere: ['cashmere', 'cachemire'],
      leather: ['leather', 'cuir'],
    };

    for (const [material, keywords] of Object.entries(materialKeywords)) {
      if (keywords.some(k => lowerText.includes(k))) {
        setSelectedMaterial(material);
        // Pré-sélectionner les symboles par défaut pour cette matière
        const defaultSymbols = COMMON_MATERIALS[material]?.defaultCare || [];
        setSelectedSymbols(defaultSymbols);
        return;
      }
    }
  };

  const toggleSymbol = (symbolId: string) => {
    setSelectedSymbols(prev => {
      // Pour chaque catégorie, ne garder qu'un seul symbole
      const symbol = CARE_SYMBOLS.find(s => s.id === symbolId);
      if (!symbol) return prev;

      // Retirer les autres symboles de la même catégorie
      const filtered = prev.filter(id => {
        const s = CARE_SYMBOLS.find(cs => cs.id === id);
        return s?.category !== symbol.category;
      });

      // Toggle le symbole sélectionné
      if (prev.includes(symbolId)) {
        return prev.filter(id => id !== symbolId);
      } else {
        return [...filtered, symbolId];
      }
    });
  };

  const handleSave = async () => {
    setStep('processing');

    try {
      const selectedSymbolsData = selectedSymbols
        .map(id => CARE_SYMBOLS.find(s => s.id === id))
        .filter(Boolean) as CareSymbol[];

      // Créer l'item avec les instructions basées sur les symboles
      const washSymbol = selectedSymbolsData.find(s => s.category === 'wash');
      const drySymbol = selectedSymbolsData.find(s => s.category === 'dry');
      const ironSymbol = selectedSymbolsData.find(s => s.category === 'iron');
      const bleachSymbol = selectedSymbolsData.find(s => s.category === 'bleach');

      const item: ClothingItem = {
        id: Date.now().toString(),
        barcode: `LABEL-${Date.now()}`,
        name: itemName,
        brand: selectedMaterial ? COMMON_MATERIALS[selectedMaterial]?.name : undefined,
        category: selectedMaterial ? COMMON_MATERIALS[selectedMaterial]?.name : 'Vêtement',
        careInstructions: {
          washType: washSymbol?.id.includes('hand')
            ? 'hand'
            : washSymbol?.id.includes('no')
            ? 'do_not_wash'
            : washSymbol?.id.includes('delicate')
            ? 'delicate'
            : 'machine',
          washTemperature: extractTemperature(washSymbol?.id),
          dry: drySymbol?.id.includes('tumble_no')
            ? 'do_not_tumble'
            : drySymbol?.id.includes('tumble_low')
            ? 'tumble_low'
            : drySymbol?.id.includes('tumble_normal')
            ? 'tumble_high'
            : drySymbol?.id.includes('flat')
            ? 'flat_dry'
            : 'hang_dry',
          iron: ironSymbol?.id.includes('no')
            ? 'do_not_iron'
            : ironSymbol?.id.includes('high')
            ? 'high'
            : ironSymbol?.id.includes('medium')
            ? 'medium'
            : ironSymbol?.id.includes('low')
            ? 'low'
            : 'medium',
          bleach: bleachSymbol?.id.includes('no')
            ? 'do_not_bleach'
            : bleachSymbol?.id.includes('oxygen')
            ? 'non_chlorine'
            : 'allowed',
          professionalCare: 'dry_clean',
          tips: selectedSymbolsData.map(s => s.instruction),
        },
        scannedAt: new Date().toISOString(),
      };

      await saveToHistory(item);

      router.replace({
        pathname: '/result',
        params: { itemId: item.id, barcode: item.barcode },
      });
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de sauvegarder');
      setStep('symbols');
    }
  };

  const extractTemperature = (symbolId?: string): number | null => {
    if (!symbolId) return 30;
    if (symbolId.includes('hand') || symbolId.includes('no')) return null;
    const match = symbolId.match(/(\d+)/);
    return match ? parseInt(match[1]) : 30;
  };

  const resetScan = () => {
    setPhotoUri(null);
    setDetectedText('');
    setSelectedMaterial(null);
    setSelectedSymbols([]);
    setStep('photo');
  };

  // Permission check
  if (!permission) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
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
            Pour scanner l'étiquette d'entretien, Lya a besoin d'accéder à votre caméra.
          </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Autoriser l'accès</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Step: Take Photo
  if (step === 'photo') {
    return (
      <View style={styles.cameraContainer}>
        <CameraView ref={cameraRef} style={StyleSheet.absoluteFillObject} facing="back" />

        <View style={styles.overlay}>
          <View style={styles.topBar}>
            <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
              <ArrowLeft size={24} color={Colors.textWhite} strokeWidth={2} />
            </TouchableOpacity>
            <Text style={styles.topBarTitle}>Scanner l'étiquette</Text>
            <View style={{ width: 44 }} />
          </View>

          <View style={styles.frameContainer}>
            <View style={styles.labelFrame}>
              <Tag size={32} color={Colors.textWhite} strokeWidth={1.5} />
              <Text style={styles.frameText}>Centrez l'étiquette d'entretien</Text>
            </View>
          </View>

          <View style={styles.bottomBar}>
            <TouchableOpacity
              style={styles.captureButton}
              onPress={takePhoto}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <ActivityIndicator color={Colors.primary} />
              ) : (
                <Camera size={32} color={Colors.primary} strokeWidth={2} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  // Step: Select Material
  if (step === 'material') {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={resetScan} style={styles.headerButton}>
            <RotateCcw size={24} color={Colors.textPrimary} strokeWidth={2} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Matière</Text>
          <TouchableOpacity onPress={() => setStep('symbols')} style={styles.headerButtonPrimary}>
            <Text style={styles.headerButtonText}>Suivant</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {photoUri && (
            <View style={styles.photoPreview}>
              <Image source={{ uri: photoUri }} style={styles.previewImage} />
            </View>
          )}

          {detectedText ? (
            <View style={styles.detectedCard}>
              <Text style={styles.detectedLabel}>Texte détecté :</Text>
              <Text style={styles.detectedText}>{detectedText}</Text>
            </View>
          ) : null}

          <Text style={styles.sectionTitle}>Sélectionnez la matière principale</Text>

          <View style={styles.materialGrid}>
            {Object.entries(COMMON_MATERIALS).map(([key, { name }]) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.materialCard,
                  selectedMaterial === key && styles.materialCardSelected,
                ]}
                onPress={() => {
                  setSelectedMaterial(key);
                  setSelectedSymbols(COMMON_MATERIALS[key].defaultCare);
                }}
              >
                <Text
                  style={[
                    styles.materialText,
                    selectedMaterial === key && styles.materialTextSelected,
                  ]}
                >
                  {name}
                </Text>
                {selectedMaterial === key && (
                  <Check size={16} color={Colors.textWhite} strokeWidth={3} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  }

  // Step: Select Symbols
  if (step === 'symbols') {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setStep('material')} style={styles.headerButton}>
            <ArrowLeft size={24} color={Colors.textPrimary} strokeWidth={2} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Symboles</Text>
          <TouchableOpacity onPress={handleSave} style={styles.headerButtonPrimary}>
            <Text style={styles.headerButtonText}>Terminer</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.instruction}>
            Sélectionnez les symboles visibles sur l'étiquette :
          </Text>

          {Object.entries(SYMBOLS_BY_CATEGORY).map(([category, symbols]) => (
            <View key={category} style={styles.categorySection}>
              <Text style={styles.categoryTitle}>
                {CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS]}
              </Text>
              <View style={styles.symbolsGrid}>
                {symbols.map(symbol => (
                  <TouchableOpacity
                    key={symbol.id}
                    style={[
                      styles.symbolCard,
                      selectedSymbols.includes(symbol.id) && styles.symbolCardSelected,
                    ]}
                    onPress={() => toggleSymbol(symbol.id)}
                  >
                    <Text style={styles.symbolIcon}>{symbol.icon}</Text>
                    <Text
                      style={[
                        styles.symbolName,
                        selectedSymbols.includes(symbol.id) && styles.symbolNameSelected,
                      ]}
                      numberOfLines={2}
                    >
                      {symbol.name}
                    </Text>
                    {selectedSymbols.includes(symbol.id) && (
                      <View style={styles.checkBadge}>
                        <Check size={12} color={Colors.textWhite} strokeWidth={3} />
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }

  // Step: Processing
  return (
    <View style={styles.centerContainer}>
      <ActivityIndicator size="large" color={Colors.primary} />
      <Text style={styles.processingText}>Enregistrement...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  processingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.textSecondary,
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
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000',
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
  frameContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelFrame: {
    width: 280,
    height: 180,
    borderWidth: 3,
    borderColor: Colors.primary,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(124, 58, 237, 0.1)',
  },
  frameText: {
    color: Colors.textWhite,
    fontSize: 14,
    marginTop: 12,
    textAlign: 'center',
  },
  bottomBar: {
    alignItems: 'center',
    paddingBottom: 60,
  },
  captureButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.textWhite,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.large,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.small,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  headerButtonPrimary: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: BorderRadius.md,
  },
  headerButtonText: {
    color: Colors.textWhite,
    fontSize: 14,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  photoPreview: {
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    marginBottom: 16,
    ...Shadows.small,
  },
  previewImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  detectedCard: {
    backgroundColor: `${Colors.accent3}15`,
    borderRadius: BorderRadius.lg,
    padding: 16,
    marginBottom: 20,
  },
  detectedLabel: {
    fontSize: 12,
    color: Colors.accent3,
    fontWeight: '600',
    marginBottom: 4,
  },
  detectedText: {
    fontSize: 14,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  materialGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  materialCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: Colors.border,
    gap: 8,
  },
  materialCardSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  materialText: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  materialTextSelected: {
    color: Colors.textWhite,
  },
  instruction: {
    fontSize: 15,
    color: Colors.textSecondary,
    marginBottom: 20,
    lineHeight: 22,
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  symbolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  symbolCard: {
    width: '31%',
    backgroundColor: Colors.card,
    padding: 12,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
    position: 'relative',
    ...Shadows.small,
  },
  symbolCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: `${Colors.primary}10`,
  },
  symbolIcon: {
    fontSize: 20,
    marginBottom: 6,
  },
  symbolName: {
    fontSize: 11,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 14,
  },
  symbolNameSelected: {
    color: Colors.primary,
    fontWeight: '600',
  },
  checkBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
