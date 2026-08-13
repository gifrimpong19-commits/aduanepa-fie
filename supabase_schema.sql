-- ==========================================================
-- AduanePa Fie ("Good Food, Home") - Production Database Schema
-- Multi-Sided Ghanaian University Food Delivery Marketplace
-- ==========================================================

-- 1. Universities Taxonomy
CREATE TABLE IF NOT EXISTS universities (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    short_name VARCHAR(64) NOT NULL,
    region VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    campus_name VARCHAR(255) NOT NULL,
    popular_landmarks JSONB DEFAULT '[]'::jsonb,
    banner_image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Users Profile (Customers, Vendors, Riders, Admin)
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    unique_id_code VARCHAR(32) UNIQUE NOT NULL, -- e.g. ADP-CUST-1001, ADP-VND-8101
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(32) NOT NULL,
    role VARCHAR(32) NOT NULL CHECK (role IN ('customer', 'vendor', 'rider', 'admin')),
    status VARCHAR(32) NOT NULL DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected', 'suspended')),
    avatar_url TEXT,
    university_id VARCHAR(64) REFERENCES universities(id),
    region VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    default_landmark TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Vendors
CREATE TABLE IF NOT EXISTS vendors (
    id VARCHAR(64) PRIMARY KEY,
    owner_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    unique_id_code VARCHAR(32) UNIQUE NOT NULL,
    business_name VARCHAR(255) NOT NULL,
    owner_name VARCHAR(255) NOT NULL,
    tagline TEXT,
    logo_url TEXT,
    banner_image TEXT,
    university_id VARCHAR(64) REFERENCES universities(id),
    region VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    location_details TEXT NOT NULL,
    operating_hours JSONB NOT NULL DEFAULT '{"open": "08:00", "close": "21:30", "daysOpen": ["Mon","Tue","Wed","Thu","Fri","Sat"]}'::jsonb,
    is_manually_open BOOLEAN DEFAULT TRUE,
    status VARCHAR(32) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'suspended')),
    certificate_doc_name TEXT,
    categories JSONB DEFAULT '[]'::jsonb,
    rating NUMERIC(3, 2) DEFAULT 5.0,
    delivery_time_estimate VARCHAR(32) DEFAULT '20-30 mins',
    min_order NUMERIC(10, 2) DEFAULT 20.00,
    delivery_fee NUMERIC(10, 2) DEFAULT 10.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Products / Menu Dishes
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(64) PRIMARY KEY,
    vendor_id VARCHAR(64) REFERENCES vendors(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    discount_percentage NUMERIC(5, 2) DEFAULT 0,
    image_url TEXT,
    is_available BOOLEAN DEFAULT TRUE,
    preparation_time_minutes INT DEFAULT 15,
    dietary_tags JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Delivery Riders
CREATE TABLE IF NOT EXISTS riders (
    id VARCHAR(64) PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    unique_id_code VARCHAR(32) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(32) NOT NULL,
    avatar_url TEXT,
    vehicle_type VARCHAR(32) NOT NULL CHECK (vehicle_type IN ('Bicycle', 'Motorbike', 'Car')),
    vehicle_reg_number VARCHAR(64) NOT NULL,
    university_id VARCHAR(64) REFERENCES universities(id),
    region VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    status VARCHAR(32) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'suspended')),
    license_doc_name TEXT,
    vehicle_doc_name TEXT,
    is_available BOOLEAN DEFAULT TRUE,
    total_deliveries INT DEFAULT 0,
    rating NUMERIC(3, 2) DEFAULT 5.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Orders
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(64) PRIMARY KEY, -- e.g. ADP-ORD-7401
    confirmation_code VARCHAR(8) NOT NULL, -- 4-digit code e.g. '6824'
    customer_id UUID REFERENCES user_profiles(id),
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(32) NOT NULL,
    customer_landmark TEXT NOT NULL,
    university_id VARCHAR(64) REFERENCES universities(id),
    vendor_id VARCHAR(64) REFERENCES vendors(id),
    vendor_name VARCHAR(255) NOT NULL,
    rider_id VARCHAR(64) REFERENCES riders(id),
    rider_name VARCHAR(255),
    rider_phone VARCHAR(32),
    rider_vehicle VARCHAR(100),
    items JSONB NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL,
    delivery_fee NUMERIC(10, 2) NOT NULL,
    total NUMERIC(10, 2) NOT NULL,
    payment_method VARCHAR(32) DEFAULT 'pay_on_delivery',
    status VARCHAR(32) NOT NULL CHECK (status IN ('placed', 'accepted_vendor', 'preparing', 'ready_for_pickup', 'out_for_delivery', 'delivered', 'cancelled')),
    disputed BOOLEAN DEFAULT FALSE,
    dispute_reason TEXT,
    timeline JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_vendors_university ON vendors(university_id);
CREATE INDEX IF NOT EXISTS idx_products_vendor ON products(vendor_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_vendor ON orders(vendor_id);
CREATE INDEX IF NOT EXISTS idx_orders_rider ON orders(rider_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- Security: Row Level Security (RLS) Enablement
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE riders ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
