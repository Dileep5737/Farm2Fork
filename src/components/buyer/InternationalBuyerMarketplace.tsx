import React, { useState, useMemo } from 'react';
import { ExportListing, ExportOrder, User, Currency, Incoterm } from '../../types';
import { StorageService } from '../../services/storage';
import {
  Globe,
  Ship,
  Search,
  SlidersHorizontal,
  Anchor,
  ShieldCheck,
  Thermometer,
  FileCheck2,
  DollarSign,
  ArrowRight,
  Layers,
  Sparkles,
  ExternalLink,
  X,
  Lock,
  CheckCircle2,
  Calendar,
  Box,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface InternationalBuyerMarketplaceProps {
  buyer: User;
  exportListings: ExportListing[];
  onRefreshData: () => void;
  onNavigateToOrders: () => void;
}

const EXCHANGE_RATES = {
  USD: { symbol: '$', rate: 1.0 },
  EUR: { symbol: '€', rate: 0.92 },
  AED: { symbol: 'د.إ', rate: 3.67 },
  GBP: { symbol: '£', rate: 0.79 },
  INR: { symbol: '₹', rate: 86.5 },
};

export const InternationalBuyerMarketplace: React.FC<InternationalBuyerMarketplaceProps> = ({
  buyer,
  exportListings,
  onRefreshData,
  onNavigateToOrders,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedPort, setSelectedPort] = useState<string>(buyer.destinationPort || 'Port of Rotterdam');
  const [currency, setCurrency] = useState<Currency>('USD');
  const [selectedIncoterm, setSelectedIncoterm] = useState<Incoterm>('CIF');

  // Modal States
  const [selectedListingForDetails, setSelectedListingForDetails] = useState<ExportListing | null>(null);
  const [selectedListingForOrder, setSelectedListingForOrder] = useState<ExportListing | null>(null);

  // Order Booking Form State
  const [orderQuantityMT, setOrderQuantityMT] = useState<number>(20);
  const [paymentMethod, setPaymentMethod] = useState<'LETTER_OF_CREDIT' | 'INTERNATIONAL_ESCROW' | 'BANK_WIRE_TT'>('LETTER_OF_CREDIT');
  const [lcRefNumber, setLcRefNumber] = useState('LC-ING-ROT-2026-9902');
  const [isOrdering, setIsOrdering] = useState(false);

  const { success, error, info } = useToast();

  const convertPrice = (usdPrice: number): string => {
    const config = EXCHANGE_RATES[currency] || EXCHANGE_RATES.USD;
    const converted = usdPrice * config.rate;
    return `${config.symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const filteredListings = useMemo(() => {
    return exportListings.filter((listing) => {
      const matchesSearch =
        listing.cropName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.originPort.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || listing.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [exportListings, searchQuery, selectedCategory]);

  const handleOpenBuyModal = (listing: ExportListing) => {
    setSelectedListingForOrder(listing);
    setOrderQuantityMT(listing.minOrderQuantityMT || 10);
  };

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedListingForOrder) return;

    if (orderQuantityMT < selectedListingForOrder.minOrderQuantityMT) {
      error(`Minimum order volume is ${selectedListingForOrder.minOrderQuantityMT} Metric Tons.`);
      return;
    }

    if (orderQuantityMT > selectedListingForOrder.availableQuantityMT) {
      error(`Available volume is ${selectedListingForOrder.availableQuantityMT} Metric Tons.`);
      return;
    }

    setIsOrdering(true);

    setTimeout(() => {
      setIsOrdering(false);
      const unitPriceUSD = selectedIncoterm === 'CIF'
        ? selectedListingForOrder.pricePerKgUSD * 1.15
        : selectedListingForOrder.pricePerKgUSD;
      const totalAmountUSD = Math.round(unitPriceUSD * orderQuantityMT * 1000);
      const containerCount = Math.max(1, Math.ceil(orderQuantityMT / 20));

      StorageService.createExportOrder({
        exportListingId: selectedListingForOrder.id,
        cropName: selectedListingForOrder.cropName,
        cropImage: selectedListingForOrder.images[0],
        category: selectedListingForOrder.category,
        farmerId: selectedListingForOrder.farmerId,
        farmerName: selectedListingForOrder.farmerName,
        farmName: selectedListingForOrder.farmName,
        farmerPhone: selectedListingForOrder.farmerPhone,
        farmerEmail: selectedListingForOrder.farmerEmail,
        originPort: selectedListingForOrder.originPort,
        buyerId: buyer.id,
        buyerName: buyer.name,
        buyerCompany: buyer.companyName || 'EuroFresh Global Imports B.V.',
        buyerCountry: buyer.country || 'Netherlands',
        destinationPort: selectedPort,
        quantityMT: orderQuantityMT,
        containerCount,
        containerType: selectedListingForOrder.containerType,
        incoterm: selectedIncoterm,
        currency,
        unitPriceUSD,
        totalAmountUSD,
        paymentMethod,
        lcReferenceNumber: paymentMethod === 'LETTER_OF_CREDIT' ? lcRefNumber : undefined,
        billOfLadingNo: `MEDU-${Math.floor(100000 + Math.random() * 900000)}-IN`,
        containerNumber: `MSCU-${Math.floor(100000 + Math.random() * 900000)}-${Math.floor(Math.random() * 9)}`,
        vesselName: 'MSC Oscar (Voyage 402W)',
        carrierName: 'Mediterranean Shipping Company (MSC)',
        estimatedArrivalDate: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'INQUIRY_PLACED',
        phytosanitaryCertificateNo: `IND-PHYTO-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        apedaCertificateNo: selectedListingForOrder.apedaCertificateNo,
      });

      success(
        `International Export Order placed for ${orderQuantityMT} MT of ${selectedListingForOrder.cropName} (${selectedIncoterm} ${selectedPort}).`,
        'Trade Order Confirmed!'
      );

      setSelectedListingForOrder(null);
      onRefreshData();
      onNavigateToOrders();
    }, 600);
  };

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto">
      {/* 1. Global Importer Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0a192f] via-[#112240] to-[#020c1b] text-white shadow-xl border border-slate-700/60">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" />
                <span>Global Commodity Sourcing</span>
              </span>
              <span className="text-xs text-slate-400 font-semibold">
                Destination: <strong className="text-white">{selectedPort}</strong>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-sans">
              International Cross-Border Marketplace
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Direct container-load farm trade from APEDA certified Indian grower consortiums with verified phytosanitary clearance and Letter of Credit (LC) escrow.
            </p>
          </div>

          {/* Currency and Incoterm Selector Bar */}
          <div className="flex flex-wrap items-center gap-2.5 bg-slate-900/80 p-2 rounded-2xl border border-slate-700/80">
            <div className="flex items-center gap-1 px-2 text-xs text-slate-400 font-bold">
              <span>Currency:</span>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as Currency)}
                className="bg-slate-800 text-white font-bold rounded-lg px-2 py-1 outline-none text-xs border border-slate-700 cursor-pointer"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="AED">AED (د.إ)</option>
                <option value="GBP">GBP (£)</option>
                <option value="INR">INR (₹)</option>
              </select>
            </div>

            <div className="flex items-center gap-1 px-2 text-xs text-slate-400 font-bold border-l border-slate-700">
              <span>Incoterm:</span>
              <select
                value={selectedIncoterm}
                onChange={(e) => setSelectedIncoterm(e.target.value as Incoterm)}
                className="bg-slate-800 text-white font-bold rounded-lg px-2 py-1 outline-none text-xs border border-slate-700 cursor-pointer"
              >
                <option value="CIF">CIF (Freight Included)</option>
                <option value="FOB">FOB (Port of Loading)</option>
                <option value="EXW">EXW (Farm Gate)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Filters & Port Search Controls */}
      <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-card flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search commodities by name, origin port, or certifications..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {['All', 'Fruits', 'Vegetables', 'Grains', 'Spices'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Destination Port Selector */}
        <div className="flex items-center gap-1.5 shrink-0 text-xs font-bold text-stone-600">
          <Anchor className="w-4 h-4 text-blue-600 shrink-0" />
          <span>Destination Port:</span>
          <select
            value={selectedPort}
            onChange={(e) => setSelectedPort(e.target.value)}
            className="bg-stone-100 text-stone-800 font-bold rounded-xl px-2.5 py-1.5 outline-none text-xs border border-stone-300 cursor-pointer"
          >
            <option value="Port of Rotterdam">Port of Rotterdam (EU)</option>
            <option value="Port of Jebel Ali, Dubai">Port of Jebel Ali, Dubai (GCC)</option>
            <option value="Port of Singapore">Port of Singapore (APAC)</option>
            <option value="London Gateway Port">London Gateway (UK)</option>
            <option value="Port of New York / New Jersey">Port of New York (USA)</option>
          </select>
        </div>
      </div>

      {/* 3. Export Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredListings.map((listing) => {
          const unitPriceUSD = selectedIncoterm === 'CIF'
            ? listing.pricePerKgUSD * 1.15
            : listing.pricePerKgUSD;
          const priceMTUSD = Math.round(unitPriceUSD * 1000);

          return (
            <div
              key={listing.id}
              className="bg-white rounded-3xl border border-stone-200 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between group overflow-hidden"
            >
              {/* Image & Top Badges */}
              <div className="relative h-52 bg-stone-100 overflow-hidden">
                <img
                  src={listing.images[0]}
                  alt={listing.cropName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  <span className="px-2.5 py-1 rounded-md bg-stone-900/85 backdrop-blur-md text-white text-[11px] font-bold">
                    {listing.category}
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-blue-700/90 backdrop-blur-md text-white text-[11px] font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> SGS Passed
                  </span>
                </div>

                <div className="absolute top-3 right-3">
                  <span className="px-2.5 py-1 rounded-md bg-white/95 text-stone-900 text-[11px] font-extrabold shadow-sm">
                    {listing.containerType}
                  </span>
                </div>

                {listing.temperatureControlled && (
                  <div className="absolute bottom-3 left-3">
                    <span className="px-2 py-0.5 rounded-md bg-sky-950/80 backdrop-blur-xs text-sky-300 text-[10px] font-bold flex items-center gap-1">
                      <Thermometer className="w-3 h-3" />
                      <span>{listing.targetTempCelsius}</span>
                    </span>
                  </div>
                )}
              </div>

              {/* Body Content */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-base font-extrabold text-stone-900 leading-tight">
                      {listing.cropName}
                    </h3>
                    <span className="text-xs px-2 py-0.5 rounded bg-blue-50 text-blue-800 font-bold border border-blue-200 shrink-0">
                      {listing.qualityGrade}
                    </span>
                  </div>

                  {listing.scientificName && (
                    <p className="text-[11px] italic text-stone-400 mb-2">
                      {listing.scientificName}
                    </p>
                  )}

                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                    {listing.description}
                  </p>

                  {/* Spec List */}
                  <div className="mt-3.5 pt-3 border-t border-stone-100 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-stone-500 font-medium">Available Cargo:</span>
                      <span className="font-extrabold text-stone-900">
                        {listing.availableQuantityMT} MT <span className="text-[11px] font-normal text-stone-500">(Min: {listing.minOrderQuantityMT} MT)</span>
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-stone-500 font-medium">Port of Loading:</span>
                      <span className="font-bold text-stone-800 flex items-center gap-1">
                        <Anchor className="w-3 h-3 text-blue-600" />
                        <span>{listing.originPort}</span>
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-stone-500 font-medium">Exporter / FPO:</span>
                      <span className="font-semibold text-stone-700 truncate max-w-[160px]">
                        {listing.farmName}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Price and CTA */}
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                      {selectedIncoterm} Price ({currency})
                    </div>
                    <div className="text-lg font-black text-blue-700">
                      {convertPrice(unitPriceUSD)} <span className="text-xs font-semibold text-stone-500">/kg</span>
                    </div>
                    <span className="text-[10px] text-stone-500 font-medium">
                      ({convertPrice(priceMTUSD)} / MT)
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedListingForDetails(listing)}
                      className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition cursor-pointer"
                      title="View Lab Dossier & Specs"
                    >
                      <FileCheck2 className="w-4 h-4 text-stone-600" />
                    </button>

                    <button
                      onClick={() => handleOpenBuyModal(listing)}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition flex items-center gap-1 cursor-pointer"
                    >
                      <span>Book Cargo</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Product Details & Compliance Dossier Modal */}
      {selectedListingForDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden animate-slide-up my-8 max-h-[90vh] flex flex-col">
            <div className="p-6 bg-gradient-to-r from-blue-900 to-slate-900 text-white flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-blue-400" />
                  <span>{selectedListingForDetails.cropName}</span>
                </h3>
                <p className="text-xs text-blue-200 mt-0.5">
                  Export Dossier, Phytosanitary Specifications & Lab Clearance
                </p>
              </div>
              <button
                onClick={() => setSelectedListingForDetails(null)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="text-stone-400 font-bold block mb-1">Quality Grade</span>
                  <span className="font-extrabold text-stone-900 text-sm">{selectedListingForDetails.qualityGrade}</span>
                </div>

                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="text-stone-400 font-bold block mb-1">Shelf Life</span>
                  <span className="font-extrabold text-stone-900 text-sm">{selectedListingForDetails.shelfLifeDays} Days</span>
                </div>

                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="text-stone-400 font-bold block mb-1">Container Type</span>
                  <span className="font-extrabold text-stone-900 text-sm">{selectedListingForDetails.containerType}</span>
                </div>

                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="text-stone-400 font-bold block mb-1">APEDA Cert</span>
                  <span className="font-extrabold font-mono text-emerald-800 text-xs">{selectedListingForDetails.apedaCertificateNo}</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-stone-900 mb-1">Export Specifications & Packaging</h4>
                <p className="text-stone-600 leading-relaxed">{selectedListingForDetails.packaging}</p>
              </div>

              <div>
                <h4 className="font-bold text-stone-900 mb-2">Verified Quarantine & Compliance Badges</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedListingForDetails.certifications.map((c) => (
                    <span key={c} className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-900 font-bold border border-emerald-200 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{c}</span>
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-950 space-y-1">
                <div className="font-extrabold text-sm flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-blue-700" />
                  <span>International Trade Protection</span>
                </div>
                <p className="text-[11px] text-blue-800 leading-relaxed">
                  Settlements are held in verified bank escrow (or Letter of Credit). Funds are only released to the producer once the container passes customs and port inspection at {selectedPort}.
                </p>
              </div>

              <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
                <button
                  onClick={() => {
                    const l = selectedListingForDetails;
                    setSelectedListingForDetails(null);
                    handleOpenBuyModal(l);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition cursor-pointer"
                >
                  Book Container Batch →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. International Export Cargo Booking Modal */}
      {selectedListingForOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden animate-slide-up my-8 max-h-[90vh] flex flex-col">
            <div className="p-6 bg-gradient-to-r from-blue-900 to-slate-900 text-white flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Ship className="w-5 h-5 text-blue-400" />
                  <span>Book Export Consignment</span>
                </h3>
                <p className="text-xs text-blue-200 mt-0.5">
                  {selectedListingForOrder.cropName} • {selectedIncoterm} {selectedPort}
                </p>
              </div>
              <button
                onClick={() => setSelectedListingForOrder(null)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmOrder} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Order Volume (Metric Tons) *
                </label>
                <input
                  type="number"
                  required
                  min={selectedListingForOrder.minOrderQuantityMT}
                  max={selectedListingForOrder.availableQuantityMT}
                  value={orderQuantityMT}
                  onChange={(e) => setOrderQuantityMT(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 text-sm border border-stone-300 rounded-xl font-bold outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-[11px] text-stone-500 mt-1 block">
                  Min: {selectedListingForOrder.minOrderQuantityMT} MT | Max: {selectedListingForOrder.availableQuantityMT} MT (~{Math.max(1, Math.ceil(orderQuantityMT / 20))} Container FCL)
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Payment & Trade Instrument *
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 text-sm border border-stone-300 rounded-xl font-semibold outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="LETTER_OF_CREDIT">Irrevocable Letter of Credit (LC - at Sight)</option>
                  <option value="INTERNATIONAL_ESCROW">Global Trade Escrow (Swift TT / Stripe B2B)</option>
                  <option value="BANK_WIRE_TT">Direct Bank Wire (TT 30% Advance / 70% against BL)</option>
                </select>
              </div>

              {paymentMethod === 'LETTER_OF_CREDIT' && (
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Bank LC Reference Number
                  </label>
                  <input
                    type="text"
                    required
                    value={lcRefNumber}
                    onChange={(e) => setLcRefNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm font-mono border border-stone-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              {/* Order Cost Breakdown */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <div className="flex justify-between text-stone-600">
                  <span>Unit Price ({selectedIncoterm}):</span>
                  <span className="font-bold">{convertPrice(selectedIncoterm === 'CIF' ? selectedListingForOrder.pricePerKgUSD * 1.15 : selectedListingForOrder.pricePerKgUSD)} / kg</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Total Cargo Volume:</span>
                  <span className="font-bold">{orderQuantityMT} Metric Tons ({orderQuantityMT * 1000} kg)</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Destination Port:</span>
                  <span className="font-bold text-stone-900">{selectedPort}</span>
                </div>
                <div className="pt-2 border-t border-stone-200 flex justify-between text-base font-black text-blue-900">
                  <span>Total Contract Value:</span>
                  <span>{convertPrice((selectedIncoterm === 'CIF' ? selectedListingForOrder.pricePerKgUSD * 1.15 : selectedListingForOrder.pricePerKgUSD) * orderQuantityMT * 1000)}</span>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedListingForOrder(null)}
                  className="px-4 py-2 text-xs font-bold text-stone-600 hover:bg-stone-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isOrdering}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition cursor-pointer disabled:opacity-75"
                >
                  {isOrdering ? 'Processing Trade Contract...' : 'Lock Cargo & Issue LC →'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
