# Code Genie (monorepo)

> **Turn Your Ideas Into Code** — an AI-powered developer assistant.

```
codegenie/
├── backend/    # FastAPI + Gemini + Postgres/JWT auth (see backend/README.md)
├── frontend/   # React 18 + Vite app (see frontend/README.md)
├── docker-compose.yml   # db (Postgres) + backend + frontend
└── .gitignore
```

## Run with Docker

```bash
# 1. Backend env (add your Gemini key + a JWT secret)
copy backend\.env.example backend\.env
# GEMINI_API_KEY=...
# JWT_SECRET=...  (generate: python -c "import secrets; print(secrets.token_hex(32))")

# 2. Start everything (Postgres + backend + frontend)
docker compose up --build
```

- Frontend: http://localhost:5173
- Backend: http://localhost:8000 (`/health`, `/docs`)

The browser calls the backend directly, so `VITE_AI_API_BASE_URL=http://localhost:8000`
is set on the `frontend` service in `docker-compose.yml`.

## Run locally (no Docker)

```bash
# Postgres first (or point DATABASE_URL at your own instance)
docker compose up db

# Backend
cd backend
pip install -r requirements.txt
copy .env.example .env   # paste GEMINI_API_KEY + JWT_SECRET
uvicorn main:app --reload --port 8000

# Frontend (new terminal)
cd frontend
npm install
npm run dev              # http://localhost:5173
```

Set `VITE_AI_API_BASE_URL=http://localhost:8000` in `frontend/.env`
(or leave it empty for offline demo mode).

> Login/signup always use the backend (Postgres + JWT) — no fake accounts.
> Keep `docker compose up db` and the backend running, otherwise auth
> requests fail.
