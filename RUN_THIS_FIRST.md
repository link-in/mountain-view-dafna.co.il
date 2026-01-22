# 🚀 הרץ את זה קודם!

## מערכת תשלומים ומנויים

### 📝 שלב 1: הרץ SQL ב-Supabase

1. **פתח Supabase Dashboard**
2. **לך ל-SQL Editor** (בצד שמאל)
3. **לחץ על "New Query"**
4. **העתק והדבק** את כל התוכן מהקובץ:

```
supabase/migrations/004_create_billing_simple.sql
```

5. **לחץ RUN** (או Ctrl+Enter)
6. **חכה עד שתראה**: `Billing system created successfully!`

---

### ✅ איך אני יודע שזה עבד?

הרץ SQL הזה לבדיקה:

```sql
SELECT * FROM subscription_plans;
```

**אתה אמור לראות 4 שורות:**
- free
- basic
- pro
- enterprise

---

### 🎯 שלב 2: בדוק שזה עובד

1. **רענן את הדפדפן** (F5)
2. **לך ל-**: `http://localhost:3000/admin/subscriptions`
3. **אתה אמור לראות**:
   - 📊 סטטיסטיקות
   - 🔔 מנוי ניסיון אחד (שלך!)
   - טבלה עם המשתמש שלך

---

### ❌ אם זה לא עובד:

1. **בדוק שה-SQL רץ בלי שגיאות**
2. **רענן את הדף** (Ctrl+Shift+R)
3. **פתח Console** (F12) וראה מה השגיאה
4. **הודע לי מה השגיאה!**

---

### 📞 עזרה מהירה

**שגיאה: "table already exists"**
- זה בסדר! פשוט המשך

**שגיאה: "Failed to fetch subscriptions"**
- וודא שה-SQL רץ בהצלחה
- רענן את הדפדפן

**לא רואה את עצמך בטבלה?**
- הרץ:
```sql
SELECT * FROM subscriptions;
```
- אם אין שורות, הרץ:
```sql
INSERT INTO subscriptions (user_id, plan_id, status, trial_ends_at, expires_at)
VALUES ('YOUR_USER_ID', 'free', 'trial', NOW() + INTERVAL '30 days', NOW() + INTERVAL '30 days');
```

---

**🎉 אחרי שזה עובד - תגיד לי!**
