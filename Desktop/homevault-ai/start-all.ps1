Write-Host "Starting HomeVault AI Application..." -ForegroundColor Cyan
Write-Host ""

# Get the script directory
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "Starting Backend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$scriptPath\backend'; npm run dev"

Start-Sleep -Seconds 2

Write-Host "Starting Frontend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$scriptPath\frontend'; npm run dev"

Write-Host ""
Write-Host "Both servers are starting in separate windows." -ForegroundColor Green
Write-Host ""
Write-Host "Access the application at:" -ForegroundColor Cyan
Write-Host "  Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "  Backend:  http://localhost:5000" -ForegroundColor White
Write-Host "  API Docs: http://localhost:5000/api-docs" -ForegroundColor White
Write-Host ""
Write-Host "Demo Accounts:" -ForegroundColor Cyan
Write-Host "  Admin: admin@homevault.ai / Password@123" -ForegroundColor White
Write-Host "  User:  demo@homevault.ai / Password@123" -ForegroundColor White
Write-Host ""
