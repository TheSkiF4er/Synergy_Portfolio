"""Input parsing and strict validation."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import date
from typing import Iterable


@dataclass(frozen=True, slots=True)
class ValidationPolicy:
    """Rules for birthdate validation."""

    min_year: int = 1900
    max_year: int | None = None  # defaults to current year
    allow_future_dates: bool = False


class BirthdateValidationError(ValueError):
    """Raised when user input cannot be parsed or does not satisfy validation rules."""


def parse_int(value: str, field: str) -> int:
    """Parse integer with clear error message."""
    value = value.strip()
    if value == "":
        raise BirthdateValidationError(f"Поле '{field}' не должно быть пустым.")
    try:
        return int(value)
    except ValueError as e:
        raise BirthdateValidationError(f"Поле '{field}' должно быть целым числом.") from e


def validate_birthdate(day: int, month: int, year: int, policy: ValidationPolicy | None = None) -> date:
    """Validate a (day, month, year) tuple and return a datetime.date."""
    if policy is None:
        policy = ValidationPolicy()
    today = date.today()
    max_year = policy.max_year if policy.max_year is not None else today.year

    if year < policy.min_year or year > max_year:
        raise BirthdateValidationError(
            f"Год должен быть в диапазоне {policy.min_year}..{max_year}."
        )
    # datetime.date will validate day/month combinations
    try:
        d = date(year, month, day)
    except ValueError as e:
        raise BirthdateValidationError("Некорректная дата.") from e

    if not policy.allow_future_dates and d > today:
        raise BirthdateValidationError("Дата рождения не может быть в будущем.")
    return d


def prompt_with_retries(
    prompt: str,
    field: str,
    *,
    attempts: int = 3,
) -> int:
    """Prompt user for an integer with limited retry attempts.

    Raises BirthdateValidationError after exhausting attempts.
    """
    last_error: Exception | None = None
    for _ in range(attempts):
        raw = input(prompt)
        try:
            return parse_int(raw, field)
        except BirthdateValidationError as e:
            print(f"Ошибка: {e}")
            last_error = e
    raise BirthdateValidationError(f"Слишком много неверных попыток для поля '{field}'.") from last_error
