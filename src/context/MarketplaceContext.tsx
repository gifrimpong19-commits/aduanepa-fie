import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Role, 
  OrderStatus, 
  Vendor, 
  ProductItem, 
  RiderProfile, 
  Order, 
  UserProfile, 
  GhanaianUniversity, 
  Cart,
  AuditLog,
  UserSession,
  CartItem
} from '../types';
import { GHANAIAN_UNIVERSITIES } from '../data/universities';
import { 
  INITIAL_VENDORS, 
  INITIAL_PRODUCTS, 
  INITIAL_RIDERS, 
  INITIAL_ORDERS, 
  INITIAL_USERS,
  INITIAL_AUDIT_LOGS,
  INITIAL_SESSIONS
} from '../data/mockData';

interface MarketplaceContextType {
  // Navigation & Role
  currentRole: Role;
  setCurrentRole: (role: Role) => void;
  currentUser: UserProfile;
  setCurrentUser: (user: UserProfile) => void;
  activeUniversity: GhanaianUniversity;
  setActiveUniversity: (uni: GhanaianUniversity) => void;
  
  // Data entities
  universities: GhanaianUniversity[];
  vendors: Vendor[];
  products: ProductItem[];
  riders: RiderProfile[];
  orders: Order[];
  users: UserProfile[];
  
  // Cart operations
  cart: Cart;
  addToCart: (product: ProductItem, quantity?: number, specialInstructions?: string) => { success: boolean; requiresClearCart?: boolean };
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  
  // Order operations
  createOrder: (landmark: string, phone: string) => Order | null;
  updateOrderStatus: (orderId: string, status: OrderStatus, note?: string, riderDetails?: Partial<RiderProfile>) => boolean;
  completeDeliveryWithCode: (orderId: string, enteredCode: string, riderId: string) => { success: boolean; error?: string };
  cancelOrder: (orderId: string, reason?: string) => void;
  disputeOrder: (orderId: string, reason: string) => void;
  
  // Vendor operations
  addVendor: (vendor: Omit<Vendor, 'id' | 'uniqueIdCode' | 'status' | 'createdAt'>) => Vendor;
  updateVendor: (vendorId: string, updates: Partial<Vendor>) => void;
  toggleVendorOpen: (vendorId: string) => void;
  addProduct: (product: Omit<ProductItem, 'id'>) => ProductItem;
  updateProduct: (productId: string, updates: Partial<ProductItem>) => void;
  deleteProduct: (productId: string) => void;
  
  // Rider operations
  addRider: (rider: Omit<RiderProfile, 'id' | 'uniqueIdCode' | 'status' | 'createdAt' | 'totalDeliveries' | 'rating'>) => RiderProfile;
  acceptRiderJob: (orderId: string, riderId: string) => boolean;
  
  // Admin operations
  approveUserStatus: (type: 'vendor' | 'rider' | 'customer', id: string) => void;
  rejectUserStatus: (type: 'vendor' | 'rider' | 'customer', id: string, reason?: string) => void;
  addUniversity: (uni: GhanaianUniversity) => void;
  
  // Security & Audit Logs
  auditLogs: AuditLog[];
  activeSessions: UserSession[];
  logSecurityEvent: (event: Omit<AuditLog, 'id' | 'timestamp'>) => void;
  clearAuditLogs: () => void;

  // Auth & Guest state
  isGuest: boolean;
  setIsGuest: (isGuest: boolean) => void;
  logout: () => void;
  loginAs: (role: Role, customId?: string) => void;
  signupCustomer: (data: { name: string; email: string; phone: string; universityId: string; landmark: string }) => UserProfile;
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

// Storage key version to ensure all devices immediately load authentic African avatars & updated contact
const STORAGE_PREFIX = 'aduanepa_v3_';

export const MarketplaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Clear legacy v1 and v2 localStorage keys if present on device
  useEffect(() => {
    [
      'aduanepa_users', 'aduanepa_riders', 'aduanepa_current_user', 'aduanepa_vendors',
      'aduanepa_v2_users', 'aduanepa_v2_riders', 'aduanepa_v2_current_user', 'aduanepa_v2_vendors', 'aduanepa_v2_orders'
    ].forEach(key => {
      localStorage.removeItem(key);
    });
  }, []);

  const [universities, setUniversities] = useState<GhanaianUniversity[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}universities`);
    return saved ? JSON.parse(saved) : GHANAIAN_UNIVERSITIES;
  });

  const [activeUniversity, setActiveUniversity] = useState<GhanaianUniversity>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}active_uni`);
    return saved ? JSON.parse(saved) : GHANAIAN_UNIVERSITIES[0];
  });

  const [vendors, setVendors] = useState<Vendor[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}vendors`);
    return saved ? JSON.parse(saved) : INITIAL_VENDORS;
  });

  const [products, setProducts] = useState<ProductItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}products`);
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [riders, setRiders] = useState<RiderProfile[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}riders`);
    return saved ? JSON.parse(saved) : INITIAL_RIDERS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}orders`);
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [users, setUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}users`);
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentRole, setCurrentRole] = useState<Role>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}current_role`);
    return (saved as Role) || 'customer';
  });

  const [isGuest, setIsGuest] = useState<boolean>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}is_guest`);
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}current_user`);
    return saved ? JSON.parse(saved) : INITIAL_USERS[0];
  });

  const logout = () => {
    setIsGuest(true);
    setCurrentUser(INITIAL_USERS[0]);
    localStorage.setItem(`${STORAGE_PREFIX}is_guest`, JSON.stringify(true));
    localStorage.removeItem(`${STORAGE_PREFIX}current_user`);
  };

  const [cart, setCart] = useState<Cart>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}cart`);
    return saved ? JSON.parse(saved) : { vendorId: null, items: [] };
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}audit_logs`);
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [activeSessions, setActiveSessions] = useState<UserSession[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}active_sessions`);
    return saved ? JSON.parse(saved) : INITIAL_SESSIONS;
  });

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}audit_logs`, JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}active_sessions`, JSON.stringify(activeSessions));
  }, [activeSessions]);

  const logSecurityEvent = (event: Omit<AuditLog, 'id' | 'timestamp'>) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      ...event
    };
    setAuditLogs(prev => [newLog, ...prev.slice(0, 99)]);
  };

  const clearAuditLogs = () => {
    setAuditLogs([]);
    localStorage.removeItem(`${STORAGE_PREFIX}audit_logs`);
  };

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}universities`, JSON.stringify(universities));
  }, [universities]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}active_uni`, JSON.stringify(activeUniversity));
  }, [activeUniversity]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}vendors`, JSON.stringify(vendors));
  }, [vendors]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}products`, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}riders`, JSON.stringify(riders));
  }, [riders]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}orders`, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}users`, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}current_role`, currentRole);
  }, [currentRole]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}current_user`, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}cart`, JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: ProductItem, quantity = 1, specialInstructions?: string) => {
    if (cart.vendorId && cart.vendorId !== product.vendorId && cart.items.length > 0) {
      return { success: false, requiresClearCart: true };
    }

    setCart(prev => {
      const existingItemIndex = prev.items.findIndex(item => item.product.id === product.id);
      let updatedItems: CartItem[];

      if (existingItemIndex > -1) {
        updatedItems = prev.items.map((item, idx) => 
          idx === existingItemIndex 
            ? { ...item, quantity: item.quantity + quantity, specialInstructions: specialInstructions || item.specialInstructions }
            : item
        );
      } else {
        updatedItems = [...prev.items, { product, quantity, specialInstructions }];
      }

      return {
        vendorId: product.vendorId,
        items: updatedItems,
      };
    });

    return { success: true };
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => {
      const filtered = prev.items.filter(item => item.product.id !== productId);
      return {
        vendorId: filtered.length > 0 ? prev.vendorId : null,
        items: filtered,
      };
    });
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => ({
      ...prev,
      items: prev.items.map(item => 
        item.product.id === productId ? { ...item, quantity } : item
      ),
    }));
  };

  const clearCart = () => {
    setCart({ vendorId: null, items: [] });
  };

  const createOrder = (landmark: string, phone: string): Order | null => {
    if (!cart.vendorId || cart.items.length === 0) return null;

    const vendor = vendors.find(v => v.id === cart.vendorId);
    if (!vendor) return null;

    const subtotal = cart.items.reduce((sum, item) => {
      const discountedPrice = item.product.discountPercentage 
        ? item.product.price * (1 - item.product.discountPercentage / 100)
        : item.product.price;
      return sum + (discountedPrice * item.quantity);
    }, 0);

    const deliveryFee = vendor.deliveryFee || 10;
    const total = subtotal + deliveryFee;

    const randomCode = Math.floor(1000 + Math.random() * 9000).toString();
    const orderNumber = `ADP-ORD-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: Order = {
      id: orderNumber,
      confirmationCode: randomCode,
      customerId: currentUser.id,
      customerName: currentUser.name || 'Ama Osei',
      customerPhone: phone || currentUser.phone || '+233 54 000 0000',
      customerLandmark: landmark || currentUser.landmark || 'Campus Hall',
      universityId: vendor.universityId,
      vendorId: vendor.id,
      vendorName: vendor.businessName,
      items: cart.items.map(item => ({
        productId: item.product.id,
        name: item.product.name,
        price: item.product.discountPercentage 
          ? item.product.price * (1 - item.product.discountPercentage / 100)
          : item.product.price,
        quantity: item.quantity,
        specialInstructions: item.specialInstructions,
      })),
      subtotal: Math.round(subtotal * 100) / 100,
      deliveryFee,
      total: Math.round(total * 100) / 100,
      paymentMethod: 'pay_on_delivery',
      status: 'placed',
      createdAt: new Date().toISOString(),
      timeline: [
        {
          status: 'placed',
          timestamp: new Date().toISOString(),
          note: 'Order submitted. Payment method: Pay on Delivery (Cash/MoMo at handoff).'
        }
      ]
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (
    orderId: string, 
    status: OrderStatus, 
    note?: string, 
    riderDetails?: Partial<RiderProfile>
  ): boolean => {
    setOrders(prev => prev.map(order => {
      if (order.id !== orderId) return order;

      const updatedTimeline = [
        ...order.timeline,
        {
          status,
          timestamp: new Date().toISOString(),
          note: note || `Status updated to ${status.replace('_', ' ')}`
        }
      ];

      return {
        ...order,
        status,
        ...(riderDetails ? {
          riderId: riderDetails.id || order.riderId,
          riderName: riderDetails.name || order.riderName,
          riderPhone: riderDetails.phone || order.riderPhone,
          riderVehicle: riderDetails.vehicleType 
            ? `${riderDetails.vehicleType} (${riderDetails.vehicleRegNumber || 'Reg'})` 
            : order.riderVehicle,
        } : {}),
        timeline: updatedTimeline,
      };
    }));

    return true;
  };

  const acceptRiderJob = (orderId: string, riderId: string): boolean => {
    const rider = riders.find(r => r.id === riderId);
    if (!rider) return false;

    return updateOrderStatus(
      orderId, 
      'out_for_delivery', 
      `Rider ${rider.name} accepted job & is en route to pick up / deliver.`,
      rider
    );
  };

  const completeDeliveryWithCode = (orderId: string, enteredCode: string, riderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return { success: false, error: 'Order not found' };

    if (order.confirmationCode.trim() !== enteredCode.trim()) {
      return { 
        success: false, 
        error: `Invalid confirmation code! Customer's 4-digit code is required to close this Pay on Delivery order.` 
      };
    }

    updateOrderStatus(orderId, 'delivered', 'Delivery confirmed with customer OTP code. Payment collected.');

    setRiders(prev => prev.map(r => r.id === riderId ? { ...r, totalDeliveries: r.totalDeliveries + 1 } : r));

    return { success: true };
  };

  const cancelOrder = (orderId: string, reason?: string) => {
    updateOrderStatus(orderId, 'cancelled', reason || 'Order cancelled.');
  };

  const disputeOrder = (orderId: string, reason: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, disputed: true, disputeReason: reason } : o));
  };

  const addVendor = (vendorData: Omit<Vendor, 'id' | 'uniqueIdCode' | 'status' | 'createdAt'>): Vendor => {
    const newId = `vnd-${Date.now()}`;
    const uniqueCode = `ADP-VND-${Math.floor(1000 + Math.random() * 9000)}`;
    const newVendor: Vendor = {
      ...vendorData,
      id: newId,
      uniqueIdCode: uniqueCode,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setVendors(prev => [newVendor, ...prev]);
    return newVendor;
  };

  const updateVendor = (vendorId: string, updates: Partial<Vendor>) => {
    setVendors(prev => prev.map(v => v.id === vendorId ? { ...v, ...updates } : v));
  };

  const toggleVendorOpen = (vendorId: string) => {
    setVendors(prev => prev.map(v => v.id === vendorId ? { ...v, isManuallyOpen: !v.isManuallyOpen } : v));
  };

  const addProduct = (productData: Omit<ProductItem, 'id'>): ProductItem => {
    const newProduct: ProductItem = {
      ...productData,
      id: `prod-${Date.now()}`,
    };
    setProducts(prev => [newProduct, ...prev]);
    return newProduct;
  };

  const updateProduct = (productId: string, updates: Partial<ProductItem>) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, ...updates } : p));
  };

  const deleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  const addRider = (riderData: Omit<RiderProfile, 'id' | 'uniqueIdCode' | 'status' | 'createdAt' | 'totalDeliveries' | 'rating'>): RiderProfile => {
    const newRider: RiderProfile = {
      ...riderData,
      id: `rdr-${Date.now()}`,
      uniqueIdCode: `ADP-RDR-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'pending',
      totalDeliveries: 0,
      rating: 5.0,
      createdAt: new Date().toISOString(),
    };
    setRiders(prev => [newRider, ...prev]);
    return newRider;
  };

  const approveUserStatus = (type: 'vendor' | 'rider' | 'customer', id: string) => {
    if (type === 'vendor') {
      setVendors(prev => prev.map(v => v.id === id ? { ...v, status: 'approved' } : v));
    } else if (type === 'rider') {
      setRiders(prev => prev.map(r => r.id === id ? { ...r, status: 'approved' } : r));
    } else {
      setUsers(prev => prev.map(u => u.id === id ? { ...u, status: 'approved' } : u));
    }
  };

  const rejectUserStatus = (type: 'vendor' | 'rider' | 'customer', id: string) => {
    if (type === 'vendor') {
      setVendors(prev => prev.map(v => v.id === id ? { ...v, status: 'rejected' } : v));
    } else if (type === 'rider') {
      setRiders(prev => prev.map(r => r.id === id ? { ...r, status: 'rejected' } : r));
    } else {
      setUsers(prev => prev.map(u => u.id === id ? { ...u, status: 'rejected' } : u));
    }
  };

  const addUniversity = (uni: GhanaianUniversity) => {
    setUniversities(prev => [...prev, uni]);
  };

  const loginAs = (role: Role, customId?: string) => {
    setCurrentRole(role);
    if (role === 'customer') {
      const cust = users.find(u => u.role === 'customer') || INITIAL_USERS[0];
      setCurrentUser(cust);
    } else if (role === 'vendor') {
      const vendorUser = users.find(u => u.role === 'vendor') || INITIAL_USERS[1];
      setCurrentUser(vendorUser);
    } else if (role === 'rider') {
      const rider = riders.find(r => customId ? r.id === customId : true) || INITIAL_RIDERS[0];
      setCurrentUser({
        id: rider.id,
        name: rider.name,
        email: rider.email,
        phone: rider.phone,
        role: 'rider',
        status: rider.status,
        avatarUrl: rider.avatarUrl,
        universityId: rider.universityId,
        region: rider.region,
        city: rider.city,
        createdAt: rider.createdAt,
      });
    } else if (role === 'admin') {
      const adminUser = users.find(u => u.role === 'admin') || INITIAL_USERS[2];
      setCurrentUser(adminUser);
    }
  };

  const signupCustomer = (data: { name: string; email: string; phone: string; universityId: string; landmark: string }): UserProfile => {
    const uni = universities.find(u => u.id === data.universityId) || activeUniversity;
    const newCust: UserProfile = {
      id: `usr-cust-${Date.now()}`,
      uniqueIdCode: `ADP-CUST-${Math.floor(1000 + Math.random() * 9000)}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: 'customer',
      status: 'approved',
      avatarUrl: `https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(data.name)}&skinColor=8d5524,763900,614335&hairColor=000000`,
      universityId: data.universityId,
      region: uni.region,
      city: uni.city,
      landmark: data.landmark,
      createdAt: new Date().toISOString(),
    };

    setUsers(prev => [newCust, ...prev]);
    setCurrentUser(newCust);
    setIsGuest(false);
    localStorage.setItem(`${STORAGE_PREFIX}is_guest`, JSON.stringify(false));
    setCurrentRole('customer');
    return newCust;
  };

  return (
    <MarketplaceContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        isGuest,
        setIsGuest,
        logout,
        currentUser,
        setCurrentUser,
        activeUniversity,
        setActiveUniversity,
        universities,
        vendors,
        products,
        riders,
        orders,
        users,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        createOrder,
        updateOrderStatus,
        completeDeliveryWithCode,
        cancelOrder,
        disputeOrder,
        addVendor,
        updateVendor,
        toggleVendorOpen,
        addProduct,
        updateProduct,
        deleteProduct,
        addRider,
        acceptRiderJob,
        approveUserStatus,
        rejectUserStatus,
        addUniversity,
        auditLogs,
        activeSessions,
        logSecurityEvent,
        clearAuditLogs,
        loginAs,
        signupCustomer,
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
};

export const useMarketplace = () => {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error('useMarketplace must be used within a MarketplaceProvider');
  }
  return context;
};
