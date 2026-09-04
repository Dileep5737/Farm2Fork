import React, { useEffect, useRef } from 'react';
import { Coordinates, CropListing, User } from '../../types';
import L from 'leaflet';
import { ExternalLink, MapPin, Navigation } from 'lucide-react';

interface FarmMapViewProps {
  crops: CropListing[];
  buyer: User;
  selectedCropId?: string;
  onSelectCrop?: (crop: CropListing) => void;
  height?: string;
  zoomLevel?: number;
}

export const FarmMapView: React.FC<FarmMapViewProps> = ({
  crops,
  buyer,
  selectedCropId,
  onSelectCrop,
  height = '420px',
  zoomLevel = 11,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Clean up previous map if exists
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const initialLat = buyer?.coordinates?.lat || 12.9784;
    const initialLng = buyer?.coordinates?.lng || 77.6408;

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: zoomLevel,
      zoomControl: true,
      scrollWheelZoom: false,
    });

    mapInstanceRef.current = map;

    // OpenStreetMap free tile layer (zero paid keys needed!)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    // Custom Buyer Icon
    const buyerIcon = L.divIcon({
      className: 'custom-buyer-marker',
      html: `
        <div style="
          background: #2563eb;
          color: white;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 15px rgba(37, 99, 235, 0.6);
          border: 3px solid white;
          font-weight: bold;
        ">
          📍
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
    });

    const buyerMarker = L.marker([initialLat, initialLng], { icon: buyerIcon }).addTo(map);
    buyerMarker.bindPopup(`
      <div style="padding: 4px; font-family: system-ui;">
        <span style="background: #dbeafe; color: #1e40af; font-size: 11px; font-weight: 700; padding: 2px 6px; border-radius: 4px;">YOUR LOCATION</span>
        <h4 style="margin: 4px 0 2px; font-weight: 700; color: #1e293b;">${buyer?.name || 'Buyer Location'}</h4>
        <p style="margin: 0; font-size: 12px; color: #64748b;">${buyer?.location || 'Indiranagar, Bengaluru'}</p>
      </div>
    `);

    // Add Proximity Radius Circle around buyer (25km)
    L.circle([initialLat, initialLng], {
      color: '#16a34a',
      fillColor: '#22c55e',
      fillOpacity: 0.08,
      radius: 25000,
      weight: 1.5,
      dashArray: '4, 8',
    }).addTo(map);

    // Add Markers for each unique farm/crop
    markersRef.current = [];
    const bounds = L.latLngBounds([initialLat, initialLng], [initialLat, initialLng]);

    crops.forEach((crop) => {
      const isSelected = crop.id === selectedCropId;
      const isTopScore = crop.qualityRating >= 4.8;

      const farmIcon = L.divIcon({
        className: 'custom-farm-marker',
        html: `
          <div style="
            background: ${isSelected ? '#15803d' : isTopScore ? '#16a34a' : '#059669'};
            color: white;
            width: ${isSelected ? '44px' : '38px'};
            height: ${isSelected ? '44px' : '38px'};
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
            border: 3px solid ${isSelected ? '#facc15' : 'white'};
            font-size: 18px;
            cursor: pointer;
            transition: transform 0.2s;
          ">
            🌱
          </div>
        `,
        iconSize: [isSelected ? 44 : 38, isSelected ? 44 : 38],
        iconAnchor: [isSelected ? 22 : 19, isSelected ? 22 : 19],
      });

      const marker = L.marker([crop.coordinates.lat, crop.coordinates.lng], { icon: farmIcon }).addTo(map);

      const popupContent = document.createElement('div');
      popupContent.style.fontFamily = 'system-ui, sans-serif';
      popupContent.style.padding = '4px';
      popupContent.innerHTML = `
        <div style="min-width: 180px;">
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 4px;">
            <span style="background: #dcfce7; color: #166534; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px;">
              ⭐ ${crop.qualityRating.toFixed(1)} / 5 (${crop.qualityGrade})
            </span>
            <span style="font-size: 11px; font-weight: 600; color: #64748b;">
              ${crop.distanceKm || '5'} km away
            </span>
          </div>
          <h4 style="margin: 2px 0; font-size: 14px; font-weight: 700; color: #0f172a;">${crop.farmName}</h4>
          <p style="margin: 0 0 6px; font-size: 12px; color: #475569;">${crop.farmerName} • ${crop.cropName}</p>
          <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid #e2e8f0; padding-top: 6px; margin-top: 4px;">
            <span style="font-size: 15px; font-weight: 800; color: #15803d;">₹${crop.pricePerKg}/kg</span>
            <span style="font-size: 11px; color: #64748b;">Stock: ${crop.quantity} ${crop.unit}</span>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);
      marker.on('click', () => {
        if (onSelectCrop) onSelectCrop(crop);
      });

      markersRef.current.push(marker);
      bounds.extend([crop.coordinates.lat, crop.coordinates.lng]);
    });

    // Fit map bounds to encompass buyer and all nearby farmers
    if (crops.length > 0) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 12 });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [crops, buyer, selectedCropId, onSelectCrop, zoomLevel]);

  const targetCoords = crops[0]?.coordinates || buyer?.coordinates;
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${buyer?.coordinates?.lat || 12.9784},${buyer?.coordinates?.lng || 77.6408}&destination=${targetCoords.lat},${targetCoords.lng}`;

  return (
    <div className="relative rounded-2xl overflow-hidden border border-stone-200 shadow-md bg-stone-100">
      <div ref={mapContainerRef} style={{ height }} className="w-full" />

      {/* Floating Map Legend & Action Bar */}
      <div className="absolute bottom-3 left-3 right-3 z-[400] flex flex-wrap items-center justify-between gap-2 p-2.5 bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-stone-200 text-xs font-medium">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-stone-700">
            <span className="w-3 h-3 rounded-full bg-blue-600 inline-block border border-white shadow-sm" />
            <span>Buyer</span>
          </div>
          <div className="flex items-center gap-1.5 text-stone-700">
            <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block border border-white shadow-sm" />
            <span>Direct Farm ({crops.length} Hubs)</span>
          </div>
        </div>

        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-stone-900 text-white font-semibold hover:bg-stone-800 transition-colors shadow-sm"
        >
          <Navigation className="w-3.5 h-3.5 text-emerald-400" />
          <span>Open Navigation</span>
          <ExternalLink className="w-3 h-3 opacity-60 ml-0.5" />
        </a>
      </div>
    </div>
  );
};
