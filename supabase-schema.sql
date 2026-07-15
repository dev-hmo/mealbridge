-- MealBridge Database Schema
-- Run this in Supabase SQL Editor

-- Profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'both' CHECK (role IN ('vendor', 'receiver', 'both')),
  phone TEXT,
  neighborhood TEXT,
  city TEXT,
  latitude DECIMAL(9,6),
  longitude DECIMAL(9,6),
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Food listings table
CREATE TABLE food_listings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT CHECK (category IN ('cooked_meal', 'raw_ingredients', 'bakery', 'produce', 'packaged', 'other')),
  quantity INTEGER DEFAULT 1,
  quantity_unit TEXT DEFAULT 'portions' CHECK (quantity_unit IN ('portions', 'kg', 'items', 'liters')),
  servings INTEGER DEFAULT 1,
  dietary_info TEXT[] DEFAULT '{}',
  photo_urls TEXT[] DEFAULT '{}',
  pickup_location TEXT,
  latitude DECIMAL(9,6),
  longitude DECIMAL(9,6),
  available_from TIMESTAMPTZ DEFAULT NOW(),
  available_until TIMESTAMPTZ,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'claimed', 'rescued', 'expired')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Food claims table
CREATE TABLE food_claims (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID REFERENCES food_listings(id) ON DELETE CASCADE,
  claimer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  quantity_claimed INTEGER DEFAULT 1,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  pickup_time TIMESTAMPTZ,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews table
CREATE TABLE reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID REFERENCES food_listings(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  reviewee_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications table
CREATE TABLE notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('listing_created', 'claim_received', 'claim_confirmed', 'claim_cancelled', 'review_received')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_food_listings_vendor ON food_listings(vendor_id);
CREATE INDEX idx_food_listings_status ON food_listings(status);
CREATE INDEX idx_food_listings_category ON food_listings(category);
CREATE INDEX idx_food_claims_listing ON food_claims(listing_id);
CREATE INDEX idx_food_claims_claimer ON food_claims(claimer_id);
CREATE INDEX idx_reviews_reviewee ON reviews(reviewee_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Food listings policies
CREATE POLICY "Listings are viewable by everyone" ON food_listings FOR SELECT USING (true);
CREATE POLICY "Users can create listings" ON food_listings FOR INSERT WITH CHECK (auth.uid() = vendor_id);
CREATE POLICY "Users can update own listings" ON food_listings FOR UPDATE USING (auth.uid() = vendor_id);
CREATE POLICY "Users can delete own listings" ON food_listings FOR DELETE USING (auth.uid() = vendor_id);

-- Food claims policies
CREATE POLICY "Users can view claims they're involved in" ON food_claims FOR SELECT USING (
  auth.uid() = claimer_id OR 
  auth.uid() IN (SELECT vendor_id FROM food_listings WHERE id = listing_id)
);
CREATE POLICY "Users can create claims" ON food_claims FOR INSERT WITH CHECK (auth.uid() = claimer_id);
CREATE POLICY "Users can update claims they're involved in" ON food_claims FOR UPDATE USING (
  auth.uid() = claimer_id OR 
  auth.uid() IN (SELECT vendor_id FROM food_listings WHERE id = listing_id)
);

-- Reviews policies
CREATE POLICY "Reviews are viewable by everyone" ON reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);
