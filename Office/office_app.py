# -*- coding: utf-8 -*-
"""
AI Office — мульти-чаты, контекстный диалог, орбита агентов,
предпросмотр статей, GitHub и проверка Vercel.

Полная версия с публикацией в BlogPage.tsx + BlogArticle.tsx
и нормализацией категорий сайта.

Логика директора: пользователь говорит только директору;
директор ставит ТЗ агенту, принимает работу и сверяет с запросом.
"""

from __future__ import annotations

import asyncio
import base64
import html as htmlmod
import ipaddress
import json
import math
import mimetypes
import os
import re
import socket
import ssl
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime
from pathlib import Path

from nicegui import ui

from billing import (
    BillingDB,
    TARIFFS,
    TEXT_MESSAGE_CREDITS,
    GENAPI_IMAGE_COST,
    GENAPI_VIDEO_COST,
    image_credits,
    video_credits,
)
from yookassa_pay import create_yookassa_payment


# ============================================================
# ПУТИ
# ============================================================

if getattr(sys, "frozen", False):
    APP_DIR = Path(sys.executable).resolve().parent
else:
    APP_DIR = Path(__file__).resolve().parent

STATE_FILE = APP_DIR / "office_state.json"
MEMORY_FILE = APP_DIR / "office_memory.json"
CONFIG_FILE = APP_DIR / "config.json"

WORKSPACE = APP_DIR / "workspace"
DRAFTS_DIR = WORKSPACE / "drafts"
UPLOADS_DIR = WORKSPACE / "uploads"


# ============================================================
# НАСТРОЙКИ
# ============================================================

DEFAULT_CONFIG = {
    "provider": "не подключен",
    "api_key": "",
    "base_url": "",
    "model": "",
    "github_owner": "HA-Baykal",
    "github_repo": "norm-vektor",
    "github_branch": "main",
    "github_token": "",
    "articles_path": "src/data/articlesData.ts",
    "articles_page_path": "src/pages/BlogPage.tsx",
    "articles_content_path": "src/pages/BlogArticle.tsx",
    "vercel_token": "",
    "vercel_project_id": "",
    "vercel_team_id": "",
    "genapi_token": "",
    "genapi_base_url": "https://api.gen-api.ru",
    "yookassa_shop_id": "",
    "yookassa_secret": "",
    "public_url": "http://127.0.0.1:8080",
    "owner_bypass": True,
    "company_name": "Вектор Комфорта",
    "company_geo": (
        "Иркутск, Ангарск, Шелехов и ближайшие населённые "
        "пункты в радиусе 50 км"
    ),
    "category_map": {
        "вентиляция": "Вентиляция",
        "окна": "Окна",
        "окно": "Окна",
        "кондиционеры": "Кондиционеры",
        "кондиционер": "Кондиционеры",
        "алмазное бурение": "Алмазное бурение",
        "бурение": "Алмазное бурение",
        "отопление": "Отопление",
        "водоснабжение": "Водоснабжение",
        "электрика": "Электрика",
        "ремонт": "Ремонт",
        "кровля": "Кровля",
        "статьи": "Статьи",
    },
}

PROVIDERS = {
    "не подключен": {"base_url": "", "model": ""},
    "openai": {"base_url": "https://api.openai.com/v1", "model": "gpt-4o-mini"},
    "groq": {"base_url": "https://api.groq.com/openai/v1", "model": "llama-3.3-70b-versatile"},
    "openrouter": {"base_url": "https://openrouter.ai/api/v1", "model": "openai/gpt-4o-mini"},
    "ollama": {"base_url": "http://127.0.0.1:11434/v1", "model": "qwen2.5:14b"},
    "deepseek": {"base_url": "https://api.deepseek.com/v1", "model": "deepseek-chat"},
    "openai_compatible": {"base_url": "", "model": ""},
}

ROLES = {
    "coder": {"name": "Кодер", "role": "Разработчик", "skills": ["код", "файлы", "GitHub"], "emoji": "💻"},
    "writer": {"name": "Автор", "role": "Статьи и контент", "skills": ["статьи", "тексты"], "emoji": "✍️"},
    "seo": {"name": "SEO-специалист", "role": "Главред и SEO", "skills": ["аудит", "запросы", "редактура"], "emoji": "📈"},
    "designer": {"name": "Дизайнер", "role": "Визуал", "skills": ["макеты", "фото", "изображения"], "emoji": "🎨"},
    "analyst": {"name": "Аналитик", "role": "Стратегия", "skills": ["анализ", "план", "исследования"], "emoji": "🧠"},
}

DEFAULT_PLAYBOOKS = {
    "ceo": (
        "Ты директор AI Office. Пользователь общается только с тобой. "
        "Твоя память — весь текущий чат. Сначала буквально разбери запрос: "
        "что именно просили, сколько пунктов, какой формат результата. "
        "Не подменяй задачу шаблоном офиса. "
        "Если просят N тем / вариантов / заголовков — итогом должен быть список из N пунктов, без полной статьи. "
        "Если просят программу, скрипт, калькулятор, смету как софт — это задача кодера, результат = работающий код, а не текстовая смета. "
        "Если просят статью — только тогда статья. "
        "Ты ставишь ТЗ специалисту, принимаешь работу, сверяешь с запросом пользователя "
        "и при расхождении сам правишь ответ или возвращаешь на доработку. "
        "Пользователю отдаёшь только финальный результат, без внутренних протоколов."
    ),
    "writer": (
        "Пиши строго по заданию пользователя. Если просят список или варианты, "
        "не пиши полную статью. Если просят статью — выдай только готовую статью "
        "без отчёта о работе. Используй понятный русский язык."
    ),
    "seo": (
        "Работай как SEO-аналитик и главред. Соблюдай точное количество "
        "вариантов. Не придумывай частотность, цены, скидки, законы и статистику. "
        "При редактировании сохраняй тему текущего документа. "
        "Не добавляй отчёт после финального результата."
    ),
    "coder": (
        "Помогай с кодом и файлами. Не заявляй об успешной публикации без "
        "фактического подтверждения GitHub и Vercel."
    ),
    "designer": (
        "Создавай рекомендации по визуалу строго по заданию."
    ),
    "analyst": (
        "Проводить анализ по точному запросу. Не заменять задачу шаблонным ответом."
    ),
}

IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".bmp"}
VIDEO_EXTENSIONS = {".mp4", ".mov", ".webm", ".mkv", ".avi"}

MAX_IMAGE_BYTES = 4_000_000
LLM_TIMEOUT = 100
HTTP_TIMEOUT = 18
GITHUB_TIMEOUT = 50
VERCEL_TIMEOUT = 30
VERCEL_WAIT_SECONDS = 180

SSL_CONTEXT = ssl.create_default_context()

USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 Chrome/122 Safari/537.36"
)


# ============================================================
# ОБЩИЕ ФУНКЦИИ
# ============================================================

def now() -> str:
    return datetime.now().strftime("%H:%M:%S")


def safe_text(value) -> str:
    return str(value or "").strip()


def unique_id() -> str:
    return datetime.now().strftime("%Y%m%d%H%M%S%f")


def load_json(path: Path, default):
    if not path.exists():
        return default
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return default


def save_json(path: Path, data) -> None:
    path.write_text(
        json.dumps(data, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )


TRANSLITERATION = str.maketrans({
    "а": "a", "б": "b", "в": "v", "г": "g", "д": "d",
    "е": "e", "ё": "e", "ж": "zh", "з": "z", "и": "i",
    "й": "j", "к": "k", "л": "l", "м": "m", "н": "n",
    "о": "o", "п": "p", "р": "r", "с": "s", "т": "t",
    "у": "u", "ф": "f", "х": "h", "ц": "c", "ч": "ch",
    "ш": "sh", "щ": "shh", "ъ": "", "ы": "y", "ь": "",
    "э": "e", "ю": "yu", "я": "ya",
})


def slugify(text: str) -> str:
    value = safe_text(text).lower().translate(TRANSLITERATION)
    value = re.sub(r"[^a-z0-9]+", "-", value)
    value = re.sub(r"-+", "-", value)
    return value.strip("-")[:90] or "article"


def strip_service_markup(text: str) -> str:
    value = safe_text(text)
    if not value:
        return ""
    value = re.sub(r"```json\s*\{.*?\"tool\".*?\}\s*```", "", value, flags=re.I | re.S)
    value = re.sub(r"\{\s*\"tool\"\s*:\s*\"[^\"]+\".*?\}", "", value, flags=re.I | re.S)
    value = re.sub(r"\n{3,}", "\n\n", value)
    return value.strip()


def first_json_array(text: str):
    value = safe_text(text)
    start = value.find("[")
    while start >= 0:
        depth = 0
        quote = None
        escaped = False
        for index in range(start, len(value)):
            char = value[index]
            if quote:
                if escaped:
                    escaped = False
                elif char == "\\":
                    escaped = True
                elif char == quote:
                    quote = None
                continue
            if char in ('"', "'"):
                quote = char
                continue
            if char == "[":
                depth += 1
            elif char == "]":
                depth -= 1
                if depth == 0:
                    candidate = value[start:index + 1]
                    try:
                        result = json.loads(candidate)
                        if isinstance(result, list):
                            return result
                    except Exception:
                        break
        start = value.find("[", start + 1)
    return None


def first_json_object(text: str):
    value = safe_text(text)
    start = value.find("{")
    while start >= 0:
        depth = 0
        quote = None
        escaped = False
        for index in range(start, len(value)):
            char = value[index]
            if quote:
                if escaped:
                    escaped = False
                elif char == "\\":
                    escaped = True
                elif char == quote:
                    quote = None
                continue
            if char in ('"', "'"):
                quote = char
                continue
            if char == "{":
                depth += 1
            elif char == "}":
                depth -= 1
                if depth == 0:
                    candidate = value[start:index + 1]
                    try:
                        result = json.loads(candidate)
                        if isinstance(result, dict):
                            return result
                    except Exception:
                        break
        start = value.find("{", start + 1)
    return None


# ============================================================
# СОСТОЯНИЕ ОФИСА
# ============================================================

def default_ceo() -> dict:
    return {
        "id": "ceo",
        "name": "Директор",
        "role": "Оркестратор",
        "emoji": "👔",
        "skills": ["управление", "постановка задач"],
        "playbook": DEFAULT_PLAYBOOKS["ceo"],
        "status": "на месте",
        "status_code": "idle",
        "memory": [],
        "knowledge": [],
        "created_by": "system",
    }


def default_session(sid: str) -> dict:
    return {
        "id": sid,
        "title": "Новый чат",
        "chat": [{
            "id": unique_id(),
            "role": "assistant",
            "text": "Офис готов. Опишите проект или поставьте задачу.",
        }],
        "last_job": None,
        "pending": None,
        "current_article": "",
        "last_article": None,
        "current_document": None,
        "pending_publish": None,
        "last_options": [],
        "selected_option": None,
        "last_intent": "",
        "last_agent": "",
    }


class Office:
    def __init__(self):
        old_state = load_json(STATE_FILE, {})

        if "sessions" not in old_state:
            sid = unique_id()
            old_chat = old_state.get("chat") or [{
                "id": unique_id(),
                "role": "assistant",
                "text": "Офис готов.",
            }]
            self.state = {
                "sessions": {
                    sid: {
                        **default_session(sid),
                        "title": "Основной проект",
                        "chat": old_chat,
                        "last_job": old_state.get("last_job"),
                        "pending": old_state.get("pending"),
                        "current_article": old_state.get("current_article", ""),
                    },
                },
                "current_session": sid,
                "activity": {"phase": "idle", "to": "ceo", "label": "Офис ожидает задачу"},
                "agents": old_state.get("agents") or {"ceo": default_ceo()},
                "logs": old_state.get("logs") or [f"[{now()}] Офис открыт."],
            }
        else:
            self.state = old_state

        self.state.setdefault("sessions", {})
        self.state.setdefault("agents", {})
        self.state.setdefault("logs", [])
        self.state.setdefault(
            "activity", {"phase": "idle", "to": "ceo", "label": "Офис ожидает задачу"}
        )

        longterm = load_json(MEMORY_FILE, {})
        if longterm.get("agents"):
            self.state["agents"] = longterm["agents"]

        if "ceo" not in self.state["agents"]:
            self.state["agents"]["ceo"] = default_ceo()

        for session in self.state["sessions"].values():
            session.setdefault("chat", [])
            session.setdefault("title", "Новый чат")
            session.setdefault("last_job", None)
            session.setdefault("pending", None)
            session.setdefault("current_article", "")
            session.setdefault("last_article", None)
            session.setdefault("current_document", None)
            session.setdefault("pending_publish", None)
            session.setdefault("last_options", [])
            session.setdefault("selected_option", None)
            session.setdefault("last_intent", "")
            session.setdefault("last_agent", "")
            for message in session["chat"]:
                message.setdefault("id", unique_id())

        for aid, agent in self.state["agents"].items():
            agent.setdefault("id", aid)
            agent.setdefault("name", aid)
            agent.setdefault("role", "Специалист")
            agent.setdefault("emoji", "👤")
            agent.setdefault("skills", [])
            agent.setdefault(
                "playbook",
                DEFAULT_PLAYBOOKS.get(aid, "Работай по точному заданию пользователя."),
            )
            agent.setdefault("memory", [])
            agent.setdefault("knowledge", [])
            agent.setdefault("status_code", "idle")
            agent.setdefault("status", "на месте" if aid == "ceo" else "ожидает")

        self.config = load_json(CONFIG_FILE, DEFAULT_CONFIG.copy())
        for key, value in DEFAULT_CONFIG.items():
            self.config.setdefault(key, value)

        WORKSPACE.mkdir(parents=True, exist_ok=True)
        DRAFTS_DIR.mkdir(parents=True, exist_ok=True)
        UPLOADS_DIR.mkdir(parents=True, exist_ok=True)

        self.full_reset_to_idle()
        self.save()

    @property
    def session(self) -> dict:
        sid = self.state.get("current_session")
        if not sid or sid not in self.state["sessions"]:
            sid = unique_id()
            self.state["sessions"][sid] = default_session(sid)
            self.state["current_session"] = sid
        return self.state["sessions"][sid]

    def save(self) -> None:
        try:
            save_json(STATE_FILE, self.state)
            save_json(MEMORY_FILE, {"agents": self.state.get("agents", {})})
            save_json(CONFIG_FILE, self.config)
        except Exception as error:
            print(f"Ошибка сохранения: {error}")

    def log(self, text: str) -> None:
        self.state["logs"].append(f"[{now()}] {safe_text(text)}")
        self.state["logs"] = self.state["logs"][-250:]

    def set_activity(self, phase: str, target: str = "ceo", label: str = "") -> None:
        self.state["activity"] = {
            "phase": phase,
            "to": target,
            "label": label or phase,
        }

    def set_agent_status(self, agent_id: str, status: str) -> None:
        agent = self.state["agents"].get(agent_id)
        if not agent:
            return
        agent["status_code"] = status
        agent["status"] = {
            "idle": "на месте" if agent_id == "ceo" else "ожидает",
            "assigned": "получил задачу",
            "working": "в работе",
            "done": "готов",
            "error": "ошибка",
        }.get(status, status)

    def reset_agents_idle(self, except_id: str | None = None) -> None:
        for aid in self.state["agents"]:
            if aid != except_id:
                self.set_agent_status(aid, "idle")

    def full_reset_to_idle(self) -> None:
        self.set_activity("idle", "ceo", "Офис ожидает задачу")
        for aid in self.state["agents"]:
            self.set_agent_status(aid, "idle")

    def create_agent(self, key: str, name: str, role: str, skills: list, emoji: str) -> dict:
        if key in self.state["agents"]:
            return self.state["agents"][key]
        agent = {
            "id": key,
            "name": name,
            "role": role,
            "emoji": emoji,
            "skills": list(skills or []),
            "playbook": DEFAULT_PLAYBOOKS.get(key, "Работай по точному заданию пользователя."),
            "status": "ожидает",
            "status_code": "idle",
            "memory": [],
            "knowledge": [],
            "created_by": "ceo",
        }
        self.state["agents"][key] = agent
        self.log(f"Нанят: {emoji} {name}")
        self.save()
        return agent

    def ensure_agent(self, key: str) -> dict:
        if key in self.state["agents"]:
            return self.state["agents"][key]
        role = ROLES.get(key)
        if not role:
            raise RuntimeError(f"Неизвестный специалист: {key}")
        return self.create_agent(key, role["name"], role["role"], role["skills"], role["emoji"])

    def learn(self, agent: dict, task: str, result: str) -> None:
        agent.setdefault("memory", [])
        agent.setdefault("knowledge", [])
        agent["memory"].append(f"{now()} | {safe_text(task)[:100]}")
        agent["memory"] = agent["memory"][-60:]
        agent["knowledge"].append({
            "at": now(),
            "task": safe_text(task)[:250],
            "excerpt": re.sub(r"\s+", " ", safe_text(result))[:500],
        })
        agent["knowledge"] = agent["knowledge"][-50:]

    def api_ready(self) -> bool:
        return bool(safe_text(self.config.get("api_key")))

    def github_ready(self) -> bool:
        return bool(
            safe_text(self.config.get("github_owner"))
            and safe_text(self.config.get("github_repo"))
            and safe_text(self.config.get("github_token"))
        )

    def vercel_ready(self) -> bool:
        return bool(
            safe_text(self.config.get("vercel_token"))
            and safe_text(self.config.get("vercel_project_id"))
        )

    def genapi_ready(self) -> bool:
        return bool(safe_text(self.config.get("genapi_token")))


office = Office()
office_ui = {"attachments": [], "busy": False}


# ============================================================
# СООБЩЕНИЯ И ЧАТЫ
# ============================================================

def add_chat_message(role: str, text: str, details: str = "", image: str = "") -> dict:
    message = {
        "id": unique_id(),
        "role": role,
        "text": safe_text(text),
    }
    if details:
        message["details"] = safe_text(details)
    if image:
        message["image"] = image
    office.session["chat"].append(message)
    office.save()
    return message


def start_new_chat() -> None:
    sid = unique_id()
    office.state["sessions"][sid] = default_session(sid)
    office.state["current_session"] = sid
    office.full_reset_to_idle()
    office.save()
    refresh_all()


def switch_chat(sid: str) -> None:
    if sid not in office.state["sessions"]:
        return
    office.state["current_session"] = sid
    office.full_reset_to_idle()
    office.save()
    refresh_all()


def delete_chat(sid: str) -> None:
    if sid in office.state["sessions"]:
        del office.state["sessions"][sid]
    if not office.state["sessions"]:
        new_sid = unique_id()
        office.state["sessions"][new_sid] = default_session(new_sid)
        office.state["current_session"] = new_sid
    elif office.state.get("current_session") == sid:
        office.state["current_session"] = next(iter(office.state["sessions"]))
    office.full_reset_to_idle()
    office.save()
    refresh_all()


def get_recent_conversation(limit: int = 12) -> list[dict]:
    result = []
    for item in office.session.get("chat", [])[-limit:]:
        role = item.get("role")
        if role not in {"user", "assistant"}:
            continue
        text = strip_service_markup(item.get("text") or "")
        if not text:
            continue
        result.append({"role": role, "content": text[:14000]})
    return result


# ============================================================
# ВЛОЖЕНИЯ
# ============================================================

def save_upload(raw: bytes, filename: str) -> dict:
    original = filename or "file.bin"
    extension = Path(original).suffix.lower() or ".bin"
    saved_name = (
        datetime.now().strftime("%Y%m%d-%H%M%S-")
        + slugify(Path(original).stem)
        + extension
    )
    path = UPLOADS_DIR / saved_name
    path.write_bytes(raw)
    mime = mimetypes.guess_type(str(path))[0] or "application/octet-stream"
    if extension in IMAGE_EXTENSIONS:
        kind = "image"
    elif extension in VIDEO_EXTENSIONS:
        kind = "video"
    else:
        kind = "file"
    office.log(f"Добавлено вложение: {saved_name}")
    return {
        "path": str(path),
        "rel": f"workspace/uploads/{saved_name}",
        "name": original,
        "mime": mime,
        "kind": kind,
        "size": len(raw),
    }


def attachments_note(attachments: list[dict]) -> str:
    if not attachments:
        return ""
    lines = ["Вложения пользователя:"]
    for item in attachments:
        lines.append(f"- {item.get('kind')}: {item.get('name')}")
    return "\n".join(lines)


def vision_parts(text: str, attachments: list[dict]) -> list[dict]:
    parts = [{"type": "text", "text": text}]
    for item in attachments:
        if item.get("kind") != "image":
            continue
        path = Path(item.get("path", ""))
        if not path.exists():
            continue
        if path.stat().st_size > MAX_IMAGE_BYTES:
            continue
        encoded = base64.b64encode(path.read_bytes()).decode("ascii")
        parts.append({
            "type": "image_url",
            "image_url": {
                "url": f"data:{item.get('mime') or 'image/jpeg'};base64,{encoded}",
            },
        })
    return parts


def save_draft(title: str, body: str) -> str:
    filename = (
        datetime.now().strftime("%Y%m%d-%H%M%S-")
        + slugify(title)
        + ".md"
    )
    path = DRAFTS_DIR / filename
    path.write_text(f"# {title}\n\n{body}\n", encoding="utf-8")
    office.log(f"Черновик: drafts/{filename}")
    return f"drafts/{filename}"


# ============================================================
# HTTP И ПОИСКОВЫЕ ПОДСКАЗКИ
# ============================================================

def clean_url(url: str) -> str:
    return safe_text(url).rstrip(".,);]»\"'—–-")


def is_safe_url(url: str) -> bool:
    try:
        parsed = urllib.parse.urlparse(url)
        if parsed.scheme not in {"http", "https"}:
            return False
        if not parsed.hostname:
            return False
        if parsed.hostname.lower() in {"localhost", "127.0.0.1", "::1"}:
            return False
        for info in socket.getaddrinfo(parsed.hostname, None):
            ip = ipaddress.ip_address(info[4][0])
            if (ip.is_private or ip.is_loopback or ip.is_link_local or ip.is_reserved):
                return False
        return True
    except Exception:
        return False


def http_get(url: str, timeout: int = HTTP_TIMEOUT, max_bytes: int = 500_000) -> tuple[str, str]:
    url = clean_url(url)
    if not is_safe_url(url):
        raise RuntimeError("Недоступный URL")
    request = urllib.request.Request(
        url,
        headers={
            "User-Agent": USER_AGENT,
            "Accept": "*/*",
            "Accept-Language": "ru,en;q=0.8",
        },
    )
    with urllib.request.urlopen(request, timeout=timeout, context=SSL_CONTEXT) as response:
        data = response.read(max_bytes)
        final_url = response.geturl()
        content_type = (response.headers.get("Content-Type") or "").lower()
        charset = "utf-8"
        if "charset=" in content_type:
            charset = content_type.split("charset=")[-1].split(";")[0].strip() or "utf-8"
        return (final_url, data.decode(charset, errors="replace"))


def keyword_suggest(seed: str) -> str:
    seed = safe_text(seed)[:100]
    if not seed:
        return "Подсказки не найдены."
    found = []
    queries = [seed, seed + " иркутск", seed + " зимой", seed + " цена"]
    for query in queries:
        urls = [
            "https://suggest.yandex.ru/suggest-ya.cgi?" + urllib.parse.urlencode({"part": query, "v": "4", "uil": "ru"}),
            "https://suggestqueries.google.com/complete/search?" + urllib.parse.urlencode({"client": "firefox", "hl": "ru", "q": query}),
        ]
        for url in urls:
            try:
                _, raw = http_get(url, timeout=10, max_bytes=200_000)
                data = json.loads(raw)

                def walk(value):
                    if isinstance(value, str):
                        if 3 < len(value) < 140:
                            found.append(value)
                    elif isinstance(value, list):
                        for child in value:
                            walk(child)
                    elif isinstance(value, dict):
                        for child in value.values():
                            walk(child)

                walk(data)
            except Exception:
                continue
    unique = []
    seen = set()
    for item in found:
        key = item.lower().strip()
        if key in seen or key == seed.lower():
            continue
        seen.add(key)
        unique.append(item.strip())
        if len(unique) >= 40:
            break
    if not unique:
        return "Подсказки не найдены."
    return "Поисковые подсказки:\n- " + "\n- ".join(unique)


# ============================================================
# LLM
# ============================================================

def ask_llm(messages: list[dict], temperature: float = 0.25, allow_retry: bool = True) -> str | None:
    api_key = safe_text(office.config.get("api_key"))
    if not api_key:
        office.log("Нет ключа DeepSeek — директор берёт GenAPI")
        return genapi_text_complete(messages)
    provider = office.config.get("provider") or "openai_compatible"
    preset = PROVIDERS.get(provider, {})
    base_url = (
        safe_text(office.config.get("base_url")) or preset.get("base_url") or ""
    ).rstrip("/")
    if not base_url:
        office.log("Не указан Base URL")
        return None
    if base_url.endswith("/chat/completions"):
        url = base_url
    elif base_url.endswith("/v1"):
        url = base_url + "/chat/completions"
    else:
        url = base_url + "/v1/chat/completions"
    model = safe_text(office.config.get("model")) or preset.get("model") or "gpt-4o-mini"
    payload = {"model": model, "temperature": temperature, "messages": messages}
    request = urllib.request.Request(
        url,
        data=json.dumps(payload, ensure_ascii=False).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(request, timeout=LLM_TIMEOUT, context=SSL_CONTEXT) as response:
            data = json.loads(response.read().decode("utf-8", errors="replace"))
            content = (data.get("choices", [{}])[0].get("message", {}).get("content"))
            if isinstance(content, list):
                content = "\n".join(item.get("text", "") for item in content if isinstance(item, dict))
            return safe_text(content)
    except urllib.error.HTTPError as error:
        body = error.read().decode("utf-8", errors="replace")[:1000]
        office.log(f"LLM HTTP {error.code}: {body}")
        if allow_retry and error.code in {400, 415, 422}:
            plain_messages = []
            for message in messages:
                content = message.get("content")
                if isinstance(content, list):
                    content = "\n".join(
                        item.get("text", "")
                        for item in content
                        if isinstance(item, dict) and item.get("type") == "text"
                    )
                plain_messages.append({"role": message["role"], "content": content})
            return ask_llm(plain_messages, temperature=temperature, allow_retry=False)
        office.log("DeepSeek не ответил, директор переключает на GenAPI")
        return genapi_text_complete(messages)
    except Exception as error:
        office.log(f"Ошибка LLM: {error}")
        office.log("DeepSeek сбой — переход на GenAPI")
        return genapi_text_complete(messages)


# ============================================================
# GITHUB API
# ============================================================

def api_json(method: str, url: str, headers: dict | None = None, payload=None, timeout: int = GITHUB_TIMEOUT):
    request_headers = {"User-Agent": "AI-Office", "Accept": "application/json"}
    if headers:
        request_headers.update(headers)
    data = None
    if payload is not None:
        data = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        request_headers["Content-Type"] = "application/json"
    request = urllib.request.Request(url, data=data, headers=request_headers, method=method)
    try:
        with urllib.request.urlopen(request, timeout=timeout, context=SSL_CONTEXT) as response:
            raw = response.read().decode("utf-8", errors="replace")
            return json.loads(raw or "{}")
    except urllib.error.HTTPError as error:
        body = error.read().decode("utf-8", errors="replace")[:1800]
        raise RuntimeError(f"HTTP {error.code}: {body}") from error


def github_headers() -> dict:
    token = safe_text(office.config.get("github_token"))
    if not token:
        raise RuntimeError("Не указан GitHub Token")
    return {
        "Authorization": f"Bearer {token}",
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
    }


def github_file_api_url(path: str, ref: str | None = None) -> str:
    owner = safe_text(office.config.get("github_owner"))
    repo = safe_text(office.config.get("github_repo"))
    branch = (safe_text(ref) or safe_text(office.config.get("github_branch")) or "main")
    return (
        "https://api.github.com/repos/"
        f"{urllib.parse.quote(owner)}/{urllib.parse.quote(repo)}/contents/"
        f"{urllib.parse.quote(path, safe='/')}?ref={urllib.parse.quote(branch)}"
    )


def github_get_file_data(path: str, ref: str | None = None) -> dict:
    if not office.github_ready():
        raise RuntimeError("GitHub не настроен. Заполните данные подключения.")
    data = api_json("GET", github_file_api_url(path, ref), headers=github_headers())
    if not isinstance(data, dict):
        raise RuntimeError("GitHub вернул неожиданный ответ")
    if "content" not in data:
        raise RuntimeError(f"Не удалось получить файл {path}")
    encoded = re.sub(r"\s+", "", data["content"])
    content = base64.b64decode(encoded).decode("utf-8", errors="replace")
    return {
        "content": content,
        "sha": data.get("sha"),
        "html_url": data.get("html_url"),
        "download_url": data.get("download_url"),
        "ref": ref,
    }


def github_put_file(path: str, content: str, sha: str, message: str) -> dict:
    owner = safe_text(office.config.get("github_owner"))
    repo = safe_text(office.config.get("github_repo"))
    branch = safe_text(office.config.get("github_branch")) or "main"
    url = (
        "https://api.github.com/repos/"
        f"{urllib.parse.quote(owner)}/{urllib.parse.quote(repo)}/contents/"
        f"{urllib.parse.quote(path, safe='/')}"
    )
    payload = {
        "message": message,
        "content": base64.b64encode(content.encode("utf-8")).decode("ascii"),
        "branch": branch,
        "sha": sha,
    }
    result = api_json("PUT", url, headers=github_headers(), payload=payload)
    if not isinstance(result, dict):
        raise RuntimeError("GitHub не подтвердил запись файла")
    return result


# ============================================================
# АНАЛИЗ ARTICLES DATA (DEPRECATED)
# ============================================================

def extract_existing_articles(source: str) -> list[dict]:
    results = []
    seen = set()
    pattern = re.compile(
        r"""(?P<slug>["'][^"']+["']|[a-zA-Z0-9_-]+)\s*:\s*\{"""
        r"""(?P<body>.*?)"""
        r"""(?=(?:["'][^"']+["']|[a-zA-Z0-9_-]+)\s*:\s*\{|\Z)""",
        flags=re.S,
    )
    for match in pattern.finditer(source):
        raw_slug = match.group("slug").strip("'\"")
        body = match.group("body")
        title_match = re.search(r"""title\s*:\s*["'](.*?)["']""", body, flags=re.S)
        category_match = re.search(r"""category\s*:\s*["'](.*?)["']""", body, flags=re.S)
        if not title_match:
            continue
        title = title_match.group(1).strip()
        key = (raw_slug, title)
        if key in seen:
            continue
        seen.add(key)
        results.append({
            "slug": raw_slug,
            "title": title,
            "category": (category_match.group(1).strip() if category_match else ""),
        })
    return results


def render_existing_articles(articles: list[dict]) -> str:
    if not articles:
        return "Статьи автоматически не распознаны."
    lines = []
    for item in articles:
        lines.append(
            f"- {item.get('title')} "
            f"[категория: {item.get('category') or 'не указана'}; "
            f"slug: {item.get('slug')}]"
        )
    return "\n".join(lines)


# ============================================================
# СТАТЬИ И ДОКУМЕНТЫ
# ============================================================

def extract_article_body(raw: str) -> str:
    text = strip_service_markup(raw)
    if not text:
        return ""
    text = re.sub(
        r"Принято!.*?Вот финальный,?\s*сочный вариант:?\s*",
        "",
        text,
        flags=re.I | re.S,
    )
    first_heading = re.search(r"(?m)^#\s+", text)
    if first_heading and first_heading.start() > 0:
        preamble = text[:first_heading.start()]
        if re.search(
            r"Главред|SEO-специалист|переработал|финальный вариант",
            preamble,
            flags=re.I,
        ):
            text = text[first_heading.start():]
    text = re.sub(r"Что я улучшил как Главред и SEO:.*", "", text, flags=re.I | re.S)
    text = re.sub(r"Что было улучшено.*", "", text, flags=re.I | re.S)

    content_match = re.search(
        r"""content\s*:\s*`(.*?)`""",
        text,
        flags=re.I | re.S,
    )
    if (content_match and len(content_match.group(1).strip()) > 500):
        text = content_match.group(1).strip()

    ready_match = re.search(
        r"===\s*ГОТОВАЯ СТАТЬЯ.*?===\s*(.*?)\s*===\s*КОНЕЦ СТАТЬИ",
        text,
        flags=re.I | re.S,
    )
    if ready_match:
        text = ready_match.group(1).strip()

    text = re.sub(r"^\s*```(?:markdown|md|text)?\s*", "", text, flags=re.I)
    text = re.sub(r"\s*```\s*$", "", text)

    markers = [
        "📊 Что я усилил", "🚀 Следующий шаг",
        "Отчёт Главреда", "Что было улучшено", "Что я улучшил",
    ]
    positions = []
    for marker in markers:
        position = text.find(marker)
        if position > 500:
            positions.append(position)
    if positions:
        text = text[:min(positions)]

    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def looks_like_article(text: str) -> bool:
    body = extract_article_body(text)
    if len(body) < 700:
        return False
    bad_phrases = [
        "нет готовой статьи", "не могу выполнить публикацию",
        "статья отсутствует", "технический ответ", "давайте уточним",
    ]
    low = body.lower()
    return not any(phrase in low[:1000] for phrase in bad_phrases)


PREAMBLE_RE = re.compile(
    r"Главред|SEO-специалист|переработал|Принято!|финальный,?\s*сочный",
    flags=re.I,
)


def extract_article_title(body: str, fallback: str = "Новая статья") -> str:
    body = extract_article_body(body)
    heading = re.search(r"(?m)^#\s+(.+?)\s*$", body)
    if heading:
        t = heading.group(1).strip()
        if not PREAMBLE_RE.search(t):
            return t[:220]
    heading2 = re.search(r"(?m)^##\s+(.+?)\s*$", body)
    if heading2:
        t = heading2.group(1).strip()
        if not PREAMBLE_RE.search(t):
            return t[:220]
    for line in body.splitlines():
        value = re.sub(r"^[#>*\-\s]+", "", line).strip()
        if value and len(value) <= 220 and not PREAMBLE_RE.search(value):
            if not re.match(r"^(?:категория|запросы|теги|мета|дата|автор):", value, re.I):
                return value
    return fallback[:220]


def remember_document(body: str, title: str = "", source: str = "", category: str = "") -> dict:
    body = extract_article_body(body)
    if not looks_like_article(body):
        raise RuntimeError("Полученный текст не похож на полную статью")
    title = title or extract_article_title(body)
    old_document = office.session.get("current_document") or {}
    document = {
        "type": "article",
        "title": title,
        "slug": (old_document.get("slug") if old_document.get("body") == body else slugify(title)),
        "body": body,
        "category": (category or old_document.get("category") or "Статьи"),
        "source": source,
        "updated_at": datetime.now().isoformat(timespec="seconds"),
    }
    office.session["current_document"] = document
    office.session["last_article"] = dict(document)
    office.session["current_article"] = body
    office.save()
    return document


def heal_document(document: dict) -> dict:
    document = dict(document or {})
    body = extract_article_body(document.get("body") or "")
    document["body"] = body
    old_title = safe_text(document.get("title"))
    title = extract_article_title(body, old_title)
    if not title or PREAMBLE_RE.search(title):
        title = extract_article_title(body, "")
    document["title"] = title
    old_slug = safe_text(document.get("slug"))
    expected_slug = slugify(old_title or title)
    if (not old_slug or old_slug == expected_slug or PREAMBLE_RE.search(old_slug)):
        document["slug"] = slugify(title)
    else:
        document["slug"] = old_slug
    return document


def get_last_chat_article() -> dict | None:
    for item in reversed(office.session.get("chat", [])):
        if item.get("role") != "assistant":
            continue
        body = extract_article_body(item.get("text") or "")
        if not looks_like_article(body):
            continue
        title = extract_article_title(body)
        category = (
            (office.session.get("current_document") or {}).get("category")
            or "Статьи"
        )
        document = heal_document({
            "type": "article",
            "title": title,
            "slug": slugify(title),
            "body": body,
            "category": category,
            "source": "chat",
            "updated_at": datetime.now().isoformat(timespec="seconds"),
        })
        return document
    return None


def get_current_document() -> dict | None:
    document = office.session.get("current_document")
    if (isinstance(document, dict) and looks_like_article(document.get("body") or "")):
        document = heal_document(document)
        office.session["current_document"] = document
        office.session["last_article"] = dict(document)
        office.save()
        return document
    article = office.session.get("last_article")
    if (isinstance(article, dict) and looks_like_article(article.get("body") or "")):
        article = heal_document(article)
        office.session["current_document"] = dict(article)
        office.session["last_article"] = dict(article)
        office.save()
        return article
    old_body = office.session.get("current_article") or ""
    if looks_like_article(old_body):
        title = extract_article_title(old_body)
        document = {
            "type": "article",
            "title": title,
            "slug": slugify(title),
            "body": extract_article_body(old_body),
            "category": "Статьи",
            "source": "legacy",
            "updated_at": "",
        }
        office.session["current_document"] = document
        office.session["last_article"] = dict(document)
        office.save()
        return document
    return None


# ============================================================
# НОРМАЛИЗАЦИЯ КАТЕГОРИЙ
# ============================================================

def normalize_category_for_publish(category: str) -> str:
    cat = safe_text(category)
    if not cat:
        return "Статьи"

    category_map = office.config.get("category_map") or {}
    cat_lower = cat.lower()

    for key, proper_name in category_map.items():
        if key == cat_lower:
            return proper_name

    try:
        page_path = safe_text(
            office.config.get("articles_page_path")
        ) or "src/pages/BlogPage.tsx"
        page_data = github_get_file_data(page_path)
        existing_articles = extract_articles_from_blog_page(page_data["content"])
        existing_cats = {
            a.get("category"): a.get("category")
            for a in existing_articles
            if a.get("category")
        }
        for proper_name in existing_cats.keys():
            if proper_name.lower() == cat_lower:
                return proper_name
    except Exception:
        pass

    return cat[:1].upper() + cat[1:]


# ============================================================
# ОПРЕДЕЛЕНИЕ НАМЕРЕНИЯ
# ============================================================

def is_image_request(text: str) -> bool:
    value = safe_text(text).lower()
    return bool(re.search(
        r"сгенер\w*\s+(изображен|картинк|фото|визуал)|"
        r"(нарисуй|создай картинк|сделай картинк|сделай фото|нужна картинк|нужно фото|"
        r"под\s+(неё|нее|статью|неё)\s+сделай\s+(изображен|картинк)|"
        r"изображен\w+\s+под)",
        value,
    ))


def choose_genapi_image_spec(user_text: str) -> dict:
    low = safe_text(user_text).lower()
    hard = bool(re.search(
        r"качеств|4k|фотореал|герой|сайт|реклам|стат(ья|ьи)|конденсат|"
        r"сложн|детализац|коммерч|баннер|обложк|персонаж|бризер|рекуператор",
        low,
    ))
    simple = bool(re.search(r"иконк|схем|наброс|эскиз|прост|черновик|thumbnail", low))
    if hard:
        return {
            "network": "gpt-image-2-5",
            "label": "GPT Image 2.5 Flare (сложная задача)",
            "payload": {
                "model": "flare",
                "prompt": user_text,
                "quality": "high",
                "image_size": "1024x1024",
                "num_images": 1,
                "output_format": "png",
            },
        }
    if simple:
        return {
            "network": "flux",
            "label": "Flux Schnell (дешёвая быстрая)",
            "payload": {
                "model": "Schnell",
                "prompt": user_text,
                "width": 1024,
                "height": 1024,
                "num_images": 1,
                "translate_input": True,
            },
        }
    return {
        "network": "flux",
        "label": "Flux Pro v1.1 (фото, цена/качество)",
        "payload": {
            "model": "PRO v1.1",
            "prompt": user_text,
            "width": 1024,
            "height": 1024,
            "num_images": 1,
            "translate_input": True,
        },
    }


def genapi_headers() -> dict:
    token = safe_text(office.config.get("genapi_token"))
    if not token:
        raise RuntimeError("Не указан ключ GenAPI")
    return {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
        "Accept": "application/json",
    }


def genapi_post_network(network_id: str, payload: dict) -> dict:
    base = safe_text(office.config.get("genapi_base_url")) or "https://api.gen-api.ru"
    url = f"{base.rstrip('/')}/api/v1/networks/{urllib.parse.quote(network_id)}"
    data = api_json("POST", url, headers=genapi_headers(), payload=payload, timeout=60)
    if not isinstance(data, dict):
        raise RuntimeError("GenAPI вернул неожиданный ответ")
    return data


def genapi_get_request(request_id) -> dict:
    base = safe_text(office.config.get("genapi_base_url")) or "https://api.gen-api.ru"
    url = f"{base.rstrip('/')}/api/v1/request/get/{request_id}"
    data = api_json("GET", url, headers=genapi_headers(), timeout=30)
    if not isinstance(data, dict):
        raise RuntimeError("GenAPI не вернул статус генерации")
    return data


def genapi_wait_result(request_id, timeout_sec: int = 180) -> dict:
    deadline = time.time() + timeout_sec
    while time.time() < deadline:
        last = genapi_get_request(request_id)
        status = safe_text(last.get("status")).lower()
        if status in {"success", "ok", "done", "completed"}:
            return last
        if status in {"error", "failed"}:
            raise RuntimeError(str(last.get("error") or last.get("message") or "Ошибка GenAPI"))
        time.sleep(2)
    raise RuntimeError("GenAPI не успел сгенерировать изображение за отведённое время")


def extract_genapi_file_urls(result: dict) -> list[str]:
    urls = []
    raw = result.get("result")
    if isinstance(raw, str) and raw.startswith("http"):
        urls.append(raw)
    elif isinstance(raw, list):
        for item in raw:
            if isinstance(item, str) and item.startswith("http"):
                urls.append(item)
            elif isinstance(item, dict):
                for key in ("url", "file", "image", "src"):
                    if safe_text(item.get(key)).startswith("http"):
                        urls.append(safe_text(item.get(key)))
    seen = []
    for url in urls:
        if url not in seen:
            seen.append(url)
    return seen


def download_to_uploads(url: str) -> str:
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(request, timeout=60, context=SSL_CONTEXT) as response:
        data = response.read()
        ctype = (response.headers.get("Content-Type") or "").lower()
    ext = ".jpg"
    if "png" in ctype or url.lower().endswith(".png"):
        ext = ".png"
    elif "webp" in ctype:
        ext = ".webp"
    name = datetime.now().strftime("%Y%m%d-%H%M%S-genapi") + ext
    path = UPLOADS_DIR / name
    path.write_bytes(data)
    return str(path)


def image_prompt_from_article(user_text: str) -> str:
    document = get_current_document() or get_last_chat_article()
    title = ""
    excerpt = user_text
    if document:
        title = document.get("title") or ""
        excerpt = (document.get("body") or "")[:800]
    return (
        f"{user_text}\n\n"
        f"Тема статьи: {title}\n"
        f"Смысл кадра: {excerpt}\n"
        "Photorealistic, no watermarks, no fake logos."
    )


def run_image_generation(user_text: str) -> str:
    if not office.genapi_ready():
        raise RuntimeError(
            "Картинки рисует GenAPI. Откройте GitHub / Vercel и вставьте ключ GenAPI."
        )
    spec = choose_genapi_image_spec(user_text)
    cost = GENAPI_IMAGE_COST.get((spec["network"], spec["payload"].get("model")), 7.2)
    charge_current_user(image_credits(cost), f"Картинка {spec['label']}")
    designer = agent_start("designer", f"🎨 Дизайнер генерирует через {spec['label']}…")
    prompt = image_prompt_from_article(user_text)
    payload = dict(spec["payload"])
    payload["prompt"] = prompt
    office.log(f"GenAPI {spec['network']} / {spec['label']}")
    created = genapi_post_network(spec["network"], payload)
    request_id = created.get("request_id") or created.get("id")
    if not request_id:
        raise RuntimeError(f"GenAPI не вернул request_id: {created}")
    finished = genapi_wait_result(request_id)
    urls = extract_genapi_file_urls(finished)
    if not urls:
        raise RuntimeError("GenAPI завершился без файла изображения")
    local_path = download_to_uploads(urls[0])
    office.session["last_image"] = local_path
    office.save()
    caption = (
        f"Готовое изображение под материал.\n\n"
        f"**Модель GenAPI:** {spec['label']}\n\n"
        "Ниже картинка в чате — её можно скачать кнопкой **Скачать**."
    )
    details = (
        "Ход работы:\n\n"
        "- Директор понял, что нужна картинка;\n"
        f"- дизайнер отправил задачу в GenAPI `{spec['network']}`;\n"
        f"- файл: `{local_path}`."
    )
    add_chat_message("assistant", caption, details, image=local_path)
    office.learn(designer, user_text, caption)
    agent_done("designer", "🎨 Изображение готово")
    return caption


def billing_enabled() -> bool:
    if office.config.get("owner_bypass"):
        return False
    return office_ui.get("user") is not None


def charge_current_user(amount: int, reason: str) -> None:
    if not billing_enabled():
        return
    user = office_ui.get("user")
    if not user:
        raise RuntimeError("Войдите в аккаунт, чтобы тратить кредиты")
    new_bal = billing.charge(user["id"], amount, reason)
    user["credits"] = new_bal
    office_ui["user"] = user
    office.log(f"Кредиты −{amount} ({reason}). Остаток {new_bal}")


def genapi_text_complete(messages: list[dict]) -> str | None:
    if not office.genapi_ready():
        office.log("GenAPI не настроен, текст взять негде")
        return None
    parts = []
    for message in messages:
        content = message.get("content")
        if isinstance(content, list):
            content = "\n".join(
                item.get("text", "")
                for item in content
                if isinstance(item, dict)
            )
        parts.append(f"{message.get('role')}: {content}")
    prompt = "\n\n".join(parts)[-24000:]
    hard = len(prompt) > 8000 or "сложн" in prompt.lower()
    network = "gpt-4-1" if hard else "deepseek-v4-1-flash"
    try:
        created = genapi_post_network(network, {"prompt": prompt, "model": "standard"})
        request_id = created.get("request_id") or created.get("id")
        if not request_id:
            office.log(f"GenAPI текст без id: {created}")
            return None
        finished = genapi_wait_result(request_id, timeout_sec=120)
        raw = finished.get("result")
        if isinstance(raw, list):
            raw = "\n".join(str(x) for x in raw)
        text = strip_service_markup(raw or "")
        if text:
            office.log(f"Текст через GenAPI `{network}`")
            charge_current_user(TEXT_MESSAGE_CREDITS * (3 if hard else 1), f"Текст GenAPI {network}")
        return text or None
    except Exception as error:
        office.log(f"GenAPI текст: {error}")
        return None


def is_video_request(text: str) -> bool:
    value = safe_text(text).lower()
    return bool(re.search(r"\b(видео|ролик|клип|видеоролик)\b", value))


def run_video_generation(user_text: str) -> str:
    if not office.genapi_ready():
        raise RuntimeError("Видео делает GenAPI. Вставьте ключ GenAPI в подключениях.")
    designer = agent_start("designer", "🎨 Дизайнер заказывает видео в GenAPI…")
    network = "kling"
    if re.search(r"сложн|качеств|кино|реклам", user_text.lower()):
        network = "minimax-video"
    payload = {"prompt": user_text, "model": "standard"}
    created = genapi_post_network(network, payload)
    request_id = created.get("request_id") or created.get("id")
    if not request_id:
        raise RuntimeError(f"GenAPI не принял видео-запрос: {created}")
    finished = genapi_wait_result(request_id, timeout_sec=300)
    urls = extract_genapi_file_urls(finished)
    if not urls:
        raise RuntimeError("GenAPI не вернул файл видео")
    local_path = download_to_uploads(urls[0])
    cost = GENAPI_VIDEO_COST.get(network, 80.0)
    charge_current_user(video_credits(cost), f"Видео {network}")
    caption = f"Видео готово.\n\nМодель GenAPI: `{network}`\n\nФайл: `{local_path}`"
    add_chat_message("assistant", caption, "Директор → дизайнер → GenAPI видео", image=local_path)
    office.learn(designer, user_text, caption)
    agent_done("designer", "🎨 Видео готово")
    return caption


def is_topic_list_request(text: str) -> bool:
    """Жёстко: просили список тем/заголовков, а не статью и не выбор номера."""
    value = re.sub(r"\s+", " ", safe_text(text).lower())
    if re.search(r"(напиши|написать|покажи)\s+(полную\s+)?стать", value):
        return False
    if re.search(
        r"(предложи|придумай|дай|составь|подбери|покажи|нужно|нужны).{0,60}"
        r"(\d+|пять|три|четыре|шесть|семь|восемь|десять).{0,30}"
        r"(тем|заголовк|вариант)",
        value,
    ):
        return True
    if re.search(r"(\d+|пять)\s+(тем|заголовков|вариантов)\s+(для\s+)?(публикац|сайт|блог)", value):
        return True
    if re.search(r"(темы|заголовки)\s+для\s+(публикац|сайт|блог)", value):
        return True
    if "список тем" in value or "список заголовков" in value or "варианты тем" in value:
        return True
    return False


def is_code_request(text: str) -> bool:
    value = safe_text(text).lower()
    return bool(re.search(r"программ|скрипт|калькулятор|python|\bкод\b", value))


def is_publish_command(text: str) -> bool:
    value = safe_text(text).lower()
    clean_val = re.sub(
        r"^(?:да|отлично|супер|хорошо|принято|готово|класс|замечательно|отличная статья|отличный вариант)[!,.\s]+",
        "",
        value,
    ).strip()
    publish_keywords = [
        "публикуй", "опубликуй", "опубликовать", "выкладывай", "заливай",
        "публикация", "выложить на сайт", "залить на сайт", "выложи на сайт",
        "залей на сайт", "публикуй ее", "публикуй её", "опубликуй ее", "опубликуй её",
        "опубликуй статью", "публикуй статью", "публикуй эту статью", "опубликуй эту статью",
    ]
    if any(kw in value for kw in publish_keywords) or any(kw in clean_val for kw in publish_keywords):
        return True
    return clean_val in {"да", "pub", "publish", "публикуй", "опубликуй"}


def detect_intent(text: str) -> str:
    value = re.sub(r"\s+", " ", safe_text(text).lower()).strip()
    if is_publish_command(value):
        return "publish"
    if is_topic_list_request(text):
        return "topic_research"
    option_match = re.search(
        r"(?:^|\b)(?:выбираю|выберу|давай|хочу|тема|вариант|номер|№)?\s*(\d{1,2})\s*(?:вариант|тема|номер|вариант интересный)?(?:\b|$)",
        value,
    )
    if option_match and office.session.get("last_options"):
        return "select_option"

    topic_markers = [
        "на выбор", "список статей", "список тем", "жду список",
        "предложи темы", "предложи стат", "придумай темы", "придумай 3",
        "придумай 5", "варианты тем", "варианты стат", "идеи стат",
        "еще 5 тем", "ещё 5 тем",
        "5 заголовков", "5 тем", "5 вариантов", "три заголовка",
        "список заголовков", "придумай заголовки", "подбери темы",
        "подбери заголовки", "направление", "давай публикацию",
        "будем публиковать", "покажи заголовки", "покажи варианты",
        "список вариантов", "выберу какой", "выберем какой",
    ]
    if any(marker in value for marker in topic_markers):
        return "topic_research"
    if re.search(r"(предложи|придумай|дай|составь)\s+\d+\s+(тем|заголовк|вариант)", value):
        return "topic_research"
    if re.search(r"\d+\s+(тем|заголовков|вариантов)", value) and "статью" not in value:
        return "topic_research"

    if re.search(r"направлени[ею]\s+\w+", value) and (
        "заголовк" in value or "тем" in value or "стать" in value or "публикац" in value
    ):
        return "topic_research"

    edit_markers = [
        "измени", "исправь", "добавь", "добавить", "убери", "удали из статьи",
        "замени", "перепиши", "сократи", "расширь", "сделай короче",
        "сделай подробнее", "нужно указывать", "нужно добавить",
        "статья хорошая, но", "в этой статье", "к этой статье",
        "в текущей статье", "в этот текст", "поменяй в статье",
    ]
    if get_current_document() and any(marker in value for marker in edit_markers):
        return "edit_document"

    write_markers = [
        "напиши статью", "написать статью", "покажи полную статью",
        "покажи статью полностью", "подготовь полную статью", "создай статью",
        "раскрой эту тему", "напиши по этой теме", "покажи полностью",
        "эту статью покажи полностью", "покажи всю статью целиком",
    ]
    if any(marker in value for marker in write_markers):
        return "write_article"

    if (
        office.session.get("selected_option")
        and any(
            marker in value
            for marker in [
                "покажи её", "покажи ее", "напиши её", "напиши ее",
                "готовь статью", "покажи статью",
            ]
        )
    ):
        return "write_article"

    return "general"


def requested_options_count(text: str) -> int:
    value = safe_text(text).lower()
    patterns = [
        r"(?:придумай|предложи|дай|составь|покажи)\s+(\d+)",
        r"(\d+)\s+(?:тем|статей|вариантов|заголовков)",
    ]
    for pattern in patterns:
        match = re.search(pattern, value)
        if match:
            return max(1, min(int(match.group(1)), 10))
    return 5


def requested_category(text: str) -> str:
    raw = safe_text(text)
    raw_lower = raw.lower()

    patterns = [
        r"направлени[ею]\s+([а-яёa-z0-9\s]+?)(?:\s*[,.!?]|\\s+(?:покажи|придумай|сделай|давай|и\\s+я|выберу)|\\s*$)",
        r"категори[юи]\s+[«\"']?([^,.\n\"»']+)",
        r"по\s+категории\s+[«\"']?([^,.\n\"»']+)",
        r"тема\s+[«\"']?([^,.\n\"»']+)",
        r"на\s+тему\s+[«\"']?([^,.\n\"»']+)",
        r"про\s+([а-яёa-z0-9\- ]{3,40})$",
    ]
    extracted = ""
    for pattern in patterns:
        match = re.search(pattern, raw, flags=re.I)
        if match:
            extracted = match.group(1).strip()
            extracted = re.split(
                r"\s+(?:предварительно|сначала|на основе|покажи|придумай|сделай|давай|и\s+я|выберу)",
                extracted, maxsplit=1, flags=re.I
            )[0]
            break

    candidate = extracted.strip() or raw_lower

    category_map = office.config.get("category_map") or {}
    for key, proper_name in category_map.items():
        if key in candidate.lower():
            return proper_name

    try:
        page_path = safe_text(
            office.config.get("articles_page_path")
        ) or "src/pages/BlogPage.tsx"
        page_data = github_get_file_data(page_path)
        existing_articles = extract_articles_from_blog_page(page_data["content"])
        existing_cats = {
            a.get("category"): a.get("category")
            for a in existing_articles
            if a.get("category")
        }
        for proper_name in existing_cats.keys():
            if proper_name.lower() in candidate.lower():
                return proper_name
    except Exception:
        pass

    if candidate:
        return candidate[:1].upper() + candidate[1:80]
    return "Статьи"


# ============================================================
# ДИРЕКТОР: ПЛАН И ПРИЁМКА
# ============================================================

DIRECTOR_PLAN_PROMPT = """
Ты директор. Пользователь пишет только тебе. Разбери ПОСЛЕДНЕЕ сообщение
в контексте диалога. Верни ТОЛЬКО JSON-объект без markdown:
{
  "understood": "одна фраза: что именно просили",
  "format": "list|article|code|edit|publish|analysis|other",
  "count": 0,
  "agent": "writer|seo|coder|designer|analyst",
  "brief": "точное ТЗ исполнителю: формат, число пунктов, что НЕ делать",
  "accept": "как проверить, что ответ совпал с запросом"
}
Правила:
- «предложи 5 тем» → format=list, count=5, agent=seo или writer, brief: только список из 5 тем, без статьи.
- «напиши программу / калькулятор / смету монтажа окон как программу» → format=code, agent=coder, brief: код программы, не текстовая смета.
- «напиши статью» → format=article, agent=writer.
- «опубликуй» → format=publish, agent=coder.
- Уточнение/правка текущего результата → format=edit.
count = число из запроса или 0.
agent выбирай по сути, не по привычному сценарию офиса.
""".strip()


def director_plan(user_text: str) -> dict:
    office.set_agent_status("ceo", "working")
    office.set_activity("thinking", "ceo", "Директор разбирает ваш запрос…")
    office.save()

    messages = [
        {"role": "system", "content": DIRECTOR_PLAN_PROMPT},
        *get_recent_conversation(limit=16),
        {
            "role": "user",
            "content": (
                "ПОСЛЕДНИЙ ЗАПРОС ПОЛЬЗОВАТЕЛЯ (выполнить буквально):\n"
                + safe_text(user_text)
            ),
        },
    ]
    raw = ask_llm(messages, temperature=0.1) or ""
    data = first_json_object(raw) or {}

    fmt = safe_text(data.get("format")).lower() or "other"
    agent = safe_text(data.get("agent")).lower()
    if agent not in ROLES:
        agent = "analyst"
        if fmt == "code":
            agent = "coder"
        elif fmt == "article":
            agent = "writer"
        elif fmt == "list":
            agent = "seo"
        elif fmt == "edit":
            agent = "seo"
        elif fmt == "publish":
            agent = "coder"

    try:
        count = int(data.get("count") or 0)
    except Exception:
        count = 0
    count = max(0, min(count, 20))

    brief = safe_text(data.get("brief")) or safe_text(user_text)
    understood = safe_text(data.get("understood")) or safe_text(user_text)[:240]
    accept = safe_text(data.get("accept")) or "Результат должен совпадать с формулировкой пользователя."

    low = safe_text(user_text).lower()
    if re.search(r"\d+\s*(тем|заголовк|вариант)", low) or ("предложи" in low and "тем" in low):
        if fmt not in {"publish", "edit"}:
            fmt = "list"
            count = count or requested_options_count(user_text)
            brief = (
                f"Пользователь просит ИМЕННО СПИСОК из {count} тем/вариантов. "
                f"Не пиши статью. Не пиши один развёрнутый текст. "
                f"Верни ровно {count} пунктов.\n\nИсходный запрос:\n{user_text}"
            )
            agent = "seo"

    if re.search(r"программ|скрипт|калькулятор|python|код", low) and fmt != "publish":
        fmt = "code"
        agent = "coder"
        brief = (
            "Нужна именно программа/код (можно с пояснением запуска). "
            "Не подменяй текстовой сметой или статьёй.\n\n"
            f"Исходный запрос:\n{user_text}"
        )

    office.session["last_intent"] = fmt
    office.session["last_agent"] = agent
    office.save()
    office.log(f"Директор понял: {understood} | format={fmt} | agent={agent} | count={count}")
    return {
        "understood": understood,
        "format": fmt,
        "count": count,
        "agent": agent,
        "brief": brief,
        "accept": accept,
        "user_text": safe_text(user_text),
    }


def director_review(plan: dict, agent_result: str) -> str:
    office.set_agent_status("ceo", "working")
    office.set_activity("thinking", "ceo", "Директор сверяет результат с вашим запросом…")
    office.save()

    ceo = office.state["agents"]["ceo"]
    review_prompt = (
        f"{ceo.get('playbook')}\n\n"
        "Сверь работу исполнителя с исходным запросом пользователя.\n"
        "Если результат РЕШАЕТ запрос — верни его, слегка вычитав, без отчёта.\n"
        "Если НЕ решает (попросили 5 тем, а пришла 1 статья; попросили программу, а пришла смета) — "
        "САМ исправь ответ так, чтобы он буквально выполнял запрос. "
        "Не пиши «я директор», не пиши ход работы."
    )
    payload = (
        f"ИСХОДНЫЙ ЗАПРОС:\n{plan.get('user_text')}\n\n"
        f"КАК ДИРЕКТОР ПОНЯЛ:\n{plan.get('understood')}\n\n"
        f"ФОРМАТ: {plan.get('format')}, КОЛ-ВО: {plan.get('count')}\n"
        f"КРИТЕРИЙ ПРИЁМКИ:\n{plan.get('accept')}\n\n"
        f"ОТВЕТ ИСПОЛНИТЕЛЯ:\n{agent_result}"
    )
    messages = [
        {"role": "system", "content": review_prompt},
        *get_recent_conversation(limit=12),
        {"role": "user", "content": payload},
    ]
    reviewed = strip_service_markup(ask_llm(messages, temperature=0.15) or "")
    if not reviewed:
        reviewed = strip_service_markup(agent_result)

    count = int(plan.get("count") or 0)
    if plan.get("format") == "list" and count:
        items = re.findall(r"(?m)^\s*(?:\d+[\.\)]\s+|[-*]\s+).+", reviewed)
        if len(items) < count:
            fix = ask_llm(
                [
                    {
                        "role": "system",
                        "content": (
                            f"Перепиши ответ как нумерованный список РОВНО из {count} пунктов. "
                            "Без статьи и без вступления."
                        ),
                    },
                    {"role": "user", "content": reviewed[:20000]},
                ],
                temperature=0.1,
            ) or reviewed
            reviewed = strip_service_markup(fix)

    office.learn(ceo, plan.get("user_text") or "", reviewed)
    office.set_agent_status("ceo", "done")
    office.set_activity("done", "ceo", "Директор принял работу")
    office.save()
    return reviewed


# ============================================================
# ВЫПОЛНЕНИЕ АГЕНТОВ
# ============================================================

def agent_start(agent_id: str, label: str) -> dict:
    agent = office.ensure_agent(agent_id)
    office.reset_agents_idle(except_id=agent_id)
    office.set_agent_status("ceo", "idle")
    office.set_agent_status(agent_id, "assigned")
    office.set_activity("handoff", agent_id, f"Передано → {agent['emoji']} {agent['name']}")
    office.save()
    time.sleep(0.35)
    office.set_agent_status(agent_id, "working")
    office.set_activity("working", agent_id, label)
    office.save()
    return agent


def agent_done(agent_id: str, label: str) -> None:
    office.set_agent_status(agent_id, "done")
    office.set_activity("done", agent_id, label)
    office.save()


def run_agent_text(agent_id: str, task: str, previous: str = "", attachments: list[dict] | None = None, recent_context: bool = True) -> tuple[str, str]:
    attachments = attachments or []
    agent = office.ensure_agent(agent_id)
    company = office.config.get("company_name", "Вектор Комфорта")
    geography = office.config.get("company_geo", "")
    system_prompt = (
        f"Ты — {agent['name']}. Должность: {agent['role']}.\n\n"
        f"Твой протокол:\n{agent.get('playbook', '')}\n\n"
        "Обязательные правила:\n"
        "1. Выполняй именно последнее задание пользователя.\n"
        "2. Учитывай контекст текущего чата.\n"
        "3. Не подменяй задачу шаблонным ответом.\n"
        "4. Не показывай внутренние рассуждения.\n"
        "5. Не создавай XML, DSML и вызовы инструментов.\n"
        "6. Не обещай сделать работу позже.\n"
        "7. Пиши понятным русским языком.\n"
        f"8. Компания: {company}.\n"
        f"9. География: {geography}.\n"
        "10. Не придумывай цены, скидки, частотность и факты.\n"
    )
    messages = [{"role": "system", "content": system_prompt}]
    if recent_context:
        messages.append({
            "role": "system",
            "content": (
                "Контекст чата ниже — только для смысла. "
                "Главное — текущее ТЗ. Не подменяй его шаблоном."
            ),
        })
        messages.extend(get_recent_conversation(limit=8))
    user_text = safe_text(task)
    if previous:
        user_text += "\n\nМАТЕРИАЛ ПРЕДЫДУЩЕГО ЭТАПА:\n" + previous[:50000]
    attachment_text = attachments_note(attachments)
    if attachment_text:
        user_text += "\n\n" + attachment_text
    content = (
        vision_parts(user_text, attachments)
        if any(item.get("kind") == "image" for item in attachments)
        else user_text
    )
    messages.append({"role": "user", "content": content})
    raw = ask_llm(messages) or ""
    clean = strip_service_markup(raw)
    if not clean:
        clean = "Не удалось получить содержательный ответ. Проверьте подключение к нейросети."
    office.learn(agent, task, clean)
    summary = (
        f"Исполнитель: {agent['name']}.\n"
        "Задача обработана с учётом текущего диалога.\n"
        "Внутренние служебные данные в основной ответ не выведены."
    )
    return clean, summary


# ============================================================
# ПОДБОР ТЕМ
# ============================================================

def parse_topic_options(raw: str, expected_count: int) -> list[dict]:
    data = first_json_array(raw)
    if not data:
        return []
    options = []
    for item in data:
        if not isinstance(item, dict):
            continue
        title = safe_text(item.get("title"))
        if not title:
            continue
        queries = item.get("queries") or []
        if not isinstance(queries, list):
            queries = [safe_text(queries)]
        options.append({
            "title": title,
            "reason": safe_text(item.get("reason")),
            "queries": [safe_text(q) for q in queries if safe_text(q)][:8],
            "sales_angle": safe_text(item.get("sales_angle")),
            "category": safe_text(item.get("category")),
        })
    return options[:expected_count]


def render_topic_options(options: list[dict], category: str) -> str:
    lines = [f"## Темы на выбор — категория «{category}»"]
    for index, option in enumerate(options, 1):
        lines.append(f"\n### {index}. {option['title']}")
        if option.get("reason"):
            lines.append(option["reason"])
        if option.get("queries"):
            queries = ", ".join(f"«{q}»" for q in option["queries"])
            lines.append(f"**Запросы и намерения:** {queries}")
        if option.get("sales_angle"):
            lines.append("**Продающая логика:** " + option["sales_angle"])
    lines.append("\nНапишите номер выбранной темы. Например: **2**.")
    return "\n".join(lines)


def run_topic_research(user_text: str) -> str:
    count = requested_options_count(user_text)
    category = requested_category(user_text)
    category = normalize_category_for_publish(category)

    office.set_agent_status("ceo", "working")
    office.set_activity("thinking", "ceo", "Директор проверяет задачу и сайт…")
    office.save()
    agent = agent_start("seo", "📈 SEO-специалист изучает статьи и спрос…")

    articles_path = safe_text(office.config.get("articles_path")) or "src/data/articlesData.ts"
    existing = []
    source_note = ""
    try:
        file_data = github_get_file_data(articles_path)
        source = file_data["content"]
        existing = extract_existing_articles(source)
        source_note = articles_path
    except Exception:
        try:
            page_path = safe_text(office.config.get("articles_page_path")) or "src/pages/BlogPage.tsx"
            page_data = github_get_file_data(page_path)
            existing = extract_articles_from_blog_page(page_data["content"])
            source_note = page_path
        except Exception as error:
            source_note = f"сайт недоступен ({error})"

    suggest_seed = f"{category} зимой проблема ремонт установка"
    suggestions = keyword_suggest(suggest_seed)

    company = office.config.get("company_name", "Вектор Комфорта")
    geography = office.config.get("company_geo", "")

    prompt = (
        f"Ты SEO-аналитик компании «{company}».\n"
        f"География работ: {geography}.\n\n"
        "СТРОГИЕ ПРАВИЛА ОТВЕТА:\n"
        "1. Верни ТОЛЬКО JSON-массив, без какого-либо текста до или после.\n"
        "2. Не пиши вступление, заключение, пояснения или отчёты.\n"
        "3. Не используй markdown-блоки ``` — только чистый JSON.\n"
        "4. Не говори «у меня нет доступа к CMS» — это техническая задача подбора заголовков.\n"
        "5. Не пиши полные статьи, только заголовки.\n"
        f"6. Верни РОВНО {count} объектов в массиве.\n"
        "7. Каждый заголовок должен быть конкретным, продающим и подводить к обращению в компанию.\n"
        "8. Исключи дубли и близкие темы к существующим публикациям.\n"
        f"9. Категория всех тем: «{category}».\n\n"
        "Формат каждого объекта:\n"
        "{\n"
        '  "title": "Конкретный продающий заголовок",\n'
        f'  "category": "{category}",\n'
        '  "reason": "Почему тема актуальна и не дублирует сайт (1-2 предложения)",\n'
        '  "queries": ["поисковый запрос 1", "поисковый запрос 2"],\n'
        '  "sales_angle": "Как статья приведёт к обращению в компанию"\n'
        "}\n"
    )

    user_content = (
        f"ЗАДАНИЕ ПОЛЬЗОВАТЕЛЯ:\n{user_text}\n\n"
        "СУЩЕСТВУЮЩИЕ СТАТЬИ НА САЙТЕ (не дублируй):\n"
        f"{render_existing_articles(existing)}\n\n"
        "ПОИСКОВЫЕ ПОДСКАЗКИ (для вдохновения, не выдумывай частотность):\n"
        f"{suggestions[:10000]}"
    )

    raw = ask_llm([
        {"role": "system", "content": prompt},
        {"role": "user", "content": user_content},
    ], temperature=0.25) or ""

    options = parse_topic_options(raw, count)

    if len(options) != count:
        correction = ask_llm([
            {
                "role": "system",
                "content": (
                    f"Верни только JSON-массив ровно из {count} объектов. "
                    "Никакого текста кроме JSON. Категория: " + category
                ),
            },
            {"role": "user", "content": raw[:20000]},
        ], temperature=0.1) or ""
        options = parse_topic_options(correction, count)

    if len(options) != count:
        raise RuntimeError(f"Не удалось получить ровно {count} тем. Повторите запрос.")

    office.session["last_options"] = options
    office.session["selected_option"] = None
    office.session["last_intent"] = "topic_research"
    office.session["last_agent"] = "seo"

    public_text = render_topic_options(options, category)

    details = (
        "Запрос распознан как подбор тем для публикации.\n\n"
        f"- источник: `{source_note}`;\n"
        f"- найдено публикаций: {len(existing)};\n"
        f"- категория: {category};\n"
        f"- подготовлено вариантов: {count};\n"
        "- темы готовы к выбору и последующей публикации на сайт."
    )

    add_chat_message("assistant", public_text, details)
    office.learn(agent, user_text, public_text)
    agent_done("seo", f"📈 Подготовлено {count} тем")
    return public_text


# ============================================================
# ВЫБОР ТЕМЫ
# ============================================================

def select_saved_option(text: str) -> dict | None:
    options = office.session.get("last_options") or []
    if not options:
        return None
    value = safe_text(text).lower()
    selected = None
    number = None
    if not is_topic_list_request(text):
        match = re.search(r"\d+", value)
        if match:
            number = int(match.group())
            if 1 <= number <= len(options):
                selected = dict(options[number - 1])
                selected["number"] = number
    if selected is None:
        best_score = 0
        for index, option in enumerate(options, 1):
            title = safe_text(option.get("title")).lower()
            score = 0
            for word in re.findall(r"[а-яёa-z0-9]{4,}", title):
                if word in value:
                    score += len(word)
            if score > best_score:
                best_score = score
                selected = dict(option)
                selected["number"] = index
        if best_score < 4:
            selected = None
    if not selected:
        return None
    office.session["selected_option"] = selected
    office.session["last_intent"] = "select_option"
    office.session["last_agent"] = "ceo"
    office.save()
    return selected


def handle_option_selection(text: str) -> str:
    selected = select_saved_option(text)
    if not selected:
        options = office.session.get("last_options") or []
        if options:
            result = f"В последнем списке доступны номера от 1 до {len(options)}."
        else:
            result = "В этом чате пока нет списка вариантов. Сначала попросите подготовить темы."
        add_chat_message("assistant", result)
        return result

    return run_article_pipeline(
        f"Напиши полную статью по выбранной теме №{selected['number']}: {selected['title']}",
        attachments=[],
    )


# ============================================================
# СОЗДАНИЕ СТАТЬИ
# ============================================================

def run_article_pipeline(user_text: str, attachments: list[dict] | None = None) -> str:
    attachments = attachments or []
    if is_topic_list_request(user_text):
        return run_topic_research(user_text)
    selected = office.session.get("selected_option")
    if selected:
        category = selected.get("category") or requested_category(user_text)
        category = normalize_category_for_publish(category)
        writer_task = (
            "Подготовь полную продающую статью по выбранной теме.\n\n"
            f"Тема: {selected.get('title')}\n"
            f"Категория: {category}\n"
            f"Обоснование: {selected.get('reason')}\n"
            "Запросы и намерения: "
            f"{', '.join(selected.get('queries') or [])}\n"
            "Продающая логика: "
            f"{selected.get('sales_angle')}\n\n"
            f"Дополнительная просьба пользователя: {user_text}\n\n"
            "Не придумывай цены, скидки, проценты и статистику. "
            "Выдай только статью в Markdown, начиная с H1."
        )
    else:
        category = requested_category(user_text)
        category = normalize_category_for_publish(category)
        writer_task = (
            f"{user_text}\n\n"
            "Подготовь только полную статью в Markdown. "
            "Начни с заголовка H1. Не добавляй отчёт."
        )

    writer = agent_start("writer", "✍️ Автор готовит материал…")
    writer_raw, _ = run_agent_text("writer", writer_task, attachments=attachments, recent_context=True)
    writer_body = extract_article_body(writer_raw)
    if not looks_like_article(writer_body):
        raise RuntimeError("Автор не вернул полноценную статью")
    writer_draft = save_draft(extract_article_title(writer_body), writer_body)
    office.learn(writer, writer_task, writer_body)
    agent_done("writer", "✍️ Автор передал текст Главреду")

    seo = agent_start("seo", "📈 Главред редактирует статью…")
    company = office.config.get("company_name", "Вектор Комфорта")
    geography = office.config.get("company_geo", "")
    seo_task = (
        "Отредактируй переданную статью.\n\n"
        "Правила:\n"
        "1. Сохрани тему и смысл статьи.\n"
        "2. Сделай язык понятным для обычного человека.\n"
        "3. Улучши H1/H2/H3 и читаемость.\n"
        "4. Не придумывай цены, скидки и статистику.\n"
        f"5. Естественно укажи компанию «{company}».\n"
        f"6. География обращения: {geography}.\n"
        "7. Добавь уместный призыв обратиться в компанию.\n"
        "8. Верни только полную статью в Markdown.\n"
        "9. Не пиши отчёт о правках."
    )
    seo_raw, _ = run_agent_text("seo", seo_task, previous=writer_body, recent_context=False)
    final_body = extract_article_body(seo_raw)
    if not looks_like_article(final_body):
        raise RuntimeError("Главред не вернул полноценную статью")
    title = extract_article_title(final_body, selected.get("title") if selected else "Новая статья")
    document = remember_document(final_body, title=title, source="writer_seo", category=category)
    final_draft = save_draft(document["title"], document["body"])

    office.session["last_job"] = {
        "key": "seo",
        "task": user_text,
        "report": document["body"],
        "name": seo["name"],
        "file": final_draft,
    }
    office.session["last_intent"] = "write_article"
    office.session["last_agent"] = "seo"

    details = (
        "Ход работы:\n\n"
        "- Директор использовал выбранную тему из текущего чата;\n"
        "- Автор подготовил исходный материал;\n"
        "- Главред сохранил тему и отредактировал текст;\n"
        f"- учтена география: {geography};\n"
        f"- черновик Автора: `{writer_draft}`;\n"
        f"- финальный файл: `{final_draft}`."
    )

    add_chat_message("assistant", document["body"], details)
    office.learn(seo, seo_task, final_body)
    agent_done("seo", "📈 Финальная статья готова")
    return document["body"]


# ============================================================
# РЕДАКТИРОВАНИЕ ТЕКУЩЕЙ СТАТЬИ
# ============================================================

def edit_current_document(instruction: str) -> str:
    document = get_current_document()
    if not document:
        raise RuntimeError("В текущем чате нет статьи для редактирования")
    office.set_agent_status("ceo", "working")
    office.set_activity("thinking", "ceo", "Директор сопоставляет правку с текущей статьёй…")
    office.save()
    seo = agent_start("seo", "📈 Главред вносит правки в текущую статью…")
    company = office.config.get("company_name", "Вектор Комфорта")
    geography = office.config.get("company_geo", "")
    system_prompt = f"""
Ты профессиональный редактор компании «{company}».
Тебе передана текущая статья и конкретная правка пользователя.
Обязательные правила:
1. Редактируй именно переданную статью.
2. Не меняй её тему.
3. Не создавай новую статью.
4. Не заменяй материал общим текстом о подрядчике.
5. Сохрани полезные разделы исходной версии.
6. Выполни все указания пользователя.
7. География компании: {geography}.
8. Не придумывай цены, скидки, статистику и факты.
9. Верни полную обновлённую статью.
10. Не пиши отчёт, объяснение и список изменений.
11. Ответ должен начинаться с H1.
""".strip()
    raw = ask_llm([
        {"role": "system", "content": system_prompt},
        {
            "role": "user",
            "content": (
                "ПРАВКА ПОЛЬЗОВАТЕЛЯ:\n"
                f"{instruction}\n\n"
                "ТЕКУЩАЯ СТАТЬЯ:\n"
                f"{document['body']}"
            ),
        },
    ], temperature=0.2) or ""
    updated = extract_article_body(raw)
    if not looks_like_article(updated):
        raise RuntimeError("Редактор не вернул полноценную обновлённую статью")
    old_title = document.get("title") or ""
    new_title = extract_article_title(updated, old_title or "Новая статья")
    old_slug = document.get("slug") or ""
    expected_slug = slugify(old_title or new_title)
    if not old_slug or old_slug == expected_slug:
        new_slug = slugify(new_title)
    else:
        new_slug = old_slug
    updated_document = {
        **document,
        "title": new_title,
        "slug": new_slug,
        "body": updated,
        "source": "edited",
        "updated_at": datetime.now().isoformat(timespec="seconds"),
    }
    office.session["current_document"] = updated_document
    office.session["last_article"] = dict(updated_document)
    office.session["current_article"] = updated
    office.session["last_intent"] = "edit_document"
    office.session["last_agent"] = "seo"
    draft = save_draft(new_title, updated)
    details = (
        "Ход работы:\n\n"
        f"- отредактирована текущая статья «{old_title}»;\n"
        f"- указание пользователя: {instruction};\n"
        "- тема исходной статьи сохранена;\n"
        "- новая посторонняя статья не создавалась;\n"
        f"- обновлённый черновик: `{draft}`."
    )
    add_chat_message("assistant", updated, details)
    office.learn(seo, instruction, updated)
    agent_done("seo", "📈 Правки внесены")
    return updated


# ============================================================
# ОБЫЧНЫЙ СВЯЗНЫЙ ДИАЛОГ
# ============================================================

def choose_general_agent(text: str, attachments: list[dict]) -> str:
    value = text.lower()
    if any(item.get("kind") in {"image", "video"} for item in attachments):
        return "designer"
    if re.search(r"\bкод\b|python|typescript|react|github|файл|программ|калькулятор", value):
        return "coder"
    if re.search(r"\bseo\b|сео|аудит|продвиж|ключев|запрос", value):
        return "seo"
    if re.search(r"анализ|стратег|исслед", value):
        return "analyst"
    return "analyst"


def run_general_task(text: str, attachments: list[dict]) -> str:
    agent_id = choose_general_agent(text, attachments)
    agent = agent_start(
        agent_id,
        f"{ROLES[agent_id]['emoji']} {ROLES[agent_id]['name']} выполняет задачу…",
    )
    result, process = run_agent_text(agent_id, text, attachments=attachments, recent_context=True)
    draft = save_draft(agent["name"], result)
    details = (
        f"Ход работы:\n\n"
        f"- Директор передал задачу специалисту «{agent['name']}»;\n"
        "- специалист использовал контекст текущего чата;\n"
        "- задача не заменялась шаблонным сценарием;\n"
        f"- результат сохранён: `{draft}`.\n\n"
        f"{process}"
    )
    add_chat_message("assistant", result, details)
    office.session["last_intent"] = "general"
    office.session["last_agent"] = agent_id
    office.session["last_job"] = {
        "key": agent_id,
        "task": text,
        "report": result,
        "name": agent["name"],
        "file": draft,
    }
    agent_done(agent_id, f"{agent['emoji']} {agent['name']} завершил работу")
    return result


# ============================================================
# ПЛАНИРОВЩИК ДИРЕКТОРА
# ============================================================

def open_publish_preview():
    document = get_last_chat_article() or get_current_document() or office.session.get("pending_publish")
    if isinstance(document, dict):
        document = heal_document(document)
    if not document or not document.get("body"):
        add_chat_message(
            "assistant",
            "В текущем чате нет готовой статьи для публикации. Выберите тему и сгенерируйте текст.",
        )
        return None
    office.session["pending_publish"] = dict(document)
    office.session["current_document"] = dict(document)
    office.save()
    office.set_activity("done", "ceo", "Готов предпросмотр публикации")
    office.save()
    return {"type": "publish_preview", "article": document}


def looks_like_option_choice(text: str) -> bool:
    options = office.session.get("last_options") or []
    if not options or is_topic_list_request(text):
        return False
    value = safe_text(text).lower()
    if is_image_request(text) or is_publish_command(text):
        return False
    if re.search(r"\b\d{1,2}\b", value):
        return True
    if re.search(r"выбираю|выберу|нравится|давай эту|эту тему|вариант", value):
        return True
    for option in options:
        title = safe_text(option.get("title")).lower()
        for word in re.findall(r"[а-яёa-z0-9]{5,}", title):
            if word in value:
                return True
    return False


def process_message(text: str, attachments: list[dict] | None = None):
    attachments = attachments or []

    if is_topic_list_request(text):
        office.log("Директор: список тем, статья не пишется")
        return run_topic_research(text)

    if looks_like_option_choice(text) and not is_image_request(text) and not is_publish_command(text):
        return handle_option_selection(text)

    if is_video_request(text):
        office.log("Директор: видео → GenAPI")
        return run_video_generation(text)

    if is_image_request(text):
        office.log("Директор: картинка → дизайнер → GenAPI")
        run_image_generation(text)
        if is_publish_command(text):
            return open_publish_preview()
        return "image"

    plan = director_plan(text)
    fmt = plan["format"]

    if fmt == "publish" or is_publish_command(text):
        document = get_last_chat_article() or get_current_document() or office.session.get("pending_publish")
        if isinstance(document, dict):
            document = heal_document(document)
        if not document or not document.get("body"):
            add_chat_message(
                "assistant",
                "В текущем чате нет готовой статьи для публикации. Выберите тему и сгенерируйте текст.",
            )
            return None
        office.session["pending_publish"] = dict(document)
        office.session["current_document"] = dict(document)
        office.save()
        office.set_activity("done", "ceo", "Готов предпросмотр публикации")
        office.save()
        return {"type": "publish_preview", "article": document}

    if office.session.get("last_options") and re.search(r"\b\d{1,2}\b", safe_text(text)):
        if fmt in {"edit", "other", "article"} or detect_intent(text) == "select_option":
            return handle_option_selection(text)

    if fmt == "edit" and get_current_document():
        return edit_current_document(text)

    if fmt == "list" and plan["count"] and re.search(r"тем|заголовк|публикац|стат", safe_text(text).lower()):
        return run_topic_research(text)

    if fmt == "article":
        return run_article_pipeline(text, attachments)

    agent_id = plan["agent"]
    if agent_id not in ROLES:
        agent_id = choose_general_agent(text, attachments)
    agent = agent_start(
        agent_id,
        f"{ROLES[agent_id]['emoji']} {ROLES[agent_id]['name']} выполняет ТЗ директора…",
    )
    result, process = run_agent_text(
        agent_id,
        plan["brief"],
        attachments=attachments,
        recent_context=True,
    )
    office.learn(agent, plan["brief"], result)
    agent_done(agent_id, f"{agent['emoji']} {agent['name']} вернул работу директору")

    final = director_review(plan, result)
    draft = save_draft(agent["name"], final)
    details = (
        "Ход работы:\n\n"
        f"- Директор понял запрос: {plan['understood']};\n"
        f"- ТЗ передано специалисту «{agent['name']}»;\n"
        "- результат вернулся директору и сверен с вашим запросом;\n"
        f"- файл: `{draft}`.\n\n"
        f"{process}"
    )
    add_chat_message("assistant", final, details)
    office.session["last_job"] = {
        "key": agent_id,
        "task": text,
        "report": final,
        "name": agent["name"],
        "file": draft,
    }
    return final


def process_user_message(text: str, attachments: list[dict] | None = None):
    attachments = attachments or []
    intent = detect_intent(text)
    if intent != "publish":
        office.session["pending_publish"] = None

    shown = safe_text(text)
    if attachments:
        attachment_names = " ".join(
            f"[{item.get('kind')}: {item.get('name')}]"
            for item in attachments
        )
        shown = (f"{shown}\n{attachment_names}" if shown else attachment_names)

    if office.session.get("title") == "Новый чат" and shown:
        office.session["title"] = shown[:30] + "..." if len(shown) > 30 else shown

    add_chat_message("user", shown or "(вложение)")
    office.log("Пользователь: " + (shown[:100] or "вложение"))
    office.set_agent_status("ceo", "working")
    office.set_activity("thinking", "ceo", "Директор изучает задачу…")
    office.save()
    if billing_enabled() and not is_image_request(text) and not is_video_request(text):
        charge_current_user(TEXT_MESSAGE_CREDITS, "Текстовый запрос")
    return process_message(text, attachments)


# ============================================================
# ARTICLES DATA: БЕЗОПАСНАЯ ВСТАВКА (DEPRECATED)
# ============================================================

class SourceFormatError(RuntimeError):
    pass


def find_matching_delimiter(source: str, start: int) -> int:
    opening = source[start]
    pairs = {"{": "}", "[": "]"}
    if opening not in pairs:
        raise SourceFormatError("Неизвестный открывающий символ")
    stack = [pairs[opening]]
    quote = None
    escaped = False
    index = start + 1
    while index < len(source):
        char = source[index]
        if quote:
            if escaped:
                escaped = False
            elif char == "\\":
                escaped = True
            elif char == quote:
                quote = None
            index += 1
            continue
        if char in ('"', "'", "`"):
            quote = char
            index += 1
            continue
        if char == "/" and index + 1 < len(source):
            next_char = source[index + 1]
            if next_char == "/":
                newline = source.find("\n", index + 2)
                if newline < 0:
                    return len(source) - 1
                index = newline + 1
                continue
            if next_char == "*":
                comment_end = source.find("*/", index + 2)
                if comment_end < 0:
                    return -1
                index = comment_end + 2
                continue
        if char in pairs:
            stack.append(pairs[char])
        elif char in {"}", "]"}:
            if not stack or char != stack[-1]:
                return -1
            stack.pop()
            if not stack:
                return index
        index += 1
    return -1


def find_articles_data_bounds(source: str) -> tuple[int, int, str]:
    try:
        patterns = [
            r"\barticlesData\s*(?::[^=]+)?\s*=\s*([{\[])",
            r"\bconst\s+articlesData\s*=\s*([{\[])",
        ]
        match = None
        for pattern in patterns:
            match = re.search(pattern, source)
            if match:
                break
        if not match:
            return 0, len(source) - 1, "["
        start = match.start(1)
        opening = match.group(1)
        end = find_matching_delimiter(source, start)
        if end < 0:
            return start, start, opening
        return start, end, opening
    except Exception:
        return 0, len(source) - 1, "["


def article_slug_exists(source: str, slug: str) -> bool:
    escaped = re.escape(slug)
    return bool(re.search(
        rf"""(?:"{escaped}"|'{escaped}'|{escaped})\s*:""",
        source,
    ))


def markdown_to_site_content(markdown: str) -> list[dict]:
    result = []
    list_items = []
    paragraph_lines = []

    def flush_list():
        nonlocal list_items
        if list_items:
            result.append({"type": "list", "items": list_items})
            list_items = []

    def flush_paragraph():
        nonlocal paragraph_lines
        if paragraph_lines:
            result.append({"type": "p", "text": " ".join(paragraph_lines).strip()})
            paragraph_lines = []

    for raw_line in markdown.splitlines():
        line = raw_line.strip()
        if not line:
            flush_paragraph()
            flush_list()
            continue
        heading = re.match(r"^#{1,6}\s+(.+)$", line)
        if heading:
            flush_paragraph()
            flush_list()
            result.append({"type": "h", "text": heading.group(1).strip()})
            continue
        list_match = re.match(r"^(?:[-*]|\d+\.)\s+(.+)$", line)
        if list_match:
            flush_paragraph()
            list_items.append(list_match.group(1).strip())
            continue
        flush_list()
        if line.startswith(">"):
            line = line.lstrip("> ").strip()
        paragraph_lines.append(line)

    flush_paragraph()
    flush_list()
    return result


def build_article_record(article: dict) -> tuple[str, dict]:
    body = extract_article_body(article.get("body") or "")
    if not looks_like_article(body):
        raise RuntimeError("Нет полноценного текста статьи")
    title = safe_text(article.get("title")) or extract_article_title(body)
    slug = safe_text(article.get("slug")) or slugify(title)
    category = safe_text(article.get("category")) or "Статьи"

    paragraphs = []
    for line in body.splitlines():
        line = line.strip()
        if not line:
            continue
        if line.startswith("#"):
            continue
        if re.match(r"^(?:[-*]|\d+\.)\s+", line):
            continue
        paragraphs.append(re.sub(r"[*_`]", "", line))

    excerpt = " ".join(paragraphs)[:280]
    words = len(re.findall(r"\b\w+\b", body))
    reading_time = max(1, math.ceil(words / 180))

    tags = [category, "Иркутск"]
    if category.lower() == "окна":
        tags.extend(["пластиковые окна", "Ангарск", "Шелехов"])

    record = {
        "date": datetime.now().strftime("%Y-%m-%d"),
        "title": title,
        "category": category,
        "excerpt": excerpt,
        "metaDescription": excerpt[:158],
        "summary": excerpt,
        "tags": list(dict.fromkeys(tags)),
        "readingTime": f"{reading_time} мин",
        "content": markdown_to_site_content(body),
        "faq": [],
    }
    return slug, record


def insert_article_into_source(source: str, slug: str, record: dict) -> str:
    _, end, opening = find_articles_data_bounds(source)
    if article_slug_exists(source, slug):
        raise RuntimeError(f"Статья со слагом `{slug}` уже существует")
    record_json = json.dumps(record, ensure_ascii=False, indent=2)
    before = source[:end].rstrip()
    after = source[end:]
    separator = "" if before.endswith(("{", "[", ",")) else ","
    if opening == "{":
        addition = (
            separator + "\n  "
            + json.dumps(slug, ensure_ascii=False)
            + ": " + record_json + "\n"
        )
    else:
        addition = separator + "\n" + record_json + "\n"
    result = before + addition + after
    find_articles_data_bounds(result)
    return result


# ============================================================
# BlogPage.tsx: парсинг и вставка карточки
# ============================================================

def find_articles_array_bounds(source: str) -> tuple[int, int]:
    match = re.search(
        r"(?:const|let|var)\s+articles\s*(?::\s*[A-Za-z_<>,\[\]\s]+)?\s*=\s*\[",
        source,
    )
    if not match:
        match = re.search(r"\barticles\s*=\s*\[", source)
    if not match:
        raise SourceFormatError("В файле BlogPage.tsx не найден массив articles")
    start = match.end() - 1
    end = find_matching_delimiter(source, start)
    if end < 0:
        raise SourceFormatError("BlogPage.tsx: незакрытый массив articles")
    return start, end


def extract_articles_from_blog_page(source: str) -> list[dict]:
    start, end = find_articles_array_bounds(source)
    body = source[start + 1:end]
    results = []
    pattern = re.compile(r"slug\s*:\s*['\"]([^'\"]+)['\"]", flags=re.I)
    title_pattern = re.compile(r"title\s*:\s*['\"]([^'\"]+)['\"]", flags=re.I)
    cat_pattern = re.compile(r"category\s*:\s*['\"]([^'\"]+)['\"]", flags=re.I)
    chunks = re.split(r"(?<=}),\s*(?=\{)", body)
    for chunk in chunks:
        slug_m = pattern.search(chunk)
        if not slug_m:
            continue
        title_m = title_pattern.search(chunk)
        cat_m = cat_pattern.search(chunk)
        results.append({
            "slug": slug_m.group(1).strip(),
            "title": (title_m.group(1).strip() if title_m else ""),
            "category": (cat_m.group(1).strip() if cat_m else ""),
        })
    return results


def blog_page_slug_exists(source: str, slug: str) -> bool:
    return bool(re.search(
        rf"slug\s*:\s*['\"]{re.escape(slug)}['\"]",
        source,
    ))


def build_blog_page_card(article: dict, slug: str) -> str:
    body = extract_article_body(article.get("body") or "")
    title = safe_text(article.get("title")) or extract_article_title(body)
    category = safe_text(article.get("category")) or "Статьи"

    excerpt = article.get("excerpt") or ""
    if not excerpt:
        first_paragraphs = []
        for line in body.splitlines():
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            first_paragraphs.append(re.sub(r"[*_`]", "", line))
            if len(" ".join(first_paragraphs)) > 240:
                break
        excerpt = " ".join(first_paragraphs)[:240]

    words = len(re.findall(r"\b\w+\b", body))
    reading_time = max(1, math.ceil(words / 180))
    date = datetime.now().strftime("%Y-%m-%d")
    title_escaped = title.replace("'", "\\'")
    excerpt_escaped = excerpt.replace("'", "\\'")

    return (
        "  {\n"
        f"    slug: '{slug}',\n"
        f"    date: '{date}',\n"
        f"    title: '{title_escaped}',\n"
        f"    excerpt: '{excerpt_escaped}',\n"
        f"    category: '{category}',\n"
        f"    icon: 'FileText',\n"
        f"    readTime: '{reading_time} мин',\n"
        "  }"
    )


def insert_card_into_blog_page(source: str, slug: str, card_text: str) -> str:
    if blog_page_slug_exists(source, slug):
        raise RuntimeError(f"Карточка со слагом `{slug}` уже есть в BlogPage.tsx")
    start, end = find_articles_array_bounds(source)
    before = source[:end].rstrip()
    after = source[end:]
    separator = "" if before.endswith(",") else ","
    addition = separator + "\n" + card_text + "\n"
    return before + addition + after


# ============================================================
# BlogArticle.tsx: парсинг и вставка текста
# ============================================================

def find_article_content_object(source: str) -> tuple[int, int]:
    match = re.search(
        r"(?:const|let|var)\s+articleContent\s*(?::\s*[A-Za-z_<>,\s]+)?\s*=\s*\{",
        source,
    )
    if not match:
        match = re.search(r"\barticleContent\s*=\s*\{", source)
    if not match:
        raise SourceFormatError("В файле BlogArticle.tsx не найден articleContent")
    start = match.end() - 1
    end = find_matching_delimiter(source, start)
    if end < 0:
        raise SourceFormatError("BlogArticle.tsx: незакрытый объект articleContent")
    return start, end


def extract_article_content_slugs(source: str) -> list[str]:
    start, end = find_article_content_object(source)
    body = source[start + 1:end]
    return re.findall(r"['\"]([a-z0-9_-]+)['\"]\s*:\s*\{", body, flags=re.I)


def blog_article_slug_exists(source: str, slug: str) -> bool:
    return bool(re.search(
        rf"['\"]?{re.escape(slug)}['\"]?\s*:\s*\{{",
        source,
    ))


def build_article_content_entry(article: dict, slug: str) -> str:
    body = extract_article_body(article.get("body") or "")
    title = safe_text(article.get("title")) or extract_article_title(body)

    content_parts = []
    list_buffer: list[str] = []

    def flush_list():
        nonlocal list_buffer
        if list_buffer:
            content_parts.append({"type": "list", "items": list_buffer})
            list_buffer = []

    for raw_line in body.splitlines():
        line = raw_line.strip()
        if not line:
            flush_list()
            continue
        heading = re.match(r"^(#{1,6})\s+(.+)$", line)
        if heading:
            flush_list()
            content_parts.append({
                "type": "h",
                "level": len(heading.group(1)),
                "text": heading.group(2).strip(),
            })
            continue
        list_match = re.match(r"^(?:[-*]|\d+\.)\s+(.+)$", line)
        if list_match:
            list_buffer.append(list_match.group(1).strip())
            continue
        flush_list()
        text = re.sub(r"[*_`]", "", line)
        if text.startswith(">"):
            text = text.lstrip("> ").strip()
        content_parts.append({"type": "p", "text": text})

    flush_list()

    if not content_parts:
        raise RuntimeError("Не удалось разобрать content статьи")

    paragraphs_text = " ".join(
        p["text"] for p in content_parts if p["type"] == "p"
    )
    excerpt = (article.get("excerpt") or paragraphs_text)[:240]
    meta_description = excerpt[:158]
    summary = excerpt

    content_json = json.dumps(content_parts, ensure_ascii=False, indent=6)
    content_json_indented = "\n".join(
        "    " + ln for ln in content_json.splitlines()
    )

    title_escaped = title.replace("'", "\\'")
    excerpt_escaped = excerpt.replace("'", "\\'")
    meta_escaped = meta_description.replace("'", "\\'")
    summary_escaped = summary.replace("'", "\\'")

    return (
        f"  '{slug}': {{\n"
        f"    content: {content_json_indented},\n"
        f"    faq: [],\n"
        f"    excerpt: '{excerpt_escaped}',\n"
        f"    summary: '{summary_escaped}',\n"
        f"    metaDescription: '{meta_escaped}',\n"
        f"    title: '{title_escaped}',\n"
        "  }"
    )


def insert_entry_into_blog_article(source: str, slug: str, entry_text: str) -> str:
    if blog_article_slug_exists(source, slug):
        raise RuntimeError(f"Запись со слагом `{slug}` уже есть в BlogArticle.tsx")
    start, end = find_article_content_object(source)
    before = source[:end].rstrip()
    after = source[end:]
    separator = "" if before.endswith(",") else ","
    addition = separator + "\n" + entry_text + "\n"
    return before + addition + after


# ============================================================
# VERCEL
# ============================================================

def vercel_query_params() -> dict:
    params = {
        "projectId": safe_text(office.config.get("vercel_project_id")),
        "limit": "20",
    }
    team_id = safe_text(office.config.get("vercel_team_id"))
    if team_id:
        params["teamId"] = team_id
    return params


def get_vercel_deployments() -> list[dict]:
    token = safe_text(office.config.get("vercel_token"))
    project_id = safe_text(office.config.get("vercel_project_id"))
    if not token or not project_id:
        return []
    url = "https://api.vercel.com/v6/deployments?" + urllib.parse.urlencode(vercel_query_params())
    data = api_json(
        "GET",
        url,
        headers={"Authorization": f"Bearer {token}"},
        timeout=VERCEL_TIMEOUT,
    )
    if not isinstance(data, dict):
        return []
    return data.get("deployments") or []


def deployment_commit_sha(deployment: dict) -> str:
    meta = deployment.get("meta") or {}
    return safe_text(
        meta.get("githubCommitSha")
        or meta.get("githubCommitSHA")
        or meta.get("gitCommitSha")
    )


def latest_ready_commit() -> str:
    try:
        deployments = get_vercel_deployments()
    except Exception:
        return ""
    for deployment in deployments:
        state = safe_text(deployment.get("readyState") or deployment.get("state")).upper()
        target = safe_text(deployment.get("target")).lower()
        if (state in {"READY", "LIVE"} and target in {"production", ""}):
            sha = deployment_commit_sha(deployment)
            if sha:
                return sha
    return ""


def latest_production_state() -> str:
    try:
        deployments = get_vercel_deployments()
    except Exception:
        return ""
    for deployment in deployments:
        target = safe_text(deployment.get("target")).lower()
        if target in {"production", ""}:
            return safe_text(deployment.get("readyState") or deployment.get("state")).upper()
    return ""


def verify_vercel_deployment(commit_sha: str) -> dict:
    if not office.vercel_ready():
        return {"status": "not_configured", "message": "Vercel Token или Project ID не настроены"}
    deadline = time.time() + VERCEL_WAIT_SECONDS
    while time.time() < deadline:
        try:
            deployments = get_vercel_deployments()
        except Exception as error:
            return {"status": "error", "message": f"Ошибка Vercel API: {error}"}
        for deployment in deployments:
            deployment_sha = deployment_commit_sha(deployment)
            if not deployment_sha:
                continue
            if not (
                deployment_sha == commit_sha
                or deployment_sha.startswith(commit_sha[:7])
                or commit_sha.startswith(deployment_sha[:7])
            ):
                continue
            state = safe_text(deployment.get("readyState") or deployment.get("state")).upper()
            raw_url = safe_text(deployment.get("url"))
            deploy_url = (raw_url if raw_url.startswith("http") else ("https://" + raw_url if raw_url else ""))
            if state in {"READY", "LIVE"}:
                return {"status": "ready", "url": deploy_url, "deployment_id": deployment.get("uid")}
            if state in {"ERROR", "CANCELED"}:
                return {
                    "status": "error",
                    "url": deploy_url,
                    "deployment_id": deployment.get("uid"),
                    "message": f"Vercel завершил сборку со статусом {state}",
                }
        time.sleep(5)
    return {
        "status": "timeout",
        "message": f"Vercel не подтвердил деплой за {VERCEL_WAIT_SECONDS} секунд",
    }


# ============================================================
# ПУБЛИКАЦИЯ И ОТКАТ
# ============================================================

def publish_article(article: dict) -> dict:
    if not office.github_ready():
        raise RuntimeError("GitHub не настроен")

    page_path = (
        safe_text(office.config.get("articles_page_path"))
        or "src/pages/BlogPage.tsx"
    )
    content_path = (
        safe_text(office.config.get("articles_content_path"))
        or "src/pages/BlogArticle.tsx"
    )

    office.ensure_agent("coder")
    office.set_agent_status("coder", "working")
    office.set_activity(
        "working",
        "coder",
        "💻 Кодер публикует статью в BlogPage.tsx и BlogArticle.tsx…",
    )
    office.save()

    page_data = github_get_file_data(page_path)
    content_data = github_get_file_data(content_path)

    page_source = page_data["content"]
    content_source = content_data["content"]

    page_base = page_source
    content_base = content_source
    recovery_note = ""

    if (
        office.vercel_ready()
        and latest_production_state() in {"ERROR", "CANCELED"}
    ):
        ready_sha = latest_ready_commit()
        if ready_sha:
            try:
                page_base = github_get_file_data(page_path, ref=ready_sha)["content"]
                content_base = github_get_file_data(content_path, ref=ready_sha)["content"]
                recovery_note = (
                    "Использованы версии из последнего "
                    f"успешного Vercel-коммита `{ready_sha[:8]}`."
                )
            except Exception:
                page_base = page_source
                content_base = content_source

    article_for_record = dict(article)
    if article_for_record.get("category"):
        article_for_record["category"] = normalize_category_for_publish(
            article_for_record["category"]
        )

    slug, record = build_article_record(article_for_record)

    base_slug = slug
    counter = 2
    while (
        blog_page_slug_exists(page_base, slug)
        or blog_article_slug_exists(content_base, slug)
    ):
        slug = f"{base_slug}-{counter}"
        counter += 1
        if counter > 100:
            raise RuntimeError("Слишком много дублей slug. Переименуйте статью.")

    if slug != base_slug:
        office.log(f"Slug занят, использую: {slug}")

    card_text = build_blog_page_card(article_for_record, slug)
    entry_text = build_article_content_entry(article_for_record, slug)

    new_page_source = insert_card_into_blog_page(page_base, slug, card_text)
    new_content_source = insert_entry_into_blog_article(content_base, slug, entry_text)

    find_articles_array_bounds(new_page_source)
    find_article_content_object(new_content_source)

    pushed_page = github_put_file(
        path=page_path,
        content=new_page_source,
        sha=page_data["sha"],
        message=f"Blog: добавить карточку «{record['title']}»",
    )
    page_commit_sha = safe_text((pushed_page.get("commit") or {}).get("sha"))

    content_data_after = github_get_file_data(content_path)

    pushed_content = github_put_file(
        path=content_path,
        content=new_content_source,
        sha=content_data_after["sha"],
        message=f"BlogArticle: добавить текст «{record['title']}»",
    )
    content_commit_sha = safe_text((pushed_content.get("commit") or {}).get("sha"))

    commit_sha = content_commit_sha or page_commit_sha
    if not commit_sha:
        raise RuntimeError("GitHub не вернул SHA коммита")

    page_verify = github_get_file_data(page_path)
    content_verify = github_get_file_data(content_path)

    if not blog_page_slug_exists(page_verify["content"], slug):
        raise RuntimeError(f"После записи slug `{slug}` не найден в BlogPage.tsx")
    if not blog_article_slug_exists(content_verify["content"], slug):
        raise RuntimeError(f"После записи slug `{slug}` не найден в BlogArticle.tsx")

    cards_before = len(extract_articles_from_blog_page(page_base))
    cards_after = len(extract_articles_from_blog_page(page_verify["content"]))

    article_count_msg = (
        f"Карточек в BlogPage.tsx: {cards_before} → {cards_after} "
        f"(+{cards_after - cards_before})"
    )

    vercel = verify_vercel_deployment(commit_sha)
    page_url = safe_text(page_verify.get("html_url"))

    if vercel["status"] == "ready":
        public = (
            "## Сайт обновлён\n\n"
            f"**Статья:** {record['title']}\n\n"
            f"**Категория:** `{record['category']}`\n\n"
            f"**Slug:** `{slug}`\n\n"
            f"**BlogPage.tsx:** {page_url}\n\n"
            f"**Vercel:** {vercel.get('url') or 'Ready'}\n\n"
            f"_{article_count_msg}_"
        )
        details = (
            f"BlogPage.tsx: `{page_path}`\n\n"
            f"BlogArticle.tsx: `{content_path}`\n\n"
            f"Commits: `{page_commit_sha[:8]}`, `{content_commit_sha[:8]}`\n\n"
            f"Slug записан: `{slug}`\n\n"
            f"Категория записана: `{record['category']}`\n\n"
            f"{article_count_msg}\n\n"
            "Vercel: деплой подтверждён со статусом Ready."
        )
        if recovery_note:
            details += "\n\n" + recovery_note

        office.set_agent_status("coder", "done")
        office.set_activity("done", "coder", "💻 Сайт успешно обновлён")
        office.save()
        return {
            "github_ok": True,
            "site_ok": True,
            "public": public,
            "details": details,
        }

    if vercel["status"] == "error":
        latest_page = github_get_file_data(page_path)
        latest_content = github_get_file_data(content_path)

        try:
            rollback_page = github_put_file(
                path=page_path,
                content=page_base,
                sha=latest_page["sha"],
                message="Откат BlogPage.tsx (ошибка Vercel)",
            )
            rollback_page_sha = safe_text((rollback_page.get("commit") or {}).get("sha"))
        except Exception:
            rollback_page_sha = "FAILED"

        try:
            latest_content_again = github_get_file_data(content_path)
            rollback_content = github_put_file(
                path=content_path,
                content=content_base,
                sha=latest_content_again["sha"],
                message="Откат BlogArticle.tsx (ошибка Vercel)",
            )
            rollback_content_sha = safe_text((rollback_content.get("commit") or {}).get("sha"))
        except Exception:
            rollback_content_sha = "FAILED"

        public = (
            "## Статья не опубликована\n\n"
            "GitHub принял изменения, но сборка Vercel "
            "завершилась ошибкой. Изменения автоматически "
            "отменены, чтобы не оставлять сайт в сломанном состоянии."
        )
        details = (
            f"Неудачные commits: `{page_commit_sha[:8]}`, "
            f"`{content_commit_sha[:8]}`\n\n"
            f"Rollback commits: `{rollback_page_sha[:8] if len(rollback_page_sha) >= 8 else rollback_page_sha}`, "
            f"`{rollback_content_sha[:8] if len(rollback_content_sha) >= 8 else rollback_content_sha}`\n\n"
            f"Vercel: {vercel.get('message')}\n\n"
            f"Деплой: {vercel.get('url') or 'ссылка отсутствует'}"
        )

        office.set_agent_status("coder", "error")
        office.set_activity("done", "coder", "Ошибка Vercel — изменения отменены")
        office.save()
        return {
            "github_ok": True,
            "site_ok": False,
            "public": public,
            "details": details,
        }

    if vercel["status"] == "not_configured":
        public = (
            "## Файлы обновлены в GitHub\n\n"
            f"**Статья:** {record['title']}\n\n"
            f"**Категория:** `{record['category']}`\n\n"
            f"**Slug:** `{slug}`\n\n"
            "Проверка Vercel не настроена."
        )
    else:
        public = (
            "## GitHub обновлён, Vercel не подтвердил\n\n"
            f"**Статья:** {record['title']}\n\n"
            f"**Категория:** `{record['category']}`\n\n"
            f"**Slug:** `{slug}`\n\n"
            f"{vercel.get('message') or 'Нет подтверждения Vercel.'}"
        )

    details = (
        f"BlogPage.tsx: `{page_path}`\n\n"
        f"BlogArticle.tsx: `{content_path}`\n\n"
        f"Commits: `{page_commit_sha[:8]}`, `{content_commit_sha[:8]}`\n\n"
        f"Slug записан: `{slug}`\n\n"
        f"Категория записана: `{record['category']}`\n\n"
        f"{article_count_msg}\n\n"
        f"Vercel: {vercel['status']}."
    )

    office.set_agent_status("coder", "done")
    office.set_activity("done", "coder", "GitHub обновлён, Vercel не подтверждён")
    office.save()
    return {
        "github_ok": True,
        "site_ok": False,
        "public": public,
        "details": details,
    }


# ============================================================
# ПРОКРУТКА
# ============================================================

async def scroll_to_bottom():
    await ui.run_javascript("""
        setTimeout(() => {
            const box = document.querySelector('.chatbox');
            if (box) {
                box.scrollTop = box.scrollHeight;
            }
        }, 120);
    """)


async def scroll_to_latest_assistant():
    await ui.run_javascript("""
        setTimeout(() => {
            const box = document.querySelector('.chatbox');
            if (!box) return;
            const answers = box.querySelectorAll('.bubble-ai');
            const target = answers[answers.length - 1];
            if (!target) return;
            const boxRect = box.getBoundingClientRect();
            const targetRect = target.getBoundingClientRect();
            box.scrollTo({
                top: box.scrollTop + targetRect.top - boxRect.top - 8,
                behavior: 'smooth',
            });
        }, 160);
    """)


async def restore_chat_position():
    await ui.run_javascript("""
        setTimeout(() => {
            const box = document.querySelector('.chatbox');
            if (!box) return;
            const key = 'office_scroll_' + window.location.pathname;
            const saved = sessionStorage.getItem(key);
            if (saved !== null) {
                box.scrollTop = Number(saved);
            }
            if (!box.dataset.scrollBound) {
                box.dataset.scrollBound = '1';
                box.addEventListener('scroll', () => {
                    sessionStorage.setItem(key, String(box.scrollTop));
                }, {passive: true});
            }
        }, 150);
    """)


async def copy_text(text: str):
    await ui.run_javascript(
        "navigator.clipboard.writeText(" + json.dumps(text) + ")"
    )
    ui.notify("Скопировано", timeout=1000)


# ============================================================
# CSS
# ============================================================

ui.add_head_html("""
<style>
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&display=swap');

html,body,.q-layout,.q-page,.nicegui-content{
  font-family:Manrope,Segoe UI,sans-serif!important;
  background:#070b16!important;
  height:100%!important;
  overflow:hidden!important;
}

.brand{color:#f3ead7;font-weight:800;letter-spacing:.16em;font-size:13px;}
.pill{font-size:11px;padding:4px 10px;border-radius:999px;}
.pill-off{background:#3a2a20;color:#ffb38a}
.pill-on{background:#163528;color:#8ef0b5}

.leftbar{
  width:260px;background:#0c1220;border-right:1px solid #2a3555;
  padding:12px;display:flex;flex-direction:column;gap:8px;
}

.chat-card{
  background:transparent;border:1px solid #1e2638;border-radius:8px;
  padding:8px 10px;font-size:12px;color:#d7def0;
  display:flex;align-items:center;justify-content:space-between;
  cursor:pointer;transition:.2s;
}
.chat-card:hover{border-color:#5a6e9a}
.chat-card.active{background:#2a3555;border-color:#d4a017;font-weight:600;}

.logbox{
  background:#0a101c;color:#9aa6c3;font-size:11px;white-space:pre-wrap;
  flex:1;overflow:auto;padding:8px;border-radius:10px;user-select:text;
}

.chatbox{
  flex:1 1 auto;min-height:0;overflow-y:auto;
  padding:8px 14px;user-select:text!important;
  scroll-behavior:smooth;overflow-anchor:none;
}

.bubble{border-radius:14px;padding:12px 14px;margin:8px 0;user-select:text!important;scroll-margin-top:8px;}
.bubble-ai{background:#162033;border:1px solid #2c3b5c;}
.bubble-me{background:#2a2318;border:1px solid #6a5428;}

.process-details{background:#101628;border:1px solid #293553;border-radius:10px;margin-top:10px;}

.composer{flex:0 0 auto;background:#101628;border-top:1px solid #2a3555;padding:8px 10px;}
.composer textarea{max-height:90px!important}

.attachment-chip{display:inline-block;background:#1c243c;color:#cdd6ee;padding:4px 8px;border-radius:999px;font-size:11px;}

.stage{
  height:100%;background:radial-gradient(1200px 600px at 50% 40%,#0f1730 0%,#0a0d18 60%);
  border-left:1px solid #2a3555;padding:10px;overflow:hidden;
  display:flex;flex-direction:column;min-width:280px;
}

.banner{
  background:linear-gradient(90deg,#1a1630,#2a2318);border:1px solid #d4a01755;
  border-radius:12px;padding:8px 10px;color:#f3ead7;font-size:12px;
  margin-bottom:8px;flex:0 0 auto;transition:all .3s ease;
}
.banner.working{border-color:#d4a017;box-shadow:0 0 24px rgba(212,160,23,.25);}
.banner.done{border-color:#3ecf8e;box-shadow:0 0 24px rgba(62,207,142,.2);}

.orbit-box{position:relative;flex:1 1 auto;width:100%;min-height:240px;overflow:hidden;}

.orbit-ring,.orbit-ring2{
  position:absolute;left:50%;top:50%;border-radius:50%;
  pointer-events:none;transform:translate(-50%,-50%);transform-origin:center;
}
.orbit-ring{width:72%;padding-bottom:72%;height:0;border:1px dashed rgba(212,160,23,.28);animation:spin 60s linear infinite;}
.orbit-ring2{width:48%;padding-bottom:48%;height:0;border:1px solid rgba(120,160,255,.12);animation:spin 90s linear infinite reverse;}

.beams{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:1;}
.beam-flow{stroke-dasharray:8 10;animation:flow 1.2s linear infinite;}

.ceo-center{
  position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:132px;
  z-index:5;text-align:center;background:radial-gradient(circle at 50% 20%,#3a2a18,#16141c 70%);
  border:1px solid #c9a227;border-radius:22px;padding:10px 8px;
  box-shadow:0 0 40px rgba(212,160,23,.18);display:flex;flex-direction:column;
  align-items:center;justify-content:center;transition:box-shadow .3s ease,transform .3s ease;
}
.ceo-center.think{animation:glow 1.6s ease-in-out infinite;}

.sat{
  position:absolute;width:116px;transform:translate(-50%,-50%);z-index:4;
  background:#151c31;border:1px solid #3d4a6d;border-radius:16px;
  padding:8px;text-align:center;transition:border-color .3s ease,box-shadow .3s ease,transform .3s ease;
}
.sat.assigned{border-color:#d4a017;box-shadow:0 0 18px rgba(212,160,23,.35);transform:translate(-50%,-50%) scale(1.04);}
.sat.working{border-color:#d4a017;animation:pulse 1.4s ease-in-out infinite;z-index:6;}
.sat.done{border-color:#3ecf8e;box-shadow:0 0 18px rgba(62,207,142,.25);}
.sat.error{border-color:#ef5350;box-shadow:0 0 18px rgba(239,83,80,.28);}
.sat.idle{opacity:.85}

.nm{color:#fff;font-weight:800;font-size:13px;}
.status-tag{display:inline-block;margin-top:4px;padding:2px 8px;border-radius:999px;font-size:10px;font-weight:600;}
.status-idle{background:#1c243c;color:#9aa6c3}
.status-assigned{background:#3a2f10;color:#ffd76a}
.status-working{background:#3a2f10;color:#ffd76a}
.status-done{background:#12321f;color:#8ef0b5}
.status-error{background:#3a1717;color:#ff9b98}

.typing{display:inline-flex;gap:3px;margin-left:4px;vertical-align:middle;}
.typing span{width:4px;height:4px;background:#ffd76a;border-radius:50%;animation:typing 1s infinite;}
.typing span:nth-child(2){animation-delay:.15s}
.typing span:nth-child(3){animation-delay:.3s}

.preview-page{max-width:820px;margin:0 auto;padding:34px;background:#fff;color:#1c2430;border-radius:14px;line-height:1.75;}
.preview-page h1,.preview-page h2,.preview-page h3{color:#152033;line-height:1.25;}

@keyframes flow{to{stroke-dashoffset:-36}}
@keyframes spin{to{transform:translate(-50%,-50%) rotate(360deg)}}
@keyframes glow{0%,100%{box-shadow:0 0 12px rgba(212,160,23,.2)}50%{box-shadow:0 0 36px rgba(212,160,23,.55)}}
@keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(212,160,23,.35)}50%{box-shadow:0 0 24px 6px rgba(212,160,23,.28)}}
@keyframes typing{0%,60%,100%{opacity:.2;transform:translateY(0)}30%{opacity:1;transform:translateY(-3px)}}
</style>
""")


# ============================================================
# UI: ВЕРХНЯЯ ПАНЕЛЬ
# ============================================================

@ui.refreshable
def topbar():
    with ui.row().classes("w-full items-center justify-between"):
        ui.html('<div class="brand">AI OFFICE · MULTI-CHAT · v2.1</div>')
        with ui.row().classes("gap-2"):
            ui.html(
                f'<div class="pill '
                f'{"pill-on" if office.api_ready() else "pill-off"}">'
                f'{"API · подключена" if office.api_ready() else "API · нет ключа"}'
                f'</div>'
            )
            ui.html(
                f'<div class="pill '
                f'{"pill-on" if office.github_ready() else "pill-off"}">'
                f'{"GitHub · подключён" if office.github_ready() else "GitHub · не настроен"}'
                f'</div>'
            )
            ui.html(
                f'<div class="pill '
                f'{"pill-on" if office.vercel_ready() else "pill-off"}">'
                f'{"Vercel · подключён" if office.vercel_ready() else "Vercel · не настроен"}'
                f'</div>'
            )
            user = office_ui.get("user")
            if user:
                ui.html(
                    f'<div class="pill pill-on">👤 {htmlmod.escape(user["email"])} · '
                    f'{int(user.get("credits") or 0)} кр.</div>'
                )
            elif office.config.get("owner_bypass"):
                ui.html('<div class="pill pill-on">владелец · без списания</div>')


# ============================================================
# UI: ЛЕВАЯ ПАНЕЛЬ
# ============================================================

@ui.refreshable
def sidebar_panel():
    with ui.column().classes("w-full gap-2 h-full"):
        ui.button("+ НАЧАТЬ НОВЫЙ ЧАТ", on_click=start_new_chat, icon="add").props(
            "outline w-full color=amber size=sm"
        )
        ui.label("💬 ВАШИ ПРОЕКТЫ И ЧАТЫ").classes(
            "text-grey-4 font-bold text-xs mt-3 mb-1"
        )

        sessions = sorted(
            office.state["sessions"].values(),
            key=lambda item: item["id"],
            reverse=True,
        )

        with ui.column().classes("w-full gap-1").style(
            "max-height:35vh;overflow-y:auto;"
        ):
            for session in sessions:
                active = session["id"] == office.state["current_session"]
                classes = "chat-card active" if active else "chat-card"
                with ui.element("div").classes(f"{classes} w-full"):
                    ui.label(session.get("title", "Новый чат")).classes(
                        "truncate"
                    ).style("max-width:160px").on(
                        "click",
                        lambda sid=session["id"]: switch_chat(sid),
                    )
                    if len(sessions) > 1:
                        ui.button(
                            icon="close",
                            on_click=lambda sid=session["id"]: delete_chat(sid),
                        ).props("flat dense round size=xs color=grey-5").tooltip("Удалить чат")

        ui.separator().classes("bg-grey-8 my-2")
        ui.label("👥 КОМАНДА (СКИЛЛЫ)").classes("text-grey-4 font-bold text-xs")

        for aid, agent in office.state["agents"].items():
            with ui.row().classes("w-full items-center justify-between text-xs py-1"):
                ui.html(
                    f'<span>{agent.get("emoji", "👤")} '
                    f'<b>{htmlmod.escape(agent.get("name", aid))}</b></span>'
                )
                ui.button(
                    "Правка",
                    on_click=lambda agent_id=aid: skill_dialog(agent_id),
                ).props("flat dense size=xs color=amber")

        ui.space()


@ui.refreshable
def log_view():
    logs = "\n".join(reversed(office.state["logs"][-40:]))
    ui.html('<div class="logbox">' + htmlmod.escape(logs) + "</div>")


# ============================================================
# UI: ЧАТ
# ============================================================

@ui.refreshable
def chat_view():
    messages = office.session["chat"][-60:]
    with ui.column().classes("chatbox w-full"):
        for message in messages:
            mine = message.get("role") == "user"
            message_id = message.get("id") or unique_id()
            classes = "bubble bubble-me" if mine else "bubble bubble-ai"
            with ui.element("div").classes(classes).props(f'id="message-{message_id}"'):
                with ui.row().classes("w-full justify-between items-center mb-1"):
                    ui.label("Вы" if mine else "Офис").classes(
                        "text-xs font-bold text-amber-4" if mine else "text-xs font-bold text-blue-4"
                    )
                    text_value = message.get("text") or ""
                    ui.button(
                        icon="content_copy",
                        on_click=lambda value=text_value: copy_text(value),
                    ).props("flat dense round size=sm")
                    ui.markdown(text_value).classes("text-sm")
                    image_path = message.get("image") or ""
                    if image_path and Path(image_path).exists():
                        ui.image(image_path).classes("w-full rounded-lg mt-2").style("max-width:520px")
                        ui.button(
                            "Скачать изображение",
                            icon="download",
                            on_click=lambda p=image_path: ui.download(p, filename=Path(p).name),
                        ).props("flat dense color=amber")
                    details = message.get("details")
                    if not mine and details:
                        with ui.expansion("💭 Ход работы", value=False).classes(
                            "w-full text-xs process-details"
                        ):
                            ui.markdown(details).classes("text-xs text-grey-4 p-2")


@ui.refreshable
def attachment_view():
    attachments = office_ui["attachments"]
    if not attachments:
        return
    with ui.row().classes("px-3 py-1 flex-wrap gap-1"):
        for index, item in enumerate(list(attachments)):
            ui.html(
                '<span class="attachment-chip">'
                f'{htmlmod.escape(item.get("kind", "file"))} · '
                f'{htmlmod.escape(item.get("name", "file"))}'
                '</span>'
            )
            ui.button(
                icon="close",
                on_click=lambda idx=index: remove_attachment(idx),
            ).props("flat dense round size=xs")


# ============================================================
# UI: ОРБИТА АГЕНТОВ
# ============================================================

@ui.refreshable
def stage_view():
    activity = office.state.get("activity") or {}
    target = activity.get("to") or "ceo"
    phase = activity.get("phase") or "idle"
    ceo = office.state["agents"]["ceo"]
    others = [a for a in office.state["agents"].values() if a.get("id") != "ceo"]

    banner_class = ""
    if phase in {"thinking", "handoff", "working"}:
        banner_class = " working"
    elif phase == "done":
        banner_class = " done"

    typing = (
        '<span class="typing"><span></span><span></span><span></span></span>'
        if phase in {"thinking", "handoff", "working"} else ""
    )

    ui.html(
        f'<div class="banner{banner_class}">'
        f'👔 {htmlmod.escape(activity.get("label") or "Офис ожидает задачу")}'
        f'{typing}</div>'
    )

    count = len(others)
    beams = []
    line_radius = 34

    for index, agent in enumerate(others):
        angle = math.radians((360 / max(count, 1)) * index - 90)
        x2 = 50 + line_radius * math.cos(angle)
        y2 = 50 + line_radius * math.sin(angle)
        is_target = agent["id"] == target
        active = is_target and phase in {"handoff", "working"}
        done = is_target and phase == "done"
        if active:
            color = "#d4a017"; width = "2.8"; extra = ' class="beam-flow"'
        elif done:
            color = "#3ecf8e"; width = "2"; extra = ""
        else:
            color = "rgba(90,110,150,.28)"; width = "1"; extra = ""
        beams.append(
            f'<line x1="50" y1="50" x2="{x2:.1f}" y2="{y2:.1f}" '
            f'stroke="{color}" stroke-width="{width}"{extra}/>'
        )

    svg = (
        '<svg class="beams" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">'
        + "".join(beams) + "</svg>"
    )
    think_class = " think" if phase in {"thinking", "handoff"} else ""
    satellite_radius = 36

    with ui.element("div").classes("orbit-box"):
        ui.html('<div class="orbit-ring"></div><div class="orbit-ring2"></div>' + svg)
        ceo_status = ceo.get("status_code") or "idle"
        with ui.element("div").classes("ceo-center" + think_class):
            ui.html(
                f'<div style="font-size:32px">{ceo.get("emoji", "👔")}</div>'
                f'<div class="nm">{htmlmod.escape(ceo.get("name", "Директор"))}</div>'
                f'<div class="status-tag status-{ceo_status}">'
                f'{htmlmod.escape(ceo.get("status", "на месте"))}</div>'
            )

        for index, agent in enumerate(others):
            angle = math.radians((360 / max(count, 1)) * index - 90)
            left = 50 + satellite_radius * math.cos(angle)
            top = 50 + satellite_radius * math.sin(angle)
            status = agent.get("status_code") or "idle"
            with ui.element("div").classes("sat " + status).style(
                f"left:{left:.2f}%;top:{top:.2f}%"
            ):
                dots = (
                    '<span class="typing"><span></span><span></span><span></span></span>'
                    if status == "working" else ""
                )
                ui.html(
                    f'<div style="font-size:20px">{agent.get("emoji", "👤")}</div>'
                    f'<div class="nm">{htmlmod.escape(agent.get("name", ""))}</div>'
                    f'<div class="status-tag status-{status}">'
                    f'{htmlmod.escape(agent.get("status", "ожидает"))}{dots}</div>'
                )


# ============================================================
# UI: ДИАЛОГИ
# ============================================================

def skill_dialog(agent_id: str):
    agent = office.state["agents"].get(agent_id)
    if not agent:
        return
    dialog = ui.dialog()
    with dialog, ui.card().style("width:680px;max-width:96vw;"):
        ui.label(
            f"Скилл / протокол: {agent.get('emoji', '👤')} {agent.get('name', '')}"
        ).classes("text-lg font-bold")
        area = ui.textarea(value=agent.get("playbook") or "").classes("w-full").props(
            "outlined"
        ).style("min-height:300px")

        def save_skill():
            agent["playbook"] = area.value or DEFAULT_PLAYBOOKS.get(agent_id, "")
            office.save()
            sidebar_panel.refresh()
            stage_view.refresh()
            dialog.close()
            ui.notify("Протокол сохранён")

        with ui.row():
            ui.button("Сохранить", on_click=save_skill, color="amber")
            ui.button("Закрыть", on_click=dialog.close).props("flat")
    dialog.open()


def settings_dialog():
    dialog = ui.dialog()
    with dialog, ui.card().style("width:600px;max-width:95vw;"):
        ui.label("Настройки нейросети").classes("text-lg font-bold")
        provider = ui.select(list(PROVIDERS), value=office.config.get("provider"), label="Провайдер").classes("w-full")
        api_key = ui.input("API-ключ", password=True, password_toggle_button=True,
                           value=office.config.get("api_key") or "").classes("w-full")
        base_url = ui.input("Base URL", value=office.config.get("base_url") or "").classes("w-full")
        model = ui.input("Модель", value=office.config.get("model") or "").classes("w-full")

        def save_settings():
            office.config["provider"] = provider.value
            office.config["api_key"] = safe_text(api_key.value)
            office.config["base_url"] = safe_text(base_url.value)
            office.config["model"] = safe_text(model.value)
            preset = PROVIDERS.get(provider.value, {})
            if not office.config["base_url"]:
                office.config["base_url"] = preset.get("base_url") or ""
            if not office.config["model"]:
                office.config["model"] = preset.get("model") or ""
            office.save()
            topbar.refresh()
            dialog.close()
            ui.notify("Настройки сохранены")

        with ui.row():
            ui.button("Сохранить", on_click=save_settings, color="amber")
            ui.button("Закрыть", on_click=dialog.close).props("flat")
        return dialog


def auth_dialog():
    dialog = ui.dialog()
    with dialog, ui.card().style("width:420px;max-width:95vw;"):
        ui.label("Вход в Office").classes("text-lg font-bold")
        email = ui.input("Email").classes("w-full")
        password = ui.input("Пароль", password=True, password_toggle_button=True).classes("w-full")

        def do_login():
            try:
                office_ui["user"] = billing.login(email.value or "", password.value or "")
                topbar.refresh()
                dialog.close()
                ui.notify("Вход выполнен")
            except ValueError as error:
                ui.notify(str(error), type="negative")

        def do_register():
            try:
                office_ui["user"] = billing.register(email.value or "", password.value or "")
                topbar.refresh()
                dialog.close()
                ui.notify("Аккаунт создан. Купите тариф, чтобы появились кредиты.")
            except ValueError as error:
                ui.notify(str(error), type="negative")

        with ui.row():
            ui.button("Войти", on_click=do_login, color="amber")
            ui.button("Регистрация", on_click=do_register).props("outline")
            ui.button("Закрыть", on_click=dialog.close).props("flat")
    dialog.open()


def tariffs_dialog():
    dialog = ui.dialog()
    with dialog, ui.card().style("width:640px;max-width:96vw;"):
        ui.label("Тарифы (кредиты)").classes("text-lg font-bold")
        ui.markdown(
            "Картинки: себестоимость GenAPI × **4**. Текст DeepSeek × **8**. "
            "1 ₽ для вас = 10 кредитов. Пример: картинка за 5 ₽ нам → 20 ₽ / 200 кредитов вам."
        )
        for tariff in TARIFFS:
            with ui.card().classes("w-full my-1"):
                ui.label(f"{tariff['name']} — {tariff['credits']} кредитов / {tariff['price_rub']} ₽").classes("font-bold")
                ui.label(tariff["desc"]).classes("text-sm text-grey-5")

                def buy(t=tariff):
                    user = office_ui.get("user")
                    if not user:
                        ui.notify("Сначала войдите или зарегистрируйтесь", type="warning")
                        return
                    try:
                        pay = create_yookassa_payment(
                            office.config.get("yookassa_shop_id", ""),
                            office.config.get("yookassa_secret", ""),
                            t["price_rub"],
                            f"Office тариф {t['name']}",
                            office.config.get("public_url", "http://127.0.0.1:8080"),
                            {"user_id": user["id"], "tariff": t["id"]},
                        )
                        pid = billing.create_payment(user["id"], t, pay.get("id") or "")
                        url = ((pay.get("confirmation") or {}).get("confirmation_url"))
                        if url:
                            ui.notify(f"Платёж {pid}: откройте ссылку ЮKassa")
                            ui.open(url)
                        else:
                            raise RuntimeError("ЮKassa не вернула ссылку")
                    except Exception as error:
                        ui.notify(str(error), type="negative")
                        if office.config.get("owner_bypass"):
                            billing.add_credits(user["id"], t["credits"], f"Тестовое начисление {t['id']}")
                            office_ui["user"] = billing.get_user(user["id"])
                            topbar.refresh()
                            ui.notify("Тестовое начисление (режим владельца)")

                ui.button("Оплатить ЮKassa", on_click=buy, color="amber").props("dense")
        ui.button("Закрыть", on_click=dialog.close).props("flat")
    dialog.open()


def connections_dialog():
    dialog = ui.dialog()
    with dialog, ui.card().style("width:700px;max-width:96vw;"):
        ui.label("GitHub и Vercel").classes("text-lg font-bold")
        github_owner = ui.input("GitHub owner", value=office.config.get("github_owner", "")).classes("w-full")
        github_repo = ui.input("Репозиторий", value=office.config.get("github_repo", "")).classes("w-full")
        github_branch = ui.input("Ветка", value=office.config.get("github_branch", "main")).classes("w-full")
        articles_path = ui.input(
            "Файл статей (auto-generated)",
            value=office.config.get("articles_path", "src/data/articlesData.ts"),
        ).classes("w-full")
        github_token = ui.input(
            "GitHub Token", password=True, password_toggle_button=True,
            value=office.config.get("github_token", ""),
        ).classes("w-full")

        ui.separator().classes("my-1")

        articles_page_path = ui.input(
            "BlogPage.tsx (карточки)",
            value=office.config.get("articles_page_path", "src/pages/BlogPage.tsx"),
        ).classes("w-full")
        articles_content_path = ui.input(
            "BlogArticle.tsx (тексты)",
            value=office.config.get("articles_content_path", "src/pages/BlogArticle.tsx"),
        ).classes("w-full")

        ui.separator()

        vercel_token = ui.input(
            "Vercel Token", password=True, password_toggle_button=True,
            value=office.config.get("vercel_token", ""),
        ).classes("w-full")
        vercel_project = ui.input(
            "Vercel Project ID", value=office.config.get("vercel_project_id", ""),
        ).classes("w-full")
        vercel_team = ui.input(
            "Vercel Team ID — необязательно", value=office.config.get("vercel_team_id", ""),
        ).classes("w-full")

        ui.separator()

        company_name = ui.input(
            "Название компании", value=office.config.get("company_name", "Вектор Комфорта"),
        ).classes("w-full")
        company_geo = ui.input(
            "География работы", value=office.config.get("company_geo", ""),
        ).classes("w-full")

        ui.separator()
        ui.label("GenAPI — картинки, видео, запасной текст").classes("text-sm font-bold")
        genapi_token = ui.input(
            "GenAPI Token", password=True, password_toggle_button=True,
            value=office.config.get("genapi_token", ""),
        ).classes("w-full")
        genapi_base = ui.input(
            "GenAPI URL",
            value=office.config.get("genapi_base_url", "https://api.gen-api.ru"),
        ).classes("w-full")

        ui.separator()
        ui.label("ЮKassa — оплата тарифов").classes("text-sm font-bold")
        yookassa_shop = ui.input(
            "YooKassa shopId", value=office.config.get("yookassa_shop_id", ""),
        ).classes("w-full")
        yookassa_secret = ui.input(
            "YooKassa секрет", password=True, password_toggle_button=True,
            value=office.config.get("yookassa_secret", ""),
        ).classes("w-full")
        public_url = ui.input(
            "Публичный URL офиса (return_url)",
            value=office.config.get("public_url", "http://127.0.0.1:8080"),
        ).classes("w-full")
        owner_bypass = ui.switch(
            "Режим владельца: не списывать кредиты",
            value=bool(office.config.get("owner_bypass", True)),
        )

        def save_connections():
            office.config.update({
                "github_owner": safe_text(github_owner.value),
                "github_repo": safe_text(github_repo.value),
                "github_branch": safe_text(github_branch.value) or "main",
                "articles_path": safe_text(articles_path.value) or "src/data/articlesData.ts",
                "articles_page_path": safe_text(articles_page_path.value) or "src/pages/BlogPage.tsx",
                "articles_content_path": safe_text(articles_content_path.value) or "src/pages/BlogArticle.tsx",
                "github_token": safe_text(github_token.value),
                "vercel_token": safe_text(vercel_token.value),
                "vercel_project_id": safe_text(vercel_project.value),
                "vercel_team_id": safe_text(vercel_team.value),
                "company_name": safe_text(company_name.value) or "Вектор Комфорта",
                "company_geo": safe_text(company_geo.value),
                "genapi_token": safe_text(genapi_token.value),
                "genapi_base_url": safe_text(genapi_base.value) or "https://api.gen-api.ru",
                "yookassa_shop_id": safe_text(yookassa_shop.value),
                "yookassa_secret": safe_text(yookassa_secret.value),
                "public_url": safe_text(public_url.value) or "http://127.0.0.1:8080",
                "owner_bypass": bool(owner_bypass.value),
            })
            office.save()
            topbar.refresh()
            dialog.close()
            ui.notify("Подключения сохранены")

        with ui.row():
            ui.button("Сохранить", on_click=save_connections, color="amber")
            ui.button("Закрыть", on_click=dialog.close).props("flat")
        return dialog


def publish_preview_dialog(article: dict):
    dialog = ui.dialog()
    article = heal_document(article)
    title = article.get("title") or "Без названия"
    slug = article.get("slug") or slugify(title)
    body = article.get("body") or ""

    if article.get("category"):
        article["category"] = normalize_category_for_publish(article["category"])

    office.session["pending_publish"] = dict(article)
    office.save()

    with dialog, ui.card().style(
        "width:1050px;max-width:97vw;height:92vh;"
        "display:flex;flex-direction:column;"
    ):
        ui.label("Предпросмотр статьи перед публикацией").classes("text-h6 font-bold")
        ui.label(title).classes("text-h5 text-amber-4 font-bold")
        ui.label(f"Категория: {article.get('category')}").classes("text-grey-5 text-sm")
        ui.label(f"Предполагаемый URL: /blog/{slug}").classes("text-grey-5 text-sm")
        ui.separator()

        with ui.column().style(
            "flex:1;overflow-y:auto;padding:14px;background:#e9edf4;border-radius:12px;"
        ):
            with ui.element("article").classes("preview-page"):
                ui.markdown(body)

        ui.separator()

        with ui.row().classes("w-full justify-between"):
            ui.button("Вернуться к редактированию", on_click=dialog.close).props("flat")

            async def confirm_publish():
                dialog.close()
                notice = ui.notification("Публикую и проверяю Vercel...", spinner=True, timeout=None)
                try:
                    article_to_publish = heal_document(article)
                    result = await asyncio.wait_for(
                        asyncio.to_thread(publish_article, article_to_publish),
                        timeout=360,
                    )
                    office.session["pending_publish"] = None
                    office.save()
                    add_chat_message("assistant", result["public"], result["details"])
                    chat_view.refresh()
                    stage_view.refresh()
                    sidebar_panel.refresh()
                    log_view.refresh()
                    await scroll_to_latest_assistant()
                    if result.get("site_ok"):
                        ui.notify("Сайт обновлён", type="positive")
                    else:
                        ui.notify("Публикация сайта не подтверждена", type="warning")
                except asyncio.TimeoutError:
                    office.set_agent_status("coder", "error")
                    add_chat_message(
                        "assistant",
                        "Проверка публикации превысила лимит времени.",
                        "Операция ожидала GitHub/Vercel более 360 секунд. Проверьте последние деплои вручную.",
                    )
                    chat_view.refresh()
                    stage_view.refresh()
                    await scroll_to_latest_assistant()
                except Exception as error:
                    office.set_agent_status("coder", "error")
                    add_chat_message("assistant", "Публикация не выполнена.", f"Ошибка: {error}")
                    chat_view.refresh()
                    stage_view.refresh()
                    await scroll_to_latest_assistant()
                    ui.notify("Ошибка публикации", type="negative")
                finally:
                    notice.dismiss()
                    office.full_reset_to_idle()
                    office.save()
                    stage_view.refresh()
                    sidebar_panel.refresh()
                    log_view.refresh()

            ui.button("Опубликовать на сайт", on_click=confirm_publish, color="amber", icon="publish")
    dialog.open()


# ============================================================
# UI: СЛУЖЕБНЫЕ ОБРАБОТЧИКИ
# ============================================================

def remove_attachment(index: int):
    if 0 <= index < len(office_ui["attachments"]):
        office_ui["attachments"].pop(index)
        attachment_view.refresh()


def on_upload(event):
    try:
        raw = (event.content.read() if hasattr(event.content, "read") else event.content)
        if not isinstance(raw, (bytes, bytearray)):
            raw = bytes(raw)
        item = save_upload(bytes(raw), event.name or "file")
        office_ui["attachments"].append(item)
        attachment_view.refresh()
        ui.notify(f"Файл добавлен: {event.name}", timeout=1500)
    except Exception as error:
        ui.notify(f"Ошибка загрузки: {error}", type="negative")


def open_workspace():
    WORKSPACE.mkdir(parents=True, exist_ok=True)
    try:
        os.startfile(str(WORKSPACE))
    except Exception as error:
        ui.notify(str(error), type="negative")


def emergency_reset():
    office_ui["busy"] = False
    office.full_reset_to_idle()
    office.log("Выполнен ручной сброс")
    office.save()
    stage_view.refresh()
    sidebar_panel.refresh()
    log_view.refresh()
    ui.notify("Офис возвращён в режим ожидания", type="warning")


def refresh_all():
    topbar.refresh()
    sidebar_panel.refresh()
    log_view.refresh()
    chat_view.refresh()
    attachment_view.refresh()
    stage_view.refresh()


# ============================================================
# СБОРКА ИНТЕРФЕЙСА
# ============================================================

def build():
    settings = settings_dialog()
    connections = connections_dialog()

    with ui.column().classes("w-full").style(
        "height:100vh;max-height:100vh;overflow:hidden;"
    ):
        with ui.row().classes("w-full items-center justify-between").style(
            "flex:0 0 auto;background:#101628;padding:6px 12px;"
            "border-bottom:1px solid #2a3555;"
        ):
            topbar()
            with ui.row().classes("gap-2"):
                ui.button("Папка", on_click=open_workspace, icon="folder").props("flat dense")
                ui.button("API", on_click=settings.open).props("flat dense")
                ui.button("GitHub / Vercel / Оплата", on_click=connections.open).props("flat dense")
                ui.button("Тарифы", on_click=lambda: tariffs_dialog()).props("flat dense")
                ui.button("Войти", on_click=lambda: auth_dialog()).props("flat dense")
                ui.button("Сброс", on_click=emergency_reset, icon="restart_alt").props("flat dense color=red")

        with ui.row().classes("w-full no-wrap items-stretch").style(
            "flex:1 1 auto;min-height:0;overflow:hidden;"
        ):
            with ui.column().classes("leftbar").style(
                "flex:0 0 260px;height:100%;"
            ):
                sidebar_panel()
                ui.separator().classes("bg-grey-8 my-1")
                ui.label("📋 ЖУРНАЛ ОФИСА").classes("text-grey-4 font-bold text-xs")
                log_view()

            with ui.column().style(
                "flex:1.75 1 0;min-width:0;height:100%;overflow:hidden;"
            ):
                chat_view()
                attachment_view()
                with ui.row().classes("composer w-full items-end no-wrap"):
                    picker = ui.upload(
                        label="", auto_upload=True, max_file_size=80_000_000, on_upload=on_upload,
                    ).props(
                        'accept="image/*,video/*,.pdf,.doc,.docx,.txt,.md,.csv,.xlsx,.xls,.zip,.json,.py,.ts,.tsx" '
                        "hide-upload-btn flat dense"
                    ).style("display:none")
                    ui.button("+", on_click=lambda: picker.run_method("pickFiles")).props(
                        "round unelevated"
                    ).style(
                        "min-width:44px;height:44px;font-size:22px;background:#d4a017;color:#111;"
                    ).tooltip("Добавить фото, видео или документ")

                    input_box = ui.textarea(
                        placeholder=(
                            "Поставьте задачу директору. Можно выбирать варианты номером и "
                            "просить изменить текущий результат."
                        )
                    ).classes("w-full").props("outlined dense").style("max-height:90px")

                    async def send():
                        if office_ui["busy"]:
                            ui.notify("Дождитесь завершения текущей задачи", type="warning")
                            return
                        message = safe_text(input_box.value)
                        attachments = list(office_ui["attachments"])
                        if not message and not attachments:
                            return
                        office_ui["busy"] = True
                        input_box.value = ""
                        office_ui["attachments"] = []
                        attachment_view.refresh()
                        notice = ui.notification("Офис выполняет задачу...", spinner=True, timeout=None)
                        try:
                            result = await asyncio.wait_for(
                                asyncio.to_thread(process_user_message, message, attachments),
                                timeout=420,
                            )
                            chat_view.refresh()
                            sidebar_panel.refresh()
                            log_view.refresh()
                            stage_view.refresh()
                            if (
                                isinstance(result, dict)
                                and result.get("type") == "publish_preview"
                            ):
                                publish_preview_dialog(result["article"])
                                await restore_chat_position()
                            else:
                                await scroll_to_latest_assistant()
                        except asyncio.TimeoutError:
                            add_chat_message(
                                "assistant",
                                "Задача остановлена: сервис не ответил за отведённое время.",
                                "Общий лимит выполнения: 420 секунд.",
                            )
                            chat_view.refresh()
                            await scroll_to_latest_assistant()
                        except Exception as error:
                            office.log(f"Ошибка задачи: {error}")
                            add_chat_message(
                                "assistant", "Не удалось выполнить задачу.", f"Ошибка: {error}",
                            )
                            chat_view.refresh()
                            await scroll_to_latest_assistant()
                            ui.notify("Задача завершилась ошибкой", type="negative")
                        finally:
                            notice.dismiss()
                            office_ui["busy"] = False
                            office.full_reset_to_idle()
                            office.save()
                            stage_view.refresh()
                            sidebar_panel.refresh()
                            log_view.refresh()

                    ui.button("Отправить", on_click=send, color="amber").style(
                        "min-width:118px;height:44px;flex:0 0 auto;"
                    )

            with ui.column().classes("stage").style(
                "flex:1.05 1 0;min-width:300px;height:100%;"
            ):
                ui.label("ОКРУЖЕНИЕ И АГЕНТЫ").classes("text-grey-5 text-xs font-bold")
                stage_view()

    scene_cache = {"signature": None}

    def update_live_scene():
        activity = office.state.get("activity") or {}
        signature = (
            office.state.get("current_session"),
            activity.get("phase"),
            activity.get("to"),
            activity.get("label"),
            tuple(
                (aid, agent.get("name"), agent.get("status_code"), agent.get("status"))
                for aid, agent in office.state["agents"].items()
            ),
        )
        if signature == scene_cache["signature"]:
            return
        scene_cache["signature"] = signature
        stage_view.refresh()
        sidebar_panel.refresh()
        log_view.refresh()

    ui.timer(0.45, update_live_scene)
    ui.timer(0.5, restore_chat_position, once=True)


build()

ui.run(
    native=True,
    window_size=(1520, 920),
    fullscreen=False,
    reload=False,
    title="AI Office v2.1",
    dark=True,
)
