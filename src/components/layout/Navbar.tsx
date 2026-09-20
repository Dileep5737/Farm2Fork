import React, { useState } from 'react';
import { User, Role } from '../../types';
import { DEMO_FARMER, DEMO_BUYER, StorageService } from '../../services/storage';
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
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface NavbarProps {
  currentUser: User | null;
  currentRole: Role;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onUserChange: (user: User | null) => void;
  onOpenAuth: (initialRole?: Role) => void;
  orderCount: number;
  onRefreshData?: () => void;
  onOpenAddCrop?: () => void;
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeTab,
  onTabChange,
  onUserChange,
  onOpenAuth,
  orderCount,
  onRefreshData,
  onOpenAddCrop,
  onToggleSidebar,
}) => {
  const [isDemoDropdownOpen, setIsDemoDropdownOpen] = useState(false);
  const { success, info } = useToast();

  const handleSwitchToFarmer = () => {
    onUserChange(DEMO_FARMER);
    onTabChange('farmer_dashboard');
    setIsDemoDropdownOpen(false);
    success('Switched to Demo Farmer (Kiran - Green Valley FPO)', 'Farmer Account');
  };

  const handleSwitchToBuyer = () => {
    onUserChange(DEMO_BUYER);
    onTabChange('marketplace');
    setIsDemoDropdownOpen(false);
    success('Switched to Demo Buyer (Priya Sharma - Indiranagar)', 'Buyer Account');
  };

  const handleResetData = () => {
    StorageService.resetDemoData();
    setIsDemoDropdownOpen(false);
    if (onRefreshData) onRefreshData();
    info('Sample products and orders restored to initial state.', 'Data Reset');
  };

  const handleLogout = () => {
    onUserChange(null);
    onTabChange('landing');
    setIsDemoDropdownOpen(false);
    info('You have logged out.');
  };

  // Helper to generate breadcrumb label based on activeTab
  const getTabBreadcrumb = () => {
    switch (activeTab) {
      case 'farmer_dashboard':
        return 'My Products';
      case 'farmer_orders':
        return 'Received Orders';
      case 'farmer_analytics':
        return 'Sales & Analytics';
      case 'marketplace':
        return 'Marketplace';
      case 'compare_crops':
        return 'Compare Products';
      case 'buyer_orders':
        return 'My Orders';
      default:
        return 'Dashboard';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Sidebar Toggle & Breadcrumb */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Sidebar toggle for mobile & desktop */}
            {onToggleSidebar && (
              <button
                onClick={onToggleSidebar}
                className="p-2 -ml-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors focus:outline-hidden"
                aria-label="Toggle navigation menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            {/* Mobile Logo for landing or fallback */}
            <div className="flex items-center gap-2 md:hidden">
              <div className="w-8 h-8 rounded-lg bg-farm-600 text-white flex items-center justify-center">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-stone-900 text-base">Farm2Fork</span>
            </div>

            {/* Breadcrumb Navigation Trail */}
            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-stone-500">
              <button
                onClick={() => onTabChange(currentUser?.role === 'FARMER' ? 'farmer_dashboard' : 'marketplace')}
                className="hover:text-stone-900 transition flex items-center gap-1"
              >
                <Home className="w-3.5 h-3.5 text-stone-400" />
                <span>Home</span>
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-stone-300" />
              <span className="text-stone-700 font-bold">
                {currentUser?.role === 'FARMER' ? 'Farmer Console' : 'Buyer Hub'}
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-stone-300" />
              <span className="text-farm-700 bg-farm-50 px-2 py-0.5 rounded-md border border-farm-200/80 font-extrabold">
                {getTabBreadcrumb()}
              </span>
            </div>
          </div>

          {/* Right actions: Add Product CTA + Demo Switcher + Profile + Auth Buttons */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Quick Add Product button when logged in as Farmer */}
            {currentUser && currentUser.role === 'FARMER' && onOpenAddCrop && (
              <button
                onClick={onOpenAddCrop}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-farm-600 hover:bg-farm-700 text-white text-xs font-bold shadow-xs transition cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Add Crop</span>
              </button>
            )}

            {/* Quick Demo Switcher Pill */}
            <div className="relative">
              <button
                onClick={() => setIsDemoDropdownOpen(!isDemoDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-50 to-emerald-50 border border-amber-200/80 text-xs font-bold text-stone-800 hover:shadow-xs transition-all"
                title="Quick Demo Role Switcher"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                <span className="hidden md:inline text-stone-500 font-semibold">Mode:</span>
                <span className="text-farm-700 font-extrabold">
                  {currentUser ? (currentUser.role === 'FARMER' ? '👨‍🌾 Farmer' : '🛒 Buyer') : 'Guest'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
              </button>

              {/* Demo Switcher Dropdown */}
              {isDemoDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-stone-200 p-2 z-50 animate-slide-up">
                  <div className="px-3 py-2 border-b border-stone-100">
                    <p className="text-[11px] font-bold uppercase text-stone-400 tracking-wider">
                      Role Switcher
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
                        <div className="text-sm font-semibold leading-tight">Farmer View</div>
                        <div className="text-[11px] text-stone-500">Kiran • Green Valley</div>
                      </div>
                    </button>

                    <button
                      onClick={handleSwitchToBuyer}
                      className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-3 transition-colors ${
                        currentUser?.role === 'BUYER' ? 'bg-blue-50 text-blue-900 font-bold' : 'hover:bg-stone-50 text-stone-700'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                        🛒
                      </div>
                      <div>
                        <div className="text-sm font-semibold leading-tight">Buyer View</div>
                        <div className="text-[11px] text-stone-500">Priya Sharma • Indiranagar</div>
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
            {currentUser ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 pl-2 border-l border-stone-200">
                  <img
                    src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80'}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full object-cover border border-farm-500/30"
                  />
                  <div className="text-left hidden sm:block">
                    <div className="text-xs font-bold text-stone-900 leading-tight flex items-center gap-1">
                      {currentUser.name}
                      {currentUser.fpoMember && (
                        <span className="text-[9px] bg-farm-100 text-farm-800 px-1 rounded font-bold">FPO</span>
                      )}
                    </div>
                    <div className="text-[10px] text-stone-500">{currentUser.location.split(',')[0]}</div>
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
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenAuth('FARMER')}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-farm-700 bg-farm-50 hover:bg-farm-100 border border-farm-200 transition-colors cursor-pointer"
                >
                  Farmer Login
                </button>
                <button
                  onClick={() => onOpenAuth('BUYER')}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-farm-600 hover:bg-farm-700 shadow-xs transition-colors cursor-pointer"
                >
                  Buyer Login
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
