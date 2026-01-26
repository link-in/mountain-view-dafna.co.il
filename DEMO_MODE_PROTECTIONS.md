# 🛡️ Demo Mode - הגנות ואבטחה

## סיכום ההגנות שמיושמות במצב דמו

---

## 🚫 **מה חסום במצב דמו?**

### 1. ✅ **הוספת הזמנות חדשות**

**מה קורה כשמנסים להוסיף הזמנה:**

```typescript
POST /api/dashboard/bookings

// Server checks:
if (session?.user?.isDemo) {
  // ❌ לא שומר ב-Beds24
  // ❌ לא שולח WhatsApp
  // ❌ לא שומר ב-notifications_log
  // ✅ מחזיר success מזויף
  
  return {
    success: true,
    demo: true,
    message: 'Demo Mode: סימולציה בלבד'
  }
}
```

**בUI:**
```
🎭 מצב דמו: ההזמנה נוצרה בסימולציה בלבד.
לא נשמרה בפועל ולא נשלחה הודעת WhatsApp.
```

---

### 2. ✅ **גישה לנתוני Beds24**

**Demo user משתמש ב-Mock Provider:**

```typescript
// In getDashboardProvider()
if (user?.isDemo) {
  return mockDashboardProvider  // ← נתונים מדומים
}
```

- ❌ אין קריאות ל-Beds24 API
- ✅ כל הנתונים מגיעים מ-`mock.ts`
- ✅ 40 הזמנות מדומות
- ✅ 365 ימי מחירים מדומים

---

### 3. ✅ **הודעות WhatsApp**

**חסום ברמת API:**

```typescript
// Blocked before reaching sendWhatsAppMessage()
if (session?.user?.isDemo) {
  return fake_success
}
```

- ❌ לא נשלחות הודעות אמיתיות
- ✅ מספר הטלפון לא משמש
- ✅ UltraMsg API לא נקרא

---

### 4. ✅ **שינויי מחירים**

**(לא מיושם עדיין - צריך להוסיף בעתיד)**

כרגע: demo user יכול לנסות לשנות מחירים, אבל:
- property_id = "DEMO_999999" ← ייכשל ב-Beds24

**TODO**: הוסף הגנה דומה ב-`/api/dashboard/pricing`

---

## 🔍 **איפה מיושמות ההגנות?**

### קובץ: `src/app/api/dashboard/bookings/route.ts`

```typescript
export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  
  // 🎭 Demo Mode Protection
  if (session?.user?.isDemo) {
    console.log('🎭 Demo user - blocking real action')
    return NextResponse.json({
      success: true,
      message: 'Demo Mode: הזמנה נוצרה בהצלחה (סימולציה בלבד)',
      demo: true,
      booking: {
        id: `demo_${Date.now()}`,
        status: 'confirmed',
        message: 'במצב דמו, הזמנות לא נשמרות בפועל'
      }
    })
  }
  
  // Continue with real logic...
}
```

### קובץ: `src/app/dashboard/DashboardClient.tsx`

```typescript
const result = await response.json()
if (result.demo) {
  setSaveReservationSuccess(
    '🎭 מצב דמו: ההזמנה נוצרה בסימולציה בלבד.'
  )
}
```

---

## 🧪 **בדיקות**

### Test Case 1: נסיון להוסיף הזמנה

```
GIVEN user is logged in as demo@hostly.co.il
WHEN user fills "New Reservation" form
AND clicks "Save"
THEN API returns fake success
AND no data is saved to Beds24
AND no WhatsApp is sent
AND UI shows demo warning message
```

### Test Case 2: רענון נתונים

```
GIVEN demo user is logged in
WHEN dashboard loads/refreshes
THEN shows same 40 mock reservations
AND NOT affected by "new booking" attempt
```

---

## 🔐 **Security Checklist**

- [x] Demo user מזוהה ע"י `isDemo` flag ב-JWT
- [x] הוספת הזמנות חסומה ב-API level
- [x] WhatsApp לא נשלח
- [x] Beds24 API לא נקרא
- [x] UI מציג אזהרה ברורה
- [ ] **TODO**: חסום גם שינויי מחירים
- [ ] **TODO**: חסום עדכון פרופיל (או הפוך ל-demo only)

---

## 📝 **המלצות נוספות**

### 1. הוסף הגנה לשינויי מחירים
```typescript
// In /api/dashboard/pricing
if (session?.user?.isDemo) {
  return fake_success
}
```

### 2. הוסף rate limiting
```typescript
// Prevent abuse of demo account
if (session?.user?.isDemo) {
  // Max 10 actions per hour
}
```

### 3. הוסף analytics
```typescript
// Track demo usage
if (session?.user?.isDemo) {
  await logDemoAction({
    action: 'create_booking',
    timestamp: Date.now()
  })
}
```

---

## 🎯 **סיכום**

| פעולה | Demo User | Regular User |
|-------|-----------|--------------|
| **צפייה בהזמנות** | ✅ (mock) | ✅ (Beds24) |
| **הוספת הזמנה** | ❌ (fake) | ✅ (real) |
| **שליחת WhatsApp** | ❌ חסום | ✅ נשלח |
| **שינוי מחירים** | ⚠️ ייכשל | ✅ עובד |
| **עדכון פרופיל** | ✅ עובד | ✅ עובד |

**✅ Demo Mode מוגן ובטוח לשיתוף עם בודקים!**

---

**Last Updated**: 2026-01-26  
**Status**: ✅ Protected
