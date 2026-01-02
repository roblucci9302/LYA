// Base de données des symboles d'entretien ISO 3758

export interface CareSymbol {
  id: string;
  category: 'wash' | 'bleach' | 'dry' | 'iron' | 'professional';
  name: string;
  description: string;
  icon: string; // Description de l'icône pour affichage
  instruction: string;
}

export const CARE_SYMBOLS: CareSymbol[] = [
  // === LAVAGE (Bassin) ===
  {
    id: 'wash_normal_95',
    category: 'wash',
    name: 'Lavage 95°C',
    description: 'Lavage en machine à 95°C',
    icon: '🫧 95',
    instruction: 'Lavage en machine à 95°C maximum, cycle normal',
  },
  {
    id: 'wash_normal_60',
    category: 'wash',
    name: 'Lavage 60°C',
    description: 'Lavage en machine à 60°C',
    icon: '🫧 60',
    instruction: 'Lavage en machine à 60°C maximum, cycle normal',
  },
  {
    id: 'wash_normal_40',
    category: 'wash',
    name: 'Lavage 40°C',
    description: 'Lavage en machine à 40°C',
    icon: '🫧 40',
    instruction: 'Lavage en machine à 40°C maximum, cycle normal',
  },
  {
    id: 'wash_normal_30',
    category: 'wash',
    name: 'Lavage 30°C',
    description: 'Lavage en machine à 30°C',
    icon: '🫧 30',
    instruction: 'Lavage en machine à 30°C maximum, cycle normal',
  },
  {
    id: 'wash_delicate_40',
    category: 'wash',
    name: 'Lavage délicat 40°C',
    description: 'Lavage délicat à 40°C (1 trait)',
    icon: '🫧 40 ~',
    instruction: 'Lavage en machine à 40°C, cycle délicat (action mécanique réduite)',
  },
  {
    id: 'wash_delicate_30',
    category: 'wash',
    name: 'Lavage délicat 30°C',
    description: 'Lavage délicat à 30°C (1 trait)',
    icon: '🫧 30 ~',
    instruction: 'Lavage en machine à 30°C, cycle délicat (action mécanique réduite)',
  },
  {
    id: 'wash_very_delicate_30',
    category: 'wash',
    name: 'Lavage très délicat 30°C',
    description: 'Lavage très délicat à 30°C (2 traits)',
    icon: '🫧 30 ~~',
    instruction: 'Lavage en machine à 30°C, cycle très délicat (laine/soie)',
  },
  {
    id: 'wash_hand',
    category: 'wash',
    name: 'Lavage à la main',
    description: 'Lavage à la main uniquement',
    icon: '🤚',
    instruction: 'Lavage à la main uniquement, température max 40°C',
  },
  {
    id: 'wash_no',
    category: 'wash',
    name: 'Ne pas laver',
    description: 'Ne pas laver en machine ni à la main',
    icon: '🚫🫧',
    instruction: 'Ne pas laver. Nettoyage à sec uniquement.',
  },

  // === BLANCHIMENT (Triangle) ===
  {
    id: 'bleach_any',
    category: 'bleach',
    name: 'Tous agents de blanchiment',
    description: 'Triangle vide - tout blanchiment autorisé',
    icon: '△',
    instruction: 'Tous types de blanchiment autorisés',
  },
  {
    id: 'bleach_oxygen',
    category: 'bleach',
    name: 'Blanchiment oxygéné',
    description: 'Triangle avec 2 lignes - sans chlore',
    icon: '△ //',
    instruction: 'Blanchiment à l\'oxygène uniquement (pas de chlore)',
  },
  {
    id: 'bleach_no',
    category: 'bleach',
    name: 'Ne pas blanchir',
    description: 'Triangle barré',
    icon: '🚫△',
    instruction: 'Ne pas utiliser d\'agent de blanchiment',
  },

  // === SÉCHAGE (Carré) ===
  {
    id: 'dry_tumble_normal',
    category: 'dry',
    name: 'Sèche-linge normal',
    description: 'Cercle dans carré - 2 points',
    icon: '⬜●●',
    instruction: 'Séchage en machine autorisé, température normale',
  },
  {
    id: 'dry_tumble_low',
    category: 'dry',
    name: 'Sèche-linge doux',
    description: 'Cercle dans carré - 1 point',
    icon: '⬜●',
    instruction: 'Séchage en machine à basse température',
  },
  {
    id: 'dry_tumble_no',
    category: 'dry',
    name: 'Pas de sèche-linge',
    description: 'Cercle barré dans carré',
    icon: '🚫⬜○',
    instruction: 'Ne pas mettre au sèche-linge',
  },
  {
    id: 'dry_line',
    category: 'dry',
    name: 'Séchage sur fil',
    description: 'Carré avec ligne verticale',
    icon: '⬜|',
    instruction: 'Sécher sur fil ou cintre',
  },
  {
    id: 'dry_flat',
    category: 'dry',
    name: 'Séchage à plat',
    description: 'Carré avec ligne horizontale',
    icon: '⬜—',
    instruction: 'Sécher à plat pour éviter la déformation',
  },
  {
    id: 'dry_drip',
    category: 'dry',
    name: 'Séchage par égouttage',
    description: 'Carré avec 3 lignes verticales',
    icon: '⬜|||',
    instruction: 'Laisser égoutter sans essorer',
  },
  {
    id: 'dry_shade',
    category: 'dry',
    name: 'Sécher à l\'ombre',
    description: 'Carré avec lignes diagonales',
    icon: '⬜///',
    instruction: 'Sécher à l\'ombre, éviter le soleil direct',
  },

  // === REPASSAGE (Fer) ===
  {
    id: 'iron_high',
    category: 'iron',
    name: 'Repassage haute temp',
    description: 'Fer avec 3 points - 200°C',
    icon: '🔥●●●',
    instruction: 'Repassage à haute température (200°C max) - Coton, Lin',
  },
  {
    id: 'iron_medium',
    category: 'iron',
    name: 'Repassage moyenne temp',
    description: 'Fer avec 2 points - 150°C',
    icon: '🔥●●',
    instruction: 'Repassage à température moyenne (150°C max) - Polyester, Laine',
  },
  {
    id: 'iron_low',
    category: 'iron',
    name: 'Repassage basse temp',
    description: 'Fer avec 1 point - 110°C',
    icon: '🔥●',
    instruction: 'Repassage à basse température (110°C max) - Soie, Synthétiques',
  },
  {
    id: 'iron_no_steam',
    category: 'iron',
    name: 'Repassage sans vapeur',
    description: 'Fer avec vapeur barrée',
    icon: '🔥🚫💨',
    instruction: 'Repasser sans vapeur',
  },
  {
    id: 'iron_no',
    category: 'iron',
    name: 'Ne pas repasser',
    description: 'Fer barré',
    icon: '🚫🔥',
    instruction: 'Ne pas repasser',
  },

  // === NETTOYAGE PROFESSIONNEL (Cercle) ===
  {
    id: 'pro_dry_any',
    category: 'professional',
    name: 'Nettoyage à sec',
    description: 'Cercle avec P',
    icon: 'Ⓟ',
    instruction: 'Nettoyage à sec avec tous solvants sauf trichloréthylène',
  },
  {
    id: 'pro_dry_gentle',
    category: 'professional',
    name: 'Nettoyage à sec doux',
    description: 'Cercle avec F',
    icon: 'Ⓕ',
    instruction: 'Nettoyage à sec avec solvants pétroliers uniquement',
  },
  {
    id: 'pro_wet',
    category: 'professional',
    name: 'Nettoyage professionnel humide',
    description: 'Cercle avec W',
    icon: 'Ⓦ',
    instruction: 'Nettoyage professionnel à l\'eau autorisé',
  },
  {
    id: 'pro_no',
    category: 'professional',
    name: 'Pas de nettoyage à sec',
    description: 'Cercle barré',
    icon: '🚫○',
    instruction: 'Ne pas nettoyer à sec',
  },
];

// Grouper par catégorie pour l'affichage
export const SYMBOLS_BY_CATEGORY = {
  wash: CARE_SYMBOLS.filter(s => s.category === 'wash'),
  bleach: CARE_SYMBOLS.filter(s => s.category === 'bleach'),
  dry: CARE_SYMBOLS.filter(s => s.category === 'dry'),
  iron: CARE_SYMBOLS.filter(s => s.category === 'iron'),
  professional: CARE_SYMBOLS.filter(s => s.category === 'professional'),
};

export const CATEGORY_LABELS = {
  wash: 'Lavage',
  bleach: 'Blanchiment',
  dry: 'Séchage',
  iron: 'Repassage',
  professional: 'Nettoyage pro',
};

// Matières communes et leurs instructions par défaut
export const COMMON_MATERIALS: Record<string, { name: string; defaultCare: string[] }> = {
  cotton: {
    name: 'Coton',
    defaultCare: ['wash_normal_40', 'bleach_oxygen', 'dry_tumble_low', 'iron_high'],
  },
  polyester: {
    name: 'Polyester',
    defaultCare: ['wash_normal_40', 'bleach_no', 'dry_tumble_low', 'iron_medium'],
  },
  wool: {
    name: 'Laine',
    defaultCare: ['wash_very_delicate_30', 'bleach_no', 'dry_flat', 'iron_low'],
  },
  silk: {
    name: 'Soie',
    defaultCare: ['wash_hand', 'bleach_no', 'dry_shade', 'iron_low'],
  },
  linen: {
    name: 'Lin',
    defaultCare: ['wash_normal_40', 'bleach_oxygen', 'dry_line', 'iron_high'],
  },
  viscose: {
    name: 'Viscose',
    defaultCare: ['wash_delicate_30', 'bleach_no', 'dry_flat', 'iron_medium'],
  },
  denim: {
    name: 'Jean/Denim',
    defaultCare: ['wash_normal_40', 'bleach_no', 'dry_line', 'iron_high'],
  },
  cashmere: {
    name: 'Cachemire',
    defaultCare: ['wash_hand', 'bleach_no', 'dry_flat', 'iron_low'],
  },
  leather: {
    name: 'Cuir',
    defaultCare: ['wash_no', 'bleach_no', 'dry_shade', 'iron_no'],
  },
  synthetic: {
    name: 'Synthétique',
    defaultCare: ['wash_normal_30', 'bleach_no', 'dry_tumble_low', 'iron_low'],
  },
};
