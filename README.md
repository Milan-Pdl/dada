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
   web: uvicorn app.main:app --host 0.0.0.0 --port $PORT
   ```

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

