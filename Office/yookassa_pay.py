# -*- coding: utf-8 -*-
"""Создание платежа ЮKassa. shopId и секрет — в config.json."""
from __future__ import annotations

import json
import uuid
import urllib.request
import ssl

SSL_CONTEXT = ssl.create_default_context()


def create_yookassa_payment(
    shop_id: str,
    secret_key: str,
    amount_rub: int,
    description: str,
    return_url: str,
    metadata: dict,
) -> dict:
    if not shop_id or not secret_key:
        raise RuntimeError("Не указаны YooKassa shopId и секретный ключ")
    payload = {
        "amount": {"value": f"{amount_rub:.2f}", "currency": "RUB"},
        "capture": True,
        "confirmation": {"type": "redirect", "return_url": return_url},
        "description": description[:128],
        "metadata": {str(k): str(v) for k, v in metadata.items()},
    }
    data = json.dumps(payload, ensure_ascii=False).encode("utf-8")
    req = urllib.request.Request(
        "https://api.yookassa.ru/v3/payments",
        data=data,
        method="POST",
        headers={
            "Content-Type": "application/json",
            "Idempotence-Key": str(uuid.uuid4()),
        },
    )
    import base64

    token = base64.b64encode(f"{shop_id}:{secret_key}".encode()).decode("ascii")
    req.add_header("Authorization", f"Basic {token}")
    with urllib.request.urlopen(req, timeout=30, context=SSL_CONTEXT) as resp:
        return json.loads(resp.read().decode("utf-8"))
