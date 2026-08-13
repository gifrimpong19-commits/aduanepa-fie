import React from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { Order, Vendor } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { 
  Clock, 
  ChefHat, 
  PackageCheck, 
  Bike, 
  CheckCircle2, 
  Phone, 
  MapPin, 
  XCircle
} from 'lucide-react';

interface OrderManagerProps {
  currentVendor: Vendor;
}

export const OrderManager: React.FC<OrderManagerProps> = ({ currentVendor }) => {
  const { orders, updateOrderStatus, cancelOrder } = useMarketplace();

  const vendorOrders = orders.filter(o => o.vendorId === currentVendor.id);

  const pendingOrders = vendorOrders.filter(o => o.status === 'placed');
  const activeOrders = vendorOrders.filter(o => ['accepted_vendor', 'preparing', 'ready_for_pickup', 'out_for_delivery'].includes(o.status));
  const completedOrders = vendorOrders.filter(o => ['delivered', 'cancelled'].includes(o.status));

  const handleAction = (order: Order, nextStatus: 'accepted_vendor' | 'preparing' | 'ready_for_pickup') => {
    let note = '';
    if (nextStatus === 'accepted_vendor') note = 'Vendor accepted order and started kitchen queue.';
    if (nextStatus === 'preparing') note = 'Kitchen is cooking and packaging the meal.';
    if (nextStatus === 'ready_for_pickup') note = 'Order is packed and ready for rider pickup at the counter.';
    
    updateOrderStatus(order.id, nextStatus, note);
  };

  return (
    <div className="space-y-6">
      
      {pendingOrders.length > 0 && (
        <div className="bg-amber-500 text-stone-950 p-4 rounded-3xl shadow-warm flex items-center justify-between gap-4 animate-soft-pulse">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-stone-950 text-amber-400 flex items-center justify-center font-black text-lg">
              🔔
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-stone-950">
                {pendingOrders.length} New Incoming Order{pendingOrders.length > 1 ? 's' : ''} Awaiting Acceptance!
              </h4>
              <p className="text-xs text-stone-800 font-medium">
                Review items and accept before preparation time starts.
              </p>
            </div>
          </div>
          <span className="bg-stone-950 text-white text-xs font-black px-3 py-1.5 rounded-xl">
            Action Required
          </span>
        </div>
      )}

      <div className="space-y-4">
        <h3 className="font-display font-extrabold text-lg text-stone-900 flex items-center gap-2">
          <span>Active Kitchen Queue</span>
          <span className="text-xs font-bold bg-brand-100 text-brand-800 px-2.5 py-0.5 rounded-full">
            {pendingOrders.length + activeOrders.length} active
          </span>
        </h3>

        {pendingOrders.length === 0 && activeOrders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 p-8 space-y-2">
            <div className="w-14 h-14 rounded-full bg-orange-50 text-brand-500 flex items-center justify-center mx-auto text-2xl">
              🍳
            </div>
            <h4 className="font-bold text-stone-800 text-sm">No Active Orders Right Now</h4>
            <p className="text-xs text-stone-400 max-w-sm mx-auto">
              New orders from students at {currentVendor.locationDetails} will appear here with live notifications.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {[...pendingOrders, ...activeOrders].map((order) => {
              return (
                <div 
                  key={order.id}
                  className={`bg-white rounded-3xl border p-5 space-y-4 shadow-sm transition-all ${
                    order.status === 'placed' 
                      ? 'border-amber-400 ring-4 ring-amber-100' 
                      : 'border-stone-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 border-b border-stone-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-sm text-stone-900">{order.id}</span>
                        <StatusBadge status={order.status} isDisputed={order.disputed} size="sm" />
                      </div>
                      <p className="text-xs text-stone-500 mt-0.5">
                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} &bull; Pay on Delivery
                      </p>
                    </div>

                    <span className="font-display font-extrabold text-base text-brand-600">
                      GH₵ {order.total.toFixed(2)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs bg-stone-50 p-3 rounded-2xl border border-stone-100">
                    <div>
                      <span className="text-[10px] text-stone-400 font-bold uppercase block">Customer</span>
                      <p className="font-bold text-stone-900 truncate">{order.customerName}</p>
                      <p className="text-[11px] text-stone-600 flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 text-brand-500" />
                        <span>{order.customerPhone}</span>
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] text-stone-400 font-bold uppercase block">Dropoff Landmark</span>
                      <p className="font-bold text-stone-900 truncate flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-brand-500 flex-shrink-0" />
                        <span>{order.customerLandmark}</span>
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <span className="text-[10px] font-bold uppercase text-stone-400 tracking-wider block">
                      Ordered Dishes:
                    </span>
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-stone-50/60 px-3 py-1.5 rounded-xl">
                        <div>
                          <span className="font-bold text-stone-800">{item.quantity}x {item.name}</span>
                          {item.specialInstructions && (
                            <p className="text-[10px] text-brand-700 italic">"{item.specialInstructions}"</p>
                          )}
                        </div>
                        <span className="font-semibold text-stone-700">
                          GH₵ {(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {order.riderName && (
                    <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl flex items-center gap-2 text-xs text-emerald-900">
                      <Bike className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>Rider: <strong>{order.riderName}</strong> ({order.riderVehicle})</span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-stone-100 flex items-center gap-2">
                    {order.status === 'placed' && (
                      <>
                        <button
                          onClick={() => handleAction(order, 'accepted_vendor')}
                          className="flex-1 py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold rounded-xl shadow-warm flex items-center justify-center gap-1.5 transition-all"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Accept Order</span>
                        </button>
                        <button
                          onClick={() => cancelOrder(order.id, 'Vendor currently out of stock')}
                          className="py-2.5 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl transition-colors"
                          title="Decline"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </>
                    )}

                    {order.status === 'accepted_vendor' && (
                      <button
                        onClick={() => handleAction(order, 'preparing')}
                        className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-bold rounded-xl shadow-warm flex items-center justify-center gap-1.5 transition-all"
                      >
                        <ChefHat className="w-4 h-4" />
                        <span>Start Kitchen Preparation</span>
                      </button>
                    )}

                    {order.status === 'preparing' && (
                      <button
                        onClick={() => handleAction(order, 'ready_for_pickup')}
                        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-warm flex items-center justify-center gap-1.5 transition-all"
                      >
                        <PackageCheck className="w-4 h-4" />
                        <span>Mark Ready for Rider Pickup</span>
                      </button>
                    )}

                    {order.status === 'ready_for_pickup' && (
                      <div className="w-full py-2 bg-stone-100 text-stone-600 text-xs font-bold rounded-xl text-center flex items-center justify-center gap-2">
                        <Clock className="w-4 h-4 text-brand-500 animate-spin" />
                        <span>Ready at Counter &bull; Waiting for Rider Acceptance</span>
                      </div>
                    )}

                    {order.status === 'out_for_delivery' && (
                      <div className="w-full py-2 bg-purple-50 text-purple-900 border border-purple-200 text-xs font-bold rounded-xl text-center flex items-center justify-center gap-2">
                        <Bike className="w-4 h-4 text-purple-600" />
                        <span>Picked up by {order.riderName} &bull; Out for Delivery</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {completedOrders.length > 0 && (
        <div className="pt-6 border-t border-stone-200 space-y-3">
          <h3 className="font-display font-bold text-base text-stone-800">
            Completed / Past Orders ({completedOrders.length})
          </h3>
          <div className="space-y-2">
            {completedOrders.map((order) => (
              <div 
                key={order.id}
                className="bg-white p-3.5 rounded-2xl border border-stone-200 flex items-center justify-between text-xs text-stone-600"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-stone-900">{order.id}</span>
                  <StatusBadge status={order.status} size="sm" />
                  <span className="hidden sm:inline font-semibold">{order.customerName}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-stone-900">GH₵ {order.total.toFixed(2)}</span>
                  <span className="text-[11px] text-stone-400">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
