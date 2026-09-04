import React, { useState } from 'react';
import { CropListing, User } from '../../types';
import { FarmMapView } from './FarmMapView';
import { MapPin, Compass } from 'lucide-react';

interface FullMapViewPageProps {
  crops: CropListing[];
  buyer: User;
  onSelectCropForDetails: (crop: CropListing) => void;
  onSelectCropForBuy: (crop: CropListing) => void;
}

export const FullMapViewPage: React.FC<FullMapViewPageProps> = ({
  crops,
  buyer,
  onSelectCropForDetails,
  onSelectCropForBuy,
}) => {
  const [selectedCropId, setSelectedCropId] = useState<string>(crops[0]?.id || '');
  const [filterCategory, setFilterCategory] = useState<string>('All');

  const filteredCrops = filterCategory === 'All'
    ? crops
    : crops.filter((c) => c.category === filterCategory);

  const selectedCrop = crops.find((c) => c.id === selectedCropId) || crops[0];

  return (
    <div className="space-y-6 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-stone-900 to-farm-950 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-farm-500/20 text-farm-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>Farm Gate Locator</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Local Farm & Product Map
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            Discover nearby direct growers and organic farms. Click any pin to inspect available harvest products.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 bg-white/10 p-1 rounded-2xl backdrop-blur-sm border border-white/10">
          {['All', 'Vegetables', 'Fruits', 'Grains'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterCategory === cat ? 'bg-farm-600 text-white shadow-xs' : 'text-stone-300 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Map + Sidebar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Map View (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <FarmMapView
            crops={filteredCrops}
            buyer={buyer}
            selectedCropId={selectedCropId}
            onSelectCrop={(c) => setSelectedCropId(c.id)}
            height="520px"
          />
        </div>

        {/* Selected Farm Detail Card (1 Col) */}
        <div className="space-y-4">
          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-card space-y-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-farm-700 bg-farm-50 px-2.5 py-1 rounded-md border border-farm-200/60">
              Selected Farm Gate Details
            </span>

            {selectedCrop ? (
              <div className="space-y-4">
                <img
                  src={selectedCrop.images[0] || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80'}
                  alt={selectedCrop.cropName}
                  className="w-full h-44 rounded-2xl object-cover border border-stone-200 shadow-xs"
                />

                <div>
                  <h3 className="text-lg font-extrabold text-stone-900">{selectedCrop.farmName}</h3>
                  <p className="text-xs text-stone-600">Grower: <strong>{selectedCrop.farmerName}</strong></p>
                  <p className="text-xs text-stone-500 flex items-center gap-1.5 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-stone-400" />
                    <span>{selectedCrop.farmerLocation} ({selectedCrop.distanceKm || 5} km away)</span>
                  </p>
                </div>

                <div className="p-3 bg-farm-50 rounded-2xl border border-farm-200 flex justify-between items-center text-xs">
                  <div>
                    <span className="text-stone-500 block">Product Variety:</span>
                    <strong className="text-stone-900 text-sm">{selectedCrop.cropName}</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-stone-500 block">Direct Rate:</span>
                    <strong className="text-farm-700 text-base font-mono">₹{selectedCrop.pricePerKg}/kg</strong>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => onSelectCropForDetails(selectedCrop)}
                    className="flex-1 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-colors"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => onSelectCropForBuy(selectedCrop)}
                    className="flex-1 py-2.5 rounded-xl bg-farm-600 hover:bg-farm-700 text-white text-xs font-extrabold shadow-sm transition-colors"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-stone-500">Select a farm pin on the map to inspect details.</p>
            )}
          </div>

          {/* Quick List of Nearby Hubs */}
          <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-card space-y-3">
            <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
              Direct Farmer Hubs ({filteredCrops.length})
            </h4>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {filteredCrops.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCropId(c.id)}
                  className={`w-full text-left p-2.5 rounded-xl text-xs flex items-center justify-between transition-all ${
                    selectedCropId === c.id
                      ? 'bg-farm-50 border border-farm-300 text-farm-900 font-bold'
                      : 'hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <div className="truncate pr-2">
                    <div className="truncate">{c.farmName}</div>
                    <div className="text-[11px] text-stone-500 font-normal">{c.cropName}</div>
                  </div>
                  <span className="text-farm-700 font-mono shrink-0">₹{c.pricePerKg}/kg</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
