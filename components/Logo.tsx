import React from 'react';
import Svg, { Defs, LinearGradient, Stop, Rect, Path, Text, G, Circle } from 'react-native-svg';

interface LogoProps {
  size?: number;
  showText?: boolean;
}

export default function Logo({ size = 100, showText = false }: LogoProps) {
  const height = showText ? size * 1.4 : size;
  const viewBoxHeight = showText ? 1400 : 1024;

  return (
    <Svg width={size} height={height} viewBox={`0 0 1024 ${viewBoxHeight}`}>
      <Defs>
        <LinearGradient id="bgGradient" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#B8A4E3" />
          <Stop offset="100%" stopColor="#7B5FC4" />
        </LinearGradient>
      </Defs>

      {/* Fond carré arrondi */}
      <Rect
        x="64"
        y="64"
        width="896"
        height="896"
        rx="200"
        fill="url(#bgGradient)"
      />

      {/* Robe de bal - style SF Symbols amélioré */}
      <G fill="#FFFFFF">
        {/* Bretelles fines et délicates */}
        <Path
          d="M455 330 Q430 300 410 270 L420 265 Q442 295 462 325 Z"
        />
        <Path
          d="M569 330 Q594 300 614 270 L604 265 Q582 295 562 325 Z"
        />

        {/* Bustier arrondi */}
        <Path
          d="M450 320
             Q512 310 574 320
             Q580 370 560 420
             Q512 430 464 420
             Q444 370 450 320
             Z"
        />

        {/* Taille cintrée */}
        <Path
          d="M464 420
             Q512 410 560 420
             L555 460
             Q512 450 469 460
             Z"
        />

        {/* Jupe ample avec bas courbé */}
        <Path
          d="M469 460
             Q370 520 260 800
             Q512 840 764 800
             Q654 520 555 460
             Q512 450 469 460
             Z"
        />
      </G>

      {/* Sparkles - étincelles variées */}
      <G fill="#FFFFFF">
        {/* Grande étoile haut gauche (extérieur) */}
        <Path d="M310 360 L330 420 L310 480 L290 420 Z" />

        {/* Petite étoile haut droite (extérieur) */}
        <Path d="M710 340 L720 370 L710 400 L700 370 Z" />

        {/* Moyenne étoile SUR la jupe gauche */}
        <Path d="M400 620 L415 665 L400 710 L385 665 Z" />

        {/* Grande étoile SUR la jupe droite */}
        <Path d="M600 580 L620 645 L600 710 L580 645 Z" />

        {/* Petite étoile SUR la jupe centre-bas */}
        <Path d="M500 720 L508 745 L500 770 L492 745 Z" />

        {/* Petite étoile extérieur bas droite */}
        <Path d="M720 650 L728 675 L720 700 L712 675 Z" opacity="0.85" />
      </G>

      {/* Texte "Lya" */}
      {showText && (
        <Text
          x="512"
          y="1300"
          textAnchor="middle"
          fontFamily="System"
          fontSize="260"
          fontWeight="700"
          fill="#7B5FC4"
        >
          Lya
        </Text>
      )}
    </Svg>
  );
}
