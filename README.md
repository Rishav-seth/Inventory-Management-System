# Inventory Management System

A beginner-friendly MERN inventory management system built incrementally.

## Phase 1 scope

Phase 1 creates the React frontend and Express backend, connects the backend to MongoDB Atlas, and verifies frontend/backend communication through a health-check request.

Product CRUD, stock operations, validation, dashboard calculations, and product pages will be added in later phases.

## Prerequisites

- Node.js and npm
- A MongoDB Atlas cluster and connection string

## Setup

1. Open a terminal in this directory.
2. Install all dependencies:

```text
npm run install:all
```

3. Create `server/.env` by copying `server/.env.example`.
4. Set `MONGODB_URI` to your MongoDB Atlas connection string. Keep the credentials private.
5. Confirm your Atlas network access rules allow your current IP address.

## Run the project

Start both applications from the project root:

```text
npm run dev
```

The frontend runs at `http://localhost:5173` and the backend runs at `http://localhost:5000`.

## Verify Phase 1

1. Open `http://localhost:5000/api/health` and confirm it returns a success JSON response.
2. Open `http://localhost:5173` and confirm the page shows **Backend connected**.
3. Stop the backend and refresh the frontend to confirm it shows a readable connection error.
4. Build the frontend:

```text
npm run build
```
