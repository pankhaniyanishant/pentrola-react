# Copilot Instructions for `pentrola-react`

## Build, lint, and test commands

### Frontend (repo root)
- Install deps: `npm install`
- Dev server: `npm run dev`
- Lint: `npm run lint`
- Build: `npm run build`
- Preview production build: `npm run preview`

### Backend (`backend/`)
- Install deps: `npm install`
- Run API server: `node server.js`
- Seed products: `node seed.js`

### Tests
- Root project currently has **no test script**.
- Backend `npm test` is a placeholder script that exits with error (`"Error: no test specified"`).
- There is currently no configured way to run a single automated test in this repository.

## High-level architecture

- This repository is a **two-process app**:
  - Frontend SPA (React + TypeScript + Vite) in `src/`
  - Backend API (Express + Mongoose) in `backend/`
- Backend request path is:
  - `server.js` mounts route modules (`/api/auth`, `/api/products`, `/api/orders`, `/api/cart`, `/api/wishlist`)
  - Route modules in `backend/routes/` persist through Mongoose models in `backend/models/`
  - DB connection is initialized once via `backend/db.js` on server startup
- Frontend composition path is:
  - `main.tsx` mounts `App`
  - `App.tsx` wraps the app in `AuthProvider` → `WishlistProvider` → `CartProvider`
  - `BrowserRouter` defines storefront routes and `/admin/*` pages (admin pages render inside `AdminLayout`)
  - `CartDrawer` is mounted at app-shell level, so cart UI is globally available across routes
- Runtime data model is intentionally hybrid:
  - API-backed flows: auth/profile, product catalog and admin product CRUD, cart/wishlist sync, checkout order creation, admin order/customer/inventory management
  - Local/mock flows: admin dashboard/activity/analytics/settings visualizations and customer order history/invoice pages

## Key repository-specific conventions

- **API client convention**: frontend API calls should use the centralized Axios client in `src/services/api.ts` (JWT interceptor + `VITE_API_BASE_URL` fallback).
- **Dual persistence pattern for cart/wishlist**:
  - Logged-in users: sync to backend (`/api/cart/:userId`, `/api/wishlist/:userId`)
  - Guests: use `localStorage` (`cartItems`, `wishlistItems`)
- **Auth/session shape is localStorage-first**:
  - User identity is stored under `localStorage['user']` with `{ uid, email, displayName, isAdmin, token }`
  - `AuthContext` is the single integration point for login/register/logout flows
- **Loose product/cart typing is relied upon in UI**:
  - IDs are commonly `number | string`
  - Prices are often formatted strings (for example `₹1,299`) in UI components and converted via regex parsing before cart/order math
  - Homepage sections intentionally create synthetic IDs (offset patterns like `+100`, `+200`) to avoid collisions
- **Backend runtime defaults favor local development**:
  - If `MONGO_URI` is missing, backend auto-starts an in-memory MongoDB (`mongodb-memory-server`)
  - Backend auto-seeds a default admin on startup if missing (`ADMIN_EMAIL`/`ADMIN_PASSWORD`/`ADMIN_NAME` envs, with local defaults)
  - Backend is CommonJS (`require/module.exports`) and mounted routes are in `backend/routes/*.js`
