import React from 'react';
import { OrderStatus, UserStatus } from '../../types';
import { 
  Clock, 
  CheckCircle2, 
  ChefHat, 
  PackageCheck, 
  Bike, 
  XCircle,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react';

interface StatusBadgeProps {
  status: OrderStatus | UserStatus;
  size?: 'sm' | 'md' | 'lg';
  isDisputed?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  size = 'md',
  isDisputed = false 
}) => {
  const getStatusConfig = (s: OrderStatus | UserStatus) => {
    switch (s) {
      case 'placed':
        return {
          label: 'Order Placed',
          icon: <Clock className="w-3.5 h-3.5" />,
          bg: 'bg-amber-100 text-amber-900 border-amber-300',
        };
      case 'accepted_vendor':
        return {
          label: 'Accepted by Vendor',
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />,
          bg: 'bg-blue-50 text-blue-900 border-blue-200',
        };
      case 'preparing':
        return {
          label: 'Kitchen Preparing',
          icon: <ChefHat className="w-3.5 h-3.5 text-orange-600 animate-pulse" />,
          bg: 'bg-orange-100 text-orange-950 border-orange-300',
        };
      case 'ready_for_pickup':
        return {
          label: 'Ready for Pickup',
          icon: <PackageCheck className="w-3.5 h-3.5 text-emerald-600" />,
          bg: 'bg-emerald-100 text-emerald-950 border-emerald-300',
        };
      case 'out_for_delivery':
        return {
          label: 'Out for Delivery',
          icon: <Bike className="w-3.5 h-3.5 text-purple-600 animate-bounce" />,
          bg: 'bg-purple-100 text-purple-950 border-purple-300',
        };
      case 'delivered':
        return {
          label: 'Delivered',
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-green-700" />,
          bg: 'bg-green-100 text-green-950 border-green-400',
        };
      case 'cancelled':
        return {
          label: 'Cancelled',
          icon: <XCircle className="w-3.5 h-3.5 text-rose-600" />,
          bg: 'bg-rose-100 text-rose-950 border-rose-300',
        };
      case 'approved':
        return {
          label: 'Verified & Active',
          icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />,
          bg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
        };
      case 'pending':
        return {
          label: 'Pending Approval',
          icon: <Clock className="w-3.5 h-3.5 text-amber-600" />,
          bg: 'bg-amber-100 text-amber-900 border-amber-300',
        };
      case 'rejected':
      case 'suspended':
        return {
          label: s === 'rejected' ? 'Rejected' : 'Suspended',
          icon: <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />,
          bg: 'bg-rose-100 text-rose-900 border-rose-300',
        };
      default:
        return {
          label: status,
          icon: <Clock className="w-3.5 h-3.5" />,
          bg: 'bg-stone-100 text-stone-800 border-stone-300',
        };
    }
  };

  const config = getStatusConfig(status);

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 gap-2',
  }[size];

  return (
    <div className="inline-flex items-center gap-1.5">
      <span className={`inline-flex items-center font-bold rounded-full border shadow-2xs ${config.bg} ${sizeClasses}`}>
        {config.icon}
        <span>{config.label}</span>
      </span>
      {isDisputed && (
        <span className="inline-flex items-center gap-1 text-[11px] font-black bg-rose-600 text-white px-2 py-0.5 rounded-full animate-pulse shadow-sm">
          <AlertTriangle className="w-3 h-3" />
          Dispute Flagged
        </span>
      )}
    </div>
  );
};
