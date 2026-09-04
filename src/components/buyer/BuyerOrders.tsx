import React, { useState } from 'react';
import { Order, User } from '../../types';
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Sparkles,
  ShoppingBag,
  Printer,
  XCircle,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface BuyerOrdersProps {
  buyer: User;
  orders: Order[];
  onExploreMore: () => void;
}

export const BuyerOrders: React.FC<BuyerOrdersProps> = ({
  buyer,
  orders,
  onExploreMore,
}) => {
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<Order | null>(null);
  const { info } = useToast();

  const buyerOrders = orders.filter(
    (o) => o.buyerId === buyer.id || o.buyerName.toLowerCase().includes(buyer.name.toLowerCase().split(' ')[0])
  );

  const totalSpent = buyerOrders
    .filter((o) => o.status !== 'Rejected')
    .reduce((sum, o) => sum + o.totalAmount, 0);
  const totalSaved = buyerOrders
    .filter((o) => o.status !== 'Rejected')
    .reduce((sum, o) => sum + o.buyerSavings, 0);

  const handlePrintReceipt = (order: Order) => {
    setSelectedReceiptOrder(order);
    info(`Generated invoice for Order #${order.id}`);
  };

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-stone-900 via-stone-900 to-farm-950 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-farm-500/20 text-farm-300 text-xs font-bold uppercase tracking-wider mb-2">
            <ShoppingBag className="w-3.5 h-3.5 text-farm-400" />
            <span>Order History</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            My Direct Farm Orders
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            Track real-time order status, view cost savings, and print invoices.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-sm">
          <div>
            <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Total Disintermediation Savings</span>
            <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
              +₹{totalSaved.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* Orders List */}
      {buyerOrders.length === 0 ? (
        <div className="text-center p-12 bg-white rounded-3xl border border-stone-200 shadow-card">
          <div className="w-16 h-16 rounded-full bg-farm-50 text-farm-600 flex items-center justify-center mx-auto mb-4 text-2xl">
            🛒
          </div>
          <h3 className="text-lg font-bold text-stone-900 mb-1">No Orders Placed Yet</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto mb-6">
            Search our marketplace to find fresh vegetables, fruits, and grains directly from farmers.
          </p>
          <button
            onClick={onExploreMore}
            className="px-6 py-2.5 rounded-xl bg-farm-600 hover:bg-farm-700 text-white font-bold text-sm shadow-md transition-all"
          >
            Explore Product Marketplace →
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {buyerOrders.map((order) => {
            const steps = ['Pending', 'Accepted', 'Ready for Pickup', 'Completed'];
            const currentStepIdx = steps.indexOf(order.status);
            const isRejected = order.status === 'Rejected';

            return (
              <div
                key={order.id}
                className="p-6 rounded-3xl bg-white border border-stone-200 shadow-card hover:shadow-card-hover transition-all space-y-6"
              >
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-extrabold text-stone-900 bg-stone-100 px-3 py-1 rounded-xl">
                      Order #{order.id}
                    </span>
                    <span className="text-xs text-stone-500">
                      Ordered on {new Date(order.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase ${
                        order.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : order.status === 'Ready for Pickup'
                          ? 'bg-blue-100 text-blue-800'
                          : order.status === 'Accepted'
                          ? 'bg-purple-100 text-purple-800'
                          : order.status === 'Rejected'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {order.status === 'Completed' && '✓ Completed'}
                      {order.status === 'Ready for Pickup' && '🚚 Ready for Pickup'}
                      {order.status === 'Accepted' && '📦 Accepted by Farmer'}
                      {order.status === 'Pending' && '⏳ Awaiting Farmer Confirmation'}
                      {order.status === 'Rejected' && '✕ Order Rejected'}
                    </span>

                    <button
                      onClick={() => handlePrintReceipt(order)}
                      className="p-2 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors"
                      title="View & Print Digital Receipt"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar Timeline */}
                {!isRejected ? (
                  <div className="grid grid-cols-4 gap-2 text-center text-[11px] font-bold">
                    {steps.map((st, idx) => {
                      const isPassed = currentStepIdx >= idx;
                      const isCurrent = currentStepIdx === idx;
                      return (
                        <div key={st} className="space-y-1.5">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              isPassed ? 'bg-farm-600' : 'bg-stone-200'
                            }`}
                          />
                          <span
                            className={`block text-[10px] sm:text-xs uppercase tracking-wider ${
                              isCurrent
                                ? 'text-farm-700 font-extrabold'
                                : isPassed
                                ? 'text-stone-800'
                                : 'text-stone-400'
                            }`}
                          >
                            {st}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-xs text-rose-700 font-bold flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-rose-600" />
                    <span>This order was rejected by the farmer due to stock unavailability.</span>
                  </div>
                )}

                {/* Order Details & Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                  {/* Item Details */}
                  <div className="flex items-center gap-4 md:col-span-2">
                    <img
                      src={order.cropImage || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80'}
                      alt={order.cropName}
                      className="w-20 h-20 rounded-2xl object-cover border border-stone-200 shadow-xs shrink-0"
                    />
                    <div className="space-y-1">
                      <h4 className="text-base font-extrabold text-stone-900">{order.cropName}</h4>
                      <p className="text-xs text-stone-600">
                        Grower: <strong>{order.farmerName}</strong> ({order.farmName})
                      </p>
                      <p className="text-xs text-stone-500">
                        Quantity: <strong>{order.quantity} kg</strong> @ ₹{order.pricePerKg}/kg
                      </p>
                      <div className="flex items-center gap-2 text-xs text-stone-500">
                        <MapPin className="w-3.5 h-3.5 text-stone-400" />
                        <span className="truncate">{order.deliveryAddress}</span>
                      </div>
                    </div>
                  </div>

                  {/* Financials & Savings */}
                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col justify-between space-y-2">
                    <div>
                      <div className="flex justify-between text-xs text-stone-500">
                        <span>Paid Total:</span>
                        <span className="font-mono font-bold text-stone-900 text-sm">
                          ₹{order.totalAmount.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs text-stone-500 mt-1">
                        <span>Payment Method:</span>
                        <span className="font-mono font-semibold text-stone-700">Direct Escrow</span>
                      </div>
                    </div>

                    <div className="p-2 rounded-xl bg-emerald-100/70 border border-emerald-200 text-xs font-bold text-emerald-900 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Direct Savings:</span>
                      </span>
                      <span>+₹{order.buyerSavings.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Digital Receipt Modal (Printable) */}
      {selectedReceiptOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 p-6 overflow-hidden animate-slide-up space-y-6">
            <div className="flex items-start justify-between border-b border-stone-200 pb-4">
              <div>
                <div className="text-lg font-extrabold text-stone-900">Farm2Fork Direct Invoice</div>
                <div className="text-xs text-stone-500 font-mono">Invoice #{selectedReceiptOrder.id}</div>
              </div>
              <button
                onClick={() => setSelectedReceiptOrder(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-stone-500">Date:</span>
                <span className="font-bold text-stone-800">{new Date(selectedReceiptOrder.createdAt).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Farmer / FPO:</span>
                <span className="font-bold text-stone-800">{selectedReceiptOrder.farmerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Buyer Name:</span>
                <span className="font-bold text-stone-800">{selectedReceiptOrder.buyerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Product:</span>
                <span className="font-bold text-stone-800">{selectedReceiptOrder.cropName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Quantity:</span>
                <span className="font-bold text-stone-800">{selectedReceiptOrder.quantity} kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Rate:</span>
                <span className="font-bold text-stone-800">₹{selectedReceiptOrder.pricePerKg} / kg</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-stone-200 text-sm font-extrabold text-stone-900">
                <span>Total Amount:</span>
                <span>₹{selectedReceiptOrder.totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 font-bold text-center">
              🎉 Direct Disintermediation Savings: ₹{selectedReceiptOrder.buyerSavings.toLocaleString('en-IN')}
            </div>

            <button
              onClick={() => window.print()}
              className="w-full py-2.5 rounded-xl bg-stone-900 text-white font-bold text-xs hover:bg-stone-800 transition-colors flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>Print Official Invoice</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
