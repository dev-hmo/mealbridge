# MealBridge — AI Editor Context

## Project Summary
MealBridge is a public-facing, community-driven web platform that connects food surplus (restaurants, bakeries, events, households) with people who need it. Vendors post available food listings; receivers browse, claim, and pick up food. The platform tracks impact (meals rescued, food saved).

## Tech Stack
- **Frontend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS
- **State Management**: Zustand (client-side only, no server state)
- **Database**: Supabase Cloud (PostgreSQL + Auth + Realtime + Storage)
- **Hosting**: Vercel (frontend + serverless API routes)
- **No local database**. Everything runs in the cloud via Supabase.

## Architecture Pattern
- **Server Components** by default for pages (SSR/ISR)
- **Client Components** (`"use client"`) only where interactivity is needed
- **API Routes** in `src/app/api/` for backend logic (serverless functions)
- **Supabase client** created per-request (server) or singleton (browser)
- **Zustand** for UI state only (filters, modals, toasts). Server data lives in Supabase.

## Database Schema (5 tables)
- `profiles` — extends Supabase auth.users. Fields: role (vendor/receiver/both), location, phone
- `food_listings` — core table. Fields: title, category, quantity, dietary_info, photo_urls, lat/lng, available_from/until, status
- `food_claims` — receiver claims on listings. Fields: quantity_claimed, status (pending/confirmed/completed), pickup_time
- `reviews` — trust system. Fields: rating (1-5), comment, reviewer_id, reviewee_id
- `notifications` — in-app alerts. Fields: type (enum), title, message, is_read

## Key Relationships
- profiles 1→N food_listings (vendor posts many listings)
- profiles 1→N food_claims (receiver makes many claims)
- food_listings 1→N food_claims (listing gets many claims)
- food_listings 1→N reviews (listing gets reviews)
- profiles 1→N notifications (user gets many notifications)

## File Structure Conventions
- Pages: `src/app/(route-group)/page.tsx`
- Components: `src/components/{domain}/{component-name}.tsx` (kebab-case)
- Zustand stores: `src/stores/use-{domain}-store.ts`
- Types: `src/types/{domain}.ts`
- Hooks: `src/hooks/use-{feature}.ts`
- Supabase clients: `src/lib/supabase/{client|server}.ts`
- Utils: `src/lib/utils.ts`

## Naming Conventions
- Files: `kebab-case.tsx` (listing-card.tsx)
- Components: `PascalCase` (ListingCard)
- Functions/variables: `camelCase` (fetchListings)
- Types/interfaces: `PascalCase` (FoodListing, ClaimStatus)
- DB columns: `snake_case` (available_until, created_at)

## Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxxxx
NEXT_PUBLIC_SITE_URL=https://mealbridge.vercel.app
```

## Key Technical Decisions
1. **No ORM** — use Supabase JS client directly (simpler, free, no Prisma overhead)
2. **Photo storage** — Supabase Storage bucket "food-photos" (500MB free)
3. **No Google Maps API** — use free Leaflet/OpenStreetMap for maps (no API key needed)
4. **No email service** — Supabase Auth handles email flows (magic link, OTP)
5. **Distance calculation** — Haversine formula in PostgreSQL queries (no PostGIS needed)
6. **Realtime** — Supabase Realtime subscriptions for notifications and claim status updates
7. **Client-side state** — Zustand for: active filters, modal state, toast queue, claim flow UI
8. **Server state** — Supabase queries in server components or API routes, NOT cached in Zustand

## Do NOT
- Install PostgreSQL locally or use any local database
- Use paid APIs (Google Maps, OpenAI, SendGrid, etc.)
- Use Prisma or any ORM (Supabase client is sufficient)
- Store server-side data in Zustand
- Use `"use client"` on page components unless absolutely necessary
- Commit `.env.local` to git

## UI Design Direction
- Clean, modern, food-focused design
- Color palette: Green (primary) + Orange (accent) + White/Gray (backgrounds)
- Mobile-first responsive design
- Cards-based layout for listings
- Map view + list view toggle for discovery

## API Routes
- `GET /api/listings` — Fetch listings with filters
- `POST /api/listings` — Create new listing
- `GET /api/listings/[id]` — Fetch single listing
- `PUT /api/listings/[id]` — Update listing
- `DELETE /api/listings/[id]` — Delete listing
- `GET /api/claims` — Fetch claims (made/received)
- `POST /api/claims` — Create new claim
- `PUT /api/claims/[id]` — Update claim status
- `GET /api/reviews` — Fetch reviews for user
- `POST /api/reviews` — Create new review
- `GET /api/notifications` — Fetch notifications
- `PATCH /api/notifications` — Mark as read
- `GET /api/profile` — Fetch own profile
- `PUT /api/profile` — Update profile
- `GET /api/profile/[id]` — Fetch public profile
- `GET /api/stats` — Platform statistics
- `POST /api/upload` — Upload photos to Supabase Storage

## Deployment
- Frontend: Vercel (free tier)
- Database: Supabase (free tier)
- See DEPLOYMENT.md for full instructions
