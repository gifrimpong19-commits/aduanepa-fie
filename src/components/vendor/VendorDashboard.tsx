import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { OrderManager } from './OrderManager';
import { MenuManager } from './MenuManager';
import { 
  Store, 
  ChefHat, 
  ShoppingBag, 
  Power, 
  Star, 
  PlusCircle, 
  MapPin
} from 'lucide-react';

interface VendorDashboardProps {
  onOpenRegister: () => void;
}

export const VendorDashboard: React.FC<VendorDashboardProps> = ({ onOpenRegister }) => {
  const { vendors, activeUniversity, orders, toggleVendorOpen } = useMarketplace();
  const [activeTab, setActiveTab] = useState<'orders' | 'menu' | 'profile'>('orders');

  const currentVendor = vendors.find(v => v.universityId === activeUniversity.id && v.status === 'approved') || vendors[0];

  const vendorOrders = orders.filter(o => o.vendorId === currentVendor.id);
  const deliveredOrders = vendorOrders.filter(o => o.status === 'delivered');
  const totalRevenue = deliveredOrders.reduce((sum, o) => sum + o.subtotal, 0);

  return (
    <div className="space-y-8 pb-20 max-w-6xl mx-auto">
      
      {/* Store Header Card */}
      <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-warm border border-stone-800 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white p-1 shadow-md border-2 border-brand-500 flex-shrink-0">
              <img
                src={currentVendor.logo}
                alt={currentVendor.businessName}
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display font-extrabold text-2xl text-white">
                  {currentVendor.businessName}
                </h1>
                <span className="font-mono text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full">
                  {currentVendor.uniqueIdCode}
                </span>
              </div>
              <p className="text-xs text-stone-300 flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-brand-400" />
                <span>{currentVendor.locationDetails} ({currentVendor.city})</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => toggleVendorOpen(currentVendor.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-sm ${
                currentVendor.isManuallyOpen
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                  : 'bg-stone-800 hover:bg-stone-700 text-stone-400'
              }`}
            >
              <Power className="w-4 h-4" />
              <span>{currentVendor.isManuallyOpen ? 'Store is OPEN' : 'Store is CLOSED'}</span>
            </button>

            <button
              onClick={onOpenRegister}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-2xl text-xs font-bold bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700"
            >
              <PlusCircle className="w-4 h-4 text-brand-400" />
              <span>Register New Spot</span>
            </button>
          </div>

        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-stone-800">
          <div className="bg-stone-800/60 p-3.5 rounded-2xl border border-stone-700/60">
            <span className="text-[10px] uppercase font-bold text-stone-400 block">Total Orders</span>
            <span className="font-display font-black text-xl text-white mt-1 block">
              {vendorOrders.length}
            </span>
          </div>

          <div className="bg-stone-800/60 p-3.5 rounded-2xl border border-stone-700/60">
            <span className="text-[10px] uppercase font-bold text-stone-400 block">Fulfilled Revenue</span>
            <span className="font-display font-black text-xl text-amber-300 mt-1 block">
              GH₵ {totalRevenue.toFixed(2)}
            </span>
          </div>

          <div className="bg-stone-800/60 p-3.5 rounded-2xl border border-stone-700/60">
            <span className="text-[10px] uppercase font-bold text-stone-400 block">Campus Rating</span>
            <span className="font-display font-black text-xl text-yellow-400 mt-1 flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400" />
              <span>{currentVendor.rating}</span>
            </span>
          </div>

          <div className="bg-stone-800/60 p-3.5 rounded-2xl border border-stone-700/60">
            <span className="text-[10px] uppercase font-bold text-stone-400 block">Scheduled Hours</span>
            <span className="font-mono text-xs font-bold text-stone-200 mt-1.5 block">
              {currentVendor.operatingHours.open} - {currentVendor.operatingHours.close}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
            activeTab === 'orders'
              ? 'bg-stone-900 text-amber-300 shadow-sm'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <ChefHat className="w-4 h-4" />
          <span>Live Kitchen Orders</span>
        </button>

        <button
          onClick={() => setActiveTab('menu')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
            activeTab === 'menu'
              ? 'bg-stone-900 text-amber-300 shadow-sm'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Menu & Pricing Catalog</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
            activeTab === 'profile'
              ? 'bg-stone-900 text-amber-300 shadow-sm'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Shop Profile & Permit</span>
        </button>
      </div>

      <div>
        {activeTab === 'orders' && <OrderManager currentVendor={currentVendor} />}
        {activeTab === 'menu' && <MenuManager currentVendor={currentVendor} />}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-3xl border border-stone-200 p-6 space-y-4 max-w-xl">
            <h3 className="font-display font-bold text-base text-stone-900">Vendor Credentials & Certificate</h3>
            <div className="space-y-2 text-xs text-stone-600">
              <div className="flex justify-between border-b border-stone-100 pb-2">
                <span>Owner Name:</span>
                <span className="font-bold text-stone-900">{currentVendor.ownerName}</span>
              </div>
              <div className="flex justify-between border-b border-stone-100 pb-2">
                <span>Unique ID:</span>
                <span className="font-mono font-bold text-stone-900">{currentVendor.uniqueIdCode}</span>
              </div>
              <div className="flex justify-between border-b border-stone-100 pb-2">
                <span>Institution Scoping:</span>
                <span className="font-bold text-stone-900">{currentVendor.universityId}</span>
              </div>
              <div className="flex justify-between border-b border-stone-100 pb-2">
                <span>Verification Document:</span>
                <span className="font-mono text-emerald-700 font-bold">{currentVendor.certificateDocName || 'verified_doc.pdf'}</span>
              </div>
              <div className="flex justify-between pb-1">
                <span>Status:</span>
                <span className="font-black uppercase text-emerald-600">{currentVendor.status}</span>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
