import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Shirt, Lightbulb, Trash2, Droplets, Wind, Thermometer, CircleOff, Sun, Snowflake } from 'lucide-react-native';
import { getHistory, removeFromHistory } from '@/services/storage';
import { ClothingItem, CareInstructions } from '@/types';

export default function ResultScreen() {
  const router = useRouter();
  const { barcode } = useLocalSearchParams<{ itemId: string; barcode: string }>();
  const [item, setItem] = useState<ClothingItem | null>(null);

  useEffect(() => {
    loadItem();
  }, [barcode]);

  const loadItem = async () => {
    const history = await getHistory();
    const found = history.find((h) => h.barcode === barcode);
    setItem(found || null);
  };

  const handleDelete = async () => {
    if (item) {
      await removeFromHistory(item.barcode);
      router.back();
    }
  };

  if (!item) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={28} color="#1A1A2E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Détails</Text>
        <TouchableOpacity onPress={handleDelete}>
          <Trash2 size={22} color="#EF476F" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Product Info */}
        <View style={styles.productInfo}>
          <View style={styles.productIcon}>
            <Shirt size={40} color="#4361EE" />
          </View>
          <Text style={styles.productName}>{item.name}</Text>
          {item.brand && <Text style={styles.productBrand}>{item.brand}</Text>}
          {item.category && (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{item.category}</Text>
            </View>
          )}
        </View>

        {/* Care Symbols */}
        <View style={styles.careSection}>
          <Text style={styles.sectionTitle}>Instructions d'entretien</Text>
          <CareSymbolsDisplay instructions={item.careInstructions} />
        </View>

        {/* Tips */}
        {item.careInstructions.tips && item.careInstructions.tips.length > 0 && (
          <View style={styles.tipsSection}>
            <View style={styles.tipsHeader}>
              <Lightbulb size={24} color="#4361EE" />
              <Text style={styles.tipsTitle}>Conseils</Text>
            </View>
            {item.careInstructions.tips.map((tip, index) => (
              <View key={index} style={styles.tipItem}>
                <View style={styles.tipBullet} />
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Barcode info */}
        <View style={styles.barcodeInfo}>
          <Text style={styles.barcodeText}>Code-barres : {item.barcode}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

function CareSymbolsDisplay({ instructions }: { instructions: CareInstructions }) {
  return (
    <View style={styles.symbolsContainer}>
      <CareSymbol
        icon={instructions.washType === 'do_not_wash' ? CircleOff : Droplets}
        label={getWashLabel(instructions)}
        color={instructions.washType === 'do_not_wash' ? '#EF476F' : '#4361EE'}
      />
      <CareSymbol
        icon={instructions.dry === 'do_not_tumble' ? CircleOff : Wind}
        label={getDryLabel(instructions.dry)}
        color={instructions.dry === 'do_not_tumble' ? '#EF476F' : '#06D6A0'}
      />
      <CareSymbol
        icon={instructions.iron === 'do_not_iron' ? CircleOff : Thermometer}
        label={getIronLabel(instructions.iron)}
        color={instructions.iron === 'do_not_iron' ? '#EF476F' : '#FFD166'}
      />
      <CareSymbol
        icon={instructions.bleach === 'do_not_bleach' ? CircleOff : Snowflake}
        label={getBleachLabel(instructions.bleach)}
        color={instructions.bleach === 'do_not_bleach' ? '#EF476F' : '#06D6A0'}
      />
    </View>
  );
}

function CareSymbol({ icon: Icon, label, color }: { icon: any; label: string; color: string }) {
  return (
    <View style={styles.symbolItem}>
      <View style={[styles.symbolIcon, { backgroundColor: `${color}15` }]}>
        <Icon size={28} color={color} />
      </View>
      <Text style={styles.symbolLabel}>{label}</Text>
    </View>
  );
}

function getWashLabel(instructions: CareInstructions): string {
  if (instructions.washType === 'do_not_wash') return 'Ne pas laver';
  if (instructions.washType === 'hand') return 'Lavage main';
  const temp = instructions.washTemperature ? `${instructions.washTemperature}°C` : 'Froid';
  const type = instructions.washType === 'delicate' ? 'Délicat' : 'Machine';
  return `${type} ${temp}`;
}

function getDryLabel(type: string): string {
  switch (type) {
    case 'tumble_low': return 'Sèche-linge doux';
    case 'tumble_high': return 'Sèche-linge';
    case 'hang_dry': return 'Séchage suspendu';
    case 'flat_dry': return 'Séchage à plat';
    case 'do_not_tumble': return 'Pas de sèche-linge';
    default: return 'Séchage';
  }
}

function getIronLabel(type: string): string {
  switch (type) {
    case 'high': return 'Fer chaud (200°C)';
    case 'medium': return 'Fer moyen (150°C)';
    case 'low': return 'Fer doux (110°C)';
    case 'do_not_iron': return 'Ne pas repasser';
    case 'no_steam': return 'Sans vapeur';
    default: return 'Repassage';
  }
}

function getBleachLabel(type: string): string {
  switch (type) {
    case 'allowed': return 'Javel autorisée';
    case 'non_chlorine': return 'Javel sans chlore';
    case 'do_not_bleach': return 'Pas de javel';
    default: return 'Blanchiment';
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A2E',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  productInfo: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  productIcon: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A2E',
    textAlign: 'center',
  },
  productBrand: {
    fontSize: 18,
    color: '#6B7280',
    marginTop: 4,
  },
  categoryBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 12,
  },
  categoryText: {
    fontSize: 14,
    color: '#6B7280',
  },
  careSection: {
    backgroundColor: '#F8F9FA',
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 16,
  },
  symbolsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  symbolItem: {
    alignItems: 'center',
    width: '45%',
    marginBottom: 20,
  },
  symbolIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  symbolLabel: {
    fontSize: 12,
    color: '#1A1A2E',
    textAlign: 'center',
    fontWeight: '500',
  },
  tipsSection: {
    backgroundColor: '#EEF2FF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A2E',
    marginLeft: 8,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  tipBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4361EE',
    marginTop: 6,
    marginRight: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 22,
  },
  barcodeInfo: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  barcodeText: {
    fontSize: 12,
    color: '#D1D5DB',
  },
});
