import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, RefreshControl, StyleSheet } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Trash2, ChevronRight, Shirt, Droplets } from 'lucide-react-native';
import { getHistory, clearHistory } from '@/services/storage';
import { ClothingItem } from '@/types';
import { CardBlobs } from '@/components/DecorativeBlobs';
import { Colors, BorderRadius, Shadows } from '@/constants/Theme';

export default function HistoryScreen() {
  const router = useRouter();
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadHistory = async () => {
    const history = await getHistory();
    setItems(history);
  };

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadHistory();
    setRefreshing(false);
  };

  const handleItemPress = (item: ClothingItem) => {
    router.push({
      pathname: '/result',
      params: { itemId: item.id, barcode: item.barcode },
    });
  };

  const handleClearHistory = () => {
    Alert.alert(
      'Effacer l\'historique',
      'Cette action supprimera définitivement tous vos vêtements enregistrés.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Effacer',
          style: 'destructive',
          onPress: async () => {
            await clearHistory();
            setItems([]);
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Ma garde-robe</Text>
          <Text style={styles.headerSubtitle}>
            {items.length} {items.length > 1 ? 'vêtements' : 'vêtement'}
          </Text>
        </View>
        {items.length > 0 && (
          <TouchableOpacity onPress={handleClearHistory} style={styles.clearButton}>
            <Trash2 size={20} color={Colors.error} strokeWidth={2} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
        }
      >
        {items.length > 0 ? (
          <View style={styles.listContainer}>
            {items.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                style={styles.itemCard}
                onPress={() => handleItemPress(item)}
                activeOpacity={0.8}
              >
                <CardBlobs variant={((index % 4) + 1) as 1 | 2 | 3 | 4} />
                <View style={styles.cardContent}>
                  <View style={styles.itemLeft}>
                    <View style={styles.itemAvatar}>
                      <Text style={styles.itemAvatarText}>
                        {item.name.charAt(0).toUpperCase()}
                      </Text>
                    </View>

                    <View style={styles.itemInfo}>
                      <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                      {item.brand && (
                        <Text style={styles.itemBrand}>{item.brand}</Text>
                      )}
                      <View style={styles.itemMeta}>
                        <View style={styles.tempBadge}>
                          <Droplets size={10} color={Colors.textWhite} />
                          <Text style={styles.tempText}>
                            {item.careInstructions.washTemperature
                              ? `${item.careInstructions.washTemperature}°C`
                              : 'Main'}
                          </Text>
                        </View>
                        <Text style={styles.itemDate}>{formatDate(item.scannedAt)}</Text>
                      </View>
                    </View>
                  </View>

                  <ChevronRight size={20} color={Colors.textLight} strokeWidth={2} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.emptyCard}>
            <CardBlobs variant={2} />
            <View style={styles.emptyContent}>
              <View style={styles.emptyIcon}>
                <Shirt size={40} color={Colors.primary} strokeWidth={1.5} />
              </View>
              <Text style={styles.emptyTitle}>Votre garde-robe est vide</Text>
              <Text style={styles.emptyText}>
                Les vêtements que vous scannez apparaîtront ici pour un accès rapide à leurs instructions d'entretien.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  clearButton: {
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
  listContainer: {
    gap: 12,
  },
  itemCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    padding: 16,
    overflow: 'hidden',
    position: 'relative',
    ...Shadows.small,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  itemAvatar: {
    width: 52,
    height: 52,
    borderRadius: BorderRadius.md,
    backgroundColor: `${Colors.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  itemAvatarText: {
    fontSize: 22,
    fontWeight: '600',
    color: Colors.primary,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  itemBrand: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  itemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tempBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    marginRight: 10,
    gap: 4,
  },
  tempText: {
    fontSize: 11,
    color: Colors.textWhite,
    fontWeight: '600',
  },
  itemDate: {
    fontSize: 12,
    color: Colors.textLight,
  },
  emptyCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xxl,
    padding: 40,
    marginTop: 40,
    overflow: 'hidden',
    position: 'relative',
    ...Shadows.small,
  },
  emptyContent: {
    alignItems: 'center',
    zIndex: 10,
  },
  emptyIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: `${Colors.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});
