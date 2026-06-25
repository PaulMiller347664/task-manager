# Task Manager

Full-stack task app: register/login, then create, edit, complete, paginate, and delete
tasks scoped to the signed-in user.

- **Backend:** .NET 10, EF Core, SQLite, JWT
- **Frontend:** React + TypeScript, Vite, MUI, React Query
- **Runtime:** Docker (recommended)

## What I built

- Auth (register/login/logout), JWT in `localStorage` (`auth_token` key)
- Task CRUD, complete/incomplete toggle, pagination, status filter, search
- Per-user data isolation; SQLite persistence via Docker volume
- Backend integration tests (ownership, validation, filter, search)

## Setup

**Prerequisites:** [Docker Desktop](https://www.docker.com/products/docker-desktop/) running.
Optional: GNU Make (`winget install ezwinports.make` on Windows; usually pre-installed on macOS/Linux).

```bash
git clone <repo-url>
cd task-manager
cp .env.example .env   # optional — defaults work for Docker

make up                # full stack
# or: make be (terminal 1) + make fe (terminal 2)
```

Open **http://localhost:3000**. API: **http://localhost:8080/api** (avoids macOS AirPlay on port 5000).

Without Make: `docker compose up --build`

| Command     | Description                    |
|-------------|--------------------------------|
| `make up`   | Full stack                     |
| `make be`   | Backend only (port 8080)       |
| `make fe`   | Frontend only (port 3000)      |
| `make down` | Stop containers                |
| `make test` | Backend integration tests      |

Data persists in the `sqlite-data` Docker volume. Migrations run on backend startup.

### Local dev (no Docker)

```bash
# Backend
cd backend && dotnet run --project TaskManager.Api

# Frontend
cd frontend && npm install && cp .env.example .env && npm run dev

# Tests
cd backend && dotnet test
```

### Configuration

Copy `.env.example` to `.env`. Key vars: `JWT_KEY`, `VITE_API_URL`, `CORS_ALLOWED_ORIGINS`, `DB_PATH`, `DB_NAME`.

---

## Assumptions

- Single-region deployment; dates stored in UTC, displayed in local time.
- `localStorage` JWT is acceptable for this exercise (simplicity over httpOnly cookies).
- Email is the user identifier; no verification flow.
- Tasks ordered by `Id` descending (newest first).

## Tradeoffs

- **JWT in localStorage** — simple, but more XSS-exposed than httpOnly cookies.
- **SQLite** — easy setup and persistence; not for high-concurrency multi-instance use.
- **Cache invalidation** over optimistic updates — simpler, always server-consistent.
- **404 for cross-user access** — avoids leaking whether another user's task exists.

## Future work

With more time:

**Product**
- Sort by due date (null-due last), overdue highlighting
- Soft deletes
- SSO
- More validation around registration/passwords

**Quality & ops**
- Frontend E2E tests (Playwright); CI/CD
- Logging/telemetry
- Graceful error handling when the API is unavailable

**Platform**
- Azure App Service, Container Registry, cloud deployment

**Scalability**
- Database sharding
- Horizontal scale behind a load balancer/gateway
- Move from SQLite to SQL Server or Postgres
- Pub/sub (Azure Service Bus)
- Elasticsearch for richer full-text search
- Refresh tokens, httpOnly cookies, secret management, rate limiting, email verification
