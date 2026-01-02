export interface ClothingItem {
  id: string;
  barcode: string;
  name: string;
  brand?: string;
  category?: string;
  material?: string;
  imageUrl?: string;
  careInstructions: CareInstructions;
  scannedAt: string;
}

export interface CareInstructions {
  washTemperature: number | null;
  washType: WashType;
  bleach: BleachType;
  dry: DryType;
  iron: IronType;
  professionalCare: ProfessionalCareType;
  tips?: string[];
}

export type WashType =
  | 'machine'
  | 'hand'
  | 'do_not_wash'
  | 'delicate'
  | 'gentle';

export type BleachType =
  | 'allowed'
  | 'non_chlorine'
  | 'do_not_bleach';

export type DryType =
  | 'tumble_low'
  | 'tumble_high'
  | 'hang_dry'
  | 'flat_dry'
  | 'do_not_tumble';

export type IronType =
  | 'high'
  | 'medium'
  | 'low'
  | 'do_not_iron'
  | 'no_steam';

export type ProfessionalCareType =
  | 'dry_clean'
  | 'wet_clean'
  | 'do_not_dry_clean';

export interface BarcodeApiResponse {
  success: boolean;
  product?: {
    name: string;
    brand?: string;
    category?: string;
    description?: string;
    images?: string[];
  };
  error?: string;
}
