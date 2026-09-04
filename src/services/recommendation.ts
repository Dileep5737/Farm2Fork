import { Coordinates, CropListing, RecommendationScoreBreakdown, RecommendationWeights, ScoredCropListing } from '../types';

/**
 * Calculates straight-line distance (in km) between two geographical coordinates
 * using the Haversine formula.
 */
export function calculateDistanceKm(coord1: Coordinates, coord2: Coordinates): number {
  if (!coord1 || !coord2) return 10; // fallback default
  const R = 6371; // Earth's radius in km
  const dLat = ((coord2.lat - coord1.lat) * Math.PI) / 180;
  const dLng = ((coord2.lng - coord1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((coord1.lat * Math.PI) / 180) *
      Math.cos((coord2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 10) / 10; // 1 decimal place
}

/**
 * Standard balanced recommendation weights:
 * Price = 40%, Quality = 40%, Distance = 20%
 */
export const DEFAULT_WEIGHTS: RecommendationWeights = {
  price: 0.40,
  quality: 0.40,
  distance: 0.20,
};

/**
 * Generates natural language explanation tags and summary for a listing.
 */
function generateReasons(
  priceScore: number,
  qualityScore: number,
  distanceScore: number,
  pricePerKg: number,
  qualityRating: number,
  distanceKm: number,
  isOrganic: boolean
): { rankingReason: string; reasons: string[] } {
  const reasons: string[] = [];

  if (qualityRating >= 4.7) {
    reasons.push('⭐ Top-tier Grade A+ quality');
  } else if (qualityRating >= 4.3) {
    reasons.push('✨ High quality fresh products');
  }

  if (distanceKm <= 10) {
    reasons.push(`📍 Very close to your location (${distanceKm} km)`);
  } else if (distanceKm <= 20) {
    reasons.push(`🚚 Direct local dispatch (${distanceKm} km)`);
  }

  if (priceScore >= 75) {
    reasons.push(`💰 Exceptional direct farm price (₹${pricePerKg}/kg)`);
  } else if (priceScore >= 50) {
    reasons.push(`🏷️ Competitive fair trade pricing`);
  }

  if (isOrganic) {
    reasons.push('🌿 100% Certified Organic');
  }

  let rankingReason = '';
  if (qualityScore >= 80 && distanceScore >= 80 && priceScore >= 60) {
    rankingReason = 'Offers an outstanding balance of premium product quality, low transport distance, and fair pricing.';
  } else if (priceScore >= 80) {
    rankingReason = 'Recommended for maximum cost savings directly from the farm with zero middleman markups.';
  } else if (qualityScore >= 90) {
    rankingReason = 'Selected as the highest quality harvest available in your region.';
  } else if (distanceScore >= 90) {
    rankingReason = 'Closest local farmer offering direct farm-gate freshness and rapid dispatch.';
  } else {
    rankingReason = 'Solid balanced match based on your personalized preference weights.';
  }

  return { rankingReason, reasons };
}

/**
 * Core Smart Recommendation Algorithm.
 * Evaluates a list of crops against price, quality, and distance relative to buyer.
 */
export function scoreAndRankCrops(
  crops: CropListing[],
  buyerCoords: Coordinates,
  weights: RecommendationWeights = DEFAULT_WEIGHTS
): ScoredCropListing[] {
  if (crops.length === 0) return [];

  // 1. Calculate distances for all listings
  const cropsWithDistance = crops.map((crop) => {
    const dist = crop.distanceKm !== undefined ? crop.distanceKm : calculateDistanceKm(buyerCoords, crop.coordinates);
    return {
      ...crop,
      distanceKm: dist,
    };
  });

  // 2. Find min and max for normalization
  const prices = cropsWithDistance.map((c) => c.pricePerKg);
  const distances = cropsWithDistance.map((c) => c.distanceKm || 1);

  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const minDistance = Math.min(...distances);
  const maxDistance = Math.max(...distances);
  const maxQuality = 5.0;

  // 3. Calculate scores for each crop
  const scoredList: ScoredCropListing[] = cropsWithDistance.map((crop) => {
    // Lower price = higher score (0 to 100)
    let priceScore = 100;
    if (maxPrice !== minPrice) {
      priceScore = ((maxPrice - crop.pricePerKg) / (maxPrice - minPrice)) * 100;
    }

    // Higher quality = higher score (0 to 100)
    const qualityScore = (crop.qualityRating / maxQuality) * 100;

    // Lower distance = higher score (0 to 100)
    let distanceScore = 100;
    if (maxDistance !== minDistance) {
      distanceScore = ((maxDistance - (crop.distanceKm || 0)) / (maxDistance - minDistance)) * 100;
    }

    // Weighted sum
    const totalScore = Math.round(
      priceScore * weights.price +
      qualityScore * weights.quality +
      distanceScore * weights.distance
    );

    const { rankingReason, reasons } = generateReasons(
      priceScore,
      qualityScore,
      distanceScore,
      crop.pricePerKg,
      crop.qualityRating,
      crop.distanceKm || 0,
      crop.isOrganic
    );

    const recommendation: RecommendationScoreBreakdown = {
      priceScore: Math.round(priceScore),
      qualityScore: Math.round(qualityScore),
      distanceScore: Math.round(distanceScore),
      totalScore: Math.min(100, Math.max(0, totalScore)),
      rankingReason,
      reasons,
      isBestMatch: false,
    };

    return {
      ...crop,
      recommendation,
    };
  });

  // 4. Sort descending by total recommendation score
  scoredList.sort((a, b) => b.recommendation.totalScore - a.recommendation.totalScore);

  // 5. Mark the #1 as Best Match
  if (scoredList.length > 0) {
    scoredList[0].recommendation.isBestMatch = true;
  }

  return scoredList;
}
