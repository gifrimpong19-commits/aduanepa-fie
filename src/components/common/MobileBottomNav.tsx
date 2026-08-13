import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { Role } from '../../types';
import { 
  Home, 
  Sparkles, 
  ShoppingBag, 
  Repeat, 
  User, 
  GraduationCap, 
  Store, 
  Bike, 
  ShieldCheck,
  X
} from 'lucide-react';

interface MobileBottomNavProps {
  onOpenCart: () => void;
  onOpenAuth: () => void;
  activeView: 'home' | 'orders' | 'register-vendor' | 'register-rider';
  setActiveView: (view: 'home' | 'orders' | 'register-vendor' | 'register-rider') => void;
  onResetVendorSelection?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  onOpenCart,
  onOpenAuth,
  activeView,
  setActiveView,
  onResetVendorSelection,
}) => {
  const { currentRole, loginAs, cart, orders, currentUser } = useMarketplace();
  const [showRoleModal, setShowRoleModal] = useState<boolean>(false);

  const totalCartCount = cart.items.reduce((acc, item) => acc + item.quantity, 0);

  const activeOrdersCount = orders.filter(
    o => o.customerId === currentUser.id && o.status !== 'delivered' && o.status !== 'cancelled'
  ).length;

  const handleExploreClick = () => {
    if (onResetVendorSelection) {
      onResetVendorSelection();
    }
    setActiveView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const roleConfigs: { role: Role; label: string; icon: React.ReactNode; desc: string; color: string }[] = [
    { 
      role: 'customer', 
      label: 'Student / Customer', 
      desc: 'Browse campus food & order with Pay on Delivery',
      icon: <GraduationCap className="w-5 h-5 text-orange-600" />,
      color: 'border-orange-300 bg-orange-50/70'
    },
    { 
      role: 'vendor', 
      label: 'Vendor Hub', 
      desc: 'Manage chop bar menu & live kitchen orders',
      icon: <Store className="w-5 h-5 text-amber-600" />,
      color: 'border-amber-300 bg-amber-50/70'
    },
    { 
      role: 'rider', 
      label: 'Rider Fleet', 
      desc: 'Accept campus deliveries & verify customer codes',
      icon: <Bike className="w-5 h-5 text-emerald-600" />,
      color: 'border-emerald-300 bg-emerald-50/70'
    },
    { 
      role: 'admin', 
      label: 'Admin Operations', 
      desc: 'Verify vendors & riders, manage university list',
      icon: <ShieldCheck className="w-5 h-5 text-stone-900" />,
      color: 'border-stone-300 bg-stone-100'
    },
  ];

  return (
    <>
      {/* Fixed Mobile Bottom Bar (Visible on < md screens) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-stone-200 shadow-2xl px-2 py-1.5 safe-area-pb">
        <div className="flex items-center justify-around">
          
          {/* 1. Explore / Home */}
          <button
            onClick={handleExploreClick}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all cursor-pointer ${
              activeView === 'home' 
                ? 'text-brand-600 font-bold scale-105' 
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Explore</span>
          </button>

          {/* 2. My Orders (Customer mode) or Portal View */}
          {currentRole === 'customer' ? (
            <button
              onClick={() => {
                setActiveView(activeView === 'orders' ? 'home' : 'orders');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all cursor-pointer ${
                activeView === 'orders' 
                  ? 'text-brand-600 font-bold scale-105' 
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <div className="relative">
                <Sparkles className="w-5 h-5" />
                {activeOrdersCount > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 w-4 h-4 rounded-full bg-brand-600 text-white text-[9px] font-black flex items-center justify-center animate-bounce">
                    {activeOrdersCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5">Orders</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setActiveView('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all cursor-pointer ${
                activeView === 'home' 
                  ? 'text-brand-600 font-bold scale-105' 
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              {currentRole === 'vendor' && <Store className="w-5 h-5 text-amber-600" />}
              {currentRole === 'rider' && <Bike className="w-5 h-5 text-emerald-600" />}
              {currentRole === 'admin' && <ShieldCheck className="w-5 h-5 text-stone-900" />}
              <span className="text-[10px] mt-0.5 capitalize">{currentRole} Hub</span>
            </button>
          )}

          {/* 3. Floating Cart Trigger (Customer Mode) */}
          {currentRole === 'customer' && (
            <button
              onClick={onOpenCart}
              className="relative -top-3 w-12 h-12 rounded-full bg-gradient-to-tr from-brand-600 to-amber-500 text-white shadow-warm flex items-center justify-center active:scale-95 transition-transform cursor-pointer"
              title="Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-stone-950 text-amber-300 text-[10px] font-black flex items-center justify-center border-2 border-white shadow-sm">
                  {totalCartCount}
                </span>
              )}
            </button>
          )}

          {/* 4. Role Switcher Trigger */}
          <button
            onClick={() => setShowRoleModal(true)}
            className="flex flex-col items-center justify-center py-1 px-3 rounded-2xl text-stone-500 hover:text-stone-800 transition-all cursor-pointer"
            title="Switch Role"
          >
            <div className="w-5 h-5 rounded-lg bg-stone-100 border border-stone-300 flex items-center justify-center text-[10px] font-black text-stone-700">
              <Repeat className="w-3.5 h-3.5 text-brand-600" />
            </div>
            <span className="text-[10px] mt-0.5 font-medium">Switch Role</span>
          </button>

          {/* 5. Profile */}
          <button
            onClick={onOpenAuth}
            className="flex flex-col items-center justify-center py-1 px-3 rounded-2xl text-stone-500 hover:text-stone-800 transition-all cursor-pointer"
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Profile</span>
          </button>

        </div>
      </nav>

      {/* Role Switcher Modal for Mobile */}
      {showRoleModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div 
            onClick={() => setShowRoleModal(false)}
            className="fixed inset-0 bg-stone-950/60 backdrop-blur-sm"
          />

          <div className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl z-10 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <h3 className="font-display font-extrabold text-lg text-stone-900">
                  Switch Ecosystem Portal
                </h3>
                <p className="text-xs text-stone-500">
                  Test and manage AduanePa Fie across all 4 platform actors
                </p>
              </div>
              <button 
                onClick={() => setShowRoleModal(false)}
                className="p-1.5 rounded-xl bg-stone-100 text-stone-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5">
              {roleConfigs.map(({ role, label, desc, icon, color }) => {
                const isActive = currentRole === role;
                return (
                  <button
                    key={role}
                    onClick={() => {
                      loginAs(role);
                      setActiveView('home');
                      if (onResetVendorSelection) onResetVendorSelection();
                      setShowRoleModal(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`w-full text-left p-3.5 rounded-2xl border-2 transition-all flex items-center gap-3.5 cursor-pointer ${
                      isActive 
                        ? `${color} ring-2 ring-brand-500 shadow-sm` 
                        : 'bg-white border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-white p-2 flex items-center justify-center shadow-xs flex-shrink-0 border border-stone-200">
                      {icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-stone-900">{label}</span>
                        {isActive && (
                          <span className="text-[10px] font-black uppercase bg-brand-500 text-white px-2 py-0.2 rounded-full">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-stone-500 mt-0.5 line-clamp-1">{desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
