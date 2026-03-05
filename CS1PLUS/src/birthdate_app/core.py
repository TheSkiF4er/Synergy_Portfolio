"""Core domain logic.

This module contains pure functions/classes for:
- weekday name lookup (ru)
- leap year detection
- age calculation
- ASCII-art digit rendering for dates
"""

from __future__ import annotations

from dataclasses import dataclass
from datetime import date

WEEKDAYS_RU: list[str] = [
    "Понедельник",
    "Вторник",
    "Среда",
    "Четверг",
    "Пятница",
    "Суббота",
    "Воскресенье",
]


def is_leap_year(year: int) -> bool:
    """Return True if *year* is a leap year in the Gregorian calendar."""
    return year % 4 == 0 and (year % 100 != 0 or year % 400 == 0)


def weekday_ru(d: date) -> str:
    """Return weekday name in Russian for a given date."""
    return WEEKDAYS_RU[d.weekday()]


def calculate_age(birth_date: date, today: date | None = None) -> int:
    """Calculate full years since *birth_date* as of *today* (defaults to current date)."""
    if today is None:
        today = date.today()
    age = today.year - birth_date.year
    if (today.month, today.day) < (birth_date.month, birth_date.day):
        age -= 1
    return age


def digit_patterns() -> dict[str, list[str]]:
    """Return 5-row ASCII patterns for digits and space."""
    return {
        "0": [" *** ", "*   *", "*   *", "*   *", " *** "],
        "1": ["  *  ", " **  ", "  *  ", "  *  ", " *** "],
        "2": [" *** ", "*   *", "   * ", "  *  ", "*****"],
        "3": [" *** ", "    *", " *** ", "    *", " *** "],
        "4": ["*   *", "*   *", "*****", "    *", "    *"],
        "5": ["*****", "*    ", "**** ", "    *", "**** "],
        "6": [" *** ", "*    ", "**** ", "*   *", " *** "],
        "7": ["*****", "    *", "   * ", "  *  ", " *   "],
        "8": [" *** ", "*   *", " *** ", "*   *", " *** "],
        "9": [" *** ", "*   *", " ****", "    *", " *** "],
        " ": ["     ", "     ", "     ", "     ", "     "],
    }


def render_styled_date(d: date) -> str:
    """Render date as a multi-line string in ASCII-art.

    Format: 'DD MM YYYY' (spaces between parts) using 5-row patterns.
    """
    date_str = f"{d.day:02d} {d.month:02d} {d.year}"
    patterns = digit_patterns()
    lines: list[str] = []
    for row in range(5):
        line = ""
        for ch in date_str:
            if ch not in patterns:
                raise ValueError(f"Unsupported character in date string: {ch!r}")
            line += patterns[ch][row] + "  "
        lines.append(line.rstrip())
    return "\n".join(lines)


@dataclass(frozen=True, slots=True)
class BirthdateResult:
    """Computed information about a birthdate."""

    birth_date: date
    weekday_ru: str
    is_leap_year: bool
    age_years: int
    styled_date: str


def analyze_birthdate(birth_date: date, today: date | None = None) -> BirthdateResult:
    """Compute weekday, leap-year flag, age, and ASCII-art for *birth_date*."""
    wd = weekday_ru(birth_date)
    leap = is_leap_year(birth_date.year)
    age = calculate_age(birth_date, today=today)
    styled = render_styled_date(birth_date)
    return BirthdateResult(
        birth_date=birth_date,
        weekday_ru=wd,
        is_leap_year=leap,
        age_years=age,
        styled_date=styled,
    )
