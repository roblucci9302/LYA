import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Scan, ChevronRight, Sparkles, Clock } from 'lucide-react-native';
import { getHistory } from '@/services/storage';
import { ClothingItem } from '@/types';
import { CardBlobs } from '@/components/DecorativeBlobs';
import Logo from '@/components/Logo';
import { Colors, Shadows, BorderRadius } from '@/constants/Theme';

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
    setRecentItems(history.slice(0, 4));
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

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Bonjour !</Text>
            <Text style={styles.title}>Prenez soin de{'\n'}vos vêtements</Text>
          </View>
        </View>

        {/* Hero Section with Logo */}
        <View style={styles.heroSection}>
          <Logo size={140} />
        </View>

        {/* Scan Button */}
        <TouchableOpacity
          style={styles.scanButton}
          onPress={handleScan}
          activeOpacity={0.9}
        >
          <View style={styles.scanButtonContent}>
            <View style={styles.scanIconContainer}>
              <Scan size={24} color={Colors.textWhite} strokeWidth={2} />
            </View>
            <View style={styles.scanTextContainer}>
              <Text style={styles.scanButtonTitle}>Scanner un vêtement</Text>
              <Text style={styles.scanButtonSubtitle}>Code-barres ou référence</Text>
            </View>
          </View>
          <ChevronRight size={24} color={Colors.textWhite} />
        </TouchableOpacity>

        {/* Features */}
        <View style={styles.featuresRow}>
          <View style={styles.featureCard}>
            <View style={[styles.featureIcon, { backgroundColor: `${Colors.accent3}20` }]}>
              <Sparkles size={20} color={Colors.accent3} />
            </View>
            <Text style={styles.featureText}>Instructions{'\n'}précises</Text>
          </View>
          <View style={styles.featureCard}>
            <View style={[styles.featureIcon, { backgroundColor: `${Colors.accent2}20` }]}>
              <Clock size={20} color={Colors.accent2} />
            </View>
            <Text style={styles.featureText}>Historique{'\n'}sauvegardé</Text>
          </View>
        </View>

        {/* Recent Items */}
        {recentItems.length > 0 && (
          <View style={styles.recentSection}>
            <Text style={styles.sectionTitle}>Récemment scannés</Text>
            <View style={styles.recentGrid}>
              {recentItems.map((item, index) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.recentCard}
                  onPress={() => handleItemPress(item)}
                  activeOpacity={0.8}
                >
                  <CardBlobs variant={((index % 4) + 1) as 1 | 2 | 3 | 4} />
                  <View style={styles.recentCardContent}>
                    <View style={styles.recentInitial}>
                      <Text style={styles.recentInitialText}>
                        {item.name.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <Text style={styles.recentName} numberOfLines={1}>{item.name}</Text>
                    <View style={styles.recentTempBadge}>
                      <Text style={styles.recentTempText}>
                        {item.careInstructions.washTemperature
                          ? `${item.careInstructions.washTemperature}°C`
                          : 'Main'}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Empty State */}
        {recentItems.length === 0 && (
          <View style={styles.emptyCard}>
            <CardBlobs variant={1} />
            <View style={styles.emptyContent}>
              <View style={styles.emptyIcon}>
                <Scan size={32} color={Colors.primary} />
              </View>
              <Text style={styles.emptyTitle}>Votre garde-robe vous attend</Text>
              <Text style={styles.emptyText}>
                Scannez votre premier vêtement pour découvrir ses instructions d'entretien
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textPrimary,
    lineHeight: 36,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  scanButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.xl,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    ...Shadows.large,
  },
  scanButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  scanIconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  scanTextContainer: {
    flex: 1,
  },
  scanButtonTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textWhite,
    marginBottom: 2,
  },
  scanButtonSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
  },
  featuresRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  featureCard: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    padding: 16,
    alignItems: 'center',
    ...Shadows.small,
  },
  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  recentSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  recentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  recentCard: {
    width: '47%',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    padding: 16,
    overflow: 'hidden',
    position: 'relative',
    ...Shadows.small,
  },
  recentCardContent: {
    zIndex: 10,
  },
  recentInitial: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.backgroundAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  recentInitialText: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.primary,
  },
  recentName: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  recentTempBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  recentTempText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textWhite,
  },
  emptyCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xxl,
    padding: 32,
    overflow: 'hidden',
    position: 'relative',
    ...Shadows.small,
  },
  emptyContent: {
    alignItems: 'center',
    zIndex: 10,
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: `${Colors.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
