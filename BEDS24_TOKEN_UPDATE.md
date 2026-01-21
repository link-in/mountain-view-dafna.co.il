# עדכון טוקן Beds24

## הבעיה
אם אתה מקבל שגיאה `Beds24 request failed: 502`, זה אומר שהטוקן של Beds24 פג תוקף או לא תקין.

## פתרון - עדכון הטוקן

### 1️⃣ קבלת טוקן חדש מ-Beds24

1. היכנס ל-**Beds24**: https://www.beds24.com
2. עבור ל-**Settings** → **Account** → **API Keys**
3. צור **API Key חדש** (או העתק קיים)
4. העתק את הטוקן (שורה ארוכה של אותיות ומספרים)

### 2️⃣ עדכון הטוקן - סביבת פיתוח (Local)

ערוך את הקובץ `.env.local` בשורש הפרויקט:

```env
# Beds24 API Configuration
BEDS24_TOKEN=YOUR_NEW_TOKEN_HERE

# Optional - if different from default
# BEDS24_API_BASE_URL=https://api.beds24.com/v2

# Your property and room IDs
BEDS24_PROPERTY_ID=your_property_id
BEDS24_ROOM_ID=your_room_id

# NextAuth Configuration
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

**⚠️ חשוב:** 
- החלף `YOUR_NEW_TOKEN_HERE` בטוקן האמיתי
- אל תוסיף רווחים או מרכאות סביב הטוקן
- שמור את הקובץ והפעל מחדש את שרת הפיתוח

### 3️⃣ עדכון הטוקן - Vercel (Production)

1. היכנס ל-**Vercel Dashboard**
2. בחר את הפרויקט `mountain-view`
3. עבור ל-**Settings** → **Environment Variables**
4. מצא את המשתנה `BEDS24_TOKEN` או צור חדש
5. עדכן את הערך בטוקן החדש
6. **Deploy מחדש** או המתן לפריסה אוטומטית

### 4️⃣ בדיקה

לאחר עדכון הטוקן:

#### סביבת פיתוח:
```powershell
# הפעל מחדש את שרת הפיתוח
npm run dev
```

#### Vercel:
- המתן לפריסה להסתיים
- בדוק את הדשבורד: https://mountain-view-dafna.co.il/dashboard

---

## משתני סביבה נדרשים

### חובה:
- `BEDS24_TOKEN` - טוקן API של Beds24
- `BEDS24_PROPERTY_ID` - מזהה הנכס שלך
- `BEDS24_ROOM_ID` - מזהה החדר/יחידה
- `NEXTAUTH_SECRET` - סוד להצפנה (ייצר באמצעות: `openssl rand -base64 32`)
- `NEXTAUTH_URL` - כתובת האתר

### אופציונלי:
- `BEDS24_API_BASE_URL` - ברירת מחדל: `https://api.beds24.com/v2`
- `BEDS24_BOOKINGS_QUERY` - פרמטרים נוספים לשאילתת הזמנות

---

## פתרון בעיות נוספות

### שגיאה: "Missing BEDS24_TOKEN"
- וודא שהטוקן מוגדר ב-`.env.local` (פיתוח) או Vercel (ייצור)
- וודא שאין רווחים או תווים מיוחדים

### שגיאה: "Beds24 request failed: 401"
- הטוקן לא תקין או פג תוקף
- צור טוקן חדש ב-Beds24

### שגיאה: "Beds24 request failed: 403"
- הטוקן לא מורשה לגשת לנכס/חדר המבוקש
- בדוק את `BEDS24_PROPERTY_ID` ו-`BEDS24_ROOM_ID`

### שגיאה: "Beds24 request failed: 502"
- שרת Beds24 לא זמין זמנית
- או הטוקן פג תוקף (הנפוץ ביותר)

---

## בדיקת הטוקן הנוכחי

בסביבת פיתוח, תוכל לבדוק אם הטוקן מוגדר:

```powershell
# בדוק אם הקובץ .env.local קיים
Get-Content .env.local | Select-String "BEDS24_TOKEN"
```

אם אין פלט, הטוקן לא מוגדר.
