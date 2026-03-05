"""Command-line interface (argparse) with batch processing and history."""

from __future__ import annotations

import argparse
import csv
import json
import logging
from dataclasses import asdict
from datetime import date
from pathlib import Path
from typing import Iterable, Any

from .core import analyze_birthdate
from .history import add_entry, list_entries, DEFAULT_DB_PATH
from .logging_config import configure_logging
from .validation import (
    BirthdateValidationError,
    ValidationPolicy,
    prompt_with_retries,
    validate_birthdate,
    parse_int,
)

log = logging.getLogger(__name__)


def _print_result(result) -> None:
    print("\nРезультаты:")
    print(f"Дата рождения: {result.birth_date.isoformat()}")
    print(f"День недели: {result.weekday_ru}")
    print(f"Високосный год: {'Да' if result.is_leap_year else 'Нет'}")
    print(f"Возраст: {result.age_years} лет")
    print("\nДата рождения в стилизованном виде:")
    print(result.styled_date)


def _load_batch(path: Path) -> list[dict[str, Any]]:
    if path.suffix.lower() == ".json":
        data = json.loads(path.read_text(encoding="utf-8"))
        if not isinstance(data, list):
            raise ValueError("JSON должен быть списком объектов.")
        return [dict(x) for x in data]
    if path.suffix.lower() == ".csv":
        with path.open("r", encoding="utf-8", newline="") as f:
            reader = csv.DictReader(f)
            return [dict(r) for r in reader]
    raise ValueError("Поддерживаются только .csv и .json для пакетной обработки.")


def _batch_process(records: list[dict[str, Any]], policy: ValidationPolicy, save_user: str | None, db_path: Path) -> list[dict[str, Any]]:
    out: list[dict[str, Any]] = []
    for idx, rec in enumerate(records, start=1):
        try:
            day = parse_int(str(rec.get("day", "")), "day")
            month = parse_int(str(rec.get("month", "")), "month")
            year = parse_int(str(rec.get("year", "")), "year")
            birth_date = validate_birthdate(day, month, year, policy=policy)
            res = analyze_birthdate(birth_date)
            payload = {
                "index": idx,
                "user": str(rec.get("user") or save_user or "anonymous"),
                **asdict(res),
            }
            # dataclass contains date; convert
            payload["birth_date"] = res.birth_date.isoformat()
            out.append(payload)
            if save_user:
                add_entry(save_user, birth_date, db_path=db_path)
        except Exception as e:
            out.append({"index": idx, "error": str(e), "raw": rec})
    return out


def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(prog="birthdate", description="Birthdate utility (CLI/GUI/Web).")

    sub = p.add_subparsers(dest="cmd", required=False)

    run = sub.add_parser("run", help="Run interactively or from arguments")
    run.add_argument("--day", type=int, help="Day of month (1-31)")
    run.add_argument("--month", type=int, help="Month (1-12)")
    run.add_argument("--year", type=int, help="Year (e.g. 1990)")
    run.add_argument("--user", default="anonymous", help="User identifier for history")
    run.add_argument("--save-history", action="store_true", help="Save query to SQLite history")
    run.add_argument("--db", type=Path, default=DEFAULT_DB_PATH, help="Path to history DB")
    run.add_argument("--log-level", default="INFO", help="Logging level (DEBUG/INFO/WARNING/ERROR)")

    batch = sub.add_parser("batch", help="Batch process input CSV/JSON")
    batch.add_argument("path", type=Path, help="Input .csv or .json with fields day,month,year,(user)")
    batch.add_argument("--out", type=Path, help="Output file (.json). If omitted prints to stdout")
    batch.add_argument("--user", default=None, help="Fallback user value")
    batch.add_argument("--save-history", action="store_true", help="Save each record to history (uses --user)")
    batch.add_argument("--db", type=Path, default=DEFAULT_DB_PATH, help="Path to history DB")
    batch.add_argument("--log-level", default="INFO", help="Logging level")

    hist = sub.add_parser("history", help="Show saved history")
    hist.add_argument("--user", default=None, help="Filter by user")
    hist.add_argument("--limit", type=int, default=20, help="Number of entries")
    hist.add_argument("--db", type=Path, default=DEFAULT_DB_PATH, help="Path to history DB")
    hist.add_argument("--log-level", default="INFO", help="Logging level")

    gui = sub.add_parser("gui", help="Launch GUI (Tkinter)")

    web = sub.add_parser("web", help="Run Django dev server")

    return p


def cmd_run(args: argparse.Namespace) -> int:
    configure_logging(args.log_level)
    policy = ValidationPolicy()
    try:
        if args.day is None or args.month is None or args.year is None:
            print("Интерактивный режим (до 3 попыток на поле).\n")
            day = prompt_with_retries("Введите день рождения: ", "day")
            month = prompt_with_retries("Введите месяц рождения: ", "month")
            year = prompt_with_retries("Введите год рождения: ", "year")
        else:
            day, month, year = args.day, args.month, args.year

        birth_date = validate_birthdate(day, month, year, policy=policy)
        res = analyze_birthdate(birth_date)
        _print_result(res)

        if args.save_history:
            add_entry(args.user, birth_date, db_path=args.db)
            print(f"\nСохранено в историю: {args.db}")
        return 0
    except BirthdateValidationError as e:
        log.error("Validation error: %s", e)
        print(f"Ошибка: {e}")
        return 2


def cmd_batch(args: argparse.Namespace) -> int:
    configure_logging(args.log_level)
    policy = ValidationPolicy()
    records = _load_batch(args.path)
    save_user = args.user if args.save_history else None
    payload = _batch_process(records, policy=policy, save_user=save_user, db_path=args.db)

    if args.out:
        args.out.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
        print(f"Готово: {args.out}")
    else:
        print(json.dumps(payload, ensure_ascii=False, indent=2))
    return 0


def cmd_history(args: argparse.Namespace) -> int:
    configure_logging(args.log_level)
    entries = list_entries(user=args.user, limit=args.limit, db_path=args.db)
    if not entries:
        print("История пуста.")
        return 0
    for e in entries:
        print(f"#{e.id} | {e.user} | {e.birth_date.isoformat()} | {e.created_at.isoformat()}Z")
    return 0


def cmd_gui(_: argparse.Namespace) -> int:
    from .gui import launch_gui
    launch_gui()
    return 0


def cmd_web(_: argparse.Namespace) -> int:
    import subprocess, sys
    # Run Django dev server
    web_dir = Path(__file__).resolve().parents[2] / "web"
    manage = web_dir / "manage.py"
    subprocess.run([sys.executable, str(manage), "runserver", "0.0.0.0:8000"], cwd=str(web_dir))
    return 0


def main(argv: list[str] | None = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)

    if args.cmd in (None, "run"):
        return cmd_run(args)
    if args.cmd == "batch":
        return cmd_batch(args)
    if args.cmd == "history":
        return cmd_history(args)
    if args.cmd == "gui":
        return cmd_gui(args)
    if args.cmd == "web":
        return cmd_web(args)

    parser.print_help()
    return 1
