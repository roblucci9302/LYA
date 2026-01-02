import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, RefreshControl, StyleSheet } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Trash2, Shirt, Clock, ChevronRight } from 'lucide-react-native';
import { getHistory, clearHistory } from '@/services/storage';
import { ClothingItem } from '@/types';

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
      'Voulez-vous vraiment supprimer tous les vêtements de votre historique ?',
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
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "À l'instant";
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    return date.toLocaleDateString('fr-FR');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Historique</Text>
        {items.length > 0 && (
          <TouchableOpacity onPress={handleClearHistory}>
            <Trash2 size={22} color="#EF476F" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {items.length > 0 ? (
          <>
            <Text style={styles.count}>
              {items.length} vêtement{items.length > 1 ? 's' : ''} scanné{items.length > 1 ? 's' : ''}
            </Text>
            {items.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.itemCard}
                onPress={() => handleItemPress(item)}
              >
                <View style={styles.itemIcon}>
                  <Shirt size={24} color="#4361EE" />
                </View>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                  {item.brand && <Text style={styles.itemBrand}>{item.brand}</Text>}
                  <View style={styles.itemMeta}>
                    <Clock size={12} color="#9CA3AF" />
                    <Text style={styles.itemDate}>{formatDate(item.scannedAt)}</Text>
                  </View>
                </View>
                <View style={styles.itemRight}>
                  <View style={styles.tempBadge}>
                    <Text style={styles.tempText}>
                      {item.careInstructions.washTemperature
                        ? `${item.careInstructions.washTemperature}°C`
                        : 'Main'}
                    </Text>
                  </View>
                  <ChevronRight size={20} color="#9CA3AF" />
                </View>
              </TouchableOpacity>
            ))}
          </>
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Shirt size={48} color="#9CA3AF" />
            </View>
            <Text style={styles.emptyTitle}>Aucun historique</Text>
            <Text style={styles.emptyText}>
              Les vêtements que vous scannez apparaîtront ici
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A2E',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  count: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 16,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  itemIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A2E',
  },
  itemBrand: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  itemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  itemDate: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 4,
  },
  itemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tempBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  tempText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4361EE',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});
