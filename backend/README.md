# Code Genie — Python Backend (FastAPI + Gemini + Postgres auth)

Exposes the 5 AI endpoints the React frontend (`frontend/src/services/ai.js`)
expects, plus the auth endpoints (`frontend/src/services/auth.js`).

## 1. Setup

```bash
cd backend
pip install -r requirements.txt
copy .env.example .env
# edit .env:
#   GEMINI_API_KEY from https://aistudio.google.com/app/apikey
#   JWT_SECRET     -> run: python -c "import secrets; print(secrets.token_hex(32))"
uvicorn main:app --reload --port 8000
```

Local dev needs Postgres running (or point `DATABASE_URL` at one).
Easiest: `docker compose up db` from the repo root, then run uvicorn locally.
Tables are created automatically on startup. For a quick no-Postgres check:
`DATABASE_URL=sqlite:///./dev.db`.

Check: http://localhost:8000/health and docs at http://localhost:8000/docs

## 2. Connect frontend

In `frontend/.env`:

```bash
VITE_AI_API_BASE_URL=http://localhost:8000
VITE_AI_MODEL=code-genie-default
# only if BACKEND_API_KEY is set in backend/.env:
# VITE_AI_API_KEY=same-value-as-BACKEND_API_KEY
```

Restart `npm run dev`. The "Demo mode" badge disappears once the base URL is set.

## 3. Endpoints

AI (need `BACKEND_API_KEY` **or** a login JWT when auth is configured):

| Method | Path | Body |
|---|---|---|
| POST | `/generate-code` | `{ language, requirement }` |
| POST | `/explain-code` | `{ language, code }` |
| POST | `/voice-to-code` | `{ transcript, language }` |
| POST | `/extract-code` | `{ image (data URL), language, fileName }` |
| POST | `/generate-project` | `{ projectType, projectName, technology, description, features }` |
| GET | `/health` | — |

Auth (Postgres + bcrypt + JWT):

| Method | Path | Body |
|---|---|---|
| POST | `/auth/signup` | `{ name, email, password }` → `{ token, user }` |
| POST | `/auth/login` | `{ identifier, password }` → `{ token, user }` |
| GET | `/auth/me` | Bearer JWT → user |
| PATCH | `/auth/me` | `{ name?, email?, avatar? }` → user |
| POST | `/auth/change-password` | `{ currentPassword, newPassword }` |

Without `GEMINI_API_KEY`, AI endpoints return `503` with a clear message.
Without `JWT_SECRET`, auth endpoints return `500` telling you to set it.
