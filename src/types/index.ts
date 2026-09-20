export type Role = 'FARMER' | 'BUYER';
export type RegionType = 'LOCAL' | 'INTERNATIONAL';
export type Currency = 'USD' | 'EUR' | 'AED' | 'GBP' | 'INR';
export type Incoterm = 'FOB' | 'CIF' | 'EXW' | 'CFR';

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
  region?: RegionType;
  location: string;
  coordinates: Coordinates;
  farmName?: string;
  companyName?: string;
  country?: string;
  destinationPort?: string;
  avatar?: string;
  fpoMember?: boolean;
  apedaRegistered?: boolean;
  exportLicenseNumber?: string;
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

// International Export Listing Interface
export interface ExportListing {
  id: string;
  farmerId: string;
  farmerName: string;
  farmName: string;
  farmerPhone: string;
  farmerEmail: string;
  originCountry: string;
  originPort: string; // e.g., 'JNPT Port, Mumbai' | 'Chennai Port' | 'Cochin Port' | 'Kandla Port'
  cropName: string;
  scientificName?: string;
  category: CropCategory;
  qualityGrade: QualityGrade;
  qualityScore: number; // 4.0 - 5.0
  availableQuantityMT: number; // In Metric Tons
  minOrderQuantityMT: number; // Minimum Order in MT
  containerType: '20ft Reefer FCL' | '40ft High Cube Reefer' | '20ft Dry FCL' | 'Bulk Cargo';
  packaging: string; // e.g. '5kg Corrugated Export Box' | '25kg Jute Bag' | '50kg HDPE Poly-Lined'
  pricePerKgUSD: number; // Base USD price per kg
  fobPricePerMTUSD: number; // FOB price per Metric Ton in USD
  cifEstimatesUSD: {
    dubai: number; // Port of Jebel Ali, UAE
    rotterdam: number; // Port of Rotterdam, Netherlands
    singapore: number; // Port of Singapore
    london: number; // London Gateway, UK
    newyork: number; // Port of New York, USA
  };
  incotermsAvailable: Incoterm[];
  harvestDate: string;
  shelfLifeDays: number;
  temperatureControlled: boolean;
  targetTempCelsius?: string; // e.g. '12°C - 14°C'
  certifications: string[]; // ['APEDA Certified', 'Phytosanitary Cleared', 'GlobalG.A.P.', 'SGS Verified', 'USDA Organic']
  apedaCertificateNo: string;
  sgsInspectionStatus: 'PASSED' | 'IN_PROGRESS' | 'CERTIFIED';
  images: string[];
  primaryImageIndex: number;
  description: string;
  status: 'ACTIVE' | 'BOOKED' | 'DISPATCHED';
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

// International Export Order Interface
export type ExportOrderStatus =
  | 'INQUIRY_PLACED'
  | 'LC_ESCROW_LOCKED'
  | 'PHYTOSANITARY_CLEARED'
  | 'CUSTOMS_APPROVED'
  | 'VESSEL_LOADED'
  | 'IN_TRANSIT_SEA'
  | 'CUSTOMS_ARRIVED'
  | 'COMPLETED';

export interface ExportOrder {
  id: string;
  exportListingId: string;
  cropName: string;
  cropImage: string;
  category: CropCategory;
  farmerId: string;
  farmerName: string;
  farmName: string;
  farmerPhone: string;
  farmerEmail: string;
  originPort: string;
  buyerId: string;
  buyerName: string;
  buyerCompany: string;
  buyerCountry: string;
  destinationPort: string;
  quantityMT: number;
  containerCount: number;
  containerType: string;
  incoterm: Incoterm;
  currency: Currency;
  unitPriceUSD: number;
  totalAmountUSD: number;
  paymentMethod: 'LETTER_OF_CREDIT' | 'INTERNATIONAL_ESCROW' | 'BANK_WIRE_TT';
  lcReferenceNumber?: string;
  billOfLadingNo?: string;
  containerNumber?: string;
  vesselName?: string;
  carrierName?: string;
  estimatedArrivalDate: string;
  status: ExportOrderStatus;
  sgsInspectionCertificateUrl?: string;
  phytosanitaryCertificateNo: string;
  apedaCertificateNo: string;
  createdAt: string;
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
