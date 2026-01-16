# Publishing House Application

## Deployment Instructions

This application supports two running modes: **Development** and **Production**.
It uses Docker Compose to orchestrate the services (Frontend: Next.js, Backend: Django, Database: PostgreSQL).

### Prerequisites
- Docker & Docker Compose installed.

### 1. Configuration
Create a `.env` file in the root directory if it doesn't exist (copy from example or template if available).
Required variables:
- `DATABASE_NAME`, `DATABASE_USERNAME`, `DATABASE_PASSWORD`, `DATABASE_HOST`, `DATABASE_PORT`
- `DJANGO_SECRET_KEY`, `DEBUG` (overridden by compose), `DJANGO_ALLOWED_HOSTS`

### 2. Running in Development Mode
This is the default mode. It enables:
- Hot-reloading for Frontend and Backend.
- Fixture loading (dummy data) by default.
- Debug mode enabled.

**Command:**
```bash
docker compose up --build
```

**Features:**
- Frontend available at `http://localhost:3000`
- Backend API available at `http://localhost:8000`
- Source code is mounted into containers; changes reflect immediately.
- **Fixtures:** To skip loading fixtures in dev mode, set `LOAD_FIXTURES=false` in `docker-compose.override.yml` or your `.env`.

### 3. Running in Production Mode
This mode is optimized for performance and security.
- No hot-reloading (code is built into images).
- Fixtures are **NOT** loaded by default.
- Debug mode disabled.

**Command:**
```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d
```

**Features:**
- Frontend built for production (`npm run start`).
- Backend runs with `DEBUG=False`.
- **Fixtures:** To force load fixtures in prod (use with caution), set `LOAD_FIXTURES=true` environment variable.

### 4. Fixture Loading Logic
The backend entrypoint (`backend/entrypoint.sh`) checks the `LOAD_FIXTURES` environment variable.
- `true`: Loads `users_data.json`, `magazines_data.json`, `papers_data.json`.
- `false` (or unset in prod): Skips loading fixtures.

### 5. Admin Account Setup
The `setup_users` command runs automatically on startup. You can customize the superuser credentials via environment variables:
- `DJANGO_SUPERUSER_USERNAME` (default: `admin`)
- `DJANGO_SUPERUSER_EMAIL` (default: `admin@example.com`)
- `DJANGO_SUPERUSER_PASSWORD` (default: `adminPassword`)

Add these to your `.env` file or `docker-compose.prod.yml` environment section to secure your production instance.

### Troubleshooting
- **Database Connection**: Ensure the `db` service is healthy.
- **Migrations**: Migrations are applied automatically on startup.
