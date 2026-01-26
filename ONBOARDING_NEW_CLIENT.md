# 🏠 מדריך הוספת לקוח חדש (יחידת אירוח) ל-HOSTLY

---

## 📋 **סקירה כללית**

מדריך זה מסביר כיצד להוסיף לקוח חדש עם יחידת אירוח חדשה למערכת HOSTLY.

---

## 🔑 **שלב 1: הכנה - איסוף נתונים מ-Beds24**

### **מה צריך לקבל מהלקוח:**

1. **פרטי הכניסה ל-Beds24:**
   - כתובת מייל של חשבון Beds24
   - גישה לחשבון (או שהלקוח שולח לך את הנתונים)

2. **מזהי Beds24:**
   
   **Property ID:**
   ```
   Beds24 Dashboard
   → Settings
   → Properties
   → בחר את הנכס
   → Property ID (למשל: 306559)
   ```
   
   **Room ID:**
   ```
   Beds24 Dashboard
   → Settings
   → Rooms
   → בחר את החדר/יחידה
   → Room ID (למשל: 638851)
   ```

### **פרטים נוספים מהלקוח:**

- ✅ **אימייל** - לכניסה למערכת HOSTLY
- ✅ **סיסמה** - לקוח יבחר או תיצור עבורו
- ✅ **שם פרטי + משפחה**
- ✅ **שם תצוגה** - שם יחידת האירוח (למשל: "דירת נופש בתל אביב")
- ⚪ **טלפון** (אופציונלי)
- ⚪ **כתובת אתר נחיתה** (אופציונלי)

---

## 💻 **שלב 2: הוספת המשתמש במערכת**

### **אופציה 1: דרך ממשק האדמין (UI)** ⭐ מומלץ

1. התחבר כ-admin ל: `https://mountain-view-dafna.co.il/admin`

2. לחץ על **"ניהול משתמשים"**

3. לחץ על **"+ הוסף משתמש"**

4. מלא את הטופס:
   ```
   📧 אימייל: user@example.com
   🔑 סיסמה: ******** (לפחות 6 תווים)
   
   👤 שם פרטי: משה
   👤 שם משפחה: כהן
   🏠 שם תצוגה: דירת נופש בתל אביב
   
   🏢 Property ID: 306559
   🛏️ Room ID: 638851
   
   🌐 כתובת אתר: https://example.com (אופציונלי)
   📱 טלפון: +972501234567 (אופציונלי)
   ```

5. לחץ **"שמור"**

6. ✅ המשתמש נוצר!

---

### **אופציה 2: דרך Supabase SQL Editor** 🗄️

```sql
-- Hash password first using bcryptjs
-- Password: YourPassword123
-- Run: node scripts/generate-demo-password.js

INSERT INTO users (
  id, 
  email, 
  password_hash, 
  display_name, 
  first_name,
  last_name,
  property_id, 
  room_id, 
  landing_page_url, 
  phone_number,
  role,
  is_demo
)
VALUES (
  'user_' || extract(epoch from now())::text,  -- Auto-generated ID
  'newuser@example.com',
  '$2b$10$YOUR_HASHED_PASSWORD_HERE',  -- Use bcrypt hash!
  'דירת נופש בתל אביב',
  'משה',
  'כהן',
  '306559',  -- Property ID from Beds24
  '638851',  -- Room ID from Beds24
  'https://example.com',
  '+972501234567',
  'owner',
  false  -- Not a demo user
);
```

---

### **אופציה 3: דרך API** 🔌

```bash
curl -X POST https://mountain-view-dafna.co.il/api/admin/users/create \
  -H "Content-Type: application/json" \
  -H "Cookie: your-admin-session-cookie" \
  -d '{
    "email": "newuser@example.com",
    "password": "SecurePassword123",
    "displayName": "דירת נופש בתל אביב",
    "firstName": "משה",
    "lastName": "כהן",
    "propertyId": "306559",
    "roomId": "638851",
    "landingPageUrl": "https://example.com",
    "phoneNumber": "+972501234567"
  }'
```

---

## ✅ **שלב 3: אימות החיבור ל-Beds24**

לאחר יצירת המשתמש, בדוק שהחיבור עובד:

1. **התחבר למערכת:**
   ```
   URL: https://mountain-view-dafna.co.il/dashboard/login
   אימייל: האימייל שהגדרת
   סיסמה: הסיסמה שהגדרת
   ```

2. **בדוק שהנתונים נטענים:**
   - ✅ הזמנות מופיעות מ-Beds24
   - ✅ מחירי לילה נטענים
   - ✅ לוח שנה עובד

3. **אם יש שגיאה:**
   - 🔍 בדוק ש-Property ID תקין
   - 🔍 בדוק ש-Room ID תקין
   - 🔍 בדוק ש-Beds24 API token עובד
   - 🔍 בדוק logs בקונסול

---

## 🔐 **שלב 4: שליחת פרטי גישה ללקוח**

### **מייל ללקוח:**

```
נושא: פרטי כניסה למערכת HOSTLY - ניהול יחידת האירוח שלך

היי [שם הלקוח],

ברוכים הבאים ל-HOSTLY! 🎉

להלן פרטי הגישה למערכת:

🔗 כתובת התחברות:
https://mountain-view-dafna.co.il/dashboard/login

📧 אימייל:
[האימייל שהגדרת]

🔑 סיסמה:
[הסיסמה שהגדרת]

💡 המלצה: החלף את הסיסמה לאחר הכניסה הראשונה דרך "איזור אישי"

במערכת תוכל:
- 📊 לצפות בכל ההזמנות שלך
- 💰 לעקוב אחרי הכנסות ועמלות
- 📱 לקבל התראות WhatsApp על הזמנות חדשות
- 🎯 לנהל מחירים וזמינות

צריך עזרה? צור קשר!

HOSTLY Team
```

---

## 🧪 **שלב 5: בדיקת תקינות**

### **Checklist לבדיקה:**

- [ ] **התחברות עובדת** - הלקוח יכול להתחבר
- [ ] **הזמנות נטענות** - רואה הזמנות מ-Beds24
- [ ] **מחירים נטענים** - לוח שנה עובד
- [ ] **סטטיסטיקות נכונות** - הכנסות, עמלות, וכו'
- [ ] **שם מוצג נכון** - שם יחידת האירוח בהידר
- [ ] **WhatsApp** - אם רלוונטי (צריך להגדיר מספר)
- [ ] **דף נחיתה** - קישור עובד (אם הוגדר)

---

## ⚠️ **בעיות נפוצות ופתרונות**

### **בעיה 1: "טעינת הזמנות נכשלה"**
**פתרון:**
- בדוק ש-Property ID ו-Room ID נכונים
- ודא שהחשבון ב-Beds24 פעיל
- בדוק שהיחידה מחוברת ל-API

### **בעיה 2: "אימייל או סיסמה שגויים"**
**פתרון:**
- ודא שהאימייל נכתב נכון (lowercase)
- בדוק שהסיסמה הוצפנה נכון
- אפס סיסמה במידת הצורך

### **בעיה 3: "No data from Beds24"**
**פתרון:**
- בדוק ב-Beds24 שיש הזמנות קיימות
- ודא שה-API token תקף
- בדוק את `.env.local` שיש את כל המשתנים

---

## 🛠️ **כלים עזר**

### **1. יצירת סיסמה מוצפנת:**
```bash
node scripts/generate-demo-password.js
```
(ערוך את הסיסמה בקובץ לפני הרצה)

### **2. בדיקת חיבור ל-Beds24:**
```bash
# Test API connection
curl https://api.beds24.com/v2/properties/[PROPERTY_ID] \
  -H "Authorization: Bearer [YOUR_TOKEN]"
```

### **3. בדיקת המשתמש ב-Supabase:**
```sql
SELECT id, email, display_name, property_id, room_id, role, is_demo
FROM users
WHERE email = 'newuser@example.com';
```

---

## 📊 **מבנה טבלת Users**

```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  display_name TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  property_id TEXT NOT NULL,
  room_id TEXT NOT NULL,
  landing_page_url TEXT,
  phone_number TEXT,
  role TEXT DEFAULT 'owner',
  is_demo BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🎯 **תזרים מלא - דוגמה:**

```
יום 1: לקוח חדש מתעניין
  ↓
יום 2: לקוח יוצר חשבון Beds24
  ↓
יום 3: לקוח שולח Property ID + Room ID
  ↓
יום 3: אתה יוצר משתמש דרך /admin/users
  ├─ אימייל: client@example.com
  ├─ סיסמה: TempPassword123
  ├─ Property: 306559
  └─ Room: 638851
  ↓
יום 3: שולח פרטי כניסה ללקוח במייל
  ↓
יום 3: לקוח מתחבר ובודק
  ├─ רואה הזמנות ✅
  ├─ רואה מחירים ✅
  └─ משנה סיסמה ✅
  ↓
✅ לקוח פעיל!
```

---

## 🎓 **הדרכה ללקוח החדש**

שלח ללקוח קישור למדריך משתמש:
- 📊 איך לצפות בהזמנות
- 💰 איך להבין את הכנסות ועמלות
- ➕ איך להוסיף הזמנה ידנית
- 📱 איך להגדיר התראות WhatsApp
- 🎨 איך להתאים את דף הנחיתה

---

## 📝 **רשימת נתונים לאיסוף**

טופס לשליחה ללקוח:

```
🏠 פרטי יחידת האירוח:
□ שם יחידת האירוח: _______________
□ שם פרטי: _______________
□ שם משפחה: _______________

📧 פרטי חשבון:
□ אימייל להתחברות: _______________
□ סיסמה רצויה: _______________ (לפחות 6 תווים)

🔌 חיבור Beds24:
□ Property ID: _______________
□ Room ID: _______________

📞 פרטים נוספים (אופציונלי):
□ טלפון: _______________
□ כתובת אתר: _______________
```

---

## ⚡ **Quick Start - תהליך מהיר**

```bash
# 1. קבל נתונים מלקוח (Property ID, Room ID, Email)

# 2. התחבר לאדמין
https://mountain-view-dafna.co.il/admin

# 3. לחץ "ניהול משתמשים" → "+ הוסף משתמש"

# 4. מלא טופס → שמור

# 5. שלח פרטי כניסה ללקוח

# ✅ סיימנו!
```

---

## 🔍 **נקודות לבדיקה לאחר יצירת משתמש**

1. **הלקוח מתחבר בהצלחה?**
   - ✅ כן → מעולה!
   - ❌ לא → בדוק אימייל/סיסמה

2. **רואה הזמנות?**
   - ✅ כן → Property/Room ID נכונים
   - ❌ לא → בדוק ב-Beds24

3. **מחירים נטענים?**
   - ✅ כן → חיבור API תקין
   - ❌ לא → בדוק API token

4. **שם מוצג נכון?**
   - ✅ כן → display_name נשמר
   - ❌ לא → ערוך משתמש

---

## 🎉 **סיכום התהליך**

| שלב | פעולה | זמן משוער |
|-----|-------|-----------|
| 1 | איסוף נתונים מלקוח | 5 דקות |
| 2 | יצירת משתמש באדמין | 2 דקות |
| 3 | שליחת פרטי גישה | 1 דקה |
| 4 | בדיקת תקינות | 3 דקות |
| **סה"כ** | **תהליך מלא** | **~10 דקות** |

---

## 📚 **קבצים רלוונטיים במערכת**

- `src/lib/auth/getUsersDb.ts` - פונקציות ניהול משתמשים
- `src/app/api/admin/users/create/route.ts` - API ליצירת משתמש חדש
- `src/app/admin/users/page.tsx` - ממשק ניהול משתמשים
- `supabase-migrations/006_create_demo_user.sql` - דוגמה ליצירת משתמש

---

## 🔐 **אבטחה**

- ✅ סיסמאות מוצפנות ב-bcrypt (10 rounds)
- ✅ אימיילים unique (לא ניתן לרישום כפול)
- ✅ רק admin יכול ליצור משתמשים
- ✅ נתוני Beds24 מבודדים (כל משתמש רואה רק את שלו)

---

## 💡 **טיפים**

1. **סיסמה זמנית:**
   - תן ללקוח סיסמה זמנית פשוטה
   - הנחה אותו לשנות אותה באיזור אישי

2. **שם תצוגה:**
   - השתמש בשם ברור ומזהה
   - למשל: "וילה ביער - משפחת כהן"

3. **Property/Room IDs:**
   - שמור רשימה של כל ה-IDs
   - זה יעזור בתחזוקה

4. **טסטים:**
   - צור הזמנה בדיקה ב-Beds24
   - ודא שהיא מופיעה בדשבורד

---

**🚀 מוכן להתחיל? בואו נבצע את התהליך יחד!**
