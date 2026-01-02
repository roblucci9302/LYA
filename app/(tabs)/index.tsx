import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Shirt, Camera, Clock, ChevronRight } from 'lucide-react-native';
import { getHistory } from '@/services/storage';
import { ClothingItem } from '@/types';

export default function HomeScreen() {
  const router = useRouter();
  const [recentItems, setRecentItems] = useState<ClothingItem[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadRecentItems();
    }, [])
  );

  const loadRecentItems = async () => {
    const history = await getHistory();
    setRecentItems(history.slice(0, 3));
  };

  const handleScan = () => {
    router.push('/scan');
  };

  const handleItemPress = (item: ClothingItem) => {
    router.push({
      pathname: '/result',
      params: { itemId: item.id, barcode: item.barcode },
    });
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
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Shirt size={36} color="#4361EE" />
          <Text style={styles.logoText}>Lya</Text>
        </View>
        <Text style={styles.tagline}>Prenez soin de vos vêtements</Text>
      </View>

      {/* Scan Button */}
      <TouchableOpacity style={styles.scanButton} onPress={handleScan}>
        <View style={styles.scanButtonInner}>
          <Camera size={48} color="#FFFFFF" />
        </View>
        <Text style={styles.scanButtonText}>Scanner un vêtement</Text>
        <Text style={styles.scanButtonSubtext}>Code-barres ou référence</Text>
      </TouchableOpacity>

      {/* Recent Items */}
      {recentItems.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Récemment scannés</Text>
          {recentItems.map((item) => (
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
        </View>
      )}

      {/* Empty State */}
      {recentItems.length === 0 && (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Shirt size={40} color="#9CA3AF" />
          </View>
          <Text style={styles.emptyText}>
            Scannez votre premier vêtement{'\n'}pour commencer
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  logoText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#1A1A2E',
    marginLeft: 10,
  },
  tagline: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  scanButton: {
    alignItems: 'center',
    marginBottom: 40,
  },
  scanButtonInner: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#4361EE',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4361EE',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  scanButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A2E',
    marginTop: 16,
  },
  scanButtonSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
  },
  section: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A2E',
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
    paddingVertical: 40,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 24,
  },
});
