import React, { useState } from 'react';
import { User, Role } from '../../types';
import { DEMO_FARMER, DEMO_BUYER, StorageService } from '../../services/storage';
import {
  Sprout,
  ShoppingBag,
  Store,
  Package,
  Layers,
  LogOut,
  Sparkles,
  ChevronDown,
  Menu,
  X,
  RefreshCw,
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
}) => {
  const [isDemoDropdownOpen, setIsDemoDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { success, info } = useToast();

  const handleSwitchToFarmer = () => {
    onUserChange(DEMO_FARMER);
    onTabChange('farmer_dashboard');
    setIsDemoDropdownOpen(false);
    setIsMobileMenuOpen(false);
    success('Switched to Demo Farmer (Kiran - Green Valley FPO)', 'Farmer Account');
  };

  const handleSwitchToBuyer = () => {
    onUserChange(DEMO_BUYER);
    onTabChange('marketplace');
    setIsDemoDropdownOpen(false);
    setIsMobileMenuOpen(false);
    success('Switched to Demo Buyer (Priya Sharma - Indiranagar)', 'Buyer Account');
  };

  const handleResetData = () => {
    StorageService.resetDemoData();
    setIsDemoDropdownOpen(false);
    setIsMobileMenuOpen(false);
    if (onRefreshData) onRefreshData();
    info('Sample products and orders restored to initial state.', 'Data Reset');
  };

  const handleLogout = () => {
    onUserChange(null);
    onTabChange('landing');
    setIsDemoDropdownOpen(false);
    setIsMobileMenuOpen(false);
    info('You have logged out.');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => onTabChange(currentUser ? (currentUser.role === 'FARMER' ? 'farmer_dashboard' : 'marketplace') : 'landing')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-farm-700 to-farm-500 text-white flex items-center justify-center shadow-md shadow-farm-600/20 group-hover:scale-105 transition-transform">
                <Sprout className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight text-stone-900 flex items-center gap-1.5">
                  Farm<span className="text-farm-600">2</span>Fork
                </span>
                <span className="block text-[11px] font-medium text-stone-500 -mt-1 hidden sm:block">
                  From Farm. Directly to You.
                </span>
              </div>
            </button>

            {/* Role Nav Tabs (Desktop) */}
            {currentUser && (
              <nav className="hidden md:flex items-center gap-1 ml-4 pl-4 border-l border-stone-200">
                {currentUser.role === 'FARMER' ? (
                  <>
                    <button
                      onClick={() => onTabChange('farmer_dashboard')}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                        activeTab === 'farmer_dashboard'
                          ? 'bg-farm-50 text-farm-800 border border-farm-200/80 font-bold'
                          : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                      }`}
                    >
                      <Layers className="w-4 h-4 text-farm-600" />
                      <span>My Products</span>
                    </button>

                    <button
                      onClick={() => onTabChange('farmer_orders')}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors relative ${
                        activeTab === 'farmer_orders'
                          ? 'bg-farm-50 text-farm-800 border border-farm-200/80 font-bold'
                          : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                      }`}
                    >
                      <Package className="w-4 h-4 text-farm-600" />
                      <span>Received Orders</span>
                      {orderCount > 0 && (
                        <span className="px-1.5 py-0.5 min-w-[20px] text-center rounded-full bg-farm-600 text-white text-[11px] font-extrabold leading-none">
                          {orderCount}
                        </span>
                      )}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => onTabChange('marketplace')}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                        activeTab === 'marketplace'
                          ? 'bg-farm-50 text-farm-800 border border-farm-200/80 font-bold'
                          : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                      }`}
                    >
                      <Store className="w-4 h-4 text-farm-600" />
                      <span>Marketplace</span>
                    </button>

                    <button
                      onClick={() => onTabChange('compare_crops')}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                        activeTab === 'compare_crops'
                          ? 'bg-farm-50 text-farm-800 border border-farm-200/80 font-bold'
                          : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                      }`}
                    >
                      <Layers className="w-4 h-4 text-farm-600" />
                      <span>Compare Products</span>
                    </button>

                    <button
                      onClick={() => onTabChange('buyer_orders')}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors relative ${
                        activeTab === 'buyer_orders'
                          ? 'bg-farm-50 text-farm-800 border border-farm-200/80 font-bold'
                          : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                      }`}
                    >
                      <ShoppingBag className="w-4 h-4 text-farm-600" />
                      <span>My Orders</span>
                      {orderCount > 0 && (
                        <span className="px-1.5 py-0.5 min-w-[20px] text-center rounded-full bg-farm-600 text-white text-[11px] font-extrabold leading-none">
                          {orderCount}
                        </span>
                      )}
                    </button>
                  </>
                )}
              </nav>
            )}
          </div>

          {/* Right actions: Demo Switcher + Profile + Auth Buttons */}
          <div className="flex items-center gap-3">
            {/* Quick Demo Switcher Pill */}
            <div className="relative">
              <button
                onClick={() => setIsDemoDropdownOpen(!isDemoDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-50 to-emerald-50 border border-amber-200/80 text-xs font-bold text-stone-800 hover:shadow-sm transition-all"
                title="Quick Demo Role Switcher"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                <span className="hidden sm:inline">Role:</span>
                <span className="text-farm-700 font-extrabold">
                  {currentUser ? (currentUser.role === 'FARMER' ? '👨‍🌾 Farmer' : '🛒 Buyer') : 'Select Role'}
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
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 flex items-center gap-2"
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
                <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-stone-200">
                  <img
                    src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80'}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full object-cover border border-farm-500/30"
                  />
                  <div className="text-left">
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
                  className="p-2 rounded-lg text-stone-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenAuth('FARMER')}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-farm-700 bg-farm-50 hover:bg-farm-100 border border-farm-200 transition-colors"
                >
                  Farmer Login
                </button>
                <button
                  onClick={() => onOpenAuth('BUYER')}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-farm-600 hover:bg-farm-700 shadow-sm transition-colors"
                >
                  Buyer Login
                </button>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-stone-600 hover:bg-stone-100"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-stone-200 space-y-1 animate-slide-up">
            {currentUser && currentUser.role === 'FARMER' && (
              <>
                <button
                  onClick={() => {
                    onTabChange('farmer_dashboard');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm font-semibold rounded-lg text-stone-700 hover:bg-stone-100 flex items-center gap-2"
                >
                  <Layers className="w-4 h-4 text-farm-600" />
                  <span>My Products</span>
                </button>
                <button
                  onClick={() => {
                    onTabChange('farmer_orders');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm font-semibold rounded-lg text-stone-700 hover:bg-stone-100 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-farm-600" />
                    <span>Received Orders</span>
                  </div>
                  {orderCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-farm-600 text-white text-xs font-bold">
                      {orderCount}
                    </span>
                  )}
                </button>
              </>
            )}

            {currentUser && currentUser.role === 'BUYER' && (
              <>
                <button
                  onClick={() => {
                    onTabChange('marketplace');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm font-semibold rounded-lg text-stone-700 hover:bg-stone-100 flex items-center gap-2"
                >
                  <Store className="w-4 h-4 text-farm-600" />
                  <span>Marketplace</span>
                </button>
                <button
                  onClick={() => {
                    onTabChange('compare_crops');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm font-semibold rounded-lg text-stone-700 hover:bg-stone-100 flex items-center gap-2"
                >
                  <Layers className="w-4 h-4 text-farm-600" />
                  <span>Compare Products</span>
                </button>
                <button
                  onClick={() => {
                    onTabChange('buyer_orders');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm font-semibold rounded-lg text-stone-700 hover:bg-stone-100 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-farm-600" />
                    <span>My Orders</span>
                  </div>
                  {orderCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-farm-600 text-white text-xs font-bold">
                      {orderCount}
                    </span>
                  )}
                </button>
              </>
            )}

            {!currentUser && (
              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={() => {
                    onOpenAuth('FARMER');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-2 text-center text-sm font-bold text-farm-700 bg-farm-50 rounded-lg"
                >
                  Login as Farmer
                </button>
                <button
                  onClick={() => {
                    onOpenAuth('BUYER');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-2 text-center text-sm font-bold text-white bg-farm-600 rounded-lg"
                >
                  Login as Buyer
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
