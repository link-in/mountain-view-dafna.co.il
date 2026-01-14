# FTP Connection Test Script
# ==========================

Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  Testing FTP Connection to Mountain View Server" -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# FTP Details
$host_ip = "185.56.74.100"
$port = 21
$username = "sftp@mountain-view-dafna.co.il"

Write-Host "Server Details:" -ForegroundColor Green
Write-Host "  Host: $host_ip" -ForegroundColor White
Write-Host "  Port: $port (FTP)" -ForegroundColor White
Write-Host "  Username: $username" -ForegroundColor White
Write-Host ""

# Test 1: Check if host is reachable
Write-Host "[1/3] Testing if server is reachable..." -ForegroundColor Yellow
try {
    $ping = Test-Connection -ComputerName $host_ip -Count 2 -Quiet
    if ($ping) {
        Write-Host "  ✅ Server is reachable!" -ForegroundColor Green
    } else {
        Write-Host "  ❌ Server is NOT reachable!" -ForegroundColor Red
        Write-Host "  Check your internet connection or server IP" -ForegroundColor Gray
        exit
    }
} catch {
    Write-Host "  ⚠️  Ping test failed (firewall may be blocking)" -ForegroundColor Yellow
}
Write-Host ""

# Test 2: Check if FTP port is open
Write-Host "[2/3] Testing if FTP port (21) is open..." -ForegroundColor Yellow
try {
    $tcpClient = New-Object System.Net.Sockets.TcpClient
    $connection = $tcpClient.BeginConnect($host_ip, $port, $null, $null)
    $wait = $connection.AsyncWaitHandle.WaitOne(3000, $false)
    
    if ($wait) {
        try {
            $tcpClient.EndConnect($connection)
            Write-Host "  ✅ Port 21 (FTP) is OPEN!" -ForegroundColor Green
            $tcpClient.Close()
        } catch {
            Write-Host "  ❌ Port 21 is closed or blocked" -ForegroundColor Red
        }
    } else {
        Write-Host "  ❌ Connection timeout - port may be closed" -ForegroundColor Red
    }
} catch {
    Write-Host "  ❌ Failed to test port" -ForegroundColor Red
}
Write-Host ""

# Test 3: Instructions for FTP login test
Write-Host "[3/3] Testing FTP Authentication..." -ForegroundColor Yellow
Write-Host "  To test authentication, use one of these methods:" -ForegroundColor Gray
Write-Host ""
Write-Host "  Method 1: Via Cursor SFTP Extension (works with FTP too!)" -ForegroundColor Cyan
Write-Host "    1. Press F1" -ForegroundColor White
Write-Host "    2. Type: SFTP: List" -ForegroundColor White
Write-Host "    3. Check if you see server files" -ForegroundColor White
Write-Host ""
Write-Host "  Method 2: Upload test file" -ForegroundColor Cyan
Write-Host "    1. Right-click on: out\test-connection.txt" -ForegroundColor White
Write-Host "    2. Select: SFTP: Upload File" -ForegroundColor White
Write-Host "    3. Check for success message" -ForegroundColor White
Write-Host ""

Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  Summary" -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "Changed from SFTP to FTP:" -ForegroundColor White
Write-Host "  ✅ Protocol: FTP (instead of SFTP)" -ForegroundColor Green
Write-Host "  ✅ Port: 21 (instead of 22)" -ForegroundColor Green
Write-Host "  → Now test authentication via Cursor" -ForegroundColor Yellow
Write-Host ""
Write-Host "If connection still fails:" -ForegroundColor White
Write-Host "  ❌ Try with FileZilla to verify credentials" -ForegroundColor Red
Write-Host "  ❌ Check if passive mode is needed" -ForegroundColor Red
Write-Host "  ❌ Contact hosting provider for correct FTP settings" -ForegroundColor Red
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
