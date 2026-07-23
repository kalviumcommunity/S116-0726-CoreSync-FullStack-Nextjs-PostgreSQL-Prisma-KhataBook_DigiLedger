# HomeVault AI — Smart Personal Item Location Manager

A full-stack app for tracking exactly where every physical item in your home, office, or warehouse
lives, and finding it again in seconds.

```
homevault-ai/
  backend/    Node.js + Express + TypeScript + Prisma + PostgreSQL API   → backend/README.md
  frontend/   React + TypeScript + Vite + Tailwind SPA                  → frontend/README.md
  .github/workflows/backend-ci.yml   CI: install → prisma generate → build → test
```

## Quick Start - EASIEST METHOD (Windows)

**Just double-click:** `start-all.bat`

This will open two windows and start both frontend and backend servers automatically!

Or run: `./start-all.ps1` in PowerShell

Then open: **http://localhost:5173** in your browser

**Demo Accounts:**
- Admin: `admin@homevault.ai` / `Password@123`
- User: `demo@homevault.ai` / `Password@123`

📖 **Detailed instructions:** See [HOW-TO-RUN.md](HOW-TO-RUN.md)

---

## Quick start (Manual - local, no Docker)

```bash
# 1. Database + cache (or point DATABASE_URL/REDIS_URL at hosted services)
#    e.g. brew services start postgresql redis   /  or use Neon + Redis Cloud

# 2. Backend
cd backend
cp .env.example .env        # fill in DATABASE_URL etc.
npm install
npx prisma generate
npx prisma db push
npm run prisma:seed
npm run dev                  # http://localhost:5000  (docs: /api-docs)

# 3. Frontend (new terminal)
cd frontend
cp .env.example .env
npm install
npm run dev                  # http://localhost:5173
```

## Quick start (Docker)

```bash
cd backend && docker compose up --build   # Postgres + Redis + API
cd frontend && npm install && npm run dev  # frontend still runs via Vite dev server
```

## Scope note

The original spec listed ~40 features spanning AI image recognition, OCR, voice assistant search,
indoor map view, offline sync, and full CSV/PDF/Excel export, on top of the core CRUD/auth/media/
search/sharing/admin feature set. This build implements the full **core** system end-to-end (real
Prisma schema, working Express API with auth/CRUD/search/media/QR/sharing/admin, and a matching
React UI) with clean, extensible architecture (MVC + service + repository layers on the backend;
api/hooks separation on the frontend) so the AI- and hardware-dependent features can be added
without restructuring anything. Each README lists exactly what's implemented vs. stubbed.
