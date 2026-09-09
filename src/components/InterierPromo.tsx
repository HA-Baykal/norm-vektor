import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import InterierModal from "./InterierModal";
import { INTERIER_EXTERNAL_URL, trackInterierEvent } from "../constants/interier";

export default function InterierPromo() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const openModal = () => { trackInterierEvent("interier_open_modal"); setOpen(true); };
  return <>
    <section id="interier" className="interier-promo py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="interier-promo-card">
          <div className="interier-promo-copy">
            <span className="interier-badge">✦ Онлайн-сервис · Первая генерация бесплатно</span>
            <h2>Interier — увидите свой интерьер до ремонта</h2>
            <p className="interier-lead">Загрузите фото комнаты и за пару минут получите дизайн-проект в выбранном стиле. Работает онлайн — с телефона или компьютера, без вызова дизайнера.</p>
            <ul className="interier-benefits">
              <li>📸 Фото комнаты → готовый дизайн-проект</li>
              <li>🎨 Стили на выбор: скандинавский, лофт, неоклассика, минимализм и другие</li>
              <li>🆓 Первая генерация — бесплатно</li>
              <li>⚡ Результат за пару минут</li>
            </ul>
            <div className="interier-actions">
              <button ref={triggerRef} onClick={openModal} className="interier-primary">Попробовать прямо здесь <span>→</span></button>
              <a href={INTERIER_EXTERNAL_URL} target="_blank" rel="noopener noreferrer" onClick={() => trackInterierEvent("interier_open_newtab")} className="interier-secondary">Открыть в новом окне ↗</a>
            </div>
            <small className="interier-microcopy">Сервис разработан командой «Вектора Комфорта» — попробуйте, даже если вы не наш клиент.</small>
          </div>
          <div className="interier-orbit" aria-hidden="true"><div className="interier-orbit-icon">✦</div><span>AI</span><span>STYLE</span><span>ROOM</span></div>
        </div>
      </div>
    </section>
    <InterierModal open={open} onClose={() => setOpen(false)} triggerRef={triggerRef} />
  </>;
}

export function DeveloperBio() {
  return <section className="py-5 sm:py-7 bg-white dark:bg-slate-950" aria-labelledby="developer-bio-title">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="developer-bio">
        <div className="developer-bio-icon" aria-hidden="true">&lt;/&gt;</div>
        <div className="flex-1"><h2 id="developer-bio-title">Этот сайт и Interier — моя собственная разработка</h2><p>Здравствуйте! Я — владелец «Вектора Комфорта» и разработчик. Этот сайт, онлайн-калькуляторы и сервис Interier созданы мной от идеи до запуска: дизайн, код, сервер, интеграции с искусственным интеллектом. Разрабатываю сайты и веб-приложения под ключ — лендинги, корпоративные сайты, онлайн-сервисы, личные кабинеты, в том числе с ИИ. Если вам нужен такой же сайт или своё приложение — напишите, обсудим задачу и сроки.</p></div>
        <Link to="/kontakty" onClick={() => trackInterierEvent("bio_cta_click")} className="developer-bio-cta">Обсудить ваш проект <span>→</span></Link>
      </div>
    </div>
  </section>;
}
