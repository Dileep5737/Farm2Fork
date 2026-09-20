import React from 'react';
import { User, Role } from '../../types';
import { DEMO_FARMER, DEMO_BUYER, StorageService } from '../../services/storage';
import {
  Sprout,
  Layers,
  Package,
  PlusCircle,
  BarChart3,
  Store,
  ShoppingBag,
  LogOut,
  Sparkles,
  RefreshCw,
  X,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface SidebarProps {
  currentUser: User | null;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onUserChange: (user: User | null) => void;
  onOpenAuth: (initialRole?: Role) => void;
  cropCount: number;
  orderCount: number;
  onRefreshData?: () => void;
  onOpenAddCrop?: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentUser,
  activeTab,
  onTabChange,
  onUserChange,
  onOpenAuth,
  cropCount,
  orderCount,
  onRefreshData,
  onOpenAddCrop,
  isOpenMobile,
  onCloseMobile,
}) => {
  const { success, info } = useToast();

  const handleSwitchToFarmer = () => {
    onUserChange(DEMO_FARMER);
    onTabChange('farmer_dashboard');
    onCloseMobile();
    success('Switched to Farmer Console (Kiran - Green Valley FPO)', 'Farmer Mode');
  };

  const handleSwitchToBuyer = () => {
    onUserChange(DEMO_BUYER);
    onTabChange('marketplace');
    onCloseMobile();
    success('Switched to Buyer Marketplace (Priya Sharma)', 'Buyer Mode');
  };

  const handleResetData = () => {
    StorageService.resetDemoData();
    onCloseMobile();
    if (onRefreshData) onRefreshData();
    info('Sample products and orders restored to initial state.', 'Data Reset');
  };

  const handleLogout = () => {
    onUserChange(null);
    onTabChange('login');
    onCloseMobile();
    info('You have logged out.');
  };

  const navItemClass = (isActive: boolean) =>
    `w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group cursor-pointer ${
      isActive
        ? 'bg-gradient-to-r from-rose-600 to-rose-700 text-white shadow-lg shadow-rose-900/30 font-bold translate-x-1'
        : 'text-slate-300 hover:text-white hover:bg-slate-800/70 hover:translate-x-0.5'
    }`;

  const role = currentUser?.role || 'BUYER';

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden animate-fade-in"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-72 bg-[#0c1322] border-r border-slate-800/80 flex flex-col justify-between text-slate-200 transition-transform duration-300 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Top Section: Brand + User Info */}
        <div className="p-5 pb-3 border-b border-slate-800/60">
          {/* Brand Header */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                onTabChange(currentUser ? (currentUser.role === 'FARMER' ? 'farmer_dashboard' : 'marketplace') : 'login');
                onCloseMobile();
              }}
              className="flex items-center gap-3 text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-farm-600 via-emerald-500 to-teal-400 text-white flex items-center justify-center shadow-lg shadow-farm-600/30 group-hover:scale-105 transition-transform">
                <Sprout className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-black tracking-tight text-white font-sans">
                    Farm<span className="text-farm-400">2</span>Fork
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase bg-farm-500/20 text-farm-300 border border-farm-500/30">
                    Direct
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">
                  Agri Supply & Commerce
                </p>
              </div>
            </button>

            {/* Mobile close button */}
            <button
              onClick={onCloseMobile}
              className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Profile Card */}
          {currentUser ? (
            <div className="mt-5 p-3 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center gap-3">
              <div className="relative">
                {currentUser.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-10 h-10 rounded-xl object-cover border border-farm-500/40"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-farm-700 to-slate-800 text-white flex items-center justify-center font-bold text-base border border-slate-700">
                    {currentUser.name.charAt(0)}
                  </div>
                )}
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#0c1322]" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-white truncate flex items-center gap-1">
                  {currentUser.name}
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span
                    className={`inline-block text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase ${
                      currentUser.role === 'FARMER'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    }`}
                  >
                    {currentUser.role === 'FARMER' ? '👨‍🌾 Farmer Portal' : '🛒 Buyer Portal'}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-4 p-3 rounded-2xl bg-slate-900 border border-slate-800 text-center">
              <p className="text-xs text-slate-400 mb-2">Sign in to manage operations</p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    onOpenAuth('FARMER');
                    onCloseMobile();
                  }}
                  className="flex-1 py-1.5 px-2 text-[11px] font-bold bg-farm-600 hover:bg-farm-700 text-white rounded-lg transition"
                >
                  Farmer
                </button>
                <button
                  onClick={() => {
                    onOpenAuth('BUYER');
                    onCloseMobile();
                  }}
                  className="flex-1 py-1.5 px-2 text-[11px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition"
                >
                  Buyer
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Middle Navigation Section */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          {/* Main Menu Label */}
          <div>
            <div className="px-2 mb-2 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
              Main Menu
            </div>

            <nav className="space-y-1.5">
              {/* Farmer Menu Items */}
              {role === 'FARMER' && (
                <>
                  <button
                    onClick={() => {
                      onTabChange('farmer_dashboard');
                      onCloseMobile();
                    }}
                    className={navItemClass(activeTab === 'farmer_dashboard')}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-lg ${activeTab === 'farmer_dashboard' ? 'bg-white/20' : 'bg-slate-800 text-farm-400'}`}>
                        <Layers className="w-4 h-4" />
                      </div>
                      <span>My Products</span>
                    </div>
                    {cropCount > 0 && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                          activeTab === 'farmer_dashboard'
                            ? 'bg-white text-rose-700'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {cropCount}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      onTabChange('farmer_orders');
                      onCloseMobile();
                    }}
                    className={navItemClass(activeTab === 'farmer_orders')}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-lg ${activeTab === 'farmer_orders' ? 'bg-white/20' : 'bg-slate-800 text-amber-400'}`}>
                        <Package className="w-4 h-4" />
                      </div>
                      <span>Received Orders</span>
                    </div>
                    {orderCount > 0 ? (
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                          activeTab === 'farmer_orders'
                            ? 'bg-white text-rose-700'
                            : 'bg-farm-600 text-white'
                        }`}
                      >
                        {orderCount}
                      </span>
                    ) : null}
                  </button>

                  <button
                    onClick={() => {
                      onTabChange('farmer_analytics');
                      onCloseMobile();
                    }}
                    className={navItemClass(activeTab === 'farmer_analytics')}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-lg ${activeTab === 'farmer_analytics' ? 'bg-white/20' : 'bg-slate-800 text-teal-400'}`}>
                        <BarChart3 className="w-4 h-4" />
                      </div>
                      <span>Sales & Analytics</span>
                    </div>
                  </button>

                  {/* Add Crop Action Button inside Farmer Menu */}
                  {onOpenAddCrop && (
                    <div className="pt-2">
                      <button
                        onClick={() => {
                          onOpenAddCrop();
                          onCloseMobile();
                        }}
                        className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-farm-600/20 hover:bg-farm-600/30 border border-farm-500/40 text-farm-300 hover:text-white font-bold text-xs transition-all cursor-pointer shadow-sm group"
                      >
                        <PlusCircle className="w-4 h-4 text-farm-400 group-hover:rotate-90 transition-transform" />
                        <span>+ Add New Crop</span>
                      </button>
                    </div>
                  )}
                </>
              )}

              {/* Buyer Menu Items */}
              {role === 'BUYER' && (
                <>
                  <button
                    onClick={() => {
                      onTabChange('marketplace');
                      onCloseMobile();
                    }}
                    className={navItemClass(activeTab === 'marketplace')}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-lg ${activeTab === 'marketplace' ? 'bg-white/20' : 'bg-slate-800 text-farm-400'}`}>
                        <Store className="w-4 h-4" />
                      </div>
                      <span>Marketplace</span>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      onTabChange('compare_crops');
                      onCloseMobile();
                    }}
                    className={navItemClass(activeTab === 'compare_crops')}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-lg ${activeTab === 'compare_crops' ? 'bg-white/20' : 'bg-slate-800 text-blue-400'}`}>
                        <Layers className="w-4 h-4" />
                      </div>
                      <span>Compare Products</span>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      onTabChange('buyer_orders');
                      onCloseMobile();
                    }}
                    className={navItemClass(activeTab === 'buyer_orders')}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-lg ${activeTab === 'buyer_orders' ? 'bg-white/20' : 'bg-slate-800 text-purple-400'}`}>
                        <ShoppingBag className="w-4 h-4" />
                      </div>
                      <span>My Orders</span>
                    </div>
                    {orderCount > 0 && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                          activeTab === 'buyer_orders'
                            ? 'bg-white text-rose-700'
                            : 'bg-farm-600 text-white'
                        }`}
                      >
                        {orderCount}
                      </span>
                    )}
                  </button>
                </>
              )}
            </nav>
          </div>

          {/* Quick Stats Widget in Sidebar */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800/80">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5 font-medium">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-farm-400" />
                <span>Verified Direct Agri</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-bold">100% Direct</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              {role === 'FARMER'
                ? 'Zero commission direct buyer orders with escrow payment protection.'
                : 'Direct farm-gate pricing with freshness guarantee and location tracking.'}
            </p>
          </div>
        </div>

        {/* Bottom Section: Role Switcher & Logout */}
        <div className="p-4 border-t border-slate-800/80 space-y-2 bg-[#090e1a]">
          <div className="flex items-center justify-between gap-1 text-[11px]">
            <span className="text-slate-400 font-bold">Quick Switch</span>
            <button
              onClick={handleResetData}
              title="Reset Sample Data"
              className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 flex items-center gap-1 text-[10px]"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={handleSwitchToFarmer}
              className={`py-1.5 px-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                role === 'FARMER'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>👨‍🌾</span>
              <span>Farmer</span>
            </button>

            <button
              onClick={handleSwitchToBuyer}
              className={`py-1.5 px-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                role === 'BUYER'
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                  : 'bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>🛒</span>
              <span>Buyer</span>
            </button>
          </div>

          {currentUser && (
            <button
              onClick={handleLogout}
              className="w-full mt-2 py-2 px-3 rounded-xl bg-slate-800/40 hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 border border-slate-800 hover:border-rose-900/50 flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
