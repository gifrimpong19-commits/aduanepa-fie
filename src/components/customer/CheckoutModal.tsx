import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { Modal } from '../common/Modal';
import { 
  MapPin, 
  Phone, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  Bike,
  Copy,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderPlaced: (orderId: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onOrderPlaced,
}) => {
  const { 
    currentUser, 
    activeUniversity, 
    cart, 
    vendors, 
    createOrder 
  } = useMarketplace();

  const [landmark, setLandmark] = useState<string>(currentUser.landmark || activeUniversity.popularLandmarks[0] || '');
  const [customLandmark, setCustomLandmark] = useState<string>('');
  const [useCustomLandmark, setUseCustomLandmark] = useState<boolean>(false);
  const [phone, setPhone] = useState<string>(currentUser.phone || '+233 54 892 1432');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [confirmedOrder, setConfirmedOrder] = useState<any>(null);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  const vendor = vendors.find(v => v.id === cart.vendorId);

  const subtotal = cart.items.reduce((sum, item) => {
    const discountedPrice = item.product.discountPercentage
      ? item.product.price * (1 - item.product.discountPercentage / 100)
      : item.product.price;
    return sum + (discountedPrice * item.quantity);
  }, 0);

  const deliveryFee = vendor?.deliveryFee || 10;
  const total = subtotal + deliveryFee;

  const handlePlaceOrder = () => {
    const finalLandmark = useCustomLandmark ? customLandmark.trim() : landmark;
    if (!finalLandmark) {
      alert('Please specify your delivery hall, room number, or landmark.');
      return;
    }
    if (!phone) {
      alert('Please enter your phone number so rider can contact you upon arrival.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const newOrder = createOrder(finalLandmark, phone);
      setIsSubmitting(false);

      if (newOrder) {
        setConfirmedOrder(newOrder);
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch (e) {}
      }
    }, 600);
  };

  const handleCopyCode = () => {
    if (confirmedOrder?.confirmationCode) {
      navigator.clipboard.writeText(confirmedOrder.confirmationCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleFinishAndTrack = () => {
    const ordId = confirmedOrder.id;
    setConfirmedOrder(null);
    onClose();
    onOrderPlaced(ordId);
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        if (!confirmedOrder) onClose();
      }}
      title={confirmedOrder ? "Order Confirmed!" : "Checkout & Delivery Details"}
      subtitle={confirmedOrder ? "Your food is being prepared" : `Ordering from ${vendor?.businessName}`}
      maxWidth={confirmedOrder ? "md" : "lg"}
    >
      {confirmedOrder ? (
        <div className="space-y-6 text-center animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-3xl shadow-warm">
            🎉
          </div>

          <div className="space-y-1">
            <h4 className="font-display font-extrabold text-2xl text-stone-900">
              Order #{confirmedOrder.id}
            </h4>
            <p className="text-xs text-stone-500">
              Placed for delivery to <span className="font-bold text-stone-800">{confirmedOrder.customerLandmark}</span>
            </p>
          </div>

          {/* Delivery Confirmation Code Card */}
          <div className="bg-gradient-to-br from-amber-500 to-brand-600 text-white p-5 rounded-3xl shadow-warm space-y-2 relative overflow-hidden">
            <div className="text-[11px] uppercase tracking-widest font-extrabold text-amber-200">
              Delivery Confirmation Code
            </div>
            
            <div className="flex items-center justify-center gap-3">
              <span className="font-mono text-4xl font-black tracking-widest bg-stone-950/30 px-5 py-2 rounded-2xl border border-white/20">
                {confirmedOrder.confirmationCode}
              </span>
              <button
                onClick={handleCopyCode}
                className="p-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors"
                title="Copy code"
              >
                {copiedCode ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>

            <p className="text-[11px] text-amber-100 max-w-xs mx-auto leading-relaxed pt-1">
              Give this 4-digit code to the delivery rider when receiving your food to complete the order and hand over cash/MoMo.
            </p>
          </div>

          {/* Price Summary */}
          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 text-xs flex items-center justify-between">
            <span className="font-semibold text-stone-600">Total Payable on Delivery:</span>
            <span className="font-display font-black text-base text-brand-600">
              GH₵ {confirmedOrder.total.toFixed(2)}
            </span>
          </div>

          <button
            onClick={handleFinishAndTrack}
            className="w-full py-3.5 bg-stone-900 hover:bg-black text-amber-300 font-bold text-sm rounded-2xl shadow-warm transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Track Live Order Progress</span>
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          
          <div className="p-3.5 bg-orange-50/70 border border-orange-200 rounded-2xl flex items-center gap-3 text-xs text-brand-900">
            <MapPin className="w-5 h-5 text-brand-600 flex-shrink-0" />
            <div>
              <span className="font-bold">{activeUniversity.name}</span>
              <p className="text-stone-600 text-[11px]">{activeUniversity.campusName} &bull; {activeUniversity.city}, {activeUniversity.region}</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-stone-800">
              Select Delivery Landmark / Hall / Hostel
            </label>
            
            {!useCustomLandmark ? (
              <div className="space-y-2">
                <select
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  className="w-full p-3 bg-white border border-stone-200 rounded-xl text-xs font-semibold text-stone-800 focus:ring-2 focus:ring-brand-500"
                >
                  {activeUniversity.popularLandmarks.map((lm, idx) => (
                    <option key={idx} value={lm}>
                      {lm}
                    </option>
                  ))}
                </select>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-stone-400">Can't find your exact block or room?</span>
                  <button
                    type="button"
                    onClick={() => setUseCustomLandmark(true)}
                    className="text-brand-600 font-bold hover:underline"
                  >
                    + Enter Custom Location / Room #
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="e.g. Pentagon Block B, Room 314 or Jean Nelson Hall Annex"
                  value={customLandmark}
                  onChange={(e) => setCustomLandmark(e.target.value)}
                  className="w-full p-3 bg-white border border-stone-200 rounded-xl text-xs font-semibold text-stone-800 focus:ring-2 focus:ring-brand-500"
                />
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-stone-400">Pinpoint location</span>
                  <button
                    type="button"
                    onClick={() => setUseCustomLandmark(false)}
                    className="text-brand-600 font-bold hover:underline"
                  >
                    Select from Popular Campus Spots
                  </button>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1.5 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-brand-600" />
              <span>Contact Phone Number (For Rider SMS/Call)</span>
            </label>
            <input
              type="tel"
              placeholder="+233 54 000 0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-3 bg-white border border-stone-200 rounded-xl text-xs font-semibold text-stone-800 focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="p-4 bg-stone-900 text-white rounded-2xl border border-stone-800 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Payment Option: Pay on Delivery (v1 Standard)</span>
            </div>
            <p className="text-[11px] text-stone-300 leading-relaxed">
              No online card needed! Pay in cash or direct Mobile Money (MTN / Telecel / AT) directly to the delivery rider Yaw/courier upon receiving your meal and entering the confirmation code.
            </p>
          </div>

          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2 text-xs">
            <div className="flex justify-between text-stone-600">
              <span>Items Total ({cart.items.length} items)</span>
              <span className="font-bold text-stone-900">GH₵ {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span className="flex items-center gap-1">
                <Bike className="w-3.5 h-3.5 text-brand-500" />
                <span>Campus Rider Delivery</span>
              </span>
              <span className="font-bold text-stone-900">GH₵ {deliveryFee.toFixed(2)}</span>
            </div>
            <div className="pt-2 border-t border-stone-200 flex justify-between text-sm">
              <span className="font-bold text-stone-900">Total Due on Delivery:</span>
              <span className="font-display font-extrabold text-base text-brand-600">
                GH₵ {total.toFixed(2)}
              </span>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={isSubmitting}
            className="w-full py-4 bg-gradient-to-r from-brand-500 to-amber-500 hover:from-brand-600 hover:to-amber-600 text-white font-display font-bold text-sm rounded-2xl shadow-warm hover:shadow-glow transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Placing Order with {vendor?.businessName}...</span>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Place Order & Generate Confirmation Code</span>
              </>
            )}
          </button>

        </div>
      )}
    </Modal>
  );
};
