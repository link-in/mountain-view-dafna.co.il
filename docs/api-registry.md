# API Registry

רישום מסודר של הקריאות וה־endpoints שנוצרו בפרויקט.

## מקומי (Next.js)

### Dashboard Proxy Endpoints

| Purpose | Method | Endpoint | Description | Notes |
| --- | --- | --- | --- | --- |
| Bookings (dash) | GET | `/api/dashboard/bookings` | פרוקסי ל־Beds24 להזמנות. מעביר query params לשירות החיצוני. | עובד עם `token` מה־`.env.local` |
| Properties (test) | GET | `/api/dashboard/properties` | פרוקסי ל־Beds24 לנכסים. | לשימוש בדיקות |
| Rooms inventory | GET | `/api/dashboard/rooms` | פרוקסי ל־Beds24 ללוח מחירים של חדרים. | דורש `propertyId`, `startDate`, `endDate`, `includePrices=true`. אופציונלי `roomId`, `includeAvailability` ו‑`includeNumAvail/includeMinStay/includeMaxStay/includeMultiplier/includeOverride/includeChannels`. מחזיר `prices[]` מפושט |
| Rooms inventory | POST | `/api/dashboard/rooms` | עדכון מחירים ל־Beds24. | גוף הבקשה תואם ל־`/inventory/rooms/calendar` |
| Pricing (placeholder) | GET | `/api/dashboard/pricing` | פרוקסי ל־Beds24 למחירים. | כרגע מחזיר 404 מהספק (אין endpoint) |
| Reservations (legacy) | GET | `/api/dashboard/reservations` | פרוקסי ל־Beds24 להזמנות. | הוחלף ב־`/bookings` |

## ספק חיצוני (Beds24)

### Beds24 v2

| Purpose | Method | Endpoint | Query params | Notes |
| --- | --- | --- | --- | --- |
| Bookings | GET | `https://api.beds24.com/v2/bookings` | `arrivalFrom`, `includeInvoice` | דורש header `token` |
| Properties | GET | `https://api.beds24.com/v2/properties` | `includeAllRooms` | דורש header `token` |
| Rooms inventory | GET | `https://api.beds24.com/v2/inventory/rooms/calendar` | `propertyId`, `startDate`, `endDate`, `includePrices` | דורש header `token` |
| Rooms inventory | POST | `https://api.beds24.com/v2/inventory/rooms/calendar` | — | גוף בקשה: מערך חדרים עם `roomId` ו־`calendar` |

## משתני סביבה נדרשים

```
BEDS24_TOKEN=YOUR_TOKEN
BEDS24_PROPERTY_ID=YOUR_PROPERTY_ID
BEDS24_INVENTORY_START_DATE=2026-01-01
BEDS24_INVENTORY_END_DATE=2026-01-31
BEDS24_ROOM_ID=YOUR_ROOM_ID
BEDS24_INCLUDE_AVAILABILITY=true
NEXT_PUBLIC_DASHBOARD_PROVIDER=beds24
```

## הערות

- בגלל `output: 'export'`, ה־API routes משמשים בעיקר בסביבת dev. בפרודקשן נדרש פרוקסי שרת.
- לא לשמור טוקנים בקוד. משתמשים רק ב־`.env.local`.
