import ServicePage from "../components/ServicePage";
import Counters from "../components/Counters";
import Reviews from "../components/Reviews";
import WindowCalculator from "../components/WindowCalculator";
import WindowsGallery from "../components/WindowsGallery";

export default function Windows() {
  return (
    <>
      <ServicePage
        title="Окна и остекление"
        ctaLabel="🧮 Расчёт окна онлайн"
        ctaHref="#calculator"
        tagline="Прямые поставки с завода VEKA. Монтаж по ГОСТу. Гарантия 5 лет."
        heroIcon="🪟"
        intro="Поставляем и устанавливаем ПВХ и алюминиевые конструкции любой сложности: окна, двери, балконы, лоджии, витражи, стеклянные перегородки. Любой цвет, любая форма, любой размер. Работаем с физическими и юридическими лицами."
        breadcrumb="Окна и остекление"
        advantages={[
          { icon: "🏭", title: "Прямые поставки с завода", text: "Работаем напрямую с производителем профиля VEKA — цены на 15-20% ниже рыночных" },
          { icon: "👷", title: "Опытные монтажники", text: "Бригады со стажем от 7 лет. Монтаж строго по ГОСТ 30971-2012" },
          { icon: "🧰", title: "Профиль и фурнитура", text: "Бюджетный (WHS) и премиум (Soft Line) сегмент VEKA. Фурнитура MACO" },
          { icon: "🛡️", title: "Гарантия 5 лет", text: "На профиль, стеклопакет и монтажные работы. Постгарантийный сервис" },
        ]}
        services={[
          { icon: "🪟", title: "Пластиковые окна ПВХ", text: "Окна в квартиру, дом, офис. Одно-, двух-, трёхстворчатые. Панорамные и обычные. Любой цвет RAL." },
          { icon: "🏢", title: "Алюминиевые конструкции", text: "Тёплый и холодный алюминий для фасадов, входных групп, офисов, торговых центров." },
          { icon: "🏠", title: "Остекление балконов и лоджий", text: "Под ключ: остекление, крыша, отделка, утепление. Раздвижные и распашные системы." },
          { icon: "🚪", title: "Входные и межкомнатные двери", text: "ПВХ и алюминиевые двери для дома, магазина, офиса. Замки, доводчики, ручки." },
          { icon: "✨", title: "Витражи и перегородки", text: "Стеклянные перегородки для офисов и торговых центров. Декоративные витражи." },
          { icon: "🔧", title: "Регулировка и ремонт", text: "Регулировка створок, замена уплотнителей, стеклопакетов, ручек, фурнитуры." },
        ]}
        process={[
          { step: "01", title: "Заявка", text: "Оставьте телефон — перезвоним за 15 минут, уточним детали" },
          { step: "02", title: "Замер", text: "Бесплатный выезд замерщика в удобное время" },
          { step: "03", title: "Заказ на заводе", text: "Изготовление на заводе-производителе от 5 рабочих дней" },
          { step: "04", title: "Монтаж", text: "Установка по ГОСТу, уборка, сдача по акту" },
        ]}
      >
        {/* SEO-текст */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <div className="prose prose-lg max-w-none">

              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-6">Пластиковые окна в Иркутске</h2>
              <p className="text-slate-600 leading-relaxed mb-6">
                Компания «Вектор Комфорта» поставляет и устанавливает <strong>пластиковые окна в Иркутске</strong> с 2010 года. Мы работаем напрямую с заводом-производителем профиля VEKA, закупаем с дилерской скидкой и передаём эту экономию клиентам — наши цены на 15–20% ниже рыночных. Используем фурнитуру MACO, монтируем по ГОСТу и даём гарантию до 5 лет. Работаем по Иркутску, Ангарску, Шелехову, Хомутово и пригороду до 50 км.
              </p>

              <h2 className="text-2xl font-extrabold text-slate-900 mt-10 mb-6">Рассчитайте стоимость онлайн</h2>
              <p className="text-slate-600 leading-relaxed mb-6">
                На нашем сайте есть <strong>бесплатный калькулятор окон</strong> — введите размеры, выберите тип монтажа и получите расчёт за 1 минуту. Точную цену называем после бесплатного замера, потому что каждое окно изготавливается индивидуально под ваш проём. Замер и консультация — бесплатно, ни к чему не обязывают.
              </p>

              <h2 className="text-2xl font-extrabold text-slate-900 mt-10 mb-6">Какие окна мы поставляем</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Закажите через нас любые пластиковые конструкции — от бюджетных до премиум-сегмента:
              </p>
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <strong className="text-[#1a3a5c]">Бюджетный сегмент</strong>
                  <p className="text-sm text-slate-500 mt-1">Профиль VEKA WHS — 4 или 5 камерный. Надёжный, тёплый, отличное соотношение цена/качество для квартир.</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <strong className="text-[#1a3a5c]">Премиум-сегмент</strong>
                  <p className="text-sm text-slate-500 mt-1">Профиль VEKA Soft Line — 5, 6 или 7 камерный. Максимальная теплоизоляция для частных домов и премиум-ремонтов.</p>
                </div>
              </div>
              <p className="text-slate-600 leading-relaxed mb-6">
                <strong>Любой цвет:</strong> белые, ламинированные под дерево (дуб, орех, тик), окрашенные в любой цвет RAL. <strong>Любой вид конструкций:</strong> обычные окна ПВХ, панорамные окна, балконные блоки, двери, витражи, стеклянные перегородки. <strong>Любая конфигурация:</strong> поворотные, откидные, поворотно-откидные створки.
              </p>

              <h2 className="text-2xl font-extrabold text-slate-900 mt-10 mb-6">Остекление балконов и лоджий</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Превращаем холодный балкон в тёплую комнату — для отдыха, кабинета или хранения:
              </p>
              <ul className="space-y-2 text-slate-600 mb-6">
                <li className="flex items-start gap-2"><span className="text-[#ff6b35] font-bold">•</span> Тёплое остекление профиль VEKA (5-камерный, двухкамерный стеклопакет)</li>
                <li className="flex items-start gap-2"><span className="text-[#ff6b35] font-bold">•</span> Холодное остекление алюминиевым профилем (для кладовок)</li>
                <li className="flex items-start gap-2"><span className="text-[#ff6b35] font-bold">•</span> Утепление пола, стен и потолка под ключ</li>
                <li className="flex items-start gap-2"><span className="text-[#ff6b35] font-bold">•</span> Чистовая отделка (панели, ламинат)</li>
                <li className="flex items-start gap-2"><span className="text-[#ff6b35] font-bold">•</span> Антимоскитные сетки и тёплый пол (по желанию)</li>
              </ul>
              <p className="text-slate-600 leading-relaxed mb-6">
                Стоимость остекления балкона рассчитайте на нашем калькуляторе или позвоните — назовём примерную цену за 15 минут. Замер — бесплатно.
              </p>

              <h2 className="text-2xl font-extrabold text-slate-900 mt-10 mb-6">Фурнитура MACO</h2>
              <p className="text-slate-600 leading-relaxed mb-6">
                В каждый комплект окон входит <strong>фурнитура MACO</strong> — один из лучших производителей в мире. Микропроветривание позволяет проветривать комнату без сквозняков. Блокиратор ошибочного открывания защищает створку от провисания. Антимоскитные сетки — в комплекте. Гарантия на фурнитуру 5 лет.
              </p>

              <h2 className="text-2xl font-extrabold text-slate-900 mt-10 mb-6">Монтаж по ГОСТу — почему это важно</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Правильный монтаж важнее самого окна. Мы устанавливаем строго по <strong>ГОСТ 30971-2012</strong>:
              </p>
              <ul className="space-y-2 text-slate-600 mb-6">
                <li className="flex items-start gap-2"><span className="text-emerald-500 font-bold">✓</span> Трёхслойный монтажный шов (пена + пароизоляция внутри + влагоизоляция снаружи)</li>
                <li className="flex items-start gap-2"><span className="text-emerald-500 font-bold">✓</span> Установка на пластиковые клинья (не на бруски, которые гниют)</li>
                <li className="flex items-start gap-2"><span className="text-emerald-500 font-bold">✓</span> ПСУЛ (лента) по периметру снаружи — защита от влаги и ветра</li>
                <li className="flex items-start gap-2"><span className="text-emerald-500 font-bold">✓</span> Пароизоляционная лента внутри помещения — защита от плесени</li>
                <li className="flex items-start gap-2"><span className="text-emerald-500 font-bold">✓</span> Проверка открывания и регулировка створок после установки</li>
              </ul>
              <p className="text-slate-600 leading-relaxed mb-6">
                Дешёвый монтаж (просто пена без защитных лент) приводит к промерзанию, продуванию и плесени через 2–3 года. Монтаж по ГОСТу — это тепло и долговечность окон на 15–20 лет.
              </p>

              <h2 className="text-2xl font-extrabold text-slate-900 mt-10 mb-6">География работы</h2>
              <p className="text-slate-600 leading-relaxed mb-6">
                Замер и монтаж — по Иркутску и пригороду: Ангарск (50 км), Шелехов (20 км), Хомутово (15 км), посёлок Молодёжный, Ново-Ленино, Солнечный, Маркова и другие населённые пункты в радиусе 50 км. Выезд замерщика — бесплатно в день обращения.
              </p>

              <h2 className="text-2xl font-extrabold text-slate-900 mt-10 mb-6">Гарантия и документы</h2>
              <p className="text-slate-600 leading-relaxed mb-6">
                На окна ПВХ — гарантия 3 года. На монтажные работы — 1 год. При монтаже по ГОСТу срок службы окон — 20+ лет. Работаем <strong>по договору</strong>. Принимаем заказы как от <strong>физических лиц</strong>, так и от <strong>юридических лиц</strong> — заключаем договор и предоставляем все необходимые документы.
              </p>

              <div className="mt-10 p-6 rounded-2xl bg-gradient-to-br from-[#1a3a5c] to-slate-900 text-white text-center">
                <h3 className="text-xl font-extrabold mb-2">Бесплатный замер окон в Иркутске</h3>
                <p className="text-slate-300 mb-4">Перезвоним за 15 минут и рассчитаем стоимость бесплатно</p>
                <a href="tel:+79149146606" className="inline-block rounded-full bg-[#ff6b35] px-8 py-4 font-extrabold">📞 +7 (914) 914-66-06</a>
              </div>

            </div>
          </div>
        </section>
      </ServicePage>

      <WindowsGallery />
      <Counters />
      <WindowCalculator />
      <Reviews />
    </>
  );
}
