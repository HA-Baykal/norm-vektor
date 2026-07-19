import { useEffect, useState, FormEvent } from "react";

interface QuickBookingModalProps {
  open: boolean;
  onClose: () => void;
  serviceName?: string;
  calcDetails?: string;
}

const TELEGRAM_BOT_TOKEN = "8689073934:AAGt-XGBs6SEjVR_Uzy5vtThvGNc8IY9qAs";
const TELEGRAM_CHAT_ID = "6567941949";

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export default function QuickBookingModal({
  open,
  onClose,
  serviceName = "Бесплатный замер и консультация",
  calcDetails,
}: QuickBookingModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("Иркутск");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const safeName = escapeHtml(name || "Не указано");
    const safePhone = escapeHtml(phone);
    const safeCity = escapeHtml(city);
    const safeService = escapeHtml(serviceName);
    const safeDetails = escapeHtml(calcDetails || "—");

    const htmlMessage =
      `🚨 <b>НОВАЯ ЗАЯВКА С САЙТА!</b>\n\n` +
      `👤 <b>Имя:</b> ${safeName}\n` +
      `📞 <b>Телефон:</b> ${safePhone}\n` +
      `📍 <b>Город/Район:</b> ${safeCity}\n` +
      `🛠 <b>Услуга:</b> ${safeService}\n` +
      `💬 <b>Детали расчёта:</b> ${safeDetails}`;

    // 1. Запрос на сервер Vercel
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          city,
          service: serviceName,
          details: calcDetails || "",
        }),
      });
    } catch (err) {
      console.error("Backend error:", err);
    }

    // 2. Прямой запрос в Telegram (HTML)
    try {
      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: htmlMessage,
          parse_mode: "HTML",
        }),
      });
    } catch (err) {
      console.error("Telegram HTML error:", err);
    }

    // 3. GET Image Beacon (Обход блокировщиков рекламы)
    try {
      const beaconText = encodeURIComponent(
        `🚨 НОВАЯ ЗАЯВКА (Замер/Калькулятор)\nИмя: ${name || "Не указано"}\nТел: ${phone}\nГород: ${city}\nУслуга: ${serviceName}\nДетали: ${calcDetails || "—"}`
      );
      const beacon = new Image();
      beacon.src = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage?chat_id=${TELEGRAM_CHAT_ID}&text=${beaconText}`;
    } catch (err) {
      console.error("Beacon error:", err);
    }

    setLoading(false);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setName("");
      setPhone("");
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
              Инженер свяжется с вами в течение 15 минут для уточнения удобного времени замера.
            </p>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <span className="inline-block px-3 py-1 rounded-full bg-orange-500/10 text-[#ff6b35] text-xs font-black uppercase tracking-wider mb-2">
                Выезд 0 ₽
              </span>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                Запись на бесплатный замер
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {serviceName}
              </p>
            </div>

            {calcDetails && (
              <div className="mb-5 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span className="font-extrabold text-[#ff6b35] block mb-1">
                  Параметры вашего расчёта:
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
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  Телефон для связи
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+7 (914) 000-00-00"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#ff6b35] text-sm"
                />
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

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-[#ff6b35] hover:bg-[#e95620] text-white font-black text-sm transition shadow-lg shadow-orange-500/20 disabled:opacity-50"
              >
                {loading ? "Отправка..." : "Вызвать замерщика бесплатно"}
              </button>

              <p className="text-[11px] text-center text-slate-500 dark:text-slate-500 leading-tight">
                Замер и консультация ни к чему вас не обязывают. Нажимая кнопку, вы даёте согласие на обработку персональных данных.
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}