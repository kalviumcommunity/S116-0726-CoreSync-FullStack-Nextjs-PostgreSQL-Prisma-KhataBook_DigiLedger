@echo off
echo ========================================
echo Stopping Database and Redis Services
echo ========================================
echo.

cd backend
docker-compose -f docker-compose.dev.yml down

echo.
echo Services stopped.
echo.
pause
