# הוראות התקנה לשרת PHP

## העלאת קובץ PHP לשרת

הקובץ `public/api/ical.php` צריך להיות מועלה לשרת שלך בנתיב הבא:

```
/your-domain/api/ical.php
```

או אם האתר שלך נמצא בתיקייה ספציפית:

```
/your-domain/your-folder/api/ical.php
```

## הגדרת Environment Variable (אופציונלי)

אם הנתיב ל-PHP endpoint שלך שונה, תוכל להגדיר את זה בקובץ `.env.local`:

```env
NEXT_PUBLIC_ICAL_API_URL=/api/ical.php
```

או אם הנתיב המלא שונה:

```env
NEXT_PUBLIC_ICAL_API_URL=https://your-domain.com/api/ical.php
```

## בדיקת תקינות

לאחר העלאת הקובץ, תוכל לבדוק שהוא עובד על ידי פתיחת הקישור בדפדפן:

```
https://your-domain.com/api/ical.php
```

צריך לראות JSON עם הנתונים מ-Airbnb ו-Booking.com.

## הערות חשובות

1. **Next.js API Route**: הקובץ `src/app/api/ical/route.ts` לא יעבוד בשרת PHP. הוא נשאר רק לפיתוח מקומי (localhost). בשרת הייצור, הקוד ישתמש ב-PHP endpoint.

2. **CORS**: הקובץ PHP כולל הגדרות CORS שמאפשרות גישה מכל דומיין. אם אתה רוצה להגביל את זה, תוכל לערוך את השורה:
   ```php
   header('Access-Control-Allow-Origin: *');
   ```
   ל:
   ```php
   header('Access-Control-Allow-Origin: https://your-domain.com');
   ```

3. **cURL**: השרת שלך צריך לתמוך ב-cURL (רוב השרתים תומכים בזה כברירת מחדל).

## פתרון בעיות

אם אתה מקבל שגיאה 500:
- בדוק שהשרת תומך ב-PHP
- בדוק שהשרת תומך ב-cURL
- בדוק את לוגי השגיאות של השרת

אם אתה מקבל שגיאת CORS:
- ודא שה-header `Access-Control-Allow-Origin` מוגדר נכון
- בדוק שהקובץ PHP נגיש דרך HTTP/HTTPS

