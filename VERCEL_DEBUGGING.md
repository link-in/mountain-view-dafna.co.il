# 🔍 איך לבדוק לוגים ב-Vercel

## שיטה 1: Vercel Dashboard (הכי פשוט)

### צעדים:

1. **פתח את הפרויקט ב-Vercel:**
   ```
   https://vercel.com/dashboard
   → בחר את mountain-view-dafna
   ```

2. **לך ללוגים:**
   ```
   בתפריט העליון → Logs
   או
   https://vercel.com/YOUR-PROJECT/logs
   ```

3. **סנן לפי webhook:**
   ```
   בתיבת החיפוש:
   /api/webhook
   ```

4. **מה לחפש:**
   - ✅ `POST /api/webhook 200` - הצלחה!
   - ❌ `POST /api/webhook 500` - שגיאה!
   - ❌ אין שום דבר - Beds24 לא הגיע בכלל

---

## שיטה 2: Runtime Logs (יותר מפורט)

1. **Vercel Dashboard** → **Deployments**

2. **לחץ על הדפלוימנט האחרון** (הירוק עם ✓)

3. **לחץ על "View Function Logs"**

4. **בחר:**
   ```
   Filter by: /api/webhook
   Time Range: Last 1 hour
   ```

5. **תראה:**
   - Request body
   - Console logs
   - Errors
   - Response

---

## שיטה 3: Vercel CLI (Terminal)

```bash
# התקן Vercel CLI אם אין לך
npm i -g vercel

# התחבר
vercel login

# צפה בלוגים בזמן אמת
vercel logs --follow

# או לוגים של פונקציה ספציפית
vercel logs /api/webhook
```

---

## 🔍 מה לחפש בלוגים:

### ✅ אם זה עובד:
```
📥 Received Beds24 Webhook:
Guest Name: יוסי כהן
Phone: +972501234567
✅ Webhook saved to database
```

### ❌ אם יש שגיאה:
```
❌ Error saving to Supabase: [error message]
או
❌ Error getting owner info: [error message]
```

### ⚠️ אם Beds24 לא מגיע:
```
(אין שום לוג של /api/webhook)
```

---

## 🧪 בדיקה מהירה - האם ה-Webhook נגיש?

### בדוק ב-Browser:
```
https://mountain-view-dafna.co.il/api/webhook
```

**אמור להחזיר:**
```json
{
  "error": "Method not allowed"
}
```

או

```
405 Method Not Allowed
```

**זה טוב!** זה אומר שה-route קיים, פשוט הוא מקבל רק POST.

---

## 🔧 בדיקה עם Postman (Production):

```
POST https://mountain-view-dafna.co.il/api/webhook

Headers:
Content-Type: application/json

Body:
{
  "guestName": "בדיקה ידנית",
  "phone": "+972501234567",
  "checkInDate": "2026-02-15",
  "checkOutDate": "2026-02-20",
  "propertyId": "306559",
  "roomId": "638851",
  "bookingId": "MANUAL-TEST"
}
```

**אם זה עובד** - הבעיה היא ב-Beds24, לא ב-Vercel!

---

## ⚠️ סיבות אפשריות למה Beds24 לא מגיע:

### 1. **URL לא נכון ב-Beds24**
```
✅ נכון: https://mountain-view-dafna.co.il/api/webhook
❌ לא נכון: https://mountain-view-dafna-co-il.vercel.app/api/webhook
❌ לא נכון: http://mountain-view-dafna.co.il/api/webhook (HTTP)
```

### 2. **Beds24 Webhook לא פעיל**
- בדוק ש-"Active" מסומן ב-Beds24

### 3. **Event לא מוגדר**
- בדוק ש-"New Booking" מסומן

### 4. **SSL/HTTPS**
- Beds24 דורש HTTPS (לא HTTP)
- הדומיין שלך אמור להיות בסדר

### 5. **Beds24 Test לא עובד**
- לפעמים ה-Test ב-Beds24 לא עובד
- צור הזמנה אמיתית (או דמה) במקום

---

## 📋 Checklist לבדיקה:

- [ ] Vercel Logs - יש בקשות ל-`/api/webhook`?
- [ ] Postman ל-Production - עובד?
- [ ] Browser - `https://mountain-view-dafna.co.il/api/webhook` מחזיר 405?
- [ ] Beds24 URL - נכון? (HTTPS + נכון?)
- [ ] Beds24 Active - מסומן?
- [ ] Beds24 Event - New Booking מסומן?

---

## 🎯 הצעד הבא:

1. **בדוק Vercel Logs** (5 דקות)
2. **אם אין לוגים** → הבעיה ב-Beds24
3. **אם יש לוגים עם שגיאה** → נפתור את השגיאה
4. **בדוק Postman** → אם עובד, הבעיה בהגדרות Beds24

**תגיד לי מה אתה רואה בלוגים!** 🔍
