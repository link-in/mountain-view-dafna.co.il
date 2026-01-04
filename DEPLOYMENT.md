# הוראות העלאה לשרת PHP - mountain-view-dafna.co.il

## שלב 1: בניית הפרויקט

בטרמינל, הרץ את הפקודות הבאות:

```bash
# התקנת תלויות (אם עדיין לא עשית)
npm install

# בניית הפרויקט לייצור
npm run build
```

## שלב 2: העלאת קבצים לשרת

לאחר הבנייה, תתקבל תיקייה `out` (אם מוגדר static export) או `.next` (אם לא).

### אפשרות א': Static Export (מומלץ לשרת PHP)

1. עדכן את `next.config.ts` להוסיף static export:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true, // נדרש ל-static export
  },
};

export default nextConfig;
```

2. הרץ `npm run build` שוב
3. העלה את כל התוכן מתיקיית `out` לשרת

### אפשרות ב': Standalone Build

אם השרת תומך ב-Node.js, תוכל להריץ:
- העלה את תיקיית `.next` + `node_modules` + `package.json`
- הרץ `npm start` בשרת

## שלב 3: העלאת קבצים ספציפיים

### קבצים שצריך להעלות:

1. **כל התוכן מתיקיית `out`** (אם static export) או `.next` (אם standalone)
2. **קובץ PHP**: `public/api/ical.php` → העלה ל-`/api/ical.php` בשרת
3. **קובץ .htaccess** (אם נדרש) - ראה למטה

## שלב 4: הגדרת .htaccess

צור קובץ `.htaccess` בתיקייה הראשית של האתר:

```apache
# Enable Rewrite Engine
RewriteEngine On

# Redirect all requests to index.html (for Next.js static export)
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /index.html [L]

# Allow PHP files
<FilesMatch "\.php$">
    SetHandler application/x-httpd-php
</FilesMatch>

# Security headers
<IfModule mod_headers.c>
    Header set X-Content-Type-Options "nosniff"
    Header set X-Frame-Options "SAMEORIGIN"
</IfModule>
```

## שלב 5: בדיקת הקובץ PHP

לאחר העלאה, בדוק שהקובץ PHP עובד:
- פתח: `https://mountain-view-dafna.co.il/api/ical.php`
- צריך לראות JSON עם נתוני iCal

## שלב 6: הגדרת Environment Variables (אופציונלי)

אם צריך, צור קובץ `.env.production` בשרת:

```env
NEXT_PUBLIC_ICAL_API_URL=/api/ical.php
```

## פתרון בעיות

### בעיה: דפים לא נטענים
- ודא ש-.htaccess מועלה ופועל
- בדוק שהשרת תומך ב-mod_rewrite

### בעיה: תמונות לא נטענות
- ודא שכל התיקיות `_next/static` מועלות
- בדוק הרשאות קבצים (755 לתיקיות, 644 לקבצים)

### בעיה: PHP לא עובד
- ודא שהשרת תומך ב-PHP
- בדוק שהקובץ `ical.php` בנתיב הנכון
- בדוק הרשאות (644)

### בעיה: CORS errors
- ודא שהקובץ PHP מחזיר את ה-headers הנכונים
- בדוק את `public/api/ical.php`

## מבנה תיקיות בשרת

```
/
├── index.html
├── .htaccess
├── _next/
│   └── static/
├── api/
│   └── ical.php
└── [other static files]
```

## הערות חשובות

1. **תמונות**: ודא שכל התמונות מתיקיית `public` מועלות
2. **Fonts**: Next.js יטען את הפונטים אוטומטית
3. **Cache**: לאחר העלאה, נקה את ה-cache של הדפדפן (Ctrl+Shift+R)
4. **SSL**: ודא שיש לך תעודת SSL פעילה (HTTPS)

## בדיקה סופית

לאחר העלאה, בדוק:
- [ ] האתר נטען: https://mountain-view-dafna.co.il/
- [ ] התמונות נטענות
- [ ] הגלריה עובדת
- [ ] לוח השנה עובד (בודק את ה-PHP endpoint)
- [ ] כפתורי WhatsApp ו-Waze עובדים
- [ ] כל הדפים נגישים

