# -*- coding: utf-8 -*-
"""Кредиты, тарифы, наценка. 1 ₽ для клиента = 10 кредитов.
Картинки/видео ×4 к себестоимости, текст ×8."""
from __future__ import annotations

import hashlib
import json
import secrets
import sqlite3
from datetime import datetime
from pathlib import Path

CREDITS_PER_RUB = 10
IMAGE_MARKUP = 4
TEXT_MARKUP = 8
VIDEO_MARKUP = 4

# Себестоимость ₽ → кредиты клиента
def image_credits(cost_rub: float) -> int:
    return max(1, int(round(cost_rub * IMAGE_MARKUP * CREDITS_PER_RUB)))


def text_credits(cost_rub: float) -> int:
    return max(1, int(round(cost_rub * TEXT_MARKUP * CREDITS_PER_RUB)))


def video_credits(cost_rub: float) -> int:
    return max(1, int(round(cost_rub * VIDEO_MARKUP * CREDITS_PER_RUB)))


# Оценка себестоимости DeepSeek на одно сообщение директора
DEEPSEEK_MSG_RUB = 0.5
TEXT_MESSAGE_CREDITS = text_credits(DEEPSEEK_MSG_RUB)  # 40

# Себестоимость моделей GenAPI (₽), как на сайте
GENAPI_IMAGE_COST = {
    ("flux", "Schnell"): 0.5,
    ("flux", "Dev"): 4.5,
    ("flux", "PRO v1.1"): 7.2,
    ("flux", "PRO"): 9.0,
    ("flux", "ultra"): 13.0,
    ("gpt-image-2-5", "flare"): 17.5,
    ("gpt-image-2-5", "sunburst"): 27.5,
}

GENAPI_VIDEO_COST = {
    "kling": 80.0,
    "minimax-video": 60.0,
    "runway": 90.0,
}

TARIFFS = [
    {
        "id": "trial",
        "name": "Пробный",
        "credits": 1000,
        "price_rub": 99,
        "days": 14,
        "desc": "Знакомство: ~5 простых картинок или ~25 текстовых сообщений.",
    },
    {
        "id": "start",
        "name": "Старт",
        "credits": 5000,
        "price_rub": 500,
        "days": 30,
        "desc": "Для регулярных статей и обложек. ~25 простых картинок.",
    },
    {
        "id": "business",
        "name": "Бизнес",
        "credits": 20000,
        "price_rub": 1800,
        "days": 30,
        "desc": "Скидка ~10%. Команда контента, много визуала.",
    },
    {
        "id": "pro",
        "name": "Профи",
        "credits": 60000,
        "price_rub": 4800,
        "days": 30,
        "desc": "Агентство: статьи, фото, запас на видео.",
    },
]


def hash_password(password: str, salt: str | None = None) -> tuple[str, str]:
    salt = salt or secrets.token_hex(16)
    digest = hashlib.sha256((salt + password).encode("utf-8")).hexdigest()
    return salt, digest


def check_password(password: str, salt: str, digest: str) -> bool:
    return hash_password(password, salt)[1] == digest


class BillingDB:
    def __init__(self, path: Path):
        self.path = path
        self.path.parent.mkdir(parents=True, exist_ok=True)
        self._init()

    def _conn(self):
        conn = sqlite3.connect(self.path)
        conn.row_factory = sqlite3.Row
        return conn

    def _init(self) -> None:
        with self._conn() as conn:
            conn.executescript(
                """
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    email TEXT UNIQUE NOT NULL,
                    salt TEXT NOT NULL,
                    password TEXT NOT NULL,
                    credits INTEGER NOT NULL DEFAULT 0,
                    created_at TEXT NOT NULL
                );
                CREATE TABLE IF NOT EXISTS ledger (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL,
                    delta INTEGER NOT NULL,
                    reason TEXT NOT NULL,
                    meta TEXT,
                    created_at TEXT NOT NULL
                );
                CREATE TABLE IF NOT EXISTS payments (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL,
                    tariff_id TEXT NOT NULL,
                    amount_rub INTEGER NOT NULL,
                    credits INTEGER NOT NULL,
                    yookassa_id TEXT,
                    status TEXT NOT NULL,
                    created_at TEXT NOT NULL
                );
                """
            )

    def register(self, email: str, password: str) -> dict:
        email = email.strip().lower()
        if "@" not in email or len(password) < 6:
            raise ValueError("Укажите email и пароль не короче 6 символов")
        salt, digest = hash_password(password)
        now = datetime.now().isoformat(timespec="seconds")
        with self._conn() as conn:
            try:
                cur = conn.execute(
                    "INSERT INTO users(email, salt, password, credits, created_at) VALUES(?,?,?,?,?)",
                    (email, salt, digest, 0, now),
                )
            except sqlite3.IntegrityError as exc:
                raise ValueError("Такой email уже зарегистрирован") from exc
            uid = cur.lastrowid
        return {"id": uid, "email": email, "credits": 0}

    def login(self, email: str, password: str) -> dict:
        email = email.strip().lower()
        with self._conn() as conn:
            row = conn.execute("SELECT * FROM users WHERE email=?", (email,)).fetchone()
        if not row or not check_password(password, row["salt"], row["password"]):
            raise ValueError("Неверный email или пароль")
        return {"id": row["id"], "email": row["email"], "credits": row["credits"]}

    def get_user(self, user_id: int) -> dict | None:
        with self._conn() as conn:
            row = conn.execute("SELECT * FROM users WHERE id=?", (user_id,)).fetchone()
        if not row:
            return None
        return {"id": row["id"], "email": row["email"], "credits": row["credits"]}

    def balance(self, user_id: int) -> int:
        user = self.get_user(user_id)
        return int(user["credits"]) if user else 0

    def add_credits(self, user_id: int, amount: int, reason: str, meta: dict | None = None) -> int:
        if amount == 0:
            return self.balance(user_id)
        now = datetime.now().isoformat(timespec="seconds")
        with self._conn() as conn:
            conn.execute(
                "UPDATE users SET credits = credits + ? WHERE id=?",
                (amount, user_id),
            )
            conn.execute(
                "INSERT INTO ledger(user_id, delta, reason, meta, created_at) VALUES(?,?,?,?,?)",
                (user_id, amount, reason, json.dumps(meta or {}, ensure_ascii=False), now),
            )
            row = conn.execute("SELECT credits FROM users WHERE id=?", (user_id,)).fetchone()
        return int(row["credits"]) if row else 0

    def charge(self, user_id: int, amount: int, reason: str, meta: dict | None = None) -> int:
        if amount <= 0:
            return self.balance(user_id)
        bal = self.balance(user_id)
        if bal < amount:
            raise ValueError(
                f"Недостаточно кредитов: нужно {amount}, на счёте {bal}. Пополните тариф."
            )
        return self.add_credits(user_id, -amount, reason, meta)

    def create_payment(self, user_id: int, tariff: dict, yookassa_id: str = "") -> int:
        now = datetime.now().isoformat(timespec="seconds")
        with self._conn() as conn:
            cur = conn.execute(
                """INSERT INTO payments(user_id, tariff_id, amount_rub, credits, yookassa_id, status, created_at)
                   VALUES(?,?,?,?,?,?,?)""",
                (
                    user_id,
                    tariff["id"],
                    tariff["price_rub"],
                    tariff["credits"],
                    yookassa_id,
                    "pending",
                    now,
                ),
            )
            return int(cur.lastrowid)

    def complete_payment(self, payment_id: int) -> None:
        with self._conn() as conn:
            row = conn.execute("SELECT * FROM payments WHERE id=?", (payment_id,)).fetchone()
            if not row or row["status"] == "paid":
                return
            conn.execute("UPDATE payments SET status='paid' WHERE id=?", (payment_id,))
        self.add_credits(
            row["user_id"],
            row["credits"],
            f"Оплата тарифа {row['tariff_id']}",
            {"payment_id": payment_id},
        )
