import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Trash2, Droplets, Wind, Flame, Sparkles, Lightbulb, Pencil } from 'lucide-react-native';
import { getHistory, removeFromHistory, updateItemName } from '@/services/storage';
import { ClothingItem, CareInstructions } from '@/types';
import { CardBlobs } from '@/components/DecorativeBlobs';
import { Colors, BorderRadius, Shadows } from '@/constants/Theme';

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

  const handleRename = () => {
    if (!item) return;

    Alert.prompt(
      'Renommer le vêtement',
      'Entrez un nouveau nom pour ce vêtement',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Enregistrer',
          onPress: async (newName) => {
            if (newName && newName.trim()) {
              await updateItemName(item.barcode, newName.trim());
              setItem({ ...item, name: newName.trim() });
            }
          },
        },
      ],
      'plain-text',
      item.name
    );
  };

  if (!item) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingSpinner}>
          <Droplets size={32} color={Colors.primary} strokeWidth={2} />
        </View>
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.headerButton}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          activeOpacity={0.7}
        >
          <ArrowLeft size={24} color={Colors.textPrimary} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Détails</Text>
        <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
          <Trash2 size={20} color={Colors.error} strokeWidth={2} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Product Hero Card */}
        <View style={styles.heroCard}>
          <CardBlobs variant={1} />
          <View style={styles.heroContent}>
            <View style={styles.productAvatar}>
              <Text style={styles.productAvatarText}>
                {item.name.charAt(0).toUpperCase()}
              </Text>
            </View>

            <View style={styles.nameRow}>
              <Text style={styles.productName}>{item.name}</Text>
              <TouchableOpacity
                onPress={handleRename}
                style={styles.renameButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Pencil size={18} color={Colors.primary} strokeWidth={2} />
              </TouchableOpacity>
            </View>
            {item.brand && <Text style={styles.productBrand}>{item.brand}</Text>}

            {item.category && (
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{item.category}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Care Instructions */}
        <Text style={styles.sectionTitle}>Instructions d'entretien</Text>

        <View style={styles.careGrid}>
          <CareCard
            icon={Droplets}
            title="Lavage"
            value={getWashLabel(item.careInstructions)}
            color={Colors.accent2}
            warning={item.careInstructions.washType === 'do_not_wash'}
          />
          <CareCard
            icon={Wind}
            title="Séchage"
            value={getDryLabel(item.careInstructions.dry)}
            color={Colors.accent5}
            warning={item.careInstructions.dry === 'do_not_tumble'}
          />
          <CareCard
            icon={Flame}
            title="Repassage"
            value={getIronLabel(item.careInstructions.iron)}
            color={Colors.accent4}
            warning={item.careInstructions.iron === 'do_not_iron'}
          />
          <CareCard
            icon={Sparkles}
            title="Blanchiment"
            value={getBleachLabel(item.careInstructions.bleach)}
            color={Colors.accent3}
            warning={item.careInstructions.bleach === 'do_not_bleach'}
          />
        </View>

        {/* Tips Section */}
        {item.careInstructions.tips && item.careInstructions.tips.length > 0 && (
          <View style={styles.tipsCard}>
            <CardBlobs variant={3} />
            <View style={styles.tipsContent}>
              <View style={styles.tipsHeader}>
                <View style={styles.tipsIcon}>
                  <Lightbulb size={20} color={Colors.accent4} strokeWidth={2} />
                </View>
                <Text style={styles.tipsTitle}>Conseils d'expert</Text>
              </View>

              {item.careInstructions.tips.map((tip, index) => (
                <View key={index} style={styles.tipItem}>
                  <View style={styles.tipNumber}>
                    <Text style={styles.tipNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.tipText}>{tip}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Barcode Reference */}
        <View style={styles.barcodeSection}>
          <Text style={styles.barcodeLabel}>Référence</Text>
          <Text style={styles.barcodeText}>{item.barcode}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

function CareCard({
  icon: Icon,
  title,
  value,
  color,
  warning = false
}: {
  icon: any;
  title: string;
  value: string;
  color: string;
  warning?: boolean;
}) {
  return (
    <View style={styles.careCard}>
      <View style={[styles.careIcon, { backgroundColor: `${color}20` }]}>
        <Icon size={24} color={warning ? Colors.error : color} strokeWidth={2} />
      </View>
      <Text style={styles.careTitle}>{title}</Text>
      <Text style={[styles.careValue, warning && styles.careValueWarning]}>{value}</Text>
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
    case 'tumble_high': return 'Sèche-linge normal';
    case 'hang_dry': return 'Suspendre';
    case 'flat_dry': return 'Sécher à plat';
    case 'do_not_tumble': return 'Pas de sèche-linge';
    default: return 'Standard';
  }
}

function getIronLabel(type: string): string {
  switch (type) {
    case 'high': return '200°C max';
    case 'medium': return '150°C max';
    case 'low': return '110°C max';
    case 'do_not_iron': return 'Ne pas repasser';
    case 'no_steam': return 'Sans vapeur';
    default: return 'Standard';
  }
}

function getBleachLabel(type: string): string {
  switch (type) {
    case 'allowed': return 'Autorisé';
    case 'non_chlorine': return 'Sans chlore';
    case 'do_not_bleach': return 'Interdit';
    default: return 'Non recommandé';
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
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
    fontSize: 16,
    color: Colors.textSecondary,
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
  deleteButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    backgroundColor: `${Colors.error}15`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  heroCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xxl,
    padding: 32,
    marginBottom: 24,
    overflow: 'hidden',
    position: 'relative',
    ...Shadows.medium,
  },
  heroContent: {
    alignItems: 'center',
    zIndex: 10,
  },
  productAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: `${Colors.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  productAvatarText: {
    fontSize: 40,
    fontWeight: '600',
    color: Colors.primary,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  productName: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  renameButton: {
    marginLeft: 8,
    padding: 4,
  },
  productBrand: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  categoryBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textWhite,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  careGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  careCard: {
    width: '48%',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    padding: 16,
    alignItems: 'center',
    ...Shadows.small,
  },
  careIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  careTitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  careValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  careValueWarning: {
    color: Colors.error,
  },
  tipsCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    padding: 20,
    marginBottom: 24,
    overflow: 'hidden',
    position: 'relative',
    ...Shadows.small,
  },
  tipsContent: {
    zIndex: 10,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  tipsIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${Colors.accent4}20`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  tipItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  tipNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  tipNumberText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textWhite,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  barcodeSection: {
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 8,
  },
  barcodeLabel: {
    fontSize: 12,
    color: Colors.textLight,
    marginBottom: 4,
  },
  barcodeText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontFamily: 'monospace',
  },
});
