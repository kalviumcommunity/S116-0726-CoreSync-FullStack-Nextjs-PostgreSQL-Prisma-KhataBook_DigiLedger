# How to Run HomeVault AI

## Quick Start (Easiest Method)

### Option 1: Run Everything at Once
Double-click: **`start-all.bat`**

This will open two command windows:
- One for the Frontend (React + Vite)
- One for the Backend (Express + TypeScript)

### Option 2: Run Separately
1. Double-click: **`start-backend.bat`** (starts the API server)
2. Double-click: **`start-frontend.bat`** (starts the web interface)

---

## Manual Method (Using Command Line)

### Step 1: Start the Backend
Open a terminal in the `backend` folder and run:
```bash
cd backend
npm run dev
```

### Step 2: Start the Frontend
Open another terminal in the `frontend` folder and run:
```bash
cd frontend
npm run dev
```

---

## Access the Application

Once both servers are running:

- **Frontend (Web App)**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Documentation**: http://localhost:5000/api-docs

---

## Demo Accounts

### Admin Account
- **Email**: admin@homevault.ai
- **Password**: Password@123

### Regular User Account
- **Email**: demo@homevault.ai
- **Password**: Password@123

---

## Troubleshooting

### Port Already in Use

If you get an error like "EADDRINUSE" or "Port 5000 is already in use":

**Kill the process using PowerShell:**
```powershell
# Kill process on port 5000 (Backend)
Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }

# Kill process on port 5173 (Frontend)
Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
```

### Dependencies Not Installed

If you get module errors, reinstall dependencies:

```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

### Database Issues

Reset and regenerate the database:

```bash
cd backend
npx prisma generate
npx prisma db push --accept-data-loss
npm run prisma:seed
```

### Environment Variables Missing

Make sure `.env` files exist:
- `backend/.env` - Backend configuration
- `frontend/.env` - Frontend configuration

If missing, copy from examples and modify as needed:
```bash
# Backend
cp backend/.env.example backend/.env

# Frontend  
cp frontend/.env.example frontend/.env
```

---

## Stopping the Servers

Simply press **`Ctrl + C`** in each terminal window where the servers are running.

---

## Development Mode

Both servers run in watch/dev mode, which means:
- **Auto-reload on file changes** ✅
- **Hot Module Replacement (Frontend)** ✅
- **TypeScript compilation on-the-fly** ✅

You can edit code and see changes immediately without restarting!

---

## Tech Stack

### Backend
- Node.js + Express
- TypeScript
- PostgreSQL (via Prisma ORM)
- Redis (for caching)
- JWT Authentication

### Frontend
- React 18
- TypeScript
- Vite
- TailwindCSS
- React Router
- React Query

---

## Need Help?

Check the logs in each terminal window for error messages. Most issues are related to:
1. Missing environment variables
2. Database connection problems
3. Ports already in use
4. Missing node_modules (run `npm install`)
