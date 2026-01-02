import { BarcodeApiResponse, CareInstructions, ClothingItem } from '@/types';

// Note: Pour la production, utiliser Go-UPC API (https://go-upc.com/)
// Clé API gratuite : 1000 requêtes/mois
const API_KEY = 'YOUR_GO_UPC_API_KEY';
const BASE_URL = 'https://go-upc.com/api/v1/code';

export async function lookupBarcode(barcode: string): Promise<BarcodeApiResponse> {
  try {
    // Pour le développement, on simule une réponse
    // En production, décommenter l'appel API réel

    /*
    const response = await fetch(`${BASE_URL}/${barcode}`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error('Product not found');
    }

    const data = await response.json();
    return {
      success: true,
      product: {
        name: data.product?.name || 'Produit inconnu',
        brand: data.product?.brand,
        category: data.product?.category,
        description: data.product?.description,
        images: data.product?.imageUrl ? [data.product.imageUrl] : [],
      },
    };
    */

    // Simulation pour le développement
    return simulateApiResponse(barcode);
  } catch (error) {
    console.error('Barcode lookup error:', error);
    return {
      success: false,
      error: 'Impossible de trouver ce produit. Vérifiez le code-barres.',
    };
  }
}

// Simulation pour le développement
function simulateApiResponse(barcode: string): BarcodeApiResponse {
  const mockProducts: Record<string, BarcodeApiResponse['product']> = {
    '3614271303851': {
      name: 'T-shirt coton bio',
      brand: 'Petit Bateau',
      category: 'T-shirts',
    },
    '5000159484695': {
      name: 'Jean slim',
      brand: 'Levi\'s',
      category: 'Pantalons',
    },
    '8719323456789': {
      name: 'Pull laine mérinos',
      brand: 'Uniqlo',
      category: 'Pulls',
    },
  };

  const product = mockProducts[barcode];

  if (product) {
    return { success: true, product };
  }

  // Produit générique pour les codes non reconnus
  return {
    success: true,
    product: {
      name: `Vêtement (${barcode.slice(-4)})`,
      category: 'Vêtement',
    },
  };
}

// Génère des instructions de lavage basées sur la catégorie
export function generateCareInstructions(category?: string): CareInstructions {
  const categoryLower = category?.toLowerCase() || '';

  // Instructions par défaut
  const defaultInstructions: CareInstructions = {
    washTemperature: 30,
    washType: 'machine',
    bleach: 'do_not_bleach',
    dry: 'tumble_low',
    iron: 'medium',
    professionalCare: 'dry_clean',
    tips: ['Laver avec des couleurs similaires', 'Retourner avant lavage'],
  };

  // Instructions spécifiques par catégorie
  if (categoryLower.includes('jean') || categoryLower.includes('denim')) {
    return {
      washTemperature: 30,
      washType: 'machine',
      bleach: 'do_not_bleach',
      dry: 'hang_dry',
      iron: 'do_not_iron',
      professionalCare: 'do_not_dry_clean',
      tips: [
        'Retourner le jean avant lavage',
        'Laver avec des couleurs foncées',
        'Éviter le sèche-linge pour préserver la couleur',
        'Ne pas laver trop souvent (tous les 5-6 ports)',
      ],
    };
  }

  if (categoryLower.includes('pull') || categoryLower.includes('laine') || categoryLower.includes('wool')) {
    return {
      washTemperature: 30,
      washType: 'delicate',
      bleach: 'do_not_bleach',
      dry: 'flat_dry',
      iron: 'low',
      professionalCare: 'dry_clean',
      tips: [
        'Privilégier le lavage à la main',
        'Utiliser une lessive spéciale laine',
        'Sécher à plat pour éviter la déformation',
        'Ranger plié, jamais sur cintre',
      ],
    };
  }

  if (categoryLower.includes('soie') || categoryLower.includes('silk')) {
    return {
      washTemperature: null,
      washType: 'hand',
      bleach: 'do_not_bleach',
      dry: 'hang_dry',
      iron: 'low',
      professionalCare: 'dry_clean',
      tips: [
        'Lavage à la main uniquement',
        'Eau froide avec savon doux',
        'Ne jamais essorer',
        'Repasser à basse température sur l\'envers',
      ],
    };
  }

  if (categoryLower.includes('t-shirt') || categoryLower.includes('tee')) {
    return {
      washTemperature: 30,
      washType: 'machine',
      bleach: 'do_not_bleach',
      dry: 'tumble_low',
      iron: 'medium',
      professionalCare: 'do_not_dry_clean',
      tips: [
        'Retourner avant lavage pour protéger les impressions',
        'Laver avec des couleurs similaires',
        'Éviter le sèche-linge haute température',
      ],
    };
  }

  return defaultInstructions;
}

export function createClothingItem(
  barcode: string,
  apiResponse: BarcodeApiResponse
): ClothingItem {
  const product = apiResponse.product;

  return {
    id: `${barcode}_${Date.now()}`,
    barcode,
    name: product?.name || 'Vêtement inconnu',
    brand: product?.brand,
    category: product?.category,
    imageUrl: product?.images?.[0],
    careInstructions: generateCareInstructions(product?.category),
    scannedAt: new Date().toISOString(),
  };
}
