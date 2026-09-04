import React from 'react';
import { Sprout, ShieldCheck, Truck, Sparkles, Heart, Phone, HelpCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-12 pb-8 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand & Mission */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-farm-600 text-white flex items-center justify-center">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                Farm<span className="text-farm-500">2</span>Fork
              </span>
            </div>
            <p className="text-stone-400 text-sm max-w-md leading-relaxed mb-4">
              Empowering farmers with direct market access and helping buyers discover quality products at transparent prices with zero middleman commissions.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-stone-800/80 border border-stone-700 text-xs text-stone-300">
              <Sparkles className="w-3.5 h-3.5 text-farm-400" />
              <span>Direct Farm-to-Buyer Marketplace • Quality Verified</span>
            </div>
          </div>

          {/* Our Services */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Our Services</h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Direct Farmer-to-Buyer Connection</span>
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Product Price Comparison</span>
              </li>
              <li className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Quality-Based Recommendations</span>
              </li>
              <li className="flex items-center gap-2">
                <Sprout className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Location-Based Discovery</span>
              </li>
            </ul>
          </div>

          {/* Farmer Support */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Farmer Support</h4>
            <ul className="space-y-2 text-xs text-stone-400 mb-4">
              <li>• Farmer Support & Guidance</li>
              <li>• FPO Onboarding</li>
              <li>• Product Listing Assistance</li>
            </ul>
            <p className="text-xs text-stone-400 mb-1">
              Kisan Helpline: <span className="text-white font-mono font-bold">1800-180-1551</span>
            </p>
            <p className="text-xs text-stone-400">
              Direct Assistance: <span className="text-white font-mono font-bold">+91 98450 12345</span>
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div>
            © 2026 Farm2Fork. All rights reserved.
          </div>
          <div className="flex items-center gap-1 text-stone-400">
            <span>From Farm. Directly to You.</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 mx-1" />
            <span>Empowering Indian Agriculture</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
