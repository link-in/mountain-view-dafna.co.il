# 🔍 בדיקת חיבור SFTP

## דרך 1: דרך תוסף SFTP ב-Cursor ⭐ (הכי מומלץ)

1. לחץ **F1** (או Ctrl+Shift+P)
2. הקלד: **SFTP: List**
3. אם החיבור עובד, תראה רשימת קבצים בשרת
4. אם יש שגיאה, תקבל הודעה ברורה

### דרך זריזה יותר:
1. לחץ **F1**
2. הקלד: **SFTP: List All Configs**
3. בחר את הקונפיג שלך
4. אם החיבור עובד, תראה את הקבצים

---

## דרך 2: העלה קובץ בודד לבדיקה

1. צור קובץ בדיקה בתיקיית `out`:
   - צור קובץ: `out/test.txt`
   - תוכן: "Test Connection"

2. לחיצה ימנית על הקובץ
3. בחר: **SFTP: Upload File**
4. אם הצליח - החיבור עובד! ✅

---

## דרך 3: דרך PowerShell (בדיקה ידנית)

```powershell
# התקן את POSH-SSH אם לא מותקן
Install-Module -Name Posh-SSH -Force

# בדוק חיבור SFTP
$password = ConvertTo-SecureString "mHllf5.z-fKiPcJ;" -AsPlainText -Force
$Credential = New-Object System.Management.Automation.PSCredential ("sftp@mountain-view-dafna.co.il", $password)

# נסה להתחבר
New-SFTPSession -ComputerName "185.56.74.100" -Credential $Credential -Port 22
```

---

## דרך 4: דרך FileZilla (גיבוי)

אם כלום לא עובד, בדוק עם FileZilla:

1. פתח FileZilla
2. מלא:
   - **Host**: sftp://185.56.74.100
   - **Username**: sftp@mountain-view-dafna.co.il
   - **Password**: mHllf5.z-fKiPcJ;
   - **Port**: 22
3. לחץ "Quickconnect"

אם FileZilla מצליח להתחבר, אז הבעיה בהגדרות התוסף.
אם לא, אז יש בעיה בפרטי החיבור.

---

## 🆘 שגיאות נפוצות

### "Connection refused" או "Timeout"
- ✓ בדוק שה-IP נכון: 185.56.74.100
- ✓ בדוק ש-Port 22 פתוח
- ✓ בדוק שהשרת תומך ב-SFTP

### "Authentication failed"
- ✓ בדוק שם משתמש וסיסמה
- ✓ הסר רווחים מיותרים
- ✓ בדוק Caps Lock

### "Permission denied"
- ✓ ודא שלמשתמש יש הרשאות כתיבה
- ✓ נסה להתחבר דרך FileZilla כדי לאמת

---

## ✅ מה לעשות אחרי שהחיבור עובד?

כשהחיבור עובד:
1. העלה את כל תיקיית `out` (לחיצה ימנית → SFTP: Upload Folder)
2. בדוק את האתר: https://mountain-view-dafna.co.il/
3. ודא שהשינויים החדשים מופיעים

---

**התחל עם דרך 1 - זה הכי פשוט!** 🚀
