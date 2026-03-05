"""Logging configuration helpers."""

from __future__ import annotations

import logging
import os


def configure_logging(level: str = "INFO") -> None:
    """Configure application-wide logging."""
    numeric = getattr(logging, level.upper(), logging.INFO)
    logging.basicConfig(
        level=numeric,
        format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
    )
