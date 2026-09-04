import React, { useState, useMemo } from 'react';
import { CropListing, FilterOptions, ScoredCropListing, User } from '../../types';
import { scoreAndRankCrops, DEFAULT_WEIGHTS } from '../../services/recommendation';
import {
  Search,
  SlidersHorizontal,
  Sparkles,
  Star,
  MapPin,
  Layers,
  ShoppingBag,
  Eye,
} from 'lucide-react';
import { CropDetailsModal } from './CropDetailsModal';
import { BuyOrderModal } from './BuyOrderModal';

interface BuyerMarketplaceProps {
  buyer: User;
  crops: CropListing[];
  onRefreshData: () => void;
  onNavigateToOrders: () => void;
  initialSearchQuery?: string;
  forceCompareView?: boolean;
}

export const BuyerMarketplace: React.FC<BuyerMarketplaceProps> = ({
  buyer,
  crops,
  onRefreshData,
  onNavigateToOrders,
  initialSearchQuery = '',
  forceCompareView = false,
}) => {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(300);
  const [maxDistance, setMaxDistance] = useState<number>(35);
  const [minQuality, setMinQuality] = useState<number>(4.0);
  const [sortBy, setSortBy] = useState<FilterOptions['sortBy']>('recommended');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isCompareView, setIsCompareView] = useState(forceCompareView);

  // Internal Recommendation Weights (Default: 40% Price, 40% Quality, 20% Distance)
  const weights = DEFAULT_WEIGHTS;

  // Modal States
  const [selectedCropForDetails, setSelectedCropForDetails] = useState<ScoredCropListing | null>(null);
  const [selectedCropForBuy, setSelectedCropForBuy] = useState<CropListing | null>(null);

  const buyerCoords = buyer?.coordinates || { lat: 12.9784, lng: 77.6408 };

  // Calculate recommendation scores for all available crops
  const scoredCrops = useMemo(() => {
    return scoreAndRankCrops(crops, buyerCoords, weights);
  }, [crops, buyerCoords, weights]);

  // Filter and Sort Crops
  const filteredCrops = useMemo(() => {
    let result = [...scoredCrops];

    // Status filter
    result = result.filter((c) => c.status === 'ACTIVE');

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (c) =>
          c.cropName.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q) ||
          c.farmerName.toLowerCase().includes(q) ||
          c.farmName.toLowerCase().includes(q) ||
          c.farmerLocation.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (selectedCategory !== 'All') {
      if (selectedCategory === 'Organic') {
        result = result.filter((c) => c.isOrganic);
      } else {
        result = result.filter((c) => c.category === selectedCategory);
      }
    }

    // Price range filter
    result = result.filter((c) => c.pricePerKg >= minPrice && c.pricePerKg <= maxPrice);

    // Distance filter
    result = result.filter((c) => (c.distanceKm || 0) <= maxDistance);

    // Quality filter
    result = result.filter((c) => c.qualityRating >= minQuality);

    // Sorting
    if (sortBy === 'price_low') {
      result.sort((a, b) => a.pricePerKg - b.pricePerKg);
    } else if (sortBy === 'quality_high') {
      result.sort((a, b) => b.qualityRating - a.qualityRating);
    } else if (sortBy === 'distance_near') {
      result.sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
    } else if (sortBy === 'quantity_high') {
      result.sort((a, b) => b.quantity - a.quantity);
    } else {
      // 'recommended' - Already sorted by recommendation.totalScore
      result.sort((a, b) => b.recommendation.totalScore - a.recommendation.totalScore);
    }

    return result;
  }, [scoredCrops, searchQuery, selectedCategory, minPrice, maxPrice, maxDistance, minQuality, sortBy]);

  // Identify Top Recommendation
  const topMatch = filteredCrops.length > 0 ? filteredCrops[0] : null;

  const categories = ['All', 'Vegetables', 'Fruits', 'Grains', 'Pulses', 'Organic'];

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* 1. Marketplace Header */}
      <div className="text-center max-w-3xl mx-auto pt-2">
        <span className="text-xs font-extrabold uppercase tracking-wider text-farm-700 bg-farm-100 px-3 py-1 rounded-full">
          Direct Farm-Gate Marketplace
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight mt-3 mb-2">
          Find Fresh Products Directly From Farmers
        </h1>
        <p className="text-sm text-stone-600">
          Zero middleman markups. Intelligent recommendation scoring based on Price, Quality, and Proximity.
        </p>
      </div>

      {/* 2. Search & Category Pill Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Main Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-5 h-5 text-stone-400 absolute left-4 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products (e.g. Tomato, Onion, Basmati Rice, Mango)..."
              className="w-full pl-12 pr-10 py-3 rounded-2xl bg-white border border-stone-300 shadow-sm focus:ring-2 focus:ring-farm-500 focus:border-farm-500 outline-none text-sm font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-stone-400 hover:text-stone-600 text-xs px-2 py-1 rounded-md bg-stone-100 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Action Buttons: Filter Toggle */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl border text-xs font-bold shadow-xs transition-all cursor-pointer ${
                isFilterDrawerOpen
                  ? 'bg-farm-700 text-white border-farm-800'
                  : 'bg-white border-stone-300 text-stone-700 hover:bg-stone-50'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-farm-700 text-white shadow-md shadow-farm-700/20'
                  : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
              }`}
            >
              {cat === 'All' && '🌱 All Products'}
              {cat === 'Vegetables' && '🍅 Vegetables'}
              {cat === 'Fruits' && '🥭 Fruits'}
              {cat === 'Grains' && '🌾 Grains & Cereals'}
              {cat === 'Pulses' && '🫘 Pulses & Dal'}
              {cat === 'Organic' && '🌿 100% Organic'}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Filter Panel (Collapsible) */}
      {isFilterDrawerOpen && (
        <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-card space-y-4 animate-slide-up">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h4 className="text-sm font-bold text-stone-900">Filter Controls</h4>
            <span className="text-xs text-stone-500">{filteredCrops.length} Products Found</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {/* Price Max */}
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>Max Price:</span>
                <span className="text-farm-700 font-bold">₹{maxPrice}/kg</span>
              </div>
              <input
                type="range"
                min="20"
                max="300"
                step="10"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full h-2 bg-stone-200 rounded-lg cursor-pointer accent-farm-600"
              />
            </div>

            {/* Distance Max */}
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>Max Distance:</span>
                <span className="text-farm-700 font-bold">{maxDistance} km</span>
              </div>
              <input
                type="range"
                min="5"
                max="40"
                step="2"
                value={maxDistance}
                onChange={(e) => setMaxDistance(Number(e.target.value))}
                className="w-full h-2 bg-stone-200 rounded-lg cursor-pointer accent-farm-600"
              />
            </div>

            {/* Min Quality */}
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>Min Quality Rating:</span>
                <span className="text-farm-700 font-bold">{minQuality.toFixed(1)}⭐</span>
              </div>
              <input
                type="range"
                min="3.0"
                max="5.0"
                step="0.1"
                value={minQuality}
                onChange={(e) => setMinQuality(Number(e.target.value))}
                className="w-full h-2 bg-stone-200 rounded-lg cursor-pointer accent-farm-600"
              />
            </div>

            {/* Sort Selector */}
            <div>
              <span className="font-semibold block mb-1">Sort Results By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as FilterOptions['sortBy'])}
                className="w-full px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl font-medium outline-none"
              >
                <option value="recommended">🤖 Smart Recommendation (Default)</option>
                <option value="price_low">💰 Lowest Price First</option>
                <option value="quality_high">⭐ Highest Quality Rating</option>
                <option value="distance_near">📍 Nearest Farmer First</option>
                <option value="quantity_high">📦 Largest Available Quantity</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* 5. SMART RECOMMENDATION SPOTLIGHT CARD */}
      {topMatch && (
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-farm-900 via-stone-900 to-farm-950 text-white shadow-2xl border border-farm-500/40 relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-farm-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Badge Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-amber-400 text-stone-950 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md">
                <span>🏆</span> BEST MATCH FOR YOU
              </span>
              <span className="px-3 py-1 rounded-full bg-white/10 text-farm-300 text-xs font-bold border border-white/10">
                RECOMMENDATION SCORE: {topMatch.recommendation.totalScore}%
              </span>
            </div>

            <span className="text-xs text-stone-300 font-medium flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-farm-400" />
              <span>{topMatch.farmerLocation} • Approx {topMatch.distanceKm || 5} km</span>
            </span>
          </div>

          {/* Main Card Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            {/* Image & Quick Badges */}
            <div className="relative h-48 sm:h-56 rounded-2xl overflow-hidden bg-stone-800 border border-white/10">
              <img
                src={topMatch.images[topMatch.primaryImageIndex || 0] || topMatch.images[0]}
                alt={topMatch.cropName}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 left-3 bg-stone-900/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg backdrop-blur-sm">
                {topMatch.category}
              </div>
              {topMatch.isOrganic && (
                <div className="absolute bottom-3 left-3 bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-lg flex items-center gap-1">
                  <span>🌿</span> Organic Certified
                </div>
              )}
            </div>

            {/* Farm & Product Info */}
            <div className="space-y-3 lg:col-span-2">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {topMatch.cropName}
                  </h3>
                  <p className="text-xs sm:text-sm text-farm-300 font-semibold mt-0.5">
                    {topMatch.farmName} • {topMatch.farmerName}
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">
                    ₹{topMatch.pricePerKg} <span className="text-xs font-normal text-stone-300">/kg</span>
                  </div>
                  <span className="text-[11px] text-stone-400">
                    Retail Reference: ₹{topMatch.retailPricePerKg || Math.round(topMatch.pricePerKg * 1.35)}/kg
                  </span>
                </div>
              </div>

              {/* Reasons Breakdown Tags */}
              <div className="flex flex-wrap gap-2 pt-1">
                {topMatch.recommendation.reasons.map((r, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/10 text-xs font-semibold text-stone-200"
                  >
                    {r}
                  </span>
                ))}
              </div>

              {/* Natural Language Explanation Box */}
              <div className="p-3.5 rounded-xl bg-farm-950/80 border border-farm-500/30 text-xs text-farm-100">
                <span className="font-bold text-amber-300 mr-1">Why this grower?</span>
                {topMatch.recommendation.rankingReason}
              </div>

              {/* Quick Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => setSelectedCropForDetails(topMatch)}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  <span>Inspect Quality & Farm</span>
                </button>

                <button
                  onClick={() => setIsCompareView(true)}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Layers className="w-4 h-4" />
                  <span>Compare Products</span>
                </button>

                <button
                  onClick={() => setSelectedCropForBuy(topMatch)}
                  className="px-6 py-2.5 rounded-xl bg-farm-500 hover:bg-farm-400 text-stone-950 text-xs font-black transition-all shadow-md flex items-center gap-1.5 ml-auto cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Direct Order (₹{topMatch.pricePerKg}/kg)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. MULTI-FARMER PRODUCT COMPARISON TABLE */}
      {isCompareView && (
        <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-card space-y-4 animate-slide-up">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-stone-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-farm-600" />
                <h3 className="text-lg font-bold text-stone-900">
                  Multi-Farmer Product Comparison Matrix
                </h3>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Comparing available growers side-by-side on Price, Quality Grade, Proximity, and Score.
              </p>
            </div>

            <button
              onClick={() => setIsCompareView(false)}
              className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-colors cursor-pointer"
            >
              Switch to Card View
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-200 text-[11px] font-extrabold uppercase tracking-wider text-stone-500 bg-stone-50">
                  <th className="py-3 px-4 rounded-l-xl">Farmer / FPO</th>
                  <th className="py-3 px-4">Crop Variety</th>
                  <th className="py-3 px-4">Price / kg</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4">Quality Grade</th>
                  <th className="py-3 px-4">Distance</th>
                  <th className="py-3 px-4">Smart Score</th>
                  <th className="py-3 px-4 rounded-r-xl text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-xs">
                {filteredCrops.map((c, index) => {
                  const isTopRanked = index === 0;
                  return (
                    <tr
                      key={c.id}
                      className={`hover:bg-stone-50/80 transition-colors ${
                        isTopRanked ? 'bg-farm-50/50 font-medium' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-stone-900 flex items-center gap-1.5">
                          {c.farmName}
                          {isTopRanked && (
                            <span className="text-[10px] bg-amber-400 text-stone-950 font-black px-1.5 py-0.2 rounded">
                              TOP
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-stone-500">{c.farmerName}</div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-stone-800">
                        {c.cropName}
                        {c.isOrganic && <span className="ml-1 text-[10px] text-emerald-700 font-bold">🌿 Organic</span>}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-extrabold text-farm-700 text-sm">
                        ₹{c.pricePerKg}
                        <span className="text-[10px] text-stone-400 font-normal ml-0.5">/kg</span>
                      </td>
                      <td className="py-3.5 px-4 text-stone-600">
                        {c.quantity} {c.unit}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-farm-100 text-farm-900 font-bold text-xs">
                          <Star className="w-3 h-3 fill-farm-700 text-farm-700" />
                          <span>{c.qualityGrade}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-stone-600 font-medium">
                        📍 {c.distanceKm || 5} km
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`px-2 py-1 rounded-lg text-xs font-black ${
                              isTopRanked
                                ? 'bg-farm-600 text-white'
                                : 'bg-stone-100 text-stone-800 border border-stone-200'
                            }`}
                          >
                            {c.recommendation.totalScore}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedCropForDetails(c)}
                            className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-200"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setSelectedCropForBuy(c)}
                            className="px-3 py-1.5 rounded-xl bg-farm-600 hover:bg-farm-700 text-white font-bold text-xs shadow-xs"
                          >
                            Buy
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 7. Product Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-extrabold text-stone-900">
            Available Products ({filteredCrops.length})
          </h3>
          <span className="text-xs text-stone-500">
            Click any card to inspect quality photos and farm location.
          </span>
        </div>

        {filteredCrops.length === 0 ? (
          <div className="text-center p-12 bg-white rounded-3xl border border-stone-200 shadow-card">
            <p className="text-stone-500 text-sm">No products match your search or filter criteria.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setMaxPrice(300);
                setMaxDistance(35);
                setMinQuality(4.0);
              }}
              className="mt-3 px-4 py-2 bg-farm-600 text-white rounded-xl text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCrops.map((crop) => {
              const primaryImg = crop.images[crop.primaryImageIndex || 0] || crop.images[0];
              const retailPrice = crop.retailPricePerKg || Math.round(crop.pricePerKg * 1.35);
              const savings = retailPrice - crop.pricePerKg;

              return (
                <div
                  key={crop.id}
                  className="bg-white rounded-3xl border border-stone-200 shadow-card overflow-hidden hover:shadow-card-hover transition-all flex flex-col justify-between group"
                >
                  {/* Top Image Section */}
                  <div className="relative h-52 bg-stone-100 overflow-hidden cursor-pointer" onClick={() => setSelectedCropForDetails(crop)}>
                    <img
                      src={primaryImg}
                      alt={crop.cropName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Category & Organic Badges */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      <span className="px-2.5 py-1 rounded-md bg-stone-900/80 backdrop-blur-md text-white text-[11px] font-bold">
                        {crop.category}
                      </span>
                      {crop.isOrganic && (
                        <span className="px-2.5 py-1 rounded-md bg-emerald-600/90 backdrop-blur-md text-white text-[11px] font-bold flex items-center gap-1">
                          <span>🌿</span> Organic
                        </span>
                      )}
                    </div>

                    {/* Recommendation Score Badge */}
                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-1 rounded-md bg-stone-900/85 backdrop-blur-md text-amber-400 text-xs font-black border border-amber-400/30 flex items-center gap-1 shadow-sm">
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        <span>{crop.recommendation.totalScore}% Match</span>
                      </span>
                    </div>

                    {/* Distance & Photos Tag */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-bold text-white">
                      <span className="bg-stone-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-blue-400" />
                        <span>{crop.distanceKm || 5} km away</span>
                      </span>

                      <span className="bg-stone-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg">
                        {crop.images.length} Photos
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Quality Grade Bar */}
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="font-semibold text-stone-500 truncate">{crop.farmName}</span>
                        <span className="inline-flex items-center gap-1 text-farm-800 font-bold bg-farm-100 px-2 py-0.5 rounded">
                          <Star className="w-3 h-3 fill-farm-700 text-farm-700" />
                          <span>{crop.qualityGrade}</span>
                        </span>
                      </div>

                      {/* Crop Title */}
                      <h4
                        onClick={() => setSelectedCropForDetails(crop)}
                        className="text-lg font-extrabold text-stone-900 cursor-pointer hover:text-farm-700 transition-colors leading-snug"
                      >
                        {crop.cropName}
                      </h4>

                      <p className="text-xs text-stone-500 line-clamp-2 mt-1 mb-4 leading-relaxed">
                        {crop.description}
                      </p>

                      {/* Pricing & Stock Details */}
                      <div className="p-3 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-between mb-4">
                        <div>
                          <span className="text-[10px] text-stone-400 uppercase tracking-wider block font-bold">
                            Direct Farm Price
                          </span>
                          <div className="text-xl font-black text-farm-800">
                            ₹{crop.pricePerKg} <span className="text-xs font-normal text-stone-500">/kg</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-[11px] text-stone-400 line-through block">
                            Market Ref: ₹{retailPrice}/kg
                          </span>
                          <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                            Save ₹{savings}/kg
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="flex items-center gap-2 pt-2 border-t border-stone-100">
                      <button
                        onClick={() => setSelectedCropForDetails(crop)}
                        className="flex-1 py-2.5 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect Farm</span>
                      </button>

                      <button
                        onClick={() => setSelectedCropForBuy(crop)}
                        className="flex-1 py-2.5 px-3 rounded-xl bg-farm-600 hover:bg-farm-700 text-white text-xs font-extrabold shadow-sm flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Direct Buy</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 8. Full Modal Overlays */}
      {selectedCropForDetails && (
        <CropDetailsModal
          crop={selectedCropForDetails}
          buyer={buyer}
          isOpen={!!selectedCropForDetails}
          onClose={() => setSelectedCropForDetails(null)}
          onBuyNow={(c) => {
            setSelectedCropForDetails(null);
            setSelectedCropForBuy(c);
          }}
        />
      )}

      {selectedCropForBuy && (
        <BuyOrderModal
          crop={selectedCropForBuy}
          buyer={buyer}
          isOpen={!!selectedCropForBuy}
          onClose={() => setSelectedCropForBuy(null)}
          onOrderSuccess={() => {
            onRefreshData();
            onNavigateToOrders();
          }}
        />
      )}
    </div>
  );
};
