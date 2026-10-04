import { useEffect, useMemo, useState, FormEvent } from "react";
import ConsentCheckbox from "./ConsentCheckbox";

// Ближайшие 14 дней для онлайн-записи на замер (компания работает ежедневно).
function buildDays(): { value: string; weekday: string; day: string; month: string }[] {
  const WEEKDAYS = ["вс", "пн", "вт", "ср", "чт", "пт", "сб"];
  const MONTHS = ["янв", "фев", "мар", "апр", "мая", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"];
  const days = [];
  for (let i = 0; i < 14; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    days.push({
      value,
      weekday: i === 0 ? "сегодня" : i === 1 ? "завтра" : WEEKDAYS[d.getDay()],
      day: String(d.getDate()),
      month: MONTHS[d.getMonth()],
    });
  }
  return days;
}

const TIME_SLOTS = ["09:00–12:00", "12:00–15:00", "15:00–18:00", "18:00–20:00"];

interface QuickBookingModalProps {
  open: boolean;
  onClose: () => void;
  serviceName?: string;
  calcDetails?: string;
}

export default function QuickBookingModal({
  open,
  onClose,
  serviceName = "Бесплатный замер и консультация",
  calcDetails,
}: QuickBookingModalProps) {
  const [name, setName] = useState("");
  const [rawPhone, setRawPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [city, setCity] = useState("Иркутск");
  const [submitted, setSubmitted] = useState(false);
  const [consent, setConsent] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const days = useMemo(buildDays, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

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
    // Согласие на обработку ПДн (152-ФЗ ст. 9) — без галочки заявка не уходит.
    if (!consent) return;

    setSubmitted(true);

    // Выбранное время замера уходит в details рядом с параметрами заказа.
    const bookingInfo = selectedDate
      ? `\nЖелаемое время замера: ${selectedDate.split("-").reverse().join(".")}${selectedSlot ? `, ${selectedSlot}` : ""}`
      : "";
    const detailsFull = `${calcDetails || ""}${bookingInfo}`.trim();

    // Заявка отправляется только на серверный API: токен Telegram хранится
    // в переменных окружения (TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID) на Vercel.
    fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        phone: formattedPhone,
        city,
        service: serviceName,
        details: detailsFull,
      }),
    }).catch(() => {});

    setTimeout(() => {
      setSubmitted(false);
      setName("");
      setRawPhone("");
      setPhoneError("");
      setSelectedDate("");
      setSelectedSlot("");
      onClose();
    }, 3000);
  };

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/80 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-3xl bg-white dark:bg-slate-900 p-6 sm:p-8 text-slate-900 dark:text-white shadow-2xl relative border border-slate-200 dark:border-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center font-bold transition"
        >
          ✕
        </button>

        {submitted ? (
          <div className="py-8 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">
              Заявка успешно принята!
            </h3>
            <p className="mt-2 text-slate-600 dark:text-slate-400 text-sm">
              Инженер свяжется с вами по номеру <span className="font-bold text-[#ff6b35]">{formattedPhone}</span> в течение 15 минут.
            </p>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <span className="inline-block px-3 py-1 rounded-full bg-orange-500/10 text-[#ff6b35] text-xs font-black uppercase tracking-wider mb-2">
                Выезд 0 ₽
              </span>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                Запись на замер / Заказ
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {serviceName}
              </p>
            </div>

            {calcDetails && (
              <div className="mb-5 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span className="font-extrabold text-[#ff6b35] block mb-1">
                  Параметры вашего заказа:
                </span>
                {calcDetails}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  Ваше имя
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Как к вам обращаться"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#ff6b35] text-sm"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Номер телефона
                  </label>
                  <span className="text-[11px] text-slate-400 font-medium">Вводите 10 цифр без +7</span>
                </div>

                <div className="relative flex items-center">
                  <div className="absolute left-3.5 font-bold text-sm text-slate-700 dark:text-slate-200 select-none bg-slate-100 dark:bg-slate-700/60 px-2 py-1 rounded-lg">
                    +7
                  </div>
                  <input
                    type="tel"
                    required
                    value={rawPhone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    placeholder="914 000-00-00"
                    maxLength={11}
                    className={`w-full pl-16 pr-4 py-3 rounded-xl border ${
                      phoneError
                        ? "border-red-500 focus:ring-red-400"
                        : "border-slate-300 dark:border-slate-700 focus:ring-[#ff6b35]"
                    } bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-base tracking-wider focus:outline-none focus:ring-2`}
                  />
                </div>

                {phoneError && (
                  <p className="mt-1.5 text-xs font-extrabold text-red-500 animate-pulse">
                    ⚠️ {phoneError}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  Город / Населённый пункт
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ff6b35] text-sm font-semibold"
                >
                  <option value="Иркутск">Иркутск</option>
                  <option value="Ангарск">Ангарск</option>
                  <option value="Шелехов">Шелехов</option>
                  <option value="Хомутово">Хомутово</option>
                  <option value="Пригород (до 50 км)">Пригород (до 50 км)</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Удобный день замера
                  </label>
                  <span className="text-[11px] text-slate-400 font-medium">необязательно</span>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
                  {days.map((d) => (
                    <button
                      key={d.value}
                      type="button"
                      onClick={() => setSelectedDate(selectedDate === d.value ? "" : d.value)}
                      className={`shrink-0 w-16 rounded-xl border-2 px-2 py-2 text-center transition ${
                        selectedDate === d.value
                          ? "border-[#ff6b35] bg-orange-50 dark:bg-orange-500/10"
                          : "border-slate-200 dark:border-slate-700 hover:border-slate-300"
                      }`}
                    >
                      <div className={`text-[10px] font-bold uppercase ${selectedDate === d.value ? "text-[#ff6b35]" : "text-slate-400"}`}>
                        {d.weekday}
                      </div>
                      <div className="text-base font-black text-slate-800 dark:text-white leading-tight">{d.day}</div>
                      <div className="text-[10px] font-semibold text-slate-400">{d.month}</div>
                    </button>
                  ))}
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {TIME_SLOTS.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedSlot(selectedSlot === slot ? "" : slot)}
                      className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                        selectedSlot === slot
                          ? "bg-[#1a3a5c] text-white"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <ConsentCheckbox checked={consent} onChange={setConsent} id="pd-consent-modal" />

              <button
                type="submit"
                disabled={!consent}
                className="w-full py-4 rounded-xl bg-[#ff6b35] hover:bg-[#e95620] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#ff6b35] text-white font-black text-sm transition shadow-lg shadow-orange-500/20"
              >
                Отправить заявку
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}