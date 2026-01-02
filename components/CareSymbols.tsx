import React from 'react';
import { View, Text } from 'react-native';
import { Droplets, Wind, Thermometer, CircleOff, Shirt, Sun, Snowflake } from 'lucide-react-native';
import { CareInstructions, WashType, DryType, IronType, BleachType } from '@/types';

interface CareSymbolsProps {
  instructions: CareInstructions;
}

export function CareSymbols({ instructions }: CareSymbolsProps) {
  return (
    <View className="flex-row flex-wrap justify-around py-4">
      <WashSymbol
        temperature={instructions.washTemperature}
        type={instructions.washType}
      />
      <DrySymbol type={instructions.dry} />
      <IronSymbol type={instructions.iron} />
      <BleachSymbol type={instructions.bleach} />
    </View>
  );
}

function WashSymbol({ temperature, type }: { temperature: number | null; type: WashType }) {
  const getWashInfo = () => {
    if (type === 'do_not_wash') {
      return { icon: CircleOff, label: 'Ne pas laver', color: '#EF476F' };
    }
    if (type === 'hand') {
      return { icon: Droplets, label: 'Lavage main', color: '#4361EE' };
    }
    const tempLabel = temperature ? `${temperature}°C` : 'Froid';
    const typeLabel = type === 'delicate' ? 'Délicat' : type === 'gentle' ? 'Doux' : 'Machine';
    return { icon: Droplets, label: `${typeLabel} ${tempLabel}`, color: '#4361EE' };
  };

  const { icon: Icon, label, color } = getWashInfo();

  return (
    <View className="items-center p-3">
      <View
        className="w-14 h-14 rounded-full items-center justify-center mb-2"
        style={{ backgroundColor: `${color}15` }}
      >
        <Icon size={28} color={color} />
      </View>
      <Text className="text-xs text-dark text-center font-medium">{label}</Text>
    </View>
  );
}

function DrySymbol({ type }: { type: DryType }) {
  const getDryInfo = () => {
    switch (type) {
      case 'tumble_low':
        return { icon: Wind, label: 'Sèche-linge doux', color: '#06D6A0' };
      case 'tumble_high':
        return { icon: Wind, label: 'Sèche-linge', color: '#06D6A0' };
      case 'hang_dry':
        return { icon: Sun, label: 'Séchage suspendu', color: '#FFD166' };
      case 'flat_dry':
        return { icon: Shirt, label: 'Séchage à plat', color: '#FFD166' };
      case 'do_not_tumble':
        return { icon: CircleOff, label: 'Pas de sèche-linge', color: '#EF476F' };
      default:
        return { icon: Wind, label: 'Séchage', color: '#06D6A0' };
    }
  };

  const { icon: Icon, label, color } = getDryInfo();

  return (
    <View className="items-center p-3">
      <View
        className="w-14 h-14 rounded-full items-center justify-center mb-2"
        style={{ backgroundColor: `${color}15` }}
      >
        <Icon size={28} color={color} />
      </View>
      <Text className="text-xs text-dark text-center font-medium">{label}</Text>
    </View>
  );
}

function IronSymbol({ type }: { type: IronType }) {
  const getIronInfo = () => {
    switch (type) {
      case 'high':
        return { label: 'Fer chaud (200°C)', color: '#EF476F', dots: 3 };
      case 'medium':
        return { label: 'Fer moyen (150°C)', color: '#FFD166', dots: 2 };
      case 'low':
        return { label: 'Fer doux (110°C)', color: '#06D6A0', dots: 1 };
      case 'do_not_iron':
        return { label: 'Ne pas repasser', color: '#EF476F', dots: 0 };
      case 'no_steam':
        return { label: 'Sans vapeur', color: '#FFD166', dots: 2 };
      default:
        return { label: 'Repassage', color: '#4361EE', dots: 2 };
    }
  };

  const { label, color, dots } = getIronInfo();
  const Icon = dots === 0 ? CircleOff : Thermometer;

  return (
    <View className="items-center p-3">
      <View
        className="w-14 h-14 rounded-full items-center justify-center mb-2"
        style={{ backgroundColor: `${color}15` }}
      >
        <Icon size={28} color={color} />
        {dots > 0 && (
          <View className="absolute bottom-3 flex-row">
            {Array.from({ length: dots }).map((_, i) => (
              <View
                key={i}
                className="w-1.5 h-1.5 rounded-full mx-0.5"
                style={{ backgroundColor: color }}
              />
            ))}
          </View>
        )}
      </View>
      <Text className="text-xs text-dark text-center font-medium">{label}</Text>
    </View>
  );
}

function BleachSymbol({ type }: { type: BleachType }) {
  const getBleachInfo = () => {
    switch (type) {
      case 'allowed':
        return { label: 'Javel autorisée', color: '#06D6A0' };
      case 'non_chlorine':
        return { label: 'Javel sans chlore', color: '#FFD166' };
      case 'do_not_bleach':
        return { label: 'Pas de javel', color: '#EF476F' };
      default:
        return { label: 'Blanchiment', color: '#4361EE' };
    }
  };

  const { label, color } = getBleachInfo();
  const Icon = type === 'do_not_bleach' ? CircleOff : Snowflake;

  return (
    <View className="items-center p-3">
      <View
        className="w-14 h-14 rounded-full items-center justify-center mb-2"
        style={{ backgroundColor: `${color}15` }}
      >
        <Icon size={28} color={color} />
      </View>
      <Text className="text-xs text-dark text-center font-medium">{label}</Text>
    </View>
  );
}
