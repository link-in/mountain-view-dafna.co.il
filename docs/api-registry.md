# API Registry

רישום מסודר של הקריאות וה־endpoints שנוצרו בפרויקט.

## מקומי (Next.js)

### Dashboard Proxy Endpoints

| Purpose | Method | Endpoint | Description | Notes |
| --- | --- | --- | --- | --- |
| Bookings (dash) | GET | `/api/dashboard/bookings` | פרוקסי ל־Beds24 להזמנות. מעביר query params לשירות החיצוני. | עובד עם `token` מה־`.env.local` |
| Properties (test) | GET | `/api/dashboard/properties` | פרוקסי ל־Beds24 לנכסים. | לשימוש בדיקות |
| Pricing (placeholder) | GET | `/api/dashboard/pricing` | פרוקסי ל־Beds24 למחירים. | כרגע מחזיר 404 מהספק (אין endpoint) |
| Reservations (legacy) | GET | `/api/dashboard/reservations` | פרוקסי ל־Beds24 להזמנות. | הוחלף ב־`/bookings` |

## ספק חיצוני (Beds24)

### Beds24 v2

| Purpose | Method | Endpoint | Query params | Notes |
| --- | --- | --- | --- | --- |
| Bookings | GET | `https://api.beds24.com/v2/bookings` | `arrivalFrom`, `includeInvoice` | דורש header `token` |
| Properties | GET | `https://api.beds24.com/v2/properties` | `includeAllRooms` | דורש header `token` |

## משתני סביבה נדרשים

```
BEDS24_TOKEN=YOUR_TOKEN
NEXT_PUBLIC_DASHBOARD_PROVIDER=beds24
```

## הערות

- בגלל `output: 'export'`, ה־API routes משמשים בעיקר בסביבת dev. בפרודקשן נדרש פרוקסי שרת.
- לא לשמור טוקנים בקוד. משתמשים רק ב־`.env.local`.
