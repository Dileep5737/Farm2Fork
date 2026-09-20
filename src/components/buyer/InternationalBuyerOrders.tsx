import React from 'react';
import { ExportOrder, User } from '../../types';
import {
  Ship,
  Globe,
  Anchor,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
  Package,
  Thermometer,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface InternationalBuyerOrdersProps {
  buyer: User;
  exportOrders: ExportOrder[];
  onExploreMore: () => void;
}

export const InternationalBuyerOrders: React.FC<InternationalBuyerOrdersProps> = ({
  buyer,
  exportOrders,
  onExploreMore,
}) => {
  const { info } = useToast();

  const buyerExportOrders = exportOrders.filter(
    (o) => o.buyerId === buyer.id || o.buyerName.toLowerCase().includes(buyer.name.toLowerCase().split(' ')[0])
  );

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-950 text-white shadow-xl">
        <div>
          <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 mb-2">
            <Globe className="w-3.5 h-3.5" />
            <span>Global Inbound Shipments</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-sans">
            My International Container Orders
          </h1>
          <p className="text-xs sm:text-sm text-blue-100/80 mt-1">
            Real-time ocean freight tracking, phytosanitary clearance dossiers, and Letter of Credit escrow settlement.
          </p>
        </div>

        <button
          onClick={onExploreMore}
          className="px-5 py-2.5 rounded-2xl bg-white text-blue-950 hover:bg-blue-50 font-bold text-xs shadow-lg transition cursor-pointer self-start sm:self-auto"
        >
          + Source More Commodities
        </button>
      </div>

      {/* Orders List */}
      {buyerExportOrders.length === 0 ? (
        <div className="text-center p-12 bg-white rounded-3xl border border-stone-200 shadow-card">
          <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4 text-2xl">
            🚢
          </div>
          <h3 className="text-lg font-bold text-stone-900 mb-1">No Active Import Orders</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto mb-6">
            You have not placed any international container orders yet.
          </p>
          <button
            onClick={onExploreMore}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md cursor-pointer"
          >
            Explore Global Marketplace →
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {buyerExportOrders.map((order) => (
            <div
              key={order.id}
              className="p-6 bg-white rounded-3xl border border-stone-200 shadow-card hover:shadow-card-hover transition-all space-y-6"
            >
              {/* Top Row */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-100">
                <div className="flex items-center gap-4">
                  <img
                    src={order.cropImage}
                    alt={order.cropName}
                    className="w-16 h-16 rounded-2xl object-cover border border-stone-200 shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold bg-stone-100 px-2 py-0.5 rounded text-stone-700">
                        {order.id}
                      </span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-blue-100 text-blue-800">
                        {order.incoterm} Delivery
                      </span>
                    </div>
                    <h3 className="text-base font-extrabold text-stone-900 mt-1">
                      {order.cropName}
                    </h3>
                    <p className="text-xs text-stone-500">
                      Exporter: <strong className="text-stone-800">{order.farmerName}</strong> ({order.farmName})
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-stone-400 font-bold uppercase">Contract Value</div>
                  <div className="text-2xl font-black text-blue-900">
                    ${order.totalAmountUSD.toLocaleString('en-US')}
                  </div>
                  <span className="text-[11px] text-stone-500 font-medium">
                    {order.quantityMT} Metric Tons • {order.containerCount} Container(s)
                  </span>
                </div>
              </div>

              {/* Customs Progress Tracker */}
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3 flex items-center justify-between">
                  <span>Customs & Shipping Milestone Pipeline</span>
                  <span className="text-blue-700 font-bold text-[11px] font-mono">
                    Status: {order.status.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2 text-center text-xs">
                  <div className={`p-2.5 rounded-xl border ${['INQUIRY_PLACED', 'LC_ESCROW_LOCKED', 'PHYTOSANITARY_CLEARED', 'CUSTOMS_APPROVED', 'VESSEL_LOADED', 'IN_TRANSIT_SEA', 'COMPLETED'].includes(order.status) ? 'bg-blue-50 border-blue-300 text-blue-900' : 'bg-stone-50 text-stone-400'}`}>
                    <div className="font-bold text-[11px]">1. Inquiry / LC</div>
                    <div className="text-[10px] text-blue-700 font-semibold">Locked in Escrow</div>
                  </div>

                  <div className={`p-2.5 rounded-xl border ${['PHYTOSANITARY_CLEARED', 'CUSTOMS_APPROVED', 'VESSEL_LOADED', 'IN_TRANSIT_SEA', 'COMPLETED'].includes(order.status) ? 'bg-blue-50 border-blue-300 text-blue-900' : 'bg-stone-50 text-stone-400'}`}>
                    <div className="font-bold text-[11px]">2. Phytosanitary</div>
                    <div className="text-[10px] text-blue-700 font-semibold">APEDA Cleared</div>
                  </div>

                  <div className={`p-2.5 rounded-xl border ${['CUSTOMS_APPROVED', 'VESSEL_LOADED', 'IN_TRANSIT_SEA', 'COMPLETED'].includes(order.status) ? 'bg-blue-50 border-blue-300 text-blue-900' : 'bg-stone-50 text-stone-400'}`}>
                    <div className="font-bold text-[11px]">3. Port Customs</div>
                    <div className="text-[10px] text-blue-700 font-semibold">Gate-in Cleared</div>
                  </div>

                  <div className={`p-2.5 rounded-xl border ${['VESSEL_LOADED', 'IN_TRANSIT_SEA', 'COMPLETED'].includes(order.status) ? 'bg-blue-50 border-blue-300 text-blue-900' : 'bg-stone-50 text-stone-400'}`}>
                    <div className="font-bold text-[11px]">4. Vessel Loaded</div>
                    <div className="text-[10px] text-blue-700 font-semibold">{order.vesselName?.split(' ')[0] || 'MSC Oscar'}</div>
                  </div>

                  <div className={`p-2.5 rounded-xl border ${['IN_TRANSIT_SEA', 'COMPLETED'].includes(order.status) ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-stone-50 text-stone-400'}`}>
                    <div className="font-bold text-[11px]">5. Sea Transit</div>
                    <div className="text-[10px] text-emerald-700 font-semibold">ETA: {order.estimatedArrivalDate}</div>
                  </div>

                  <div className={`p-2.5 rounded-xl border ${order.status === 'COMPLETED' ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-stone-50 text-stone-400'}`}>
                    <div className="font-bold text-[11px]">6. Discharge & Port In</div>
                    <div className="text-[10px] text-stone-500 font-semibold">{order.destinationPort.split(',')[0]}</div>
                  </div>
                </div>
              </div>

              {/* Vessel and Container Logistics Details */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-stone-400 font-bold block mb-0.5">Port of Loading:</span>
                  <span className="font-extrabold text-stone-800 flex items-center gap-1">
                    <Anchor className="w-3.5 h-3.5 text-blue-600" />
                    <span>{order.originPort}</span>
                  </span>
                </div>

                <div>
                  <span className="text-stone-400 font-bold block mb-0.5">Destination Port:</span>
                  <span className="font-extrabold text-stone-800 flex items-center gap-1">
                    <Ship className="w-3.5 h-3.5 text-blue-600" />
                    <span>{order.destinationPort}</span>
                  </span>
                </div>

                <div>
                  <span className="text-stone-400 font-bold block mb-0.5">Container Seal / ID:</span>
                  <span className="font-mono font-bold text-stone-900">
                    {order.containerNumber || 'MSCU-902184-7'}
                  </span>
                </div>

                <div>
                  <span className="text-stone-400 font-bold block mb-0.5">Bill of Lading (B/L):</span>
                  <span className="font-mono font-bold text-blue-800">
                    {order.billOfLadingNo || 'MEDU-902184-IN'}
                  </span>
                </div>
              </div>

              {/* Document Download Actions */}
              <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => {
                    info(`Bill of Lading ${order.billOfLadingNo} & Sea Cargo manifest downloaded.`, 'BL Document');
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-stone-600" />
                  <span>Download Bill of Lading (B/L)</span>
                </button>

                <button
                  onClick={() => {
                    info(`Phytosanitary & SGS Lab report for APEDA batch ${order.apedaCertificateNo} downloaded.`, 'Lab Certificate');
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  <span>Phytosanitary & SGS Dossier</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
