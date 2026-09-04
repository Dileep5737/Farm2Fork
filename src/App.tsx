import React, { useState, useCallback } from 'react';
import { CropListing, Order, Role, User } from './types';
import { DEMO_BUYER, DEMO_FARMER, StorageService } from './services/storage';
import { ToastProvider } from './context/ToastContext';
import { Navbar } from './components/layout/Navbar';
import { LandingPage } from './components/landing/LandingPage';
import { AuthModal } from './components/auth/AuthModal';
import { FarmerDashboard } from './components/farmer/FarmerDashboard';
import { BuyerMarketplace } from './components/buyer/BuyerMarketplace';
import { BuyerOrders } from './components/buyer/BuyerOrders';
import { CropDetailsModal } from './components/buyer/CropDetailsModal';
import { BuyOrderModal } from './components/buyer/BuyOrderModal';

export const AppContent: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => StorageService.getCurrentUser());
  const [crops, setCrops] = useState<CropListing[]>(() => StorageService.getCrops());
  const [orders, setOrders] = useState<Order[]>(() => StorageService.getOrders());
  const [activeTab, setActiveTab] = useState<string>(() => {
    const user = StorageService.getCurrentUser();
    return user ? (user.role === 'FARMER' ? 'farmer_dashboard' : 'marketplace') : 'landing';
  });

  // Modal states
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authInitialRole, setAuthInitialRole] = useState<Role>('FARMER');
  const [selectedCropForDetails, setSelectedCropForDetails] = useState<CropListing | null>(null);
  const [selectedCropForBuy, setSelectedCropForBuy] = useState<CropListing | null>(null);
  const [isAddCropModalOpen, setIsAddCropModalOpen] = useState(false);

  const refreshData = useCallback(() => {
    setCrops(StorageService.getCrops());
    setOrders(StorageService.getOrders());
  }, []);

  const handleUserChange = (user: User | null) => {
    setCurrentUser(user);
    StorageService.setCurrentUser(user);
    refreshData();
  };

  const handleOpenAuth = (initialRole: Role = 'FARMER') => {
    setAuthInitialRole(initialRole);
    setIsAuthModalOpen(true);
  };

  const handleLandingLoginAs = (role: Role) => {
    const demoUser = role === 'FARMER' ? DEMO_FARMER : DEMO_BUYER;
    handleUserChange(demoUser);
    setActiveTab(role === 'FARMER' ? 'farmer_dashboard' : 'marketplace');
  };

  const handleExploreMarketplace = () => {
    handleUserChange(DEMO_BUYER);
    setActiveTab('marketplace');
  };

  // Order count for badge (relevant for farmer or buyer)
  const relevantOrderCount = currentUser
    ? currentUser.role === 'FARMER'
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

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 font-sans selection:bg-farm-200 selection:text-farm-900">
      {/* Sticky Navigation Bar */}
      <Navbar
        currentUser={currentUser}
        currentRole={currentUser?.role || 'BUYER'}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onUserChange={handleUserChange}
        onOpenAuth={handleOpenAuth}
        orderCount={relevantOrderCount}
        onRefreshData={refreshData}
        onOpenAddCrop={() => {
          setActiveTab('farmer_dashboard');
          setIsAddCropModalOpen(true);
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 pt-6">
        {/* 1. Landing Page */}
        {activeTab === 'landing' && (
          <LandingPage
            onLoginAs={handleLandingLoginAs}
            onExploreMarketplace={handleExploreMarketplace}
          />
        )}

        {/* 2. Farmer Views */}
        {currentUser && currentUser.role === 'FARMER' && (
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
          </>
        )}

        {/* 3. Buyer Views */}
        {(!currentUser || currentUser.role === 'BUYER') && (
          <>
            {activeTab === 'marketplace' && (
              <BuyerMarketplace
                buyer={currentUser || DEMO_BUYER}
                crops={crops}
                onRefreshData={refreshData}
                onNavigateToOrders={() => setActiveTab('buyer_orders')}
              />
            )}

            {activeTab === 'compare_crops' && (
              <BuyerMarketplace
                buyer={currentUser || DEMO_BUYER}
                crops={crops}
                onRefreshData={refreshData}
                onNavigateToOrders={() => setActiveTab('buyer_orders')}
                forceCompareView={true}
              />
            )}

            {activeTab === 'buyer_orders' && (
              <BuyerOrders
                buyer={currentUser || DEMO_BUYER}
                orders={orders}
                onExploreMore={() => setActiveTab('marketplace')}
              />
            )}
          </>
        )}
      </main>

      {/* Global Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialRole={authInitialRole}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(user) => {
          handleUserChange(user);
          setActiveTab(user.role === 'FARMER' ? 'farmer_dashboard' : 'marketplace');
        }}
      />

      {/* Global Product Details Modal */}
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

      {/* Global Buy Order Modal */}
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
