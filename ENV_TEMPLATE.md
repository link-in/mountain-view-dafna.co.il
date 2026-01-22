# Environment Variables Template

Copy this template to `.env.local` and fill in your actual values:

```env
# Beds24 API Configuration
BEDS24_API_BASE_URL=https://api.beds24.com/v2
BEDS24_API_KEY=your-api-key
BEDS24_REFRESH_TOKEN=your-refresh-token

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# Optional: Webhook Security
BEDS24_WEBHOOK_SECRET=your-webhook-secret

# WhatsApp Configuration
# Choose provider: ultramsg, waha, whapi, mock (default: auto-detect)
WHATSAPP_PROVIDER=ultramsg

# Owner Notifications
# The property owner will receive notifications about new bookings
OWNER_PHONE_NUMBER=+972501234567

# UltraMsg (https://ultramsg.com)
ULTRAMSG_INSTANCE_ID=your-instance-id
ULTRAMSG_TOKEN=your-token

# WAHA (Self-hosted) - Future support
# WAHA_BASE_URL=http://localhost:3000
# WAHA_SESSION=default

# Whapi (https://whapi.cloud) - Future support
# WHAPI_TOKEN=your-token
```

## Where to get these values:

### Supabase:
1. Go to https://supabase.com/dashboard
2. Create or select your project
3. Go to Settings → API
4. Copy Project URL and anon/public key

### Beds24:
1. Already configured in your existing setup
2. Check your current `.env.local` for these values

### NextAuth:
1. Already configured in your existing setup
2. Keep your current NEXTAUTH_SECRET value

### UltraMsg (WhatsApp):
1. Go to https://ultramsg.com
2. Sign up and create an instance
3. Scan QR code with your WhatsApp
4. Copy Instance ID and Token from dashboard
5. See ULTRAMSG_SETUP.md for detailed instructions

### Owner Phone Number:
1. Add your WhatsApp number with country code
2. Format: +972501234567 (no spaces or dashes)
3. This number will receive notifications about new bookings
4. Optional: Leave empty to disable owner notifications
