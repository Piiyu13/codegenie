"""Postgres engine + session. Falls back to SQLite when DATABASE_URL is sqlite."""

import os

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker


def _database_url() -> str:
    url = os.getenv("DATABASE_URL", "").strip()
    if not url:
        user = os.getenv("POSTGRES_USER", "codegenie")
        pw = os.getenv("POSTGRES_PASSWORD", "codegenie")
        db = os.getenv("POSTGRES_DB", "codegenie")
        host = os.getenv("POSTGRES_HOST", "localhost")
        port = os.getenv("POSTGRES_PORT", "5432")
        url = f"postgresql+psycopg://{user}:{pw}@{host}:{port}/{db}"
    if url.startswith("postgresql://"):
        url = url.replace("postgresql://", "postgresql+psycopg://", 1)
    return url


DATABASE_URL = _database_url()

_connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(DATABASE_URL, pool_pre_ping=True, connect_args=_connect_args)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


class Base(DeclarativeBase):
    pass


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db() -> None:
    from models import User  # noqa: F401 — register tables before create_all

    Base.metadata.create_all(bind=engine)
