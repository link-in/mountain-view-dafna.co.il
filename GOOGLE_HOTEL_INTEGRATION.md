# אינטגרציה עם Google Hotels & Maps - צ'קליסט מלא

## ✅ סטטוס: מוכן ל-Google

---

## 📋 רשימת בדיקות

### ✅ 1. Hotel Feed XML
**מיקום:** `/api/hotel-feed`  
**סטטוס:** ✅ מוכן

- [x] XML feed עם מחירים יומיים
- [x] כולל זמינות real-time
- [x] מחירים עם 16% markup (התאמה לאתר הישיר)
- [x] קואורדינטות GPS נכונות
- [x] תמונות
- [x] שעות check-in/check-out
- [x] מידע ליצירת קשר

**URL לבדיקה:**
```
https://mountain-view-dafna.co.il/api/hotel-feed
```

---

### ✅ 2. Schema.org Structured Data
**מיקום:** `src/app/home/light/components/HotelStructuredData.tsx`  
**סטטוס:** ✅ מוכן

Schema type: `LodgingBusiness`

**מה כלול:**
- [x] שם העסק
- [x] תיאור
- [x] כתובת מלאה
- [x] קואורדינטות GPS
- [x] טלפון ואימייל
- [x] טווח מחירים דינמי
- [x] דירוג ממוצע (מ-reviews)
- [x] תמונות
- [x] שעות check-in/check-out
- [x] amenities (ג'קוזי, WiFi, חניה וכו')
- [x] מחיר מינימום עדכני

**בדיקת נכונות:**
1. פתח: https://search.google.com/test/rich-results
2. הכנס את ה-URL: `https://mountain-view-dafna.co.il`
3. וודא שזיהוי `LodgingBusiness` מופיע

---

### ✅ 3. Sitemap
**מיקום:** `/sitemap.xml`  
**סטטוס:** ✅ מוכן

- [x] הדף הראשי (priority: 1.0)
- [x] ה-hotel-feed (priority: 0.9, עדכון שעתי)

**URL לבדיקה:**
```
https://mountain-view-dafna.co.il/sitemap.xml
```

---

### ✅ 4. Robots.txt
**מיקום:** `/robots.txt`  
**סטטוס:** ✅ מוכן

- [x] מאפשר זחילה של גוגל
- [x] חוסם admin/dashboard
- [x] מאפשר במפורש `/api/hotel-feed`
- [x] מפנה ל-sitemap

**URL לבדיקה:**
```
https://mountain-view-dafna.co.il/robots.txt
```

---

### ✅ 5. Open Graph Metadata
**מיקום:** `src/app/layout.tsx` ו-`src/app/home/light/layout.tsx`  
**סטטוס:** ✅ מוכן

- [x] og:title
- [x] og:description
- [x] og:image (לוגו)
- [x] og:url
- [x] og:type: website
- [x] og:locale: he_IL

---

### ✅ 6. תמחור עקבי
**סטטוס:** ✅ תוקן

כל המקורות מציגים מחיר **אחיד** עם 16% markup:
- [x] Hotel Feed XML → ₪X × 1.16
- [x] Structured Data → ₪X × 1.16 (דרך availability API)
- [x] לוח שנה באתר → ₪X × 1.16
- [x] חישוב מחיר → ₪X × 1.16

---

## 🔧 צעדים נוספים להפעלה

### 1. הרשמה ל-Google Hotel Center
1. כנס ל: https://www.google.com/travel/hotels/admin
2. הרשם עם חשבון העסק
3. הוסף את הנכס "נוף הרים בדפנה"
4. הזן את ה-feed URL: `https://mountain-view-dafna.co.il/api/hotel-feed`

### 2. Google Search Console
1. כנס ל: https://search.google.com/search-console
2. הוסף את האתר אם עדיין לא
3. שלח את ה-sitemap: `https://mountain-view-dafna.co.il/sitemap.xml`
4. בדוק שאין שגיאות crawling

### 3. Google My Business
1. וודא שיש רישום ב-Google My Business
2. עדכן את הקטגוריה: "Vacation Home Rental" או "Hotel"
3. הוסף את ה-URL של האתר
4. חבר את ה-listing ל-Hotel Center

### 4. בדיקת תקינות
אחרי העלאה, בדוק:

**Google Rich Results Test:**
```
https://search.google.com/test/rich-results
```
הכנס: `https://mountain-view-dafna.co.il`

**Schema Markup Validator:**
```
https://validator.schema.org/
```
הכנס: `https://mountain-view-dafna.co.il`

**XML Feed Validator:**
פתח ב-דפדפן:
```
https://mountain-view-dafna.co.il/api/hotel-feed
```
וודא שה-XML תקין ללא שגיאות.

---

## 📊 מה גוגל יציג

לאחר אינטגרציה מוצלחת, גוגל יציג:

### Google Maps:
- ✅ מיקום על המפה
- ✅ תמונות
- ✅ דירוג כוכבים
- ✅ **מחירים לפי לילה**
- ✅ זמינות
- ✅ כפתור "הזמן עכשיו" → מוביל לאתר

### Google Search / Google Travel:
- ✅ הצגה בתוצאות "hotels near me"
- ✅ מחירים בתוצאות החיפוש
- ✅ השוואת מחירים
- ✅ קישור ישיר לאתר שלך
- ✅ ביקורות מ-Google + מהאתר

---

## 🔍 מעקב ובדיקות שוטפות

### בדיקה שבועית:
```bash
# בדוק ש-feed פעיל
curl https://mountain-view-dafna.co.il/api/hotel-feed

# בדוק structured data
curl https://mountain-view-dafna.co.il | grep "application/ld+json"
```

### במערכת הניהול של גוגל:
- בדוק שגיאות ב-Hotel Center
- עקוב אחר clicks מגוגל ב-Search Console
- וודא שהמחירים עדכניים

---

## 📞 תמיכה

אם יש בעיות:
1. בדוק לוגים בקונסול (F12)
2. בדוק ש-Beds24 API פועל
3. וודא שה-tokens תקפים
4. פנה לתמיכה של Google Hotel Center

---

## 🎯 סיכום

| רכיב | סטטוס | הערות |
|------|--------|-------|
| Hotel Feed XML | ✅ מוכן | כולל 16% markup |
| Schema.org | ✅ מוכן | LodgingBusiness עם כל השדות |
| Sitemap | ✅ מוכן | כולל feed |
| Robots.txt | ✅ מוכן | מאפשר feed, חוסם admin |
| Open Graph | ✅ מוכן | לשיתוף ברשתות |
| תמחור עקבי | ✅ מוכן | 16% markup בכל מקום |

**הכל מוכן!** 🚀  
רק נותר להרשם ב-Google Hotel Center ולהגיש את ה-feed.

---

**עודכן לאחרונה:** 23/02/2026  
**גרסה:** 1.0
