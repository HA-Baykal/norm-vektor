import { Link } from "react-router-dom";
import Logo from "./Logo";
import { LEGAL_NAV, FOOTER_REQUISITES } from "../data/legal";
import { MAX_LINK, TELEGRAM_LINK, WHATSAPP_LINK } from "../data/contacts";
export default function Footer() {
  const openChat = () => {
    // @ts-ignore
    if (window.jivo_api && window.jivo_api.open) window.jivo_api.open();
  };
  return (
    <footer className="bg-slate-900 text-slate-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4"><Logo className="w-12 h-12" /><div><div className="text-white font-extrabold text-lg">Вектор <span className="text-accent-400">Комфорта</span></div><div className="text-xs text-slate-400">Комфорт в каждом направлении</div></div></div>
            <p className="text-sm text-slate-400 leading-relaxed">Окна, кондиционеры, вентиляция и алмазное бурение. Изготовление на заказ. Работаем в Иркутске и пригороде до 50 км.</p>
          </div>
          <div><h3 className="text-white font-semibold mb-4">Услуги</h3><ul className="space-y-2 text-sm"><li><Link to="/okna" className="hover:text-accent-400 transition">Окна и остекление</Link></li><li><Link to="/kondicionery" className="hover:text-accent-400 transition">Кондиционеры</Link></li><li><Link to="/ventilyaciya" className="hover:text-accent-400 transition">Вентиляция</Link></li><li><Link to="/almaznoe-burenie" className="hover:text-accent-400 transition">Алмазное бурение</Link></li><li><Link to="/interier" className="hover:text-accent-400 transition">Interier — дизайн интерьера по фото</Link></li></ul></div>
          <div>
            <h3 className="text-white font-semibold mb-4">Контакты</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="tel:+79149146606" className="hover:text-accent-400 transition block">📞 +7 (914) 914-66-06</a></li>
              <li><a href="tel:+73952669930" className="hover:text-accent-400 transition block">📞 66-99-30</a></li>
              <li><a href="tel:+79086401166" className="hover:text-accent-400 transition block">📞 +7 (908) 640-11-66</a></li>
              <li><a href="mailto:montaj138@mail.ru" className="hover:text-accent-400 transition block">✉️ montaj138@mail.ru</a></li>
              <li>
                <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#25D366] text-white font-bold hover:bg-[#1fb457] transition"><svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg> Написать в WhatsApp</a>
              </li>
              <li>
                <a href={TELEGRAM_LINK} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#229ED9] text-white font-bold hover:bg-[#1d8dc4] transition"><svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" /></svg> Написать в Telegram</a>
              </li>
              <li>
                <a href={MAX_LINK} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white text-slate-900 font-bold hover:bg-slate-100 transition"><span className="w-6 h-6 rounded bg-[#1a3a5c] text-white grid place-items-center text-[10px] font-black">MAX</span> Написать в MAX</a>
                <div className="text-xs text-slate-500 mt-1">Отвечаем за 5 минут, без звонков</div>
              </li>
              <li className="text-slate-400">🕒 Пн–Вс 7:00–20:00,</li>
              <li className="text-slate-400">📍 г. Иркутск, Байкальская улица, 202/2 (цокольный этаж), 664075</li>
              <li><button onClick={openChat} className="text-accent-400 hover:text-accent-500 transition">💬 Написать в чат Jivo</button></li>
            </ul>
          </div>
          <div><h3 className="text-white font-semibold mb-4">Навигация</h3><ul className="space-y-2 text-sm"><li><Link to="/" className="hover:text-accent-400 transition">Главная</Link></li><li><Link to="/kontakty" className="hover:text-accent-400 transition">Контакты</Link></li><li><Link to="/standarty" className="hover:text-accent-400 transition">Стандарты монтажа</Link></li><li><Link to="/proizvodstvo" className="hover:text-accent-400 transition">Производство и команда</Link></li><li><Link to="/sotrudnichestvo" className="hover:text-accent-400 transition">Сотрудничество</Link></li><li><a href={MAX_LINK} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-2 px-4 py-2 rounded-lg bg-[#1a3a5c] hover:bg-[#122943] text-white font-semibold transition border border-white/10"><span className="w-5 h-5 rounded bg-white text-[#1a3a5c] grid place-items-center text-[9px] font-black">MAX</span> Написать в MAX</a></li><li><a href="tel:+79149146606" className="inline-flex items-center gap-2 mt-2 px-4 py-2 rounded-lg bg-accent-500 hover:bg-accent-600 text-white font-semibold transition">📞 Позвонить сейчас</a></li></ul></div>
          <div>
            <h3 className="text-white font-semibold mb-4">Информация</h3>
            <ul className="space-y-2 text-sm">
              {LEGAL_NAV.map((l) => (
                <li key={l.href}><Link to={l.href} className="hover:text-accent-400 transition">{l.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Мы в соцсетях</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="https://vk.com/vektor_komforta" target="_blank" rel="noopener noreferrer" className="hover:text-accent-400 transition">VK</a></li>
              <li><a href="https://ok.ru/vektor.komforta" target="_blank" rel="noopener noreferrer" className="hover:text-accent-400 transition">Одноклассники</a></li>
              <li><a href="https://dzen.ru/vektor_komforta" target="_blank" rel="noopener noreferrer" className="hover:text-accent-400 transition">Дзен</a></li>
              <li><a href="https://2gis.ru/irkutsk/firm/70000001115497655" target="_blank" rel="noopener noreferrer" className="hover:text-accent-400 transition">2ГИС</a></li>
              <li><a href="https://yandex.ru/maps/org/vektor_komforta/117268889988/" target="_blank" rel="noopener noreferrer" className="hover:text-accent-400 transition">Яндекс Карты</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500"><div>© {new Date().getFullYear()} Вектор Комфорта. Все права защищены.</div><div>Иркутск · Ангарск · Шелехов · Хомутово · пригород до 50 км</div></div>
        <div className="mt-3 text-xs text-slate-500 text-center md:text-left">{FOOTER_REQUISITES} · <Link to="/rekvizity" className="underline hover:text-accent-400">все реквизиты</Link></div>
      </div>
    </footer>
  );
}
