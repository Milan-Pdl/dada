# NepLaunch

Three-sided intelligent platform connecting Nepal's founders, investors, and talent.

## Quick Start

### Backend (FastAPI)

```bash
cd neplaunch/backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt

# Seed demo data
python seed.py

# Run server
uvicorn app.main:app --reload --port 8000
```

### Frontend (React + Vite)

```bash
cd neplaunch/frontend
npm install
npm run dev
```

Open http://localhost:5173

### Demo Accounts (password: `password123`)

| Role     | Email              |
|----------|--------------------|
| Founder  | aarav@example.com  |
| Talent   | suman@example.com  |
| Investor | rajesh@example.com |

### AI Features

Set `OPENAI_API_KEY` in `backend/.env` to enable:
- Semantic embedding matching (40% of match score)
- AI Pitch Co-Pilot feedback
- Team Gap Analysis

Without the key, the platform uses skill-overlap matching and mock AI responses.

---

## Deployment

This repository is ready for deployment on platforms like **Railway**, **Heroku**, or any Python-compatible host.

1. **Procfile**

   A `Procfile` at the project root starts the FastAPI app:

   ```text
   web: sh -c "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"
   ```

   Using a shell wrapper ensures `$PORT` is expanded (and defaults to 8000 when
   undefined), which prevents errors during buildpack detection or container
   startup.

   Alternatively, a `Dockerfile` is included for custom container builds. The
   image installs dependencies from `backend/requirements.txt` and copies the
   backend code under `/app/backend`. The container command uses a shell so the
   `$PORT` environment variable is correctly expanded at runtime:

   ```dockerfile
   CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port $PORT"]
   ```


2. **Environment variables**

   Copy `.env.example` to `.env` (or set values in your provider):
   ```text
   DATABASE_URL=<your database url>
   SECRET_KEY=<random secret>
   OPENAI_API_KEY=<optional for AI features>
   ACCESS_TOKEN_EXPIRE_MINUTES=1440
   ```

   Railway (or other hosts) will expose `$PORT` automatically.

   > **Serverless note:** the default SQLite URL points at `./neplaunch.db`,
   > which fails on Vercel/AWS Lambda because the filesystem is read‑only. The
   > application now automatically switches to an in‑memory database when it
   > detects a serverless environment, but that database is ephemeral. For any
   > real deployment you should set `DATABASE_URL` to a managed service such as
   > PostgreSQL or MySQL. If you must use SQLite, configure it to write under
   > `/tmp` on platforms that allow it (e.g. `sqlite:////tmp/neplaunch.db`).

3. **Database**

   By default the app uses SQLite. For production, configure `DATABASE_URL` to
   a hosted Postgres/MySQL instance and run Alembic migrations:
   ```bash
   alembic upgrade head
   ```

4. **Frontend**

   Build the Vite/React app separately and serve it from a static host or
   integrate with the backend using a reverse proxy.

Once the service is running, verify with `GET /api/health` returning `{ "status": "ok" }`.

Feel free to consult the [Quick Start](#quick-start) section for local
development.

### Vercel-specific notes

Deploying as a serverless function on Vercel can be tricky because the backend
lives under `backend/app`. We include a minimal wrapper and configuration to
make it work:

* `api/index.py` adds `backend` to `sys.path` and imports the FastAPI `app`.
* `vercel.json` forces the Python runtime and routes all requests to the
  function.

If your function continues to crash (FUNCTION_INVOCATION_FAILED), the usual
culprits are missing path adjustments or hitting execution time/memory limits.
In many cases it’s easier to deploy the whole project as a container (see the
Dockerfile) or use another host such as Railway/Heroku instead.


