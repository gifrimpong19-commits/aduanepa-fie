import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { Vendor, ProductItem } from '../../types';
import { 
  ArrowLeft, 
  Clock, 
  MapPin, 
  Star, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Tag, 
  AlertCircle,
  Check
} from 'lucide-react';
import { Modal } from '../common/Modal';

interface VendorStorefrontProps {
  vendor: Vendor;
  onBack: () => void;
  onOpenCart: () => void;
}

const FALLBACK_DISH = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';
const FALLBACK_BANNER = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80';
const FALLBACK_LOGO = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=200&h=200&q=80';

export const VendorStorefront: React.FC<VendorStorefrontProps> = ({ 
  vendor, 
  onBack,
  onOpenCart 
}) => {
  const { products, addToCart, cart, clearCart } = useMarketplace();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [instructions, setInstructions] = useState<string>('');
  const [showVendorConflictModal, setShowVendorConflictModal] = useState<boolean>(false);
  const [pendingProductToAdd, setPendingProductToAdd] = useState<{ product: ProductItem; quantity: number; instructions: string } | null>(null);
  const [addedToast, setAddedToast] = useState<string | null>(null);

  const vendorProducts = products.filter(p => p.vendorId === vendor.id);

  const categories = ['All', ...Array.from(new Set(vendorProducts.map(p => p.category)))];

  const filteredProducts = selectedCategory === 'All' 
    ? vendorProducts 
    : vendorProducts.filter(p => p.category === selectedCategory);

  const handleOpenProductModal = (product: ProductItem) => {
    setSelectedProduct(product);
    setQuantity(1);
    setInstructions('');
  };

  const handleAddToCartSubmit = () => {
    if (!selectedProduct) return;

    const result = addToCart(selectedProduct, quantity, instructions);

    if (result.requiresClearCart) {
      setPendingProductToAdd({
        product: selectedProduct,
        quantity,
        instructions
      });
      setShowVendorConflictModal(true);
      return;
    }

    triggerAddedFeedback(selectedProduct.name);
    setSelectedProduct(null);
  };

  const handleConfirmSwitchVendor = () => {
    clearCart();
    if (pendingProductToAdd) {
      addToCart(pendingProductToAdd.product, pendingProductToAdd.quantity, pendingProductToAdd.instructions);
      triggerAddedFeedback(pendingProductToAdd.product.name);
    }
    setShowVendorConflictModal(false);
    setSelectedProduct(null);
    setPendingProductToAdd(null);
  };

  const triggerAddedFeedback = (productName: string) => {
    setAddedToast(`Added "${productName}" to your cart!`);
    setTimeout(() => {
      setAddedToast(null);
    }, 3000);
  };

  const isCartFromDifferentVendor = cart.vendorId && cart.vendorId !== vendor.id && cart.items.length > 0;

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-200">
      
      {addedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-brand-500/50 flex items-center gap-3 animate-in slide-in-from-bottom-5">
          <div className="w-7 h-7 rounded-full bg-brand-500 flex items-center justify-center text-white">
            <Check className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold">{addedToast}</span>
          <button 
            onClick={onOpenCart} 
            className="ml-2 text-xs bg-brand-500 hover:bg-brand-600 text-white font-black px-3 py-1 rounded-xl shadow-sm"
          >
            View Cart
          </button>
        </div>
      )}

      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-brand-600 bg-white hover:bg-orange-50 border border-stone-200 hover:border-brand-200 px-4 py-2 rounded-2xl shadow-2xs transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Vendors</span>
        </button>
      </div>

      {isCartFromDifferentVendor && (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 flex items-center justify-between gap-3 text-amber-900 text-xs">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <div>
              <span className="font-bold">You have items in your cart from another vendor.</span>
              <p className="text-stone-600 text-[11px]">AduanePa Fie uses single-vendor checkout. Ordering here will replace your previous cart.</p>
            </div>
          </div>
          <button
            onClick={() => clearCart()}
            className="text-xs font-bold text-amber-800 bg-amber-200/80 hover:bg-amber-200 px-3 py-1.5 rounded-xl whitespace-nowrap"
          >
            Clear Cart
          </button>
        </div>
      )}

      {/* Store Header Banner */}
      <div className="relative rounded-3xl overflow-hidden shadow-warm border border-stone-200 bg-white">
        <div className="relative h-56 sm:h-72 w-full bg-stone-900">
          <img
            src={vendor.bannerImage}
            alt={vendor.businessName}
            onError={(e) => { e.currentTarget.src = FALLBACK_BANNER; }}
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-900/40 to-transparent" />

          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
              <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
              Open & Taking Orders
            </span>
            <div className="flex items-center gap-2">
              <span className="bg-stone-900/80 backdrop-blur-md text-amber-300 text-xs font-bold px-3 py-1 rounded-xl flex items-center gap-1.5 border border-white/10">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                {vendor.operatingHours.open} - {vendor.operatingHours.close}
              </span>
            </div>
          </div>

          <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-white p-1 shadow-xl border-2 border-amber-300 flex-shrink-0">
                <img
                  src={vendor.logo}
                  alt={vendor.businessName}
                  onError={(e) => { e.currentTarget.src = FALLBACK_LOGO; }}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <div className="text-white space-y-1">
                <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight drop-shadow-md">
                  {vendor.businessName}
                </h1>
                <p className="text-xs text-stone-200 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-brand-400" />
                  <span>{vendor.locationDetails}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 bg-stone-900/80 backdrop-blur-md p-2 rounded-2xl border border-white/10 text-xs text-white">
              <div className="px-3 py-1 text-center border-r border-white/10">
                <div className="flex items-center justify-center gap-1 text-amber-400 font-black">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{vendor.rating}</span>
                </div>
                <span className="text-[10px] text-stone-400">Rating</span>
              </div>
              <div className="px-3 py-1 text-center border-r border-white/10">
                <span className="font-bold text-amber-300">GH₵ {vendor.deliveryFee}</span>
                <span className="text-[10px] text-stone-400 block">Delivery</span>
              </div>
              <div className="px-3 py-1 text-center">
                <span className="font-bold text-stone-200">{vendor.deliveryTimeEstimate}</span>
                <span className="text-[10px] text-stone-400 block">Speed</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Categories Pills */}
      <div className="sticky top-20 z-30 bg-stone-50/95 backdrop-blur-md py-3 border-b border-stone-200 -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-brand-500 text-white shadow-warm scale-105'
                    : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Product Items Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold font-display text-stone-900">
            {selectedCategory === 'All' ? 'Full Menu & Dishes' : selectedCategory} ({filteredProducts.length})
          </h2>
          <span className="text-xs text-stone-500">Pay on Delivery Available</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const discountedPrice = product.discountPercentage 
              ? product.price * (1 - product.discountPercentage / 100)
              : product.price;

            return (
              <div
                key={product.id}
                onClick={() => handleOpenProductModal(product)}
                className="group bg-white rounded-3xl overflow-hidden border border-stone-200/90 shadow-sm hover:shadow-warm transition-all duration-300 flex flex-col justify-between cursor-pointer hover:-translate-y-1"
              >
                <div className="relative h-44 w-full bg-stone-100 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    onError={(e) => { e.currentTarget.src = FALLBACK_DISH; }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {product.discountPercentage && (
                    <div className="absolute top-3 left-3 bg-rose-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      <span>{product.discountPercentage}% OFF</span>
                    </div>
                  )}

                  <div className="absolute bottom-3 right-3 bg-stone-900/80 backdrop-blur-md text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{product.preparationTimeMinutes} mins</span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    {product.dietaryTags && product.dietaryTags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-1.5">
                        {product.dietaryTags.map((tag, i) => (
                          <span key={i} className="text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200/80 px-2 py-0.5 rounded-md">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <h3 className="font-display font-bold text-base text-stone-900 group-hover:text-brand-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-display font-extrabold text-base text-stone-900">
                          GH₵ {discountedPrice.toFixed(2)}
                        </span>
                        {product.discountPercentage && (
                          <span className="text-xs text-stone-400 line-through">
                            GH₵ {product.price.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-stone-400">Cash / MoMo</span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenProductModal(product);
                      }}
                      className="p-2.5 rounded-xl bg-brand-500 text-white hover:bg-brand-600 shadow-warm hover:scale-105 transition-all"
                      title="Add to order"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Product Modal */}
      {selectedProduct && (
        <Modal
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          title={selectedProduct.name}
          subtitle={vendor.businessName}
          maxWidth="lg"
        >
          <div className="space-y-5">
            <div className="h-48 rounded-2xl overflow-hidden bg-stone-100 relative">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                onError={(e) => { e.currentTarget.src = FALLBACK_DISH; }}
                className="w-full h-full object-cover"
              />
              {selectedProduct.discountPercentage && (
                <div className="absolute top-3 left-3 bg-rose-500 text-white text-xs font-black px-3 py-1 rounded-full shadow-md">
                  {selectedProduct.discountPercentage}% OFF Deal
                </div>
              )}
            </div>

            <div>
              <p className="text-xs text-stone-600 leading-relaxed">
                {selectedProduct.description}
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                Special Instructions for Vendor (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="e.g., Extra shito, separate gravy, make it very hot & spicy..."
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                className="w-full p-3 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="p-4 bg-orange-50/60 border border-orange-100 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-stone-500">Item Price</span>
                <p className="text-lg font-black font-display text-stone-900">
                  GH₵ {((selectedProduct.discountPercentage 
                    ? selectedProduct.price * (1 - selectedProduct.discountPercentage / 100) 
                    : selectedProduct.price) * quantity).toFixed(2)}
                </p>
              </div>

              <div className="flex items-center gap-3 bg-white p-1.5 rounded-xl border border-orange-200 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center font-bold"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-sm font-black w-6 text-center">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-lg bg-brand-500 hover:bg-brand-600 text-white flex items-center justify-center font-bold"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCartSubmit}
              className="w-full py-3.5 bg-gradient-to-r from-brand-500 to-amber-500 hover:from-brand-600 hover:to-amber-600 text-white font-bold text-sm rounded-2xl shadow-warm flex items-center justify-center gap-2 transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Cart &bull; GH₵ {((selectedProduct.discountPercentage 
                ? selectedProduct.price * (1 - selectedProduct.discountPercentage / 100) 
                : selectedProduct.price) * quantity).toFixed(2)}</span>
            </button>
          </div>
        </Modal>
      )}

      {/* Single vendor cart conflict */}
      <Modal
        isOpen={showVendorConflictModal}
        onClose={() => setShowVendorConflictModal(false)}
        title="Start a New Order?"
        subtitle="Single-vendor cart policy"
        maxWidth="sm"
      >
        <div className="space-y-4 text-center">
          <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto text-2xl">
            🍲
          </div>
          <p className="text-xs text-stone-600 leading-relaxed">
            Your cart already contains items from a different campus vendor. AduanePa Fie orders are fulfilled from one vendor per delivery.
          </p>
          <p className="text-xs font-bold text-stone-800">
            Would you like to clear your existing cart and start an order with <span className="text-brand-600">{vendor.businessName}</span>?
          </p>
          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              onClick={() => setShowVendorConflictModal(false)}
              className="py-2.5 text-xs font-bold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-xl"
            >
              Keep Old Cart
            </button>
            <button
              onClick={handleConfirmSwitchVendor}
              className="py-2.5 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-warm"
            >
              Start New Cart
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
};
