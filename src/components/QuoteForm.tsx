import { useState, FormEvent } from "react";

interface QuoteFormProps {
  title?: string;
  subtitle?: string;
  compact?: boolean;
}

export default function QuoteForm({
  title = "Оставьте заявку",
  subtitle = "Перезвоним в течение 15 минут и ответим на все вопросы",
  compact = false,
}: QuoteFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Попытка открыть Jivo и отправить данные
    // @ts-ignore
    if (window.jivo_api && window.jivo_api.open) {
      // @ts-ignore
      window.jivo_api.open();
      // @ts-ignore
      if (window.jivo_api.setCustomData) {
        // @ts-ignore
        window.jivo_api.setCustomData([
          { content: name, title: "Имя" },
          { content: phone, title: "Телефон" },
        ]);
      }
    }
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setName("");
      setPhone("");
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
          className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
        />
        <input
          type="tel"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+7 (___) ___-__-__"
          className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
        />
        <button
          type="submit"
          className="w-full px-4 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold transition shadow-lg shadow-brand-600/30 hover:shadow-brand-700/40"
        >
          Получить консультацию
        </button>
        <p className="text-xs text-slate-500 dark:text-slate-500 text-center">
          Нажимая кнопку, вы соглашаетесь с обработкой персональных данных
        </p>
      </div>
    </form>
  );
}
