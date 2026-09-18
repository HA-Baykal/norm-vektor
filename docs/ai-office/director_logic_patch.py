# -*- coding: utf-8 -*-
"""
БЛОК «ДИРЕКТОР 2.0» ДЛЯ AI OFFICE.

Это НЕ отдельный запускаемый файл. Это готовый фрагмент кода, который нужно
вставить в ваш ai_office.py по инструкции из файла
«AI-OFFICE-ЛОГИКА-ДИРЕКТОРА.md» (ШАГ 4).

Вставлять его нужно ПОСЛЕ функции run_general_task(...) и ПЕРЕД разделом
«ПЛАНИРОВЩИК ДИРЕКТОРА» (def process_message).

Что делает блок:
  1. ceo_understand()   — директор через нейросеть ТОЧНО понимает, что вы
                          попросили (5 тем? статью? программу? правку?),
                          выбирает исполнителя и пишет ему чёткое ТЗ.
  2. ceo_review()       — директор принимает работу: сверяет результат с вашим
                          запросом. Если не то — либо сам исправляет, либо
                          возвращает исполнителю на доработку.
  3. ceo_remember()     — директор ведёт собственную память диалога (краткое
                          содержание + важные факты и ваши пожелания).
  4. run_directed_task()— новый «общий» сценарий: постановка → исполнитель →
                          приёмка директором → ответ вам.
"""

# ============================================================
# ДИРЕКТОР 2.0: ПОНИМАНИЕ ЗАПРОСА, ПАМЯТЬ, ПРИЁМКА РЕЗУЛЬТАТА
# ============================================================

# Какие намерения умеет различать директор и кто их выполняет по умолчанию.
CEO_INTENTS = {
    "topic_research": {"agent": "seo",      "label": "подбор тем/заголовков (список вариантов)"},
    "write_article":  {"agent": "writer",   "label": "написать полную статью"},
    "edit_document":  {"agent": "seo",      "label": "изменить текущую статью/документ"},
    "publish":        {"agent": "coder",    "label": "опубликовать готовую статью на сайт"},
    "select_option":  {"agent": "ceo",      "label": "выбор варианта из последнего списка по номеру"},
    "code":           {"agent": "coder",    "label": "программа, скрипт, калькулятор, смета, таблица, файл кода"},
    "seo":            {"agent": "seo",      "label": "SEO-аудит, ключевые запросы, мета-теги"},
    "design":         {"agent": "designer", "label": "визуал, изображения, макеты, разбор фото/видео"},
    "analysis":       {"agent": "analyst",  "label": "анализ, стратегия, план, исследование, сравнение"},
    "chat":           {"agent": "ceo",      "label": "вопрос директору, уточнение, обычный разговор"},
}


def ceo_memory_text() -> str:
    """Память директора по текущему чату — вставляется во все его промпты."""
    memory = office.session.get("ceo_memory") or {}
    lines = []
    if safe_text(memory.get("summary")):
        lines.append("КРАТКОЕ СОДЕРЖАНИЕ ДИАЛОГА: " + safe_text(memory.get("summary")))
    facts = [safe_text(f) for f in (memory.get("facts") or []) if safe_text(f)]
    if facts:
        lines.append("ВАЖНЫЕ ФАКТЫ И ПОЖЕЛАНИЯ ПОЛЬЗОВАТЕЛЯ:\n- " + "\n- ".join(facts[-15:]))
    return "\n".join(lines)


def ceo_context_text() -> str:
    """Что сейчас «лежит на столе» у директора: документ, список тем, выбранная тема."""
    lines = []
    document = office.session.get("current_document") or {}
    if document.get("body"):
        lines.append(f"В чате есть текущая статья: «{document.get('title', '')}» (категория {document.get('category', '')}).")
    options = office.session.get("last_options") or []
    if options:
        titles = "; ".join(f"{i}. {o.get('title', '')}" for i, o in enumerate(options, 1))
        lines.append(f"Последний список вариантов ({len(options)} шт.): {titles}")
    selected = office.session.get("selected_option") or {}
    if selected.get("title"):
        lines.append(f"Выбранная тема: №{selected.get('number')} «{selected.get('title')}».")
    if office.session.get("last_intent"):
        lines.append(f"Предыдущее намерение: {office.session.get('last_intent')}, исполнитель: {office.session.get('last_agent') or '—'}.")
    return "\n".join(lines) or "Документов и списков в чате пока нет."


def heuristic_plan(text: str, attachments: list[dict]) -> dict:
    """Запасной план, если нейросеть недоступна: старые правила по ключевым словам."""
    intent = detect_intent(text)
    if intent == "general":
        agent = choose_general_agent(text, attachments)
        intent = {"coder": "code", "seo": "seo", "designer": "design"}.get(agent, "analysis")
    agent = CEO_INTENTS.get(intent, CEO_INTENTS["analysis"])["agent"]
    count = requested_options_count(text) if intent == "topic_research" else None
    return {
        "intent": intent,
        "agent": agent,
        "deliverable": safe_text(text)[:200],
        "count": count,
        "brief": safe_text(text),
        "acceptance": ["Результат отвечает именно на запрос пользователя."],
        "source": "rules",
    }


def ceo_understand(text: str, attachments: list[dict] | None = None) -> dict:
    """
    ШАГ 1. Директор слушает. Нейросеть разбирает запрос и возвращает план:
    что именно нужно (deliverable), сколько (count), кому поручить (agent),
    ТЗ исполнителю (brief) и критерии приёмки (acceptance).
    """
    attachments = attachments or []
    fallback = heuristic_plan(text, attachments)
    if not office.api_ready():
        return fallback

    intents_help = "\n".join(f'- "{key}": {value["label"]}' for key, value in CEO_INTENTS.items())
    company = office.config.get("company_name", "Вектор Комфорта")
    system_prompt = (
        f"Ты — Директор AI Office компании «{company}». Пользователь общается ТОЛЬКО с тобой.\n"
        "Твоя задача сейчас — ТОЧНО понять последнее сообщение пользователя и оформить задание исполнителю.\n\n"
        "ГЛАВНЫЕ ПРАВИЛА ПОНИМАНИЯ:\n"
        "1. Делай ровно то, что просят. «Предложи 5 тем» — это СПИСОК из 5 тем, а НЕ статья. "
        "«Напиши программу/смету/калькулятор» — это КОД/ИНСТРУМЕНТ, а не текст о нём. "
        "«Напиши статью» — это ОДНА полная статья.\n"
        "2. Если пользователь называет число («5 тем», «3 варианта») — верни его в поле count.\n"
        "3. Если пользователь просит изменить/дополнить уже готовый результат — это продолжение работы, а не новая задача.\n"
        "4. Учитывай память диалога и то, что уже есть в чате.\n"
        "5. Никогда не подменяй просьбу пользователя своей идеей.\n\n"
        f"ДОПУСТИМЫЕ НАМЕРЕНИЯ (intent):\n{intents_help}\n\n"
        "ИСПОЛНИТЕЛИ (agent): seo, writer, coder, designer, analyst, ceo (ceo — отвечаешь сам, если это вопрос/уточнение).\n\n"
        "ВЕРНИ ТОЛЬКО JSON без пояснений и без ``` в формате:\n"
        "{\n"
        '  "intent": "одно из намерений",\n'
        '  "agent": "исполнитель",\n'
        '  "deliverable": "что именно должен получить пользователь, одной фразой (например: список из 5 тем статей про окна)",\n'
        '  "count": число или null,\n'
        '  "brief": "чёткое ТЗ исполнителю от твоего имени: что сделать, в каком виде, что запрещено",\n'
        '  "acceptance": ["критерий приёмки 1", "критерий приёмки 2"]\n'
        "}\n"
    )
    context_block = (
        f"{ceo_memory_text()}\n\nСОСТОЯНИЕ ЧАТА:\n{ceo_context_text()}\n\n"
        f"{attachments_note(attachments)}\n\n"
        f"ПОСЛЕДНЕЕ СООБЩЕНИЕ ПОЛЬЗОВАТЕЛЯ (его и нужно разобрать):\n{safe_text(text)}"
    ).strip()

    messages = [{"role": "system", "content": system_prompt}]
    messages.extend(get_recent_conversation(limit=12))
    messages.append({"role": "user", "content": context_block})

    raw = ask_llm(messages, temperature=0.05) or ""
    data = first_json_object(raw)
    if not isinstance(data, dict):
        office.log("Директор: не удалось разобрать план, использую правила")
        return fallback

    intent = safe_text(data.get("intent")).lower()
    if intent not in CEO_INTENTS:
        intent = fallback["intent"]
    # Защита от бессмысленных решений нейросети.
    if intent == "edit_document" and not get_current_document():
        intent = "analysis"
    if intent == "select_option" and not office.session.get("last_options"):
        intent = "chat"

    agent = safe_text(data.get("agent")).lower()
    if agent not in ROLES and agent != "ceo":
        agent = CEO_INTENTS[intent]["agent"]
    if intent in {"topic_research", "write_article", "edit_document"}:
        agent = CEO_INTENTS[intent]["agent"]  # у этих сценариев фиксированные исполнители

    count = data.get("count")
    try:
        count = int(count) if count not in (None, "", "null") else None
    except Exception:
        count = None
    if count is not None:
        count = max(1, min(count, 20))
    if intent == "topic_research" and not count:
        count = requested_options_count(text)

    acceptance = data.get("acceptance") or []
    if not isinstance(acceptance, list):
        acceptance = [safe_text(acceptance)]
    acceptance = [safe_text(a) for a in acceptance if safe_text(a)][:8]
    if not acceptance:
        acceptance = fallback["acceptance"]

    return {
        "intent": intent,
        "agent": agent,
        "deliverable": safe_text(data.get("deliverable"))[:300] or fallback["deliverable"],
        "count": count,
        "brief": safe_text(data.get("brief")) or safe_text(text),
        "acceptance": acceptance,
        "source": "llm",
    }


def build_agent_task(user_text: str, plan: dict) -> str:
    """Задание исполнителю: ТЗ директора + исходные слова пользователя + критерии."""
    lines = [
        "ЗАДАНИЕ ОТ ДИРЕКТОРА:",
        plan.get("brief") or user_text,
        "",
        f"ОЖИДАЕМЫЙ РЕЗУЛЬТАТ: {plan.get('deliverable') or '—'}",
    ]
    if plan.get("count"):
        lines.append(f"ТРЕБУЕМОЕ КОЛИЧЕСТВО: ровно {plan['count']}.")
    if plan.get("acceptance"):
        lines.append("КРИТЕРИИ ПРИЁМКИ:\n- " + "\n- ".join(plan["acceptance"]))
    lines += [
        "",
        "ДОСЛОВНЫЙ ЗАПРОС ПОЛЬЗОВАТЕЛЯ:",
        safe_text(user_text),
        "",
        "Выдай только готовый результат, без отчёта о проделанной работе.",
    ]
    return "\n".join(lines)


def ceo_review(user_text: str, plan: dict, result: str) -> dict:
    """
    ШАГ 3. Приёмка. Директор сверяет результат исполнителя с запросом.
    Возвращает {"ok": bool, "problems": [...], "can_fix": bool}.
    """
    if not office.api_ready():
        return {"ok": True, "problems": [], "can_fix": False}
    system_prompt = (
        "Ты — Директор AI Office. Ты принимаешь работу исполнителя.\n"
        "Сравни РЕЗУЛЬТАТ с ЗАПРОСОМ пользователя и критериями приёмки.\n"
        "Типичные ошибки исполнителей: сделал статью вместо списка тем; дал 1 вариант вместо 5; "
        "написал рассуждение о задаче вместо самой программы; добавил лишнее вступление или отчёт; "
        "ответил не на тот вопрос; проигнорировал уточнение пользователя.\n"
        "Будь строгим, но справедливым: мелкие стилистические различия — не ошибка.\n\n"
        "ВЕРНИ ТОЛЬКО JSON:\n"
        "{\n"
        '  "ok": true или false,\n'
        '  "problems": ["конкретная проблема 1", "..."],\n'
        '  "can_fix": true — если ты сможешь сам довести результат до нужного вида (убрать лишнее, '
        "переформатировать, сократить/дополнить), false — если нужна полная переделка исполнителем\n"
        "}\n"
    )
    user_content = (
        f"{ceo_memory_text()}\n\n"
        f"ЗАПРОС ПОЛЬЗОВАТЕЛЯ:\n{safe_text(user_text)}\n\n"
        f"ЧТО ДОЛЖНО ПОЛУЧИТЬСЯ: {plan.get('deliverable')}\n"
        f"КОЛИЧЕСТВО: {plan.get('count') or 'не задано'}\n"
        "КРИТЕРИИ ПРИЁМКИ:\n- " + "\n- ".join(plan.get("acceptance") or ["—"]) + "\n\n"
        f"РЕЗУЛЬТАТ ИСПОЛНИТЕЛЯ:\n{safe_text(result)[:40000]}"
    )
    raw = ask_llm([
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_content},
    ], temperature=0.05) or ""
    data = first_json_object(raw)
    if not isinstance(data, dict):
        return {"ok": True, "problems": [], "can_fix": False}
    problems = data.get("problems") or []
    if not isinstance(problems, list):
        problems = [safe_text(problems)]
    return {
        "ok": bool(data.get("ok", True)),
        "problems": [safe_text(p) for p in problems if safe_text(p)][:6],
        "can_fix": bool(data.get("can_fix", False)),
    }


def ceo_fix(user_text: str, plan: dict, result: str, problems: list[str]) -> str:
    """Директор сам правит результат под запрос пользователя и возвращает чистый текст."""
    system_prompt = (
        "Ты — Директор AI Office. Исполнитель сделал работу с недочётами. "
        "Приведи результат в точное соответствие запросу пользователя.\n"
        "Правила: сохрани всё полезное; убери лишнее; соблюдай требуемое количество пунктов; "
        "не выдумывай цены, скидки, статистику и факты; "
        "верни ТОЛЬКО готовый итоговый ответ для пользователя — без комментариев, без отчёта о правках."
    )
    user_content = (
        f"ЗАПРОС ПОЛЬЗОВАТЕЛЯ:\n{safe_text(user_text)}\n\n"
        f"ЧТО ДОЛЖНО ПОЛУЧИТЬСЯ: {plan.get('deliverable')}\n"
        f"КОЛИЧЕСТВО: {plan.get('count') or 'не задано'}\n"
        "НАЙДЕННЫЕ ПРОБЛЕМЫ:\n- " + "\n- ".join(problems or ["результат не соответствует запросу"]) + "\n\n"
        f"РЕЗУЛЬТАТ ИСПОЛНИТЕЛЯ:\n{safe_text(result)[:40000]}"
    )
    raw = ask_llm([
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_content},
    ], temperature=0.15) or ""
    fixed = strip_service_markup(raw)
    return fixed or result


def ceo_remember(user_text: str, plan: dict, result: str) -> None:
    """
    ШАГ 4. Память директора. После каждой задачи директор обновляет
    краткое содержание диалога и список важных фактов/пожеланий.
    """
    memory = office.session.get("ceo_memory") or {"summary": "", "facts": []}
    memory.setdefault("summary", "")
    memory.setdefault("facts", [])

    updated = False
    if office.api_ready():
        raw = ask_llm([
            {
                "role": "system",
                "content": (
                    "Ты ведёшь рабочую память директора по одному чату с пользователем. "
                    "Обнови её с учётом нового обмена. Верни ТОЛЬКО JSON:\n"
                    '{"summary": "краткое содержание всего диалога (до 600 символов)", '
                    '"facts": ["устойчивые факты и пожелания пользователя: предпочтения по стилю, '
                    'запреты, выбранные темы, ключевые решения — до 15 коротких пунктов"]}'
                ),
            },
            {
                "role": "user",
                "content": (
                    f"ТЕКУЩАЯ ПАМЯТЬ:\n{json.dumps(memory, ensure_ascii=False)}\n\n"
                    f"НОВЫЙ ЗАПРОС ПОЛЬЗОВАТЕЛЯ:\n{safe_text(user_text)[:2000]}\n\n"
                    f"КАК ПОНЯЛ ДИРЕКТОР: {plan.get('deliverable')} (намерение {plan.get('intent')}, исполнитель {plan.get('agent')})\n\n"
                    f"ЧТО ОТПРАВЛЕНО ПОЛЬЗОВАТЕЛЮ (фрагмент):\n{safe_text(result)[:3000]}"
                ),
            },
        ], temperature=0.1) or ""
        data = first_json_object(raw)
        if isinstance(data, dict):
            summary = safe_text(data.get("summary"))[:800]
            facts = data.get("facts") or []
            if not isinstance(facts, list):
                facts = [safe_text(facts)]
            facts = [safe_text(f)[:200] for f in facts if safe_text(f)][:15]
            if summary or facts:
                memory["summary"] = summary or memory["summary"]
                memory["facts"] = facts or memory["facts"]
                updated = True

    if not updated:
        memory["facts"].append(f"{now()} | запрос: {safe_text(user_text)[:120]} → {plan.get('deliverable', '')[:100]}")
        memory["facts"] = memory["facts"][-15:]

    office.session["ceo_memory"] = memory
    ceo = office.state["agents"].get("ceo")
    if ceo:
        office.learn(ceo, user_text, result)
    office.save()


def run_directed_task(text: str, attachments: list[dict], plan: dict) -> str:
    """
    ШАГ 2. Новый общий сценарий вместо run_general_task:
    директор → исполнитель → приёмка директором → (доработка) → ответ пользователю.
    """
    agent_id = plan.get("agent") or "analyst"
    if agent_id == "ceo":
        agent = office.state["agents"]["ceo"]
        office.set_agent_status("ceo", "working")
        office.set_activity("working", "ceo", "👔 Директор отвечает лично…")
        office.save()
    else:
        agent = agent_start(agent_id, f"{ROLES[agent_id]['emoji']} {ROLES[agent_id]['name']} выполняет задание директора…")

    task = build_agent_task(text, plan)
    result, _ = run_agent_text(agent_id, task, attachments=attachments, recent_context=True)

    # --- Приёмка директором -------------------------------------------------
    office.set_agent_status("ceo", "working")
    office.set_activity("thinking", "ceo", "👔 Директор сверяет результат с вашим запросом…")
    office.save()

    review_log = []
    verdict = ceo_review(text, plan, result)
    if verdict["ok"]:
        review_log.append("✅ Директор принял результат с первого раза.")
    else:
        review_log.append("⚠️ Директор нашёл несоответствия: " + "; ".join(verdict["problems"] or ["без деталей"]))
        if verdict["can_fix"]:
            result = ceo_fix(text, plan, result, verdict["problems"])
            review_log.append("✏️ Директор сам довёл результат до требуемого вида.")
        else:
            # Одна итерация доработки исполнителем.
            if agent_id != "ceo":
                office.set_activity("working", agent_id, f"{agent['emoji']} {agent['name']} дорабатывает по замечаниям директора…")
                office.set_agent_status(agent_id, "working")
                office.save()
            rework_task = (
                task
                + "\n\nЗАМЕЧАНИЯ ДИРЕКТОРА ПО ПРЕДЫДУЩЕЙ ВЕРСИИ (обязательно устрани):\n- "
                + "\n- ".join(verdict["problems"] or ["результат не соответствует запросу"])
                + "\n\nПРЕДЫДУЩАЯ ВЕРСИЯ:\n" + result[:30000]
            )
            result, _ = run_agent_text(agent_id, rework_task, attachments=attachments, recent_context=True)
            review_log.append("🔁 Задание возвращено исполнителю на доработку.")
            second = ceo_review(text, plan, result)
            if second["ok"]:
                review_log.append("✅ После доработки директор принял результат.")
            else:
                result = ceo_fix(text, plan, result, second["problems"])
                review_log.append("✏️ Директор финально отредактировал результат сам: " + "; ".join(second["problems"] or []))

    office.learn(agent, task, result)
    draft = save_draft(agent["name"], result)

    details = (
        "Ход работы:\n\n"
        f"- 👔 Директор понял запрос как: **{plan.get('deliverable')}**"
        + (f" (количество: {plan['count']})" if plan.get("count") else "") + ";\n"
        f"- намерение: `{plan.get('intent')}`, исполнитель: {agent['emoji']} {agent['name']};\n"
        f"- ТЗ исполнителю: {safe_text(plan.get('brief'))[:300]};\n"
        "- критерии приёмки: " + "; ".join(plan.get("acceptance") or []) + ";\n"
        + "".join(f"- {line}\n" for line in review_log)
        + f"- результат сохранён: `{draft}`."
    )
    add_chat_message("assistant", result, details)

    office.session["last_intent"] = plan.get("intent")
    office.session["last_agent"] = agent_id
    office.session["last_job"] = {
        "key": agent_id,
        "task": text,
        "report": result,
        "name": agent["name"],
        "file": draft,
    }
    if agent_id != "ceo":
        agent_done(agent_id, f"{agent['emoji']} {agent['name']} — работа принята директором")
    else:
        office.set_activity("done", "ceo", "👔 Директор ответил")
    office.save()
    return result


def ceo_final_check(user_text: str, plan: dict, result: str) -> str:
    """
    Приёмка директором для готовых сценариев (темы, статья, правка статьи).
    Если результат не отвечает запросу и его можно поправить — директор правит
    и ЗАМЕНЯЕТ последнее сообщение в чате исправленной версией.
    """
    if not result or not office.api_ready():
        return result
    office.set_agent_status("ceo", "working")
    office.set_activity("thinking", "ceo", "👔 Директор сверяет результат с вашим запросом…")
    office.save()
    verdict = ceo_review(user_text, plan, result)
    if verdict["ok"] or not verdict["can_fix"]:
        return result
    fixed = ceo_fix(user_text, plan, result, verdict["problems"])
    if not fixed or fixed == result:
        return result
    # Если это статья — обновляем документ, чтобы публикация взяла исправленную версию.
    if plan.get("intent") in {"write_article", "edit_document"} and looks_like_article(fixed):
        try:
            remember_document(fixed, source="ceo_fixed")
        except Exception as error:
            office.log(f"Директор: документ не обновлён ({error})")
    chat = office.session.get("chat") or []
    for message in reversed(chat):
        if message.get("role") == "assistant":
            message["text"] = fixed
            message["details"] = (
                (message.get("details") or "")
                + "\n\n👔 Директор проверил результат и внёс правки: "
                + "; ".join(verdict["problems"] or ["приведено к запросу"])
            )
            break
    office.save()
    return fixed


# ============================================================
# ПЛАНИРОВЩИК ДИРЕКТОРА (НОВАЯ ВЕРСИЯ — ЗАМЕНЯЕТ СТАРУЮ process_message)
# ============================================================

def process_message(text: str, attachments: list[dict] | None = None):
    attachments = attachments or []

    # 1) Директор слушает и понимает запрос.
    plan = ceo_understand(text, attachments)
    intent = plan["intent"]
    office.log(f"Директор понял: {intent} → {plan['agent']} | {plan['deliverable'][:80]}")

    # 2) Публикация — без изменений (открывает предпросмотр).
    if intent == "publish":
        document = get_last_chat_article()
        if not document:
            document = get_current_document()
        if not document:
            document = office.session.get("pending_publish")
        if isinstance(document, dict):
            document = heal_document(document)
        if not document or not document.get("body"):
            reply = "В текущем чате нет готовой статьи для публикации. Выберите тему и сгенерируйте текст."
            add_chat_message("assistant", reply)
            ceo_remember(text, plan, reply)
            return None
        office.session["pending_publish"] = dict(document)
        office.session["current_document"] = dict(document)
        office.save()
        office.set_activity("done", "ceo", "Готов предпросмотр публикации")
        office.save()
        return {"type": "publish_preview", "article": document}

    # 3) Специализированные сценарии + приёмка директором.
    if intent == "select_option":
        result = handle_option_selection(text)
        result = ceo_final_check(text, {**plan, "intent": "write_article"}, result)
    elif intent == "topic_research":
        result = run_topic_research(text, count=plan.get("count"))
        result = ceo_final_check(text, plan, result)
    elif intent == "write_article":
        result = run_article_pipeline(text, attachments)
        result = ceo_final_check(text, plan, result)
    elif intent == "edit_document":
        result = edit_current_document(text)
        result = ceo_final_check(text, plan, result)
    else:
        # 4) Всё остальное (программа, смета, анализ, вопрос директору и т.д.)
        result = run_directed_task(text, attachments, plan)

    # 5) Директор запоминает, о чём вы говорили.
    ceo_remember(text, plan, result)
    return result
