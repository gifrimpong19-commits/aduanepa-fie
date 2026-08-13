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
  ChevronDown
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
    orders 
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

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-orange-100 shadow-sm transition-all overflow-hidden">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-stone-900 via-brand-900 to-stone-900 text-amber-300 text-[11px] sm:text-xs py-1 px-3 sm:px-4 font-medium flex items-center justify-between">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full justify-between overflow-hidden">
          <span className="flex items-center gap-1.5 truncate text-[11px] sm:text-xs">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping flex-shrink-0"></span>
            <span className="font-semibold text-white truncate">AduanePa Fie:</span>
            <span className="hidden xs:inline truncate">University Food Delivery Marketplace &bull; Ghana</span>
          </span>
          <div className="flex items-center gap-1.5 text-stone-300 text-[10px] sm:text-xs flex-shrink-0">
            <span className="w-2 h-1.5 bg-[#CE1126] inline-block rounded-2xs"></span>
            <span className="w-2 h-1.5 bg-[#FFD100] inline-block rounded-2xs"></span>
            <span className="w-2 h-1.5 bg-[#006B3F] inline-block rounded-2xs"></span>
            <span className="ml-1 text-white font-semibold whitespace-nowrap">Pay on Delivery</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-2">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => setActiveView('home')} 
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group select-none flex-shrink-0"
          >
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-brand-600 to-amber-500 flex items-center justify-center text-white shadow-warm group-hover:scale-105 transition-transform flex-shrink-0">
              <span className="text-xl sm:text-2xl drop-shadow-sm">🍲</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-black text-lg sm:text-xl text-stone-900 tracking-tight">
                  Aduane<span className="text-brand-600">Pa</span> Fie
                </span>
                <span className="text-[9px] uppercase font-bold tracking-widest bg-brand-100 text-brand-700 px-1 py-0.2 rounded-full hidden sm:inline-block">
                  v1.0
                </span>
              </div>
              <p className="text-[10px] text-stone-500 font-medium hidden sm:block">
                "Enjoy the Taste in Every Bite"
              </p>
            </div>
          </div>

          {/* Campus Selector (Customer Mode - Desktop & Tablet) */}
          {currentRole === 'customer' && (
            <div className="hidden lg:flex items-center bg-orange-50/80 border border-orange-200/80 rounded-2xl p-1 shadow-inner">
              <div className="flex items-center gap-1.5 px-2.5 py-1 text-stone-600">
                <MapPin className="w-4 h-4 text-brand-600 flex-shrink-0" />
                <span className="text-xs font-semibold uppercase text-stone-500 tracking-wider">Campus:</span>
              </div>
              <div className="relative">
                <select
                  value={activeUniversity.id}
                  onChange={(e) => {
                    const uni = universities.find(u => u.id === e.target.value);
                    if (uni) setActiveUniversity(uni);
                  }}
                  className="appearance-none bg-white text-stone-800 text-xs font-bold py-1.5 pl-3 pr-8 rounded-xl border border-orange-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
                >
                  {universities.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.shortName} ({u.city})
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          )}

          {/* Role Switcher Pills (Desktop/Tablet Only) */}
          <div className="hidden md:flex items-center bg-stone-100/90 p-1 rounded-2xl border border-stone-200">
            {roles.map(({ role, label, icon, color }) => {
              const isActive = currentRole === role;
              return (
                <button
                  key={role}
                  onClick={() => {
                    loginAs(role);
                    setActiveView('home');
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isActive 
                      ? `${color} shadow-sm scale-100` 
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

          {/* Right Actions */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {currentRole === 'customer' && (
              <>
                {/* Orders Button (Desktop/Tablet) */}
                <button
                  onClick={() => setActiveView(activeView === 'orders' ? 'home' : 'orders')}
                  className={`hidden sm:flex relative px-3 py-2 rounded-xl text-xs font-bold border transition-all items-center gap-1.5 ${
                    activeView === 'orders'
                      ? 'bg-brand-50 border-brand-300 text-brand-700 shadow-inner'
                      : 'bg-white border-stone-200 text-stone-700 hover:border-brand-200 hover:bg-stone-50'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-brand-500" />
                  <span className="hidden sm:inline">My Orders</span>
                  {activeOrdersCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-brand-600 text-white text-[10px] font-black flex items-center justify-center animate-bounce">
                      {activeOrdersCount}
                    </span>
                  )}
                </button>

                {/* Cart Button (Desktop/Tablet) */}
                <button
                  onClick={onOpenCart}
                  className="hidden sm:flex relative items-center gap-2 bg-gradient-to-r from-brand-500 to-amber-500 hover:from-brand-600 hover:to-amber-600 text-white font-bold text-xs py-2 px-3.5 rounded-xl shadow-warm hover:shadow-glow transition-all group"
                >
                  <ShoppingBag className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span className="hidden sm:inline">Cart</span>
                  {totalCartCount > 0 && (
                    <span className="bg-stone-900 text-amber-300 text-[11px] font-black px-2 py-0.5 rounded-full shadow-sm">
                      {totalCartCount}
                    </span>
                  )}
                </button>
              </>
            )}

            {/* Mobile Campus Pill */}
            <div className="lg:hidden flex items-center bg-orange-50 border border-orange-200 rounded-xl px-2 py-1">
              <MapPin className="w-3 h-3 text-brand-600 mr-1 flex-shrink-0" />
              <span className="text-[11px] font-bold text-stone-800 truncate max-w-[90px]">
                {activeUniversity.shortName}
              </span>
            </div>

            {/* Profile / Auth trigger */}
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 p-1 sm:px-3 sm:py-1.5 rounded-xl bg-white border border-stone-200 hover:border-brand-300 text-stone-700 transition-all shadow-sm flex-shrink-0"
              title="Account Profile"
            >
              {currentUser.avatarUrl ? (
                <img 
                  src={currentUser.avatarUrl} 
                  alt={currentUser.name} 
                  className="w-7 h-7 rounded-lg object-cover border border-amber-300 flex-shrink-0"
                />
              ) : (
                <div className="w-7 h-7 rounded-lg bg-stone-100 flex items-center justify-center text-stone-600">
                  <UserIcon className="w-4 h-4" />
                </div>
              )}
              <div className="text-left hidden xl:block">
                <p className="text-xs font-bold text-stone-900 leading-tight truncate max-w-[100px]">
                  {currentUser.name}
                </p>
                <p className="text-[10px] text-stone-500 font-medium capitalize">
                  {currentUser.uniqueIdCode || currentUser.role}
                </p>
              </div>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
