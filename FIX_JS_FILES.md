# 🔧 תיקון בעיית קבצי JS בפרודקשן

## הבעיה

קבצי JavaScript מקבלים `content-type: text/html` במקום `application/javascript`, מה שגורם לדפדפן לחסום אותם.

**סיבה:** ה-`.htaccess` מנתב גם קבצים סטטיים ל-`index.html`.

---

## ✅ התיקון

עודכן קובץ `.htaccess` כך שהוא:

1. **לא מנתב קבצים קיימים** - אם הקובץ קיים, הוא לא מנותב
2. **לא מנתב תיקיות קיימות** - אם התיקייה קיימת, היא לא מנותבת
3. **לא מנתב קבצים סטטיים** - `_next/`, `photos/`, `api/`, וקבצים עם סיומות
4. **מוסיף MIME types נכונים** - JavaScript, CSS, וכו'

---

## 📤 מה לעשות עכשיו

### שלב 1: העלה את ה-.htaccess החדש

1. קח את הקובץ `.htaccess` מהשורש של הפרויקט
2. העלה אותו ל-`public_html/.htaccess` בשרת (החלף את הקיים)
3. ודא שהרשאות נכונות (644)

### שלב 2: בדוק שהקבצים הסטטיים קיימים

ודא שתיקיית `_next/static/` קיימת בשרת:
```
public_html/_next/static/chunks/...
```

אם לא קיימת, העלה מחדש את כל תיקיית `_next/` מתיקיית `out/`.

### שלב 3: נקה cache

1. נקה cache בדפדפן (Ctrl+Shift+R)
2. או פתח בחלון גלישה בסתר (Incognito)

---

## 🔍 בדיקה

### בדוק בקונסול (F12):

1. פתח את Network tab
2. רענן את הדף
3. חפש קבצי `.js`
4. בדוק את ה-Content-Type:
   - ✅ צריך להיות: `application/javascript`
   - ❌ לא צריך להיות: `text/html`

### בדוק ישירות:

פתח בדפדפן:
```
https://mountain-view-dafna.co.il/_next/static/chunks/[שם-קובץ].js
```

**צריך לראות:**
- קוד JavaScript (לא HTML)
- Content-Type: `application/javascript`

**אם אתה רואה HTML:**
- הקובץ לא קיים בשרת, או
- ה-.htaccess לא עודכן

---

## 📋 מה עודכן ב-.htaccess

```apache
# MIME Types - חשוב לקבצי JS/CSS
<IfModule mod_mime.c>
    AddType application/javascript .js
    AddType text/css .css
    ...
</IfModule>

# Don't rewrite files that exist
RewriteCond %{REQUEST_FILENAME} -f
RewriteRule ^ - [L]

# Don't rewrite static assets
RewriteCond %{REQUEST_URI} ^/(_next|photos|api|...)
RewriteRule ^ - [L]

# Don't rewrite files with extensions
RewriteCond %{REQUEST_URI} \.(js|css|json|...)$
RewriteRule ^ - [L]
```

---

## ⚠️ אם עדיין לא עובד

### אפשרות 1: בדוק שהקבצים קיימים

```bash
# דרך SSH
ls -la /path/to/public_html/_next/static/chunks/
```

אם התיקייה ריקה או לא קיימת, העלה מחדש את כל תיקיית `_next/`.

### אפשרות 2: בדוק את ה-.htaccess

```bash
# דרך SSH
cat /path/to/public_html/.htaccess
```

ודא שהקובץ עודכן.

### אפשרות 3: בדוק הרשאות

```bash
# דרך SSH
chmod 644 /path/to/public_html/.htaccess
find /path/to/public_html/_next -type f -exec chmod 644 {} \;
find /path/to/public_html/_next -type d -exec chmod 755 {} \;
```

---

## ✅ סיכום

1. ✅ העלה את `.htaccess` החדש
2. ✅ ודא שתיקיית `_next/static/` קיימת
3. ✅ נקה cache
4. ✅ בדוק בקונסול

**אחרי זה הכל אמור לעבוד! 🚀**


