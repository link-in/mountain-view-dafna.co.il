# 🔐 HOSTLY Admin System - Setup Guide

## 📋 Overview

מערכת ניהול משולבת עבור HOSTLY Platform המאפשרת לאדמין לנהל משתמשים, יחידות אירוח, והודעות WhatsApp.

---

## 🚀 Setup Instructions

### **שלב 1: הרץ את ה-SQL Migration ב-Supabase**

1. פתח את **Supabase Dashboard**
2. לך ל-**SQL Editor**
3. העתק והרץ את הקובץ:
   ```
   supabase/migrations/003_add_role_to_users.sql
   ```

זה יוסיף:
- ✅ עמודה `role` לטבלת `users`
- ✅ Index לביצועים טובים
- ✅ הגדרת משתמש ראשון כאדמין

---

### **שלב 2: הגדר משתמש אדמין**

**אופציה A: עדכון ידני ב-Supabase**

```sql
-- החלף את האימייל באימייל שלך
UPDATE users 
SET role = 'admin' 
WHERE email = 'YOUR_EMAIL@example.com';
```

**אופציה B: דרך ה-SQL Editor**

1. Supabase → SQL Editor
2. הרץ:
   ```sql
   SELECT * FROM users; -- ראה את כל המשתמשים
   UPDATE users SET role = 'admin' WHERE id = 'USER_ID_HERE';
   ```

---

### **שלב 3: התחבר כאדמין**

1. התנתק מהמערכת (אם מחובר)
2. התחבר מחדש עם המשתמש שהגדרת כאדמין
3. לך ל-`/admin` או `/admin/users`

---

## 🎯 Features

### ✅ **מה כבר עובד:**

1. **ניהול משתמשים מלא (CRUD)**
   - ✅ הוספת משתמש חדש
   - ✅ עריכת פרטי משתמש
   - ✅ מחיקת משתמש
   - ✅ שינוי סיסמה

2. **הגנה על Routes**
   - ✅ רק אדמינים נכנסים ל-`/admin`
   - ✅ Middleware אוטומטי

3. **ממשק משתמש**
   - ✅ דשבורד אדמין עם כרטיסיות
   - ✅ טבלת משתמשים
   - ✅ טפסים להוספה/עריכה

---

## 📂 Structure

```
HOSTLY Platform
├── /admin
│   ├── page.tsx                     # Admin dashboard
│   └── users
│       └── page.tsx                 # User management
├── /api/admin/users
│   ├── route.ts                     # GET all, POST new
│   └── [id]/route.ts                # PUT update, DELETE
└── middleware.ts                    # Route protection
```

---

## 🔐 Access Control

### **Roles:**

- **`admin`** - מנהל מערכת (גישה מלאה)
- **`owner`** - בעל יחידה (גישה לדשבורד רגיל)

### **Protected Routes:**

| Route | Access |
|-------|--------|
| `/dashboard` | owner, admin |
| `/admin` | admin only |
| `/api/admin/*` | admin only |

---

## 🛠️ Admin Capabilities

### **מה אדמין יכול לערוך:**

```typescript
✅ email                 // כתובת אימייל
✅ password             // סיסמה (אופציונלי בעריכה)
✅ displayName          // שם תצוגה
✅ phoneNumber          // מספר טלפון
✅ propertyId           // Beds24 Property ID
✅ roomId               // Beds24 Room ID
✅ landingPageUrl       // כתובת אתר נחיתה
✅ role                 // תפקיד (admin/owner)
```

---

## 📱 Usage Examples

### **1. הוספת משתמש חדש:**

```
1. לך ל-/admin/users
2. לחץ "+ הוסף משתמש"
3. מלא את הטופס:
   - אימייל
   - סיסמה
   - שם תצוגה
   - Property ID & Room ID
   - טלפון (אופציונלי)
   - תפקיד (owner/admin)
4. לחץ "צור משתמש"
```

### **2. עריכת משתמש:**

```
1. לחץ "ערוך" ליד המשתמש
2. עדכן את הפרטים
3. **אופציונלי:** שנה סיסמה (השאר ריק לשמור קיימת)
4. לחץ "עדכן"
```

### **3. מחיקת משתמש:**

```
1. לחץ "מחק" ליד המשתמש
2. אשר את המחיקה
⚠️  לא ניתן למחוק את עצמך!
```

---

## 🔒 Security Features

1. **Middleware Protection**
   - בודק JWT token
   - מוודא `role === 'admin'`
   - Redirect אוטומטי אם לא מורשה

2. **API Validation**
   - כל endpoint בודק role
   - מחזיר 403 אם לא admin

3. **Session Management**
   - Role stored in JWT
   - Updated on sign in

---

## 🚀 Next Steps (Optional)

### **תכונות עתידיות:**

- [ ] דף סטטיסטיקות
- [ ] לוג הודעות WhatsApp
- [ ] ניהול יחידות אירוח
- [ ] Export data to CSV
- [ ] Activity log

---

## 🐛 Troubleshooting

### **בעיה: לא מצליח להתחבר לאדמין**

**פתרון:**
```sql
-- בדוק את ה-role ב-Supabase
SELECT email, role FROM users WHERE email = 'YOUR_EMAIL';

-- עדכן ל-admin
UPDATE users SET role = 'admin' WHERE email = 'YOUR_EMAIL';
```

### **בעיה: מקבל 403 Forbidden**

**פתרון:**
1. התנתק
2. התחבר מחדש
3. ה-role לא מתעדכן אוטומטית ב-session קיים

### **בעיה: לא רואה את עמוד האדמין**

**פתרון:**
- וודא ש-middleware.ts קיים
- נסה `npm run dev` מחדש

---

## 📞 Support

**יצרת משתמש אדמין?** ✅  
**נכנסת ל-/admin?** ✅  
**יש לך שאלות?** שאל אותי! 😊

---

**🎉 מזל טוב! מערכת האדמין שלך מוכנה לשימוש!**
