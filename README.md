# 🍽️ MealBridge

**Connecting food surplus with those who need it most.**

A community-driven food rescue platform that connects restaurants, households, and individuals with surplus food to people who need it. Built to reduce food waste and fight hunger in local communities.

---

## 🌟 Features

### For Food Donors (Vendors)
- 📸 **Photo Upload** - Share images of available food
- 📍 **Location Sharing** - Set pickup locations with map support
- ⏰ **Availability Scheduling** - Set when food is available for pickup
- 📊 **Impact Tracking** - See how much food you've rescued

### For Food Receivers
- 🔍 **Browse Listings** - Find available food near you
- 🏷️ **Filter by Category** - Cooked meals, raw ingredients, bakery, produce, packaged
- 📱 **Easy Claiming** - One-click food reservation
- ⭐ **Trust Scores** - Rate and review your experience

### Platform Features
- 🔐 **Secure Authentication** - Email/password + Google OAuth
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🔔 **Real-time Notifications** - Get alerts for claims and updates
- 📈 **Impact Dashboard** - Community-wide food rescue statistics
- ⭐ **Review System** - Build trust through ratings and feedback
- 🔍 **SEO Optimized** - Easy to find via search engines

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Frontend** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS |
| **State** | Zustand |
| **Database** | Supabase (PostgreSQL) |
| **Auth** | Supabase Auth |
| **Storage** | Supabase Storage |
| **Hosting** | Vercel |
| **Maps** | Leaflet + OpenStreetMap |

---

## 🚀 Live Demo

**🔗 [https://mealbridge.vercel.app](https://mealbridge.vercel.app)**

> 🚧 Currently in development. Sign up to test the platform!

---

## 📸 Screenshots

| Homepage | Feed | Create Listing |
|----------|------|----------------|
| ![Homepage](screenshots/homepage.png) | ![Feed](screenshots/feed.png) | ![Create](screenshots/create.png) |

| Claim Food | Profile | Impact Dashboard |
|------------|---------|------------------|
| ![Claim](screenshots/claim.png) | ![Profile](screenshots/profile.png) | ![Impact](screenshots/impact.png) |

> 📷 Add your screenshots to the `screenshots/` folder

---

## 🏁 Getting Started

### Prerequisites

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **npm or yarn** - Package manager
- **Supabase Account** - Free tier works! [Sign up here](https://supabase.com)
- **GitHub Account** - For code hosting
- **Vercel Account** - For deployment [Sign up here](https://vercel.com)

### 1. Clone the Repository

```bash
git clone https://github.com/dev-hmo/mealbridge.git
cd mealbridge
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Get these from: https://supabase.com/dashboard → Settings → API

# Your Supabase project URL
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co

# Your Supabase anon/public key (starts with eyJ...)
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Set Up Supabase Database

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project
3. Go to **SQL Editor** → **New query**
4. Paste the contents of `supabase-schema.sql`
5. Click **Run**

### 5. Create Storage Bucket

1. In Supabase Dashboard, go to **Storage**
2. Click **New bucket**
3. Name: `food-photos`
4. Public: ✅ Yes
5. Click **Create**

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → Sign in with GitHub
3. Click **"Add new project"**
4. Import your `mealbridge` repository
5. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL` = Your Supabase URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Your Supabase anon key
6. Click **"Deploy"**
7. Done! 🎉

### Manual Deployment

```bash
# Build the project
npm run build

# Start production server
npm start
```

---

## 📁 Project Structure

```
mealbridge/
├── public/                    # Static assets
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── (auth)/           # Authentication pages
│   │   │   ├── login/
│   │   │   ├── signup/
│   │   │   └── callback/
│   │   ├── (dashboard)/      # Main app pages
│   │   │   ├── feed/         # Food listings feed
│   │   │   ├── claims/       # View claims
│   │   │   ├── listing/      # Create/edit listings
│   │   │   ├── my-listings/  # User's listings
│   │   │   ├── notifications/
│   │   │   └── profile/      # User profile
│   │   ├── api/              # API routes
│   │   │   ├── claims/
│   │   │   ├── listings/
│   │   │   ├── notifications/
│   │   │   ├── profile/
│   │   │   ├── reviews/
│   │   │   ├── stats/
│   │   │   └── upload/
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Homepage
│   │   ├── error.tsx         # Error boundary
│   │   ├── not-found.tsx     # 404 page
│   │   └── loading.tsx       # Loading state
│   ├── components/           # React components
│   │   ├── claim/            # Claim-related components
│   │   ├── listing/          # Listing components
│   │   ├── notification/     # Notification components
│   │   ├── review/           # Review components
│   │   ├── shared/           # Shared components
│   │   └── ui/               # Reusable UI components
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utility functions
│   │   ├── supabase/        # Supabase client setup
│   │   ├── constants.ts     # App constants
│   │   └── utils.ts         # Helper functions
│   ├── stores/               # Zustand state stores
│   └── types/                # TypeScript interfaces
├── .env.local                # Environment variables (local)
├── .env.example              # Environment variables template
├── DEPLOYMENT.md             # Deployment guide
├── package.json              # Dependencies
├── tailwind.config.ts        # Tailwind configuration
└── tsconfig.json             # TypeScript configuration
```

---

## 📡 API Routes

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/listings` | GET/POST | List all / Create listing |
| `/api/listings/[id]` | GET/PUT/DELETE | Get / Update / Delete listing |
| `/api/claims` | GET/POST | List claims / Create claim |
| `/api/claims/[id]` | GET/PUT/DELETE | Get / Update / Delete claim |
| `/api/reviews` | GET/POST | List reviews / Create review |
| `/api/notifications` | GET | List user notifications |
| `/api/profile` | GET/PUT | Get / Update profile |
| `/api/profile/[id]` | GET | Get user profile by ID |
| `/api/stats` | GET | Get platform statistics |
| `/api/upload` | POST | Upload photo to storage |

---

## 🗄️ Database Schema

### Tables

- **profiles** - User profiles (extends auth.users)
- **food_listings** - Available food items
- **food_claims** - Food reservation requests
- **reviews** - User ratings and feedback
- **notifications** - User notifications

### Relationships

```
profiles (1) ──→ (many) food_listings
profiles (1) ──→ (many) food_claims
food_listings (1) ──→ (many) food_claims
food_listings (1) ──→ (many) reviews
```

---

## 🔐 Security

- ✅ Row Level Security (RLS) enabled on all tables
- ✅ Environment variables not committed to Git
- ✅ API routes protected with authentication
- ✅ File upload validation
- ✅ SQL injection prevention

---

## 🤝 Contributing

Contributions are welcome! Here's how:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use existing component patterns
- Write meaningful commit messages
- Update documentation if needed

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Supabase](https://supabase.com/) - Backend as a Service
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Vercel](https://vercel.com/) - Hosting platform
- [OpenStreetMap](https://www.openstreetmap.org/) - Map data

---

## 📞 Contact

**Hlaing Min Oo** - [@dev-hmo](https://github.com/dev-hmo)

Project Link: [https://github.com/dev-hmo/mealbridge](https://github.com/dev-hmo/mealbridge)

---

## ⭐ Star This Project

If you find this project useful, please give it a ⭐ on GitHub!

---

**Built with ❤️ to reduce food waste and fight hunger**
