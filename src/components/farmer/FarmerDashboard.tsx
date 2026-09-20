import React, { useState, useRef, useEffect } from 'react';
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
  Camera,
  RefreshCw,
  FlipHorizontal,
  AlertCircle,
  Video,
  Sparkles,
  BarChart3,
  TrendingUp,
  ArrowUpRight,
} from 'lucide-react';
import { ConfirmModal } from '../common/ConfirmModal';
import { useToast } from '../../context/ToastContext';

interface FarmerDashboardProps {
  farmer: User;
  crops: CropListing[];
  orders: Order[];
  onRefreshData: () => void;
  onOpenCropDetails?: (crop: CropListing) => void;
  initialTab?: 'my_crops' | 'orders' | 'analytics';
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
  const [activeTab, setActiveTab] = useState<'my_crops' | 'orders' | 'analytics'>(initialTab);
  const [isModalOpen, setIsModalOpen] = useState(isAddModalOpenInitially);
  const [editingCrop, setEditingCrop] = useState<CropListing | null>(null);
  const [deleteTargetCrop, setDeleteTargetCrop] = useState<CropListing | null>(null);

  // Sync activeTab when initialTab prop changes from sidebar navigation
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

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
  const [images, setImages] = useState<string[]>([]);
  const [primaryImageIndex, setPrimaryImageIndex] = useState<number>(0);
  const [isOrganic, setIsOrganic] = useState<boolean>(true);
  const [certificationNumber, setCertificationNumber] = useState<string>('IND-ORG-2026-900');

  // Live Camera Capture State
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraFacingMode, setCameraFacingMode] = useState<'environment' | 'user'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const { success, error, warning } = useToast();

  // Stop camera when modal closes or unmounts
  useEffect(() => {
    if (!isModalOpen) {
      stopLiveCamera();
    }
  }, [isModalOpen]);

  useEffect(() => {
    return () => {
      stopLiveCamera();
    };
  }, []);

  // Ensure stream is bound to video element if camera becomes active
  useEffect(() => {
    if (isCameraActive && videoRef.current && mediaStreamRef.current) {
      videoRef.current.srcObject = mediaStreamRef.current;
      videoRef.current.play().catch((e) => console.error('Video play error:', e));
    }
  }, [isCameraActive]);

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

  const startLiveCamera = async (facing: 'environment' | 'user' = cameraFacingMode) => {
    setCameraError(null);
    try {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      }

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('CAMERA_NOT_SUPPORTED');
      }

      let stream: MediaStream;
      try {
        const constraints: MediaStreamConstraints = {
          video: {
            facingMode: { ideal: facing },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        };
        stream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (constraintErr) {
        // Fallback to simple video constraints if ideal facingMode fails
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      }

      mediaStreamRef.current = stream;
      setIsCameraActive(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch((e) => console.error('Play stream failed:', e));
      }
    } catch (err: any) {
      console.error('Camera stream error:', err);
      setIsCameraActive(false);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError('Camera access was denied. Please enable camera permissions in your browser settings to capture live crop photos.');
        error('Camera permission denied. Please allow camera access in browser settings.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setCameraError('No camera found on this device. Please connect a webcam or use a mobile camera.');
        error('No camera detected on this device.');
      } else if (err.message === 'CAMERA_NOT_SUPPORTED') {
        setCameraError('Live camera capture is not supported by your browser.');
        error('Camera not supported.');
      } else {
        setCameraError('Unable to access camera. Please check permissions and try again.');
        error('Failed to open camera.');
      }
    }
  };

  const stopLiveCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const toggleCameraFacing = () => {
    const nextMode = cameraFacingMode === 'environment' ? 'user' : 'environment';
    setCameraFacingMode(nextMode);
    startLiveCamera(nextMode);
  };

  const captureLivePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;

    if (images.length >= 5) {
      warning('Maximum 5 product photos reached.');
      stopLiveCamera();
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const photoDataUrl = canvas.toDataURL('image/jpeg', 0.9);

      setImages((prev) => {
        const updated = [...prev, photoDataUrl].slice(0, 5);
        if (prev.length === 0) {
          setPrimaryImageIndex(0);
        }
        return updated;
      });

      success('Live crop photo captured!', 'Photo Verified');
      stopLiveCamera();
    }
  };

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
    setImages([]);
    setPrimaryImageIndex(0);
    setIsOrganic(true);
    setCertificationNumber('IND-ORG-2026-900');
    stopLiveCamera();
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
    setImages(crop.images && crop.images.length > 0 ? crop.images : []);
    setPrimaryImageIndex(crop.primaryImageIndex || 0);
    setIsOrganic(crop.isOrganic);
    setCertificationNumber(crop.certificationNumber || '');
    stopLiveCamera();
    setIsModalOpen(true);
  };

  const handleRemoveImage = (index: number) => {
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

      {/* 3. Section Title & View Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 flex items-center gap-2">
            {activeTab === 'my_crops' && (
              <>
                <Layers className="w-6 h-6 text-farm-600" />
                <span>My Products Catalog</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-farm-100 text-farm-800 font-extrabold border border-farm-200">
                  {farmerCrops.length} Active Listings
                </span>
              </>
            )}
            {activeTab === 'orders' && (
              <>
                <Package className="w-6 h-6 text-amber-600" />
                <span>Received Orders & Deliveries</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-extrabold border border-amber-200">
                  {farmerOrders.length} Direct Orders
                </span>
              </>
            )}
            {activeTab === 'analytics' && (
              <>
                <BarChart3 className="w-6 h-6 text-teal-600" />
                <span>Sales Velocity & Performance</span>
              </>
            )}
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            {activeTab === 'my_crops'
              ? 'Manage product listings, harvest details, quality grades, and farm-gate pricing.'
              : activeTab === 'orders'
              ? 'Process incoming buyer purchase orders, update status, and manage delivery handoffs.'
              : 'Real-time revenue metrics, order fulfillment rate, and top performing commodities.'}
          </p>
        </div>

        {activeTab === 'my_crops' && (
          <button
            onClick={handleOpenAdd}
            className="self-start sm:self-auto px-4 py-2 rounded-xl bg-farm-600 hover:bg-farm-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Add New Product</span>
          </button>
        )}
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

      {/* Tab 3: Sales & Analytics */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-card">
              <span className="text-xs font-bold uppercase text-stone-400">Total Direct Revenue</span>
              <div className="text-2xl font-black text-stone-900 mt-1">₹{totalRevenue.toLocaleString('en-IN')}</div>
              <div className="text-[11px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                <span>+18.4% vs last month</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-card">
              <span className="text-xs font-bold uppercase text-stone-400">Avg Order Value</span>
              <div className="text-2xl font-black text-stone-900 mt-1">
                ₹{farmerOrders.length > 0 ? Math.round(totalRevenue / farmerOrders.length).toLocaleString('en-IN') : 0}
              </div>
              <div className="text-[11px] text-stone-500 font-medium mt-1">
                Direct buyer transactions
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-card">
              <span className="text-xs font-bold uppercase text-stone-400">Fulfillment Rate</span>
              <div className="text-2xl font-black text-stone-900 mt-1">
                {farmerOrders.length > 0
                  ? Math.round(
                      (farmerOrders.filter((o) => o.status === 'Completed' || o.status === 'Ready for Pickup').length /
                        farmerOrders.length) *
                        100
                    )
                  : 100}
                %
              </div>
              <div className="text-[11px] text-emerald-600 font-medium mt-1">
                High direct trust score
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-card">
              <span className="text-xs font-bold uppercase text-stone-400">Active Inventory</span>
              <div className="text-2xl font-black text-stone-900 mt-1">
                {totalQuantityKg.toLocaleString('en-IN')} kg
              </div>
              <div className="text-[11px] text-farm-700 font-medium mt-1">
                Across {farmerCrops.length} listed crops
              </div>
            </div>
          </div>

          {/* Product Performance Table */}
          <div className="p-6 bg-white rounded-3xl border border-stone-200 shadow-card space-y-4">
            <h3 className="text-base font-bold text-stone-900">Crop Inventory & Velocity</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider">
                    <th className="pb-3 font-bold">Crop</th>
                    <th className="pb-3 font-bold">Category</th>
                    <th className="pb-3 font-bold">Quality Grade</th>
                    <th className="pb-3 font-bold">Price / kg</th>
                    <th className="pb-3 font-bold">Stock Remaining</th>
                    <th className="pb-3 font-bold">Organic Cert</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-medium">
                  {farmerCrops.map((crop) => (
                    <tr key={crop.id} className="hover:bg-stone-50/80">
                      <td className="py-3.5 font-bold text-stone-900 flex items-center gap-2">
                        <span>🌱</span>
                        <span>{crop.cropName}</span>
                      </td>
                      <td className="py-3.5 text-stone-600">{crop.category}</td>
                      <td className="py-3.5">
                        <span className="px-2 py-0.5 rounded bg-farm-50 text-farm-800 font-bold text-[10px] border border-farm-200">
                          {crop.qualityGrade}
                        </span>
                      </td>
                      <td className="py-3.5 font-bold text-stone-900">₹{crop.pricePerKg}</td>
                      <td className="py-3.5 text-stone-700">{crop.quantity} {crop.unit}</td>
                      <td className="py-3.5">
                        {crop.isOrganic ? (
                          <span className="text-emerald-700 font-bold text-[10px] bg-emerald-50 px-2 py-0.5 rounded-full">
                            ✓ Certified Organic
                          </span>
                        ) : (
                          <span className="text-stone-400 text-[10px]">Standard</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
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

              {/* Live Crop Photo Capture Section */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-extrabold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Camera className="w-4 h-4 text-farm-600" />
                      <span>Live Crop Photo Capture *</span>
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-200">
                        Live Only
                      </span>
                    </label>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      Capture a fresh photo of your crop using your device camera (Up to 5 photos).
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold text-stone-600 bg-white px-2.5 py-1 rounded-lg border border-stone-200 shadow-2xs">
                    {images.length} / 5 photos
                  </span>
                </div>

                {/* Camera Permission / Error Warning Banner */}
                {cameraError && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
                    <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-bold">Camera Permission Required</p>
                      <p className="text-rose-700 mt-0.5">{cameraError}</p>
                      <button
                        type="button"
                        onClick={() => startLiveCamera()}
                        className="mt-2 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                      >
                        Retry Camera Access
                      </button>
                    </div>
                  </div>
                )}

                {/* Live Camera Viewfinder (When Active) */}
                {isCameraActive ? (
                  <div className="relative rounded-2xl overflow-hidden bg-stone-950 border-2 border-farm-500 shadow-lg animate-fade-in">
                    {/* Live indicator tag */}
                    <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-900/80 backdrop-blur-md text-white text-[11px] font-bold border border-white/10">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                      <span className="w-2 h-2 rounded-full bg-rose-500" />
                      <span>LIVE CAMERA</span>
                    </div>

                    {/* Camera switch / flip button */}
                    <button
                      type="button"
                      onClick={toggleCameraFacing}
                      className="absolute top-3 right-3 z-10 p-2 rounded-full bg-stone-900/80 backdrop-blur-md hover:bg-stone-800 text-white text-xs font-medium transition-colors border border-white/10 flex items-center gap-1 cursor-pointer"
                      title="Switch Camera (Front / Rear)"
                    >
                      <FlipHorizontal className="w-4 h-4" />
                      <span className="text-[11px] font-semibold pr-1">Flip</span>
                    </button>

                    {/* Video Element */}
                    <div className="relative aspect-4/3 sm:aspect-16/9 flex items-center justify-center bg-black overflow-hidden">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                      />

                      {/* Viewfinder crosshairs / frame */}
                      <div className="absolute inset-8 sm:inset-12 border-2 border-white/40 border-dashed rounded-xl pointer-events-none flex flex-col justify-between p-2">
                        <div className="flex justify-between">
                          <div className="w-4 h-4 border-t-2 border-l-2 border-white" />
                          <div className="w-4 h-4 border-t-2 border-r-2 border-white" />
                        </div>
                        <div className="text-center">
                          <span className="text-[11px] font-semibold text-white/80 bg-black/50 px-2 py-0.5 rounded backdrop-blur-xs">
                            Position crop within frame
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <div className="w-4 h-4 border-b-2 border-l-2 border-white" />
                          <div className="w-4 h-4 border-b-2 border-r-2 border-white" />
                        </div>
                      </div>
                    </div>

                    {/* Camera Control Bar */}
                    <div className="p-4 bg-stone-900/90 backdrop-blur-md flex items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={stopLiveCamera}
                        className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-bold transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>

                      <button
                        type="button"
                        onClick={captureLivePhoto}
                        className="px-6 py-2.5 rounded-xl bg-farm-600 hover:bg-farm-700 active:scale-95 text-white text-sm font-bold flex items-center gap-2 shadow-lg shadow-farm-600/30 transition-all cursor-pointer"
                      >
                        <Camera className="w-4 h-4" />
                        <span>Capture Photo</span>
                      </button>

                      <span className="text-[11px] text-stone-400 font-mono hidden sm:inline">
                        Slot {images.length + 1}/5
                      </span>
                    </div>
                  </div>
                ) : (
                  /* Camera Inactive State - Action Button */
                  <div>
                    {images.length < 5 ? (
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        <button
                          type="button"
                          onClick={() => startLiveCamera()}
                          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-farm-600 to-farm-700 hover:from-farm-700 hover:to-farm-800 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2.5 shadow-md shadow-farm-600/20 active:scale-98 transition-all cursor-pointer"
                        >
                          <Camera className="w-5 h-5" />
                          <span>{images.length === 0 ? 'Take Live Photo' : 'Capture Another Live Photo'}</span>
                        </button>

                        <div className="text-[11px] text-stone-500 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Direct camera capture required to verify crop freshness.</span>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Maximum of 5 fresh photos captured!</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Image Thumbnails & Primary Selector */}
                {images.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                        Captured Crop Photos:
                      </span>
                      {images.length > 0 && !isCameraActive && (
                        <button
                          type="button"
                          onClick={() => {
                            setImages([]);
                            setPrimaryImageIndex(0);
                            startLiveCamera();
                          }}
                          className="text-[11px] text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>Retake All</span>
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                      {images.map((img, idx) => (
                        <div
                          key={idx}
                          className={`relative rounded-xl overflow-hidden aspect-square border-2 group bg-stone-200 transition-all ${
                            primaryImageIndex === idx ? 'border-farm-600 ring-2 ring-farm-500/30 shadow-xs' : 'border-stone-200 hover:border-stone-400'
                          }`}
                        >
                          <img src={img} alt={`Live crop capture ${idx + 1}`} className="w-full h-full object-cover" />

                          {/* Primary Badge or Set Primary Button */}
                          {primaryImageIndex === idx ? (
                            <span className="absolute top-1 left-1 bg-farm-600 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow-xs flex items-center gap-0.5">
                              <Star className="w-2.5 h-2.5 fill-current" />
                              <span>PRIMARY</span>
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setPrimaryImageIndex(idx)}
                              className="absolute bottom-1 left-1 right-1 bg-stone-900/85 hover:bg-farm-700 text-white text-[9px] font-bold py-1 rounded opacity-0 group-hover:opacity-100 transition-all cursor-pointer text-center"
                            >
                              Set Primary
                            </button>
                          )}

                          {/* Remove Button */}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="absolute top-1 right-1 w-5 h-5 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-xs"
                            title="Remove photo"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
