@echo off
echo ========================================
echo HomeVault AI - Setup Check
echo ========================================
echo.

echo Checking installations...
echo.

echo [Node.js]
node --version 2>nul && echo   Status: OK || echo   Status: NOT FOUND
echo.

echo [npm]
call npm --version 2>nul && echo   Status: OK || echo   Status: NOT FOUND
echo.

echo [Backend Dependencies]
if exist "backend\node_modules\" (
    echo   node_modules: OK
) else (
    echo   node_modules: MISSING - Run: cd backend ^&^& npm install
)

if exist "backend\.env" (
    echo   .env file: OK
) else (
    echo   .env file: MISSING - Copy from .env.example
)

if exist "backend\node_modules\.prisma\client\" (
    echo   Prisma Client: OK
) else (
    echo   Prisma Client: MISSING - Run: cd backend ^&^& npx prisma generate
)
echo.

echo [Frontend Dependencies]
if exist "frontend\node_modules\" (
    echo   node_modules: OK
) else (
    echo   node_modules: MISSING - Run: cd frontend ^&^& npm install
)

if exist "frontend\.env" (
    echo   .env file: OK
) else (
    echo   .env file: MISSING - Copy from .env.example
)
echo.

echo ========================================
echo To run the application:
echo   1. Double-click: start-all.bat
echo   2. Or manually run:
echo      - cd backend ^&^& npm run dev
echo      - cd frontend ^&^& npm run dev
echo ========================================
echo.
pause
