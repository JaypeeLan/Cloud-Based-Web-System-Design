# LocalSpot Booker

LocalSpot Booker is a cloud-native platform where users can discover salons, eateries, and events by area, then book a reservation or appointment.

- Frontend: Next.js + TypeScript (Vercel)
- Backend: Express + TypeScript + Mongoose (Render)
- Database: MongoDB Atlas

## Features

- JWT authentication (customer/owner/admin roles)
- Multi-page experience (`/auth`, `/discover`, `/reservations`, `/host`)
- Onboarding captures user location and uses it as default discovery area
- Area and category-based listing search
- Dedicated listing detail pages for booking (separate from discovery/search)
- Listing creation and management for owners
- Reservation/appointment booking flow
- Reservation tracking for customers
- Animated UI system (page transitions, hover micro-animations, shimmer loaders, spinner states)
- Profile modal allows updates to all details except email
- CI pipeline for backend/frontend builds

## Project structure

- `frontend/` UI application (feature-based modules)
- `backend/` API service (modular layered structure)
- `docs/architecture.md` architecture notes
- `render.yaml` Render deployment spec

## Local setup

## Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

### Swagger/OpenAPI docs

When backend is running, open:

- `http://localhost:5000/docs` (or your configured backend port)

On Render, open:

- `https://<your-render-service>.onrender.com/docs`

### Seed sample data

```bash
cd backend
npm run seed
```

This creates demo users, listings, and reservations.
The script clears existing `users`, `listings`, and `reservations` first.

## Frontend

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

## Environment variables

### Backend (`backend/.env`)

- `PORT`
- `MONGODB_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `CLIENT_URL`

### Frontend (`frontend/.env.local`)

- `NEXT_PUBLIC_API_BASE_URL`

## API endpoints

Base: `/api/v1`

- `GET /health`
- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`
- `PATCH /auth/profile`
- `GET /listings`
- `GET /listings/:listingId`
- `GET /listings/mine`
- `POST /listings`
- `PATCH /listings/:listingId`
- `POST /reservations`
- `GET /reservations/mine`
- `GET /reservations/owner`
- `PATCH /reservations/:reservationId/status`

## Deployment (Render + Vercel)

1. Create MongoDB Atlas cluster and get `MONGODB_URI`.
2. Deploy backend to Render with `render.yaml`; set `MONGODB_URI`, `JWT_SECRET`, and `CLIENT_URL`.
3. Deploy frontend to Vercel (`frontend` as root); set `NEXT_PUBLIC_API_BASE_URL` to Render API URL.
