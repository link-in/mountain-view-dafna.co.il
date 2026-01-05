# 🔧 תיקון בעיית Content-Type: text/html לקבצי JS

## הבעיה

קבצי JavaScript מקבלים `content-type: text/html` במקום `application/javascript`.

**סיבה:** הקובץ לא קיים בשרת, אז ה-.htaccess מנתב אותו ל-`index.html`.

---

## ✅ פתרון מיידי

### שלב 1: בדוק שהקבצים קיימים בשרת

**דרך File Manager (cPanel):**
1. התחבר ל-cPanel → File Manager
2. עבור ל-`public_html/`
3. בדוק אם תיקיית `_next/static/chunks/` קיימת
4. בדוק אם יש קבצי `.js` בתיקייה

**דרך SSH:**
```bash
ls -la /path/to/public_html/_next/static/chunks/
```

**אם התיקייה לא קיימת או ריקה:**
→ זה הבעיה! צריך להעלות את הקבצים.

### שלב 2: העלה את הקבצים

**אם התיקייה לא קיימת:**

1. **העלה את כל תיקיית `_next/` מתיקיית `out/`:**
   - דרך File Manager: העלה את `out/_next/` ל-`public_html/_next/`
   - דרך FTP: העלה את `out/_next/` ל-`public_html/_next/`

2. **ודא שהמבנה נכון:**
   ```
   public_html/
   └── _next/
       └── static/
           └── chunks/
               └── [קבצי .js כאן]
   ```

### שלב 3: העלה את ה-.htaccess החדש

1. קח את הקובץ `.htaccess` מהשורש של הפרויקט
2. העלה אותו ל-`public_html/.htaccess` (החלף את הקיים)
3. ודא שהרשאות נכונות (644)

### שלב 4: בדוק

1. **פתח בדפדפן:**
   ```
   https://mountain-view-dafna.co.il/_next/static/chunks/80bd62c2443564c0.js
   ```

2. **צריך לראות:**
   - קוד JavaScript (לא HTML)
   - Content-Type: `application/javascript` (בקונסול F12 → Network)

3. **אם אתה עדיין רואה HTML:**
   - הקובץ לא קיים בשרת
   - העלה מחדש את תיקיית `_next/`

---

## 🔍 איך לבדוק מה הבעיה

### בדיקה 1: האם הקובץ קיים?

פתח בדפדפן:
```
https://mountain-view-dafna.co.il/_next/static/chunks/80bd62c2443564c0.js
```

**אם אתה רואה HTML:**
→ הקובץ לא קיים בשרת

**אם אתה רואה JavaScript:**
→ הקובץ קיים, אבל יש בעיה אחרת

### בדיקה 2: בדוק בקונסול

1. פתח את הקונסול (F12)
2. עבור ל-Network
3. רענן את הדף
4. חפש קבצי `.js`
5. לחץ על קובץ → בדוק את ה-Headers:
   - **Content-Type:** צריך להיות `application/javascript`
   - **Status:** צריך להיות `200`

### בדיקה 3: בדוק בשרת

**דרך SSH:**
```bash
# בדוק אם התיקייה קיימת
ls -la /path/to/public_html/_next/static/chunks/

# בדוק אם יש קבצים
find /path/to/public_html/_next/static/chunks/ -name "*.js" | head -5
```

---

## 📋 צ'קליסט מלא

- [ ] תיקיית `_next/static/chunks/` קיימת בשרת
- [ ] יש קבצי `.js` בתיקייה
- [ ] ה-.htaccess עודכן בשרת
- [ ] הרשאות נכונות (755 לתיקיות, 644 לקבצים)
- [ ] נקה cache בדפדפן (Ctrl+Shift+R)
- [ ] בדוק בקונסול שהשגיאה נעלמה

---

## 🚨 אם עדיין לא עובד

### אפשרות 1: העלה מחדש את כל תיקיית out

1. מחק את כל התוכן מ-`public_html/` (או גבה)
2. העלה מחדש את כל תיקיית `out/`
3. העלה את `.htaccess` החדש
4. הגדר הרשאות

### אפשרות 2: בדוק את ה-.htaccess בשרת

**דרך SSH:**
```bash
cat /path/to/public_html/.htaccess
```

ודא שהקובץ עודכן.

### אפשרות 3: בדוק את ה-logs

**דרך SSH:**
```bash
tail -f /var/log/apache2/error.log
```

או דרך cPanel → Errors

---

## 💡 טיפ חשוב

**הבעיה העיקרית היא שהקבצים לא קיימים בשרת!**

אם הקובץ לא קיים, ה-.htaccess מנתב אותו ל-`index.html`, וזה מחזיר HTML עם content-type של text/html.

**הפתרון:** העלה את כל תיקיית `_next/` מתיקיית `out/` לשרת.

---

**לאחר העלאה, הכל אמור לעבוד! 🚀**

