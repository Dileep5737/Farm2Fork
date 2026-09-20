import React, { useState } from 'react';
import { User, Role, RegionType } from '../../types';
import { DEMO_FARMER, DEMO_BUYER, DEMO_INTL_FARMER, DEMO_INTL_BUYER, StorageService } from '../../services/storage';
import {
  Sprout,
  LogOut,
  Sparkles,
  ChevronDown,
  Menu,
  RefreshCw,
  PlusCircle,
  Home,
  ChevronRight,
  Globe,
  MapPin,
  Ship,
  Check,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface NavbarProps {
  currentUser: User | null;
  currentRole: Role;
  region: RegionType;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onRegionChange: (region: RegionType) => void;
  onUserChange: (user: User | null) => void;
  onOpenAuth: (initialRole?: Role) => void;
  orderCount: number;
  onRefreshData?: () => void;
  onOpenAddCrop?: () => void;
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  currentRole,
  region,
  activeTab,
  onTabChange,
  onRegionChange,
  onUserChange,
  onOpenAuth,
  orderCount,
  onRefreshData,
  onOpenAddCrop,
  onToggleSidebar,
}) => {
  const [isDemoDropdownOpen, setIsDemoDropdownOpen] = useState(false);
  const [isRegionDropdownOpen, setIsRegionDropdownOpen] = useState(false);
  const { success, info } = useToast();

  const isIntl = region === 'INTERNATIONAL';

  const handleSwitchToFarmer = () => {
    if (isIntl) {
      onUserChange(DEMO_INTL_FARMER);
      onTabChange('farmer_dashboard');
      setIsDemoDropdownOpen(false);
      success('Switched to International Agri-Exporter (Kiran Patel)', 'Exporter Mode');
    } else {
      onUserChange(DEMO_FARMER);
      onTabChange('farmer_dashboard');
      setIsDemoDropdownOpen(false);
      success('Switched to Local Farmer (Kiran)', 'Farmer Mode');
    }
  };

  const handleSwitchToBuyer = () => {
    if (isIntl) {
      onUserChange(DEMO_INTL_BUYER);
      onTabChange('marketplace');
      setIsDemoDropdownOpen(false);
      success('Switched to Global Importer (Alexandre Dubois)', 'Importer Mode');
    } else {
      onUserChange(DEMO_BUYER);
      onTabChange('marketplace');
      setIsDemoDropdownOpen(false);
      success('Switched to Local Buyer (Priya Sharma)', 'Buyer Mode');
    }
  };

  const handleRegionSwitch = (newRegion: RegionType) => {
    onRegionChange(newRegion);
    StorageService.setRegion(newRegion);
    setIsRegionDropdownOpen(false);
    if (newRegion === 'INTERNATIONAL') {
      onUserChange(currentUser?.role === 'FARMER' ? DEMO_INTL_FARMER : DEMO_INTL_BUYER);
      info('Switched to International Cross-Border Trade Mode.', 'Global Portal');
    } else {
      onUserChange(currentUser?.role === 'FARMER' ? DEMO_FARMER : DEMO_BUYER);
      info('Switched to Local Domestic Farm-to-Fork Mode.', 'Local Portal');
    }
  };

  const handleResetData = () => {
    StorageService.resetDemoData();
    setIsDemoDropdownOpen(false);
    if (onRefreshData) onRefreshData();
    info('Sample products and orders restored to initial state.', 'Data Reset');
  };

  const handleLogout = () => {
    onUserChange(null);
    onTabChange('login');
    setIsDemoDropdownOpen(false);
    info('You have logged out.');
  };

  // Helper to generate breadcrumb label based on activeTab
  const getTabBreadcrumb = () => {
    switch (activeTab) {
      case 'farmer_dashboard':
        return isIntl ? 'Export Cargo Lots' : 'My Products';
      case 'farmer_orders':
        return isIntl ? 'Buyer Orders & B/L' : 'Received Orders';
      case 'port_logistics':
        return 'Port & Cold Chain Logistics';
      case 'phytosanitary_certs':
        return 'Phytosanitary & SGS Dossiers';
      case 'forex_analytics':
        return 'Forex & Currency Rates';
      case 'farmer_analytics':
        return 'Sales & Analytics';
      case 'marketplace':
        return isIntl ? 'Global Marketplace' : 'Marketplace';
      case 'compare_crops':
        return 'Compare Products';
      case 'buyer_orders':
        return isIntl ? 'Inbound Shipments' : 'My Orders';
      default:
        return 'Console';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Sidebar Toggle & Breadcrumb */}
          <div className="flex items-center gap-3 sm:gap-4">
            {onToggleSidebar && (
              <button
                onClick={onToggleSidebar}
                className="p-2 -ml-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors focus:outline-hidden cursor-pointer"
                aria-label="Toggle navigation menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            {/* Mobile Logo fallback */}
            <div className="flex items-center gap-2 md:hidden">
              <div className={`w-8 h-8 rounded-lg text-white flex items-center justify-center ${isIntl ? 'bg-blue-600' : 'bg-farm-600'}`}>
                {isIntl ? <Globe className="w-5 h-5" /> : <Sprout className="w-5 h-5" />}
              </div>
              <span className="font-extrabold text-stone-900 text-base">Farm2Fork</span>
            </div>

            {/* Breadcrumb Navigation Trail */}
            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-stone-500">
              <button
                onClick={() => onTabChange(currentUser?.role === 'FARMER' ? 'farmer_dashboard' : 'marketplace')}
                className="hover:text-stone-900 transition flex items-center gap-1 cursor-pointer"
              >
                <Home className="w-3.5 h-3.5 text-stone-400" />
                <span>Home</span>
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-stone-300" />
              <span className="text-stone-700 font-bold flex items-center gap-1">
                {isIntl ? (
                  <>
                    <Globe className="w-3.5 h-3.5 text-blue-600" />
                    <span>Global Trade Hub</span>
                  </>
                ) : (
                  <>
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Local Agri Gateway</span>
                  </>
                )}
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-stone-300" />
              <span className={`px-2 py-0.5 rounded-md border font-extrabold ${
                isIntl ? 'text-blue-800 bg-blue-50 border-blue-200' : 'text-farm-700 bg-farm-50 border-farm-200/80'
              }`}>
                {getTabBreadcrumb()}
              </span>
            </div>
          </div>

          {/* Right actions: Region Switcher + Add Action + Demo Switcher + Profile */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Top Region Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsRegionDropdownOpen(!isRegionDropdownOpen)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                  isIntl
                    ? 'bg-blue-50 border-blue-200 text-blue-900'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                }`}
                title="Trade Region Mode"
              >
                {isIntl ? <Globe className="w-3.5 h-3.5 text-blue-600" /> : <MapPin className="w-3.5 h-3.5 text-emerald-600" />}
                <span className="hidden sm:inline">{isIntl ? '🌐 Global Trade' : '🇮🇳 Local Trade'}</span>
                <ChevronDown className="w-3 h-3 text-stone-400" />
              </button>

              {isRegionDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsRegionDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-stone-200 p-1.5 z-50 animate-slide-up">
                    <button
                      onClick={() => handleRegionSwitch('LOCAL')}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                        !isIntl ? 'bg-emerald-50 text-emerald-900' : 'text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-emerald-600" />
                        <span>🇮🇳 Local Direct (INR ₹)</span>
                      </div>
                      {!isIntl && <Check className="w-4 h-4 text-emerald-600 font-bold" />}
                    </button>

                    <button
                      onClick={() => handleRegionSwitch('INTERNATIONAL')}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                        isIntl ? 'bg-blue-50 text-blue-900' : 'text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-blue-600" />
                        <span>🌐 Global Export (USD $)</span>
                      </div>
                      {isIntl && <Check className="w-4 h-4 text-blue-600 font-bold" />}
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Quick Add Product button when logged in as Farmer */}
            {currentUser && currentUser.role === 'FARMER' && onOpenAddCrop && (
              <button
                onClick={onOpenAddCrop}
                className={`hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-white text-xs font-bold shadow-xs transition cursor-pointer ${
                  isIntl ? 'bg-blue-600 hover:bg-blue-700' : 'bg-farm-600 hover:bg-farm-700'
                }`}
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>{isIntl ? '+ Add Export Lot' : '+ Add Crop'}</span>
              </button>
            )}

            {/* Quick Demo Switcher Pill */}
            <div className="relative">
              <button
                onClick={() => setIsDemoDropdownOpen(!isDemoDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-50 to-emerald-50 border border-amber-200/80 text-xs font-bold text-stone-800 hover:shadow-xs transition-all cursor-pointer"
                title="Quick Role Switcher"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                <span className="hidden md:inline text-stone-500 font-semibold">Role:</span>
                <span className="text-farm-700 font-extrabold">
                  {currentUser
                    ? isIntl
                      ? currentUser.role === 'FARMER' ? '🚢 Exporter' : '🌐 Importer'
                      : currentUser.role === 'FARMER' ? '👨‍🌾 Farmer' : '🛒 Buyer'
                    : 'Guest'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
              </button>

              {isDemoDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-stone-200 p-2 z-50 animate-slide-up">
                  <div className="px-3 py-2 border-b border-stone-100">
                    <p className="text-[11px] font-bold uppercase text-stone-400 tracking-wider">
                      Role Switcher ({isIntl ? 'Global' : 'Local'})
                    </p>
                    <p className="text-xs text-stone-600">Switch user context instantly:</p>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={handleSwitchToFarmer}
                      className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-3 transition-colors ${
                        currentUser?.role === 'FARMER' ? 'bg-farm-50 text-farm-900 font-bold' : 'hover:bg-stone-50 text-stone-700'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-farm-100 text-farm-700 flex items-center justify-center font-bold">
                        👨‍🌾
                      </div>
                      <div>
                        <div className="text-sm font-semibold leading-tight">
                          {isIntl ? 'Exporter View' : 'Farmer View'}
                        </div>
                        <div className="text-[11px] text-stone-500">
                          {isIntl ? 'Kiran Patel • Green Valley Global' : 'Kiran • Doddaballapura'}
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={handleSwitchToBuyer}
                      className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-3 transition-colors ${
                        currentUser?.role === 'BUYER' ? 'bg-blue-50 text-blue-900 font-bold' : 'hover:bg-stone-50 text-stone-700'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                        {isIntl ? '🚢' : '🛒'}
                      </div>
                      <div>
                        <div className="text-sm font-semibold leading-tight">
                          {isIntl ? 'Global Importer View' : 'Buyer View'}
                        </div>
                        <div className="text-[11px] text-stone-500">
                          {isIntl ? 'Alexandre Dubois • Rotterdam' : 'Priya Sharma • Indiranagar'}
                        </div>
                      </div>
                    </button>
                  </div>

                  <div className="pt-2 border-t border-stone-100">
                    <button
                      onClick={handleResetData}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 flex items-center gap-2 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-stone-500" />
                      <span>Reset Sample Database</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Logged in User Profile & Logout */}
            {currentUser && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 pl-2 border-l border-stone-200">
                  <img
                    src={currentUser.avatar || 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?auto=format&fit=crop&w=80&q=80'}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full object-cover border border-slate-300"
                  />
                  <div className="text-left hidden sm:block">
                    <div className="text-xs font-bold text-stone-900 leading-tight flex items-center gap-1">
                      {currentUser.name}
                      {currentUser.fpoMember && (
                        <span className="text-[9px] bg-farm-100 text-farm-800 px-1 rounded font-bold">FPO</span>
                      )}
                    </div>
                    <div className="text-[10px] text-stone-500 truncate max-w-[120px]">
                      {currentUser.country || currentUser.location.split(',')[0]}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg text-stone-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
