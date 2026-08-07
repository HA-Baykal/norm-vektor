import { useState, FormEvent } from "react";

interface QuoteFormProps {
  title?: string;
  subtitle?: string;
  compact?: boolean;
}

const TELEGRAM_BOT_TOKEN = "8689073934:AAGt-XGBs6SEjVR_Uzy5vtThvGNc8IY9qAs";
const TELEGRAM_CHAT_ID = "6567941949";

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export default function QuoteForm({
  title = "Оставьте заявку",
  subtitle = "Перезвоним в течение 15 минут и ответим на все вопросы",
  compact = false,
}: QuoteFormProps) {
  const [name, setName] = useState("");
  const [rawPhone, setRawPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handlePhoneChange = (val: string) => {
    let digits = val.replace(/\D/g, "");
    if ((digits.startsWith("7") || digits.startsWith("8")) && digits.length > 10) {
      digits = digits.slice(1);
    } else if ((digits.startsWith("7") || digits.startsWith("8")) && digits.length === 11) {
      digits = digits.slice(1);
    }
    const trimmed = digits.slice(0, 10);
    setRawPhone(trimmed);

    if (trimmed.length > 0 && trimmed.length < 10) {
      setPhoneError("Введено меньше 10 цифр. Проверьте номер!");
    } else {
      setPhoneError("");
    }
  };

  const formattedPhone = `+7 ${rawPhone}`;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (rawPhone.length !== 10) {
      setPhoneError("Проверьте номер! Введите ровно 10 цифр вашего номера (без +7)");
      return;
    }

    setSubmitted(true);

    const safeName = escapeHtml(name || "Не указано");
    const safePhone = escapeHtml(formattedPhone);
    const safeTitle = escapeHtml(title);
    const safeSub = escapeHtml(subtitle);

    const htmlMessage =
      `🔥 <b>НОВАЯ ЗАЯВКА С САЙТА!</b>\n\n` +
      `👤 <b>Имя:</b> ${safeName}\n` +
      `📞 <b>Телефон:</b> ${safePhone}\n` +
      `🛠 <b>Форма:</b> ${safeTitle}\n` +
      `💬 <b>Примечание:</b> ${safeSub}`;

    try {
      const beaconText = encodeURIComponent(
        `🔥 НОВАЯ ЗАЯВКА\nИмя: ${name || "Не указано"}\nТел: ${formattedPhone}\nФорма: ${title}`
      );
      const beacon = new Image();
      beacon.src = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage?chat_id=${TELEGRAM_CHAT_ID}&text=${beaconText}`;
    } catch (err) {
      console.error("Beacon error:", err);
    }

    fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: htmlMessage,
        parse_mode: "HTML",
      }),
    }).catch(() => {});

    fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        phone: formattedPhone,
        service: title,
        details: subtitle,
      }),
    }).catch(() => {});

    setTimeout(() => {
      setSubmitted(false);
      setName("");
      setRawPhone("");
      setPhoneError("");
    }, 4000);
  };

  if (submitted) {
    return (
      <div className={`rounded-2xl bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800 p-6 text-center ${compact ? "" : "md:p-10"}`}>
        <div className="text-5xl mb-3">✅</div>
        <h3 className="text-xl font-bold text-green-700 dark:text-green-400">Заявка отправлена!</h3>
        <p className="text-green-600 dark:text-green-500 mt-2">Мы перезвоним вам в течение 15 минут</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl ${compact ? "p-6" : "p-8 md:p-10"}`}
    >
      {!compact && (
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h3>
          <p className="text-slate-600 dark:text-slate-400 mt-1">{subtitle}</p>
        </div>
      )}
      <div className="space-y-3">
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ваше имя"
          className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#ff6b35] focus:border-transparent transition text-sm"
        />

        <div>
          <div className="relative flex items-center">
            <div className="absolute left-3.5 font-bold text-sm text-slate-700 dark:text-slate-200 select-none bg-slate-100 dark:bg-slate-700/60 px-2 py-1 rounded-lg">
              +7
            </div>
            <input
              type="tel"
              required
              value={rawPhone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              placeholder="914 000-00-00 (без +7)"
              maxLength={11}
              className={`w-full pl-16 pr-4 py-3 rounded-xl border ${
                phoneError
                  ? "border-red-500 focus:ring-red-400"
                  : "border-slate-300 dark:border-slate-700 focus:ring-[#ff6b35]"
              } bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-sm tracking-wider focus:outline-none focus:ring-2`}
            />
          </div>
          {phoneError && (
            <p className="mt-1 text-xs font-bold text-red-500">
              ⚠️ {phoneError}
            </p>
          )}
        </div>

          <button
          type="submit"
          className="w-full px-4 py-3.5 rounded-xl bg-[#ff6b35] hover:bg-[#e95620] text-white font-black transition shadow-lg shadow-orange-500/20 text-sm"
        >
          Получить консультацию
        </button>

        <a
          href="https://max.ru/u/f9LHodD0cOIbMOqTBdWMtjtwwW7JyWEldW-Tz3JENfITHpjVmqPbiKibF0U"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#1a3a5c] hover:bg-[#122943] text-white font-bold transition text-sm border border-transparent"
        >
          <span className="w-6 h-6 rounded bg-white text-[#1a3a5c] grid place-items-center text-[10px] font-black">MAX</span>
          Написать в MAX — быстрее, чем ждать звонка
        </a>
        <p className="text-xs text-slate-500 dark:text-slate-500 text-center">
          Не любите звонки? Пишите, отвечаем за 5 минут
        </p>
