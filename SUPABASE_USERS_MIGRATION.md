# 🚀 Supabase Users Migration Guide

## מה השתנה?

עברנו מניהול משתמשים ב-`users.json` (קובץ) ל-**Supabase** (מסד נתונים).

**למה?** כי Vercel לא מאפשר לכתוב לקבצים בפרודקשן, אז עריכת פרופיל לא עבדה.

---

## 📋 שלבי ההתקנה

### שלב 1: צור טבלת Users ב-Supabase

1. **פתח את Supabase Dashboard:**
   ```
   https://supabase.com/dashboard/project/uyqysnlqsxdyhujgzrvz
   ```

2. **לך ל-SQL Editor:**
   - לחץ על **SQL Editor** בצד שמאל
   - לחץ על **+ New query**

3. **העתק והדבק את ה-SQL הבא:**

   פתח את הקובץ:
   ```
   supabase/migrations/002_create_users_table.sql
   ```

   והעתק את כל התוכן (כולל ה-INSERT של המשתמשים הקיימים).

4. **לחץ על RUN** (או `Ctrl+Enter`)

5. **בדוק שהטבלה נוצרה:**
   - לך ל-**Table Editor** בצד שמאל
   - אמורה להופיע טבלה בשם **`users`**
   - בדוק שיש 3 משתמשים בטבלה ✅

---

### שלב 2: בדוק בסביבה לוקלית

1. **הפעל מחדש את השרת:**
   ```powershell
   npm run dev
   ```

2. **נסה להתחבר:**
   ```
   http://localhost:3000/dashboard/login
   ```

   - Email: `owner1@example.com`
   - Password: `owner1` (הסיסמה הדיפולטיבית)

3. **נסה לערוך פרופיל:**
   - לך ל-**איזור אישי**
   - לחץ **ערוך**
   - שנה משהו (למשל שם תצוגה)
   - לחץ **שמור**
   - אמור לעבוד! ✅

4. **בדוק שה-Webhook עובד:**

   שלח POST מ-Postman ל:
   ```
   http://localhost:3000/api/webhook
   ```

   Payload:
   ```json
   {
     "guestName": "בדיקה",
     "phone": "+972501234567",
     "checkInDate": "2026-02-15",
     "checkOutDate": "2026-02-20",
     "bookingId": "TEST",
     "email": "test@example.com",
     "propertyId": "306559",
     "roomId": "638851"
   }
   ```

   אמור להחזיר הצלחה ✅

---

### שלב 3: דחוף לפרודקשן

1. **Commit ו-Push:**
   ```powershell
   git add -A
   git commit -m "Migrate user management to Supabase"
   git push
   ```

2. **חכה ש-Vercel יעלה את הגרסה החדשה** (1-2 דקות)

3. **בדוק בפרודקשן:**
   ```
   https://mountain-view-dafna.co.il/dashboard/login
   ```

   - התחבר
   - לך לאיזור אישי
   - נסה לערוך פרופיל
   - **עכשיו זה אמור לעבוד!** 🎉

---

## 🔧 מה שונה בקוד?

### קבצים שהשתנו:

1. **`src/lib/supabase/server.ts`** ✨ חדש
   - Supabase client לצד שרת

2. **`src/lib/auth/getUsersDb.ts`**
   - `getUserByEmail()` - עכשיו קורא מ-Supabase
   - `updateUser()` - פונקציה חדשה לעדכון משתמש
   - `emailExists()` - בדיקה אם email קיים

3. **`src/app/api/auth/update-profile/route.ts`**
   - משתמש ב-`updateUser()` במקום `fs.writeFileSync()`

4. **`src/app/api/webhook/route.ts`**
   - `getOwnerInfo()` - עכשיו async וקורא מ-Supabase

5. **`supabase/migrations/002_create_users_table.sql`** ✨ חדש
   - SQL ליצירת טבלת users

---

## 📊 מבנה הטבלה

```sql
users (
  id                TEXT PRIMARY KEY,
  email             TEXT UNIQUE NOT NULL,
  password_hash     TEXT NOT NULL,
  display_name      TEXT NOT NULL,
  property_id       TEXT NOT NULL,
  room_id           TEXT NOT NULL,
  landing_page_url  TEXT,
  phone_number      TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
)
```

---

## ✅ מה עובד עכשיו?

- ✅ התחברות (Login)
- ✅ עריכת פרופיל (גם בפרודקשן!)
- ✅ עדכון מספר טלפון
- ✅ שינוי סיסמה
- ✅ Webhook מוצא את הבעלים לפי propertyId/roomId
- ✅ הודעות WhatsApp (כשתחדש את UltraMsg)

---

## ❓ שאלות נפוצות

### האם users.json עדיין בשימוש?

לא. הקוד עכשיו קורא רק מ-Supabase.
אפשר להשאיר את `users.json` כגיבוי, אבל הוא לא משמש יותר.

### מה קורה אם יש בעיה?

הקוד כולל fallback ל-`OWNER_PHONE_NUMBER` ב-environment variable אם לא מוצא משתמש ב-Supabase.

### איך מוסיפים משתמש חדש?

כרגע צריך להוסיף ידנית ב-Supabase SQL Editor:

```sql
INSERT INTO users (id, email, password_hash, display_name, property_id, room_id, phone_number)
VALUES (
  'user_4',
  'newowner@example.com',
  '$2b$10$VTjQH1KkpifyV7wDrQUn4e22c006qBsvEIzJ1QsqALVVdY95LlLAe', -- password: owner1
  'שם היחידה',
  'PROPERTY_ID',
  'ROOM_ID',
  '+972501234567'
);
```

בעתיד נוכל להוסיף ממשק להרשמה.

---

## 🎯 הבא בתור

1. ✅ הרץ את ה-migration ב-Supabase
2. ✅ בדוק בלוקלית
3. ✅ דחוף לפרודקשן
4. ✅ בדוק שעריכת פרופיל עובדת בפרודקשן
5. 🔄 חדש את UltraMsg כדי ששליחת ההודעות תעבוד

---

**מוכן להמשיך? שאל אם משהו לא ברור!** 🚀
