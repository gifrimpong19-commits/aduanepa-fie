import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { Order, OrderStatus } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { 
  Package, 
  Clock, 
  Phone, 
  CheckCircle2, 
  ChefHat, 
  Bike, 
  Copy, 
  Check, 
  AlertTriangle
} from 'lucide-react';
import { Modal } from '../common/Modal';

interface CustomerOrdersProps {
  onBackToBrowse: () => void;
}

export const CustomerOrders: React.FC<CustomerOrdersProps> = ({ onBackToBrowse }) => {
  const { orders, currentUser, disputeOrder } = useMarketplace();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [disputeModalOpen, setDisputeModalOpen] = useState<boolean>(false);
  const [disputeReason, setDisputeReason] = useState<string>('');

  const customerOrders = orders.filter(o => o.customerId === currentUser.id);

  const handleCopyCode = (code: string, orderId: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(orderId);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const handleDisputeSubmit = () => {
    if (!selectedOrder || !disputeReason.trim()) return;
    disputeOrder(selectedOrder.id, disputeReason);
    setDisputeModalOpen(false);
    setDisputeReason('');
    alert(`Dispute report submitted for order #${selectedOrder.id}. AduanePa Fie support team is reviewing it.`);
  };

  // Steps for progress stepper
  const orderSteps: { status: OrderStatus; label: string; icon: React.ReactNode }[] = [
    { status: 'placed', label: 'Placed', icon: <Clock className="w-3.5 h-3.5" /> },
    { status: 'accepted_vendor', label: 'Accepted', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
    { status: 'preparing', label: 'Preparing', icon: <ChefHat className="w-3.5 h-3.5" /> },
    { status: 'ready_for_pickup', label: 'Ready', icon: <Package className="w-3.5 h-3.5" /> },
    { status: 'out_for_delivery', label: 'On Way', icon: <Bike className="w-3.5 h-3.5" /> },
    { status: 'delivered', label: 'Delivered', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  ];

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'placed': return 0;
      case 'accepted_vendor': return 1;
      case 'preparing': return 2;
      case 'ready_for_pickup': return 3;
      case 'out_for_delivery': return 4;
      case 'delivered': return 5;
      case 'cancelled': return -1;
      default: return 0;
    }
  };

  return (
    <div className="space-y-8 pb-20 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-stone-900">
            My Orders & Tracking
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Real-time status updates and delivery confirmation codes for your meals
          </p>
        </div>
        <button
          onClick={onBackToBrowse}
          className="text-xs font-bold text-brand-600 hover:text-brand-700 bg-orange-50 hover:bg-orange-100 px-4 py-2 rounded-xl transition-colors"
        >
          Browse More Food
        </button>
      </div>

      {customerOrders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-stone-200 p-8 space-y-4">
          <div className="w-16 h-16 rounded-full bg-orange-50 text-brand-500 flex items-center justify-center mx-auto text-2xl">
            🍲
          </div>
          <h3 className="text-lg font-bold text-stone-800">No Orders Yet</h3>
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            You haven't placed any orders on AduanePa Fie yet. Explore delicious meals from campus chop bars!
          </p>
          <button
            onClick={onBackToBrowse}
            className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold rounded-2xl shadow-warm transition-all"
          >
            Start Ordering
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {customerOrders.map((order) => {
            const currentStepIdx = getStepIndex(order.status);
            const isCompleted = order.status === 'delivered';
            const isCancelled = order.status === 'cancelled';

            return (
              <div
                key={order.id}
                className={`bg-white rounded-3xl border transition-all duration-200 overflow-hidden shadow-sm ${
                  !isCompleted && !isCancelled 
                    ? 'border-brand-300 ring-2 ring-brand-500/10' 
                    : 'border-stone-200'
                }`}
              >
                {/* Order Top Bar */}
                <div className="p-5 bg-stone-50/80 border-b border-stone-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-orange-100 text-brand-600 flex items-center justify-center font-black text-sm">
                      🍲
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-stone-900">{order.id}</span>
                        <StatusBadge status={order.status} isDisputed={order.disputed} size="sm" />
                      </div>
                      <h3 className="text-sm font-extrabold text-stone-800 mt-0.5">
                        {order.vendorName}
                      </h3>
                    </div>
                  </div>

                  {/* Delivery Code Display for Active Orders */}
                  {!isCompleted && !isCancelled && (
                    <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-brand-600 text-white px-3.5 py-1.5 rounded-2xl shadow-sm">
                      <div className="text-right">
                        <span className="text-[9px] uppercase tracking-wider font-extrabold text-amber-200 block">
                          Delivery OTP Code:
                        </span>
                        <span className="font-mono text-base font-black tracking-widest leading-none">
                          {order.confirmationCode}
                        </span>
                      </div>
                      <button
                        onClick={() => handleCopyCode(order.confirmationCode, order.id)}
                        className="p-1 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                        title="Copy OTP code"
                      >
                        {copiedCodeId === order.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  )}
                </div>

                {/* Stepper Progress Bar */}
                {!isCancelled && (
                  <div className="p-6 border-b border-stone-100 bg-white">
                    <div className="relative flex items-center justify-between">
                      <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-1 bg-stone-200 -z-0">
                        <div 
                          className="h-full bg-brand-500 transition-all duration-500"
                          style={{ width: `${Math.min(100, Math.max(0, (currentStepIdx / (orderSteps.length - 1)) * 100))}%` }}
                        />
                      </div>

                      {orderSteps.map((step, idx) => {
                        const isPassed = idx <= currentStepIdx;
                        const isCurrent = idx === currentStepIdx;

                        return (
                          <div key={step.status} className="relative z-10 flex flex-col items-center">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-sm ${
                                isCurrent
                                  ? 'bg-brand-500 text-white ring-4 ring-orange-100 scale-110'
                                  : isPassed
                                  ? 'bg-stone-900 text-amber-300'
                                  : 'bg-stone-100 text-stone-400 border border-stone-300'
                              }`}
                            >
                              {step.icon}
                            </div>
                            <span className={`text-[10px] font-bold mt-1.5 hidden sm:block ${
                              isCurrent ? 'text-brand-600' : isPassed ? 'text-stone-800' : 'text-stone-400'
                            }`}>
                              {step.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Order Details Body */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                  
                  <div className="md:col-span-7 space-y-3">
                    <h4 className="text-xs font-bold uppercase text-stone-400 tracking-wider">Ordered Items</h4>
                    <div className="space-y-2">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex justify-between items-start text-xs border-b border-stone-100 pb-2">
                          <div>
                            <span className="font-bold text-stone-800">{item.quantity}x {item.name}</span>
                            {item.specialInstructions && (
                              <p className="text-[10px] text-stone-500 italic">"{item.specialInstructions}"</p>
                            )}
                          </div>
                          <span className="font-bold text-stone-900">
                            GH₵ {(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 flex justify-between text-xs text-stone-600">
                      <span>Delivery to: <strong className="text-stone-900">{order.customerLandmark}</strong></span>
                      <span className="font-display font-extrabold text-sm text-brand-600">
                        Total: GH₵ {order.total.toFixed(2)} (Pay on Delivery)
                      </span>
                    </div>
                  </div>

                  <div className="md:col-span-5 bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-3">
                    <h4 className="text-xs font-bold uppercase text-stone-400 tracking-wider">
                      Delivery Courier
                    </h4>

                    {order.riderName ? (
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black">
                            <Bike className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-bold text-stone-900">{order.riderName}</p>
                            <p className="text-[10px] text-stone-500">{order.riderVehicle || 'Campus Courier'}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-stone-700 bg-white p-2 rounded-xl border border-stone-200">
                          <Phone className="w-3.5 h-3.5 text-brand-500" />
                          <span className="font-semibold">{order.riderPhone || '+233 24 555 0192'}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-stone-500 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-amber-500" />
                        <span>Rider will be assigned once kitchen finishes preparation.</span>
                      </div>
                    )}

                    <div className="pt-2 border-t border-stone-200">
                      <div className="text-[10px] text-stone-400 font-bold uppercase mb-1">Latest Update</div>
                      <p className="text-[11px] text-stone-700 font-medium">
                        {order.timeline[order.timeline.length - 1]?.note || 'Order is progressing smoothly.'}
                      </p>
                    </div>

                    {!isCompleted && !order.disputed && (
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setDisputeModalOpen(true);
                        }}
                        className="w-full text-center text-[10px] font-bold text-rose-600 hover:text-rose-700 hover:underline pt-1"
                      >
                        Report an issue with this order
                      </button>
                    )}
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Dispute Modal */}
      <Modal
        isOpen={disputeModalOpen}
        onClose={() => setDisputeModalOpen(false)}
        title="Report an Issue"
        subtitle={`Order #${selectedOrder?.id}`}
        maxWidth="sm"
      >
        <div className="space-y-4">
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-800">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>AduanePa Admin will intervene and contact you & the vendor.</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Describe the issue (e.g. food delayed, wrong item, rider not responding):
            </label>
            <textarea
              rows={3}
              value={disputeReason}
              onChange={(e) => setDisputeReason(e.target.value)}
              className="w-full p-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-rose-500"
              placeholder="Provide details..."
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setDisputeModalOpen(false)}
              className="py-2.5 text-xs font-bold bg-stone-100 hover:bg-stone-200 rounded-xl"
            >
              Cancel
            </button>
            <button
              onClick={handleDisputeSubmit}
              className="py-2.5 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-warm"
            >
              Submit Report
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
};
