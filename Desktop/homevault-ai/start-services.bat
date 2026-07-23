@echo off
echo ========================================
echo Starting Database and Redis Services
echo ========================================
echo.
echo This will start PostgreSQL and Redis using Docker...
echo.

cd backend
docker-compose -f docker-compose.dev.yml up -d

echo.
echo ========================================
echo Services Status:
echo ========================================
docker-compose -f docker-compose.dev.yml ps

echo.
echo ✓ Database (PostgreSQL): localhost:5432
echo ✓ Cache (Redis): localhost:6379
echo.
echo Services are running in the background.
echo To stop them, run: stop-services.bat
echo.
pause
