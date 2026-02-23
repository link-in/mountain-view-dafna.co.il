# מערכת דפי נחיתה - מדריך הקמה והפעלה

---

## סקירה כללית

מערכת CMS פשוטה המאפשרת ללקוחות ליצור ולערוך דפי נחיתה עם subdomain ייחודי (או custom domain).

**תכונות עיקריות:**
- Subdomain ייחודי לכל לקוח (dalit.hostly.co.il)
- העלאת תמונות ל-Supabase Storage
- עריכת תוכן דינמי (גלריה, תכונות, גלריית תמונות)
- הפרדה מלאה בין לקוחות (RLS)
- שימור העיצוב הקיים

---

## התקנה ראשונית

### שלב 1: הרץ Migration ב-Supabase

```bash
# התחבר ל-Supabase Dashboard → SQL Editor
# העתק והרץ את התוכן מהקובץ:
supabase-migrations/008_create_landing_pages_system.sql
```

**מה זה יוצר:**
- `landing_pages` - מטא דאטה (subdomain, כותרות)
- `landing_sections` - תוכן דינמי JSON (hero, features, portfolio...)
- `landing_images` - מעקב אחר תמונות שהועלו
- RLS Policies - הפרדה מלאה בין משתמשים

---

### שלב 2: צור Storage Bucket ב-Supabase

**ב-Supabase Dashboard:**

1. לך ל: **Storage** → **Create bucket**
2. מלא:
   - **Name**: `landing-images`
   - **Public**: ✅ Yes (סמן!)
   - **Allowed MIME types**: השאר ריק (או הוסף: `image/jpeg, image/png, image/webp`)
   - **File size limit**: 5MB

3. **צור Policies** (Storage → landing-images → Policies):

```sql
-- Policy 1: Users can upload own images
CREATE POLICY "Users can upload own images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'landing-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy 2: Public can view images
CREATE POLICY "Public can view images"
ON storage.objects FOR SELECT
USING (bucket_id = 'landing-images');

-- Policy 3: Users can delete own images
CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'landing-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

---

### שלב 3: הגדר Wildcard Domain ב-Vercel

**ב-Vercel Dashboard:**

1. לך ל: **Settings** → **Domains**
2. לחץ: **Add**
3. הוסף: `*.hostly.co.il`
4. Vercel יתן לך CNAME value

**ב-ספק הדומיין שלך (למשל: GoDaddy, Namecheap):**

1. לך ל: **DNS Management**
2. צור רשומה חדשה:
   ```
   Type: CNAME
   Name: *
   Value: cname.vercel-dns.com
   TTL: Auto (או 3600)
   ```
3. שמור

**המתנה:** עד 24 שעות ל-DNS propagation (בדרך כלל 10-30 דקות)

---

## שימוש - יצירת דף נחיתה ללקוח

### תרחיש: לקוח חדש "דלית שבת - הוילה על הנחל"

**שלב 1: צור משתמש חדש (אם עוד לא קיים)**
```
/admin/users/create
→ מלא פרטים
→ שמור
```

**שלב 2: לקוח מתחבר לדשבורד**
```
https://your-domain.com/dashboard/login
```

**שלב 3: לקוח לוחץ "ניהול דף נחיתה" בתפריט**

**שלב 4: לקוח ממלא את הטופס:**

**הגדרות כלליות:**
- **Subdomain**: `dalit` → יהפוך ל-`dalit.hostly.co.il`
- **כותרת**: "הוילה על הנחל"
- **תת-כותרת**: "בין פלגי הדן"
- **WhatsApp**: `972501234567`
- **Waze**: `https://waze.com/...`
- **טלפון**: `052-1234567`
- **כתובת**: "דלית שבת, צפון"

**גלריה ראשית (Hero):**
- לחץ "הוסף תמונה" → בחר תמונה (1920x1080 מומלץ)
- חזור על זה 4-6 פעמים
- כל תמונה תוצג בסליידר

**תכונות (Features):**
- ערוך את 6 התכונות:
  - Icon: `mdi:bed-double` (חפש icons ב-[iconify.design](https://iconify.design))
  - Title: "3 חדרי שינה"

**גלריית תמונות (Portfolio):**
- העלה 12-20 תמונות של החדרים
- הן יופיעו בגריד עם סינון קטגוריות

**שלב 5: שמור**

**שלב 6: הדף חי!**
```
https://dalit.hostly.co.il ✨
```

---

## Custom Domain (פרמיום)

### תרחיש: לקוח רוצה `villa-dalit.co.il`

**שלב 1: לקוח קונה דומיין**
- GoDaddy, Namecheap, וכו'

**שלב 2: לקוח מגדיר CNAME**

ב-DNS Management של הדומיין:
```
Type: CNAME
Name: @ (או www)
Value: cname.vercel-dns.com
TTL: Auto
```

**שלב 3: Admin מוסיף ב-Vercel**

Vercel → Settings → Domains → Add:
```
villa-dalit.co.il
```

Vercel ינפיק SSL אוטומטית תוך 5-10 דקות.

**שלב 4: Admin מעדכן ב-DB**

```sql
UPDATE landing_pages 
SET subdomain = 'villa-dalit.co.il'
WHERE user_id = '[USER_ID]';
```

---

## מבנה התיקיות

### תמונות ב-Storage:

```
landing-images/
├── {user_id_1}/
│   ├── hero/
│   │   ├── 1234567890.jpg
│   │   └── 1234567891.jpg
│   ├── portfolio/
│   │   ├── 1234567892.jpg
│   │   └── 1234567893.jpg
└── {user_id_2}/
    └── hero/
        └── 1234567894.jpg
```

### קבצי הקוד:

```
src/
├── app/
│   ├── sites/
│   │   ├── [site]/
│   │   │   ├── page.tsx (Server Component)
│   │   │   └── LandingPageClient.tsx (Client Component)
│   │   └── components/
│   │       ├── Hero.tsx (גלריה מתחלפת)
│   │       ├── Features.tsx (תכונות)
│   │       ├── Portfolio.tsx (גריד תמונות)
│   │       └── Contact.tsx (יצירת קשר)
│   ├── dashboard/
│   │   └── landing/
│   │       ├── page.tsx (Server Component)
│   │       └── LandingEditor.tsx (עורך CMS)
│   └── api/
│       └── landing/
│           ├── route.ts (GET/POST תוכן)
│           └── upload/
│               └── route.ts (POST/DELETE תמונות)
└── middleware.ts (נתוב subdomains)
```

---

## ארכיטקטורת מסד הנתונים

### עקרון: Multi-tenancy ברמת השורה

כל לקוח (user) מקבל:
1. שורה אחת ב-`landing_pages` (מטא דאטה)
2. מספר שורות ב-`landing_sections` (תוכן JSON גמיש)
3. תמונות נפרדות ב-Supabase Storage

**יתרונות:**
- ✅ הפרדה מלאה בין לקוחות (RLS)
- ✅ גמישות (JSON content - אפשר להוסיף שדות בלי migration)
- ✅ ביצועים (שאילתה אחת מביאה הכל)
- ✅ סקלביליות (אפשר להוסיף sections חדשים)

---

## Troubleshooting

### בעיה 1: הדף לא נטען (404)

**סיבות אפשריות:**
- ה-subdomain לא קיים ב-DB
- DNS לא התפשט עדיין (המתן 10-30 דקות)
- Wildcard domain לא הוגדר ב-Vercel

**פתרון:**
```sql
-- בדוק אם הדף קיים
SELECT * FROM landing_pages WHERE subdomain = 'dalit';

-- אם לא קיים - צור
INSERT INTO landing_pages (user_id, subdomain, site_title)
VALUES ('[USER_ID]', 'dalit', 'הוילה על הנחל');
```

### בעיה 2: תמונות לא מוצגות

**סיבות אפשריות:**
- ה-bucket לא public
- הקובץ לא הועלה בהצלחה
- Storage policies לא נכונות

**פתרון:**
1. בדוק ב-Supabase Storage → landing-images → Public = ✅
2. בדוק את ה-policies (ראה שלב 2 למעלה)
3. נסה להעלות שוב

### בעיה 3: לא מצליח להעלות תמונות

**שגיאה: "Storage bucket not found"**
```
פתרון: צור את ה-bucket (ראה שלב 2)
```

**שגיאה: "Policy violation"**
```
פתרון: הוסף את ה-policies (ראה שלב 2)
```

**שגיאה: "File too large"**
```
פתרון: דחוס את התמונה (מומלץ: tinypng.com)
```

### בעיה 4: subdomain כבר תפוס

**שגיאה: "duplicate key value violates unique constraint"**
```
פתרון: בחר subdomain אחר או מחק את הקיים אם זה שלך
```

---

## טיפים והמלצות

### גודל תמונות מומלץ

- **Hero Slider**: 1920x1080 (Full HD)
- **Portfolio**: 800x600 או 1200x900
- **פורמט**: JPG/JPEG (איכות 85%) או WebP (מומלץ לביצועים)
- **דחיסה**: השתמש ב-TinyPNG או Squoosh.app

### SEO (בעתיד)

כרגע הדפים לא כוללים meta tags דינמיים. בעתיד נוסיף:
- Dynamic `<title>` tags
- Open Graph tags
- Structured data (JSON-LD)

### ביצועים

- כל הדפים הם `force-dynamic` (לא cached)
- תמונות מוגשות מ-Supabase CDN
- בעתיד: Image optimization עם Next.js Image

---

## עדכונים עתידיים מתוכננים

- [ ] Drag & drop reorder לתמונות
- [ ] Rich Text Editor לטקסטים
- [ ] סעיפים נוספים (ביקורות, אטרקציות, מסעדות)
- [ ] A/B Testing
- [ ] Analytics integration (Google Analytics)
- [x] לוח שנה מותאם אישית (במקום Beds24 iframe)
- [ ] Multi-language support

---

## זרימת נתונים

```
לקוח מתחבר → /dashboard
  ↓
לוחץ "ניהול דף נחיתה" → /dashboard/landing
  ↓
ממלא טפסים ומעלה תמונות
  ↓
שומר → API: /api/landing (POST)
  ↓
DB: landing_pages + landing_sections + landing_images
  ↓
הדף חי ב: dalit.hostly.co.il 🎉
```

```
אורח גולש ל: dalit.hostly.co.il
  ↓
Middleware: זיהוי subdomain
  ↓
Rewrite: /sites/dalit
  ↓
Server: fetch מ-DB (landing_pages + sections + images)
  ↓
Render: LandingPageClient עם כל התוכן
  ↓
אורח רואה דף מלא! 🏠
```

---

## שאלות נפוצות (FAQ)

### ש: כמה תמונות אפשר להעלות?

**ת:** אין הגבלה טכנית, אבל מומלץ:
- Hero: 4-6 תמונות
- Portfolio: 12-20 תמונות

### ש: מה קורה אם subdomain כבר תפוס?

**ת:** המערכת תחזיר שגיאה. יש לבחור שם אחר או לפנות ל-admin למחיקת הקיים.

### ש: אפשר לשנות subdomain אחרי שיצרתי?

**ת:** כן! פשוט ערוך ב-"הגדרות כלליות" ושמור. שים לב:
- הקישור הישן יפסיק לעבוד
- עדכן לקוחות בקישור החדש

### ש: איך מוסיפים Custom Domain?

**ת:** ראה סעיף "Custom Domain (פרמיום)" למעלה.

---

## תחזוקה

### גיבוי (Backup)

הכל נשמר ב-Supabase. מומלץ:
- Supabase Backups (אוטומטי כל יום)
- Export ידני: Dashboard → Database → Backup

### ניטור (Monitoring)

- Supabase Dashboard → Database → Activity Log
- Vercel Analytics → Traffic & Performance

---

**✅ המערכת מוכנה לשימוש! בהצלחה! 🚀**

---

## צור קשר לתמיכה

אם יש בעיות טכניות או שאלות, צור קשר עם התמיכה הטכנית.
