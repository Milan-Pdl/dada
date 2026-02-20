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
