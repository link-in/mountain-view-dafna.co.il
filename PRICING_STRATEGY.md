# אסטרטגיית תמחור - Pricing Strategy

## סקירה כללית

המערכת משתמשת במחירי בסיס מ-Beds24 ומוסיפה markup של **16%** עבור הזמנות ישירות דרך האתר.

## הסבר ההיגיון

- **Airbnb** גובה עמלות של ~15-17% מהאורחים
- **מחיר ישיר באתר** = מחיר Beds24 × 1.16
- כך המחיר הישיר דומה למחיר ב-Airbnb, אבל עדיין תחרותי ורווחי יותר לבעל הנכס

## היישום בקוד

### 1. `/api/public/availability` - מחירים יומיים בלוח השנה

```typescript
const DIRECT_BOOKING_MULTIPLIER = 1.16

// בעת החזרת מחירים יומיים:
price: Math.round(Number(basePrice) * DIRECT_BOOKING_MULTIPLIER)
```

### 2. `/api/public/calculate-price` - חישוב מחיר כולל

```typescript
const DIRECT_BOOKING_MULTIPLIER = 1.16

// בעת בניית priceMap:
const directPrice = Math.round(basePrice * DIRECT_BOOKING_MULTIPLIER)
```

## איפה ה-Markup מוחל

✅ **מוחל:**
- לוח שנה באתר הישיר (`BookingCalendar.tsx`)
- חישוב מחיר סופי להזמנות ישירות
- כל תצוגת מחירים לאורחים באתר

❌ **לא מוחל:**
- דשבורד ניהול (`/dashboard`) - מציג מחירי בסיס אמיתיים
- `hotel-feed` - XML feed למנועי חיפוש (צריך להחליט אם להוסיף)
- Beds24 עצמו - נשאר עם מחירי בסיס

## שינוי ה-Markup

לשינוי אחוז ה-markup, ערוך את הקבועים:
- `src/app/api/public/availability/route.ts` - שורה 11
- `src/app/api/public/calculate-price/route.ts` - שורה 11

לדוגמה, עבור 20% markup:
```typescript
const DIRECT_BOOKING_MULTIPLIER = 1.20
```

## דוגמאות חישוב

| מחיר בסיס Beds24 | Markup 16% | מחיר סופי באתר |
|-------------------|-----------|----------------|
| ₪500             | +₪80      | ₪580          |
| ₪800             | +₪128     | ₪928          |
| ₪1,200           | +₪192     | ₪1,392        |

## הערות חשובות

1. המחירים מעוגלים למספר שלם (Math.round)
2. התוספות עבור אורחים נוספים (extraGuests) מחושבות **לאחר** ה-markup
3. שינוי ב-markup ידרוש רענון cache בדפדפן של האורחים

---

**עודכן לאחרונה:** 23/02/2026
**גרסה:** 1.0
