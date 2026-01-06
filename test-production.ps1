# Script לבדיקת תיקיית out מקומית לפני העלאה לפרודקשן
# שימוש: .\test-production.ps1

Write-Host "🔍 בודק את תיקיית out לפני העלאה לפרודקשן..." -ForegroundColor Green

# שלב 1: בדיקה אם תיקיית out קיימת
if (-not (Test-Path "out")) {
    Write-Host "❌ תיקיית out לא קיימת!" -ForegroundColor Red
    Write-Host "💡 מריץ npm run build..." -ForegroundColor Yellow
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ שגיאה בבנייה!" -ForegroundColor Red
        exit 1
    }
}

# שלב 2: בדיקת קבצים חשובים
Write-Host "`n📋 בודק קבצים חשובים..." -ForegroundColor Yellow

$importantFiles = @(
    "out/index.html",
    "out/.htaccess",
    "out/_next/static"
)

$missingFiles = @()
foreach ($file in $importantFiles) {
    if (Test-Path $file) {
        Write-Host "  ✅ $file" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $file - חסר!" -ForegroundColor Red
        $missingFiles += $file
    }
}

if ($missingFiles.Count -gt 0) {
    Write-Host "`n⚠️  נמצאו קבצים חסרים!" -ForegroundColor Yellow
    Write-Host "💡 מריץ npm run build מחדש..." -ForegroundColor Cyan
    npm run build
}

# שלב 3: ספירת קבצים
Write-Host "`n📊 סטטיסטיקות:" -ForegroundColor Yellow
$fileCount = (Get-ChildItem -Path "out" -Recurse -File | Measure-Object).Count
$dirCount = (Get-ChildItem -Path "out" -Recurse -Directory | Measure-Object).Count
$totalSize = [math]::Round((Get-ChildItem -Path "out" -Recurse -File | Measure-Object -Property Length -Sum).Sum / 1MB, 2)

Write-Host "  קבצים: $fileCount" -ForegroundColor Cyan
Write-Host "  תיקיות: $dirCount" -ForegroundColor Cyan
Write-Host "  גודל כולל: $totalSize MB" -ForegroundColor Cyan

# שלב 4: הרצת שרת מקומי
Write-Host "`n🚀 מריץ שרת מקומי על פורט 3001..." -ForegroundColor Yellow
Write-Host "💡 פתח בדפדפן: http://localhost:3001" -ForegroundColor Cyan
Write-Host "💡 לחץ Ctrl+C כדי לעצור" -ForegroundColor Yellow
Write-Host ""

# הרצת שרת
npx serve@latest out -p 3001


