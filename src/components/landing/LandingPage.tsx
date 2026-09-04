import React, { useState } from 'react';
import { Role } from '../../types';
import {
  Sprout,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Truck,
  TrendingUp,
  MapPin,
  CheckCircle2,
  Users,
  ChevronRight,
  Scale,
  Zap,
  ShoppingBag,
  Sliders,
  DollarSign,
} from 'lucide-react';

interface LandingPageProps {
  onLoginAs: (role: Role) => void;
  onExploreMarketplace: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onLoginAs,
  onExploreMarketplace,
}) => {
  // Interactive Calculator State
  const [calcCrop, setCalcCrop] = useState<'Tomato' | 'Onion' | 'Potato' | 'Rice' | 'Mango'>('Tomato');
  const [calcQty, setCalcQty] = useState<number>(100);

  const CROP_BENCHMARKS = {
    Tomato: { farmerTraditional: 18, consumerTraditional: 42, farm2forkPrice: 30 },
    Onion: { farmerTraditional: 14, consumerTraditional: 36, farm2forkPrice: 22 },
    Potato: { farmerTraditional: 15, consumerTraditional: 38, farm2forkPrice: 24 },
    Rice: { farmerTraditional: 55, consumerTraditional: 120, farm2forkPrice: 85 },
    Mango: { farmerTraditional: 110, consumerTraditional: 280, farm2forkPrice: 180 },
  };

  const selectedData = CROP_BENCHMARKS[calcCrop];
  const traditionalFarmerTotal = selectedData.farmerTraditional * calcQty;
  const traditionalConsumerTotal = selectedData.consumerTraditional * calcQty;
  const farm2forkTotal = selectedData.farm2forkPrice * calcQty;

  const farmerExtraGain = farm2forkTotal - traditionalFarmerTotal;
  const buyerSavings = traditionalConsumerTotal - farm2forkTotal;
  const middlemanLeakage = traditionalConsumerTotal - traditionalFarmerTotal;

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. Hero Section (Dark Tomato Theme) */}
      <section className="relative overflow-hidden pt-12 sm:pt-20 pb-16 sm:pb-24 rounded-3xl mx-4 sm:mx-6 lg:mx-8 bg-stone-950 text-white shadow-2xl border border-stone-800">
        {/* Tomato Background Image with Dark Vignette Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/tomato_login.jpg"
            alt="Farm Fresh Tomatoes"
            className="w-full h-full object-cover opacity-35 object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-950/90 via-stone-950/75 to-stone-950/95" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Direct Marketplace Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-farm-500/20 border border-farm-400/30 text-farm-300 text-xs font-bold mb-6 animate-fade-in shadow-sm backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Direct Digital Marketplace • Zero Intermediary Commissions</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-6 max-w-4xl mx-auto">
            Connecting Farmers <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-farm-400 to-emerald-300">
              Directly With Buyers
            </span>
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-stone-300 max-w-2xl mx-auto font-normal leading-relaxed mb-8 sm:mb-10">
            Discover fresh farm products, compare multi-farmer prices, evaluate harvest quality, and buy directly from local growers with zero middleman commissions.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto">
            <button
              onClick={() => onLoginAs('FARMER')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-farm-600 hover:bg-farm-500 text-white font-bold text-base shadow-lg shadow-farm-600/30 flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <span>👨‍🌾 Login as Farmer</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={() => onLoginAs('BUYER')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-white hover:bg-stone-100 text-stone-950 font-bold text-base shadow-lg shadow-white/10 flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <span>🛒 Login as Buyer</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-5">
            <button
              onClick={onExploreMarketplace}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-farm-400 hover:text-farm-300 hover:underline cursor-pointer"
            >
              <span>Explore product marketplace</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Visual Step Flows */}
          <div className="mt-14 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 text-stone-900">
            {/* Flow 1 */}
            <div className="p-6 rounded-3xl bg-white/95 backdrop-blur-md border border-white/20 shadow-xl text-left">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-farm-700 bg-farm-50 px-2.5 py-1 rounded-md border border-farm-200/60">
                Direct Supply Flow
              </span>
              <h3 className="text-base font-bold text-stone-900 mt-2 mb-4">Direct Connection</h3>
              <div className="flex items-center justify-between gap-2 p-3 bg-stone-50 rounded-2xl border border-stone-200/80 text-xs sm:text-sm font-bold">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-xl">👨‍🌾</span>
                  <span className="text-stone-700">Farmer / FPO</span>
                </div>
                <ArrowRight className="w-4 h-4 text-farm-600 shrink-0" />
                <div className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl bg-farm-600 text-white shadow-xs">
                  <span className="text-base">🌱</span>
                  <span>Farm2Fork</span>
                </div>
                <ArrowRight className="w-4 h-4 text-farm-600 shrink-0" />
                <div className="flex flex-col items-center gap-1">
                  <span className="text-xl">🛒</span>
                  <span className="text-stone-700">Buyer</span>
                </div>
              </div>
            </div>

            {/* Flow 2 */}
            <div className="p-6 rounded-3xl bg-white/95 backdrop-blur-md border border-white/20 shadow-xl text-left">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/60">
                Smart Buying Flow
              </span>
              <h3 className="text-base font-bold text-stone-900 mt-2 mb-4">How You Purchase</h3>
              <div className="flex flex-wrap items-center justify-between gap-1 p-3 bg-stone-50 rounded-2xl border border-stone-200/80 text-[11px] sm:text-xs font-bold text-stone-700">
                <span className="px-2 py-1 bg-white rounded-lg border border-stone-200">1. Product</span>
                <span className="text-stone-400">→</span>
                <span className="px-2 py-1 bg-white rounded-lg border border-stone-200">2. Compare</span>
                <span className="text-stone-400">→</span>
                <span className="px-2 py-1 bg-farm-100 text-farm-800 rounded-lg border border-farm-200">3. Recommendation</span>
                <span className="text-stone-400">→</span>
                <span className="px-2 py-1 bg-white rounded-lg border border-stone-200">4. Location</span>
                <span className="text-stone-400">→</span>
                <span className="px-2 py-1 bg-stone-900 text-white rounded-lg">5. Purchase</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Interactive Direct Value & Savings Simulator */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-stone-900 via-stone-900 to-farm-950 text-white p-6 sm:p-12 shadow-2xl border border-stone-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-farm-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl mb-8">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-farm-500/20 text-farm-400 text-xs font-bold uppercase tracking-wider">
                <Scale className="w-3.5 h-3.5" />
                <span>Direct Price & Savings Simulator</span>
              </span>
              <span className="text-[11px] bg-white/10 text-stone-300 px-2.5 py-0.5 rounded-full font-medium border border-white/10">
                Illustrative estimate
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
              See How Direct Purchasing Benefits Farmers & Buyers
            </h2>
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
              In traditional supply chains, multiple intermediaries add markups. Farm2Fork directly connects farmers with buyers so farmers earn fair direct rates and buyers save on every order.
            </p>
          </div>

          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl bg-white/5 border border-white/10 mb-8 backdrop-blur-sm">
            <div>
              <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-2">
                Select Product
              </label>
              <div className="flex flex-wrap gap-2">
                {(['Tomato', 'Onion', 'Potato', 'Rice', 'Mango'] as const).map((crop) => (
                  <button
                    key={crop}
                    onClick={() => setCalcCrop(crop)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      calcCrop === crop
                        ? 'bg-farm-600 text-white shadow-md shadow-farm-600/30'
                        : 'bg-white/10 text-stone-300 hover:bg-white/20'
                    }`}
                  >
                    {crop === 'Tomato' && '🍅'}
                    {crop === 'Onion' && '🧅'}
                    {crop === 'Potato' && '🥔'}
                    {crop === 'Rice' && '🌾'}
                    {crop === 'Mango' && '🥭'} {crop}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-stone-300 uppercase tracking-wider">
                  Purchase Volume
                </label>
                <span className="text-sm font-extrabold text-farm-400">{calcQty} kg</span>
              </div>
              <input
                type="range"
                min="20"
                max="1000"
                step="20"
                value={calcQty}
                onChange={(e) => setCalcQty(Number(e.target.value))}
                className="w-full h-2 bg-white/20 rounded-lg cursor-pointer accent-farm-500"
              />
              <div className="flex justify-between text-[10px] text-stone-400 mt-1 font-mono">
                <span>20 kg (Retail)</span>
                <span>500 kg (Bulk)</span>
                <span>1000 kg (Commercial)</span>
              </div>
            </div>
          </div>

          {/* Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Traditional Supply Chain */}
            <div className="p-6 rounded-2xl bg-rose-950/30 border border-rose-800/40 text-left relative">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-extrabold uppercase tracking-wider text-rose-400 bg-rose-900/50 px-2.5 py-1 rounded-md">
                  Traditional Supply Chain
                </span>
                <span className="text-xs font-mono text-rose-300">Multiple Intermediaries</span>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-stone-300">Farmer Selling Price:</span>
                  <span className="font-mono font-bold text-white">₹{selectedData.farmerTraditional}/kg (₹{traditionalFarmerTotal.toLocaleString('en-IN')})</span>
                </div>
                <div className="flex justify-between items-center text-xs text-rose-300">
                  <span>Intermediary Markups & Commissions:</span>
                  <span className="font-mono font-bold">₹{selectedData.consumerTraditional - selectedData.farmerTraditional}/kg (₹{middlemanLeakage.toLocaleString('en-IN')})</span>
                </div>
                <div className="flex justify-between items-center text-sm font-bold pt-3 border-t border-rose-800/40">
                  <span className="text-white">Consumer Price:</span>
                  <span className="font-mono text-rose-400 text-base">₹{selectedData.consumerTraditional}/kg (₹{traditionalConsumerTotal.toLocaleString('en-IN')})</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-rose-900/40 border border-rose-700/40 text-xs text-rose-200">
                Traditional supply chain: Farmer receives lower earnings while retail consumers pay inflated prices.
              </div>
            </div>

            {/* Farm2Fork Direct */}
            <div className="p-6 rounded-2xl bg-farm-950/60 border border-farm-500/40 text-left relative shadow-lg shadow-farm-950/50">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-extrabold uppercase tracking-wider text-farm-300 bg-farm-900/80 px-2.5 py-1 rounded-md border border-farm-500/30">
                  🌱 Farm2Fork Direct Model
                </span>
                <span className="text-xs font-mono text-farm-300">Direct Farmer Connection</span>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-stone-300">Farmer Direct Price:</span>
                  <span className="font-mono font-bold text-farm-300">
                    ₹{selectedData.farm2forkPrice}/kg (+₹{selectedData.farm2forkPrice - selectedData.farmerTraditional}/kg gain)
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs text-emerald-300">
                  <span>Farmer Additional Earnings:</span>
                  <span className="font-mono font-bold">+₹{farmerExtraGain.toLocaleString('en-IN')} (+{Math.round((farmerExtraGain / traditionalFarmerTotal) * 100)}%)</span>
                </div>
                <div className="flex justify-between items-center text-sm font-bold pt-3 border-t border-farm-800/60">
                  <span className="text-white">Buyer Total Price:</span>
                  <span className="font-mono text-emerald-400 text-base">₹{selectedData.farm2forkPrice}/kg (₹{farm2forkTotal.toLocaleString('en-IN')})</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-farm-900/60 border border-farm-600/40 text-xs text-farm-100 flex items-center justify-between">
                <div>
                  <span className="font-bold">✨ Estimated Buyer Savings:</span> ₹{buyerSavings.toLocaleString('en-IN')} ({Math.round((buyerSavings / traditionalConsumerTotal) * 100)}% savings)
                </div>
                <span className="text-[10px] bg-farm-700 px-2 py-0.5 rounded font-bold uppercase">Fresh From Farm</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. How Farm2Fork Works (4 Steps) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-2xl mx-auto mb-12">
          <span className="text-xs font-extrabold uppercase tracking-wider text-farm-700 bg-farm-100 px-3 py-1 rounded-full">
            How It Works
          </span>
          <h2 className="text-3xl font-extrabold text-stone-900 mt-3 mb-3">
            How Farm2Fork Works
          </h2>
          <p className="text-stone-600 text-sm sm:text-base">
            Connecting farmers directly with buyers through transparent pricing and quality-based discovery.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-card text-left relative group hover:border-farm-500 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-farm-100 text-farm-700 flex items-center justify-center font-bold text-xl mb-4 group-hover:scale-110 transition-transform">
              1
            </div>
            <h3 className="text-base font-bold text-stone-900 mb-2">Farmer Lists Products</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Upload multiple crop photos, set direct price per kg, select quality grade, harvest date, and farm location.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-card text-left relative group hover:border-farm-500 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-farm-100 text-farm-700 flex items-center justify-center font-bold text-xl mb-4 group-hover:scale-110 transition-transform">
              2
            </div>
            <h3 className="text-base font-bold text-stone-900 mb-2">Smart Recommendation</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Recommendation engine balances Price, Quality, and Distance to identify the best value options.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-card text-left relative group hover:border-farm-500 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-farm-100 text-farm-700 flex items-center justify-center font-bold text-xl mb-4 group-hover:scale-110 transition-transform">
              3
            </div>
            <h3 className="text-base font-bold text-stone-900 mb-2">Compare & Inspect</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Buyers view comparison tables, inspect high-res farm photos, verify quality grades, and see farm locations.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-card text-left relative group hover:border-farm-500 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-farm-100 text-farm-700 flex items-center justify-center font-bold text-xl mb-4 group-hover:scale-110 transition-transform">
              4
            </div>
            <h3 className="text-base font-bold text-stone-900 mb-2">Direct Order & Dispatch</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Order placed directly with the grower. Instant notification to farmer, order status updates, and transparent fulfillment.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Dual Benefit Grid (Farmers vs Buyers) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Farmers Card */}
          <div className="p-8 rounded-3xl bg-gradient-to-br from-farm-900 to-farm-950 text-white shadow-xl border border-farm-800">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-farm-700 text-white flex items-center justify-center text-2xl">
                👨‍🌾
              </div>
              <div>
                <h3 className="text-2xl font-bold">Benefits for Farmers</h3>
                <p className="text-farm-200 text-xs">Better Earnings & Direct Market Access</p>
              </div>
            </div>

            <ul className="space-y-4 text-sm text-farm-100">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Higher Selling Earnings:</strong> Sell directly at fair market rates without intermediary deductions.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Multi-Photo Showcase:</strong> Upload up to 5 photos to showcase grade and quality directly to buyers.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>FPO Collective Visibility:</strong> List aggregated quantities across farmer groups for higher volume orders.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Direct Order Management:</strong> Accept incoming orders, update readiness, and manage sales.</span>
              </li>
            </ul>

            <button
              onClick={() => onLoginAs('FARMER')}
              className="mt-8 w-full py-3 rounded-xl bg-farm-500 hover:bg-farm-400 text-stone-950 font-bold text-sm transition-all"
            >
              Start Listing as Farmer →
            </button>
          </div>

          {/* Buyers Card */}
          <div className="p-8 rounded-3xl bg-white text-stone-900 shadow-xl border border-stone-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-stone-900 text-white flex items-center justify-center text-2xl">
                🛒
              </div>
              <div>
                <h3 className="text-2xl font-bold">Benefits for Buyers</h3>
                <p className="text-stone-500 text-xs">Fresh Farm Products at Transparent Prices</p>
              </div>
            </div>

            <ul className="space-y-4 text-sm text-stone-700">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-farm-600 shrink-0 mt-0.5" />
                <span><strong>Direct Savings:</strong> Buy direct from farmers at transparent farm prices.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-farm-600 shrink-0 mt-0.5" />
                <span><strong>Smart Recommendation:</strong> Intelligent scoring based on your custom preferences for price, quality, and distance.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-farm-600 shrink-0 mt-0.5" />
                <span><strong>Farm Location Visibility:</strong> View farmer location with GPS coordinates and driving distance.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-farm-600 shrink-0 mt-0.5" />
                <span><strong>Direct Transparency:</strong> Access farmer details, harvest dates, and organic certifications.</span>
              </li>
            </ul>

            <button
              onClick={() => onLoginAs('BUYER')}
              className="mt-8 w-full py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-sm transition-all"
            >
              Explore Product Marketplace →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
