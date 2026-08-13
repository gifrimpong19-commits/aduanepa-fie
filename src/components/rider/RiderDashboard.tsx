import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { Order } from '../../types';
import { 
  Bike, 
  MapPin, 
  Phone, 
  Package, 
  CheckCircle2, 
  KeyRound, 
  Star,
  PlusCircle
} from 'lucide-react';
import { Modal } from '../common/Modal';
import confetti from 'canvas-confetti';

interface RiderDashboardProps {
  onOpenRegister: () => void;
}

export const RiderDashboard: React.FC<RiderDashboardProps> = ({ onOpenRegister }) => {
  const { 
    riders, 
    orders, 
    currentUser, 
    activeUniversity, 
    acceptRiderJob, 
    completeDeliveryWithCode 
  } = useMarketplace();

  const currentRider = riders.find(r => r.id === currentUser.id) || riders[0];

  const [completingOrder, setCompletingOrder] = useState<Order | null>(null);
  const [enteredCode, setEnteredCode] = useState<string>('');
  const [codeError, setCodeError] = useState<string | null>(null);

  const availableOrders = orders.filter(
    o => o.status === 'ready_for_pickup' && (!o.riderId || o.riderId === '')
  );

  const myActiveDeliveries = orders.filter(
    o => o.riderId === currentRider.id && o.status === 'out_for_delivery'
  );

  const myCompletedDeliveries = orders.filter(
    o => o.riderId === currentRider.id && o.status === 'delivered'
  );

  const handleAcceptOrder = (orderId: string) => {
    acceptRiderJob(orderId, currentRider.id);
  };

  const handleOpenCodeModal = (order: Order) => {
    setCompletingOrder(order);
    setEnteredCode('');
    setCodeError(null);
  };

  const handleVerifyCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!completingOrder) return;

    const result = completeDeliveryWithCode(completingOrder.id, enteredCode, currentRider.id);
    if (!result.success) {
      setCodeError(result.error || 'Invalid code entered.');
      return;
    }

    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {}

    setCompletingOrder(null);
    setEnteredCode('');
  };

  return (
    <div className="space-y-8 pb-20 max-w-5xl mx-auto">
      
      {/* Rider Profile Card */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-warm border border-emerald-900/40 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={currentRider.avatarUrl}
              alt={currentRider.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-400 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display font-extrabold text-2xl text-white">
                  {currentRider.name}
                </h1>
                <span className="font-mono text-[10px] font-bold bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full">
                  {currentRider.uniqueIdCode}
                </span>
              </div>
              <p className="text-xs text-stone-300 flex items-center gap-2 mt-0.5">
                <span className="flex items-center gap-1 font-semibold text-emerald-400">
                  <Bike className="w-3.5 h-3.5" />
                  {currentRider.vehicleType} ({currentRider.vehicleRegNumber})
                </span>
                <span>&bull;</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-stone-400" />
                  {activeUniversity.shortName}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenRegister}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700"
            >
              <PlusCircle className="w-4 h-4 text-emerald-400" />
              <span>Register as New Rider</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-stone-800">
          <div className="bg-stone-800/70 p-3 rounded-2xl border border-stone-700/60 text-center">
            <span className="text-[10px] uppercase font-bold text-stone-400">Total Trips</span>
            <span className="font-display font-black text-xl text-white block mt-0.5">
              {currentRider.totalDeliveries}
            </span>
          </div>

          <div className="bg-stone-800/70 p-3 rounded-2xl border border-stone-700/60 text-center">
            <span className="text-[10px] uppercase font-bold text-stone-400">Rating</span>
            <span className="font-display font-black text-xl text-amber-300 flex items-center justify-center gap-1 mt-0.5">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{currentRider.rating}</span>
            </span>
          </div>

          <div className="bg-stone-800/70 p-3 rounded-2xl border border-stone-700/60 text-center">
            <span className="text-[10px] uppercase font-bold text-stone-400">Verification</span>
            <span className="font-display font-black text-xs uppercase text-emerald-400 block mt-1.5">
              {currentRider.status}
            </span>
          </div>
        </div>
      </div>

      {/* Active Deliveries */}
      {myActiveDeliveries.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-purple-500 animate-ping"></span>
            <h2 className="font-display font-extrabold text-lg text-stone-900">
              Active Delivery in Progress ({myActiveDeliveries.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {myActiveDeliveries.map((order) => (
              <div 
                key={order.id}
                className="bg-white rounded-3xl border-2 border-purple-300 p-6 shadow-warm space-y-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-3">
                  <div>
                    <span className="font-mono font-black text-sm text-stone-900">{order.id}</span>
                    <h3 className="font-display font-extrabold text-lg text-stone-800 mt-0.5">
                      Pickup from: {order.vendorName}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-brand-600 block">Collect on Delivery</span>
                    <span className="font-display font-black text-xl text-stone-900">
                      GH₵ {order.total.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-orange-50/70 p-3.5 rounded-2xl border border-orange-200 text-xs space-y-1">
                    <span className="text-[10px] font-black uppercase text-brand-800">1. Pickup Spot</span>
                    <p className="font-bold text-stone-900">{order.vendorName}</p>
                    <p className="text-stone-600 text-[11px]">{activeUniversity.campusName}</p>
                  </div>

                  <div className="bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-200 text-xs space-y-1">
                    <span className="text-[10px] font-black uppercase text-emerald-800">2. Dropoff Student Landmark</span>
                    <p className="font-bold text-stone-900">{order.customerLandmark}</p>
                    <p className="text-stone-700 text-[11px] flex items-center gap-1">
                      <Phone className="w-3 h-3 text-emerald-600" />
                      <span>{order.customerName} ({order.customerPhone})</span>
                    </p>
                  </div>
                </div>

                <div className="text-xs bg-stone-50 p-3 rounded-2xl">
                  <span className="text-[10px] text-stone-400 font-bold uppercase block mb-1">Package Items:</span>
                  <div className="flex flex-wrap gap-2">
                    {order.items.map((it, i) => (
                      <span key={i} className="bg-white px-2.5 py-1 rounded-lg border border-stone-200 font-semibold text-stone-700">
                        {it.quantity}x {it.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => handleOpenCodeModal(order)}
                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-display font-extrabold text-sm rounded-2xl shadow-warm flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                  >
                    <KeyRound className="w-5 h-5" />
                    <span>Enter Customer Confirmation Code & Complete Delivery</span>
                  </button>
                  <p className="text-center text-[11px] text-stone-400 mt-2">
                    Customer Ama/Student must provide their unique 4-digit code to release cash and finalize trip.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Jobs Board */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display font-extrabold text-lg text-stone-900">
              Campus Delivery Job Board ({availableOrders.length})
            </h2>
            <p className="text-xs text-stone-500">
              Orders packed and waiting for courier pickup at {activeUniversity.shortName}
            </p>
          </div>
        </div>

        {availableOrders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 p-8 space-y-2">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto text-2xl">
              🛵
            </div>
            <h4 className="font-bold text-stone-800 text-sm">No Ready Orders to Pick Up</h4>
            <p className="text-xs text-stone-400 max-w-sm mx-auto">
              When kitchen chop bars finish cooking and mark orders as "Ready for Pickup", new delivery jobs will appear here instantly.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableOrders.map((order) => (
              <div 
                key={order.id}
                className="bg-white rounded-3xl border border-stone-200 p-5 space-y-4 shadow-sm hover:shadow-warm transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between border-b border-stone-100 pb-3">
                    <div>
                      <span className="font-mono font-bold text-xs text-stone-500">{order.id}</span>
                      <h3 className="font-display font-extrabold text-base text-stone-900 mt-0.5">
                        {order.vendorName}
                      </h3>
                    </div>
                    <span className="bg-emerald-100 text-emerald-800 font-bold text-xs px-2.5 py-1 rounded-full">
                      Ready at Counter
                    </span>
                  </div>

                  <div className="space-y-2 text-xs text-stone-600 mt-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-brand-500 flex-shrink-0" />
                      <span>Deliver to: <strong className="text-stone-900">{order.customerLandmark}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Package className="w-3.5 h-3.5 text-brand-500 flex-shrink-0" />
                      <span>{order.items.length} items &bull; Pay on Delivery</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-stone-400 block">Collect from Student</span>
                    <span className="font-display font-extrabold text-base text-stone-900">
                      GH₵ {order.total.toFixed(2)}
                    </span>
                  </div>

                  <button
                    onClick={() => handleAcceptOrder(order.id)}
                    className="py-2.5 px-5 bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs rounded-xl shadow-warm flex items-center gap-1.5 transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Accept Delivery Job</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completed Deliveries */}
      {myCompletedDeliveries.length > 0 && (
        <div className="pt-6 border-t border-stone-200 space-y-3">
          <h3 className="font-display font-bold text-base text-stone-800">
            Completed Trips History ({myCompletedDeliveries.length})
          </h3>
          <div className="space-y-2">
            {myCompletedDeliveries.map((order) => (
              <div 
                key={order.id}
                className="bg-white p-3.5 rounded-2xl border border-stone-200 flex items-center justify-between text-xs text-stone-600"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="font-mono font-bold text-stone-900">{order.id}</span>
                  <span className="text-stone-400">&bull;</span>
                  <span>{order.vendorName} &rarr; {order.customerLandmark}</span>
                </div>
                <span className="font-bold text-emerald-700">GH₵ {order.total.toFixed(2)} Handled</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Confirmation Code Verification Modal */}
      <Modal
        isOpen={!!completingOrder}
        onClose={() => setCompletingOrder(null)}
        title="Complete Delivery & Collect Payment"
        subtitle={`Order #${completingOrder?.id}`}
        maxWidth="sm"
      >
        <form onSubmit={handleVerifyCodeSubmit} className="space-y-5 text-center">
          <div className="w-14 h-14 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-2xl">
            <KeyRound className="w-7 h-7" />
          </div>

          <div>
            <h4 className="font-display font-bold text-base text-stone-900">
              Enter Customer Confirmation Code
            </h4>
            <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
              Ask student <strong className="text-stone-800">{completingOrder?.customerName}</strong> for their 4-digit code shown in their AduanePa app.
            </p>
          </div>

          <div>
            <input
              type="text"
              required
              maxLength={4}
              placeholder="••••"
              value={enteredCode}
              onChange={(e) => setEnteredCode(e.target.value)}
              className="w-40 mx-auto p-3 text-center text-3xl font-mono font-black tracking-widest bg-stone-50 border border-stone-300 rounded-2xl focus:ring-2 focus:ring-emerald-500"
            />
            {codeError && (
              <p className="text-xs font-bold text-rose-600 mt-2">{codeError}</p>
            )}
          </div>

          <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-xs flex justify-between">
            <span className="text-stone-600">Collect Cash / MoMo:</span>
            <span className="font-bold text-stone-900">GH₵ {completingOrder?.total.toFixed(2)}</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setCompletingOrder(null)}
              className="py-2.5 text-xs font-bold bg-stone-100 hover:bg-stone-200 rounded-xl text-stone-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-warm"
            >
              Verify & Complete
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
