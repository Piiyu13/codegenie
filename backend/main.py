"""
Code Genie — Python backend (FastAPI + Gemini + Postgres auth).

Matches the frontend contract in frontend/src/services/ai.js:
  POST /generate-code    { language, requirement }
  POST /explain-code     { language, code }
  POST /voice-to-code    { transcript, language }
  POST /extract-code     { image, language, fileName }  (image = base64 data URL)
  POST /generate-project { projectType, projectName, technology, description, features }

Auth (see frontend/src/services/auth.js):
  POST /auth/signup          { name, email, password } -> { token, user }
  POST /auth/login           { identifier, password }  -> { token, user }
  GET  /auth/me              (Bearer JWT) -> user
  PATCH /auth/me             { name?, email?, avatar? } -> user
  POST /auth/change-password { currentPassword, newPassword } -> { ok: true }

Run:
  cd backend
  pip install -r requirements.txt
  copy .env.example .env   (then paste GEMINI_API_KEY + JWT_SECRET)
  uvicorn main:app --reload --port 8000

Frontend .env (in frontend/.env):
  VITE_AI_API_BASE_URL=http://localhost:8000
  VITE_AI_API_KEY=          (only if BACKEND_API_KEY is set)
"""

import base64
import json
import os
import re
from contextlib import asynccontextmanager
from typing import Any, List, Optional

from dotenv import load_dotenv
from fastapi import Depends, FastAPI, Header, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sqlalchemy import func, select
from sqlalchemy.orm import Session

load_dotenv()

from auth import (
    create_token,
    get_current_user,
    hash_password,
    public_user,
    verify_password,
    decode_token,
)
from db import get_db, init_db
from models import User

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "").strip()
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.0-flash").strip() or "gemini-2.0-flash"
BACKEND_API_KEY = os.getenv("BACKEND_API_KEY", "").strip()
JWT_SECRET = os.getenv("JWT_SECRET", "").strip()
EXTRA_ORIGINS = [o.strip() for o in os.getenv("EXTRA_CORS_ORIGINS", "").split(",") if o.strip()]

EMAIL_RE = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]{2,}$")


@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        init_db()
    except Exception as exc:
        print(f"WARNING: could not initialise database ({exc}). "
              f"Is Postgres running? See DATABASE_URL in backend/.env.")
    yield


app = FastAPI(title="Code Genie API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:4173",
        "http://127.0.0.1:4173",
        *EXTRA_ORIGINS,
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ------------------------------------------------------------------
# Request auth: BACKEND_API_KEY *or* a valid JWT passes.
# When neither is configured (plain local dev) endpoints stay open.
# ------------------------------------------------------------------

def check_auth(authorization: Optional[str] = Header(None)) -> None:
    token = (
        authorization[7:]
        if authorization and authorization.startswith("Bearer ")
        else None
    )
    if BACKEND_API_KEY and token == BACKEND_API_KEY:
        return
    if token and JWT_SECRET:
        try:
            decode_token(token)
            return
        except HTTPException:
            pass
    if not BACKEND_API_KEY and not JWT_SECRET:
        return  # wide-open local dev
    raise HTTPException(status_code=401, detail="Missing or invalid credentials. Log in again.")


# ------------------------------------------------------------------
# Request models (frontend also sends `model`, so allow extras)
# ------------------------------------------------------------------

class GenerateCodeReq(BaseModel):
    language: str = "Python"
    requirement: str
    model: Optional[str] = None

    class Config:
        extra = "allow"


class ExplainCodeReq(BaseModel):
    language: str = "JavaScript"
    code: str
    model: Optional[str] = None

    class Config:
        extra = "allow"


class VoiceToCodeReq(BaseModel):
    transcript: str
    language: str = "Python"
    model: Optional[str] = None

    class Config:
        extra = "allow"


class ExtractCodeReq(BaseModel):
    image: str = Field(..., description="base64 data URL, e.g. data:image/png;base64,...")
    language: str = "Auto detect"
    fileName: str = "image.png"
    model: Optional[str] = None

    class Config:
        extra = "allow"


class GenerateProjectReq(BaseModel):
    projectType: str = "Web Application"
    projectName: str
    technology: str = ""
    description: str = ""
    features: str = ""
    model: Optional[str] = None

    class Config:
        extra = "allow"


class SignupReq(BaseModel):
    name: str
    email: str
    password: str


class LoginReq(BaseModel):
    identifier: str
    password: str


class UpdateMeReq(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    avatar: Optional[str] = None


class ChangePasswordReq(BaseModel):
    currentPassword: str
    newPassword: str


# ------------------------------------------------------------------
# Gemini helpers
# ------------------------------------------------------------------

_client = None

def get_client():
    global _client
    if not GEMINI_API_KEY:
        return None
    if _client is None:
        from google import genai
        _client = genai.Client(api_key=GEMINI_API_KEY)
    return _client


def call_gemini(prompt: str, image_bytes: Optional[bytes] = None,
                mime_type: str = "image/png") -> str:
    client = get_client()
    if client is None:
        raise HTTPException(
            status_code=503,
            detail="GEMINI_API_KEY is not set on the backend. Add it to backend/.env.",
        )
    try:
        if image_bytes:
            from google.genai import types
            contents = [
                prompt,
                types.Part.from_bytes(data=image_bytes, mime_type=mime_type),
            ]
        else:
            contents = prompt
        resp = client.models.generate_content(model=GEMINI_MODEL, contents=contents)
        return (resp.text or "").strip()
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Gemini request failed: {exc}")


def extract_json(text: str) -> Any:
    """Pull JSON out of a model reply (strips ```json fences)."""
    cleaned = re.sub(r"^```(?:json)?\s*|\s*```$", "", text.strip(), flags=re.DOTALL).strip()
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        pass
    match = re.search(r"(\{.*\}|\[.*\])", cleaned, flags=re.DOTALL)
    if match:
        return json.loads(match.group(1))
    raise HTTPException(status_code=502, detail=f"Gemini returned non-JSON: {text[:200]}")


def slugify(name: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", (name or "my-project").lower().strip())
    return slug.strip("-") or "my-project"


def parse_data_url(data_url: str) -> tuple[bytes, str]:
    m = re.match(r"^data:(.+?);base64,(.+)$", data_url or "", flags=re.DOTALL)
    if not m:
        raise HTTPException(status_code=400, detail="`image` must be a base64 data URL.")
    mime, b64 = m.group(1), m.group(2)
    if len(b64) > 12_000_000:  # ~9MB cap
        raise HTTPException(status_code=413, detail="Image too large (max ~9MB).")
    try:
        return base64.b64decode(b64), mime
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid base64 image data.")


# ------------------------------------------------------------------
# Auth routes
# ------------------------------------------------------------------

def _validate_signup(name: str, email: str, password: str) -> tuple[str, str]:
    clean_name = (name or "").strip()
    clean_email = (email or "").strip().lower()
    if len(clean_name) < 2:
        raise HTTPException(status_code=400, detail="Name must be at least 2 characters.")
    if not EMAIL_RE.match(clean_email):
        raise HTTPException(status_code=400, detail="Enter a valid email address.")
    if len(password or "") < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters.")
    return clean_name, clean_email


@app.post("/auth/signup", status_code=status.HTTP_201_CREATED)
def signup(req: SignupReq, db: Session = Depends(get_db)):
    name, email = _validate_signup(req.name, req.email, req.password)
    existing = db.scalar(select(User).where(User.email == email))
    if existing:
        raise HTTPException(status_code=409, detail="An account with this email already exists.")
    user = User(name=name, email=email, password_hash=hash_password(req.password))
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"token": create_token(user.id), "user": public_user(user)}


@app.post("/auth/login")
def login(req: LoginReq, db: Session = Depends(get_db)):
    identifier = (req.identifier or "").strip()
    if not identifier or not req.password:
        raise HTTPException(status_code=400, detail="Email/username and password are required.")
    if "@" in identifier:
        user = db.scalar(select(User).where(User.email == identifier.lower()))
    else:
        user = db.scalar(
            select(User).where(func.lower(User.name) == identifier.lower()).limit(1)
        )
    if user is None or not verify_password(req.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials. Check your login and password.")
    return {"token": create_token(user.id), "user": public_user(user)}


@app.get("/auth/me")
def me(user: User = Depends(get_current_user)):
    return public_user(user)


@app.patch("/auth/me")
def update_me(req: UpdateMeReq, user: User = Depends(get_current_user),
             db: Session = Depends(get_db)):
    current = db.get(User, user.id)
    if req.name is not None:
        clean = req.name.strip()
        if len(clean) < 2:
            raise HTTPException(status_code=400, detail="Name must be at least 2 characters.")
        current.name = clean
    if req.email is not None:
        clean = req.email.strip().lower()
        if not EMAIL_RE.match(clean):
            raise HTTPException(status_code=400, detail="Enter a valid email address.")
        taken = db.scalar(select(User).where(User.email == clean, User.id != current.id))
        if taken:
            raise HTTPException(status_code=409, detail="An account with this email already exists.")
        current.email = clean
    if req.avatar is not None:
        if len(req.avatar) > 6_000_000:
            raise HTTPException(status_code=413, detail="Avatar image is too large.")
        current.avatar = req.avatar or None
    db.commit()
    db.refresh(current)
    return public_user(current)


@app.post("/auth/change-password")
def change_password(req: ChangePasswordReq, user: User = Depends(get_current_user),
                    db: Session = Depends(get_db)):
    current = db.get(User, user.id)
    if not verify_password(req.currentPassword, current.password_hash):
        raise HTTPException(status_code=401, detail="Current password is incorrect.")
    if len(req.newPassword or "") < 8:
        raise HTTPException(status_code=400, detail="New password must be at least 8 characters.")
    current.password_hash = hash_password(req.newPassword)
    db.commit()
    return {"ok": True}


# ------------------------------------------------------------------
# AI routes
# ------------------------------------------------------------------

@app.get("/")
def root():
    return {
        "name": "Code Genie API",
        "docs": "/docs",
        "health": "/health",
        "demo_mode": not bool(GEMINI_API_KEY),
        "auth_enabled": bool(JWT_SECRET),
    }


@app.get("/health")
def health():
    return {
        "ok": True,
        "model": GEMINI_MODEL,
        "demo_mode": not bool(GEMINI_API_KEY),
        "auth_enabled": bool(JWT_SECRET),
    }


@app.post("/generate-code")
def generate_code(req: GenerateCodeReq, authorization: Optional[str] = Header(None)):
    check_auth(authorization)
    if not req.requirement.strip():
        raise HTTPException(status_code=400, detail="Please describe what you want to build.")
    prompt = f"""You are Code Genie, an expert programmer.
Write complete, runnable {req.language} code for this requirement:
\"\"\"{req.requirement.strip()}\"\"\"

Reply with RAW JSON only (no markdown fences, no commentary):
{{"code": "<full source code as a string>", "explanation": "<one-sentence summary>"}}"""
    data = extract_json(call_gemini(prompt))
    return {
        "code": data.get("code", ""),
        "language": req.language,
        "explanation": data.get("explanation", ""),
        "source": "live",
    }


@app.post("/explain-code")
def explain_code(req: ExplainCodeReq, authorization: Optional[str] = Header(None)):
    check_auth(authorization)
    if not req.code.strip():
        raise HTTPException(status_code=400, detail="Please paste some code to explain.")
    prompt = f"""You are Code Genie, a patient coding tutor.
Explain this {req.language} code in beginner-friendly plain English:

```{req.language}
{req.code}
```

Reply with RAW JSON only, exactly this shape:
{{
  "summary": "<2-4 sentence overview>",
  "steps": [{{"title": "<short>", "detail": "<1-2 sentences>"}}],
  "functions": [{{"name": "<name>", "purpose": "<what it does>"}}],
  "io": {{"inputs": ["<item>"], "outputs": ["<item>"]}},
  "improvements": ["<tip>"]
}}
Give 3-5 steps, list real function names from the code, 2 inputs, 2 outputs, 3-4 improvements."""
    data = extract_json(call_gemini(prompt))
    data["source"] = "live"
    return data


@app.post("/voice-to-code")
def voice_to_code(req: VoiceToCodeReq, authorization: Optional[str] = Header(None)):
    check_auth(authorization)
    if not req.transcript.strip():
        raise HTTPException(status_code=400, detail="No transcript provided.")
    prompt = f"""You are Code Genie, an expert programmer.
The user SPOKE this request (transcribed, may contain speech errors):
\"\"\"{req.transcript.strip()}\"\"\"

Write complete, runnable {req.language} code for it.
Reply with RAW JSON only:
{{"code": "<full source code>"}}"""
    data = extract_json(call_gemini(prompt))
    return {
        "code": data.get("code", ""),
        "language": req.language,
        "transcript": req.transcript.strip(),
        "source": "live",
    }


@app.post("/extract-code")
def extract_code(req: ExtractCodeReq, authorization: Optional[str] = Header(None)):
    check_auth(authorization)
    img_bytes, mime = parse_data_url(req.image)
    target = "auto-detect the language" if req.language == "Auto detect" else f"use {req.language}"
    prompt = f"""You are Code Genie OCR. Transcribe ONLY the source code visible in this image of handwritten/printed notes.
Rules: output runnable code, {target}, fix obvious handwriting ambiguities, no commentary.
Reply with RAW JSON only:
{{"code": "<transcribed source>", "language": "<detected language>", "confidence": <0-1 number>}}"""
    data = extract_json(call_gemini(prompt, image_bytes=img_bytes, mime_type=mime))
    lang = req.language if req.language != "Auto detect" else data.get("language", "Python")
    return {
        "code": data.get("code", ""),
        "language": lang,
        "confidence": float(data.get("confidence", 0.9)),
        "source": "live",
    }


@app.post("/generate-project")
def generate_project(req: GenerateProjectReq, authorization: Optional[str] = Header(None)):
    check_auth(authorization)
    if not req.projectName.strip():
        raise HTTPException(status_code=400, detail="Please give your project a name.")
    slug = slugify(req.projectName)
    prompt = f"""You are Code Genie, a senior software architect.
Scaffold a project with:
- Type: {req.projectType}
- Name: {req.projectName} (folder slug: {slug})
- Technology: {req.technology}
- Description: {req.description}
- Features (one per line):
{req.features}

Reply with RAW JSON only, exactly this shape:
{{
  "structure": "<ascii file tree starting with {slug}/, using ├── └── │ >",
  "files": [{{"path": "<relative path>", "language": "<e.g. JavaScript, Python, JSON, Markdown, Text>", "content": "<full file content>"}}]
}}
Include 3-6 key files (config + entry point + README.md with setup steps). Keep file contents complete but concise."""
    data = extract_json(call_gemini(prompt))
    files: List[dict] = data.get("files", [])
    if not isinstance(files, list) or not files:
        raise HTTPException(status_code=502, detail="Gemini returned no project files.")
    return {
        "structure": data.get("structure", f"{slug}/\n├── README.md"),
        "files": files,
        "slug": slug,
        "source": "live",
    }
