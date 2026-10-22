import { Link } from "react-router-dom";
import { trackInterierEvent } from "../constants/interier";

export function DeveloperBio() {
  return (
    <section className="py-5 sm:py-7 bg-white dark:bg-slate-950" aria-labelledby="developer-bio-title">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="developer-bio">
          <div className="developer-bio-icon" aria-hidden="true">
            &lt;/&gt;
          </div>
          <div className="flex-1">
            <h2 id="developer-bio-title">Этот сайт и Interier — моя собственная разработка</h2>
            <p>
              Здравствуйте! Я — владелец «Вектора Комфорта» и разработчик. Этот сайт, онлайн-калькуляторы и сервис Interier
              созданы мной от идеи до запуска: дизайн, код, сервер, интеграции с искусственным интеллектом. Разрабатываю сайты
              и веб-приложения под ключ — лендинги, корпоративные сайты, онлайн-сервисы, личные кабинеты, в том числе с ИИ.
              Если вам нужен такой же сайт или своё приложение — напишите, обсудим задачу и сроки.
            </p>
          </div>
          <Link
            to="/kontakty"
            onClick={() => trackInterierEvent("bio_cta_click")}
            className="developer-bio-cta"
          >
            Обсудить ваш проект →
          </Link>
        </div>
      </div>
    </section>
  );
}

export function InterierArticleCta() {
  return (
    <aside className="interier-article-cta">
      <div>
        <strong>Перед ремонтом посмотрите комнату в новом стиле</strong>
        <p>
          Interier — дизайн интерьера по фото. Загрузите снимок комнаты и получите первый проект бесплатно.
        </p>
      </div>
      <Link to="/interier">Открыть Interier →</Link>
    </aside>
  );
}
