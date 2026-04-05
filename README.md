# BITEHUB 3-Layer Project

This project is now split into three layers:

- `frontend/` -> React + Vite client
- `backend/` -> Express + Mongoose API
- `database/` -> MongoDB Docker Compose setup

## Project Structure

```
BITEHUB/
  frontend/
  backend/
  database/
```

## Prerequisites

- Node.js 18+
- npm
- Docker Desktop (for local MongoDB via Compose)

## 1) Install Dependencies

Install layer-wise dependencies:

```bash
cd frontend
npm install
cd ../backend
npm install
cd ..
```

## 2) Start Database

```bash
cd database
docker compose up -d
cd ..
```

MongoDB runs at `mongodb://localhost:27017/bitehub`.

## 3) Configure Backend Environment

Create `backend/.env` from `backend/.env.example`.

Default values:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bitehub
FRONTEND_URL=http://localhost:5173
```

## 4) Run Frontend + Backend

Run in two terminals:

Terminal 1:

```bash
cd backend
npm run dev
```

Terminal 2:

```bash
cd frontend
npm run dev
```

URLs:

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

## API Endpoints (Core)

- `GET /api/health`
- `GET /api/restaurants`
- `GET /api/restaurants/:id`
- `GET /api/restaurants/:id/menu`
- `GET /api/restaurants/:id/seats?date=YYYY-MM-DD&time=HH:mm`
- `GET /api/users`
- `GET /api/bookings`
- `POST /api/bookings`
- `GET /api/feedback`
- `POST /api/feedback`
- `GET /api/payments`
- `POST /api/payments`

## Seeding

On backend startup, seed data is auto-upserted into MongoDB when collections are empty.

Manual seed:

```bash
cd backend
npm run seed
```

## Notes

- Frontend has API services configured via `frontend/.env` (`VITE_API_BASE_URL`).
- Frontend pages use backend APIs with local fallback data for resilience during migration.
