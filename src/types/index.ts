export type Role = 'customer' | 'vendor' | 'rider' | 'admin';

export type UserStatus = 'pending' | 'approved' | 'rejected' | 'suspended';

export interface GhanaianUniversity {
  id: string;
  name: string;
  shortName: string;
  region: string;
  city: string;
  campusName: string;
  popularLandmarks: string[];
  bannerImage: string;
}

export interface UserProfile {
  id: string;
  uniqueIdCode?: string; // e.g. ADP-CUST-8812 or ADP-VND-4912
  name: string;
  email: string;
  phone: string;
  role: Role;
  status: UserStatus;
  avatarUrl?: string;
  universityId: string;
  region: string;
  city: string;
  landmark?: string;
  gpsCoords?: { lat: number; lng: number };
  createdAt: string;
}

export interface OperatingHours {
  open: string; // e.g. "08:00"
  close: string; // e.g. "21:00"
  daysOpen: string[]; // e.g. ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
}

export interface Vendor {
  id: string;
  ownerId: string;
  uniqueIdCode: string;
  businessName: string;
  ownerName: string;
  tagline: string;
  logo: string;
  bannerImage: string;
  universityId: string;
  region: string;
  city: string;
  locationDetails: string;
  operatingHours: OperatingHours;
  isManuallyOpen: boolean;
  status: UserStatus;
  certificateDocName?: string;
  categories: string[];
  rating: number;
  deliveryTimeEstimate: string; // e.g. "20-35 mins"
  minOrder: number; // in GHS
  deliveryFee: number; // in GHS
  createdAt: string;
}

export interface ProductItem {
  id: string;
  vendorId: string;
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  price: number; // in GHS (Ghanaian Cedi)
  discountPercentage?: number; // e.g. 10 for 10% off
  image: string;
  isAvailable: boolean;
  preparationTimeMinutes: number;
  dietaryTags?: string[]; // e.g. ["Spicy", "Vegetarian", "Popular", "Local Special"]
}

export interface CartItem {
  product: ProductItem;
  quantity: number;
  specialInstructions?: string;
}

export interface Cart {
  vendorId: string | null;
  items: CartItem[];
}

export type OrderStatus = 
  | 'placed'             // Customer placed order
  | 'accepted_vendor'    // Vendor accepted
  | 'preparing'          // Vendor is cooking/packaging
  | 'ready_for_pickup'   // Ready at counter
  | 'out_for_delivery'   // Rider picked up
  | 'delivered'          // Rider entered customer confirmation code
  | 'cancelled';

export interface OrderItemSummary {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  specialInstructions?: string;
}

export interface Order {
  id: string; // e.g. "ADP-ORD-9021"
  confirmationCode: string; // 4-digit code e.g. "7392" given to rider on delivery
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerLandmark: string;
  universityId: string;
  vendorId: string;
  vendorName: string;
  riderId?: string;
  riderName?: string;
  riderPhone?: string;
  riderVehicle?: string;
  items: OrderItemSummary[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: 'pay_on_delivery';
  status: OrderStatus;
  createdAt: string;
  timeline: {
    status: OrderStatus;
    timestamp: string;
    note?: string;
  }[];
  disputed?: boolean;
  disputeReason?: string;
}

export type VehicleType = 'Bicycle' | 'Motorbike' | 'Car';

export interface RiderProfile {
  id: string;
  uniqueIdCode: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl: string;
  vehicleType: VehicleType;
  vehicleRegNumber: string;
  universityId: string;
  region: string;
  city: string;
  status: UserStatus;
  licenseDocName?: string;
  vehicleDocName?: string;
  isAvailable: boolean;
  totalDeliveries: number;
  rating: number;
  createdAt: string;
}
