import AsyncStorage from '@react-native-async-storage/async-storage';
import { ClothingItem } from '@/types';

const STORAGE_KEY = 'lya_clothing_history';

export async function getHistory(): Promise<ClothingItem[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading history:', error);
    return [];
  }
}

export async function saveToHistory(item: ClothingItem): Promise<void> {
  try {
    const history = await getHistory();
    const existingIndex = history.findIndex(h => h.barcode === item.barcode);

    if (existingIndex >= 0) {
      history[existingIndex] = { ...item, scannedAt: new Date().toISOString() };
    } else {
      history.unshift(item);
    }

    // Keep only last 50 items
    const trimmedHistory = history.slice(0, 50);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedHistory));
  } catch (error) {
    console.error('Error saving to history:', error);
  }
}

export async function removeFromHistory(barcode: string): Promise<void> {
  try {
    const history = await getHistory();
    const filtered = history.filter(h => h.barcode !== barcode);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error removing from history:', error);
  }
}

export async function clearHistory(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing history:', error);
  }
}

export async function updateItemName(barcode: string, newName: string): Promise<void> {
  try {
    const history = await getHistory();
    const index = history.findIndex(h => h.barcode === barcode);

    if (index >= 0) {
      history[index].name = newName;
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    }
  } catch (error) {
    console.error('Error updating item name:', error);
  }
}
