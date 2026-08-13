import React from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { Role } from '../../types';
import { 
  GraduationCap, 
  Store, 
  Bike, 
  ShieldCheck, 
  ShoppingBag, 
  User as UserIcon,
  Sparkles,
  MapPin,
  ChevronDown,
  LogIn
} from 'lucide-react';

interface NavbarProps {
  onOpenCart: () => void;
  onOpenAuth: () => void;
  activeView: 'home' | 'orders' | 'register-vendor' | 'register-rider';
  setActiveView: (view: 'home' | 'orders' | 'register-vendor' | 'register-rider') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onOpenCart, 
  onOpenAuth,
  activeView,
  setActiveView 
}) => {
  const { 
    currentRole, 
    loginAs, 
    currentUser, 
    activeUniversity, 
    setActiveUniversity, 
    universities, 
    cart, 
    orders,
    isGuest
  } = useMarketplace();

  const totalCartCount = cart.items.reduce((acc, item) => acc + item.quantity, 0);

  const activeOrdersCount = orders.filter(
    o => o.customerId === currentUser.id && o.status !== 'delivered' && o.status !== 'cancelled'
  ).length;

  const roles: { role: Role; label: string; icon: React.ReactNode; color: string }[] = [
    { role: 'customer', label: 'Student', icon: <GraduationCap className="w-4 h-4" />, color: 'bg-orange-500 text-white' },
    { role: 'vendor', label: 'Vendor Hub', icon: <Store className="w-4 h-4" />, color: 'bg-amber-600 text-white' },
    { role: 'rider', label: 'Rider Fleet', icon: <Bike className="w-4 h-4" />, color: 'bg-emerald-600 text-white' },
    { role: 'admin', label: 'Admin Ops', icon: <ShieldCheck className="w-4 h-4" />, color: 'bg-stone-900 text-white' },
  ];

  const handleBrandClick = () => {
    setActiveView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-orange-100 shadow-xs transition-all">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-stone-900 via-brand-900 to-stone-900 text-amber-300 text-[11px] sm:text-xs py-1 px-3 sm:px-4 font-medium flex items-center justify-between">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between overflow-hidden">
          <span className="flex items-center gap-1.5 truncate text-[11px] sm:text-xs">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping flex-shrink-0"></span>
            <span className="font-semibold text-white">AduanePa Fie:</span>
            <span className="hidden xs:inline text-stone-200">Campus Food Delivery Marketplace &bull; Ghana</span>
          </span>
          <div className="flex items-center gap-1.5 text-stone-300 text-[10px] sm:text-xs flex-shrink-0">
            <span className="w-2 h-1.5 bg-[#CE1126] inline-block rounded-2xs"></span>
            <span className="w-2 h-1.5 bg-[#FFD100] inline-block rounded-2xs"></span>
            <span className="w-2 h-1.5 bg-[#006B3F] inline-block rounded-2xs"></span>
            <span className="ml-1 text-white font-semibold whitespace-nowrap">Pay on Delivery</span>
          </div>
        </div>
      </div>

      {/* Main Single-Line Navbar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3 flex-nowrap">
          
          {/* 1. Left: Logo & Brand Name (Linked to Home) */}
          <div 
            onClick={handleBrandClick} 
            className="flex items-center gap-2.5 cursor-pointer group select-none flex-shrink-0"
            title="Go to AduanePa Fie Home"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-amber-500 flex items-center justify-center text-white shadow-warm group-hover:scale-105 transition-transform flex-shrink-0">
              <span className="text-xl drop-shadow-sm">🍲</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-black text-lg sm:text-xl text-stone-900 tracking-tight whitespace-nowrap">
                Aduane<span className="text-brand-600">Pa</span> Fie
              </span>
              <span className="text-[9px] uppercase font-black tracking-widest bg-brand-100 text-brand-700 px-1.5 py-0.5 rounded-full hidden sm:inline-block">
                GH
              </span>
            </div>
          </div>

          {/* 2. Middle: Campus Selector & Role Switcher (Single Line) */}
          <div className="hidden md:flex items-center gap-2.5 flex-shrink-0">
            {/* Campus Selector (Customer Mode) */}
            {currentRole === 'customer' && (
              <div className="flex items-center bg-orange-50/80 border border-orange-200 rounded-xl p-1 shadow-2xs">
                <div className="flex items-center gap-1 px-2 text-stone-500 text-xs">
                  <MapPin className="w-3.5 h-3.5 text-brand-600 flex-shrink-0" />
                  <span className="font-semibold text-[11px] uppercase tracking-wider hidden xl:inline">Campus:</span>
                </div>
                <div className="relative">
                  <select
                    value={activeUniversity.id}
                    onChange={(e) => {
                      const uni = universities.find(u => u.id === e.target.value);
                      if (uni) setActiveUniversity(uni);
                    }}
                    className="appearance-none bg-white text-stone-800 text-xs font-bold py-1 pl-2.5 pr-7 rounded-lg border border-orange-200 shadow-2xs focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
                  >
                    {universities.map(u => (
                      <option key={u.id} value={u.id}>
                        {u.shortName}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            )}

            {/* Role Switcher Pills */}
            <div className="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200">
              {roles.map(({ role, label, icon, color }) => {
                const isActive = currentRole === role;
                return (
                  <button
                    key={role}
                    onClick={() => {
                      loginAs(role);
                      setActiveView('home');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                      isActive 
                        ? `${color} shadow-xs scale-100` 
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                    }`}
                    title={`Switch to ${label} Portal`}
                  >
                    {icon}
                    <span className="hidden lg:inline">{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Right: Orders, Cart, and Sign In / Profile */}
          <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
            {currentRole === 'customer' && (
              <>
                {/* Orders Button (Desktop) */}
                <button
                  onClick={() => {
                    setActiveView(activeView === 'orders' ? 'home' : 'orders');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`hidden sm:flex relative px-3 py-1.5 rounded-xl text-xs font-bold border transition-all items-center gap-1.5 whitespace-nowrap ${
                    activeView === 'orders'
                      ? 'bg-brand-50 border-brand-300 text-brand-700 shadow-inner'
                      : 'bg-white border-stone-200 text-stone-700 hover:border-brand-200 hover:bg-stone-50'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-brand-500" />
                  <span>Orders</span>
                  {activeOrdersCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-brand-600 text-white text-[9px] font-black flex items-center justify-center animate-bounce">
                      {activeOrdersCount}
                    </span>
                  )}
                </button>

                {/* Cart Button (Desktop) */}
                <button
                  onClick={onOpenCart}
                  className="hidden sm:flex relative items-center gap-1.5 bg-gradient-to-r from-brand-500 to-amber-500 hover:from-brand-600 hover:to-amber-600 text-white font-bold text-xs py-1.5 px-3 rounded-xl shadow-warm hover:shadow-glow transition-all whitespace-nowrap"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Cart</span>
                  {totalCartCount > 0 && (
                    <span className="bg-stone-900 text-amber-300 text-[10px] font-black px-1.5 py-0.2 rounded-full">
                      {totalCartCount}
                    </span>
                  )}
                </button>
              </>
            )}

            {/* Mobile Campus Indicator */}
            <div className="md:hidden flex items-center bg-orange-50 border border-orange-200 rounded-xl px-2 py-1">
              <MapPin className="w-3 h-3 text-brand-600 mr-1 flex-shrink-0" />
              <span className="text-[11px] font-bold text-stone-800 truncate max-w-[85px]">
                {activeUniversity.shortName}
              </span>
            </div>

            {/* Auth / Account State Trigger */}
            {isGuest && currentRole === 'customer' ? (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold shadow-sm transition-all whitespace-nowrap cursor-pointer"
                title="Sign in or create student account"
              >
                <LogIn className="w-3.5 h-3.5 text-amber-400" />
                <span>Sign In / Sign Up</span>
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 p-1 sm:px-2.5 sm:py-1 rounded-xl bg-white border border-stone-200 hover:border-brand-300 text-stone-700 transition-all shadow-2xs flex-shrink-0 cursor-pointer"
                title="View Profile & Account Settings"
              >
                {currentUser.avatarUrl ? (
                  <img 
                    src={currentUser.avatarUrl} 
                    alt={currentUser.name} 
                    className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg object-cover border border-amber-300 flex-shrink-0"
                  />
                ) : (
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-stone-100 flex items-center justify-center text-stone-600">
                    <UserIcon className="w-3.5 h-3.5" />
                  </div>
                )}
                <div className="text-left hidden lg:block">
                  <p className="text-xs font-bold text-stone-900 leading-tight truncate max-w-[100px]">
                    {currentUser.name}
                  </p>
                  <p className="text-[9px] text-stone-500 font-medium capitalize">
                    {currentUser.uniqueIdCode || currentUser.role}
                  </p>
                </div>
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};
