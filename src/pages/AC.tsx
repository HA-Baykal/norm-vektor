import ServicePage from "../components/ServicePage";
import Counters from "../components/Counters";
import CatalogConditioners from "../components/CatalogConditioners";
import Reviews from "../components/Reviews";


export default function AC() {
  return (
    <>
      <ServicePage
        title="Кондиционеры"
        ctaLabel="🛒 Каталог моделей"
        ctaHref="#catalog"
        tagline="Продажа, профессиональный монтаж, обслуживание, чистка и заправка фреона"
        heroIcon="❄️"
        intro="Продажа большого выбора моделей кондиционеров и профессиональный монтаж. Монтируем в квартирах, домах, магазинах, офисах и коммерческих зданиях. Выполняем обслуживание, чистку, диагностику и заправку фреона."
        breadcrumb="Кондиционеры"
        advantages={[
          { icon: "🏅", title: "Подбор модели", text: "Поможем выбрать кондиционер по площади, уровню шума, бюджету и режимам работы" },
          { icon: "📦", title: "Большой выбор", text: "Настенные, кассетные, канальные, мульти-сплит, VRF/VRV. Под любой бюджет" },
          { icon: "⚡", title: "Монтаж за 1 день", text: "Стандартная установка — за 3–4 часа. Сложные объекты — по согласованию" },
          { icon: "🔧", title: "Сервис и обслуживание", text: "Чистка, антибактериальная обработка, диагностика и заправка фреона" },
        ]}
        services={[
          { icon: "🏠", title: "Кондиционеры в квартиру", text: "Настенные инверторные сплит-системы. Тихая работа, экономия энергии." },
          { icon: "🏡", title: "Кондиционеры в частный дом", text: "Мульти-сплит системы на несколько комнат, канальные решения." },
          { icon: "🏬", title: "Магазины и офисы", text: "Кассетные и канальные кондиционеры, подпотолочные модели." },
          { icon: "🏢", title: "Коммерческие объекты", text: "Полупромышленные системы, VRF/VRV, чиллеры. Проектирование и монтаж." },
          { icon: "🛠️", title: "Монтаж и установка", text: "Штробление, прокладка трассы, вакуумирование, пуско-наладка." },
          { icon: "🧼", title: "Сервис и чистка", text: "Регулярное обслуживание, заправка фреоном, антибактериальная обработка." },
        ]}
        process={[
          { step: "01", title: "Консультация", text: "Подберём модель под площадь, бюджет и особенности помещения" },
          { step: "02", title: "Осмотр объекта", text: "Выезд инженера, выбор места установки, согласование трассы" },
          { step: "03", title: "Поставка", text: "Доставка оборудования со склада в Иркутске" },
          { step: "04", title: "Монтаж и пуск", text: "Установка, проверка, инструктаж по эксплуатации" },
        ]}
        photosIcon="❄️"
        photosTitle="Установленные кондиционеры"
      >

        {/* SEO-текст */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <div className="prose prose-lg max-w-none">

              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-6">Кондиционеры в Иркутске — продажа и профессиональный монтаж</h2>
              <p className="text-slate-600 leading-relaxed mb-6">
                «Вектор Комфорта» — специализированный подрядчик по климатическому оборудованию в Иркутске и Иркутской области. В нашем каталоге более 70 моделей <strong>кондиционеров с установкой</strong>: от бюджетных on/off сплит-систем до премиальных инверторных решений. Работаем через официальные каналы поставки напрямую от производителей и крупнейших федеральных дистрибьюторов — цены ниже рыночных, на всё оборудование действует заводская гарантия от 3 до 5 лет.
              </p>

              <h2 className="text-2xl font-extrabold text-slate-900 mt-10 mb-6">Каталог кондиционеров с фильтрами</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                На сайте представлен <strong>каталог сплит-систем</strong> с удобными фильтрами — подберите технику по параметрам:
              </p>
              <ul className="space-y-2 text-slate-600 mb-6">
                <li className="flex items-start gap-2"><span className="text-[#ff6b35] font-bold">•</span> Площади помещения — от 20 до 180 м²</li>
                <li className="flex items-start gap-2"><span className="text-[#ff6b35] font-bold">•</span> Типу: инверторный, обычный (on/off), полупромышленный (кассетный)</li>
                <li className="flex items-start gap-2"><span className="text-[#ff6b35] font-bold">•</span> Бренду: Daikin, Kentatsu, Daichi, Midea, Bosch, Ballu, Electrolux, Royal Thermo, Toshiba, AURUS, Axioma, Aurum, Primera, Ecoletta, Coolup</li>
                <li className="flex items-start gap-2"><span className="text-[#ff6b35] font-bold">•</span> Наличию Wi-Fi и интеграции с умным домом</li>
                <li className="flex items-start gap-2"><span className="text-[#ff6b35] font-bold">•</span> Ценовому сегменту и мощности в BTU</li>
              </ul>
              <p className="text-slate-600 leading-relaxed mb-6">
                В каждой карточке модели — актуальные технические характеристики, фото, наличие на складе и кнопка «Заказать». Можно сразу выбрать мощность и добавить стандартный монтаж к стоимости — итоговая цена отобразится в калькуляторе.
              </p>

              <h2 className="text-2xl font-extrabold text-slate-900 mt-10 mb-6">Инверторный или обычный — что выбрать</h2>
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <strong className="text-[#1a3a5c]">Инверторный кондиционер</strong>
                  <p className="text-sm text-slate-500 mt-1">Плавно регулирует мощность компрессора без циклических включений. Работает тише, экономит до 40% электроэнергии, точнее поддерживает заданную температуру и служит дольше. Эффективен на обогрев до −15 °C. Рекомендуем для квартир, спален и офисов, где важен комфорт и низкий уровень шума.</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <strong className="text-[#1a3a5c]">Обычный (on/off)</strong>
                  <p className="text-sm text-slate-500 mt-1">Компрессор работает циклами — включается на полную мощность и отключается при достижении температуры. Проще в устройстве, дешевле в покупке. Надёжная технология для дач, подсобных помещений, гаражей и сезонного использования. Оптимальное соотношение цена и качество.</p>
                </div>
              </div>
              <p className="text-slate-600 leading-relaxed mb-6">
                Не уверены, какой тип подойдёт именно вам? Позвоните — бесплатно подберём модель под площадь, бюджет и особенности помещения.
              </p>

              <h2 className="text-2xl font-extrabold text-slate-900 mt-10 mb-6">Бренды, представленные в каталоге</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Мы поставляем климатическое оборудование только через официальные каналы — полный пакет документов, сертификаты соответствия и заводская гарантия на каждую единицу:
              </p>
              <ul className="space-y-2 text-slate-600 mb-6">
                <li className="flex items-start gap-2"><span className="text-emerald-500 font-bold">✓</span> <strong>Daikin</strong> — японский премиум. Серии Perfera, Sensira, Emura, Ururu Sarara. Компрессор Swing, работа при −25 °C, гарантия 5 лет.</li>
                <li className="flex items-start gap-2"><span className="text-emerald-500 font-bold">✓</span> <strong>Kentatsu</strong> — японский бренд с компрессорами GMCC-Toshiba. Линейки Кумо, Канами, Харуки, Тиба, Юки, Ичи, Семпай, Атама, Отари. Гарантия до 5 лет.</li>
                <li className="flex items-start gap-2"><span className="text-emerald-500 font-bold">✓</span> <strong>Daichi</strong> — российский бренд с японскими комплектующими. Серии Эверест, Эйр, Миракл, Айс, Альпайн, Эволюшн, Сибериа, Карбон. Широкий выбор инверторов и on/off моделей.</li>
                <li className="flex items-start gap-2"><span className="text-emerald-500 font-bold">✓</span> <strong>Midea</strong> — крупнейший в мире производитель климатической техники. Парамаунт, Анлимитед, Изи, Футура, Персона, Бризлесс, ХитФорс, Гайа, Кидс Стар. Технологии Full DC Inverter.</li>
                <li className="flex items-start gap-2"><span className="text-emerald-500 font-bold">✓</span> <strong>Bosch</strong> — немецкое качество. Climate Line 2000, Climate Line 5000, Climate 5000, Climate 6000i. Премиум-сегмент для частных домов и бизнеса.</li>
                <li className="flex items-start gap-2"><span className="text-emerald-500 font-bold">✓</span> <strong>Ballu</strong> — народный бренд, покрытие Golden Fin, отличное соотношение цена и качество.</li>
                <li className="flex items-start gap-2"><span className="text-emerald-500 font-bold">✓</span> <strong>Electrolux</strong> — скандинавский дизайн, Wi-Fi, тихая работа от 21 дБ.</li>
                <li className="flex items-start gap-2"><span className="text-emerald-500 font-bold">✓</span> <strong>Royal Thermo, Toshiba, AURUS</strong> — премиум и эксклюзивные модели.</li>
                <li className="flex items-start gap-2"><span className="text-emerald-500 font-bold">✓</span> <strong>Axioma, Aurum, Primera, Ecoletta, Coolup, Asita</strong> — доступный и средний сегмент. Проверенные сплит-системы с официальной гарантией.</li>
              </ul>

              <h2 className="text-2xl font-extrabold text-slate-900 mt-10 mb-6">Профессиональный монтаж кондиционеров </h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Качество монтажа важнее марки кондиционера. Неправильная установка сокращает срок службы компрессора в 2–3 раза. Мы выполняем монтаж строго по технологии производителей:
              </p>
              <ul className="space-y-2 text-slate-600 mb-6">
                /*<li className="flex items-start gap-2"><span className="text-emerald-500 font-bold">✓</span> <strong>Вакуумирование фреоновой магистрали</strong> — обязательный этап. Удаляем влагу и воздух из трассы, предотвращаем гидроудар и коррозию компрессора</li>*/
                <li className="flex items-start gap-2"><span className="text-emerald-500 font-bold">✓</span> Медная трасса нужного диаметра, без перегибов и деформаций</li>
                <li className="flex items-start gap-2"><span className="text-emerald-500 font-bold">✓</span> Теплоизоляция магистрали без разрывов — предотвращаем потери холода и конденсат</li>
                <li className="flex items-start gap-2"><span className="text-emerald-500 font-bold">✓</span> Дренажная линия с правильным уклоном — вода уходит самотёком, без застоев</li>
                <li className="flex items-start gap-2"><span className="text-emerald-500 font-bold">✓</span> Проверка герметичности, давления и запуск системы в присутствии заказчика</li>
                <li className="flex items-start gap-2"><span className="text-emerald-500 font-bold">✓</span> Стандартный монтаж занимает 3–4 часа. Убираем за собой, защищаем мебель и полы</li>
              </ul>
              <p className="text-slate-600 leading-relaxed mb-6">
                Монтаж сопровождается гарантией на работы 1 год. При правильной установке и регулярном ТО кондиционер прослужит 10–15 лет без капитального ремонта.
              </p>

              <h2 className="text-2xl font-extrabold text-slate-900 mt-10 mb-6">Wi-Fi и умный дом</h2>
              <p className="text-slate-600 leading-relaxed mb-6">
                Многие модели в каталоге поддерживают управление со смартфона — включайте кондиционер за полчаса до прихода домой, настраивайте температуру с кровати, задавайте расписание работы по часам и дням недели. Часть моделей интегрируется с голосовыми помощниками. Уточняйте наличие Wi-Fi-модуля в карточке товара или у менеджера.
              </p>

              <h2 className="text-2xl font-extrabold text-slate-900 mt-10 mb-6">Сервис, заправка и обслуживание</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Помимо продажи и установки выполняем полный спектр сервисных работ:
              </p>
              <ul className="space-y-2 text-slate-600 mb-6">
                <li className="flex items-start gap-2"><span className="text-[#ff6b35] font-bold">•</span> Сезонное техническое обслуживание — чистка фильтров, теплообменников, проверка фреона</li>
                <li className="flex items-start gap-2"><span className="text-[#ff6b35] font-bold">•</span> Заправка и дозаправка фреона R32, R410A</li>
                <li className="flex items-start gap-2"><span className="text-[#ff6b35] font-bold">•</span> Диагностика неисправностей и устранение поломок</li>
                <li className="flex items-start gap-2"><span className="text-[#ff6b35] font-bold">•</span> Демонтаж старого кондиционера с сохранением фреона</li>
                <li className="flex items-start gap-2"><span className="text-[#ff6b35] font-bold">•</span> Антибактериальная обработка внутреннего блока</li>
              </ul>
              <p className="text-slate-600 leading-relaxed mb-6">
                Рекомендуем проходить ТО раз в год — это продлевает срок службы техники на 5–7 лет и снижает расход электроэнергии до 15%. Заправка фреона в Иркутске — выезд в день обращения.
              </p>

              <h2 className="text-2xl font-extrabold text-slate-900 mt-10 mb-6">Для кого работаем</h2>
              <p className="text-slate-600 leading-relaxed mb-6">
                Принимаем заказы от <strong>физических и юридических лиц</strong>. Для организаций оформляем поставку по договору с полным пакетом документов — счёт, акт, накладная. Работаем с управляющими компаниями, строительными подрядчиками, торговыми центрами и частными клиентами. Оплата по безналичному расчёту и наличными.
              </p>

              <h2 className="text-2xl font-extrabold text-slate-900 mt-10 mb-6">География работы</h2>
              <p className="text-slate-600 leading-relaxed mb-6">
                Замер, доставка и монтаж — по Иркутску, Ангарску, Шелехову, Хомутово, посёлку Молодёжный, Ново-Ленино, Солнечному, Марковой и другим населённым пунктам в радиусе 50 км от Иркутска. Бесплатный выезд замерщика в день обращения. Доставка оборудования — согласовываем индивидуально.
              </p>

              <div className="mt-10 p-6 rounded-2xl bg-gradient-to-br from-[#1a3a5c] to-slate-900 text-white text-center">
                <h3 className="text-xl font-extrabold mb-2">Бесплатный подбор и замер</h3>
                <p className="text-slate-300 mb-4">Подберём кондиционер под вашу площадь за 15 минут</p>
                <a href="tel:+79149146606" className="inline-block rounded-full bg-[#ff6b35] px-8 py-4 font-extrabold">📞 +7 (914) 914-66-06</a>
              </div>

            </div>
          </div>
        </section>

      </ServicePage>
      <CatalogConditioners />
      <Counters />
      <Reviews />
    </>
  );
}
