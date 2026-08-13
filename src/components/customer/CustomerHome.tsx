import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { Vendor, ProductItem } from '../../types';
import { 
  Search, 
  MapPin, 
  Clock, 
  Star, 
  Sparkles, 
  ChefHat, 
  Flame, 
  AlertCircle,
  Plus,
  TrendingUp,
  Tag
} from 'lucide-react';

interface CustomerHomeProps {
  onSelectVendor: (vendor: Vendor) => void;
}

const FALLBACK_BANNER = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80';
const FALLBACK_LOGO = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=200&h=200&q=80';
const FALLBACK_DISH = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';

export const CustomerHome: React.FC<CustomerHomeProps> = ({ onSelectVendor }) => {
  const { activeUniversity, vendors, universities, setActiveUniversity, products, addToCart } = useMarketplace();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [quickAddedToast, setQuickAddedToast] = useState<string | null>(null);

  // Filter vendors strictly by active university (PRD Rule 4.1 & 4.3)
  const campusVendors = vendors.filter(v => v.universityId === activeUniversity.id && v.status === 'approved');
  const campusVendorIds = new Set(campusVendors.map(v => v.id));

  // Products belonging to approved vendors on this campus
  const campusProducts = products.filter(p => campusVendorIds.has(p.vendorId));

  const categories = [
    'All',
    'Waakye',
    'Jollof & Rice',
    'Fried Yam & Grills',
    'Local Soups',
    'Fast Bites & Indomie',
    'Drinks'
  ];

  const isVendorOpen = (vendor: Vendor) => {
    if (!vendor.isManuallyOpen) return false;
    const now = new Date();
    const currentHourMin = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    return currentHourMin >= vendor.operatingHours.open && currentHourMin <= vendor.operatingHours.close;
  };

  const filteredVendors = campusVendors.filter(vendor => {
    const matchesSearch = vendor.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.categories.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'All' || 
      vendor.categories.some(c => c.toLowerCase().includes(selectedCategory.toLowerCase()));

    return matchesSearch && matchesCategory;
  });

  const handleQuickAdd = (product: ProductItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const vendor = vendors.find(v => v.id === product.vendorId);
    if (!vendor) return;

    const result = addToCart(product, 1);
    if (result.success) {
      setQuickAddedToast(`Added "${product.name}" to cart!`);
      setTimeout(() => setQuickAddedToast(null), 3000);
    } else if (result.requiresClearCart) {
      onSelectVendor(vendor);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Toast notification */}
      {quickAddedToast && (
        <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-50 bg-stone-900 text-white px-4 py-2.5 rounded-2xl shadow-2xl border border-brand-500/50 flex items-center gap-2 animate-in slide-in-from-bottom-5 text-xs font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>{quickAddedToast}</span>
        </div>
      )}

      {/* Hero Campus Banner */}
      <div className="relative rounded-3xl overflow-hidden shadow-warm border border-orange-100 bg-stone-900 text-white min-h-[300px] sm:min-h-[340px] flex items-center">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity scale-105 transition-transform duration-1000"
          style={{ backgroundImage: `url(${activeUniversity.bannerImage || FALLBACK_BANNER})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-900/90 to-brand-950/70" />

        <div className="relative z-10 p-5 sm:p-10 max-w-3xl space-y-3.5 sm:space-y-4">
          <div className="inline-flex items-center gap-2 bg-brand-500/20 text-brand-300 border border-brand-500/30 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md">
            <Flame className="w-3.5 h-3.5 text-brand-400 fill-brand-400" />
            <span>Serving {activeUniversity.name}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold font-display leading-tight text-white">
            Craving Good Food at <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-brand-400">{activeUniversity.shortName}</span>?
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-stone-300 max-w-xl font-normal leading-relaxed">
            Order authentic Waakye, Smoky Jollof, Banku with Tilapia, and Night Market Grills straight to your hostel or lecture hall. Pay cash or MoMo on delivery!
          </p>

          <div className="pt-1">
            <div className="text-[11px] sm:text-xs text-stone-400 font-semibold mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-brand-400" />
              <span>Direct delivery to popular spots:</span>
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto">
              {activeUniversity.popularLandmarks.slice(0, 6).map((landmark, idx) => (
                <span 
                  key={idx}
                  className="text-[10px] sm:text-[11px] bg-white/10 hover:bg-white/20 text-stone-200 px-2.5 py-0.5 rounded-lg border border-white/10 transition-colors"
                >
                  {landmark}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* University Selector & Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 items-center">
        <div className="md:col-span-8 relative">
          <Search className="w-4 h-4 sm:w-5 sm:h-5 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Waakye, Jollof, Red Red, Fufu, Fried Yam, Sobolo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 sm:pl-12 pr-4 py-3 sm:py-3.5 rounded-2xl bg-white border border-stone-200 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm text-xs sm:text-sm text-stone-800 placeholder-stone-400"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold bg-stone-100 hover:bg-stone-200 text-stone-600 px-2 py-1 rounded-lg"
            >
              Clear
            </button>
          )}
        </div>

        <div className="md:col-span-4 relative">
          <div className="flex items-center gap-2 bg-white border border-stone-200 rounded-2xl p-2 shadow-sm">
            <div className="p-2 rounded-xl bg-orange-50 text-brand-600 flex-shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <label className="block text-[9px] uppercase font-bold text-stone-400">Campus Location</label>
              <select
                value={activeUniversity.id}
                onChange={(e) => {
                  const uni = universities.find(u => u.id === e.target.value);
                  if (uni) setActiveUniversity(uni);
                }}
                className="w-full bg-transparent text-xs font-bold text-stone-800 focus:outline-none cursor-pointer truncate"
              >
                {universities.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.shortName} ({u.city}, {u.region})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 sm:px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-stone-900 text-amber-300 shadow-md scale-105'
                  : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200 hover:border-brand-200'
              }`}
            >
              {cat === 'All' && <Sparkles className="w-3.5 h-3.5 text-brand-500" />}
              {cat.includes('Waakye') && <span>🍛</span>}
              {cat.includes('Jollof') && <span>🍚</span>}
              {cat.includes('Yam') && <span>🍗</span>}
              {cat.includes('Soups') && <span>🍲</span>}
              {cat.includes('Indomie') && <span>🍜</span>}
              {cat.includes('Drinks') && <span>🥤</span>}
              <span>{cat}</span>
            </button>
          );
        })}
      </div>

      {/* Trending Campus Dishes Showcase (New Rich Menu Section!) */}
      {campusProducts.length > 0 && selectedCategory === 'All' && !searchQuery && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-display font-extrabold text-lg text-stone-900">
                  Trending Dishes at {activeUniversity.shortName}
                </h3>
                <p className="text-[11px] text-stone-500">Student favorites cooked hot on campus</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {campusProducts.slice(0, 4).map((product) => {
              const vendor = vendors.find(v => v.id === product.vendorId);
              const discountedPrice = product.discountPercentage 
                ? product.price * (1 - product.discountPercentage / 100)
                : product.price;

              return (
                <div
                  key={product.id}
                  onClick={() => vendor && onSelectVendor(vendor)}
                  className="group bg-white rounded-2xl overflow-hidden border border-stone-200/90 shadow-2xs hover:shadow-warm transition-all duration-300 flex flex-col justify-between cursor-pointer hover:-translate-y-1"
                >
                  <div className="relative h-32 sm:h-36 w-full bg-stone-100 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      onError={(e) => { e.currentTarget.src = FALLBACK_DISH; }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {product.discountPercentage && (
                      <span className="absolute top-2 left-2 bg-rose-500 text-white text-[9px] font-black px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
                        <Tag className="w-2.5 h-2.5" />
                        {product.discountPercentage}% OFF
                      </span>
                    )}
                    <span className="absolute bottom-2 right-2 bg-stone-900/80 backdrop-blur-md text-amber-300 text-[9px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      {product.preparationTimeMinutes}m
                    </span>
                  </div>

                  <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      <p className="text-[10px] text-brand-600 font-bold uppercase tracking-wider truncate">
                        {vendor?.businessName}
                      </p>
                      <h4 className="font-display font-bold text-xs sm:text-sm text-stone-900 group-hover:text-brand-600 transition-colors line-clamp-1">
                        {product.name}
                      </h4>
                    </div>

                    <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                      <span className="font-display font-black text-xs sm:text-sm text-stone-900">
                        GH₵ {discountedPrice.toFixed(2)}
                      </span>
                      <button
                        onClick={(e) => handleQuickAdd(product, e)}
                        className="p-1.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white shadow-xs transition-all"
                        title="Add to cart"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Vendors Grid */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold font-display text-stone-900">
              Campus Food Vendors ({filteredVendors.length})
            </h2>
            <p className="text-xs text-stone-500">
              Verified chop bars & eateries in {activeUniversity.campusName}
            </p>
          </div>
        </div>

        {filteredVendors.length === 0 ? (
          <div className="text-center py-14 bg-white rounded-3xl border border-dashed border-stone-200 p-6 sm:p-8">
            <div className="w-14 h-14 rounded-full bg-orange-50 text-brand-500 flex items-center justify-center mx-auto text-2xl">
              🍲
            </div>
            <h3 className="text-base sm:text-lg font-bold text-stone-800 mt-2">No Vendors Found</h3>
            <p className="text-xs text-stone-500 max-w-md mx-auto mt-1 mb-4">
              We couldn't find any approved vendors matching your search on {activeUniversity.shortName}. Try switching campus or clearing your search.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredVendors.map((vendor) => {
              const open = isVendorOpen(vendor);

              return (
                <div
                  key={vendor.id}
                  onClick={() => open && onSelectVendor(vendor)}
                  className={`group relative bg-white rounded-3xl overflow-hidden border border-stone-200/90 shadow-sm hover:shadow-warm transition-all duration-300 flex flex-col justify-between ${
                    open ? 'cursor-pointer hover:-translate-y-1' : 'opacity-65 grayscale-[40%] cursor-not-allowed'
                  }`}
                >
                  <div className="relative h-40 sm:h-44 w-full bg-stone-100 overflow-hidden">
                    <img
                      src={vendor.bannerImage}
                      alt={vendor.businessName}
                      onError={(e) => { e.currentTarget.src = FALLBACK_BANNER; }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent" />

                    <div className="absolute top-3 left-3">
                      {open ? (
                        <span className="inline-flex items-center gap-1 bg-emerald-500 text-white text-[10px] sm:text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                          Open Now
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-stone-800/90 text-stone-300 text-[10px] sm:text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md">
                          <AlertCircle className="w-3 h-3 text-rose-400" />
                          Closed ({vendor.operatingHours.open} - {vendor.operatingHours.close})
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-3 right-3 flex items-center gap-2">
                      <span className="bg-stone-900/80 backdrop-blur-md text-amber-300 text-[10px] sm:text-[11px] font-bold px-2.5 py-1 rounded-xl flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-400" />
                        {vendor.deliveryTimeEstimate}
                      </span>
                    </div>

                    <div className="absolute -bottom-4 left-4 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white p-1 shadow-md border border-stone-200">
                      <img
                        src={vendor.logo}
                        alt={vendor.businessName}
                        onError={(e) => { e.currentTarget.src = FALLBACK_LOGO; }}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 pt-6 sm:pt-7 space-y-2.5 sm:space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-display font-extrabold text-base sm:text-lg text-stone-900 group-hover:text-brand-600 transition-colors">
                          {vendor.businessName}
                        </h3>
                        <div className="flex items-center gap-1 bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-lg text-xs font-black">
                          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                          <span>{vendor.rating}</span>
                        </div>
                      </div>

                      <p className="text-xs text-stone-500 mt-0.5 line-clamp-1">
                        {vendor.tagline}
                      </p>

                      <div className="flex items-center gap-1.5 text-[11px] text-stone-400 mt-1.5">
                        <MapPin className="w-3 h-3 text-brand-500 flex-shrink-0" />
                        <span className="truncate">{vendor.locationDetails}</span>
                      </div>
                    </div>

                    <div className="pt-2.5 border-t border-stone-100 flex items-center justify-between gap-2">
                      <div className="flex flex-wrap gap-1">
                        {vendor.categories.slice(0, 2).map((cat, i) => (
                          <span key={i} className="text-[9px] sm:text-[10px] font-semibold bg-stone-100 text-stone-600 px-2 py-0.5 rounded-md">
                            {cat}
                          </span>
                        ))}
                      </div>

                      <div className="text-right">
                        <span className="text-[9px] text-stone-400 block">Min. Order</span>
                        <span className="text-xs font-bold text-stone-800">GH₵ {vendor.minOrder}</span>
                      </div>
                    </div>

                    <button
                      disabled={!open}
                      className={`w-full mt-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                        open
                          ? 'bg-brand-50 text-brand-700 hover:bg-brand-500 hover:text-white border border-brand-200 hover:border-brand-500'
                          : 'bg-stone-100 text-stone-400 cursor-not-allowed'
                      }`}
                    >
                      <ChefHat className="w-4 h-4" />
                      <span>{open ? 'View Menu & Order' : 'Currently Closed'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
