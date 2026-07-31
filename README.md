# Travel Trip

A simplified [trip.com](https://trip.com)-style travel booking site: browse a country, then a town,
then book a paid activity from a gallery. Booking opens a modal with a simulated checkout and
issues a ticket with a QR code and a map. There's also a blog and an admin area for managing
bookings and content.

## Features

- **Browse**: Countries → Towns → Activities, plus a flat, filterable Activities page and a
  live header search bar across all three.
- **Maps**: every town and activity is pinned on an OpenStreetMap/Leaflet map (no API key
  required).
- **Booking**: a two-step modal (traveler details → simulated payment) issues a ticket with a
  unique code — no real payment gateway, no card data is ever stored beyond the cardholder
  name and last 4 digits.
- **Tickets**: a bookmarkable, printable ticket page with a QR code and a mini-map, resilient to
  the underlying activity later being edited or removed.
- **Blog**: articles about destinations, written in Markdown.
- **Admin**: a login-gated dashboard showing all recent bookings, plus full CRUD for countries,
  towns, activities, and blog posts — including an image picker that searches Pixabay and
  re-hosts the chosen photo on Cloudinary.

## Tech stack

| | |
|---|---|
| **Frontend** | Vite, React 19, TypeScript, Tailwind CSS v4, React Router, TanStack Query, React Hook Form + Zod, React Leaflet |
| **Backend** | Next.js (App Router, API routes only — no pages), MongoDB via Mongoose, Zod |
| **Images** | Pixabay (search) + Cloudinary (hosting) |

The frontend and backend are two independent apps that talk to each other over REST — the
backend is not a traditional Next.js site, it's used purely as an API server.

## Project structure

```
travel-trip/
  backend/     Next.js API server (MongoDB, auth, image pipeline)
  frontend/    Vite + React single-page app
```

## Getting started

### 1. Prerequisites

- Node.js 20+
- A MongoDB connection string (e.g. a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster)
- A [Pixabay API key](https://pixabay.com/api/docs/) and a [Cloudinary](https://cloudinary.com/) account

### 2. Configure the backend

```bash
cd backend
npm install
cp .env.local.example .env.local
```

Fill in `backend/.env.local`:

| Variable | Notes |
|---|---|
| `MONGODB_URI` | Your MongoDB connection string |
| `PIXABAY_API_KEY` | From your Pixabay account |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `CLOUDINARY_FOLDER` | From your Cloudinary dashboard |
| `ADMIN_USERNAME` | Whatever you want the admin login to be |
| `ADMIN_PASSWORD_HASH` | A bcrypt hash of your chosen admin password — generate one with `node -e "console.log(require('bcryptjs').hashSync('your-password', 10))"` |
| `ADMIN_JWT_SECRET` | A long random string — generate one with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `ADMIN_SESSION_TTL_HOURS` | How long an admin login stays valid, e.g. `12` |
| `CORS_ORIGIN` | The frontend's origin, e.g. `http://localhost:5173` |

Seed the database with sample countries, towns, activities, and blog posts (photos are pulled
from Pixabay and re-hosted on Cloudinary automatically):

```bash
npm run seed
```

Start the API server (runs on **http://localhost:4001**):

```bash
npm run dev
```

### 3. Configure the frontend

```bash
cd frontend
npm install
echo "VITE_API_BASE_URL=http://localhost:4001" > .env
npm run dev
```

The site is now running at **http://localhost:5173**.

### 4. Log in as admin

Visit `http://localhost:5173/admin/login` and sign in with the `ADMIN_USERNAME` /
password you chose above. From there: `/admin/dashboard` (bookings) and
`/admin/countries` / `/admin/towns` / `/admin/activities` / `/admin/blog` (content CRUD).

## Scripts

| Command | Where | What |
|---|---|---|
| `npm run dev` | `backend/`, `frontend/` | Start the dev server |
| `npm run build` | `backend/`, `frontend/` | Production build |
| `npm run lint` | `backend/`, `frontend/` | Lint |
| `npm run seed` | `backend/` | Reseed countries/towns/activities/blog posts (leaves existing bookings untouched) |
