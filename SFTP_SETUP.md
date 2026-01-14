# 🚀 הגדרת SFTP להעלאה אוטומטית

## צעד 1: התקן את תוסף SFTP

### ב-VS Code / Cursor:
1. לחץ על **Extensions** (Ctrl+Shift+X)
2. חפש: **"SFTP"** או **"sftp-sync"**
3. התקן את אחד מהתוספים הפופולריים:
   - **SFTP** מאת Natizyskunk (הכי מומלץ)
   - **sftp-sync** מאת liximomo

## צעד 2: הגדר את פרטי השרת

ערוך את הקובץ `.vscode/sftp.json` ומלא את הפרטים הבאים:

```json
{
  "host": "YOUR_SERVER_HOST",        // לדוגמה: "ftp.mountain-view-dafna.co.il"
  "username": "YOUR_USERNAME",       // שם המשתמש שלך לשרת
  "password": "YOUR_PASSWORD",       // הסיסמה (או השתמש ב-privateKeyPath)
  "remotePath": "/public_html"       // הנתיב בשרת (public_html או www)
}
```

### אופציה 1: שימוש בסיסמה
```json
{
  "host": "ftp.yourdomain.com",
  "username": "your_username",
  "password": "your_password"
}
```

### אופציה 2: שימוש ב-SSH Key (יותר מאובטח)
```json
{
  "host": "ftp.yourdomain.com",
  "username": "your_username",
  "privateKeyPath": "C:\\Users\\YourName\\.ssh\\id_rsa",
  "passphrase": "your_passphrase_if_any"
}
```

## צעד 3: העלה את הקבצים

### דרך 1: העלאה ידנית של תיקייה
1. לחץ **F1** (או Ctrl+Shift+P)
2. הקלד: **SFTP: Upload Folder**
3. בחר את תיקיית **out**
4. התוסף יעלה את כל הקבצים לשרת

### דרך 2: העלאה מלאה (Sync)
1. לחץ **F1**
2. הקלד: **SFTP: Sync Local -> Remote**
3. אשר את ההעלאה
4. כל הקבצים מתיקיית `out` יועלו

### דרך 3: לחיצה ימנית
1. לחץ לחיצה ימנית על תיקיית **out**
2. בחר: **SFTP: Upload Folder**

## צעד 4: בדיקה

לאחר ההעלאה, בדוק:
- [ ] https://mountain-view-dafna.co.il/
- [ ] דף טיולים OFF-GRID מציג "בגליל העליון"
- [ ] התמונות החדשות נטענות
- [ ] כל הדפים עובדים

## 🔒 אבטחה

### אל תשתף את קובץ sftp.json!
הקובץ מכיל סיסמאות. ודא ש:
- ✓ `.vscode/sftp.json` נמצא ב-.gitignore
- ✓ לא מעלים אותו ל-GitHub

### הוסף ל-.gitignore:
```
.vscode/sftp.json
```

## 📝 פקודות שימושיות

| פעולה | פקודה |
|-------|-------|
| העלה תיקייה | `SFTP: Upload Folder` |
| העלה קובץ | `SFTP: Upload File` |
| סנכרן לשרת | `SFTP: Sync Local -> Remote` |
| סנכרן מהשרת | `SFTP: Sync Remote -> Local` |
| השווה קבצים | `SFTP: Diff` |
| רשימת קבצים בשרת | `SFTP: List` |

## 🎯 הגדרות נוספות

### העלאה אוטומטית בשמירה
אם אתה רוצה שקבצים יועלו אוטומטית כשאתה שומר:

```json
{
  "uploadOnSave": true
}
```

### מחיקת קבצים בשרת
אם אתה רוצה למחוק קבצים שנמחקו לוקאלית:

```json
{
  "syncOption": {
    "delete": true
  }
}
```

## ⚡ טיפים

1. **בדיקה ראשונית**: העלה קובץ אחד קטן כדי לבדוק שההגדרות תקינות
2. **גיבוי**: גבה את השרת לפני סנכרון מלא
3. **רשימת ignore**: הקובץ מוגדר להעלות רק את תיקיית `out`
4. **מהירות**: SFTP מהיר יותר מ-FTP רגיל

## 🆘 פתרון בעיות

### שגיאת חיבור
- בדוק את ה-host, username, password
- בדוק שהשרת תומך ב-SFTP (port 22)
- נסה להתחבר דרך FileZilla כדי לאמת את הפרטים

### שגיאת הרשאות
- ודא שלמשתמש יש הרשאות כתיבה ל-public_html
- בדוק שהנתיב remotePath נכון

### קבצים לא מועלים
- בדוק את רשימת ה-ignore
- ודא שאתה מעלה את תיקיית `out` ולא את השורש

---

## 📦 קובץ ההגדרות המלא

הקובץ `.vscode/sftp.json` מוגדר להעלות רק את תוכן תיקיית **out** לשרת.

המבנה:
- **Local**: `out/` (הקבצים שנבנו)
- **Remote**: `/public_html/` (השרת)

זה מבטיח שרק קבצי הפרודקשן יועלו, ללא קבצי מקור או node_modules.

---

**בהצלחה! 🚀**
