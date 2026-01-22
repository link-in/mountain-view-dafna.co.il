# UltraMsg WhatsApp Setup Guide

This guide explains how to set up UltraMsg to send WhatsApp messages automatically when new bookings arrive from Beds24.

## 📋 Overview

UltraMsg is a managed WhatsApp API service that:
- ✅ No need for Docker or server setup
- ✅ Pay-as-you-go pricing (~$0.01-0.02 per message)
- ✅ Easy to switch to WAHA later
- ✅ Works in both development and production

## 🚀 Setup Instructions

### Step 1: Create UltraMsg Account

1. Go to https://ultramsg.com
2. Click **Sign Up** (or **Login** if you have an account)
3. Verify your email

### Step 2: Create an Instance

1. After login, click **Create Instance**
2. Choose a name for your instance (e.g., "mountain-view-booking")
3. Select a plan:
   - **Free Trial**: 100 messages for testing
   - **Pay As You Go**: ~$5 for 500 messages
   - **Monthly**: Starting from $10/month

### Step 3: Connect Your WhatsApp

1. In your instance dashboard, you'll see a **QR Code**
2. Open WhatsApp on your phone
3. Go to **Settings** → **Linked Devices**
4. Tap **Link a Device**
5. Scan the QR code from UltraMsg dashboard
6. Wait for "Connected" status

⚠️ **Important:** Keep your phone connected to the internet!

### Step 4: Get API Credentials

In your UltraMsg dashboard, you'll find:

- **Instance ID**: Something like `instance12345`
- **Token**: A long string like `abc123xyz...`

Copy these values!

### Step 5: Add to Environment Variables

Add these to your `.env.local` file:

```env
# WhatsApp Configuration
WHATSAPP_PROVIDER=ultramsg

# UltraMsg Credentials
ULTRAMSG_INSTANCE_ID=instance12345
ULTRAMSG_TOKEN=your-token-here
```

### Step 6: Restart Your Server

```bash
# Stop the current server (Ctrl+C)
npm run dev
```

### Step 7: Test It!

Send a POST request to your webhook:

```bash
POST http://localhost:3000/api/webhook

{
  "guestName": "John Doe",
  "phone": "+972501234567",
  "checkInDate": "2026-02-15"
}
```

You should receive a WhatsApp message! 🎉

## 📱 Message Format

The current message template is:

```
שלום [Guest Name]! 🏔️

קיבלנו את הזמנתך ב-Mountain View.
📅 תאריך כניסה: [Check-in Date]

נשמח לארח אותך! 🎉
```

### Customizing the Message

Edit the message in `src/app/api/webhook/route.ts`:

```typescript
await sendWhatsAppMessage({
  to: payload.phone,
  message: `Your custom message here...`,
})
```

## 🔍 Monitoring & Debugging

### Check WhatsApp Status in Supabase

```sql
SELECT 
  guest_name,
  phone,
  status,
  whatsapp_sent_at,
  whatsapp_error
FROM notifications_log
ORDER BY created_at DESC;
```

### Status Values:
- `received` - Webhook received, WhatsApp pending
- `sent` - WhatsApp sent successfully
- `failed` - WhatsApp sending failed

### UltraMsg Dashboard

Monitor your messages at:
- https://ultramsg.com/dashboard
- View delivery status
- Check remaining quota
- See message history

## 💰 Pricing

### Free Tier:
- 100 messages for testing
- Perfect for development

### Pay As You Go:
- ~$0.01-0.02 per message
- Buy credits as needed
- No monthly commitment

### Monthly Plans:
- $10/month: ~1,000 messages
- $30/month: ~3,000 messages
- Custom plans available

## 🐛 Troubleshooting

### Message not sending?

1. **Check Instance Status**
   - Go to UltraMsg dashboard
   - Verify "Connected" status
   - Re-scan QR if disconnected

2. **Check Phone Number Format**
   - Must include country code: `+972501234567`
   - No spaces or dashes
   - Example valid: `+972501234567`
   - Example invalid: `050-123-4567`

3. **Check Environment Variables**
   - Verify `ULTRAMSG_INSTANCE_ID` is set
   - Verify `ULTRAMSG_TOKEN` is set
   - Restart server after changes

4. **Check Supabase Logs**
   ```sql
   SELECT * FROM notifications_log 
   WHERE status = 'failed' 
   ORDER BY created_at DESC;
   ```

5. **Check Server Console**
   - Look for errors in terminal
   - Check for "WhatsApp sent successfully" message

### Common Errors:

**"UltraMsg configuration missing"**
- Solution: Add `ULTRAMSG_INSTANCE_ID` and `ULTRAMSG_TOKEN` to `.env.local`

**"Invalid phone number"**
- Solution: Use international format with country code (+972...)

**"Instance disconnected"**
- Solution: Re-scan QR code in UltraMsg dashboard

**"Insufficient credits"**
- Solution: Add credits in UltraMsg dashboard

## 🔄 Switching to WAHA Later

The system is designed for easy provider switching:

1. Set up WAHA server (Docker)
2. Update `.env.local`:
   ```env
   WHATSAPP_PROVIDER=waha
   WAHA_BASE_URL=http://your-waha-server
   WAHA_SESSION=your-session
   ```
3. Restart server

No code changes needed! The abstraction layer handles everything.

## 🔐 Security Notes

1. **Never commit `.env.local`** - It contains your token
2. **Rotate tokens** - If exposed, regenerate in UltraMsg dashboard
3. **Use HTTPS** - In production, always use HTTPS endpoints
4. **Validate phone numbers** - Prevent spam/abuse

## 📊 Testing Without Sending

For development/testing without sending real messages:

```env
WHATSAPP_PROVIDER=mock
```

This will:
- ✅ Log messages to console
- ✅ Save to database
- ✅ Not send real WhatsApp messages
- ✅ Perfect for testing

## 📞 Support

### UltraMsg Support:
- Documentation: https://docs.ultramsg.com/
- Support: support@ultramsg.com
- Telegram: @ultramsgsupport

### Need Help?
Check the server console logs and Supabase `notifications_log` table for debugging information.

## 🎯 Next Steps

Once UltraMsg is working:
1. Test with real Beds24 bookings
2. Customize message templates
3. Add more booking details to messages
4. Consider adding images/documents
5. Set up monitoring and alerts
