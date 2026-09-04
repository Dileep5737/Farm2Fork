export type Role = 'FARMER' | 'BUYER';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  location: string;
  coordinates: Coordinates;
  farmName?: string;
  avatar?: string;
  fpoMember?: boolean;
}

export type QualityGrade = 'Grade A+' | 'Grade A' | 'Grade B' | 'Grade C';

export type CropCategory =
  | 'Vegetables'
  | 'Fruits'
  | 'Grains'
  | 'Pulses'
  | 'Spices'
  | 'Organic'
  | 'Other';

export interface CropListing {
  id: string;
  farmerId: string;
  farmerName: string;
  farmName: string;
  farmerPhone: string;
  farmerRating: number; // e.g., 4.8 / 5
  farmerLocation: string;
  coordinates: Coordinates;
  distanceKm?: number; // Distance from currently logged in buyer
  cropName: string;
  category: CropCategory;
  quantity: number;
  unit: 'kg' | 'quintal' | 'ton';
  pricePerKg: number;
  mandiPricePerKg: number; // Reference market comparison price
  retailPricePerKg: number; // Traditional retail price reference
  qualityGrade: QualityGrade;
  qualityRating: number; // 1.0 - 5.0
  harvestDate: string;
  description: string;
  images: string[];
  primaryImageIndex: number;
  isOrganic: boolean;
  certificationNumber?: string;
  status: 'ACTIVE' | 'SOLD_OUT' | 'UNLISTED';
  createdAt: string;
}

export interface RecommendationWeights {
  price: number; // 0.0 - 1.0 (e.g., 0.40)
  quality: number; // 0.0 - 1.0 (e.g., 0.40)
  distance: number; // 0.0 - 1.0 (e.g., 0.20)
}

export interface RecommendationScoreBreakdown {
  priceScore: number; // 0 - 100
  qualityScore: number; // 0 - 100
  distanceScore: number; // 0 - 100
  totalScore: number; // 0 - 100 (weighted sum)
  rankingReason: string;
  reasons: string[];
  isBestMatch?: boolean;
}

export interface ScoredCropListing extends CropListing {
  recommendation: RecommendationScoreBreakdown;
}

export type OrderStatus = 'Pending' | 'Accepted' | 'Ready for Pickup' | 'Completed' | 'Rejected';

export interface Order {
  id: string;
  cropId: string;
  cropName: string;
  cropImage: string;
  farmerId: string;
  farmerName: string;
  farmName: string;
  farmerPhone: string;
  buyerId: string;
  buyerName: string;
  buyerPhone: string;
  deliveryAddress: string;
  quantity: number;
  pricePerKg: number;
  totalAmount: number;
  traditionalEstimatedCost: number;
  buyerSavings: number;
  farmerExtraEarnings: number;
  status: OrderStatus;
  createdAt: string;
  paymentMethod: 'DIRECT_ESCROW' | 'UPI_INSTANT' | 'CASH_ON_DELIVERY';
}

export interface FilterOptions {
  searchQuery: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  maxDistance: number;
  minQuality: number;
  grade?: string;
  sortBy: 'recommended' | 'price_low' | 'quality_high' | 'distance_near' | 'quantity_high';
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  title?: string;
}
