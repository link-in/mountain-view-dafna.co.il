# 🔐 Vercel Environment Variables

העתק את המשתנים האלה ל-Vercel Dashboard → Settings → Environment Variables

---

## ✅ חובה (REQUIRED)

```bash
# BEDS24 API
BEDS24_TOKEN=aijzS6yYBPPB1Xzj2K0IWhGWniy58t8rbroyM3cXprBr46G71EfZCp89qzZmbt5AEOWeF2mFhQ+aZMoQCViJlRpLQ+KGkWVWuIDqJ55WUjTjwIPBVIClScLIGGKGwVj59H+gDaXV23w1a2h1bhZR/cyp5TajFTMR2MUdkAKM/HA=

BEDS24_REFRESH_TOKEN=0jg3gf+fMpIyMUjr9Xd6DInQ51jAEOMd7Ku/aiZXUJZi7ZjHY8D7vBKPqscOS6PksYh2jLul25nmMmfJufCbYei5mPqxE5+MZir4UewwF/CzVtknxhD+rZ4ip3kAJedomz97PiHmZIfDBJQigMpRE/36FhClcKYiY3PKuii4SS8=

BEDS24_API_BASE_URL=https://api.beds24.com/v2

BEDS24_PROPERTY_ID=306559

BEDS24_ROOM_ID=638851

BEDS24_INCLUDE_AVAILABILITY=true
```

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://uyqysnlqsxdyhujgzrvz.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5cXlzbmxxc3hkeWh1amd6cnZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwNTgxNDMsImV4cCI6MjA4NDYzNDE0M30.QErhOH1MmVid4X_Jm32MQK0W_Tfid3t21ey-Y5pm5dM

SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5cXlzbmxxc3hkeWh1amd6cnZ6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTA1ODE0MywiZXhwIjoyMDg0NjM0MTQzfQ.Z2e64yqhesintCMRIs4VRtMPZPm_olBrjxq5Hg-CF_Q
```

```bash
# NextAuth
NEXTAUTH_SECRET=YkKadV+e9Mp/DPiIhhlATi6XMUIQHz161C1Rya8K0jg=

# ⚠️ IMPORTANT: Change this to your production domain!
NEXTAUTH_URL=https://your-production-domain.com
```

```bash
# WhatsApp
WHATSAPP_PROVIDER=ultramsg
ULTRAMSG_INSTANCE_ID=instance159651
ULTRAMSG_TOKEN=3a3uhc72r6o4i53p
```

```bash
# General
NEXT_PUBLIC_DASHBOARD_PROVIDER=beds24
# ⚠️ Change to your production URL
NEXT_PUBLIC_BASE_URL=https://your-production-domain.com
```

---

## ⭐ Google Reviews (OPTIONAL but recommended)

```bash
GOOGLE_PLACES_API_KEY=AIzaSyCJ4dWGH2hOqd4kvKOVmi26mrYz9lbi1LE

GOOGLE_PLACE_ID=ChIJl6xODTW9HhURAfp0nEwWUQA
```

---

## 🔒 Cron Secret (REQUIRED for automatic sync)

```bash
# ⚠️ IMPORTANT: Generate a new secure random string for production!
# Command: openssl rand -base64 32
CRON_SECRET=YOUR_SECURE_RANDOM_STRING_HERE
```

**איך ליצור CRON_SECRET חדש:**
1. פתח PowerShell
2. הרץ: `openssl rand -base64 32`
3. העתק את התוצאה
4. השתמש בה כ-CRON_SECRET

---

## 📝 איך להוסיף ב-Vercel:

1. **לך ל-Vercel Dashboard:**
   ```
   https://vercel.com/dashboard
   ```

2. **בחר את הפרויקט** (mountain-view-dafna)

3. **לך ל-Settings → Environment Variables**

4. **לחץ "Add New"** לכל משתנה:
   - **Key:** שם המשתנה (למשל: `BEDS24_TOKEN`)
   - **Value:** הערך של המשתנה
   - **Environment:** בחר **All** (Production, Preview, Development)

5. **חזור על זה** לכל המשתנים למעלה

---

## ⚠️ אל תשכח לשנות:

- `NEXTAUTH_URL` → הדומיין האמיתי שלך
- `NEXT_PUBLIC_BASE_URL` → הדומיין האמיתי שלך
- `CRON_SECRET` → סיסמה חזקה חדשה!

---

**רוצה שאעזור עם משהו ספציפי?** 🚀