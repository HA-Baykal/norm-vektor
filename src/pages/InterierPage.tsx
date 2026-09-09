import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useSeo, useBreadcrumb } from "../utils/useSeo";
import InterierModal from "../components/InterierModal";
import { trackInterierEvent } from "../constants/interier";

export default function InterierPage() {
  useSeo("Дизайн интерьера по фото онлайн — Иркутск | Interier", "Interier — дизайн интерьера по фото онлайн в Иркутске. Загрузите фотографию комнаты, выберите стиль и получите первый дизайн-проект бесплатно.");
  useBreadcrumb([{ name: "Главная", path: "/" }, { name: "Interier — дизайн интерьера по фото" }]);
  const [open, setOpen] = useState(false); const buttonRef = useRef<HTMLButtonElement>(null);
  const launch = () => { trackInterierEvent("interier_open_modal"); setOpen(true); };
  return <>
    <main className="interier-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="interier-page-hero">
          <span className="interier-badge">✦ Онлайн-сервис · Первая генерация бесплатно</span>
          <h1>Дизайн интерьера по фото — Иркутск</h1>
          <p>Interier помогает увидеть будущую комнату до ремонта. Загрузите фото, выберите стиль — и получите дизайн-проект за пару минут прямо в браузере.</p>
          <button ref={buttonRef} onClick={launch} className="interier-primary">Попробовать бесплатно <span>→</span></button>
        </div>
        <div className="grid md:grid-cols-3 gap-5 pb-16">
          {[["📸", "Загрузите фото", "Подойдёт снимок с телефона или компьютера."], ["🎨", "Выберите стиль", "Скандинавский, лофт, неоклассика, минимализм и другие."], ["⚡", "Получите результат", "Готовый визуальный концепт за пару минут."]].map(([icon, title, text]) => <article key={title} className="interier-page-card"><span>{icon}</span><h2>{title}</h2><p>{text}</p></article>)}
        </div>
        <div className="pb-16 text-center"><p className="text-slate-600 dark:text-slate-400">Не хотите запускать сервис сейчас? <Link to="/kontakty" className="font-bold text-brand-700 dark:text-orange-400">Обсудите проект с разработчиком →</Link></p></div>
      </div>
    </main>
    <InterierModal open={open} onClose={() => setOpen(false)} triggerRef={buttonRef} />
  </>;
}
