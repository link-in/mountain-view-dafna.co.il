# 🏔️ HOSTLY - Tech Stack & Services

## 📋 סיכום מהיר

פלטפורמת ניהול הזמנות ליחידות אירוח עם אוטומציה של הודעות WhatsApp וניהול מנויים.

---

## 🛠️ טכנולוגיות עיקריות

### Frontend & Framework
- **Next.js 15** - React framework עם App Router
- **TypeScript** - Type safety
- **React 18** - UI library
- **Bootstrap 5** - UI framework (RTL support)
- **next-auth (Auth.js)** - Authentication

### Backend & Database
- **Supabase** - PostgreSQL database + Row Level Security
- **Vercel** - Hosting & deployment
- **Node.js** - Runtime environment


### External APIs & Services
- **Beds24 API** - מערכת ניהול הזמנות
  - Booking creation
  - Webhooks for notifications
  - Property & Room management
  
- **UltraMsg API** - שליחת הודעות WhatsApp
  - Guest notifications
  - Owner alerts
  - Booking confirmations

---

## 📦 מבנה המערכת

### 1. **Public Pages (Landing Site)**
```
/                  → דף הבית (Homepage)
/about             → אודות
/contact           → יצירת קשר
/service           → שירותים
/shop              → חנות (אם קיימת)
```

### 2. **Authentication System**
- NextAuth.js עם Credentials provider
- JWT tokens
- Session management
- Role-based access (Admin/Owner)

### 3. **Dashboard System**
```
/dashboard         → לוח בקרה לבעלי יחידות
/dashboard/login   → התחברות למערכת
/dashboard/bookings → יצירת הזמנות
/dashboard/logs    → צפייה בהיסטוריית התראות
```

### 4. **Admin System**
```
/admin                  → לוח בקרה אדמין
/admin/users            → ניהול משתמשים (CRUD)
/admin/subscriptions    → ניהול מנויים וחיובים
/admin/settings         → הגדרות (תכנון עתידי)
/admin/analytics        → דוחות וסטטיסטיקות (תכנון עתידי)
```

### 5. **Special Routes**
```
/api/ical          → iCal feed לסנכרון לוח שנה
/api/webhook       → Beds24 webhooks endpoint
```

### 6. **Booking Flow**
```
1. Dashboard → Create Booking
2. Beds24 API → Save booking
3. WhatsApp → Notify guest & owner
4. Supabase → Log notification
```

### 7. **Webhook System**
```
Beds24 Webhook → /api/webhook
  ↓
Parse booking data
  ↓
Send WhatsApp messages
  ↓
Log to notifications_log
```

---

## 🗄️ מבנה Database (Supabase)

### טבלאות עיקריות:

#### **users**
```sql
- id (TEXT)
- email (UNIQUE)
- password_hash
- first_name, last_name
- display_name
- property_id, room_id
- phone_number
- landing_page_url
- role (admin/owner)
```

#### **notifications_log**
```sql
- id (UUID)
- booking_id
- guest_name, guest_phone
- owner_email, owner_phone
- property_id, room_id
- check_in, check_out
- status (success/failed)
- whatsapp_status
```

#### **subscription_plans**
```sql
- id (free/basic/pro/enterprise)
- display_name
- monthly_price, yearly_price
- max_properties
- max_whatsapp_per_month
- features (JSONB)
```

#### **subscriptions**
```sql
- id (UUID)
- user_id
- plan_id
- status (active/trial/cancelled)
- billing_cycle
- expires_at
```

#### **usage_stats**
```sql
- user_id
- month
- whatsapp_sent, whatsapp_failed
- bookings_created
- api_calls
```

#### **invoices** + **payment_history**
(מוכנים לעתיד)

---

## 🔌 API Routes

### 🌐 Public APIs (No auth required)
```
POST /api/webhook              → Beds24 webhooks receiver
GET  /api/ical                 → iCal calendar feed
```

### 👤 Protected APIs - Owner Role
```
GET  /api/dashboard/info       → פרטי בעל יחידה (property_id, room_id, etc.)
POST /api/dashboard/bookings   → יצירת הזמנה חדשה ב-Beds24
GET  /api/dashboard/logs       → היסטוריית התראות והודעות
```

### 🔧 Protected APIs - Admin Role Only
```
# User Management
GET    /api/admin/users        → רשימת כל המשתמשים
POST   /api/admin/users        → יצירת משתמש חדש
PUT    /api/admin/users/[id]   → עדכון פרטי משתמש
DELETE /api/admin/users/[id]   → מחיקת משתמש

# Subscription Management
GET    /api/admin/subscriptions → נתוני מנויים, שימוש, סטטיסטיקות
```

### 🔐 Auth APIs (NextAuth.js)
```
POST /api/auth/signin          → התחברות למערכת
POST /api/auth/signout         → יציאה מהמערכת
GET  /api/auth/session         → קבלת פרטי session נוכחי
GET  /api/auth/csrf            → CSRF token
GET  /api/auth/providers       → רשימת providers
```

---

## 🔐 Security Features

### Row Level Security (RLS)
- Users table: policy "Allow all operations"
- Notifications: accessible to all authenticated users
- Subscriptions: admin-managed

### Middleware Protection
```typescript
// src/middleware.ts
- /admin/* → Admin only
- Redirect unauthorized to /dashboard
```

### API Authorization
```typescript
// Check session + role in API routes
const session = await getServerSession(authOptions)
if (session?.user?.role !== 'admin') {
  return 401
}
```

---

## 📱 WhatsApp Integration

### Flow:
1. **Guest notification:**
   ```
   שלום {name}! 🏔️
   קיבלנו את הזמנתך ב-{property}.
   📅 תאריך כניסה: {checkIn}
   נשמח לארח אותך! 🎉
   ```

2. **Owner notification:**
   ```
   🔔 הזמנה חדשה!
   אורח: {name}
   📅 כניסה: {checkIn} | יציאה: {checkOut}
   👥 מבוגרים: {adults}
   💰 מחיר: ₪{price}
   ```

### Configuration:
- `ULTRAMSG_INSTANCE_ID`
- `ULTRAMSG_TOKEN`

---

## 🏗️ Deployment

### Environment Variables (Vercel)
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# NextAuth
NEXTAUTH_SECRET=
NEXTAUTH_URL=

# Beds24
BEDS24_API_KEY=
BEDS24_WEBHOOK_SECRET=

# WhatsApp (UltraMsg)
ULTRAMSG_INSTANCE_ID=
ULTRAMSG_TOKEN=
```

### Build Process
```bash
git push origin main
  ↓
Vercel detects changes
  ↓
Build Next.js app
  ↓
Deploy to production
```

---

## 📊 Monitoring & Logs

### Vercel Logs
- Real-time deployment logs
- Function execution logs
- Error tracking

### Supabase Logs
- Database queries
- RLS policy checks
- Function executions

### Application Logs
```typescript
console.log('📝 Starting WhatsApp/Supabase process...')
console.log('✅ Saved to Supabase!')
console.error('❌ WhatsApp failed:', error)
```

---

## 🚀 Key Features

### ✅ Implemented:
- ✅ User authentication with roles (Admin/Owner)
- ✅ Dashboard for property owners
- ✅ Manual booking creation
- ✅ Automatic WhatsApp notifications (guest + owner)
- ✅ Beds24 webhook integration
- ✅ Notification logging
- ✅ Admin panel for user management
- ✅ Subscription plans system
- ✅ Usage tracking (WhatsApp, bookings)
- ✅ First name & last name fields

### 🔄 In Progress / Future:
- 🔄 Payment gateway integration
- 🔄 Invoice generation
- 🔄 Multi-property support per user
- 🔄 Advanced analytics dashboard
- 🔄 Email notifications
- 🔄 SMS backup for WhatsApp failures

---

## 📚 Documentation Files

```
/ADMIN_SETUP.md              → Admin system setup guide
/BILLING_SETUP.md            → Billing system guide
/RUN_THIS_FIRST.md           → Quick start instructions
/BEDS24_WEBHOOK_SETUP.md     → Beds24 webhook configuration
/ULTRAMSG_SETUP.md           → WhatsApp setup guide
/OWNER_NOTIFICATIONS.md      → Notification system docs
/SUPABASE_USERS_MIGRATION.md → Database migration guide
/TECH_STACK.md               → This file
```

---

## 🎯 Business Model

### Subscription Tiers:
- **חינם (Free)**: 1 property, 50 WhatsApp/month
- **בסיסי (Basic)**: ₪99/month, 1 property, 200 WhatsApp
- **מקצועי (Pro)**: ₪199/month, 5 properties, 1000 WhatsApp
- **ארגוני (Enterprise)**: ₪399/month, unlimited

---

## 🔧 Development Tools

- **Bun** - Package manager & runtime
- **Git & GitHub** - Version control
- **Cursor IDE** - Development environment
- **Supabase Studio** - Database management
- **Vercel Dashboard** - Deployment & monitoring

---

## 📞 Support & Contact

Project: **HOSTLY - Mountain View Management System**
Version: **2.0**
Last Updated: **January 2026**

---

**Built with ❤️ for hospitality professionals** 🏔️
