# Owner Notifications Setup

This guide explains how to set up WhatsApp notifications for property owners when new bookings arrive.

## 📋 Overview

When a new booking arrives from Beds24, the system can send **two WhatsApp messages**:

1. **Guest Message** - Confirmation to the guest
2. **Owner Notification** - Alert to the property owner

## 🚀 Setup Methods

### Method 1: User Profile (Recommended for Multi-Property)

Each property owner sets their own phone number in the dashboard:

1. Login to dashboard
2. Go to **איזור אישי** (Profile)
3. Click **ערוך** (Edit)
4. Enter phone number: `+972501234567`
5. Click **שמור** (Save)

The system automatically matches bookings to owners using propertyId from Beds24.

**See:** `BEDS24_WEBHOOK_PROPERTY_MAPPING.md` for detailed setup.

### Method 2: Environment Variable (Single Property)

Add this to your `.env.local` file:

```env
OWNER_PHONE_NUMBER=+972501234567
```

⚠️ **Important:**
- Include country code (e.g., +972 for Israel)
- No spaces or dashes
- Example: `+972501234567` ✅
- Example: `050-123-4567` ❌

Then restart server:

```bash
npm run dev
```

## 📱 Message Format

### Guest Message (sent to guest):
```
שלום [Guest Name]! 🏔️

קיבלנו את הזמנתך ב-Mountain View.
📅 תאריך כניסה: [Check-in Date]

נשמח לארח אותך! 🎉
```

### Owner Notification (sent to owner):
```
🔔 הזמנה חדשה!

👤 אורח: [Guest Name]
📱 טלפון: [Phone]
📅 כניסה: [Check-in Date]
📅 יציאה: [Check-out Date]
🏠 יחידה: [Room Name]
🔖 מספר הזמנה: [Booking ID]
```

## ✏️ Customize Messages

Edit messages in `src/app/api/webhook/route.ts`:

### Guest Message (line ~62):
```typescript
await sendWhatsAppMessage({
  to: payload.phone,
  message: `Your custom message for guest...`,
})
```

### Owner Notification (line ~67):
```typescript
await sendWhatsAppMessage({
  to: ownerPhone,
  message: `Your custom message for owner...`,
})
```

## 🔍 Testing

### Test with Postman:

```
POST http://localhost:3000/api/webhook

{
  "guestName": "יוסי כהן",
  "phone": "+972501234567",
  "checkInDate": "2026-02-15",
  "checkOutDate": "2026-02-20",
  "roomName": "Mountain Suite",
  "bookingId": "BK-12345"
}
```

You should receive **2 WhatsApp messages**:
1. One to the guest's phone
2. One to the owner's phone

### Response Format:

```json
{
  "success": true,
  "whatsapp": {
    "guest": {
      "sent": true,
      "provider": "ultramsg"
    },
    "owner": {
      "sent": true,
      "provider": "ultramsg"
    }
  }
}
```

## ⚙️ Configuration Options

### Option 1: Enable Owner Notifications
```env
OWNER_PHONE_NUMBER=+972501234567
```

### Option 2: Disable Owner Notifications
Remove or comment out the line:
```env
# OWNER_PHONE_NUMBER=+972501234567
```

Or leave it empty:
```env
OWNER_PHONE_NUMBER=
```

## 🏢 Multiple Properties (Future Feature)

For SaaS with multiple property owners, you can:

1. **Store owner phone in Beds24 payload:**
   - Add custom field in Beds24 webhook
   - Include owner phone in JSON

2. **Store in Supabase:**
   - Create `properties` table
   - Link property to owner phone
   - Query based on booking

3. **User-based (per session):**
   - Each user has their own phone
   - Store in user profile
   - Send to logged-in user

## 🔐 Security & Privacy

1. **Phone Number Privacy:**
   - Owner sees guest phone (for contact)
   - Guest doesn't see owner phone

2. **Environment Variables:**
   - Never commit `.env.local` to git
   - Use different numbers for dev/production

3. **Rate Limiting:**
   - Consider limiting notifications
   - Avoid spam with duplicate bookings

## 🐛 Troubleshooting

### Owner not receiving messages?

1. **Check Environment Variable:**
   ```bash
   # In terminal (after running npm run dev)
   echo $OWNER_PHONE_NUMBER
   ```

2. **Check Phone Format:**
   - Must include country code: `+972501234567`
   - No spaces: `+972 50 123 4567` ❌
   - No dashes: `+972-50-123-4567` ❌

3. **Check Console Logs:**
   - Look for "✅ Owner notification sent successfully"
   - Or "❌ Failed to send owner notification"

4. **Check Response:**
   ```json
   "owner": {
     "sent": false,
     "message": "Owner phone not configured"
   }
   ```
   This means `OWNER_PHONE_NUMBER` is not set.

### Both messages not sending?

- Check UltraMsg instance is connected
- Check UltraMsg credits/quota
- Verify both phone numbers are valid
- Check server console for errors

## 📊 Monitoring

### Check Supabase Logs:

```sql
SELECT 
  guest_name,
  phone as guest_phone,
  status,
  whatsapp_sent_at,
  created_at
FROM notifications_log
ORDER BY created_at DESC
LIMIT 10;
```

Note: Currently, only guest messages are tracked in the database. Owner notifications are logged in the console.

### Future Enhancement:

You can track owner notifications separately by adding another insert to `notifications_log` or creating a separate `owner_notifications` table.

## 💡 Tips

1. **Use Different Messages:**
   - Guest: Friendly confirmation
   - Owner: Business details (name, phone, dates)

2. **Add More Details:**
   - Total price
   - Number of guests
   - Special requests
   - Payment status

3. **Timing:**
   - Send immediately (current behavior)
   - Or add delay/scheduling if needed

4. **Rich Content:**
   - Add emojis for better readability
   - Include links (maps, booking portal)
   - Send images (property photos) - future feature

## 🎯 Next Steps

1. ✅ Test with real bookings
2. Customize message templates
3. Add more booking details
4. Consider multi-property support
5. Set up monitoring/alerts
