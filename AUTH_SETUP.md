# מערכת התחברות - הוראות שימוש

## הגדרת משתני סביבה

הוסף ל-`.env.local`:

```bash
# NextAuth
NEXTAUTH_SECRET=your-secret-key-here-generate-with-openssl
NEXTAUTH_URL=http://localhost:3000
```

ליצירת `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

## משתמשים לדוגמה

הקובץ `src/data/users.json` כבר מוגדר עם 3 משתמשים:

- **Email**: `owner1@example.com` | **Password**: `demo123` | **Property**: נוף הרים בדפנה
- **Email**: `owner2@example.com` | **Password**: `demo123` | **Property**: יחידה 2  
- **Email**: `owner3@example.com` | **Password**: `demo123` | **Property**: יחידה 3

## הוספת משתמש חדש

1. הרץ:
```bash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('YOUR_PASSWORD', 10, (err, hash) => console.log(hash))"
```

2. הוסף ל-`src/data/users.json`:
```json
{
  "id": "user_4",
  "email": "newowner@example.com",
  "passwordHash": "PASTE_HASH_HERE",
  "displayName": "שם היחידה",
  "propertyId": "BEDS24_PROPERTY_ID",
  "roomId": "BEDS24_ROOM_ID"
}
```

## כניסה לדשבורד

1. גלוש ל-`http://localhost:3000/dashboard`
2. תופנה אוטומטית ל-`/dashboard/login`
3. הזן email + password
4. הדשבורד יציג רק את הנתונים של ה-property המקושר למשתמש

## מעבר ל-Supabase בעתיד

1. החלף `src/lib/auth/getUsersDb.ts` לשאילתת Supabase
2. הוסף NextAuth Supabase Adapter
3. הקוד ב-dashboard/API routes לא ישתנה

## אבטחה

- `users.json` לא עולה לגיט (ב-`.gitignore`)
- סיסמאות מוצפנות ב-bcrypt
- JWT עם secret key
- HTTPS חובה בפרודקשן
