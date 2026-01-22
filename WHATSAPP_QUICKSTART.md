# 🚀 WhatsApp Integration Quick Start

Get WhatsApp notifications working in 5 minutes!

## ✅ What's Already Done

All the code is ready:
- ✅ WhatsApp service with provider abstraction
- ✅ UltraMsg integration
- ✅ Mock provider for testing
- ✅ Automatic status tracking in database
- ✅ Owner notifications for new bookings
- ✅ Easy to switch providers later (WAHA, Whapi, etc.)

## 📝 Quick Setup (3 Steps)

### Step 1: Get UltraMsg Credentials

1. Go to https://ultramsg.com and sign up
2. Create an instance
3. Scan QR code with WhatsApp
4. Copy **Instance ID** and **Token**

### Step 2: Add to .env.local

```env
# WhatsApp Configuration
WHATSAPP_PROVIDER=ultramsg
ULTRAMSG_INSTANCE_ID=instance12345
ULTRAMSG_TOKEN=your-token-here

# Optional: Owner Notifications
OWNER_PHONE_NUMBER=+972501234567
```

### Step 3: Restart Server

```bash
npm run dev
```

## 🎉 Done!

Now when you test the webhook, it will:
- ✅ Receive booking from Beds24
- ✅ Save to Supabase
- ✅ Send WhatsApp to guest
- ✅ Send WhatsApp to owner (if configured)
- ✅ Update status in database

## 🧪 Test It

### Option 1: Postman

```
POST http://localhost:3000/api/webhook

{
  "guestName": "John Doe",
  "phone": "+972501234567",
  "checkInDate": "2026-02-15"
}
```

### Option 2: Mock Mode (No Real Messages)

For testing without sending real WhatsApp:

```env
WHATSAPP_PROVIDER=mock
```

This logs to console but doesn't send messages.

## 📱 Message Templates

### Guest Message:
```
שלום [Guest Name]! 🏔️

קיבלנו את הזמנתך ב-Mountain View.
📅 תאריך כניסה: [Check-in Date]

נשמח לארח אותך! 🎉
```

### Owner Notification:
```
🔔 הזמנה חדשה!

👤 אורח: [Guest Name]
📱 טלפון: [Phone]
📅 כניסה: [Check-in Date]
📅 יציאה: [Check-out Date]
🏠 יחידה: [Room Name]
🔖 מספר הזמנה: [Booking ID]
```

### Customize It

Edit in `src/app/api/webhook/route.ts` (line ~60):

```typescript
await sendWhatsAppMessage({
  to: payload.phone,
  message: `Your custom message...`,
})
```

## 🔍 Monitor Status

Check Supabase `notifications_log` table:

| Status | Meaning |
|--------|---------|
| `received` | Webhook received |
| `sent` | WhatsApp sent ✅ |
| `failed` | WhatsApp failed ❌ |

## 💰 Pricing

- **Free Trial**: 100 messages
- **Pay-as-you-go**: ~$0.01-0.02/message
- **Monthly**: Starting $10/month

## 🔄 Switch to WAHA Later

When ready for free/self-hosted:

1. Set up WAHA (Docker)
2. Change `.env.local`:
   ```env
   WHATSAPP_PROVIDER=waha
   WAHA_BASE_URL=http://your-server
   ```
3. Restart - **no code changes needed!**

## 📖 Full Documentation

- `ULTRAMSG_SETUP.md` - Detailed UltraMsg setup
- `OWNER_NOTIFICATIONS.md` - Owner notification setup
- `BEDS24_WEBHOOK_SETUP.md` - Webhook configuration

## 🐛 Troubleshooting

**Not sending?**
- Check UltraMsg dashboard (connected?)
- Verify Instance ID and Token
- Check phone format: `+972501234567`
- Restart server after .env changes

**See errors in:**
- Server console logs
- Supabase `notifications_log.whatsapp_error`
- UltraMsg dashboard

Ready to test? Send a webhook and check your WhatsApp! 🎉
