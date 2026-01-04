# הוראות התקנה והגדרה של Git לפרויקט

## שלב 1: התקנת Git ב-Windows

### אפשרות א': הורדה מהאתר הרשמי (מומלץ)
1. היכנס לאתר: https://git-scm.com/download/win
2. הורד את הגרסה האחרונה של Git for Windows
3. הרץ את קובץ ההתקנה (.exe)
4. במהלך ההתקנה, השאר את ברירות המחדל (מומלץ)
5. בסיום ההתקנה, סגור ופתח מחדש את PowerShell/Terminal

### אפשרות ב': התקנה דרך Chocolatey (אם מותקן)
```powershell
choco install git
```

### אפשרות ג': התקנה דרך winget
```powershell
winget install --id Git.Git -e --source winget
```

## שלב 2: אימות ההתקנה

פתח PowerShell או Terminal חדש והרץ:
```powershell
git --version
```

אם תראה מספר גרסה (למשל: `git version 2.42.0`), ההתקנה הצליחה!

## שלב 3: הגדרת Git (פעם אחת בלבד)

הגדר את השם והאימייל שלך:
```powershell
git config --global user.name "השם שלך"
git config --global user.email "your.email@example.com"
```

## שלב 4: אתחול Git בפרויקט

1. פתח PowerShell/Terminal בתיקיית הפרויקט:
   ```powershell
   cd C:\Users\zurbr\Site\mountain-view
   ```

2. אתחל מאגר Git:
   ```powershell
   git init
   ```

3. הוסף את כל הקבצים:
   ```powershell
   git add .
   ```

4. צור commit ראשון:
   ```powershell
   git commit -m "Initial commit"
   ```

## שלב 5: בדיקה שהכל עובד

בדוק את הסטטוס:
```powershell
git status
```

בדוק את ההיסטוריה:
```powershell
git log
```

## שלב 6: חיבור ל-GitHub/GitLab (אופציונלי)

אם תרצה לשמור את הקוד ב-GitHub או GitLab:

1. צור מאגר חדש ב-GitHub/GitLab
2. הוסף את ה-remote:
   ```powershell
   git remote add origin https://github.com/yourusername/your-repo.git
   ```
3. העלה את הקוד:
   ```powershell
   git branch -M main
   git push -u origin main
   ```

## פקודות Git שימושיות

- `git status` - בדיקת סטטוס הקבצים
- `git add .` - הוספת כל הקבצים לשינוי
- `git add <filename>` - הוספת קובץ ספציפי
- `git commit -m "הודעה"` - יצירת commit עם הודעה
- `git log` - הצגת היסטוריית ה-commits
- `git diff` - הצגת שינויים שלא נשמרו
- `git branch` - הצגת ענפים
- `git checkout -b <branch-name>` - יצירת ענף חדש

## פתרון בעיות נפוצות

### Git לא מזוהה אחרי ההתקנה
- סגור ופתח מחדש את PowerShell/Terminal
- בדוק שהתקנת Git הושלמה בהצלחה
- נסה להריץ: `refreshenv` (אם יש Chocolatey)

### שגיאת הרשאות
- הרץ את PowerShell כמנהל מערכת
- או השתמש ב-Git Bash במקום PowerShell

## הערות חשובות

- קובץ `.gitignore` כבר נוצר בפרויקט ומכיל את כל הקבצים שלא צריך לשמור ב-Git
- הקבצים `node_modules`, `out`, `*.lock` לא יישמרו ב-Git (כפי שצריך)
- מומלץ לעשות commit לפני כל שינוי משמעותי

---

**לעזרה נוספת:** https://git-scm.com/doc


