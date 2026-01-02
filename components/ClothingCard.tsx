import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Shirt, ChevronRight, Clock } from 'lucide-react-native';
import { ClothingItem } from '@/types';

interface ClothingCardProps {
  item: ClothingItem;
  onPress: () => void;
}

export function ClothingCard({ item, onPress }: ClothingCardProps) {
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
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-2xl p-4 mb-3 flex-row items-center shadow-sm"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
      }}
    >
      <View className="w-12 h-12 bg-primary/10 rounded-xl items-center justify-center mr-4">
        <Shirt size={24} color="#4361EE" />
      </View>

      <View className="flex-1">
        <Text className="text-dark font-semibold text-base" numberOfLines={1}>
          {item.name}
        </Text>
        {item.brand && (
          <Text className="text-gray-500 text-sm" numberOfLines={1}>
            {item.brand}
          </Text>
        )}
        <View className="flex-row items-center mt-1">
          <Clock size={12} color="#9CA3AF" />
          <Text className="text-gray-400 text-xs ml-1">
            {formatDate(item.scannedAt)}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center">
        <View className="bg-primary/10 px-2 py-1 rounded-full mr-2">
          <Text className="text-primary text-xs font-medium">
            {item.careInstructions.washTemperature
              ? `${item.careInstructions.washTemperature}°C`
              : 'Main'}
          </Text>
        </View>
        <ChevronRight size={20} color="#9CA3AF" />
      </View>
    </TouchableOpacity>
  );
}
