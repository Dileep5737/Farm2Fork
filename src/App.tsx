import React, { useState, useCallback } from 'react';
import { CropListing, Order, Role, User, RegionType, ExportListing, ExportOrder } from './types';
import { DEMO_BUYER, StorageService } from './services/storage';
import { ToastProvider } from './context/ToastContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { LoginPage } from './components/auth/LoginPage';
import { FarmerDashboard } from './components/farmer/FarmerDashboard';
import { BuyerMarketplace } from './components/buyer/BuyerMarketplace';
import { BuyerOrders } from './components/buyer/BuyerOrders';
import { InternationalFarmerDashboard } from './components/farmer/InternationalFarmerDashboard';
import { InternationalBuyerMarketplace } from './components/buyer/InternationalBuyerMarketplace';
import { InternationalBuyerOrders } from './components/buyer/InternationalBuyerOrders';
import { CropDetailsModal } from './components/buyer/CropDetailsModal';
import { BuyOrderModal } from './components/buyer/BuyOrderModal';

export const AppContent: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => StorageService.getCurrentUser());
  const [region, setRegion] = useState<RegionType>(() => StorageService.getRegion());
  const [crops, setCrops] = useState<CropListing[]>(() => StorageService.getCrops());
  const [orders, setOrders] = useState<Order[]>(() => StorageService.getOrders());
  const [exportListings, setExportListings] = useState<ExportListing[]>(() => StorageService.getExportListings());
  const [exportOrders, setExportOrders] = useState<ExportOrder[]>(() => StorageService.getExportOrders());
  const [activeTab, setActiveTab] = useState<string>(() => {
    const user = StorageService.getCurrentUser();
    return user ? (user.role === 'FARMER' ? 'farmer_dashboard' : 'marketplace') : 'login';
  });

  // Mobile sidebar drawer state
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Login flow state
  const [authInitialRole, setAuthInitialRole] = useState<Role>('FARMER');
  const [selectedCropForDetails, setSelectedCropForDetails] = useState<CropListing | null>(null);
  const [selectedCropForBuy, setSelectedCropForBuy] = useState<CropListing | null>(null);
  const [isAddCropModalOpen, setIsAddCropModalOpen] = useState(false);

  const refreshData = useCallback(() => {
    setCrops(StorageService.getCrops());
    setOrders(StorageService.getOrders());
    setExportListings(StorageService.getExportListings());
    setExportOrders(StorageService.getExportOrders());
  }, []);

  const handleUserChange = (user: User | null) => {
    setCurrentUser(user);
    StorageService.setCurrentUser(user);
    if (user?.region) {
      setRegion(user.region);
      StorageService.setRegion(user.region);
    }
    refreshData();
  };

  const handleRegionChange = (newRegion: RegionType) => {
    setRegion(newRegion);
    StorageService.setRegion(newRegion);
    refreshData();
  };

  const handleOpenAuth = (initialRole: Role = 'FARMER') => {
    setAuthInitialRole(initialRole);
    setActiveTab('login');
  };

  // Farmer listing count
  const farmerCropCount = currentUser
    ? region === 'INTERNATIONAL'
      ? exportListings.filter(
          (c) =>
            c.farmerId === currentUser.id ||
            c.farmerName.toLowerCase().includes(currentUser.name.toLowerCase().split(' ')[0])
        ).length
      : crops.filter(
          (c) =>
            c.farmerId === currentUser.id ||
            c.farmerName.toLowerCase().includes(currentUser.name.toLowerCase().split(' ')[0])
        ).length
    : region === 'INTERNATIONAL' ? exportListings.length : crops.length;

  // Order count for badge (relevant for farmer or buyer)
  const relevantOrderCount = currentUser
    ? region === 'INTERNATIONAL'
      ? currentUser.role === 'FARMER'
        ? exportOrders.filter(
            (o) =>
              o.farmerId === currentUser.id ||
              o.farmerName.toLowerCase().includes(currentUser.name.toLowerCase().split(' ')[0])
          ).length
        : exportOrders.filter(
            (o) =>
              o.buyerId === currentUser.id ||
              o.buyerName.toLowerCase().includes(currentUser.name.toLowerCase().split(' ')[0])
          ).length
      : currentUser.role === 'FARMER'
        ? orders.filter(
            (o) =>
              o.farmerId === currentUser.id ||
              o.farmerName.toLowerCase().includes(currentUser.name.toLowerCase().split(' ')[0])
          ).length
        : orders.filter(
            (o) =>
              o.buyerId === currentUser.id ||
              o.buyerName.toLowerCase().includes(currentUser.name.toLowerCase().split(' ')[0])
          ).length
    : 0;

  // Render Full Screen Login Page directly if not logged in or activeTab === 'login'
  if (!currentUser || activeTab === 'login') {
    return (
      <LoginPage
        initialRole={authInitialRole}
        onBackToHome={() => {
          if (currentUser) {
            setActiveTab(currentUser.role === 'FARMER' ? 'farmer_dashboard' : 'marketplace');
          }
        }}
        onSuccess={(user) => {
          handleUserChange(user);
          setActiveTab(user.role === 'FARMER' ? 'farmer_dashboard' : 'marketplace');
        }}
      />
    );
  }

  return (
    <div className="flex h-screen bg-stone-50 overflow-hidden font-sans selection:bg-farm-200 selection:text-farm-900">
      {/* 1. Left Vertical Navigation Sidebar */}
      <Sidebar
        currentUser={currentUser}
        activeTab={activeTab}
        region={region}
        onTabChange={setActiveTab}
        onRegionChange={handleRegionChange}
        onUserChange={handleUserChange}
        onOpenAuth={handleOpenAuth}
        cropCount={farmerCropCount}
        orderCount={relevantOrderCount}
        onRefreshData={refreshData}
        onOpenAddCrop={() => {
          setActiveTab('farmer_dashboard');
          setIsAddCropModalOpen(true);
        }}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* 2. Right Main Layout Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header Bar */}
        <Navbar
          currentUser={currentUser}
          currentRole={currentUser?.role || 'BUYER'}
          region={region}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onRegionChange={handleRegionChange}
          onUserChange={handleUserChange}
          onOpenAuth={handleOpenAuth}
          orderCount={relevantOrderCount}
          onRefreshData={refreshData}
          onOpenAddCrop={() => {
            setActiveTab('farmer_dashboard');
            setIsAddCropModalOpen(true);
          }}
          onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        />

        {/* Scrollable View Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {/* ==================== INTERNATIONAL MODE ==================== */}
          {region === 'INTERNATIONAL' && (
            <>
              {/* International Farmer / Exporter Views */}
              {currentUser.role === 'FARMER' && (
                <InternationalFarmerDashboard
                  farmer={currentUser}
                  exportListings={exportListings}
                  exportOrders={exportOrders}
                  onRefreshData={refreshData}
                  activeSection={
                    activeTab === 'farmer_orders'
                      ? 'export_orders'
                      : activeTab === 'port_logistics'
                      ? 'port_logistics'
                      : activeTab === 'phytosanitary_certs'
                      ? 'phytosanitary_certs'
                      : activeTab === 'forex_analytics'
                      ? 'forex_analytics'
                      : 'export_lots'
                  }
                  isAddModalOpenInitially={isAddCropModalOpen}
                  onCloseAddModal={() => setIsAddCropModalOpen(false)}
                />
              )}

              {/* International Buyer / Importer Views */}
              {currentUser.role === 'BUYER' && (
                <>
                  {(activeTab === 'marketplace' || activeTab === 'compare_crops') && (
                    <InternationalBuyerMarketplace
                      buyer={currentUser}
                      exportListings={exportListings}
                      onRefreshData={refreshData}
                      onNavigateToOrders={() => setActiveTab('buyer_orders')}
                    />
                  )}

                  {activeTab === 'buyer_orders' && (
                    <InternationalBuyerOrders
                      buyer={currentUser}
                      exportOrders={exportOrders}
                      onExploreMore={() => setActiveTab('marketplace')}
                    />
                  )}
                </>
              )}
            </>
          )}

          {/* ==================== LOCAL DOMESTIC MODE ==================== */}
          {region === 'LOCAL' && (
            <>
              {/* Local Farmer Views */}
              {currentUser.role === 'FARMER' && (
                <>
                  {activeTab === 'farmer_dashboard' && (
                    <FarmerDashboard
                      farmer={currentUser}
                      crops={crops}
                      orders={orders}
                      onRefreshData={refreshData}
                      onOpenCropDetails={(c) => setSelectedCropForDetails(c)}
                      initialTab="my_crops"
                      isAddModalOpenInitially={isAddCropModalOpen}
                      onCloseAddModal={() => setIsAddCropModalOpen(false)}
                    />
                  )}
                  {activeTab === 'farmer_orders' && (
                    <FarmerDashboard
                      farmer={currentUser}
                      crops={crops}
                      orders={orders}
                      onRefreshData={refreshData}
                      onOpenCropDetails={(c) => setSelectedCropForDetails(c)}
                      initialTab="orders"
                    />
                  )}
                  {activeTab === 'farmer_analytics' && (
                    <FarmerDashboard
                      farmer={currentUser}
                      crops={crops}
                      orders={orders}
                      onRefreshData={refreshData}
                      onOpenCropDetails={(c) => setSelectedCropForDetails(c)}
                      initialTab="analytics"
                    />
                  )}
                </>
              )}

              {/* Local Buyer Views */}
              {currentUser.role === 'BUYER' && (
                <>
                  {activeTab === 'marketplace' && (
                    <BuyerMarketplace
                      buyer={currentUser}
                      crops={crops}
                      onRefreshData={refreshData}
                      onNavigateToOrders={() => setActiveTab('buyer_orders')}
                    />
                  )}

                  {activeTab === 'compare_crops' && (
                    <BuyerMarketplace
                      buyer={currentUser}
                      crops={crops}
                      onRefreshData={refreshData}
                      onNavigateToOrders={() => setActiveTab('buyer_orders')}
                      forceCompareView={true}
                    />
                  )}

                  {activeTab === 'buyer_orders' && (
                    <BuyerOrders
                      buyer={currentUser}
                      orders={orders}
                      onExploreMore={() => setActiveTab('marketplace')}
                    />
                  )}
                </>
              )}
            </>
          )}
        </main>
      </div>

      {/* Global Product Details Modal (Local Mode) */}
      {selectedCropForDetails && (
        <CropDetailsModal
          crop={selectedCropForDetails}
          buyer={currentUser || DEMO_BUYER}
          isOpen={!!selectedCropForDetails}
          onClose={() => setSelectedCropForDetails(null)}
          onBuyNow={(c) => {
            setSelectedCropForDetails(null);
            setSelectedCropForBuy(c);
          }}
        />
      )}

      {/* Global Buy Order Modal (Local Mode) */}
      {selectedCropForBuy && (
        <BuyOrderModal
          crop={selectedCropForBuy}
          buyer={currentUser || DEMO_BUYER}
          isOpen={!!selectedCropForBuy}
          onClose={() => setSelectedCropForBuy(null)}
          onOrderSuccess={() => {
            refreshData();
            setActiveTab('buyer_orders');
          }}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}
