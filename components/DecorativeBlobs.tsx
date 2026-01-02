import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Theme';

// Formes décoratives abstraites pour les cards
export function CardBlobs({ variant = 1 }: { variant?: 1 | 2 | 3 | 4 }) {
  const blobStyles = {
    1: [
      { top: -20, right: -20, size: 60, color: Colors.accent1, opacity: 0.3 },
      { bottom: 10, left: -10, size: 40, color: Colors.primaryLight, opacity: 0.2 },
    ],
    2: [
      { top: 10, right: -15, size: 50, color: Colors.accent2, opacity: 0.25 },
      { bottom: -15, right: 30, size: 35, color: Colors.accent5, opacity: 0.2 },
    ],
    3: [
      { top: -10, left: 20, size: 45, color: Colors.accent3, opacity: 0.25 },
      { bottom: -20, right: -10, size: 55, color: Colors.accent1, opacity: 0.15 },
    ],
    4: [
      { top: 5, right: 10, size: 40, color: Colors.accent4, opacity: 0.3 },
      { bottom: 5, left: -15, size: 50, color: Colors.accent2, opacity: 0.2 },
    ],
  };

  const blobs = blobStyles[variant];

  return (
    <>
      {blobs.map((blob, index) => (
        <View
          key={index}
          style={[
            styles.blob,
            {
              top: blob.top,
              bottom: blob.bottom,
              left: blob.left,
              right: blob.right,
              width: blob.size,
              height: blob.size,
              borderRadius: blob.size / 2,
              backgroundColor: blob.color,
              opacity: blob.opacity,
            },
          ]}
        />
      ))}
    </>
  );
}

// Grande illustration décorative pour l'accueil
export function HeroBlobs() {
  return (
    <View style={styles.heroContainer}>
      {/* Blob principal violet */}
      <View style={[styles.heroBlob, styles.heroBlobMain]} />
      {/* Blob secondaire rose */}
      <View style={[styles.heroBlob, styles.heroBlobSecondary]} />
      {/* Blob accent bleu */}
      <View style={[styles.heroBlob, styles.heroBlobAccent]} />
      {/* Petit blob vert */}
      <View style={[styles.heroBlob, styles.heroBlobSmall]} />
      {/* Icône centrale */}
      <View style={styles.heroIconContainer}>
        <View style={styles.heroIcon}>
          <View style={styles.heroIconInner} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  blob: {
    position: 'absolute',
  },
  heroContainer: {
    width: 200,
    height: 200,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroBlob: {
    position: 'absolute',
    borderRadius: 100,
  },
  heroBlobMain: {
    width: 140,
    height: 140,
    backgroundColor: Colors.primary,
    opacity: 0.15,
    top: 30,
    left: 30,
  },
  heroBlobSecondary: {
    width: 100,
    height: 100,
    backgroundColor: Colors.accent1,
    opacity: 0.2,
    top: 10,
    right: 20,
  },
  heroBlobAccent: {
    width: 80,
    height: 80,
    backgroundColor: Colors.accent2,
    opacity: 0.15,
    bottom: 20,
    left: 10,
  },
  heroBlobSmall: {
    width: 40,
    height: 40,
    backgroundColor: Colors.accent3,
    opacity: 0.3,
    bottom: 50,
    right: 30,
  },
  heroIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  heroIcon: {
    width: 50,
    height: 60,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroIconInner: {
    width: 30,
    height: 4,
    backgroundColor: Colors.textWhite,
    borderRadius: 2,
  },
});
