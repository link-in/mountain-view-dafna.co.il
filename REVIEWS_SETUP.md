# Reviews Integration Setup Guide

This guide will help you complete the setup of the automated reviews system that pulls reviews from BEDS24 (Booking.com, Airbnb) and Google.

## 📋 Overview

The system automatically syncs guest reviews from:
- **BEDS24 Booking.com** - Already configured ✅
- **BEDS24 Airbnb** - Already configured ✅
- **Google My Business** - Requires setup ⚠️
- **Google Places** - Requires setup ⚠️

## 🚀 Quick Start

### Step 1: Run Database Migrations

Run both Supabase migrations to create the reviews and bookings tables:

```bash
# If using Supabase CLI
supabase db push

# Or manually run the SQL in Supabase dashboard:
# 1. supabase-migrations/013_create_reviews_table.sql
# 2. supabase-migrations/014_create_bookings_table.sql
```

**Important:** The bookings table is used to cross-reference Airbnb reviews with real guest names (since Airbnb API doesn't provide them directly).

### Step 2: Configure Google APIs (Optional but Recommended)

#### Option A: Google Places API (Simpler, Recommended)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Enable **Google Places API**
4. Create an **API Key** in Credentials
5. Find your Place ID:
   - Visit [Place ID Finder](https://developers.google.com/maps/documentation/places/web-service/place-id)
   - Search for your business
   - Copy the Place ID

6. Add to `.env.local`:
```env
GOOGLE_PLACES_API_KEY=your_api_key_here
GOOGLE_PLACE_ID=your_place_id_here
```

#### Option B: Google My Business API (More features, requires OAuth)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Enable **Google My Business API**
3. Create **OAuth 2.0 Client ID** credentials
4. Set redirect URI: `http://localhost:3000/api/auth/google/callback`
5. Follow OAuth flow to get refresh token

6. Add to `.env.local`:
```env
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback
GOOGLE_REFRESH_TOKEN=your_refresh_token
GOOGLE_ACCOUNT_ID=your_account_id
GOOGLE_LOCATION_ID=your_location_id
```

### Step 3: Install Required Dependencies

The system uses googleapis for Google My Business integration:

```bash
npm install googleapis
```

### Step 4: Set Cron Secret

Add a secure random string to `.env.local`:

```bash
# Generate a secure random string
openssl rand -base64 32

# Add to .env.local
CRON_SECRET=your_generated_secret_here
```

### Step 5: Initial Sync
 
Once everything is configured:               

1. Start your development server:
```bash
npm run dev
```

2. Login to admin dashboard
3. Navigate to `/admin/reviews`
4. Click "סנכרן ביקורות" (Sync Reviews)

## 📊 How It Works

### Data Flow

```
BEDS24 API          →  Fetch Reviews  →  Transform Data  →  Save to Supabase
Google Places API   →  Fetch Reviews  →  Transform Data  →  Save to Supabase
Google Business API →  Fetch Reviews  →  Transform Data  →  Save to Supabase
                                                          ↓
                                                   Display on Website
```

### Automatic Sync

The system is configured to sync automatically every day at 2:00 AM via Vercel Cron.

**Cron Schedule:** `0 2 * * *` (Daily at 2 AM)

To change the schedule, edit `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/cron/sync-reviews",
    "schedule": "0 2 * * *"
  }]
}
```

### Manual Sync

You can trigger a manual sync anytime from:
- Admin dashboard: `/admin/reviews`
- API endpoint: `POST /api/admin/reviews/sync` (requires authentication)

## 🎨 Frontend Display

Reviews are displayed on the homepage in a beautiful carousel that:
- Shows reviews from all sources (Booking.com, Airbnb, Google)
- Displays source logos for authenticity
- Shows star ratings and user avatars
- Includes host responses when available
- Supports RTL (Hebrew) layout
- Has smooth scrolling and animations

**The existing UI is preserved completely** - only the data source changed from static to dynamic.

## 📝 API Endpoints

### Public Endpoints

- `GET /api/reviews` - Fetch active reviews for public display
  - Query params: `?limit=20&source=booking` (optional)
  - Response: Array of Review objects

### Admin Endpoints (Require Authentication)

- `POST /api/admin/reviews/sync` - Trigger manual sync
- `GET /api/admin/reviews/sync` - Get sync statistics

### Cron Endpoint (Protected by Secret)

- `GET /api/cron/sync-reviews` - Automatic sync endpoint
  - Requires `Authorization: Bearer {CRON_SECRET}` header

## 🗄️ Database Schema

### Reviews Table

The reviews are stored in the `reviews` table with the following structure:

```sql
reviews (
  id UUID PRIMARY KEY,
  external_id TEXT UNIQUE,      -- Prevents duplicates
  user_name TEXT,
  user_image TEXT,
  location TEXT,
  rating INTEGER (1-5),
  review_date TIMESTAMP,
  comment TEXT,
  source TEXT,                   -- 'booking', 'airbnb', or 'google'
  host_response TEXT,
  raw_data JSONB,               -- Original API response
  is_active BOOLEAN,            -- Toggle visibility
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

### Bookings Table

The bookings are stored in a separate `bookings` table:

```sql
bookings (
  id UUID PRIMARY KEY,
  booking_id TEXT UNIQUE,        -- BEDS24 booking ID
  reference TEXT,                -- Booking reference (contains Airbnb codes)
  confirmation_code TEXT,        -- Airbnb confirmation code
  property_id TEXT,
  room_id TEXT,
  first_name TEXT,
  last_name TEXT,
  guest_name TEXT,               -- Auto-generated from first+last
  email TEXT,
  phone TEXT,
  arrival DATE,
  departure DATE,
  num_adults INTEGER,
  num_children INTEGER,
  status TEXT,
  price DECIMAL,
  currency TEXT,
  channel TEXT,                  -- 'airbnb', 'booking', 'direct'
  raw_data JSONB,               -- Original BEDS24 data
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  synced_at TIMESTAMP
)
```

**Why bookings table?**
- Airbnb API doesn't provide real guest names in reviews (privacy policy)
- We sync bookings from BEDS24 and cross-reference them with Airbnb reviews
- This allows us to display real guest names (at least first name) instead of "Airbnb Guest 1234"
- Also provides valuable data for future analytics and booking management

## 🔧 Troubleshooting

### No reviews appearing on website

1. Check if reviews exist in database:
   - Go to Supabase dashboard
   - Open SQL Editor
   - Run: `SELECT COUNT(*) FROM reviews WHERE is_active = true`

2. Check browser console for errors

3. Verify API is working:
   - Visit `/api/reviews` directly in browser
   - Should return JSON array

### BEDS24 reviews not syncing

1. Verify BEDS24 credentials in `.env.local`:
   - `BEDS24_TOKEN`
   - `BEDS24_REFRESH_TOKEN`
   - `BEDS24_PROPERTY_ID`

2. Check admin logs during sync

### Google reviews not syncing

1. Verify API credentials are correct
2. Check API is enabled in Google Cloud Console
3. Review error messages in admin dashboard
4. Test API key with a simple curl request

### Cron job not running

1. Verify `vercel.json` exists in project root
2. Deploy to Vercel (cron only works in production)
3. Check Vercel dashboard → Cron Jobs section
4. Verify `CRON_SECRET` is set in Vercel environment variables

## 📦 File Structure

```
src/
├── lib/
│   ├── reviews/
│   │   ├── beds24-booking-service.ts    # Booking.com reviews
│   │   ├── beds24-airbnb-service.ts     # Airbnb reviews
│   │   ├── google-business-service.ts   # Google My Business
│   │   ├── google-places-service.ts     # Google Places
│   │   └── sync-service.ts              # Master sync orchestrator
│   └── bookings/
│       └── sync-bookings.ts             # BEDS24 bookings sync
├── app/
│   ├── api/
│   │   ├── reviews/route.ts         # Public endpoint
│   │   ├── admin/
│   │   │   ├── reviews/sync/        # Admin sync endpoint
│   │   │   └── bookings/sync/       # Admin bookings sync
│   │   └── cron/sync-reviews/       # Cron endpoint
│   ├── admin/reviews/page.tsx       # Admin UI
│   └── home/light/components/
│       ├── ReviewsCarousel.tsx      # Frontend display
│       └── HotelStructuredData.tsx  # SEO structured data
└── data/
    └── reviews.ts                    # Static fallback (preserved)

supabase-migrations/
├── 013_create_reviews_table.sql     # Reviews table
└── 014_create_bookings_table.sql    # Bookings table
```

## 🎯 Best Practices

1. **Regular Sync**: Run manual sync weekly to ensure fresh reviews
2. **Monitor Stats**: Check admin dashboard for sync health
3. **Review Moderation**: Use `is_active` flag to hide inappropriate reviews
4. **Backup Data**: Reviews are stored in Supabase (already backed up)
5. **Rate Limiting**: Google APIs have rate limits - daily sync is optimal

## 🔐 Security

- API keys stored in environment variables (never in code)
- Admin endpoints protected by NextAuth
- Cron endpoint protected by secret token
- Public endpoint only exposes active reviews
- RLS policies on Supabase table

## 📈 SEO Benefits

The system automatically updates:
- Schema.org structured data with real ratings
- Average rating calculated from actual reviews
- Review count updated dynamically
- Google can crawl and index real reviews

## 🆘 Support

If you encounter issues:

1. Check console logs in admin dashboard
2. Review Supabase logs
3. Test individual API endpoints
4. Verify environment variables are set correctly

## ✅ Verification Checklist

- [ ] Database migration ran successfully
- [ ] Google API credentials configured (if using Google)
- [ ] Dependencies installed (`googleapis` if using Google My Business)
- [ ] Initial sync completed successfully
- [ ] Reviews appear on homepage
- [ ] Admin dashboard accessible
- [ ] Structured data updated with real ratings
- [ ] Cron secret configured
- [ ] System tested end-to-end

## 🎉 Done!

Your automated reviews system is now set up and running. Reviews will automatically sync daily and display beautifully on your website.
