import React, { useState } from 'react';
import { CropListing, ScoredCropListing, User } from '../../types';
import {
  X,
  Star,
  MapPin,
  Phone,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { FarmMapView } from '../map/FarmMapView';

interface CropDetailsModalProps {
  crop: ScoredCropListing | CropListing;
  buyer: User;
  isOpen: boolean;
  onClose: () => void;
  onBuyNow: (crop: CropListing) => void;
}

export const CropDetailsModal: React.FC<CropDetailsModalProps> = ({
  crop,
  buyer,
  isOpen,
  onClose,
  onBuyNow,
}) => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(crop.primaryImageIndex || 0);

  if (!isOpen) return null;

  const images = crop.images && crop.images.length > 0 ? crop.images : ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80'];
  const activeImage = images[selectedPhotoIndex] || images[0];

  const recommendation = 'recommendation' in crop ? crop.recommendation : null;
  const retailSavingsPerKg = (crop.retailPricePerKg || Math.round(crop.pricePerKg * 1.35)) - crop.pricePerKg;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden animate-slide-up my-6 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-farm-900 via-stone-900 to-stone-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-md bg-farm-500/20 text-farm-300 text-xs font-bold uppercase tracking-wider">
              {crop.category}
            </span>
            <h3 className="text-lg font-bold text-white truncate max-w-md">{crop.cropName}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left: Image Gallery */}
            <div className="space-y-4">
              <div className="relative h-72 sm:h-80 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shadow-md">
                <img
                  src={activeImage}
                  alt={crop.cropName}
                  className="w-full h-full object-cover transition-all duration-300"
                />
                {crop.isOrganic && (
                  <div className="absolute top-3 left-3 bg-emerald-700/90 text-white text-xs font-bold px-3 py-1 rounded-lg backdrop-blur-sm flex items-center gap-1.5 shadow-sm">
                    <span>🌿</span> Certified Organic
                  </div>
                )}
                <div className="absolute bottom-3 right-3 bg-stone-950/80 text-white text-xs font-mono px-2.5 py-1 rounded-lg backdrop-blur-sm">
                  Photo {selectedPhotoIndex + 1} of {images.length}
                </div>
              </div>

              {/* Thumbnails row */}
              {images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedPhotoIndex(idx)}
                      className={`relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                        selectedPhotoIndex === idx
                          ? 'border-farm-600 ring-2 ring-farm-500/30 scale-95'
                          : 'border-stone-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Farmer Info Box */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Grower Profile</span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    ⭐ {crop.farmerRating} Rating
                  </span>
                </div>
                <h4 className="font-extrabold text-stone-900 text-sm">{crop.farmName}</h4>
                <p className="text-xs text-stone-600">Farmer: {crop.farmerName}</p>
                <div className="flex items-center gap-2 text-xs text-stone-500 pt-1">
                  <Phone className="w-3.5 h-3.5 text-stone-400" />
                  <span>{crop.farmerPhone}</span>
                </div>
              </div>
            </div>

            {/* Right: Product Specs & Recommendation Breakdown */}
            <div className="space-y-6 flex flex-col justify-between">
              <div>
                {/* Price & Savings Spotlight */}
                <div className="p-5 rounded-2xl bg-farm-50/80 border border-farm-200 shadow-xs mb-4">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-xs font-bold text-farm-800 uppercase tracking-wider block mb-0.5">
                        Direct Farm-Gate Price
                      </span>
                      <div className="text-3xl font-extrabold text-farm-900">
                        ₹{crop.pricePerKg} <span className="text-sm font-normal text-stone-600">/ kg</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-stone-500 line-through block">
                        Supermarket: ₹{crop.retailPricePerKg || Math.round(crop.pricePerKg * 1.35)}/kg
                      </span>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                        Save ₹{retailSavingsPerKg}/kg (-{Math.round((retailSavingsPerKg / (crop.retailPricePerKg || crop.pricePerKg * 1.35)) * 100)}%)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-100">
                    <span className="text-stone-400 block mb-1">Quality Grade</span>
                    <span className="font-bold text-farm-800 text-sm flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-farm-600 text-farm-600" />
                      {crop.qualityGrade}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-100">
                    <span className="text-stone-400 block mb-1">Available Stock</span>
                    <span className="font-bold text-stone-900 text-sm">{crop.quantity} {crop.unit}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-100">
                    <span className="text-stone-400 block mb-1">Harvest Date</span>
                    <span className="font-bold text-stone-900 text-sm">{crop.harvestDate}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-100">
                    <span className="text-stone-400 block mb-1">Farm Gate Location</span>
                    <span className="font-bold text-stone-900 text-sm truncate block">{crop.farmerLocation.split(',')[0]}</span>
                  </div>
                </div>

                {/* Smart Recommendation Score Breakdown (If available) */}
                {recommendation && (
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-farm-900 to-stone-900 text-white space-y-3 mb-4 shadow-md">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-bold uppercase tracking-wider text-farm-200">
                          Smart Recommendation Score
                        </span>
                      </div>
                      <span className="text-lg font-black text-amber-300">
                        {recommendation.totalScore}% Match
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
                      <div className="p-2 rounded-xl bg-white/10">
                        <span className="block text-[10px] text-stone-300">Price (40%)</span>
                        <span className="font-bold text-emerald-400">{recommendation.priceScore} / 100</span>
                      </div>
                      <div className="p-2 rounded-xl bg-white/10">
                        <span className="block text-[10px] text-stone-300">Quality (40%)</span>
                        <span className="font-bold text-amber-400">{recommendation.qualityScore} / 100</span>
                      </div>
                      <div className="p-2 rounded-xl bg-white/10">
                        <span className="block text-[10px] text-stone-300">Distance (20%)</span>
                        <span className="font-bold text-blue-400">{recommendation.distanceScore} / 100</span>
                      </div>
                    </div>

                    <p className="text-xs text-stone-300 italic pt-1 leading-relaxed">
                      "{recommendation.rankingReason}"
                    </p>
                  </div>
                )}

                {/* Description */}
                <div>
                  <h5 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    About This Product
                  </h5>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {crop.description}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-sm transition-colors"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onBuyNow(crop);
                  }}
                  className="flex-1 py-3 px-6 rounded-xl bg-farm-600 hover:bg-farm-700 text-white font-extrabold text-sm shadow-lg shadow-farm-600/25 transition-all flex items-center justify-center gap-2"
                >
                  <span>Buy Directly From Farmer</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Farm Location Map Section */}
          <div className="pt-4 border-t border-stone-200 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-extrabold text-stone-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-farm-600" />
                  <span>Farm Location & Driving Distance</span>
                </h4>
                <p className="text-xs text-stone-500">
                  {crop.farmerLocation} • Approx <strong>{crop.distanceKm || 5} km</strong> from your address
                </p>
              </div>
            </div>

            <FarmMapView crops={[crop]} buyer={buyer} height="260px" zoomLevel={12} />
          </div>
        </div>
      </div>
    </div>
  );
};
