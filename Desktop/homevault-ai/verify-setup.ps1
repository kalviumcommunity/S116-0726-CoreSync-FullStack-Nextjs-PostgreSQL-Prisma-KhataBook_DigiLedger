Write-Host "HomeVault AI - Setup Verification" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

$allGood = $true

# Check Node.js
Write-Host "Checking Node.js..." -NoNewline
try {
    $nodeVersion = node --version
    Write-Host " ✓ $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host " ✗ Not installed" -ForegroundColor Red
    $allGood = $false
}

# Check npm
Write-Host "Checking npm..." -NoNewline
try {
    $npmVersion = npm --version
    Write-Host " ✓ v$npmVersion" -ForegroundColor Green
} catch {
    Write-Host " ✗ Not installed" -ForegroundColor Red
    $allGood = $false
}

# Check PostgreSQL connection
Write-Host "Checking PostgreSQL..." -NoNewline
try {
    $pgTest = Test-NetConnection -ComputerName localhost -Port 5432 -WarningAction SilentlyContinue -ErrorAction SilentlyContinue
    if ($pgTest.TcpTestSucceeded) {
        Write-Host " ✓ Running on port 5432" -ForegroundColor Green
    } else {
        Write-Host " ✗ Not running on port 5432" -ForegroundColor Yellow
        Write-Host "   Note: Required for backend to work" -ForegroundColor Yellow
    }
} catch {
    Write-Host " ✗ Cannot check" -ForegroundColor Yellow
}

# Check Redis connection
Write-Host "Checking Redis..." -NoNewline
try {
    $redisTest = Test-NetConnection -ComputerName localhost -Port 6379 -WarningAction SilentlyContinue -ErrorAction SilentlyContinue
    if ($redisTest.TcpTestSucceeded) {
        Write-Host " ✓ Running on port 6379" -ForegroundColor Green
    } else {
        Write-Host " ⚠ Not running on port 6379" -ForegroundColor Yellow
        Write-Host "   Note: Backend will try to connect but may fail" -ForegroundColor Yellow
    }
} catch {
    Write-Host " ✗ Cannot check" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Backend Setup:" -ForegroundColor Cyan
Write-Host "--------------" -ForegroundColor Cyan

# Check backend node_modules
Write-Host "  node_modules..." -NoNewline
if (Test-Path "backend\node_modules") {
    Write-Host " ✓ Installed" -ForegroundColor Green
} else {
    Write-Host " ✗ Missing - Run: cd backend; npm install" -ForegroundColor Red
    $allGood = $false
}

# Check backend .env
Write-Host "  .env file..." -NoNewline
if (Test-Path "backend\.env") {
    Write-Host " ✓ Present" -ForegroundColor Green
} else {
    Write-Host " ✗ Missing - Copy from .env.example" -ForegroundColor Red
    $allGood = $false
}

# Check Prisma client
Write-Host "  Prisma Client..." -NoNewline
if (Test-Path "backend\node_modules\.prisma\client") {
    Write-Host " ✓ Generated" -ForegroundColor Green
} else {
    Write-Host " ✗ Not generated - Run: cd backend; npx prisma generate" -ForegroundColor Red
    $allGood = $false
}

Write-Host ""
Write-Host "Frontend Setup:" -ForegroundColor Cyan
Write-Host "---------------" -ForegroundColor Cyan

# Check frontend node_modules
Write-Host "  node_modules..." -NoNewline
if (Test-Path "frontend\node_modules") {
    Write-Host " ✓ Installed" -ForegroundColor Green
} else {
    Write-Host " ✗ Missing - Run: cd frontend; npm install" -ForegroundColor Red
    $allGood = $false
}

# Check frontend .env
Write-Host "  .env file..." -NoNewline
if (Test-Path "frontend\.env") {
    Write-Host " ✓ Present" -ForegroundColor Green
} else {
    Write-Host " ✗ Missing - Copy from .env.example" -ForegroundColor Red
    $allGood = $false
}

Write-Host ""
Write-Host "Port Availability:" -ForegroundColor Cyan
Write-Host "------------------" -ForegroundColor Cyan

# Check if port 5000 is available
Write-Host "  Port 5000 (Backend)..." -NoNewline
$port5000 = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue
if ($port5000) {
    Write-Host " ✗ Already in use" -ForegroundColor Yellow
    Write-Host "   Run this to free it: Get-NetTCPConnection -LocalPort 5000 | ForEach-Object { Stop-Process -Id `$_.OwningProcess -Force }" -ForegroundColor Gray
} else {
    Write-Host " ✓ Available" -ForegroundColor Green
}

# Check if port 5173 is available
Write-Host "  Port 5173 (Frontend)..." -NoNewline
$port5173 = Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue
if ($port5173) {
    Write-Host " ✗ Already in use" -ForegroundColor Yellow
    Write-Host "   Run this to free it: Get-NetTCPConnection -LocalPort 5173 | ForEach-Object { Stop-Process -Id `$_.OwningProcess -Force }" -ForegroundColor Gray
} else {
    Write-Host " ✓ Available" -ForegroundColor Green
}

Write-Host ""
if ($allGood) {
    Write-Host "✓ Setup looks good! You can run the application." -ForegroundColor Green
    Write-Host ""
    Write-Host "To start:" -ForegroundColor Cyan
    Write-Host "  - Double-click 'start-all.bat' OR" -ForegroundColor White
    Write-Host "  - Run './start-all.ps1' OR" -ForegroundColor White
    Write-Host "  - Manually: cd backend && npm run dev (in one terminal)" -ForegroundColor White
    Write-Host "            cd frontend && npm run dev (in another terminal)" -ForegroundColor White
} else {
    Write-Host "✗ Setup incomplete. Please fix the issues above." -ForegroundColor Red
}

Write-Host ""
