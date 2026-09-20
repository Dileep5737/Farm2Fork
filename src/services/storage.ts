import { CropListing, Order, RecommendationWeights, User, ExportListing, ExportOrder, ExportOrderStatus, RegionType } from '../types';
import { DEFAULT_WEIGHTS } from './recommendation';

const STORAGE_KEYS = {
  CURRENT_USER: 'farm2fork_current_user',
  CROPS: 'farm2fork_crops',
  ORDERS: 'farm2fork_orders',
  EXPORT_CROPS: 'farm2fork_export_crops_v1',
  EXPORT_ORDERS: 'farm2fork_export_orders_v1',
  SELECTED_REGION: 'farm2fork_selected_region',
  WEIGHTS: 'farm2fork_weights',
  INITIALIZED: 'farm2fork_initialized_v5',
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
  turmeric: [
    'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=800&q=80',
  ],
  pepper: [
    'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=800&q=80',
  ],
};

export const DEMO_FARMER: User = {
  id: 'farmer-1',
  name: 'Kiran',
  email: 'farmer@farm2fork.com',
  phone: '+91 98450 12345',
  role: 'FARMER',
  region: 'LOCAL',
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
  region: 'LOCAL',
  location: 'Indiranagar, Bengaluru Central',
  coordinates: { lat: 12.9784, lng: 77.6408 },
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
};

export const DEMO_INTL_FARMER: User = {
  id: 'intl-farmer-1',
  name: 'Kiran Patel',
  email: 'exports@greenvalleyagri.com',
  phone: '+91 98450 12345',
  role: 'FARMER',
  region: 'INTERNATIONAL',
  location: 'JNPT Port Gateway, Mumbai & Bengaluru Hub',
  coordinates: { lat: 18.9499, lng: 72.9525 },
  farmName: 'Green Valley Global Agri Exports Consortium',
  companyName: 'Green Valley Agri Exports Ltd',
  country: 'India',
  avatar: 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?auto=format&fit=crop&w=200&q=80',
  fpoMember: true,
  apedaRegistered: true,
  exportLicenseNumber: 'APEDA/EXP/2026/9021',
};

export const DEMO_INTL_BUYER: User = {
  id: 'intl-buyer-1',
  name: 'Alexandre Dubois',
  email: 'alexandre@eurofreshimports.nl',
  phone: '+31 6 12345678',
  role: 'BUYER',
  region: 'INTERNATIONAL',
  location: 'Port of Rotterdam Logistics District, Netherlands',
  coordinates: { lat: 51.9244, lng: 4.4777 },
  companyName: 'EuroFresh Continental Imports B.V.',
  country: 'Netherlands',
  destinationPort: 'Port of Rotterdam',
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

export const SEED_EXPORT_LISTINGS: ExportListing[] = [
  {
    id: 'exp-crop-1',
    farmerId: 'intl-farmer-1',
    farmerName: 'Kiran Patel',
    farmName: 'Green Valley Global Agri Exports Consortium',
    farmerPhone: '+91 98450 12345',
    farmerEmail: 'exports@greenvalleyagri.com',
    originCountry: 'India',
    originPort: 'JNPT Port, Mumbai',
    cropName: 'Ratnagiri Export Alphonso Mangoes',
    scientificName: 'Mangifera indica',
    category: 'Fruits',
    qualityGrade: 'Grade A+',
    qualityScore: 4.9,
    availableQuantityMT: 20,
    minOrderQuantityMT: 5,
    containerType: '20ft Reefer FCL',
    packaging: '5kg Ventilated Corrugated Export Box (12 pieces/box)',
    pricePerKgUSD: 2.8,
    fobPricePerMTUSD: 2800,
    cifEstimatesUSD: {
      dubai: 3100,
      rotterdam: 3450,
      singapore: 3250,
      london: 3500,
      newyork: 3750,
    },
    incotermsAvailable: ['FOB', 'CIF', 'CFR'],
    harvestDate: '2026-09-15',
    shelfLifeDays: 24,
    temperatureControlled: true,
    targetTempCelsius: '12°C - 14°C',
    certifications: ['APEDA Certified', 'GlobalG.A.P.', 'SGS Verified', 'Phytosanitary Cleared'],
    apedaCertificateNo: 'APEDA/EXP/2026/9021',
    sgsInspectionStatus: 'PASSED',
    images: [
      'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?auto=format&fit=crop&w=800&q=80',
    ],
    primaryImageIndex: 0,
    description: 'GI-tagged Ratnagiri Alphonso mangoes with natural golden skin, zero carbide ripening, and Brix sweetness level > 19. Full pesticide residue clearance.',
    status: 'ACTIVE',
    createdAt: '2026-09-18T10:00:00.000Z',
  },
  {
    id: 'exp-crop-2',
    farmerId: 'intl-farmer-1',
    farmerName: 'Kiran Patel',
    farmName: 'Punjab Golden Grains & Basmati Consortium',
    farmerPhone: '+91 98450 12345',
    farmerEmail: 'exports@greenvalleyagri.com',
    originCountry: 'India',
    originPort: 'Kandla Port, Gujarat',
    cropName: 'Royal 1121 Extra Long Grain Basmati Rice',
    scientificName: 'Oryza sativa',
    category: 'Grains',
    qualityGrade: 'Grade A+',
    qualityScore: 4.8,
    availableQuantityMT: 60,
    minOrderQuantityMT: 20,
    containerType: '20ft Dry FCL',
    packaging: '25kg Non-Woven Polypropylene Export Bags',
    pricePerKgUSD: 1.35,
    fobPricePerMTUSD: 1350,
    cifEstimatesUSD: {
      dubai: 1520,
      rotterdam: 1680,
      singapore: 1560,
      london: 1700,
      newyork: 1850,
    },
    incotermsAvailable: ['FOB', 'CIF'],
    harvestDate: '2026-09-10',
    shelfLifeDays: 730,
    temperatureControlled: false,
    certifications: ['APEDA Certified', 'Phytosanitary Cleared', 'ISO 22000', 'SGS Verified'],
    apedaCertificateNo: 'APEDA/BAS/2026/4402',
    sgsInspectionStatus: 'CERTIFIED',
    images: [
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?auto=format&fit=crop&w=800&q=80',
    ],
    primaryImageIndex: 0,
    description: 'Aged 2 years, average grain length 8.35mm before cooking, elongation ratio 2.5x with delicate floral aroma. Certified zero aflatoxins.',
    status: 'ACTIVE',
    createdAt: '2026-09-17T08:30:00.000Z',
  },
  {
    id: 'exp-crop-3',
    farmerId: 'intl-farmer-1',
    farmerName: 'Kiran Patel',
    farmName: 'Salem Organic Spice Cultivators Hub',
    farmerPhone: '+91 98450 12345',
    farmerEmail: 'exports@greenvalleyagri.com',
    originCountry: 'India',
    originPort: 'Chennai Port',
    cropName: 'High-Curcumin Salem Organic Turmeric Fingers',
    scientificName: 'Curcuma longa',
    category: 'Spices',
    qualityGrade: 'Grade A+',
    qualityScore: 4.9,
    availableQuantityMT: 30,
    minOrderQuantityMT: 5,
    containerType: '20ft Dry FCL',
    packaging: '50kg Double Jute Bags with inner Food-Grade Liner',
    pricePerKgUSD: 2.2,
    fobPricePerMTUSD: 2200,
    cifEstimatesUSD: {
      dubai: 2450,
      rotterdam: 2680,
      singapore: 2500,
      london: 2720,
      newyork: 2900,
    },
    incotermsAvailable: ['FOB', 'CIF', 'EXW'],
    harvestDate: '2026-09-12',
    shelfLifeDays: 365,
    temperatureControlled: false,
    certifications: ['USDA Organic', 'EU Organic', 'APEDA Certified', 'Spices Board Verified'],
    apedaCertificateNo: 'APEDA/SPICE/2026/7781',
    sgsInspectionStatus: 'PASSED',
    images: [
      'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=800&q=80',
    ],
    primaryImageIndex: 0,
    description: 'Deep orange-yellow turmeric fingers with lab-tested Curcumin concentration > 5.4%. Low lead/heavy metal content meeting strict EU/US FDA standards.',
    status: 'ACTIVE',
    createdAt: '2026-09-16T14:20:00.000Z',
  },
  {
    id: 'exp-crop-4',
    farmerId: 'intl-farmer-1',
    farmerName: 'Kiran Patel',
    farmName: 'Theni Valley Cavendish Banana FPO',
    farmerPhone: '+91 98450 12345',
    farmerEmail: 'exports@greenvalleyagri.com',
    originCountry: 'India',
    originPort: 'Cochin Port',
    cropName: 'Export Grade Cavendish Green Bananas (Class 1)',
    scientificName: 'Musa acuminata',
    category: 'Fruits',
    qualityGrade: 'Grade A',
    qualityScore: 4.7,
    availableQuantityMT: 40,
    minOrderQuantityMT: 20,
    containerType: '40ft High Cube Reefer',
    packaging: '13kg Corrugated Cartons with Poly-Lined Foam',
    pricePerKgUSD: 0.9,
    fobPricePerMTUSD: 900,
    cifEstimatesUSD: {
      dubai: 1100,
      rotterdam: 1350,
      singapore: 1200,
      london: 1380,
      newyork: 1550,
    },
    incotermsAvailable: ['FOB', 'CIF'],
    harvestDate: '2026-09-19',
    shelfLifeDays: 35,
    temperatureControlled: true,
    targetTempCelsius: '13.5°C Controlled Atmosphere',
    certifications: ['GlobalG.A.P.', 'APEDA Certified', 'Phytosanitary Cleared'],
    apedaCertificateNo: 'APEDA/BAN/2026/3012',
    sgsInspectionStatus: 'PASSED',
    images: [
      'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1603833665858-e61d17a86224?auto=format&fit=crop&w=800&q=80',
    ],
    primaryImageIndex: 0,
    description: 'Uniform 39-44 caliber green bananas harvested at 75-80% maturity stage. Shipped in modified atmosphere liner for extended sea voyage stability.',
    status: 'ACTIVE',
    createdAt: '2026-09-19T06:00:00.000Z',
  },
  {
    id: 'exp-crop-5',
    farmerId: 'intl-farmer-1',
    farmerName: 'Kiran Patel',
    farmName: 'Nashik Agri Producer Consortium',
    farmerPhone: '+91 98450 12345',
    farmerEmail: 'exports@greenvalleyagri.com',
    originCountry: 'India',
    originPort: 'JNPT Port, Mumbai',
    cropName: 'Fresh Nashik Pink Export Onions (55mm+)',
    scientificName: 'Allium cepa',
    category: 'Vegetables',
    qualityGrade: 'Grade A',
    qualityScore: 4.6,
    availableQuantityMT: 50,
    minOrderQuantityMT: 25,
    containerType: '20ft Reefer FCL',
    packaging: '25kg Red Mesh Export Leno Bags',
    pricePerKgUSD: 0.48,
    fobPricePerMTUSD: 480,
    cifEstimatesUSD: {
      dubai: 620,
      rotterdam: 780,
      singapore: 690,
      london: 810,
      newyork: 920,
    },
    incotermsAvailable: ['FOB', 'CIF'],
    harvestDate: '2026-09-14',
    shelfLifeDays: 90,
    temperatureControlled: true,
    targetTempCelsius: '0°C - 2°C, 65% RH',
    certifications: ['APEDA Certified', 'Phytosanitary Cleared', 'SGS Verified'],
    apedaCertificateNo: 'APEDA/ONION/2026/8890',
    sgsInspectionStatus: 'CERTIFIED',
    images: [
      'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=800&q=80',
    ],
    primaryImageIndex: 0,
    description: 'Dry cured, well-formed pink globe onions with tight skin and high pungency. Machine graded for 55mm to 70mm diameter export standards.',
    status: 'ACTIVE',
    createdAt: '2026-09-15T11:00:00.000Z',
  },
  {
    id: 'exp-crop-6',
    farmerId: 'intl-farmer-1',
    farmerName: 'Kiran Patel',
    farmName: 'Malabar Highland Spice Producers',
    farmerPhone: '+91 98450 12345',
    farmerEmail: 'exports@greenvalleyagri.com',
    originCountry: 'India',
    originPort: 'Cochin Port',
    cropName: 'Malabar Extra Bold Garbled Black Pepper (TGSEB)',
    scientificName: 'Piper nigrum',
    category: 'Spices',
    qualityGrade: 'Grade A+',
    qualityScore: 5.0,
    availableQuantityMT: 15,
    minOrderQuantityMT: 2,
    containerType: '20ft Dry FCL',
    packaging: '25kg Multi-Wall Paper Bags with PE Liner',
    pricePerKgUSD: 6.8,
    fobPricePerMTUSD: 6800,
    cifEstimatesUSD: {
      dubai: 7100,
      rotterdam: 7450,
      singapore: 7200,
      london: 7500,
      newyork: 7700,
    },
    incotermsAvailable: ['FOB', 'CIF', 'EXW'],
    harvestDate: '2026-09-08',
    shelfLifeDays: 730,
    temperatureControlled: false,
    certifications: ['Spices Board India Certified', 'USDA Organic', 'EU Phytosanitary', 'SGS Verified'],
    apedaCertificateNo: 'APEDA/PEP/2026/1099',
    sgsInspectionStatus: 'CERTIFIED',
    images: [
      'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=800&q=80',
    ],
    primaryImageIndex: 0,
    description: 'Tellicherry Garbled Special Extra Bold (TGSEB) berries (> 4.75mm diameter), harvested from shade-grown Wayanad vines with piperine content > 6.2%.',
    status: 'ACTIVE',
    createdAt: '2026-09-14T16:00:00.000Z',
  },
];

export const SEED_EXPORT_ORDERS: ExportOrder[] = [
  {
    id: 'EXP-9021',
    exportListingId: 'exp-crop-1',
    cropName: 'Ratnagiri Export Alphonso Mangoes',
    cropImage: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80',
    category: 'Fruits',
    farmerId: 'intl-farmer-1',
    farmerName: 'Kiran Patel',
    farmName: 'Green Valley Global Agri Exports Consortium',
    farmerPhone: '+91 98450 12345',
    farmerEmail: 'exports@greenvalleyagri.com',
    originPort: 'JNPT Port, Mumbai',
    buyerId: 'intl-buyer-1',
    buyerName: 'Alexandre Dubois',
    buyerCompany: 'EuroFresh Continental Imports B.V.',
    buyerCountry: 'Netherlands',
    destinationPort: 'Port of Rotterdam',
    quantityMT: 20,
    containerCount: 1,
    containerType: '20ft Reefer FCL',
    incoterm: 'CIF',
    currency: 'USD',
    unitPriceUSD: 3.45,
    totalAmountUSD: 69000,
    paymentMethod: 'LETTER_OF_CREDIT',
    lcReferenceNumber: 'LC-ING-ROT-2026-8819',
    billOfLadingNo: 'MEDU-902184-IN',
    containerNumber: 'MSCU-902184-7',
    vesselName: 'MSC Oscar (Voyage 402W)',
    carrierName: 'Mediterranean Shipping Company (MSC)',
    estimatedArrivalDate: '2026-10-04',
    status: 'IN_TRANSIT_SEA',
    phytosanitaryCertificateNo: 'IND-PHYTO-2026-9021',
    apedaCertificateNo: 'APEDA/EXP/2026/9021',
    createdAt: '2026-09-18T12:00:00.000Z',
  },
  {
    id: 'EXP-9034',
    exportListingId: 'exp-crop-4',
    cropName: 'Export Grade Cavendish Green Bananas (Class 1)',
    cropImage: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=80',
    category: 'Fruits',
    farmerId: 'intl-farmer-1',
    farmerName: 'Kiran Patel',
    farmName: 'Green Valley Global Agri Exports Consortium',
    farmerPhone: '+91 98450 12345',
    farmerEmail: 'exports@greenvalleyagri.com',
    originPort: 'Cochin Port',
    buyerId: 'intl-buyer-2',
    buyerName: 'Tariq Al-Mansoor',
    buyerCompany: 'Al-Barakah Supermarkets & Wholesale LLC',
    buyerCountry: 'United Arab Emirates',
    destinationPort: 'Port of Jebel Ali, Dubai',
    quantityMT: 40,
    containerCount: 2,
    containerType: '40ft High Cube Reefer',
    incoterm: 'CIF',
    currency: 'USD',
    unitPriceUSD: 1.1,
    totalAmountUSD: 44000,
    paymentMethod: 'INTERNATIONAL_ESCROW',
    billOfLadingNo: 'HLCU-DXB-2026-4412',
    containerNumber: 'HLXU-441029-3',
    vesselName: 'Hapag-Lloyd Express VII',
    carrierName: 'Hapag-Lloyd AG',
    estimatedArrivalDate: '2026-09-28',
    status: 'CUSTOMS_APPROVED',
    phytosanitaryCertificateNo: 'IND-PHYTO-2026-3012',
    apedaCertificateNo: 'APEDA/BAN/2026/3012',
    createdAt: '2026-09-19T09:15:00.000Z',
  },
  {
    id: 'EXP-9048',
    exportListingId: 'exp-crop-3',
    cropName: 'High-Curcumin Salem Organic Turmeric Fingers',
    cropImage: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80',
    category: 'Spices',
    farmerId: 'intl-farmer-1',
    farmerName: 'Kiran Patel',
    farmName: 'Green Valley Global Agri Exports Consortium',
    farmerPhone: '+91 98450 12345',
    farmerEmail: 'exports@greenvalleyagri.com',
    originPort: 'Chennai Port',
    buyerId: 'intl-buyer-3',
    buyerName: 'Mei-Ling Chen',
    buyerCompany: 'BioGlobal Nutraceuticals Singapore Pte Ltd',
    buyerCountry: 'Singapore',
    destinationPort: 'Port of Singapore',
    quantityMT: 10,
    containerCount: 1,
    containerType: '20ft Dry FCL',
    incoterm: 'FOB',
    currency: 'USD',
    unitPriceUSD: 2.2,
    totalAmountUSD: 22000,
    paymentMethod: 'LETTER_OF_CREDIT',
    lcReferenceNumber: 'LC-DBS-SIN-2026-9901',
    estimatedArrivalDate: '2026-10-02',
    status: 'LC_ESCROW_LOCKED',
    phytosanitaryCertificateNo: 'IND-PHYTO-2026-7781',
    apedaCertificateNo: 'APEDA/SPICE/2026/7781',
    createdAt: '2026-09-20T07:45:00.000Z',
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
      localStorage.setItem(STORAGE_KEYS.EXPORT_CROPS, JSON.stringify(SEED_EXPORT_LISTINGS));
      localStorage.setItem(STORAGE_KEYS.EXPORT_ORDERS, JSON.stringify(SEED_EXPORT_ORDERS));
      localStorage.setItem(STORAGE_KEYS.WEIGHTS, JSON.stringify(DEFAULT_WEIGHTS));
      localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
    } else {
      // Ensure export collections exist in localStorage
      if (!localStorage.getItem(STORAGE_KEYS.EXPORT_CROPS)) {
        localStorage.setItem(STORAGE_KEYS.EXPORT_CROPS, JSON.stringify(SEED_EXPORT_LISTINGS));
      }
      if (!localStorage.getItem(STORAGE_KEYS.EXPORT_ORDERS)) {
        localStorage.setItem(STORAGE_KEYS.EXPORT_ORDERS, JSON.stringify(SEED_EXPORT_ORDERS));
      }
    }
  },

  getRegion(): RegionType {
    const saved = localStorage.getItem(STORAGE_KEYS.SELECTED_REGION);
    return saved === 'INTERNATIONAL' ? 'INTERNATIONAL' : 'LOCAL';
  },

  setRegion(region: RegionType) {
    localStorage.setItem(STORAGE_KEYS.SELECTED_REGION, region);
  },

  getCurrentUser(): User | null {
    this.initialize();
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  },

  setCurrentUser(user: User | null) {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
      if (user.region) {
        this.setRegion(user.region);
      }
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

  // International Export Methods
  getExportListings(): ExportListing[] {
    this.initialize();
    const data = localStorage.getItem(STORAGE_KEYS.EXPORT_CROPS);
    return data ? JSON.parse(data) : SEED_EXPORT_LISTINGS;
  },

  saveExportListings(listings: ExportListing[]) {
    localStorage.setItem(STORAGE_KEYS.EXPORT_CROPS, JSON.stringify(listings));
  },

  addExportListing(listing: Omit<ExportListing, 'id' | 'createdAt'>): ExportListing {
    const listings = this.getExportListings();
    const newListing: ExportListing = {
      ...listing,
      id: `exp-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      createdAt: new Date().toISOString(),
    };
    listings.unshift(newListing);
    this.saveExportListings(listings);
    return newListing;
  },

  updateExportListing(id: string, updatedFields: Partial<ExportListing>): ExportListing | null {
    const listings = this.getExportListings();
    const index = listings.findIndex((l) => l.id === id);
    if (index === -1) return null;

    const updated = { ...listings[index], ...updatedFields };
    listings[index] = updated;
    this.saveExportListings(listings);
    return updated;
  },

  deleteExportListing(id: string): boolean {
    const listings = this.getExportListings();
    const filtered = listings.filter((l) => l.id !== id);
    if (filtered.length === listings.length) return false;
    this.saveExportListings(filtered);
    return true;
  },

  getExportOrders(): ExportOrder[] {
    this.initialize();
    const data = localStorage.getItem(STORAGE_KEYS.EXPORT_ORDERS);
    return data ? JSON.parse(data) : SEED_EXPORT_ORDERS;
  },

  saveExportOrders(orders: ExportOrder[]) {
    localStorage.setItem(STORAGE_KEYS.EXPORT_ORDERS, JSON.stringify(orders));
  },

  createExportOrder(orderData: Omit<ExportOrder, 'id' | 'createdAt'>): ExportOrder {
    const orders = this.getExportOrders();
    const newOrder: ExportOrder = {
      ...orderData,
      id: `EXP-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'INQUIRY_PLACED',
      createdAt: new Date().toISOString(),
    };
    orders.unshift(newOrder);
    this.saveExportOrders(orders);

    // Deduct available export quantity
    const listings = this.getExportListings();
    const listing = listings.find((l) => l.id === orderData.exportListingId);
    if (listing) {
      listing.availableQuantityMT = Math.max(0, listing.availableQuantityMT - orderData.quantityMT);
      if (listing.availableQuantityMT === 0) {
        listing.status = 'BOOKED';
      }
      this.saveExportListings(listings);
    }

    return newOrder;
  },

  updateExportOrderStatus(orderId: string, status: ExportOrderStatus): ExportOrder | null {
    const orders = this.getExportOrders();
    const index = orders.findIndex((o) => o.id === orderId);
    if (index === -1) return null;

    orders[index].status = status;
    this.saveExportOrders(orders);
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
