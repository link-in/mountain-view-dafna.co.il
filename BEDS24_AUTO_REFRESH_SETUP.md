# מדריך הגדרת Refresh Token אוטומטי ל-Beds24

## הבעיה שפתרנו
Access Token של Beds24 פג תוקף אחרי 24 שעות. יצרנו מנגנון שמרענן אוטומטית את הטוקן בלי צורך בהתערבות ידנית.

---

## שלב 1: קבלת Refresh Token (חד פעמי)

### יצירת Invite Code ב-Beds24:

1. היכנס ל-**Beds24**: https://www.beds24.com
2. עבור ל-**Settings** → **Account** → **API Keys**
3. לחץ על **"Create new API key"**
4. בחר את ה-**Scopes** (הרשאות):
   - ✅ `read:bookings`
   - ✅ `write:bookings`
   - ✅ `read:inventory`
   - ✅ `write:inventory`
   - ✅ `read:properties`
5. אפשר **"Allow linked properties"** אם יש לך יותר מנכס אחד
6. לחץ **"Create"** - תקבל **Invite Code**
7. **העתק את ה-Invite Code** (תוקף 24 שעות בלבד!)

### המרת Invite Code ל-Refresh Token:

הרץ את הקוד הזה **פעם אחת** (בסביבת פיתוח):

```typescript
// src/scripts/setup-beds24-tokens.ts
import { Beds24TokenManager } from '@/lib/beds24/tokenManager'

const inviteCode = 'YOUR_INVITE_CODE_HERE' // הכנס את הקוד שקיבלת

Beds24TokenManager.setupFromInviteCode(inviteCode)
  .then((tokens) => {
    console.log('✅ Setup successful!')
    console.log('\nAdd these to your .env.local:')
    console.log(`BEDS24_TOKEN=${tokens.accessToken}`)
    console.log(`BEDS24_REFRESH_TOKEN=${tokens.refreshToken}`)
    console.log(`\nExpires in: ${tokens.expiresIn} seconds (${tokens.expiresIn / 3600} hours)`)
  })
  .catch((error) => {
    console.error('❌ Setup failed:', error)
  })
```

או בשורת פקודה:

```powershell
# יצירת קובץ זמני
$inviteCode = "YOUR_INVITE_CODE_HERE"

# קריאה ל-API (דוגמה בPowerShell)
$response = Invoke-RestMethod -Uri "https://api.beds24.com/v2/authentication/setup" `
  -Headers @{ accept = "application/json"; code = $inviteCode }

Write-Host "Access Token:"  $response.token
Write-Host "Refresh Token:" $response.refreshToken
Write-Host "Expires In:" $response.expiresIn "seconds"
```

---

## שלב 2: עדכון משתני סביבה

### סביבת פיתוח (`.env.local`):

```env
# Beds24 API Configuration
BEDS24_TOKEN=your_access_token_here
BEDS24_REFRESH_TOKEN=your_refresh_token_here

# Optional
# BEDS24_API_BASE_URL=https://api.beds24.com/v2

# Your property and room IDs
BEDS24_PROPERTY_ID=306559
BEDS24_ROOM_ID=638851

# NextAuth Configuration
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000
```

### Vercel (Production):

1. Vercel Dashboard → **Settings** → **Environment Variables**
2. הוסף/עדכן:
   - `BEDS24_TOKEN` - Access token (אופציונלי, המערכת תרענן אוטומטית)
   - `BEDS24_REFRESH_TOKEN` - **חובה!** הטוקן הקבוע
   - `BEDS24_PROPERTY_ID` - מזהה הנכס
   - `BEDS24_ROOM_ID` - מזהה החדר
3. Deploy מחדש

---

## איך זה עובד?

### מנגנון Automatic Refresh:

```typescript
// src/lib/beds24/tokenManager.ts

1. הטוקן נשמר בזיכרון עם תאריך תפוגה
2. לפני כל בקשה - בודק אם הטוקן עדיין תקף (+ 5 דקות מרווח ביטחון)
3. אם הטוקן קרוב לפקיעה → רענון אוטומטי עם ה-Refresh Token
4. אם הבקשה נכשלת עם 401/502 → רענון מיידי וניסיון חוזר
5. ה-Refresh Token לא פג תוקף כל עוד משתמשים בו (עד 30 יום בחוסר שימוש)
```

### שימוש ב-API Routes:

```typescript
// לפני (ישן):
const response = await fetch(url, {
  headers: {
    token: process.env.BEDS24_TOKEN,
    accept: 'application/json',
  },
})

// אחרי (חדש):
import { fetchWithTokenRefresh } from '@/lib/beds24/tokenManager'

const response = await fetchWithTokenRefresh(url, {
  // headers אוטומטיים: token, accept
  method: 'POST', // אופציונלי
  body: JSON.stringify(data), // אופציונלי
})
```

---

## בדיקה ותחזוקה

### בדיקת הטוקן הנוכחי:

```powershell
# בדוק אם יש Refresh Token
Get-Content .env.local | Select-String "BEDS24_REFRESH_TOKEN"
```

### יומני המערכת (Logs):

המערכת מדפיסה הודעות לקונסול:

```
[Beds24] Got 502, refreshing token...
[Beds24] Access token refreshed successfully
```

### כשה-Refresh Token פג תוקף (לאחר 30 יום ללא שימוש):

1. צור **Invite Code חדש** ב-Beds24
2. הרץ שוב את תהליך ההמרה (שלב 1)
3. עדכן את `BEDS24_REFRESH_TOKEN`

---

## שאלות נפוצות

### ❓ מה ההבדל בין Access Token ל-Refresh Token?

- **Access Token** (BEDS24_TOKEN): 
  - פג תוקף אחרי 24 שעות
  - משמש לבקשות API רגילות
  - מתרענן אוטומטית
  
- **Refresh Token** (BEDS24_REFRESH_TOKEN):
  - לא פג תוקף (כל עוד משתמשים בו)
  - משמש ליצירת Access Tokens חדשים
  - **שמור אותו בסוד!**

### ❓ מה קורה אם ה-Refresh Token נגנב?

- מבטל את ה-Refresh Token הנוכחי דרך ממשק Beds24
- יוצר Invite Code חדש ומפיק Refresh Token חדש

### ❓ האם צריך להפעיל מחדש את השרת כשמעדכנים טוקן?

**כן** - משתני סביבה נטענים בעת הפעלת השרת.

```powershell
# עצור את השרת (Ctrl+C)
npm run dev
```

### ❓ מה קורה ב-Serverless (Vercel)?

- הטוקן נשמר **בזיכרון של ה-function**
- כל פונקציה serverless "קרה" מתחילה עם טוקן חדש
- ברגע שהפונקציה "חמה" (warm) - הטוקן נשמר בין קריאות
- זה אומר: **פחות קריאות refresh, ביצועים טובים יותר**

### ❓ איך אני יודע שזה עובד?

```powershell
# בדוק את היומנים (logs) ב-Vercel:
vercel logs

# או בפיתוח - בקונסול תראה:
# [Beds24] Access token refreshed successfully
```

---

## פתרון בעיות

### שגיאה: "No refresh token available"

```env
# וודא שהוספת ל-.env.local:
BEDS24_REFRESH_TOKEN=your_refresh_token_here
```

### שגיאה: "Failed to refresh token: 401"

- ה-Refresh Token לא תקין או פג תוקף
- צור Invite Code חדש והמר ל-Refresh Token

### שגיאה: "Failed to refresh token: 403"

- ה-Refresh Token לא מורשה לגשת לנכס/חדר
- בדוק את ה-Scopes בעת יצירת ה-Invite Code

---

## סיכום

✅ **הטוקן מתרענן אוטומטית** - אין צורך בהתערבות ידנית  
✅ **Retry logic** - ניסיון חוזר אוטומטי אחרי שגיאה  
✅ **Cache בזיכרון** - ביצועים טובים, פחות קריאות API  
✅ **Production ready** - עובד גם ב-Vercel Serverless  

📝 **חשוב לזכור**: שמור את ה-Refresh Token בסוד ואל תשתף אותו!
