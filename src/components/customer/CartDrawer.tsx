import React from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  AlertCircle, 
  ShieldCheck,
  Bike
} from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ 
  isOpen, 
  onClose, 
  onProceedCheckout 
}) => {
  const { cart, vendors, updateCartQuantity, removeFromCart, clearCart } = useMarketplace();

  if (!isOpen) return null;

  const vendor = vendors.find(v => v.id === cart.vendorId);

  const subtotal = cart.items.reduce((sum, item) => {
    const discountedPrice = item.product.discountPercentage
      ? item.product.price * (1 - item.product.discountPercentage / 100)
      : item.product.price;
    return sum + (discountedPrice * item.quantity);
  }, 0);

  const deliveryFee = vendor?.deliveryFee || 10;
  const minOrder = vendor?.minOrder || 0;
  const total = subtotal + deliveryFee;
  const meetsMinOrder = subtotal >= minOrder;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer Container: 100% width on mobile, max-w-md on desktop */}
      <div className="fixed inset-y-0 right-0 max-w-full flex w-full sm:w-auto sm:pl-10 pointer-events-none">
        <div className="w-full sm:max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-stone-200 pointer-events-auto overflow-hidden">
          
          {/* Header */}
          <div className="p-4 sm:p-6 pb-3 sm:pb-4 border-b border-stone-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-orange-100 text-brand-600 flex items-center justify-center flex-shrink-0">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-extrabold text-base sm:text-lg text-stone-900">Your Food Cart</h3>
                {vendor && (
                  <p className="text-xs text-brand-600 font-bold truncate max-w-[180px] sm:max-w-[220px]">
                    {vendor.businessName}
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
              title="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Content */}
          <div className="p-4 sm:p-6 flex-1 overflow-y-auto space-y-4">
            {cart.items.length === 0 ? (
              <div className="text-center py-16 sm:py-20 space-y-3">
                <div className="w-16 h-16 rounded-full bg-orange-50 text-brand-400 flex items-center justify-center mx-auto text-2xl">
                  🍲
                </div>
                <h4 className="font-display font-bold text-stone-800 text-base">Your cart is empty</h4>
                <p className="text-xs text-stone-500 max-w-xs mx-auto">
                  Explore campus chop bars, waakye joints, and night market grills to add delicious food.
                </p>
              </div>
            ) : (
              <>
                {/* List items */}
                <div className="space-y-3">
                  {cart.items.map((item) => {
                    const price = item.product.discountPercentage
                      ? item.product.price * (1 - item.product.discountPercentage / 100)
                      : item.product.price;

                    return (
                      <div 
                        key={item.product.id}
                        className="bg-stone-50/90 p-3 sm:p-3.5 rounded-2xl border border-stone-200/80 flex items-center justify-between gap-2.5 shadow-2xs"
                      >
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover border border-stone-200 flex-shrink-0"
                        />

                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-stone-900 truncate">
                            {item.product.name}
                          </h4>
                          <p className="text-xs font-black text-brand-600 mt-0.5">
                            GH₵ {(price * item.quantity).toFixed(2)}
                          </p>
                          {item.specialInstructions && (
                            <p className="text-[10px] text-stone-500 italic truncate mt-0.5">
                              "{item.specialInstructions}"
                            </p>
                          )}
                        </div>

                        {/* Quantity picker */}
                        <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-xl border border-stone-200 flex-shrink-0">
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                            className="text-stone-500 hover:text-stone-800 p-0.5"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                            className="text-brand-600 hover:text-brand-800 p-0.5"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-stone-400 hover:text-rose-500 p-1 flex-shrink-0"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Clear cart action */}
                <div className="pt-2 flex justify-between items-center text-xs">
                  <span className="text-stone-400 text-[11px]">{cart.items.length} item{cart.items.length > 1 ? 's' : ''} in cart</span>
                  <button
                    onClick={clearCart}
                    className="text-[11px] font-bold text-stone-400 hover:text-rose-600 transition-colors"
                  >
                    Empty Entire Cart
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cart.items.length > 0 && (
            <div className="p-4 sm:p-6 bg-stone-50 border-t border-stone-200 space-y-3.5 sm:space-y-4">
              
              {/* Payment Method Notice */}
              <div className="bg-amber-100/70 border border-amber-300/80 rounded-xl p-2.5 flex items-center gap-2 text-xs text-amber-950">
                <ShieldCheck className="w-4 h-4 text-amber-700 flex-shrink-0" />
                <span className="text-[11px] sm:text-xs">
                  <strong>Pay on Delivery:</strong> Pay cash or MoMo upon arrival after verifying 4-digit code.
                </span>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-stone-900">GH₵ {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="flex items-center gap-1">
                    <Bike className="w-3 h-3 text-brand-500" />
                    <span>Campus Delivery Fee</span>
                  </span>
                  <span className="font-bold text-stone-900">GH₵ {deliveryFee.toFixed(2)}</span>
                </div>
                <div className="pt-2 border-t border-stone-200 flex justify-between text-sm">
                  <span className="font-bold text-stone-900">Total Due on Delivery</span>
                  <span className="font-display font-extrabold text-base text-brand-600">
                    GH₵ {total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Min Order Check */}
              {!meetsMinOrder && (
                <div className="flex items-center gap-1.5 text-[11px] text-rose-600 font-semibold bg-rose-50 p-2 rounded-lg border border-rose-200">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>Minimum order for this vendor is GH₵ {minOrder}. Add GH₵ {(minOrder - subtotal).toFixed(2)} more.</span>
                </div>
              )}

              {/* Checkout Button */}
              <button
                disabled={!meetsMinOrder}
                onClick={() => {
                  onClose();
                  onProceedCheckout();
                }}
                className={`w-full py-3.5 rounded-2xl font-display font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-warm ${
                  meetsMinOrder
                    ? 'bg-gradient-to-r from-brand-500 to-amber-500 hover:from-brand-600 hover:to-amber-600 text-white hover:shadow-glow active:scale-98'
                    : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                }`}
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
