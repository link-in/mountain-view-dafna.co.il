# Beds24 Webhook Setup Guide

This guide explains how to set up the Beds24 webhook receiver to automatically receive booking notifications and log them to Supabase.

## 📋 Overview

The webhook system consists of:
- **Next.js API Route**: Receives POST requests from Beds24
- **Supabase Database**: Stores all webhook events as backup
- **Console Logging**: Displays received data for debugging
- **WhatsApp Integration (TODO)**: Will send messages via UltraMsg/Whapi

## 🚀 Setup Instructions

### Step 1: Install Supabase

```bash
npm install @supabase/supabase-js
```

### Step 2: Configure Environment Variables

Add the following to your `.env.local` file:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

To get these values:
1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Create a new project (or select existing)
3. Go to Settings → API
4. Copy the **Project URL** and **anon public** key

### Step 3: Create the Database Table

Go to your Supabase dashboard → SQL Editor and run the migration:

```sql
-- Copy and paste the contents from:
-- supabase/migrations/001_create_notifications_log.sql
```

Or use the Supabase CLI:

```bash
# Install Supabase CLI
npm install -g supabase

# Link your project
supabase link --project-ref your-project-ref

# Push migrations
supabase db push
```

### Step 4: Configure Beds24 Webhook

1. Log in to your Beds24 account
2. Go to **Settings** → **Notifications** → **Webhooks**
3. Click **Add New Webhook**
4. Configure:
   - **URL**: `https://your-domain.com/api/webhook`
   - **Format**: JSON
   - **Events**: Select booking events you want to receive
   - **Active**: ✅ Enabled

5. Set up the JSON mapping for your webhook payload:

```json
{
  "guestName": "[GUESTFIRSTNAME] [GUESTNAME]",
  "phone": "[GUESTMOBILE]",
  "checkInDate": "[ARRIVAL]",
  "checkOutDate": "[DEPARTURE]",
  "bookingId": "[BOOKID]",
  "roomName": "[UNITNAME]",
  "propertyId": "[PROPID]",
  "roomId": "[UNITID]",
  "numGuests": "[NUMADULT]",
  "numChildren": "[NUMCHILD]",
  "totalPrice": "[PRICE]",
  "email": "[GUESTEMAIL]"
}
```

⚠️ **Important for Multi-Property:** Include `propertyId` and `roomId` fields so the system can route owner notifications to the correct property owner. See `BEDS24_WEBHOOK_PROPERTY_MAPPING.md` for details.

### Step 5: Test the Webhook

#### Test Locally:

1. Start your development server:
```bash
npm run dev
```

2. Use ngrok to expose your local server:
```bash
ngrok http 3000
```

3. Update Beds24 webhook URL to your ngrok URL:
```
https://your-ngrok-id.ngrok.io/api/webhook
```

4. Create a test booking in Beds24 or use their webhook test feature

#### Test in Production:

1. Deploy your app
2. Update Beds24 webhook URL to production:
```
https://your-domain.com/api/webhook
```

3. Monitor the console logs or check Supabase table for incoming webhooks

### Step 6: Verify Setup

Check that everything works:

1. **Console Logs**: You should see webhook data in your server logs
2. **Supabase Table**: Check the `notifications_log` table for new entries
3. **Webhook Response**: Beds24 should show successful delivery (200 status)

## 📊 Database Schema

The `notifications_log` table structure:

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `guest_name` | TEXT | Guest's full name |
| `phone` | TEXT | Guest's phone number |
| `check_in_date` | TEXT | Check-in date |
| `raw_payload` | JSONB | Full webhook payload from Beds24 |
| `status` | TEXT | Status: received, sent, failed, pending |
| `whatsapp_sent_at` | TIMESTAMPTZ | When WhatsApp message was sent |
| `whatsapp_error` | TEXT | Error message if sending failed |
| `created_at` | TIMESTAMPTZ | Record creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last update timestamp |

## 🔍 Monitoring & Debugging

### View Webhook Logs in Supabase:

```sql
-- Get recent webhooks
SELECT * FROM notifications_log 
ORDER BY created_at DESC 
LIMIT 10;

-- Count webhooks by status
SELECT status, COUNT(*) 
FROM notifications_log 
GROUP BY status;

-- Find webhooks for specific guest
SELECT * FROM notifications_log 
WHERE phone = '+972501234567';
```

### Check Server Logs:

Development:
```bash
npm run dev
# Watch console for webhook messages
```

Production (Vercel):
- Go to your deployment in Vercel dashboard
- Click on "Logs" tab
- Filter for `/api/webhook` requests

## 🔐 Security Considerations

1. **Webhook Authentication**: Consider adding a secret token validation:

```typescript
const WEBHOOK_SECRET = process.env.BEDS24_WEBHOOK_SECRET

if (request.headers.get('x-webhook-secret') !== WEBHOOK_SECRET) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
```

2. **Rate Limiting**: Consider adding rate limiting to prevent abuse

3. **IP Whitelist**: Optionally restrict to Beds24 IP addresses

## 📱 Next Steps: WhatsApp Integration

The webhook handler includes a TODO comment where WhatsApp integration will be added:

```typescript
// TODO: Here we will integrate the WhatsApp API (UltraMsg/Whapi)
```

Options for WhatsApp integration:
- **UltraMsg**: Simple API, pay per message
- **Whapi**: More features, subscription-based
- **Twilio**: Enterprise solution

## 🐛 Troubleshooting

### Webhook not receiving data:
- ✅ Check Beds24 webhook is active
- ✅ Verify URL is correct (https required)
- ✅ Check Beds24 webhook logs for delivery errors
- ✅ Ensure your server is accessible from internet

### Supabase errors:
- ✅ Verify environment variables are set
- ✅ Check table exists in Supabase
- ✅ Verify RLS (Row Level Security) policies if enabled
- ✅ Check Supabase logs for errors

### Data not appearing in console:
- ✅ Check server is running
- ✅ View correct log stream (server logs, not browser console)
- ✅ Verify webhook is sending data to correct endpoint

## 📞 Support

For Beds24-specific questions:
- Beds24 Documentation: https://www.beds24.com/
- Beds24 Support: support@beds24.com

For Supabase questions:
- Supabase Documentation: https://supabase.com/docs
- Supabase Discord: https://discord.supabase.com
