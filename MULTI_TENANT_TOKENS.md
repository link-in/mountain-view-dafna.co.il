# 🔐 מערכת Tokens רב-משתמשית ל-Beds24

---

## 📋 **סקירה**

המערכת עכשיו תומכת ב-**2 מצבי עבודה**:

1. **Token גלובלי** (Fallback) - משותף לכל הפרויקט
2. **Token למשתמש** - כל לקוח יכול להיות עם חשבון Beds24 משלו

---

## 🏗️ **איך זה עובד?**

### **תהליך אוטומטי:**

```
כשמשתמש מתחבר:
  1. המערכת בודקת - האם יש לו Tokens משלו?
     ├─ יש → משתמש בטוקנים שלו ✅
     └─ אין → משתמש בטוקן הגלובלי 🌍
  
  2. המערכת מושכת נתונים מ-Beds24 עם הטוקן הנכון
  3. כל משתמש רואה רק את הנתונים שלו!
```

---

## 📝 **שלב 1: רץ ב-Supabase SQL Editor**

```sql
-- הפעל את המיגרציה הזו כדי להוסיף שדות Tokens לטבלת users
-- קובץ: supabase-migrations/007_add_beds24_tokens_to_users.sql

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS beds24_token TEXT,
ADD COLUMN IF NOT EXISTS beds24_refresh_token TEXT;

CREATE INDEX IF NOT EXISTS idx_users_beds24_token ON users(beds24_token) WHERE beds24_token IS NOT NULL;

COMMENT ON COLUMN users.beds24_token IS 'Beds24 API access token - unique per user account';
COMMENT ON COLUMN users.beds24_refresh_token IS 'Beds24 API refresh token - for renewing access token';
```

---

## 🔑 **שלב 2: איך למצוא Tokens ב-Beds24?**

### **אם דלית שבת יצרה חשבון Beds24 חדש:**

1. **התחבר לחשבון Beds24 של דלית**

2. **לך ל: Settings → API Keys**

3. **תיצור API Key חדש:**
   ```
   Settings → API Keys → Create New Key
   
   מה תקבל:
   - Access Token (ארוך מאוד)
   - Refresh Token (ארוך מאוד)
   ```

4. **העתק את שני הטוקנים** - תצטרך אותם בשלב הבא

---

## ✅ **שלב 3: הוספת הטוקנים למשתמש**

### **אופציה 1: דרך ממשק האדמין** ⭐ מומלץ

1. **מחק את המשתמש הקיים של דלית**
   ```
   /admin/users → מצא את דלית → מחק
   ```

2. **צור מחדש עם הטוקנים:**
   ```
   /admin/users/create
   
   מלא:
   ✅ כל הפרטים הרגילים (אימייל, סיסמה, וכו')
   ✅ Property ID מהחשבון של דלית
   ✅ Room ID מהחשבון של דלית
   🔑 Beds24 Access Token (מהשלב הקודם)
   🔑 Beds24 Refresh Token (מהשלב הקודם)
   ```

3. **שמור** - זהו!

---

### **אופציה 2: עדכון ידני ב-Supabase**

```sql
UPDATE users
SET 
  beds24_token = 'ACCESS_TOKEN_FROM_BEDS24',
  beds24_refresh_token = 'REFRESH_TOKEN_FROM_BEDS24'
WHERE email = 'dalitshabat@example.com';
```

---

## 🧪 **בדיקה**

1. **התנתק** מהדשבורד

2. **התחבר** עם המשתמש של דלית

3. **פתח Developer Tools (F12)** → Console

4. **תראה הודעה:**
   ```
   🔑 Using user-specific Beds24 tokens
   🔍 Fetching bookings for Property: [PROPERTY_ID], Room: [ROOM_ID]
   ✅ Fetched [X] bookings
   ```

5. **בדוק:**
   - ✅ האם רואה הזמנות של דלית?
   - ✅ מחירים נכונים?
   - ✅ סטטיסטיקות נכונות?

---

## 📊 **לוג קונסול**

המערכת תדפיס הודעות ברורות:

```bash
# משתמש עם טוקנים משלו:
🔑 Using user-specific Beds24 tokens
🔍 Fetching bookings for Property: 123456, Room: 789012

# משתמש בלי טוקנים (משתמש בגלובלי):
🌍 Using global Beds24 tokens
🔍 Fetching bookings for Property: 306559, Room: 638851
```

---

## ⚠️ **חשוב לדעת:**

1. **Token Refresh אוטומטי:**
   - כשהטוקן מתפוגג, המערכת תרענן אותו אוטומטית
   - זה קורה בשקיפות מלאה

2. **Fallback לגלובלי:**
   - אם משתמש לא מגדיר טוקנים → משתמש בגלובלי
   - זה אומר שאפשר לערבב:
     - חלק מהמשתמשים עם טוקנים משלהם
     - חלק משתמשים בגלובלי

3. **אבטחה:**
   - הטוקנים נשמרים מוצפנים ב-DB
   - רק המערכת יכולה לגשת אליהם
   - לא נחשפים בלוגים או ל-client

---

## 🎯 **תרחישי שימוש**

### **תרחיש 1: לקוח עם חשבון Beds24 משלו**
```
✅ הכנס Tokens בעת יצירת המשתמש
→ הלקוח רואה רק את הנתונים שלו
```

### **תרחיש 2: לקוח ב-Property בחשבון שלך**
```
⭕ אל תכניס Tokens
→ המערכת משתמשת בטוקן הגלובלי
→ הלקוח רואה רק את Property/Room שלו
```

### **תרחיש 3: מיגרציה של לקוח קיים**
```
1. קבל ממנו Tokens מהחשבון החדש שלו
2. עדכן ב-DB או צור מחדש
3. הלקוח ממשיך לעבוד בלי שיבחין בהבדל
```

---

## 🔧 **פתרון בעיות**

### **בעיה: לא רואה הזמנות**
```
1. בדוק בקונסול איזה טוקן משתמש
2. אם "user-specific" - בדוק שהטוקנים נכונים
3. אם "global" - בדוק Property/Room IDs
```

### **בעיה: שגיאת 401**
```
המערכת תנסה לרענן אוטומטית
אם נכשל - בדוק שהרפרש-טוקן תקף
```

### **בעיה: רואה נתונים שגויים**
```
ודא ש-Property ID ו-Room ID תואמים לחשבון הנכון
```

---

## 📚 **קבצים שהשתנו**

```
✅ supabase-migrations/007_add_beds24_tokens_to_users.sql
✅ src/lib/auth/types.ts
✅ src/lib/auth/getUsersDb.ts
✅ src/lib/auth/authOptions.ts
✅ src/lib/beds24/tokenManager.ts
✅ src/app/api/dashboard/bookings/route.ts
✅ src/app/api/dashboard/rooms/route.ts
✅ src/app/api/admin/users/create/route.ts
✅ src/app/admin/users/create/page.tsx
```

---

## 🎓 **לסיכום:**

```
המערכת עכשיו:
├─ 🌍 תומכת בטוקן גלובלי (Vercel env)
├─ 🔑 תומכת בטוקנים למשתמש (DB)
├─ 🔄 מרעננת טוקנים אוטומטית
├─ 🔒 בטוחה ומבודדת
└─ ✅ מוכנה ל-SaaS רב-משתמשי!
```

---

**🚀 עכשיו אפשר להוסיף כמה לקוחות שרוצה, כל אחד עם החשבון שלו!**
