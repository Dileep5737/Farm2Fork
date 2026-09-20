import React, { useState } from 'react';
import { ExportListing, ExportOrder, User, CropCategory, QualityGrade, Incoterm, ExportOrderStatus } from '../../types';
import { SAMPLE_CROP_IMAGES, StorageService } from '../../services/storage';
import {
  Globe,
  Ship,
  Package,
  FileCheck2,
  DollarSign,
  PlusCircle,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Anchor,
  Layers,
  Sparkles,
  TrendingUp,
  Thermometer,
  Calendar,
  X,
  FileText,
  ExternalLink,
  ChevronRight,
  Eye,
  Trash2,
  Edit2,
  RefreshCw,
  Box,
} from 'lucide-react';
import { ConfirmModal } from '../common/ConfirmModal';
import { useToast } from '../../context/ToastContext';

interface InternationalFarmerDashboardProps {
  farmer: User;
  exportListings: ExportListing[];
  exportOrders: ExportOrder[];
  onRefreshData: () => void;
  activeSection?: 'export_lots' | 'export_orders' | 'port_logistics' | 'phytosanitary_certs' | 'forex_analytics';
  isAddModalOpenInitially?: boolean;
  onCloseAddModal?: () => void;
}

export const InternationalFarmerDashboard: React.FC<InternationalFarmerDashboardProps> = ({
  farmer,
  exportListings,
  exportOrders,
  onRefreshData,
  activeSection = 'export_lots',
  isAddModalOpenInitially = false,
  onCloseAddModal,
}) => {
  const [currentTab, setCurrentTab] = useState<'export_lots' | 'export_orders' | 'port_logistics' | 'phytosanitary_certs' | 'forex_analytics'>(activeSection);
  const [isModalOpen, setIsModalOpen] = useState(isAddModalOpenInitially);
  const [editingListing, setEditingListing] = useState<ExportListing | null>(null);
  const [deleteTargetListing, setDeleteTargetListing] = useState<ExportListing | null>(null);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<ExportOrder | null>(null);

  // Add/Edit Form State
  const [cropName, setCropName] = useState('');
  const [scientificName, setScientificName] = useState('');
  const [category, setCategory] = useState<CropCategory>('Fruits');
  const [qualityGrade, setQualityGrade] = useState<QualityGrade>('Grade A+');
  const [availableQuantityMT, setAvailableQuantityMT] = useState<number>(20);
  const [minOrderQuantityMT, setMinOrderQuantityMT] = useState<number>(5);
  const [containerType, setContainerType] = useState<ExportListing['containerType']>('20ft Reefer FCL');
  const [packaging, setPackaging] = useState('5kg Ventilated Corrugated Export Box');
  const [originPort, setOriginPort] = useState('JNPT Port, Mumbai');
  const [pricePerKgUSD, setPricePerKgUSD] = useState<number>(2.5);
  const [fobPricePerMTUSD, setFobPricePerMTUSD] = useState<number>(2500);
  const [temperatureControlled, setTemperatureControlled] = useState(true);
  const [targetTempCelsius, setTargetTempCelsius] = useState('12°C - 14°C');
  const [shelfLifeDays, setShelfLifeDays] = useState<number>(30);
  const [apedaCertificateNo, setApedaCertificateNo] = useState('APEDA/EXP/2026/9021');
  const [description, setDescription] = useState('');

  const { success, error, info } = useToast();

  React.useEffect(() => {
    setCurrentTab(activeSection);
  }, [activeSection]);

  React.useEffect(() => {
    if (isAddModalOpenInitially) {
      handleOpenAdd();
    }
  }, [isAddModalOpenInitially]);

  // Aggregate Metrics
  const totalExportCargoMT = exportListings.reduce((sum, l) => sum + l.availableQuantityMT, 0);
  const totalContainers = exportListings.reduce((sum, l) => sum + (l.containerType.includes('40ft') ? 2 : 1), 0);
  const avgFobPriceUSD = exportListings.length > 0
    ? (exportListings.reduce((sum, l) => sum + l.pricePerKgUSD, 0) / exportListings.length).toFixed(2)
    : '0.00';
  const totalTradeVolumeUSD = exportOrders.reduce((sum, o) => sum + o.totalAmountUSD, 0);

  const handleOpenAdd = () => {
    setEditingListing(null);
    setCropName('');
    setScientificName('');
    setCategory('Fruits');
    setQualityGrade('Grade A+');
    setAvailableQuantityMT(20);
    setMinOrderQuantityMT(5);
    setContainerType('20ft Reefer FCL');
    setPackaging('5kg Ventilated Corrugated Export Box');
    setOriginPort('JNPT Port, Mumbai');
    setPricePerKgUSD(2.8);
    setFobPricePerMTUSD(2800);
    setTemperatureControlled(true);
    setTargetTempCelsius('12°C - 14°C');
    setShelfLifeDays(30);
    setApedaCertificateNo('APEDA/EXP/2026/9021');
    setDescription('');
    setIsModalOpen(true);
  };

  const handleEdit = (listing: ExportListing) => {
    setEditingListing(listing);
    setCropName(listing.cropName);
    setScientificName(listing.scientificName || '');
    setCategory(listing.category);
    setQualityGrade(listing.qualityGrade);
    setAvailableQuantityMT(listing.availableQuantityMT);
    setMinOrderQuantityMT(listing.minOrderQuantityMT);
    setContainerType(listing.containerType);
    setPackaging(listing.packaging);
    setOriginPort(listing.originPort);
    setPricePerKgUSD(listing.pricePerKgUSD);
    setFobPricePerMTUSD(listing.fobPricePerMTUSD);
    setTemperatureControlled(listing.temperatureControlled);
    setTargetTempCelsius(listing.targetTempCelsius || '12°C');
    setShelfLifeDays(listing.shelfLifeDays);
    setApedaCertificateNo(listing.apedaCertificateNo);
    setDescription(listing.description);
    setIsModalOpen(true);
  };

  const handleSubmitListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cropName.trim()) {
      error('Please enter the export crop name.');
      return;
    }

    if (editingListing) {
      StorageService.updateExportListing(editingListing.id, {
        cropName,
        scientificName,
        category,
        qualityGrade,
        availableQuantityMT,
        minOrderQuantityMT,
        containerType,
        packaging,
        originPort,
        pricePerKgUSD,
        fobPricePerMTUSD,
        temperatureControlled,
        targetTempCelsius,
        shelfLifeDays,
        apedaCertificateNo,
        description,
      });
      success(`Updated export consignment "${cropName}".`, 'Consignment Updated');
    } else {
      StorageService.addExportListing({
        farmerId: farmer.id,
        farmerName: farmer.name,
        farmName: farmer.farmName || 'Green Valley Global Agri Exports',
        farmerPhone: farmer.phone,
        farmerEmail: farmer.email,
        originCountry: 'India',
        originPort,
        cropName,
        scientificName,
        category,
        qualityGrade,
        qualityScore: 4.8,
        availableQuantityMT,
        minOrderQuantityMT,
        containerType,
        packaging,
        pricePerKgUSD,
        fobPricePerMTUSD,
        cifEstimatesUSD: {
          dubai: Math.round(fobPricePerMTUSD * 1.12),
          rotterdam: Math.round(fobPricePerMTUSD * 1.24),
          singapore: Math.round(fobPricePerMTUSD * 1.18),
          london: Math.round(fobPricePerMTUSD * 1.26),
          newyork: Math.round(fobPricePerMTUSD * 1.35),
        },
        incotermsAvailable: ['FOB', 'CIF'],
        harvestDate: new Date().toISOString().split('T')[0],
        shelfLifeDays,
        temperatureControlled,
        targetTempCelsius,
        certifications: ['APEDA Certified', 'GlobalG.A.P.', 'SGS Verified', 'Phytosanitary Cleared'],
        apedaCertificateNo,
        sgsInspectionStatus: 'PASSED',
        images: [SAMPLE_CROP_IMAGES.mango[0], SAMPLE_CROP_IMAGES.mango[1]],
        primaryImageIndex: 0,
        description: description || `Premium export grade ${cropName} compliant with international phytosanitary and MRL standards.`,
        status: 'ACTIVE',
      });
      success(`Created new export cargo consignment for "${cropName}" (${availableQuantityMT} MT).`, 'Export Batch Listed');
    }

    setIsModalOpen(false);
    if (onCloseAddModal) onCloseAddModal();
    onRefreshData();
  };

  const handleUpdateOrderStatus = (orderId: string, status: ExportOrderStatus) => {
    StorageService.updateExportOrderStatus(orderId, status);
    onRefreshData();
    success(`Updated export order milestone to ${status.replace(/_/g, ' ')}.`, 'Customs Milestone Updated');
  };

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto">
      {/* 1. Hero Agri-Export Console Banner matching Preview Screenshot */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0d2818] via-[#04471c] to-[#0d1f2d] text-white shadow-xl border border-emerald-800/40">
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" />
                <span>Verified Global Exporter Hub</span>
              </span>
              <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold font-mono">
                {farmer.exportLicenseNumber || 'APEDA/EXP/2026/9021'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white font-sans">
              Agri-Export Console & Global Trade Hub
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/80 mt-1 max-w-2xl leading-relaxed">
              Manage cross-border agricultural consignments, reefer container logistics, phytosanitary certifications, and international Letter of Credit (LC) settlements.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleOpenAdd}
              className="px-5 py-3 rounded-2xl bg-white text-emerald-950 hover:bg-emerald-50 font-bold text-sm shadow-lg shadow-black/20 flex items-center gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <PlusCircle className="w-5 h-5 text-emerald-600" />
              <span>+ Create Export Consignment</span>
            </button>

            <button
              onClick={() => {
                info('APEDA RCMC Certificate & SGS Lab clearance dossiers downloaded.', 'Compliance Dossier');
              }}
              className="px-4 py-3 rounded-2xl bg-emerald-900/60 hover:bg-emerald-900/90 text-emerald-200 border border-emerald-600/40 font-semibold text-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Download APEDA / SGS Certs</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Key Dynamic Export Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-card">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Export Cargo</span>
            <Layers className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            {totalExportCargoMT} <span className="text-sm font-normal text-stone-500">Metric Tons</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
            <span>🚢</span> Across {exportListings.length} listed export lots
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-card">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Active Containers</span>
            <Box className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            {totalContainers} <span className="text-sm font-normal text-stone-500">FCL</span>
          </div>
          <span className="text-[11px] text-sky-600 font-semibold flex items-center gap-1 mt-0.5">
            <Thermometer className="w-3 h-3" /> Reefer & Dry container capacity
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-card">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Avg FOB Price</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            ${avgFobPriceUSD} <span className="text-sm font-normal text-stone-500">/kg</span>
          </div>
          <span className="text-[11px] text-stone-500 font-semibold">
            Port of Loading: JNPT / Cochin / Chennai
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-card">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Global Trade Value</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            ${totalTradeVolumeUSD.toLocaleString('en-US')}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold">
            {exportOrders.length} international orders processed
          </span>
        </div>
      </div>

      {/* 3. Section Title & View Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 flex items-center gap-2">
            {currentTab === 'export_lots' && (
              <>
                <Layers className="w-6 h-6 text-emerald-600" />
                <span>Export Cargo Lots & Consignments</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold border border-emerald-200">
                  {exportListings.length} Active Lots
                </span>
              </>
            )}
            {currentTab === 'export_orders' && (
              <>
                <Ship className="w-6 h-6 text-sky-600" />
                <span>International Buyer Orders & Ocean Freight</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 font-extrabold border border-sky-200">
                  {exportOrders.length} Export Orders
                </span>
              </>
            )}
            {currentTab === 'port_logistics' && (
              <>
                <Anchor className="w-6 h-6 text-indigo-600" />
                <span>Port Logistics & Reefer Cold Chain Monitor</span>
              </>
            )}
            {currentTab === 'phytosanitary_certs' && (
              <>
                <FileCheck2 className="w-6 h-6 text-teal-600" />
                <span>Phytosanitary, APEDA & SGS Quality Dossiers</span>
              </>
            )}
            {currentTab === 'forex_analytics' && (
              <>
                <DollarSign className="w-6 h-6 text-amber-600" />
                <span>Multi-Currency Forex & Export Revenue Velocity</span>
              </>
            )}
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            {currentTab === 'export_lots'
              ? 'Manage bulk container lots, FOB/CIF pricing, target destination ports, and phytosanitary seals.'
              : currentTab === 'export_orders'
              ? 'Track customs milestones, bill of lading dispatch, container seals, and letter of credit escrow releases.'
              : currentTab === 'port_logistics'
              ? 'Real-time monitoring of container temperature, port gate-in, and vessel departure schedules.'
              : currentTab === 'phytosanitary_certs'
              ? 'Official quarantine certificates, pesticide residue lab tests, and GlobalG.A.P. compliance files.'
              : 'Global currency analytics in USD ($), EUR (€), AED (د.إ), and GBP (£).'}
          </p>
        </div>

        {currentTab === 'export_lots' && (
          <button
            onClick={handleOpenAdd}
            className="self-start sm:self-auto px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Add Export Lot</span>
          </button>
        )}
      </div>

      {/* 4. Tab Contents */}

      {/* TAB 1: EXPORT CARGO LOTS */}
      {currentTab === 'export_lots' && (
        <div className="space-y-6">
          {exportListings.length === 0 ? (
            <div className="text-center p-12 bg-white rounded-3xl border border-stone-200 shadow-card">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 text-2xl">
                🚢
              </div>
              <h3 className="text-lg font-bold text-stone-900 mb-1">No Export Consignments Listed</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto mb-6">
                List export-grade container batches to connect directly with global importers.
              </p>
              <button
                onClick={handleOpenAdd}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md cursor-pointer"
              >
                + Add Export Cargo
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {exportListings.map((listing) => (
                <div
                  key={listing.id}
                  className="bg-white rounded-3xl border border-stone-200 shadow-card overflow-hidden hover:shadow-card-hover transition-all flex flex-col group"
                >
                  {/* Image & Badges */}
                  <div className="relative h-48 bg-stone-100 overflow-hidden">
                    <img
                      src={listing.images[0]}
                      alt={listing.cropName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      <span className="px-2.5 py-1 rounded-md bg-stone-900/85 backdrop-blur-md text-white text-[11px] font-bold">
                        {listing.category}
                      </span>
                      <span className="px-2.5 py-1 rounded-md bg-emerald-700/90 backdrop-blur-md text-white text-[11px] font-bold flex items-center gap-1">
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
                        <span className="text-xs px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold border border-emerald-200 shrink-0">
                          {listing.qualityGrade}
                        </span>
                      </div>

                      {listing.scientificName && (
                        <p className="text-[11px] italic text-stone-400 -mt-0.5 mb-2">
                          {listing.scientificName}
                        </p>
                      )}

                      <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                        {listing.description}
                      </p>

                      {/* Export Spec Badges */}
                      <div className="mt-3.5 pt-3 border-t border-stone-100 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-stone-500 font-medium">Available Volume:</span>
                          <span className="font-extrabold text-stone-900">
                            {listing.availableQuantityMT} MT <span className="text-[11px] font-normal text-stone-500">(Min: {listing.minOrderQuantityMT} MT)</span>
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-xs">
                          <span className="text-stone-500 font-medium">Origin Port:</span>
                          <span className="font-bold text-stone-800 flex items-center gap-1">
                            <Anchor className="w-3 h-3 text-emerald-600" />
                            <span>{listing.originPort}</span>
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-xs">
                          <span className="text-stone-500 font-medium">Incoterms:</span>
                          <div className="flex gap-1">
                            {listing.incotermsAvailable.map((inco) => (
                              <span key={inco} className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-stone-100 text-stone-700">
                                {inco}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Price & Actions */}
                    <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                          FOB Price
                        </div>
                        <div className="text-lg font-black text-emerald-700">
                          ${listing.pricePerKgUSD} <span className="text-xs font-semibold text-stone-500">/kg</span>
                          <span className="block text-[11px] text-stone-500 font-medium font-mono">
                            (${listing.fobPricePerMTUSD.toLocaleString()} / MT)
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleEdit(listing)}
                          className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-colors cursor-pointer"
                          title="Edit Consignment"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteTargetListing(listing)}
                          className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold border border-rose-200 transition-colors cursor-pointer"
                          title="Delete Listing"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: INTERNATIONAL BUYER ORDERS */}
      {currentTab === 'export_orders' && (
        <div className="space-y-6">
          {exportOrders.map((order) => (
            <div
              key={order.id}
              className="p-6 bg-white rounded-3xl border border-stone-200 shadow-card hover:shadow-card-hover transition-all space-y-6"
            >
              {/* Order Header */}
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
                      <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800">
                        {order.incoterm} Delivery
                      </span>
                    </div>
                    <h3 className="text-base font-extrabold text-stone-900 mt-1">
                      {order.cropName}
                    </h3>
                    <p className="text-xs text-stone-500">
                      Buyer: <strong className="text-stone-800">{order.buyerName}</strong> ({order.buyerCompany}) • {order.buyerCountry}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-stone-400 font-bold uppercase">Total Contract Value</div>
                  <div className="text-2xl font-black text-emerald-700">
                    ${order.totalAmountUSD.toLocaleString('en-US')}
                  </div>
                  <span className="text-[11px] text-stone-500 font-medium">
                    {order.quantityMT} MT • {order.containerCount} Container(s) ({order.containerType})
                  </span>
                </div>
              </div>

              {/* Customs Milestone Progress Tracker */}
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3 flex items-center justify-between">
                  <span>Customs & Shipping Milestone Pipeline</span>
                  <span className="text-emerald-700 font-bold text-[11px] font-mono">
                    Status: {order.status.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2 text-center text-xs">
                  <div className={`p-2.5 rounded-xl border ${['INQUIRY_PLACED', 'LC_ESCROW_LOCKED', 'PHYTOSANITARY_CLEARED', 'CUSTOMS_APPROVED', 'VESSEL_LOADED', 'IN_TRANSIT_SEA', 'COMPLETED'].includes(order.status) ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-stone-50 text-stone-400'}`}>
                    <div className="font-bold text-[11px]">1. Inquiry / LC</div>
                    <div className="text-[10px] text-emerald-700 font-semibold">Locked in Escrow</div>
                  </div>

                  <div className={`p-2.5 rounded-xl border ${['PHYTOSANITARY_CLEARED', 'CUSTOMS_APPROVED', 'VESSEL_LOADED', 'IN_TRANSIT_SEA', 'COMPLETED'].includes(order.status) ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-stone-50 text-stone-400'}`}>
                    <div className="font-bold text-[11px]">2. Phytosanitary</div>
                    <div className="text-[10px] text-emerald-700 font-semibold">APEDA Cleared</div>
                  </div>

                  <div className={`p-2.5 rounded-xl border ${['CUSTOMS_APPROVED', 'VESSEL_LOADED', 'IN_TRANSIT_SEA', 'COMPLETED'].includes(order.status) ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-stone-50 text-stone-400'}`}>
                    <div className="font-bold text-[11px]">3. Port Customs</div>
                    <div className="text-[10px] text-emerald-700 font-semibold">Gate-in Approved</div>
                  </div>

                  <div className={`p-2.5 rounded-xl border ${['VESSEL_LOADED', 'IN_TRANSIT_SEA', 'COMPLETED'].includes(order.status) ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-stone-50 text-stone-400'}`}>
                    <div className="font-bold text-[11px]">4. Vessel Loaded</div>
                    <div className="text-[10px] text-emerald-700 font-semibold">{order.vesselName?.split(' ')[0] || 'Scheduled'}</div>
                  </div>

                  <div className={`p-2.5 rounded-xl border ${['IN_TRANSIT_SEA', 'COMPLETED'].includes(order.status) ? 'bg-sky-50 border-sky-300 text-sky-900' : 'bg-stone-50 text-stone-400'}`}>
                    <div className="font-bold text-[11px]">5. Sea Transit</div>
                    <div className="text-[10px] text-sky-700 font-semibold">ETA: {order.estimatedArrivalDate}</div>
                  </div>

                  <div className={`p-2.5 rounded-xl border ${order.status === 'COMPLETED' ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-stone-50 text-stone-400'}`}>
                    <div className="font-bold text-[11px]">6. Port Clearance</div>
                    <div className="text-[10px] text-stone-500 font-semibold">{order.destinationPort.split(',')[0]}</div>
                  </div>
                </div>
              </div>

              {/* Shipping Logistics Summary */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-stone-400 font-bold block mb-0.5">Port of Loading:</span>
                  <span className="font-extrabold text-stone-800 flex items-center gap-1">
                    <Anchor className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{order.originPort}</span>
                  </span>
                </div>

                <div>
                  <span className="text-stone-400 font-bold block mb-0.5">Destination Port:</span>
                  <span className="font-extrabold text-stone-800 flex items-center gap-1">
                    <Ship className="w-3.5 h-3.5 text-sky-600" />
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
                  <span className="font-mono font-bold text-emerald-800">
                    {order.billOfLadingNo || 'MEDU-902184-IN'}
                  </span>
                </div>
              </div>

              {/* Action Controls */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-stone-500">Update Customs Stage:</span>
                  <select
                    value={order.status}
                    onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as ExportOrderStatus)}
                    className="text-xs font-bold bg-white border border-stone-300 rounded-xl px-3 py-1.5 outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                  >
                    <option value="INQUIRY_PLACED">1. Inquiry Placed</option>
                    <option value="LC_ESCROW_LOCKED">2. LC Escrow Locked</option>
                    <option value="PHYTOSANITARY_CLEARED">3. Phytosanitary Approved</option>
                    <option value="CUSTOMS_APPROVED">4. Port Customs Cleared</option>
                    <option value="VESSEL_LOADED">5. Vessel Loaded</option>
                    <option value="IN_TRANSIT_SEA">6. In Transit (Sea Freight)</option>
                    <option value="COMPLETED">7. Delivered & Settled</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      info(`Bill of Lading ${order.billOfLadingNo || 'MEDU-902184-IN'} & Phytosanitary Certificate generated for export clearance.`, 'Document Exported');
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-stone-600" />
                    <span>Print Bill of Lading (B/L)</span>
                  </button>

                  <button
                    onClick={() => {
                      info(`SGS Lab Analysis Dossier for APEDA Batch ${order.apedaCertificateNo} downloaded.`, 'SGS Certificate');
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>SGS Lab Report</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: PORT & LOGISTICS */}
      {currentTab === 'port_logistics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white rounded-3xl border border-stone-200 shadow-card space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-stone-500">
                <span>Primary Export Port</span>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">Operational</span>
              </div>
              <h3 className="text-lg font-black text-stone-900">JNPT Port (Nhava Sheva, Mumbai)</h3>
              <p className="text-xs text-stone-600">
                Direct berthing for Middle East & European reefer container vessels with automated cold-storage gate-in.
              </p>
              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                <span>Avg Gate-In Time: <strong>4.2 hours</strong></span>
                <span>Customs Clearance: <strong>Instant EDI</strong></span>
              </div>
            </div>

            <div className="p-6 bg-white rounded-3xl border border-stone-200 shadow-card space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-stone-500">
                <span>South India Hub</span>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">Active</span>
              </div>
              <h3 className="text-lg font-black text-stone-900">Cochin & Chennai Ports</h3>
              <p className="text-xs text-stone-600">
                High-speed connectivity for Cavendish Bananas, Spices, and Fresh produce to Southeast Asia & GCC.
              </p>
              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                <span>Transit to Dubai: <strong>4 Days</strong></span>
                <span>Transit to Singapore: <strong>5 Days</strong></span>
              </div>
            </div>

            <div className="p-6 bg-white rounded-3xl border border-stone-200 shadow-card space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-stone-500">
                <span>Grain & Bulk Hub</span>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">Active</span>
              </div>
              <h3 className="text-lg font-black text-stone-900">Kandla & Mundra Ports</h3>
              <p className="text-xs text-stone-600">
                Dedicated dry bulk terminals and automated bagging facilities for Basmati rice and organic pulses.
              </p>
              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                <span>Bulk Loading: <strong>1,200 MT/day</strong></span>
                <span>Fumigation: <strong>On-Site Certified</strong></span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PHYTOSANITARY & SGS CERTS */}
      {currentTab === 'phytosanitary_certs' && (
        <div className="p-6 bg-white rounded-3xl border border-stone-200 shadow-card space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-extrabold text-stone-900">Export Quality & Quarantine Compliance Records</h3>
              <p className="text-xs text-stone-500">
                All export lots are verified by APEDA and SGS India for Maximum Residue Limits (MRL) and aflatoxin clearance.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider">
                  <th className="pb-3 font-bold">Crop Commodity</th>
                  <th className="pb-3 font-bold">APEDA Cert No</th>
                  <th className="pb-3 font-bold">Quarantine Lab</th>
                  <th className="pb-3 font-bold">MRL / Pesticide Test</th>
                  <th className="pb-3 font-bold">Status</th>
                  <th className="pb-3 font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-medium">
                {exportListings.map((listing) => (
                  <tr key={listing.id} className="hover:bg-stone-50/80">
                    <td className="py-3.5 font-bold text-stone-900 flex items-center gap-2">
                      <span>🌱</span>
                      <span>{listing.cropName}</span>
                    </td>
                    <td className="py-3.5 font-mono text-stone-700">{listing.apedaCertificateNo}</td>
                    <td className="py-3.5 text-stone-600">SGS Agri-Food Laboratories</td>
                    <td className="py-3.5">
                      <span className="text-emerald-700 font-bold text-[11px] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        Zero Residue (Passed EU/US)
                      </span>
                    </td>
                    <td className="py-3.5">
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-bold text-[10px]">
                        ✓ APEDA Approved
                      </span>
                    </td>
                    <td className="py-3.5">
                      <button
                        onClick={() => {
                          info(`Downloading Official Certificate of Origin & Phytosanitary dossier for ${listing.cropName}.`, 'Dossier Downloaded');
                        }}
                        className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Download PDF</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: FOREX & RATES */}
      {currentTab === 'forex_analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-card">
              <span className="text-xs font-bold uppercase text-stone-400">USD Value (Base)</span>
              <div className="text-2xl font-black text-stone-900 mt-1">
                ${totalTradeVolumeUSD.toLocaleString('en-US')}
              </div>
              <span className="text-[11px] text-emerald-600 font-bold">1 USD = ₹86.50 INR</span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-card">
              <span className="text-xs font-bold uppercase text-stone-400">EUR Conversion</span>
              <div className="text-2xl font-black text-stone-900 mt-1">
                €{Math.round(totalTradeVolumeUSD * 0.92).toLocaleString('en-US')}
              </div>
              <span className="text-[11px] text-sky-600 font-bold">1 EUR = $1.09 USD</span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-card">
              <span className="text-xs font-bold uppercase text-stone-400">AED Conversion</span>
              <div className="text-2xl font-black text-stone-900 mt-1">
                د.إ{Math.round(totalTradeVolumeUSD * 3.67).toLocaleString('en-US')}
              </div>
              <span className="text-[11px] text-amber-600 font-bold">1 USD = 3.67 AED</span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-card">
              <span className="text-xs font-bold uppercase text-stone-400">INR Direct Settlement</span>
              <div className="text-2xl font-black text-emerald-700 mt-1">
                ₹{Math.round(totalTradeVolumeUSD * 86.5).toLocaleString('en-IN')}
              </div>
              <span className="text-[11px] text-emerald-700 font-bold">Zero forex margin loss</span>
            </div>
          </div>
        </div>
      )}

      {/* 5. Comprehensive Add / Edit Export Consignment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden animate-slide-up my-8 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-emerald-900 to-stone-900 text-white flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Globe className="w-5 h-5 text-emerald-400" />
                  <span>{editingListing ? 'Edit Export Cargo Consignment' : '+ Create Export Consignment'}</span>
                </h3>
                <p className="text-xs text-emerald-200 mt-0.5">
                  Direct cross-border lot listing visible to verified international importers.
                </p>
              </div>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  if (onCloseAddModal) onCloseAddModal();
                }}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmitListing} className="p-6 space-y-5 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Commodity / Crop Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={cropName}
                    onChange={(e) => setCropName(e.target.value)}
                    placeholder="e.g. GI-Tagged Alphonso Mangoes"
                    className="w-full px-3.5 py-2.5 text-sm border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Scientific / Botanical Name
                  </label>
                  <input
                    type="text"
                    value={scientificName}
                    onChange={(e) => setScientificName(e.target.value)}
                    placeholder="e.g. Mangifera indica"
                    className="w-full px-3.5 py-2.5 text-sm border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as CropCategory)}
                    className="w-full px-3.5 py-2.5 text-sm border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                  >
                    <option value="Fruits">Fruits</option>
                    <option value="Vegetables">Vegetables</option>
                    <option value="Grains">Grains & Rice</option>
                    <option value="Spices">Spices & Herbs</option>
                    <option value="Pulses">Pulses</option>
                    <option value="Organic">Organic Specials</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Export Grade *
                  </label>
                  <select
                    value={qualityGrade}
                    onChange={(e) => setQualityGrade(e.target.value as QualityGrade)}
                    className="w-full px-3.5 py-2.5 text-sm border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                  >
                    <option value="Grade A+">Grade A+ (Premium Export)</option>
                    <option value="Grade A">Grade A (Standard Export)</option>
                    <option value="Grade B">Grade B (Processing Grade)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Container Packaging *
                  </label>
                  <select
                    value={containerType}
                    onChange={(e) => setContainerType(e.target.value as ExportListing['containerType'])}
                    className="w-full px-3.5 py-2.5 text-sm border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                  >
                    <option value="20ft Reefer FCL">20ft Reefer FCL (Cold Chain)</option>
                    <option value="40ft High Cube Reefer">40ft High Cube Reefer</option>
                    <option value="20ft Dry FCL">20ft Dry FCL</option>
                    <option value="Bulk Cargo">Bulk Cargo Vessel</option>
                  </select>
                </div>
              </div>

              {/* Quantity and Pricing */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Available Volume (MT) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={availableQuantityMT}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setAvailableQuantityMT(val);
                    }}
                    className="w-full px-3.5 py-2.5 text-sm border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Price per kg (USD $) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    min="0.1"
                    value={pricePerKgUSD}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setPricePerKgUSD(val);
                      setFobPricePerMTUSD(Math.round(val * 1000));
                    }}
                    className="w-full px-3.5 py-2.5 text-sm border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Port of Loading *
                  </label>
                  <select
                    value={originPort}
                    onChange={(e) => setOriginPort(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                  >
                    <option value="JNPT Port, Mumbai">JNPT Port, Mumbai</option>
                    <option value="Cochin Port">Cochin Port, Kerala</option>
                    <option value="Chennai Port">Chennai Port, Tamil Nadu</option>
                    <option value="Kandla Port, Gujarat">Kandla Port, Gujarat</option>
                  </select>
                </div>
              </div>

              {/* Temperature & Compliance */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Target Reefer Temperature
                  </label>
                  <input
                    type="text"
                    value={targetTempCelsius}
                    onChange={(e) => setTargetTempCelsius(e.target.value)}
                    placeholder="e.g. 12°C - 14°C"
                    className="w-full px-3.5 py-2.5 text-sm border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    APEDA Certificate / Registration No
                  </label>
                  <input
                    type="text"
                    value={apedaCertificateNo}
                    onChange={(e) => setApedaCertificateNo(e.target.value)}
                    placeholder="APEDA/EXP/2026/9021"
                    className="w-full px-3.5 py-2.5 text-sm border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Export Lot Description & Quality Highlights
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe harvest batch, grading specifications, pesticide clearance, and shelf-life..."
                  className="w-full px-3.5 py-2.5 text-sm border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-xs font-bold text-stone-600 hover:bg-stone-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition cursor-pointer"
                >
                  {editingListing ? 'Update Export Consignment' : 'Publish Export Cargo Lot'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTargetListing && (
        <ConfirmModal
          isOpen={!!deleteTargetListing}
          title="Delete Export Consignment"
          message={`Are you sure you want to delete the export listing for "${deleteTargetListing.cropName}" (${deleteTargetListing.availableQuantityMT} MT)?`}
          confirmText="Delete Consignment"
          cancelText="Keep Listing"
          isDestructive={true}
          onConfirm={() => {
            StorageService.deleteExportListing(deleteTargetListing.id);
            setDeleteTargetListing(null);
            onRefreshData();
            success(`Removed export consignment "${deleteTargetListing.cropName}".`, 'Listing Deleted');
          }}
          onCancel={() => setDeleteTargetListing(null)}
        />
      )}
    </div>
  );
};
