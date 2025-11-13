# Bot Process Manager

A full-stack control panel for managing Node.js bot processes across one or more servers, inspired by PM2. The project includes:

- TypeScript Express API with JWT auth and Prisma/PostgreSQL.
- React dashboard with real-time log streaming via Socket.IO.
- Local process orchestration plus optional remote agent mode.
- Docker & Coolify-ready deployment.

## Project Structure

```
backend/   # Express API, Prisma ORM, process management
frontend/  # React + Vite web application
agent/     # Optional remote agent service
Dockerfile
docker-compose.yml
```

## Prerequisites

- Node.js 20+
- npm
- PostgreSQL 13+
- Coolify (optional deployment)

## Backend Setup

```bash
cd backend
npm install
npm run prisma:generate
npm run migrate:dev
ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=change-me npm run seed
npm run dev
```

Environment variables can be copied from `.env.example`.

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Set `VITE_API_URL` and `VITE_SOCKET_URL` in `.env` to point to the backend (e.g. `http://localhost:4000/api`).

## Agent Setup (Optional)

Deploy the `agent/` service on remote servers:

```bash
cd agent
npm install
cp .env.example .env  # set AGENT_TOKEN
npm run dev
```

Register the server in the web UI using the agent URL and token. Mark as `Local Server` for the main host to run processes in-panel.

## Running with Docker

```bash
docker compose up --build
```

This builds frontend and backend, attaches PostgreSQL, and exposes port `4000`. Run migrations inside the container:

```bash
docker compose exec app npm --prefix backend run migrate:deploy
docker compose exec app npm --prefix backend run seed
```

## Coolify Deployment

1. Push this repo to your Git provider.
2. In Coolify, create a new “Dockerfile” application pointing to the repo root.
3. Set environment variables:
   - `DATABASE_URL` (pointing to your managed Postgres service or another Coolify service).
   - `JWT_SECRET`, `PORT` (4000).
   - `SOCKET_ORIGIN` (your frontend URL).
4. Add a PostgreSQL service if needed and link connection info.
5. Deploy; Coolify builds using the provided Dockerfile.

## Testing

```bash
npm --prefix backend run test
```

Tests currently cover the process manager lifecycle; extend as business logic grows.

## First Admin User

Use the seed command with `ADMIN_EMAIL` and `ADMIN_PASSWORD` environment variables. Alternatively, after seeding, log in via `/login` to obtain a token and use `POST /api/auth/register` to create additional users.

## Roadmap

- Expand metrics collection (CPU/memory) via `pidusage`.
- Add role-based UI gating and audit log.
- Enhance log retention and search indexing.
