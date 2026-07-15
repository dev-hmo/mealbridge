# MealBridge Deployment Guide

## Prerequisites

1. **GitHub Account** - For code repository
2. **Supabase Account** - For database (free tier)
3. **Vercel Account** - For hosting (free tier)

---

## Step 1: Set Up Supabase Database

1. Go to [supabase.com](https://supabase.com) and sign up with GitHub
2. Click "New Project"
   - Project name: `mealbridge`
   - Database password: (choose a strong password)
   - Region: Choose closest to your users
3. Go to **Settings → API** and copy:
   - Project URL (e.g., `https://xxxxxxxx.supabase.co`)
   - Anon public key (starts with `eyJ...`)

### Create Database Tables

Go to **SQL Editor** and run this query:

```sql
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

-- Create indexes
CREATE INDEX idx_food_listings_vendor ON food_listings(vendor_id);
CREATE INDEX idx_food_listings_status ON food_listings(status);
CREATE INDEX idx_food_listings_category ON food_listings(category);
CREATE INDEX idx_food_claims_listing ON food_claims(listing_id);
CREATE INDEX idx_food_claims_claimer ON food_claims(claimer_id);
CREATE INDEX idx_reviews_reviewee ON reviews(reviewee_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);

-- Enable Row Level Security
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
CREATE POLICY "Users can view own claims" ON food_claims FOR SELECT USING (
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
```

### Create Storage Bucket

1. Go to **Storage** in Supabase dashboard
2. Click "New Bucket"
   - Name: `food-photos`
   - Public: Yes (check the box)
3. Go to **Storage → Policies** and add:

```sql
-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload photos" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'food-photos');

-- Allow public access to photos
CREATE POLICY "Public access to food photos" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'food-photos');
```

### Enable Google OAuth (Optional)

1. Go to **Authentication → Providers**
2. Enable Google provider
3. Add your Google OAuth credentials

---

## Step 2: Push Code to GitHub

```bash
# Initialize git
git init
git add .
git commit -m "Initial commit: MealBridge"

# Create GitHub repo and push
git remote add origin https://github.com/YOUR_USERNAME/mealbridge.git
git branch -M main
git push -u origin main
```

---

## Step 3: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign up with GitHub
2. Click "Add New Project"
3. Import your `mealbridge` repository
4. Configure:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: `.next`
5. Add Environment Variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL = https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY = your-anon-key-here
   NEXT_PUBLIC_SITE_URL = https://mealbridge.vercel.app
   ```
6. Click "Deploy"

---

## Step 4: Custom Domain (Optional)

1. In Vercel dashboard, go to your project
2. Go to **Settings → Domains**
3. Add your custom domain
4. Update DNS records as instructed by Vercel
5. Update `NEXT_PUBLIC_SITE_URL` in environment variables

---

## Step 5: Post-Deployment Checklist

- [ ] Test signup/login flow
- [ ] Create a test food listing
- [ ] Upload photos
- [ ] Test claim flow
- [ ] Leave a review
- [ ] Check notifications
- [ ] Verify mobile responsiveness
- [ ] Test on different browsers

---

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | `https://xxxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key | `eyJhbGciOiJIUzI1NiIs...` |
| `NEXT_PUBLIC_SITE_URL` | Your deployed site URL | `https://mealbridge.vercel.app` |

---

## Troubleshooting

### Build Fails
- Check environment variables are set correctly
- Ensure Supabase tables are created
- Check Vercel build logs for errors

### Photos Not Uploading
- Verify storage bucket `food-photos` exists
- Check storage policies are set correctly
- Ensure bucket is public

### Auth Not Working
- Verify Google OAuth is configured (if using)
- Check redirect URLs include your domain
- Ensure RLS policies are correct

### Data Not Showing
- Check RLS policies allow SELECT
- Verify tables have data
- Check browser console for errors
