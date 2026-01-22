# 💰 HOSTLY Billing System - Setup Guide

## 📋 Overview

מערכת ניהול מנויים ותשלומים עבור HOSTLY Platform - SaaS Billing System.

---

## 🚀 Setup Instructions

### **שלב 1: הרץ את ה-SQL Migration ב-Supabase**

1. פתח את **Supabase Dashboard**
2. לך ל-**SQL Editor**
3. העתק והרץ את הקובץ:
   ```
   supabase/migrations/004_create_billing_system.sql
   ```

זה יוסיף:
- ✅ טבלת `subscription_plans` (4 תוכניות: Free, Basic, Pro, Enterprise)
- ✅ טבלת `subscriptions` (מנויים של משתמשים)
- ✅ טבלת `invoices` (חשבוניות)
- ✅ טבלת `usage_stats` (מעקב שימוש חודשי)
- ✅ טבלת `payment_history` (היסטוריית תשלומים)
- ✅ Functions עזר לניהול שימוש
- ✅ מנוי ניסיון חינם ל-30 יום לכל המשתמשים הקיימים

---

## 📦 **מה נוצר:**

### **1. תוכניות מנוי (Subscription Plans):**

| תוכנית | מחיר חודשי | יחידות | הודעות WhatsApp | תכונות |
|--------|------------|---------|------------------|---------|
| **חינם** | ₪0 | 1 | 50/חודש | דשבורד בסיסי |
| **בסיסי** | ₪99 | 1 | 200/חודש | דשבורד מלא + תמיכה |
| **מקצועי** | ₪199 | 5 | 1,000/חודש | דוחות מתקדמים |
| **ארגוני** | ₪399 | ∞ | ∞ | הכל ללא הגבלה |

---

### **2. מעקב שימוש אוטומטי:**

המערכת עוקבת אחרי:
- ✅ הודעות WhatsApp שנשלחו
- ✅ הודעות WhatsApp שנכשלו
- ✅ הזמנות שנוצרו
- ✅ קריאות API

---

## 🎯 **תכונות:**

### ✅ **דף ניהול מנויים לאדמין:**

```
/admin/subscriptions
```

תראה:
- 📊 סטטיסטיקות (הכנסות, מנויים פעילים, וכו')
- 👥 רשימת כל המנויים
- 📈 שימוש חודשי (WhatsApp, הזמנות)
- 🔔 התראות על חריגת מכסה

---

### ✅ **בדיקת מגבלות אוטומטית:**

לפני שליחת WhatsApp, המערכת בודקת:
```typescript
const limits = await checkUserLimits(userId)

if (!limits.canSendWhatsApp) {
  // חסם שליחה - המשתמש חרג מהמכסה
}
```

---

## 📂 **מבנה הקבצים:**

```
HOSTLY Platform
├── /admin/subscriptions
│   └── page.tsx                    # דף ניהול מנויים
├── /api/admin/subscriptions
│   └── route.ts                    # API למנויים
├── /lib/billing
│   └── usage.ts                    # Helper functions
└── supabase/migrations
    └── 004_create_billing_system.sql
```

---

## 🔧 **שימוש בקוד:**

### **בדוק מגבלות משתמש:**

```typescript
import { checkUserLimits } from '@/lib/billing/usage'

const limits = await checkUserLimits(userId)

console.log(limits)
// {
//   hasActiveSubscription: true,
//   canSendWhatsApp: true,
//   planName: "מקצועי",
//   whatsappUsed: 45,
//   whatsappLimit: 1000,
//   whatsappRemaining: 955
// }
```

### **עקוב אחרי שימוש:**

```typescript
import { incrementWhatsAppUsage } from '@/lib/billing/usage'

// אחרי שליחת WhatsApp
await incrementWhatsAppUsage(userId, success)
```

---

## 💳 **אינטגרציה עם Stripe (עתידי):**

### **מה צריך להוסיף:**

1. **התקנה:**
   ```bash
   npm install stripe @stripe/stripe-js
   ```

2. **Environment Variables:**
   ```env
   STRIPE_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

3. **דף תשלום למשתמשים:**
   - `/dashboard/billing` - בחירת תוכנית
   - אינטגרציה עם Stripe Checkout
   - עדכון מנוי אוטומטי

---

## 📊 **מה האדמין רואה:**

### **דף מנויים (`/admin/subscriptions`):**

```
╔══════════════════════════════════════════════════╗
║  💰 ניהול מנויים                                 ║
╠══════════════════════════════════════════════════╣
║  📊 הכנסות חודשיות: ₪2,450                      ║
║  ✅ מנויים פעילים: 15                           ║
║  🔔 תקופות ניסיון: 3                            ║
║  ❌ פגי תוקף: 2                                  ║
╠══════════════════════════════════════════════════╣
║ משתמש    │ תוכנית │ שימוש WhatsApp  │ תוקף      ║
║ ─────────┼─────────┼─────────────────┼───────────║
║ בעל 1    │ Pro     │ ███░░ 45/1000   │ 01/02/26  ║
║ בעל 2    │ Basic   │ ███████ 180/200 │ 15/02/26  ║
╚══════════════════════════════════════════════════╝
```

---

## 🔒 **אבטחה:**

1. ✅ **RLS (Row Level Security)** - כל הטבלאות מוגנות
2. ✅ **Admin Only** - רק אדמינים רואים דף מנויים
3. ✅ **Validation** - בדיקת מגבלות לפני כל פעולה

---

## 🚀 **Next Steps:**

### **Phase 1 - Basic (Done!):**
- ✅ טבלאות Supabase
- ✅ מעקב שימוש
- ✅ דף אדמין

### **Phase 2 - Payments (Future):**
- [ ] אינטגרציה עם Stripe
- [ ] דף תשלום למשתמשים
- [ ] חשבוניות אוטומטיות
- [ ] התראות על פקיעת מנוי

### **Phase 3 - Advanced (Future):**
- [ ] דוחות מתקדמים
- [ ] Export data
- [ ] Analytics
- [ ] Refund management

---

## 🧪 **בדיקה:**

### **1. וודא שהטבלאות נוצרו:**
```sql
SELECT * FROM subscription_plans;
SELECT * FROM subscriptions;
SELECT * FROM usage_stats;
```

### **2. בדוק מנוי ניסיון:**
```sql
SELECT u.email, s.plan_id, s.status, s.expires_at
FROM users u
JOIN subscriptions s ON u.id = s.user_id;
```

### **3. נסה את דף האדמין:**
```
http://localhost:3000/admin/subscriptions
```

---

## 🐛 **Troubleshooting:**

### **בעיה: לא רואה את דף המנויים**

**פתרון:**
1. וודא שה-SQL migration רץ
2. רענן את הדפדפן (Ctrl+Shift+R)
3. בדוק console לשגיאות

### **בעיה: "Failed to fetch subscriptions"**

**פתרון:**
```sql
-- בדוק שהטבלאות קיימות
SELECT tablename FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename LIKE '%subscription%';
```

---

## 📞 **Support:**

**יצרת את הטבלאות?** ✅  
**נכנסת ל-/admin/subscriptions?** ✅  
**רואה את המנויים?** ✅  

---

**🎉 מערכת הביל ing מוכנה לשימוש!**

**עכשיו אפשר:**
- ✅ לעקוב אחרי שימוש
- ✅ לנהל מנויים
- ✅ לראות סטטיסטיקות
- ⏭️ בשלב הבא: להוסיף Stripe לתשלומים אמיתיים
