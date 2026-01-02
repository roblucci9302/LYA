import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { Camera } from 'lucide-react-native';

interface ScanButtonProps {
  onPress: () => void;
}

export function ScanButton({ onPress }: ScanButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-primary rounded-full py-4 px-8 flex-row items-center justify-center shadow-lg"
      style={{
        shadowColor: '#4361EE',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
      }}
    >
      <Camera size={24} color="#FFFFFF" />
      <Text className="text-white font-semibold text-lg ml-3">
        Scanner
      </Text>
    </TouchableOpacity>
  );
}

export function ScanButtonLarge({ onPress }: ScanButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="items-center"
    >
      <View
        className="w-32 h-32 bg-primary rounded-full items-center justify-center shadow-xl"
        style={{
          shadowColor: '#4361EE',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.4,
          shadowRadius: 16,
          elevation: 12,
        }}
      >
        <Camera size={48} color="#FFFFFF" />
      </View>
      <Text className="text-dark font-semibold text-lg mt-4">
        Scanner un vêtement
      </Text>
      <Text className="text-gray-400 text-sm mt-1">
        Code-barres ou référence
      </Text>
    </TouchableOpacity>
  );
}
