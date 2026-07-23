# ✅ HomeVault AI - NOW RUNNING!

## 🔍 The Problem

**Why `npm run dev` wasn't working:**

The issue wasn't with `npm run dev` itself - the command works fine! The problem was that the **backend requires PostgreSQL and Redis to be running**, and they weren't started.

### Error you were seeing:
```
ECONNREFUSED: Connection refused (PostgreSQL port 5432)
ECONNREFUSED: Connection refused (Redis port 6379)
```

## ✅ The Solution

Start PostgreSQL and Redis **BEFORE** running `npm run dev` for the backend.

## 🚀 How To Run (3 Methods)

### Method 1: ONE-CLICK START (Easiest)

```bash
Double-click: start-all.bat
```

This script now:
1. ✅ Starts PostgreSQL & Redis (via Docker)
2. ✅ Starts Backend server (npm run dev)
3. ✅ Starts Frontend server (npm run dev)

### Method 2: SEPARATE SERVICES

```bash
# Step 1: Start database & Redis
Double-click: start-services.bat

# Step 2: Start application
Double-click: start-all.bat
```

### Method 3: FULLY MANUAL

```bash
# Terminal 1: Start PostgreSQL & Redis
cd backend
docker-compose -f docker-compose.dev.yml up -d

# Terminal 2: Start Backend
cd backend
npm run dev

# Terminal 3: Start Frontend
cd frontend
npm run dev
```

## 📋 What's Currently Running

✅ **PostgreSQL** (Database): `localhost:5432`  
✅ **Redis** (Cache): `localhost:6379`  
✅ **Backend API**: `http://localhost:5000`  
✅ **Frontend**: `http://localhost:5173`  
✅ **API Docs**: `http://localhost:5000/api-docs`

## 🔐 Demo Accounts

**Admin Account:**
- Email: `admin@homevault.ai`
- Password: `Password@123`

**Regular User:**
- Email: `demo@homevault.ai`
- Password: `Password@123`

## 🌐 Access the Application

👉 **Open your browser**: http://localhost:5173

## 🛑 How To Stop Everything

### Stop Application Servers
Press `Ctrl + C` in each terminal window (backend and frontend)

### Stop Database & Redis
```bash
Double-click: stop-services.bat
```

Or manually:
```bash
cd backend
docker-compose -f docker-compose.dev.yml down
```

## 📁 Helper Scripts Created

| Script | Purpose |
|--------|---------|
| `start-all.bat` | ⭐ Start everything (database, Redis, backend, frontend) |
| `start-services.bat` | Start only database & Redis |
| `stop-services.bat` | Stop database & Redis |
| `start-backend.bat` | Start only backend |
| `start-frontend.bat` | Start only frontend |
| `check-setup.bat` | Verify setup is complete |
| `START-HERE.txt` | Quick reference guide |

## 🐛 Common Issues & Solutions

### Issue: "ECONNREFUSED" errors

**Cause:** PostgreSQL or Redis not running  
**Solution:** Run `start-services.bat` first

### Issue: "Port 5000 already in use"

**Cause:** Backend server still running from before  
**Solution:**
```powershell
Get-NetTCPConnection -LocalPort 5000 | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
```

### Issue: Docker containers won't start

**Cause:** Docker Desktop not running  
**Solution:** 
1. Open Docker Desktop application
2. Wait for it to fully start (green icon)
3. Run `start-services.bat` again

### Issue: "Cannot connect to Docker daemon"

**Cause:** Docker Desktop not installed or not running  
**Solution:** 
1. Install Docker Desktop from https://www.docker.com/products/docker-desktop
2. Start Docker Desktop
3. Wait for it to be ready

## 🔧 Tech Stack

### Backend
- Node.js + Express
- TypeScript
- PostgreSQL (via Docker)
- Redis (via Docker)
- Prisma ORM
- JWT Authentication

### Frontend
- React 18
- TypeScript
- Vite
- TailwindCSS
- React Router
- React Query

## 📦 What Was Fixed

1. ✅ **Identified the root cause**: Missing database/Redis services
2. ✅ **Created `docker-compose.dev.yml`**: Simplified Docker setup for dev
3. ✅ **Created helper scripts**: One-click start for everything
4. ✅ **Updated `start-all.bat`**: Now auto-starts database/Redis
5. ✅ **Fixed TypeScript config**: Custom Express types working
6. ✅ **Fixed type errors**: Prisma metadata casting
7. ✅ **Added comprehensive docs**: Multiple guides and troubleshooting

## ✨ Next Steps

1. Open http://localhost:5173 in your browser
2. Login with demo credentials
3. Start exploring HomeVault AI!

## 📚 Additional Documentation

- **START-HERE.txt** - Quick reference
- **HOW-TO-RUN.md** - Detailed setup guide  
- **README.md** - Project overview
- **backend/README.md** - Backend documentation
- **frontend/README.md** - Frontend documentation

---

**🎉 Everything is working now! The key was starting PostgreSQL and Redis first.**
