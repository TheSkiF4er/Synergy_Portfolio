"""History storage (SQLite).

CLI and GUI can optionally persist user queries to a local SQLite DB.
Web (Django) has its own history model in the web/ folder.
"""

from __future__ import annotations

import sqlite3
from dataclasses import dataclass
from datetime import datetime, date
from pathlib import Path
from typing import Iterable

DEFAULT_DB_PATH = Path.home() / ".birthdate_app" / "history.sqlite3"


@dataclass(frozen=True, slots=True)
class HistoryEntry:
    id: int
    user: str
    birth_date: date
    created_at: datetime


def _ensure_parent(path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)


def init_db(db_path: Path = DEFAULT_DB_PATH) -> None:
    """Create DB and tables if they don't exist."""
    _ensure_parent(db_path)
    with sqlite3.connect(db_path) as con:
        con.execute(
            """
            CREATE TABLE IF NOT EXISTS history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user TEXT NOT NULL,
                birth_date TEXT NOT NULL,
                created_at TEXT NOT NULL
            );
            """
        )
        con.commit()


def add_entry(user: str, birth_date: date, db_path: Path = DEFAULT_DB_PATH) -> int:
    """Insert entry and return new row id."""
    init_db(db_path)
    with sqlite3.connect(db_path) as con:
        cur = con.execute(
            "INSERT INTO history(user, birth_date, created_at) VALUES (?, ?, ?)",
            (user, birth_date.isoformat(), datetime.utcnow().isoformat()),
        )
        con.commit()
        return int(cur.lastrowid)


def list_entries(user: str | None = None, limit: int = 50, db_path: Path = DEFAULT_DB_PATH) -> list[HistoryEntry]:
    """List recent history entries."""
    init_db(db_path)
    q = "SELECT id, user, birth_date, created_at FROM history"
    params: list[object] = []
    if user:
        q += " WHERE user = ?"
        params.append(user)
    q += " ORDER BY id DESC LIMIT ?"
    params.append(limit)

    entries: list[HistoryEntry] = []
    with sqlite3.connect(db_path) as con:
        for row in con.execute(q, params):
            _id, _user, birth_date_s, created_s = row
            entries.append(
                HistoryEntry(
                    id=int(_id),
                    user=str(_user),
                    birth_date=date.fromisoformat(birth_date_s),
                    created_at=datetime.fromisoformat(created_s),
                )
            )
    return entries
