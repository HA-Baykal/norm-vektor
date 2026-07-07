import { Link } from "react-router-dom";
import Logo from "./Logo";

export default function Footer() {
  const openChat = () => {
    // @ts-ignore
    if (window.jivo_api && window.jivo_api.open) window.jivo_api.open();
  };

  return (
    <footer className="bg-slate-900 text-slate-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Logo className="w-12 h-12" />
              <div>
                <div className="text-white font-extrabold text-lg">
                  Вектор <span className="text-accent-400">Комфорта</span>
                </div>
                <div className="text-xs text-slate-400">Комфорт в каждом направлении</div>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Окна, кондиционеры, вентиляция и алмазное бурение. Собственное производство. Работаем в Иркутске и пригороде до 50 км.
            </p>
          </div>

          {/* Услуги */}
          <div>
            <h3 className="text-white font-semibold mb-4">Услуги</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/okna" className="hover:text-accent-400 transition">Окна и остекление</Link></li>
              <li><Link to="/kondicionery" className="hover:text-accent-400 transition">Кондиционеры</Link></li>
              <li><Link to="/ventilyaciya" className="hover:text-accent-400 transition">Вентиляция</Link></li>
              <li><Link to="/almaznoe-burenie" className="hover:text-accent-400 transition">Алмазное бурение</Link></li>
            </ul>
          </div>

          {/* Контакты */}
          <div>
            <h3 className="text-white font-semibold mb-4">Контакты</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="tel:+79149146606" className="hover:text-accent-400 transition block">
                  📞 +7 (914) 914-66-06
                </a>
              </li>
              <li>
                <a href="tel:+73952669930" className="hover:text-accent-400 transition block">
                  📞 66-99-30
                </a>
              </li>
              <li className="text-slate-400">🕒 Пн–Сб 9:00–20:00</li>
              <li className="text-slate-400">📍 Иркутск, Ангарск, Шелехов, Хомутово</li>
              <li>
                <button onClick={openChat} className="text-accent-400 hover:text-accent-500 transition">
                  💬 Написать в чат
                </button>
              </li>
            </ul>
          </div>

          {/* Навигация */}
          <div>
            <h3 className="text-white font-semibold mb-4">Навигация</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-accent-400 transition">Главная</Link></li>
              <li><Link to="/kontakty" className="hover:text-accent-400 transition">Контакты</Link></li>
              <li>
                <a href="tel:+79149146606" className="inline-flex items-center gap-2 mt-2 px-4 py-2 rounded-lg bg-accent-500 hover:bg-accent-600 text-white font-semibold transition">
                  📞 Позвонить сейчас
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <div>© {new Date().getFullYear()} Вектор Комфорта. Все права защищены.</div>
          <div>Иркутск · Ангарск · Шелехов · Хомутово · пригород до 50 км</div>
        </div>
      </div>
    </footer>
  );
}
