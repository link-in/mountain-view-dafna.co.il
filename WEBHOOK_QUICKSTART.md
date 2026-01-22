# 🚀 Beds24 Webhook Quick Start

Get your webhook up and running in 5 minutes!

## ✅ What's Already Done

All the code is ready! Here's what was created:

1. ✅ **Webhook Route**: `src/app/api/webhook/route.ts`
2. ✅ **Supabase Client**: `src/lib/supabase/client.ts`
3. ✅ **Database Migration**: `supabase/migrations/001_create_notifications_log.sql`
4. ✅ **Supabase Package**: Already installed

## 📝 Quick Setup (3 Steps)

### Step 1: Add Supabase to .env.local

Add these two lines to your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**Get your keys:**
- Go to https://supabase.com/dashboard
- Create a new project (free tier is fine)
- Copy URL and anon key from Settings → API

### Step 2: Create Database Table

1. Go to Supabase Dashboard → SQL Editor
2. Copy the SQL from `supabase/migrations/001_create_notifications_log.sql`
3. Paste and run it

### Step 3: Configure Beds24

1. Login to Beds24
2. Go to Settings → Notifications → Webhooks
3. Add new webhook:
   - **URL**: `https://your-domain.com/api/webhook`
   - **Format**: JSON
   - **Active**: ✅

4. Set JSON payload:

```json
{
  "guestName": "[GUESTFIRSTNAME] [GUESTNAME]",
  "phone": "[GUESTMOBILE]",
  "checkInDate": "[ARRIVAL]"
}
```

## 🎉 Done!

Your webhook is now:
- ✅ Receiving bookings from Beds24
- ✅ Logging to console
- ✅ Saving to Supabase database
- 🔜 Ready for WhatsApp integration

## 🧪 Test It

Send a test booking from Beds24 and check:
1. Server console logs
2. Supabase `notifications_log` table

## 📖 Full Documentation

See `BEDS24_WEBHOOK_SETUP.md` for detailed setup and troubleshooting.

## 🔜 Next: WhatsApp Integration

The webhook has a TODO comment where you'll add WhatsApp sending:

```typescript
// TODO: Here we will integrate the WhatsApp API (UltraMsg/Whapi)
```

Ready to add WhatsApp? Let me know!
