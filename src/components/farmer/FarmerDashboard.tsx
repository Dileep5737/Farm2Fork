import React, { useState, useRef } from 'react';
import { CropCategory, CropListing, Order, QualityGrade, User, OrderStatus } from '../../types';
import { SAMPLE_CROP_IMAGES, StorageService } from '../../services/storage';
import {
  PlusCircle,
  Package,
  Layers,
  Edit2,
  Trash2,
  Image as ImageIcon,
  CheckCircle2,
  Upload,
  Star,
  Calendar,
  MapPin,
  Eye,
  X,
  Check,
  Truck,
  DollarSign,
  Phone,
  Clock,
  XCircle,
} from 'lucide-react';
import { ConfirmModal } from '../common/ConfirmModal';
import { useToast } from '../../context/ToastContext';

interface FarmerDashboardProps {
  farmer: User;
  crops: CropListing[];
  orders: Order[];
  onRefreshData: () => void;
  onOpenCropDetails?: (crop: CropListing) => void;
  initialTab?: 'my_crops' | 'orders';
  isAddModalOpenInitially?: boolean;
  onCloseAddModal?: () => void;
}

export const FarmerDashboard: React.FC<FarmerDashboardProps> = ({
  farmer,
  crops,
  orders,
  onRefreshData,
  onOpenCropDetails,
  initialTab = 'my_crops',
  isAddModalOpenInitially = false,
  onCloseAddModal,
}) => {
  const [activeTab, setActiveTab] = useState<'my_crops' | 'orders'>(initialTab);
  const [isModalOpen, setIsModalOpen] = useState(isAddModalOpenInitially);
  const [editingCrop, setEditingCrop] = useState<CropListing | null>(null);
  const [deleteTargetCrop, setDeleteTargetCrop] = useState<CropListing | null>(null);

  // Helper for internal quality rating based on grade
  const getRatingFromGrade = (grade: QualityGrade): number => {
    switch (grade) {
      case 'Grade A+':
        return 4.9;
      case 'Grade A':
        return 4.6;
      case 'Grade B':
        return 4.1;
      case 'Grade C':
        return 3.6;
      default:
        return 4.5;
    }
  };

  // Form State
  const [cropName, setCropName] = useState('');
  const [category, setCategory] = useState<CropCategory>('Vegetables');
  const [quantity, setQuantity] = useState<number>(500);
  const [unit, setUnit] = useState<'kg' | 'quintal' | 'ton'>('kg');
  const [pricePerKg, setPricePerKg] = useState<number>(30);
  const [qualityGrade, setQualityGrade] = useState<QualityGrade>('Grade A+');
  const [harvestDate, setHarvestDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [farmerLocation, setFarmerLocation] = useState<string>(farmer.location);
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([SAMPLE_CROP_IMAGES.tomato[0]]);
  const [primaryImageIndex, setPrimaryImageIndex] = useState<number>(0);
  const [isOrganic, setIsOrganic] = useState<boolean>(true);
  const [certificationNumber, setCertificationNumber] = useState<string>('IND-ORG-2026-900');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { success, error, warning } = useToast();

  // Filter farmer crops
  const farmerCrops = crops.filter(
    (c) => c.farmerId === farmer.id || c.farmerName.toLowerCase().includes(farmer.name.toLowerCase().split(' ')[0])
  );

  // Filter farmer orders
  const farmerOrders = orders.filter(
    (o) => o.farmerId === farmer.id || o.farmerName.toLowerCase().includes(farmer.name.toLowerCase().split(' ')[0])
  );

  // Calculate Dynamic Statistics
  const totalQuantityKg = farmerCrops.reduce(
    (sum, c) => sum + (c.unit === 'ton' ? c.quantity * 1000 : c.unit === 'quintal' ? c.quantity * 100 : c.quantity),
    0
  );
  const avgPrice =
    farmerCrops.length > 0
      ? Math.round(farmerCrops.reduce((sum, c) => sum + c.pricePerKg, 0) / farmerCrops.length)
      : 0;
  const totalRevenue = farmerOrders
    .filter((o) => o.status !== 'Rejected')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const resetForm = () => {
    setEditingCrop(null);
    setCropName('');
    setCategory('Vegetables');
    setQuantity(500);
    setUnit('kg');
    setPricePerKg(30);
    setQualityGrade('Grade A+');
    setHarvestDate(new Date().toISOString().split('T')[0]);
    setFarmerLocation(farmer.location);
    setDescription('');
    setImages([SAMPLE_CROP_IMAGES.tomato[0]]);
    setPrimaryImageIndex(0);
    setIsOrganic(true);
    setCertificationNumber('IND-ORG-2026-900');
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (crop: CropListing) => {
    setEditingCrop(crop);
    setCropName(crop.cropName);
    setCategory(crop.category);
    setQuantity(crop.quantity);
    setUnit(crop.unit);
    setPricePerKg(crop.pricePerKg);
    setQualityGrade(crop.qualityGrade);
    setHarvestDate(crop.harvestDate);
    setFarmerLocation(crop.farmerLocation);
    setDescription(crop.description);
    setImages(crop.images && crop.images.length > 0 ? crop.images : [SAMPLE_CROP_IMAGES.tomato[0]]);
    setPrimaryImageIndex(crop.primaryImageIndex || 0);
    setIsOrganic(crop.isOrganic);
    setCertificationNumber(crop.certificationNumber || '');
    setIsModalOpen(true);
  };

  // Image Upload Handling (supports up to 5 photos)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > 5) {
      error('Maximum 5 product photos allowed.');
      return;
    }

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImages((prev) => [...prev, reader.result as string].slice(0, 5));
          success(`Uploaded photo: ${file.name}`);
        }
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAddPresetImage = (url: string) => {
    if (images.length >= 5) {
      error('Maximum 5 photos reached.');
      return;
    }
    setImages((prev) => [...prev, url]);
    success('Added product photo.');
  };

  const handleRemoveImage = (index: number) => {
    if (images.length === 1) {
      error('At least one product photo is required.');
      return;
    }
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    if (primaryImageIndex >= newImages.length) {
      setPrimaryImageIndex(0);
    }
  };

  // Form Submit
  const handleSubmitCrop = (e: React.FormEvent) => {
    e.preventDefault();

    if (!cropName.trim()) {
      error('Product/Crop name is required.');
      return;
    }
    if (quantity <= 0) {
      error('Quantity must be greater than 0.');
      return;
    }
    if (pricePerKg <= 0) {
      error('Price per kg must be greater than 0.');
      return;
    }
    if (!farmerLocation.trim()) {
      error('Location is required.');
      return;
    }
    if (images.length === 0) {
      error('At least one photo is required.');
      return;
    }

    const mandiRef = Math.round(pricePerKg * 0.65);
    const retailRef = Math.round(pricePerKg * 1.35);
    const computedRating = editingCrop?.qualityRating || getRatingFromGrade(qualityGrade);

    if (editingCrop) {
      StorageService.updateCrop(editingCrop.id, {
        cropName,
        category,
        quantity,
        unit,
        pricePerKg,
        mandiPricePerKg: mandiRef,
        retailPricePerKg: retailRef,
        qualityGrade,
        qualityRating: computedRating,
        harvestDate,
        farmerLocation,
        description: description || `Freshly harvested ${cropName} directly from ${farmer.farmName || farmer.name}.`,
        images,
        primaryImageIndex,
        isOrganic,
        certificationNumber: isOrganic ? certificationNumber : undefined,
      });
      success(`Updated product listing for "${cropName}"!`, 'Product Updated');
    } else {
      StorageService.addCrop({
        farmerId: farmer.id,
        farmerName: farmer.name,
        farmName: farmer.farmName || `${farmer.name}'s Farm`,
        farmerPhone: farmer.phone,
        farmerRating: 4.8,
        farmerLocation,
        coordinates: farmer.coordinates || { lat: 13.2925, lng: 77.5429 },
        cropName,
        category,
        quantity,
        unit,
        pricePerKg,
        mandiPricePerKg: mandiRef,
        retailPricePerKg: retailRef,
        qualityGrade,
        qualityRating: computedRating,
        harvestDate,
        description: description || `Freshly harvested ${cropName} directly from ${farmer.farmName || farmer.name}.`,
        images,
        primaryImageIndex,
        isOrganic,
        certificationNumber: isOrganic ? certificationNumber : undefined,
        status: 'ACTIVE',
      });
      success(`"${cropName}" is now live on the marketplace!`, 'Product Listed');
    }

    setIsModalOpen(false);
    if (onCloseAddModal) onCloseAddModal();
    resetForm();
    onRefreshData();
  };

  const handleDeleteConfirm = () => {
    if (!deleteTargetCrop) return;
    StorageService.deleteCrop(deleteTargetCrop.id);
    success(`Removed "${deleteTargetCrop.cropName}" from marketplace.`);
    setDeleteTargetCrop(null);
    onRefreshData();
  };

  // Order status transitions (Pending -> Accepted -> Ready for Pickup -> Completed or Rejected)
  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    StorageService.updateOrderStatus(orderId, status);
    if (status === 'Accepted') {
      success(`Order #${orderId} has been accepted!`);
    } else if (status === 'Ready for Pickup') {
      success(`Order #${orderId} is now marked Ready for Pickup!`);
    } else if (status === 'Completed') {
      success(`Order #${orderId} marked as Completed.`);
    } else if (status === 'Rejected') {
      warning(`Order #${orderId} was rejected.`);
    }
    onRefreshData();
  };

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* 1. Farmer Header & Statistics */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-farm-800 via-farm-900 to-stone-900 text-white shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-3xl shadow-inner">
            👨‍🌾
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Welcome, {farmer.name} 👋
              </h1>
              {farmer.fpoMember && (
                <span className="px-2 py-0.5 rounded-full bg-farm-400 text-farm-950 text-xs font-extrabold uppercase">
                  FPO Member
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-farm-200 mt-1 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-farm-400" />
              <span>{farmer.farmName || farmer.location}</span>
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-6 py-3 rounded-2xl bg-white text-farm-900 hover:bg-farm-50 font-bold text-sm shadow-lg shadow-black/20 flex items-center gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
        >
          <PlusCircle className="w-5 h-5 text-farm-600" />
          <span>+ Add New Crop</span>
        </button>
      </div>

      {/* 2. Key Dynamic Metrics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-card">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Listed Products</span>
            <Layers className="w-4 h-4 text-farm-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-stone-900">{farmerCrops.length}</div>
          <span className="text-[11px] text-stone-500">Active marketplace listings</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-card">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Available Stock</span>
            <Package className="w-4 h-4 text-farm-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            {totalQuantityKg.toLocaleString('en-IN')} <span className="text-sm font-normal text-stone-500">kg</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold">Direct farm inventory</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-card">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Avg Selling Price</span>
            <DollarSign className="w-4 h-4 text-farm-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            ₹{avgPrice} <span className="text-sm font-normal text-stone-500">/kg</span>
          </div>
          <span className="text-[11px] text-farm-700 font-semibold">Direct farm-gate rate</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-card">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Direct Sales</span>
            <Package className="w-4 h-4 text-farm-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            ₹{totalRevenue.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold">{farmerOrders.length} orders received</span>
        </div>
      </div>

      {/* 3. Clean Dashboard Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
        <button
          onClick={() => setActiveTab('my_crops')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'my_crops'
              ? 'bg-farm-600 text-white shadow-sm'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>My Products ({farmerCrops.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all relative cursor-pointer ${
            activeTab === 'orders'
              ? 'bg-farm-600 text-white shadow-sm'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Received Orders ({farmerOrders.length})</span>
          {farmerOrders.filter((o) => o.status === 'Pending').length > 0 && (
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          )}
        </button>
      </div>

      {/* 4. Tab Contents */}

      {/* Tab 1: My Products */}
      {activeTab === 'my_crops' && (
        <div className="space-y-6">
          {farmerCrops.length === 0 ? (
            <div className="text-center p-12 bg-white rounded-3xl border border-stone-200 shadow-card">
              <div className="w-16 h-16 rounded-full bg-farm-100 text-farm-600 flex items-center justify-center mx-auto mb-4 text-2xl">
                🌱
              </div>
              <h3 className="text-lg font-bold text-stone-900 mb-1">No Listed Products Yet</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto mb-6">
                Start listing your crops to connect directly with buyers.
              </p>
              <button
                onClick={handleOpenAdd}
                className="px-6 py-2.5 rounded-xl bg-farm-600 hover:bg-farm-700 text-white font-bold text-sm shadow-md cursor-pointer"
              >
                + Add New Crop
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {farmerCrops.map((crop) => {
                const primaryImg = crop.images[crop.primaryImageIndex || 0] || crop.images[0] || SAMPLE_CROP_IMAGES.tomato[0];
                return (
                  <div
                    key={crop.id}
                    className="bg-white rounded-3xl border border-stone-200 shadow-card overflow-hidden hover:shadow-card-hover transition-all flex flex-col group"
                  >
                    {/* Product Image Container */}
                    <div className="relative h-48 bg-stone-100 overflow-hidden">
                      <img
                        src={primaryImg}
                        alt={crop.cropName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                        <span className="px-2.5 py-1 rounded-md bg-stone-900/80 backdrop-blur-md text-white text-[11px] font-bold">
                          {crop.category}
                        </span>
                        {crop.isOrganic && (
                          <span className="px-2.5 py-1 rounded-md bg-emerald-600/90 backdrop-blur-md text-white text-[11px] font-bold flex items-center gap-1">
                            <span>🌿</span> Organic
                          </span>
                        )}
                      </div>

                      <div className="absolute top-3 right-3">
                        <span className="px-2.5 py-1 rounded-md bg-farm-100 text-farm-900 text-[11px] font-bold border border-farm-300/80 shadow-xs flex items-center gap-1">
                          <Star className="w-3 h-3 text-farm-700 fill-farm-700" />
                          <span>{crop.qualityGrade}</span>
                        </span>
                      </div>

                      <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-bold text-stone-800">
                        {crop.images.length} Photos
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-extrabold text-stone-900 text-base leading-snug">
                            {crop.cropName}
                          </h3>
                          <span className="text-base font-extrabold text-farm-700">
                            ₹{crop.pricePerKg}<span className="text-xs text-stone-500 font-normal">/kg</span>
                          </span>
                        </div>

                        <p className="text-xs text-stone-500 line-clamp-2 mb-4 leading-relaxed">
                          {crop.description}
                        </p>

                        <div className="grid grid-cols-2 gap-2 text-xs text-stone-600 py-3 border-y border-stone-100 mb-4 font-medium">
                          <div className="flex items-center gap-1.5">
                            <Package className="w-3.5 h-3.5 text-stone-400" />
                            <span>Stock: <strong>{crop.quantity} {crop.unit}</strong></span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-stone-400" />
                            <span>Harvest: {crop.harvestDate}</span>
                          </div>
                          <div className="flex items-center gap-1.5 col-span-2">
                            <MapPin className="w-3.5 h-3.5 text-stone-400" />
                            <span className="truncate">{crop.farmerLocation}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons: View, Edit, Delete */}
                      <div className="flex items-center gap-2 pt-2">
                        {onOpenCropDetails && (
                          <button
                            onClick={() => onOpenCropDetails(crop)}
                            className="flex-1 py-2 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View</span>
                          </button>
                        )}
                        <button
                          onClick={() => handleOpenEdit(crop)}
                          className="flex-1 py-2 px-3 rounded-xl bg-farm-50 hover:bg-farm-100 text-farm-800 text-xs font-bold flex items-center justify-center gap-1.5 border border-farm-200 transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => setDeleteTargetCrop(crop)}
                          className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold border border-rose-200 transition-colors cursor-pointer"
                          title="Delete Listing"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Received Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-stone-900">Incoming Buyer Orders</h3>
            <span className="text-xs text-stone-500 font-medium">
              {farmerOrders.length} total orders
            </span>
          </div>

          {farmerOrders.length === 0 ? (
            <div className="text-center p-12 bg-white rounded-3xl border border-stone-200 shadow-card">
              <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4 text-2xl">
                📦
              </div>
              <h3 className="text-lg font-bold text-stone-900 mb-1">No Orders Received Yet</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Orders placed by buyers will appear here in real time for fulfillment.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {farmerOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-6 rounded-3xl bg-white border border-stone-200 shadow-card hover:shadow-card-hover transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                >
                  <div className="flex items-start sm:items-center gap-4">
                    <img
                      src={order.cropImage || SAMPLE_CROP_IMAGES.tomato[0]}
                      alt={order.cropName}
                      className="w-20 h-20 rounded-2xl object-cover border border-stone-200 shadow-xs shrink-0"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md">
                          Order #{order.id}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase ${
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
                          {order.status}
                        </span>
                      </div>

                      <h4 className="text-base font-extrabold text-stone-900">{order.cropName}</h4>

                      <div className="text-xs text-stone-600 space-y-0.5">
                        <p>
                          Buyer: <strong>{order.buyerName}</strong> • Phone: {order.buyerPhone}
                        </p>
                        <p>
                          Quantity: <strong>{order.quantity} kg</strong> • Rate: ₹{order.pricePerKg}/kg • Total:{' '}
                          <span className="text-farm-700 font-extrabold">₹{order.totalAmount.toLocaleString('en-IN')}</span>
                        </p>
                        <p className="text-stone-500 flex items-center gap-1 text-[11px]">
                          <MapPin className="w-3 h-3 text-stone-400" />
                          <span>{order.deliveryAddress}</span>
                        </p>
                        <p className="text-stone-400 text-[10px]">
                          Order Date: {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Functional Status Actions (Pending -> Accept/Reject -> Mark Ready -> Mark Completed) */}
                  <div className="flex flex-wrap items-center gap-2 self-end md:self-center">
                    {order.status === 'Pending' && (
                      <>
                        <button
                          onClick={() => handleUpdateOrderStatus(order.id, 'Accepted')}
                          className="px-4 py-2.5 rounded-xl bg-farm-600 hover:bg-farm-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <Check className="w-4 h-4" />
                          <span>Accept Order</span>
                        </button>
                        <button
                          onClick={() => handleUpdateOrderStatus(order.id, 'Rejected')}
                          className="px-3.5 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>Reject</span>
                        </button>
                      </>
                    )}

                    {order.status === 'Accepted' && (
                      <button
                        onClick={() => handleUpdateOrderStatus(order.id, 'Ready for Pickup')}
                        className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Truck className="w-4 h-4" />
                        <span>Mark as Ready</span>
                      </button>
                    )}

                    {order.status === 'Ready for Pickup' && (
                      <button
                        onClick={() => handleUpdateOrderStatus(order.id, 'Completed')}
                        className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Mark Completed</span>
                      </button>
                    )}

                    {order.status === 'Completed' && (
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3.5 py-2 rounded-xl border border-emerald-200 flex items-center gap-1.5">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>Order Completed</span>
                      </span>
                    )}

                    {order.status === 'Rejected' && (
                      <span className="text-xs font-bold text-rose-800 bg-rose-50 px-3.5 py-2 rounded-xl border border-rose-200 flex items-center gap-1.5">
                        <XCircle className="w-4 h-4 text-rose-600" />
                        <span>Order Rejected</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 5. Comprehensive Add / Edit Crop Modal with Multi-Photo Upload */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden animate-slide-up my-8 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-farm-800 to-farm-900 text-white flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-xl font-bold">
                  {editingCrop ? 'Edit Product Listing' : '+ Add New Crop'}
                </h3>
                <p className="text-xs text-farm-200 mt-0.5">
                  Direct listing accessible by verified retail and bulk buyers.
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
            <form onSubmit={handleSubmitCrop} className="p-6 space-y-6 overflow-y-auto flex-1">
              {/* Basic Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Crop / Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={cropName}
                    onChange={(e) => setCropName(e.target.value)}
                    placeholder="e.g. Vine Ripe Hybrid Tomato"
                    className="w-full px-3.5 py-2.5 text-sm border border-stone-200 rounded-xl focus:ring-2 focus:ring-farm-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as CropCategory)}
                    className="w-full px-3.5 py-2.5 text-sm border border-stone-200 rounded-xl focus:ring-2 focus:ring-farm-500 outline-none bg-white"
                  >
                    <option value="Vegetables">Vegetables</option>
                    <option value="Fruits">Fruits</option>
                    <option value="Grains">Grains</option>
                    <option value="Pulses">Pulses</option>
                    <option value="Spices">Spices</option>
                    <option value="Organic">Organic Specials</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Quantity, Unit & Price */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 text-sm border border-stone-200 rounded-xl focus:ring-2 focus:ring-farm-500 outline-none"
                  />
                </div>

                <div className="col-span-1">
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Unit *
                  </label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value as 'kg' | 'quintal' | 'ton')}
                    className="w-full px-3.5 py-2.5 text-sm border border-stone-200 rounded-xl focus:ring-2 focus:ring-farm-500 outline-none bg-white"
                  >
                    <option value="kg">kg</option>
                    <option value="quintal">quintal (100kg)</option>
                    <option value="ton">ton (1000kg)</option>
                  </select>
                </div>

                <div className="col-span-1">
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Price per kg (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={pricePerKg}
                    onChange={(e) => setPricePerKg(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 text-sm border border-stone-200 rounded-xl focus:ring-2 focus:ring-farm-500 outline-none font-bold text-farm-800"
                  />
                </div>
              </div>

              {/* Quality Grade */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Quality Grade
                </label>
                <select
                  value={qualityGrade}
                  onChange={(e) => setQualityGrade(e.target.value as QualityGrade)}
                  className="w-full px-3.5 py-2.5 text-sm border border-stone-200 rounded-xl focus:ring-2 focus:ring-farm-500 outline-none bg-white font-semibold"
                >
                  <option value="Grade A+">Grade A+ (Premium Export/Clean)</option>
                  <option value="Grade A">Grade A (Standard Table Fresh)</option>
                  <option value="Grade B">Grade B (Commercial / Processing)</option>
                  <option value="Grade C">Grade C (Local Grade)</option>
                </select>
              </div>

              {/* Harvest Date & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Harvest Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={harvestDate}
                    onChange={(e) => setHarvestDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm border border-stone-200 rounded-xl focus:ring-2 focus:ring-farm-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Farm Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={farmerLocation}
                    onChange={(e) => setFarmerLocation(e.target.value)}
                    placeholder="e.g. Doddaballapura, Bengaluru Rural"
                    className="w-full px-3.5 py-2.5 text-sm border border-stone-200 rounded-xl focus:ring-2 focus:ring-farm-500 outline-none"
                  />
                </div>
              </div>

              {/* Multi-Photo Upload Section */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-extrabold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-farm-600" />
                      <span>Product Photos (Up to 5 Photos) *</span>
                    </label>
                    <p className="text-[11px] text-stone-500">
                      Upload photos showing freshness, color & quality grading.
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold text-stone-600">
                    {images.length} / 5 photos
                  </span>
                </div>

                {/* Upload Action Row */}
                <div className="flex flex-wrap gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 rounded-xl bg-white border border-stone-300 hover:border-farm-500 text-stone-700 text-xs font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                  >
                    <Upload className="w-4 h-4 text-farm-600" />
                    <span>Upload from Device / Camera</span>
                  </button>

                  {/* Preset quick buttons */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-stone-400 font-semibold">Sample Photos:</span>
                    <button
                      type="button"
                      onClick={() => handleAddPresetImage(SAMPLE_CROP_IMAGES.tomato[1])}
                      className="px-2 py-1 bg-white border border-stone-200 rounded-lg text-[11px] hover:bg-stone-100 cursor-pointer"
                    >
                      + Tomato 2
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddPresetImage(SAMPLE_CROP_IMAGES.onion[0])}
                      className="px-2 py-1 bg-white border border-stone-200 rounded-lg text-[11px] hover:bg-stone-100 cursor-pointer"
                    >
                      + Onion
                    </button>
                  </div>
                </div>

                {/* Image Thumbnails & Primary Selector */}
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 pt-2">
                  {images.map((img, idx) => (
                    <div
                      key={idx}
                      className={`relative rounded-xl overflow-hidden aspect-square border-2 group bg-stone-200 ${
                        primaryImageIndex === idx ? 'border-farm-600 ring-2 ring-farm-500/20' : 'border-stone-200'
                      }`}
                    >
                      <img src={img} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover" />

                      {/* Primary Badge or Set Primary Button */}
                      {primaryImageIndex === idx ? (
                        <span className="absolute top-1 left-1 bg-farm-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs">
                          PRIMARY
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setPrimaryImageIndex(idx)}
                          className="absolute bottom-1 left-1 right-1 bg-stone-900/80 text-white text-[9px] font-bold py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        >
                          Set Primary
                        </button>
                      )}

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        title="Remove image"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Organic Certification Checkbox */}
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isOrganic}
                    onChange={(e) => setIsOrganic(e.target.checked)}
                    className="w-4 h-4 text-farm-600 rounded focus:ring-farm-500"
                  />
                  <span className="text-xs font-bold text-emerald-950">
                    🌿 Certified Organic Crop
                  </span>
                </label>
                {isOrganic && (
                  <input
                    type="text"
                    value={certificationNumber}
                    onChange={(e) => setCertificationNumber(e.target.value)}
                    placeholder="Cert No."
                    className="text-xs px-2 py-1 bg-white border border-emerald-300 rounded-lg outline-none w-36"
                  />
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Product Description & Variety Notes
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe variety, soil type, irrigation method, and packaging..."
                  className="w-full px-3.5 py-2.5 text-sm border border-stone-200 rounded-xl focus:ring-2 focus:ring-farm-500 outline-none"
                />
              </div>

              {/* Footer Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    if (onCloseAddModal) onCloseAddModal();
                  }}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-farm-600 hover:bg-farm-700 shadow-md shadow-farm-600/20 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingCrop ? 'Save Changes' : 'List Product'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTargetCrop}
        title="Delete Product Listing?"
        message={`Are you sure you want to delete "${deleteTargetCrop?.cropName}"? It will be removed from your products and unlisted from the buyer marketplace.`}
        confirmText="Delete Product"
        isDestructive
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTargetCrop(null)}
      />
    </div>
  );
};
