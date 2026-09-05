import { CropListing, Order, RecommendationWeights, User } from '../types';
import { DEFAULT_WEIGHTS } from './recommendation';

const STORAGE_KEYS = {
  CURRENT_USER: 'farm2fork_current_user',
  CROPS: 'farm2fork_crops',
  ORDERS: 'farm2fork_orders',
  WEIGHTS: 'farm2fork_weights',
  INITIALIZED: 'farm2fork_initialized_v4',
};

// Curated high quality agriculture images
export const SAMPLE_CROP_IMAGES = {
  tomato: [
    'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1561136594-7f68413baa99?auto=format&fit=crop&w=800&q=80',
  ],
  onion: [
    'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=800&q=80',
  ],
  potato: [
    'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1590165482129-1b8b27698780?auto=format&fit=crop&w=800&q=80',
  ],
  carrot: [
    'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1582515073490-39981397c445?auto=format&fit=crop&w=800&q=80',
  ],
  rice: [
    'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?auto=format&fit=crop&w=800&q=80',
  ],
  wheat: [
    'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80',
  ],
  mango: [
    'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?auto=format&fit=crop&w=800&q=80',
  ],
  banana: [
    'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1603833665858-e61d17a86224?auto=format&fit=crop&w=800&q=80',
  ],
};

export const DEMO_FARMER: User = {
  id: 'farmer-1',
  name: 'Kiran',
  email: 'farmer@farm2fork.com',
  phone: '+91 98450 12345',
  role: 'FARMER',
  location: 'Doddaballapura, Bengaluru Rural',
  coordinates: { lat: 13.2925, lng: 77.5429 },
  farmName: 'Green Valley Organic Farms & FPO',
  avatar: 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?auto=format&fit=crop&w=200&q=80',
  fpoMember: true,
};

export const DEMO_BUYER: User = {
  id: 'buyer-1',
  name: 'Priya Sharma',
  email: 'buyer@farm2fork.com',
  phone: '+91 99887 65432',
  role: 'BUYER',
  location: 'Indiranagar, Bengaluru Central',
  coordinates: { lat: 12.9784, lng: 77.6408 },
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
};

export const SEED_FARMERS: User[] = [
  DEMO_FARMER,
  {
    id: 'farmer-2',
    name: 'Krishna Reddy',
    email: 'krishna@krishnafarm.com',
    phone: '+91 98451 23456',
    role: 'FARMER',
    location: 'Kolar Agro Belt, Karnataka',
    coordinates: { lat: 13.1367, lng: 78.1292 },
    farmName: 'Krishna Farm & Greenhouse',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    fpoMember: false,
  },
  {
    id: 'farmer-3',
    name: 'Lakshmi Devi',
    email: 'lakshmi@chintamanifpo.in',
    phone: '+91 98452 34567',
    role: 'FARMER',
    location: 'Chintamani, Chikkaballapur',
    coordinates: { lat: 13.4007, lng: 78.0569 },
    farmName: 'Lakshmi Mahila Farmers FPO',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    fpoMember: true,
  },
  {
    id: 'farmer-4',
    name: 'Anand Patil',
    email: 'anand@sahyadri.com',
    phone: '+91 98230 45678',
    role: 'FARMER',
    location: 'Niphad, Nashik Agri Zone',
    coordinates: { lat: 20.0768, lng: 74.1084 },
    farmName: 'Sahyadri Agro Producers Co-op',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    fpoMember: true,
  },
  {
    id: 'farmer-5',
    name: 'Gurpreet Singh',
    email: 'gurpreet@punjabgold.com',
    phone: '+91 98140 56789',
    role: 'FARMER',
    location: 'Samrala, Ludhiana, Punjab',
    coordinates: { lat: 30.8354, lng: 76.1925 },
    farmName: 'Punjab Golden Grains & Basmati FPO',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
    fpoMember: true,
  },
  {
    id: 'farmer-6',
    name: 'Suresh Goud',
    email: 'suresh@telanganakisan.org',
    phone: '+91 94400 67890',
    role: 'FARMER',
    location: 'Jadcherla, Mahbubnagar',
    coordinates: { lat: 16.7644, lng: 78.1367 },
    farmName: 'Telangana Natural Farmers Union',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80',
    fpoMember: true,
  },
  {
    id: 'farmer-7',
    name: 'Meenakshi Sundaram',
    email: 'meenakshi@cauverydelta.in',
    phone: '+91 94430 78901',
    role: 'FARMER',
    location: 'Kumbakonam, Thanjavur',
    coordinates: { lat: 10.9601, lng: 79.3845 },
    farmName: 'Cauvery Delta Organic Producers FPO',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    fpoMember: true,
  },
  {
    id: 'farmer-8',
    name: 'Devendra Jadhav',
    email: 'devendra@konkanfruit.com',
    phone: '+91 98220 89012',
    role: 'FARMER',
    location: 'Devgad, Ratnagiri Coastal Belt',
    coordinates: { lat: 16.3762, lng: 73.3769 },
    farmName: 'Konkan GI Alphonso Mango Producers',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    fpoMember: true,
  },
];

export const SEED_CROPS: CropListing[] = [
  // Tomato listings from multiple farmers
  {
    id: 'crop-tomato-1',
    farmerId: 'farmer-1',
    farmerName: 'Kiran',
    farmName: 'Green Valley Organic Farms',
    farmerPhone: '+91 98450 12345',
    farmerRating: 4.9,
    farmerLocation: 'Doddaballapura, Bengaluru Rural',
    coordinates: { lat: 13.0825, lng: 77.5829 },
    distanceKm: 5,
    cropName: 'Vine Ripe Hybrid Tomato',
    category: 'Vegetables',
    quantity: 350,
    unit: 'kg',
    pricePerKg: 30,
    mandiPricePerKg: 20,
    retailPricePerKg: 42,
    qualityGrade: 'Grade A+',
    qualityRating: 4.9,
    harvestDate: '2026-09-03',
    description: 'Crisp, naturally ripened hybrid tomatoes cultivated with drip fertigation. Zero chemical residues, high lycopene, exceptional shelf life of 12+ days.',
    images: [
      SAMPLE_CROP_IMAGES.tomato[0],
      SAMPLE_CROP_IMAGES.tomato[1],
      SAMPLE_CROP_IMAGES.tomato[2],
    ],
    primaryImageIndex: 0,
    isOrganic: true,
    certificationNumber: 'IND-ORG-2026-894',
    status: 'ACTIVE',
    createdAt: '2026-09-03T10:00:00.000Z',
  },
  {
    id: 'crop-tomato-2',
    farmerId: 'farmer-2',
    farmerName: 'Krishna Reddy',
    farmName: 'Krishna Farm & Greenhouse',
    farmerPhone: '+91 98451 23456',
    farmerRating: 4.2,
    farmerLocation: 'Kolar Agro Belt, Karnataka',
    coordinates: { lat: 13.1367, lng: 77.7292 },
    distanceKm: 8,
    cropName: 'Field Fresh Red Tomato',
    category: 'Vegetables',
    quantity: 800,
    unit: 'kg',
    pricePerKg: 25,
    mandiPricePerKg: 17,
    retailPricePerKg: 38,
    qualityGrade: 'Grade A',
    qualityRating: 4.2,
    harvestDate: '2026-09-02',
    description: 'Bulk red juicy tomatoes picked at peak firmness. Suitable for restaurant kitchens, food processing, and daily consumption.',
    images: [
      SAMPLE_CROP_IMAGES.tomato[1],
      SAMPLE_CROP_IMAGES.tomato[0],
    ],
    primaryImageIndex: 0,
    isOrganic: false,
    status: 'ACTIVE',
    createdAt: '2026-09-02T14:30:00.000Z',
  },
  {
    id: 'crop-tomato-3',
    farmerId: 'farmer-1',
    farmerName: 'Kiran FPO',
    farmName: 'Green Valley FPO Network',
    farmerPhone: '+91 98450 12345',
    farmerRating: 4.8,
    farmerLocation: 'Chikkaballapur Road',
    coordinates: { lat: 13.2025, lng: 77.6529 },
    distanceKm: 12,
    cropName: 'Roma Plum Salad Tomato',
    category: 'Vegetables',
    quantity: 500,
    unit: 'kg',
    pricePerKg: 28,
    mandiPricePerKg: 19,
    retailPricePerKg: 40,
    qualityGrade: 'Grade A+',
    qualityRating: 4.8,
    harvestDate: '2026-09-03',
    description: 'Thick-walled plum tomatoes with balanced sweetness. Perfectly graded and packed in returnable crates directly at farm gate.',
    images: [
      SAMPLE_CROP_IMAGES.tomato[2],
      SAMPLE_CROP_IMAGES.tomato[0],
    ],
    primaryImageIndex: 0,
    isOrganic: true,
    certificationNumber: 'IND-ORG-2026-331',
    status: 'ACTIVE',
    createdAt: '2026-09-03T08:15:00.000Z',
  },
  {
    id: 'crop-tomato-4',
    farmerId: 'farmer-3',
    farmerName: 'Lakshmi Mahila FPO',
    farmName: 'Lakshmi Mahila Farmers FPO',
    farmerPhone: '+91 98452 34567',
    farmerRating: 4.5,
    farmerLocation: 'Chintamani, Chikkaballapur',
    coordinates: { lat: 13.3507, lng: 77.8069 },
    distanceKm: 18,
    cropName: 'Desi Country Sweet Tomato',
    category: 'Vegetables',
    quantity: 1200,
    unit: 'kg',
    pricePerKg: 26,
    mandiPricePerKg: 18,
    retailPricePerKg: 39,
    qualityGrade: 'Grade A',
    qualityRating: 4.5,
    harvestDate: '2026-09-04',
    description: 'Heritage desi heirloom variety grown by women self-help farmer collective. Tangy flavor profile, hand sorted for uniform size.',
    images: [
      SAMPLE_CROP_IMAGES.tomato[0],
      SAMPLE_CROP_IMAGES.tomato[2],
    ],
    primaryImageIndex: 0,
    isOrganic: false,
    status: 'ACTIVE',
    createdAt: '2026-09-04T07:00:00.000Z',
  },

  // Onion Listings
  {
    id: 'crop-onion-1',
    farmerId: 'farmer-4',
    farmerName: 'Anand Patil',
    farmName: 'Sahyadri Agro Producers',
    farmerPhone: '+91 98230 45678',
    farmerRating: 4.8,
    farmerLocation: 'Niphad, Nashik',
    coordinates: { lat: 13.0200, lng: 77.6200 },
    distanceKm: 14,
    cropName: 'Nashik Medium Pink Onion',
    category: 'Vegetables',
    quantity: 2500,
    unit: 'kg',
    pricePerKg: 22,
    mandiPricePerKg: 14,
    retailPricePerKg: 35,
    qualityGrade: 'Grade A+',
    qualityRating: 4.8,
    harvestDate: '2026-08-28',
    description: 'Well-cured, firm Nashik onions with dry outer skin. Low pungency moisture, ideal for 45+ day ambient storage without sprouting.',
    images: [
      SAMPLE_CROP_IMAGES.onion[0],
      SAMPLE_CROP_IMAGES.onion[1],
    ],
    primaryImageIndex: 0,
    isOrganic: false,
    status: 'ACTIVE',
    createdAt: '2026-08-30T11:00:00.000Z',
  },
  {
    id: 'crop-onion-2',
    farmerId: 'farmer-2',
    farmerName: 'Krishna Reddy',
    farmName: 'Krishna Farm',
    farmerPhone: '+91 98451 23456',
    farmerRating: 4.3,
    farmerLocation: 'Bellary Road Belt',
    coordinates: { lat: 13.1200, lng: 77.5900 },
    distanceKm: 9,
    cropName: 'Bellary Deep Red Onion',
    category: 'Vegetables',
    quantity: 1500,
    unit: 'kg',
    pricePerKg: 20,
    mandiPricePerKg: 13,
    retailPricePerKg: 32,
    qualityGrade: 'Grade A',
    qualityRating: 4.3,
    harvestDate: '2026-08-25',
    description: 'Freshly harvested large Bellary red onions. Pungent aroma, excellent for bulk culinary and commercial catering.',
    images: [
      SAMPLE_CROP_IMAGES.onion[1],
      SAMPLE_CROP_IMAGES.onion[0],
    ],
    primaryImageIndex: 0,
    isOrganic: false,
    status: 'ACTIVE',
    createdAt: '2026-08-28T09:30:00.000Z',
  },

  // Potato Listings
  {
    id: 'crop-potato-1',
    farmerId: 'farmer-1',
    farmerName: 'Kiran',
    farmName: 'Green Valley Organic Farms',
    farmerPhone: '+91 98450 12345',
    farmerRating: 4.9,
    farmerLocation: 'Hassan - Doddaballapura Hub',
    coordinates: { lat: 13.0825, lng: 77.5829 },
    distanceKm: 6,
    cropName: 'Kufri Jyoti Fresh Potato',
    category: 'Vegetables',
    quantity: 1800,
    unit: 'kg',
    pricePerKg: 24,
    mandiPricePerKg: 15,
    retailPricePerKg: 36,
    qualityGrade: 'Grade A+',
    qualityRating: 4.9,
    harvestDate: '2026-09-01',
    description: 'Thin skinned, clay-free washed table potatoes. High starch content, clean golden appearance with zero greening.',
    images: [
      SAMPLE_CROP_IMAGES.potato[0],
      SAMPLE_CROP_IMAGES.potato[1],
    ],
    primaryImageIndex: 0,
    isOrganic: true,
    certificationNumber: 'IND-ORG-2026-552',
    status: 'ACTIVE',
    createdAt: '2026-09-01T15:00:00.000Z',
  },

  // Carrot Listings
  {
    id: 'crop-carrot-1',
    farmerId: 'farmer-1',
    farmerName: 'Kiran',
    farmName: 'Green Valley Organic Farms',
    farmerPhone: '+91 98450 12345',
    farmerRating: 4.9,
    farmerLocation: 'Doddaballapura Farms',
    coordinates: { lat: 13.0825, lng: 77.5829 },
    distanceKm: 5,
    cropName: 'Ooty Sweet Orange Carrot',
    category: 'Vegetables',
    quantity: 650,
    unit: 'kg',
    pricePerKg: 38,
    mandiPricePerKg: 24,
    retailPricePerKg: 55,
    qualityGrade: 'Grade A+',
    qualityRating: 4.9,
    harvestDate: '2026-09-03',
    description: 'Crispy, intensely sweet orange carrots. Hydro-cooled within 2 hours of harvest for maximum crunch and juice retention.',
    images: [
      SAMPLE_CROP_IMAGES.carrot[0],
      SAMPLE_CROP_IMAGES.carrot[1],
    ],
    primaryImageIndex: 0,
    isOrganic: true,
    certificationNumber: 'IND-ORG-2026-894',
    status: 'ACTIVE',
    createdAt: '2026-09-03T12:00:00.000Z',
  },

  // Rice & Grains
  {
    id: 'crop-rice-1',
    farmerId: 'farmer-5',
    farmerName: 'Gurpreet Singh',
    farmName: 'Punjab Golden Grains & Basmati FPO',
    farmerPhone: '+91 98140 56789',
    farmerRating: 4.9,
    farmerLocation: 'Samrala, Ludhiana',
    coordinates: { lat: 13.0000, lng: 77.6000 },
    distanceKm: 15,
    cropName: '1121 Traditional Aged Basmati Rice',
    category: 'Grains',
    quantity: 4000,
    unit: 'kg',
    pricePerKg: 85,
    mandiPricePerKg: 58,
    retailPricePerKg: 120,
    qualityGrade: 'Grade A+',
    qualityRating: 4.9,
    harvestDate: '2026-08-15',
    description: '2-year aged long-grain aromatic Basmati rice. Grain elongation ratio 2.2x upon cooking with enchanting authentic aroma.',
    images: [
      SAMPLE_CROP_IMAGES.rice[0],
      SAMPLE_CROP_IMAGES.rice[1],
    ],
    primaryImageIndex: 0,
    isOrganic: true,
    certificationNumber: 'IND-ORG-2026-118',
    status: 'ACTIVE',
    createdAt: '2026-08-20T08:00:00.000Z',
  },
  {
    id: 'crop-wheat-1',
    farmerId: 'farmer-5',
    farmerName: 'Gurpreet Singh',
    farmName: 'Punjab Golden Grains FPO',
    farmerPhone: '+91 98140 56789',
    farmerRating: 4.8,
    farmerLocation: 'Punjab Agricultural Hub',
    coordinates: { lat: 13.0400, lng: 77.5500 },
    distanceKm: 16,
    cropName: 'Sharbati Gold MP Whole Wheat',
    category: 'Grains',
    quantity: 5000,
    unit: 'kg',
    pricePerKg: 36,
    mandiPricePerKg: 24,
    retailPricePerKg: 50,
    qualityGrade: 'Grade A+',
    qualityRating: 4.8,
    harvestDate: '2026-08-05',
    description: 'Golden, heavy lustrous whole grains rich in protein and dietary fiber. Produces softer, fluffier chapatis.',
    images: [
      SAMPLE_CROP_IMAGES.wheat[0],
      SAMPLE_CROP_IMAGES.wheat[1],
    ],
    primaryImageIndex: 0,
    isOrganic: true,
    certificationNumber: 'IND-ORG-2026-118',
    status: 'ACTIVE',
    createdAt: '2026-08-18T10:00:00.000Z',
  },

  // Fruits - Mango & Banana
  {
    id: 'crop-mango-1',
    farmerId: 'farmer-8',
    farmerName: 'Devendra Jadhav',
    farmName: 'Konkan GI Alphonso Mango Producers',
    farmerPhone: '+91 98220 89012',
    farmerRating: 5.0,
    farmerLocation: 'Ratnagiri Coast / Direct Hub',
    coordinates: { lat: 12.9800, lng: 77.6100 },
    distanceKm: 7,
    cropName: 'GI Tagged Devgad Alphonso Mango (Hapus)',
    category: 'Fruits',
    quantity: 600,
    unit: 'kg',
    pricePerKg: 180,
    mandiPricePerKg: 110,
    retailPricePerKg: 280,
    qualityGrade: 'Grade A+',
    qualityRating: 5.0,
    harvestDate: '2026-09-02',
    description: 'Authentic Geographical Indication (GI) certified Alphonso mangoes. Tree-ripened in natural hay with unmatched saffron aroma and rich creamy pulp.',
    images: [
      SAMPLE_CROP_IMAGES.mango[0],
      SAMPLE_CROP_IMAGES.mango[1],
    ],
    primaryImageIndex: 0,
    isOrganic: true,
    certificationNumber: 'GI-AU-2026-0044',
    status: 'ACTIVE',
    createdAt: '2026-09-02T16:00:00.000Z',
  },
  {
    id: 'crop-banana-1',
    farmerId: 'farmer-6',
    farmerName: 'Suresh Goud',
    farmName: 'Telangana Natural Farmers Union',
    farmerPhone: '+91 94400 67890',
    farmerRating: 4.6,
    farmerLocation: 'Jadcherla Farmers Hub',
    coordinates: { lat: 12.9400, lng: 77.6200 },
    distanceKm: 10,
    cropName: 'Robusta GI Premium Table Banana',
    category: 'Fruits',
    quantity: 1200,
    unit: 'kg',
    pricePerKg: 32,
    mandiPricePerKg: 18,
    retailPricePerKg: 48,
    qualityGrade: 'Grade A',
    qualityRating: 4.6,
    harvestDate: '2026-09-03',
    description: 'Naturally ethylene chamber ripened yellow Cavendish bananas. Uniform bunch size, free from chemical carbide.',
    images: [
      SAMPLE_CROP_IMAGES.banana[0],
      SAMPLE_CROP_IMAGES.banana[1],
    ],
    primaryImageIndex: 0,
    isOrganic: false,
    status: 'ACTIVE',
    createdAt: '2026-09-03T11:00:00.000Z',
  },
];

export const SEED_ORDERS: Order[] = [
  {
    id: 'FF-1001',
    cropId: 'crop-tomato-1',
    cropName: 'Vine Ripe Hybrid Tomato',
    cropImage: SAMPLE_CROP_IMAGES.tomato[0],
    farmerId: 'farmer-1',
    farmerName: 'Kiran',
    farmName: 'Green Valley Organic Farms',
    farmerPhone: '+91 98450 12345',
    buyerId: 'buyer-arjun',
    buyerName: 'Arjun Sharma',
    buyerPhone: '+91 98765 11223',
    deliveryAddress: 'Flat 302, Palm Grove, Koramangala 4th Block, Bengaluru',
    quantity: 50,
    pricePerKg: 28,
    totalAmount: 1400,
    traditionalEstimatedCost: 2100,
    buyerSavings: 700,
    farmerExtraEarnings: 500,
    status: 'Pending',
    createdAt: '2026-09-04T08:30:00.000Z',
    paymentMethod: 'DIRECT_ESCROW',
  },
  {
    id: 'FF-1002',
    cropId: 'crop-potato-1',
    cropName: 'Kufri Jyoti Fresh Potato',
    cropImage: SAMPLE_CROP_IMAGES.potato[0],
    farmerId: 'farmer-1',
    farmerName: 'Kiran',
    farmName: 'Green Valley Organic Farms',
    farmerPhone: '+91 98450 12345',
    buyerId: 'buyer-neha',
    buyerName: 'Neha Patil',
    buyerPhone: '+91 98223 44556',
    deliveryAddress: 'House #42, Defence Colony, Indiranagar, Bengaluru',
    quantity: 100,
    pricePerKg: 24,
    totalAmount: 2400,
    traditionalEstimatedCost: 3600,
    buyerSavings: 1200,
    farmerExtraEarnings: 900,
    status: 'Accepted',
    createdAt: '2026-09-03T14:15:00.000Z',
    paymentMethod: 'DIRECT_ESCROW',
  },
  {
    id: 'FF-1003',
    cropId: 'crop-carrot-1',
    cropName: 'Ooty Sweet Orange Carrot',
    cropImage: SAMPLE_CROP_IMAGES.carrot[0],
    farmerId: 'farmer-1',
    farmerName: 'Kiran',
    farmName: 'Green Valley Organic Farms',
    farmerPhone: '+91 98450 12345',
    buyerId: 'buyer-1',
    buyerName: 'Priya Sharma',
    buyerPhone: '+91 99887 65432',
    deliveryAddress: 'Flat 402, Green Acre Apts, 100ft Road, Indiranagar, Bengaluru - 560038',
    quantity: 40,
    pricePerKg: 38,
    totalAmount: 1520,
    traditionalEstimatedCost: 2200,
    buyerSavings: 680,
    farmerExtraEarnings: 560,
    status: 'Ready for Pickup',
    createdAt: '2026-09-02T11:00:00.000Z',
    paymentMethod: 'DIRECT_ESCROW',
  },
  {
    id: 'FF-1004',
    cropId: 'crop-tomato-1',
    cropName: 'Vine Ripe Hybrid Tomato',
    cropImage: SAMPLE_CROP_IMAGES.tomato[0],
    farmerId: 'farmer-1',
    farmerName: 'Kiran',
    farmName: 'Green Valley Organic Farms',
    farmerPhone: '+91 98450 12345',
    buyerId: 'buyer-vikram',
    buyerName: 'Vikram Malhotra',
    buyerPhone: '+91 97112 33445',
    deliveryAddress: 'Skyline Restaurant, MG Road, Bengaluru',
    quantity: 150,
    pricePerKg: 30,
    totalAmount: 4500,
    traditionalEstimatedCost: 6300,
    buyerSavings: 1800,
    farmerExtraEarnings: 1500,
    status: 'Completed',
    createdAt: '2026-09-01T09:45:00.000Z',
    paymentMethod: 'DIRECT_ESCROW',
  },
];

/**
 * Storage management helper service with automatic initialization
 */
export const StorageService = {
  initialize() {
    if (!localStorage.getItem(STORAGE_KEYS.INITIALIZED)) {
      localStorage.setItem(STORAGE_KEYS.CROPS, JSON.stringify(SEED_CROPS));
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(SEED_ORDERS));
      localStorage.setItem(STORAGE_KEYS.WEIGHTS, JSON.stringify(DEFAULT_WEIGHTS));
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(DEMO_BUYER));
      localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
    } else {
      // Migrate any existing cached user in browser if needed
      const storedUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser.id === 'farmer-1' && (parsedUser.name === 'Ramesh Kumar' || !parsedUser.name)) {
            parsedUser.name = 'Kiran';
            localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(parsedUser));
          }
        } catch {
          // ignore
        }
      }
    }
  },

  getCurrentUser(): User {
    this.initialize();
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : DEMO_BUYER;
  },

  setCurrentUser(user: User | null) {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  },

  getCrops(): CropListing[] {
    this.initialize();
    const data = localStorage.getItem(STORAGE_KEYS.CROPS);
    return data ? JSON.parse(data) : SEED_CROPS;
  },

  saveCrops(crops: CropListing[]) {
    localStorage.setItem(STORAGE_KEYS.CROPS, JSON.stringify(crops));
  },

  addCrop(crop: Omit<CropListing, 'id' | 'createdAt'>): CropListing {
    const crops = this.getCrops();
    const newCrop: CropListing = {
      ...crop,
      id: `crop-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      createdAt: new Date().toISOString(),
    };
    crops.unshift(newCrop);
    this.saveCrops(crops);
    return newCrop;
  },

  updateCrop(id: string, updatedFields: Partial<CropListing>): CropListing | null {
    const crops = this.getCrops();
    const index = crops.findIndex((c) => c.id === id);
    if (index === -1) return null;

    const updatedCrop = { ...crops[index], ...updatedFields };
    crops[index] = updatedCrop;
    this.saveCrops(crops);
    return updatedCrop;
  },

  deleteCrop(id: string): boolean {
    const crops = this.getCrops();
    const filtered = crops.filter((c) => c.id !== id);
    if (filtered.length === crops.length) return false;
    this.saveCrops(filtered);
    return true;
  },

  getOrders(): Order[] {
    this.initialize();
    const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return data ? JSON.parse(data) : SEED_ORDERS;
  },

  saveOrders(orders: Order[]) {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  },

  createOrder(orderData: Omit<Order, 'id' | 'createdAt'>): Order {
    const orders = this.getOrders();
    const newOrder: Order = {
      ...orderData,
      id: `FF-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };
    orders.unshift(newOrder);
    this.saveOrders(orders);

    // Also deduct quantity from the crop
    const crops = this.getCrops();
    const crop = crops.find((c) => c.id === orderData.cropId);
    if (crop) {
      crop.quantity = Math.max(0, crop.quantity - orderData.quantity);
      if (crop.quantity === 0) {
        crop.status = 'SOLD_OUT';
      }
      this.saveCrops(crops);
    }

    return newOrder;
  },

  updateOrderStatus(orderId: string, status: Order['status']): Order | null {
    const orders = this.getOrders();
    const index = orders.findIndex((o) => o.id === orderId);
    if (index === -1) return null;

    orders[index].status = status;
    this.saveOrders(orders);
    return orders[index];
  },

  getWeights(): RecommendationWeights {
    this.initialize();
    const data = localStorage.getItem(STORAGE_KEYS.WEIGHTS);
    return data ? JSON.parse(data) : DEFAULT_WEIGHTS;
  },

  saveWeights(weights: RecommendationWeights) {
    localStorage.setItem(STORAGE_KEYS.WEIGHTS, JSON.stringify(weights));
  },

  resetDemoData() {
    localStorage.removeItem(STORAGE_KEYS.INITIALIZED);
    this.initialize();
  },
};
