"""Tkinter GUI."""

from __future__ import annotations

import logging
import tkinter as tk
from tkinter import messagebox, ttk
from datetime import date
from pathlib import Path

from .core import analyze_birthdate
from .history import add_entry, DEFAULT_DB_PATH
from .validation import BirthdateValidationError, validate_birthdate, ValidationPolicy

log = logging.getLogger(__name__)


def launch_gui() -> None:
    policy = ValidationPolicy()

    root = tk.Tk()
    root.title("Birthdate App")

    frm = ttk.Frame(root, padding=12)
    frm.grid(row=0, column=0, sticky="nsew")

    ttk.Label(frm, text="День").grid(row=0, column=0, sticky="w")
    day_var = tk.StringVar()
    ttk.Entry(frm, textvariable=day_var, width=10).grid(row=0, column=1, sticky="w")

    ttk.Label(frm, text="Месяц").grid(row=1, column=0, sticky="w")
    month_var = tk.StringVar()
    ttk.Entry(frm, textvariable=month_var, width=10).grid(row=1, column=1, sticky="w")

    ttk.Label(frm, text="Год").grid(row=2, column=0, sticky="w")
    year_var = tk.StringVar()
    ttk.Entry(frm, textvariable=year_var, width=10).grid(row=2, column=1, sticky="w")

    ttk.Label(frm, text="Пользователь").grid(row=3, column=0, sticky="w")
    user_var = tk.StringVar(value="anonymous")
    ttk.Entry(frm, textvariable=user_var, width=24).grid(row=3, column=1, sticky="w")

    save_var = tk.BooleanVar(value=True)
    ttk.Checkbutton(frm, text="Сохранять в историю", variable=save_var).grid(row=4, column=0, columnspan=2, sticky="w")

    out = tk.Text(frm, width=60, height=18)
    out.grid(row=6, column=0, columnspan=2, pady=(10, 0), sticky="nsew")

    def on_calc() -> None:
        try:
            day = int(day_var.get())
            month = int(month_var.get())
            year = int(year_var.get())
            birth_date = validate_birthdate(day, month, year, policy=policy)
            res = analyze_birthdate(birth_date)

            out.delete("1.0", tk.END)
            out.insert(tk.END, f"Дата: {res.birth_date.isoformat()}\n")
            out.insert(tk.END, f"День недели: {res.weekday_ru}\n")
            out.insert(tk.END, f"Високосный год: {'Да' if res.is_leap_year else 'Нет'}\n")
            out.insert(tk.END, f"Возраст: {res.age_years} лет\n\n")
            out.insert(tk.END, "ASCII-art:\n")
            out.insert(tk.END, res.styled_date + "\n")

            if save_var.get():
                add_entry(user_var.get().strip() or "anonymous", birth_date, db_path=DEFAULT_DB_PATH)
        except BirthdateValidationError as e:
            messagebox.showerror("Ошибка", str(e))
        except Exception as e:
            log.exception("Unexpected error")
            messagebox.showerror("Ошибка", str(e))

    ttk.Button(frm, text="Рассчитать", command=on_calc).grid(row=5, column=0, pady=(8, 0), sticky="w")
    ttk.Button(frm, text="Выход", command=root.destroy).grid(row=5, column=1, pady=(8, 0), sticky="e")

    root.mainloop()
