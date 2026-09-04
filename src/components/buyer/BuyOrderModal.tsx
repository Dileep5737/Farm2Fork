import React, { useState } from 'react';
import { CropListing, Order, User } from '../../types';
import { StorageService } from '../../services/storage';
import {
  X,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  CheckCircle2,
  Truck,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useToast } from '../../context/ToastContext';

interface BuyOrderModalProps {
  crop: CropListing;
  buyer: User;
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: (order: Order) => void;
}

export const BuyOrderModal: React.FC<BuyOrderModalProps> = ({
  crop,
  buyer,
  isOpen,
  onClose,
  onOrderSuccess,
}) => {
  const [quantity, setQuantity] = useState<number>(Math.min(50, crop.quantity));
  const [deliveryAddress, setDeliveryAddress] = useState<string>(
    buyer?.location ? `${buyer.location}, Flat 402, Green Acre Apts` : '100ft Road, Indiranagar, Bengaluru - 560038'
  );
  const [buyerPhone, setBuyerPhone] = useState<string>(buyer?.phone || '+91 99887 65432');
  const [paymentMethod, setPaymentMethod] = useState<Order['paymentMethod']>('DIRECT_ESCROW');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { success, error } = useToast();

  if (!isOpen) return null;

  const totalAmount = quantity * crop.pricePerKg;
  const retailBenchmarkPrice = crop.retailPricePerKg || Math.round(crop.pricePerKg * 1.35);
  const traditionalTotal = quantity * retailBenchmarkPrice;
  const buyerSavings = traditionalTotal - totalAmount;
  const farmerMandiTotal = quantity * (crop.mandiPricePerKg || Math.round(crop.pricePerKg * 0.65));
  const farmerExtraGain = totalAmount - farmerMandiTotal;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (quantity <= 0) {
      error('Please select a valid quantity.');
      return;
    }
    if (quantity > crop.quantity) {
      error(`Maximum available stock is ${crop.quantity} ${crop.unit}.`);
      return;
    }
    if (!deliveryAddress.trim()) {
      error('Please provide a delivery address.');
      return;
    }

    setIsSubmitting(true);

    try {
      const newOrder = StorageService.createOrder({
        cropId: crop.id,
        cropName: crop.cropName,
        cropImage: crop.images[crop.primaryImageIndex || 0] || crop.images[0],
        farmerId: crop.farmerId,
        farmerName: crop.farmerName,
        farmName: crop.farmName,
        farmerPhone: crop.farmerPhone,
        buyerId: buyer?.id || 'buyer-1',
        buyerName: buyer?.name || 'Priya Sharma',
        buyerPhone,
        deliveryAddress,
        quantity,
        pricePerKg: crop.pricePerKg,
        totalAmount,
        traditionalEstimatedCost: traditionalTotal,
        buyerSavings,
        farmerExtraEarnings: farmerExtraGain,
        status: 'Pending',
        paymentMethod,
      });

      // Confetti celebration animation!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#16a34a', '#22c55e', '#facc15', '#3b82f6'],
      });

      success(`Order #${newOrder.id} placed successfully! You saved ₹${buyerSavings.toLocaleString('en-IN')}.`, 'Order Confirmed');
      onOrderSuccess(newOrder);
      onClose();
    } catch (err) {
      error('Failed to process order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden animate-slide-up my-6 flex flex-col">
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-farm-800 to-stone-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-xl">
              🛒
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Direct Farm Purchase</h3>
              <p className="text-xs text-farm-200">Zero intermediary markups. Guaranteed freshness.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handlePlaceOrder} className="p-6 space-y-5 overflow-y-auto">
          {/* Product Summary Card */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-stone-50 border border-stone-200">
            <img
              src={crop.images[crop.primaryImageIndex || 0] || crop.images[0]}
              alt={crop.cropName}
              className="w-16 h-16 rounded-xl object-cover border border-stone-200 shadow-xs"
            />
            <div className="flex-1">
              <span className="text-[10px] font-bold text-farm-700 uppercase bg-farm-100 px-2 py-0.5 rounded">
                {crop.qualityGrade} ({crop.qualityRating.toFixed(1)}⭐)
              </span>
              <h4 className="font-extrabold text-stone-900 text-sm mt-1">{crop.cropName}</h4>
              <p className="text-xs text-stone-500">
                {crop.farmName} • <strong className="text-farm-700">₹{crop.pricePerKg}</strong>/kg
              </p>
            </div>
          </div>

          {/* Quantity Selector */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                Order Quantity (kg) *
              </label>
              <span className="text-xs text-stone-500">
                Available Stock: <strong>{crop.quantity} {crop.unit}</strong>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="range"
                min="5"
                max={Math.min(crop.quantity, 500)}
                step="5"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="flex-1 h-2 bg-stone-200 rounded-lg cursor-pointer accent-farm-600"
              />
              <div className="w-24">
                <input
                  type="number"
                  min="1"
                  max={crop.quantity}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-center font-extrabold text-base border border-stone-300 rounded-xl focus:ring-2 focus:ring-farm-500 outline-none"
                />
              </div>
            </div>

            {/* Quick preset pills */}
            <div className="flex items-center gap-2 mt-2">
              {[10, 25, 50, 100].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setQuantity(Math.min(preset, crop.quantity))}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    quantity === preset ? 'bg-farm-600 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {preset} kg
                </button>
              ))}
            </div>
          </div>

          {/* Price Transparency Breakdown */}
          <div className="p-4 rounded-2xl bg-farm-50/80 border border-farm-200 space-y-2">
            <div className="flex justify-between text-xs text-stone-600">
              <span>Product Unit Price:</span>
              <span className="font-mono">₹{crop.pricePerKg} × {quantity} kg</span>
            </div>
            <div className="flex justify-between text-xs text-stone-600">
              <span>Direct Farm Logistics:</span>
              <span className="font-mono text-emerald-700 font-bold">FREE</span>
            </div>
            <div className="flex justify-between text-xs text-stone-500 line-through">
              <span>Traditional Supermarket Price:</span>
              <span className="font-mono">₹{traditionalTotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-sm font-extrabold text-stone-900 pt-2 border-t border-farm-200">
              <span>Total Estimated Amount:</span>
              <span className="text-xl text-farm-900 font-mono">₹{totalAmount.toLocaleString('en-IN')}</span>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs font-bold text-emerald-800 bg-emerald-100/60 p-2 rounded-xl">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Your Direct Savings:</span>
              </span>
              <span>₹{buyerSavings.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Delivery Address & Contact */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Delivery Address *
              </label>
              <input
                type="text"
                required
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="Street address, apartment, locality, city"
                className="w-full px-3.5 py-2 text-xs border border-stone-200 rounded-xl focus:ring-2 focus:ring-farm-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Contact Phone *
              </label>
              <input
                type="tel"
                required
                value={buyerPhone}
                onChange={(e) => setBuyerPhone(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-stone-200 rounded-xl focus:ring-2 focus:ring-farm-500 outline-none"
              />
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
              Select Payment Method
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('DIRECT_ESCROW')}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                  paymentMethod === 'DIRECT_ESCROW'
                    ? 'border-farm-600 bg-farm-50/50 ring-1 ring-farm-600'
                    : 'border-stone-200 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <ShieldCheck className="w-4 h-4 text-farm-600" />
                  <span className="text-xs font-bold text-stone-900">Direct Escrow</span>
                </div>
                <span className="text-[10px] text-stone-500">Released upon delivery</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('CASH_ON_DELIVERY')}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                  paymentMethod === 'CASH_ON_DELIVERY'
                    ? 'border-farm-600 bg-farm-50/50 ring-1 ring-farm-600'
                    : 'border-stone-200 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Truck className="w-4 h-4 text-farm-600" />
                  <span className="text-xs font-bold text-stone-900">Cash / UPI on Delivery</span>
                </div>
                <span className="text-[10px] text-stone-500">Pay on physical receipt</span>
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-6 rounded-2xl bg-farm-600 hover:bg-farm-700 text-white font-extrabold text-base shadow-lg shadow-farm-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>PLACE DIRECT ORDER (₹{totalAmount.toLocaleString('en-IN')})</span>
          </button>
        </form>
      </div>
    </div>
  );
};
