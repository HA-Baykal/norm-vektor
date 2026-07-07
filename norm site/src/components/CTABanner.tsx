import { Link } from "react-router-dom";
import QuoteForm from "./QuoteForm";

export default function CTABanner() {
  return (
    <section className="py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 via-brand-800 to-slate-900 text-white p-8 md:p-12 shadow-2xl">
          {/* Декор */}
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-accent-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-brand-500/20 rounded-full blur-3xl" />

          <div className="relative grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
                Нужна консультация?
              </h2>
              <p className="text-brand-100 text-lg mb-6">
                Оставьте заявку — перезвоним в течение 15 минут, бесплатно проконсультируем и подберём оптимальное решение под ваш бюджет.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="tel:+79149146606"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-brand-700 font-semibold hover:bg-accent-400 hover:text-white transition"
                >
                  📞 +7 (914) 914-66-06
                </a>
                <a
                  href="tel:+73952669930"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent-500 hover:bg-accent-600 text-white font-semibold transition"
                >
                  📞 66-99-30
                </a>
                <Link
                  to="/kontakty"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-white/30 hover:border-white text-white font-semibold transition"
                >
                  Все контакты →
                </Link>
              </div>
            </div>
            <div>
              <QuoteForm compact />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
