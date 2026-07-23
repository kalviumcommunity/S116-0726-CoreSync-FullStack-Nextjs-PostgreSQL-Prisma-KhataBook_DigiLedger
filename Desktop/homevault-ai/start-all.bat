@echo off
echo Starting HomeVault AI Application...
echo.

REM First, ensure database and Redis are running
echo Checking database and Redis services...
cd backend
docker-compose -f docker-compose.dev.yml up -d >nul 2>&1
cd ..

echo.
echo Waiting for services to be ready...
timeout /t 3 /nobreak >nul
echo.

echo Opening Frontend in new window...
start "HomeVault Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"
echo.
echo Waiting 2 seconds...
timeout /t 2 /nobreak >nul
echo.
echo Opening Backend in new window...
start "HomeVault Backend" cmd /k "cd /d %~dp0backend && npm run dev"
echo.
echo ========================================
echo All services are starting!
echo ========================================
echo.
echo Database (PostgreSQL): localhost:5432
echo Cache (Redis): localhost:6379
echo Backend API: http://localhost:5000
echo Frontend: http://localhost:5173
echo API Docs: http://localhost:5000/api-docs
echo.
echo Demo Accounts:
echo   Admin: admin@homevault.ai / Password@123
echo   User:  demo@homevault.ai / Password@123
echo.
echo To stop database/Redis: run stop-services.bat
echo ========================================
echo.
pause
