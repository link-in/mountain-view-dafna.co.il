# 🚀 הוראות העלאה לפרודקשן

## ✅ הכל מוכן!

תיקיית `out` נבדקה מקומית ואין שגיאות JavaScript. מוכן להעלאה!

---

## 📦 מה להעלות לשרת

### תיקייה עיקרית:

**`out/`** - כל התוכן מתיקייה זו!

זה כולל:
- ✅ `index.html` - דף ראשי
- ✅ `_next/static/` - כל הקבצים הסטטיים (JS, CSS, תמונות)
- ✅ כל הדפים (about, blog, contact, home, portfolio, service, shop)
- ✅ תמונות (`photos/`)

### קבצים נוספים (מחוץ ל-out):

1. **`.htaccess`** - מהשורש של הפרויקט
   - העלה ל-`public_html/.htaccess` (שורש האתר)

2. **`public/api/ical.php`** - קובץ PHP
   - העלה ל-`public_html/api/ical.php`

---

## 📤 איך להעלות

### אופציה 1: דרך ZIP (הכי קל!)

1. **קובץ ZIP מוכן:** `production-upload.zip`
   - מכיל את כל תיקיית `out`

2. **העלה דרך cPanel File Manager:**
   - התחבר ל-cPanel
   - פתח File Manager
   - עבור ל-`public_html`
   - העלה את `production-upload.zip`
   - לחץ ימני → Extract
   - מחק את הקובץ ZIP אחרי החילוץ

3. **העלה קבצים נוספים:**
   - העלה את `.htaccess` לשורש (`public_html/.htaccess`)
   - צור תיקייה `api` והעלה את `ical.php` לתוכה

### אופציה 2: דרך FTP (FileZilla)

1. **התחבר לשרת:**
   - Host: `ftp.your-domain.com`
   - Username: שם המשתמש ב-cPanel
   - Password: הסיסמה

2. **עבור ל-`public_html/`**

3. **העלה את כל התוכן מתיקיית `out/`:**
   - בחר את כל הקבצים והתיקיות מתוך `out/`
   - העלה אותם ל-`public_html/`
   - **חשוב:** העלה את התוכן של `out/`, לא את התיקייה `out` עצמה!

4. **העלה קבצים נוספים:**
   - העלה את `.htaccess` לשורש
   - העלה את `ical.php` ל-`api/ical.php`

---

## 📁 מבנה סופי בשרת

לאחר העלאה, המבנה צריך להיות:

```
public_html/
├── .htaccess              ← מהשורש של הפרויקט
├── index.html             ← מתיקיית out
├── _next/
│   └── static/
│       ├── chunks/
│       ├── media/
│       └── [כל הקבצים]
├── about/
│   └── [קבצים]
├── blog/
├── contact/
├── home/
├── portfolio/
├── service/
├── shop/
├── photos/
│   ├── logo.png
│   └── [תמונות]
└── api/
    └── ical.php           ← קובץ PHP
```

---

## ⚙️ הגדרת הרשאות

לאחר העלאה, הגדר הרשאות:

### דרך File Manager:
1. בחר את כל הקבצים והתיקיות
2. לחץ ימני → "Change Permissions"
3. הגדר:
   - **תיקיות:** `755`
   - **קבצים:** `644`

### דרך FTP/SSH:
```bash
find public_html -type d -exec chmod 755 {} \;
find public_html -type f -exec chmod 644 {} \;
```

---

## ✅ בדיקה לאחר העלאה

1. **דף ראשי:**
   ```
   https://mountain-view-dafna.co.il/
   ```

2. **דפים נוספים:**
   ```
   https://mountain-view-dafna.co.il/about
   https://mountain-view-dafna.co.il/contact
   https://mountain-view-dafna.co.il/home/light
   ```

3. **PHP endpoint:**
   ```
   https://mountain-view-dafna.co.il/api/ical.php
   ```
   צריך לראות JSON

4. **בדיקות נוספות:**
   - [ ] תמונות נטענות
   - [ ] CSS נטען
   - [ ] JavaScript עובד (פתח קונסול F12)
   - [ ] גלריה עובדת
   - [ ] לוח שנה עובד (אם יש)

---

## 🔧 פתרון בעיות

### דפים לא נטענים (404):
- ודא ש-`.htaccess` קיים בשורש
- בדוק הרשאות (755/644)
- נקה cache בדפדפן (Ctrl+Shift+R)

### קבצי JS/CSS לא נטענים:
- ודא שתיקיית `_next/static/` קיימת
- בדוק הרשאות
- בדוק בקונסול (F12) מה השגיאה

### PHP לא עובד:
- ודא שהקובץ `ical.php` קיים ב-`api/`
- בדוק הרשאות (644)
- בדוק את ה-logs בשרת

---

## 💡 טיפים

✅ **לפני העלאה:** תמיד בדוק מקומית עם `.\test-production.ps1`

✅ **גיבוי:** לפני העלאה, גבה את האתר הקיים (אם יש)

✅ **בדיקה:** תמיד בדוק את האתר אחרי העלאה

✅ **Cache:** נקה cache בדפדפן אחרי העלאה (Ctrl+Shift+R)

---

**מוכן להעלאה! 🚀**

