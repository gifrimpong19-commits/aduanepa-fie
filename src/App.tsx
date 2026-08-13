import React, { useState } from 'react';
import { MarketplaceProvider, useMarketplace } from './context/MarketplaceContext';
import { Navbar } from './components/common/Navbar';
import { MobileBottomNav } from './components/common/MobileBottomNav';
import { Footer } from './components/common/Footer';
import { CustomerHome } from './components/customer/CustomerHome';
import { VendorStorefront } from './components/customer/VendorStorefront';
import { CartDrawer } from './components/customer/CartDrawer';
import { CheckoutModal } from './components/customer/CheckoutModal';
import { CustomerOrders } from './components/customer/CustomerOrders';
import { CustomerAuthModal } from './components/customer/CustomerAuthModal';
import { VendorDashboard } from './components/vendor/VendorDashboard';
import { VendorRegister } from './components/vendor/VendorRegister';
import { RiderDashboard } from './components/rider/RiderDashboard';
import { RiderRegister } from './components/rider/RiderRegister';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { Vendor } from './types';

const MainLayout: React.FC = () => {
  const { currentRole } = useMarketplace();
  
  // Navigation views
  const [activeView, setActiveView] = useState<'home' | 'orders' | 'register-vendor' | 'register-rider'>('home');
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  
  // Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);

  const handleSelectVendor = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToVendors = () => {
    setSelectedVendor(null);
  };

  const handleOrderPlaced = (_orderId: string) => {
    setIsCheckoutOpen(false);
    setSelectedVendor(null);
    setActiveView('orders');
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#FDFBF7] overflow-x-hidden w-full max-w-full">
      {/* Top Navbar */}
      <Navbar
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        activeView={activeView}
        setActiveView={(view) => {
          setSelectedVendor(null);
          setActiveView(view);
        }}
      />

      {/* Main Container with bottom padding for mobile navigation */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-3.5 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-24 md:pb-8 overflow-x-hidden">
        
        {/* Customer Portal */}
        {currentRole === 'customer' && (
          <>
            {activeView === 'orders' ? (
              <CustomerOrders onBackToBrowse={() => setActiveView('home')} />
            ) : activeView === 'register-vendor' ? (
              <VendorRegister onRegistered={() => setActiveView('home')} />
            ) : activeView === 'register-rider' ? (
              <RiderRegister onRegistered={() => setActiveView('home')} />
            ) : selectedVendor ? (
              <VendorStorefront
                vendor={selectedVendor}
                onBack={handleBackToVendors}
                onOpenCart={() => setIsCartOpen(true)}
              />
            ) : (
              <CustomerHome onSelectVendor={handleSelectVendor} />
            )}
          </>
        )}

        {/* Vendor Portal */}
        {currentRole === 'vendor' && (
          <>
            {activeView === 'register-vendor' ? (
              <VendorRegister onRegistered={() => setActiveView('home')} />
            ) : (
              <VendorDashboard onOpenRegister={() => setActiveView('register-vendor')} />
            )}
          </>
        )}

        {/* Rider Fleet Portal */}
        {currentRole === 'rider' && (
          <>
            {activeView === 'register-rider' ? (
              <RiderRegister onRegistered={() => setActiveView('home')} />
            ) : (
              <RiderDashboard onOpenRegister={() => setActiveView('register-rider')} />
            )}
          </>
        )}

        {/* Admin Master Governance */}
        {currentRole === 'admin' && (
          <AdminDashboard />
        )}

      </main>

      {/* Slide-Over Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onProceedCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderPlaced={handleOrderPlaced}
      />

      {/* Auth & Profile Modal */}
      <CustomerAuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      {/* Mobile Bottom Navigation Bar (< md screens) */}
      <MobileBottomNav
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        activeView={activeView}
        setActiveView={setActiveView}
        onResetVendorSelection={() => setSelectedVendor(null)}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <MarketplaceProvider>
      <MainLayout />
    </MarketplaceProvider>
  );
}
