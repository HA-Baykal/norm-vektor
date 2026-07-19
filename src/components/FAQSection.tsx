import { useState } from "react";

const faqItems = [
  {
    q: "Сколько стоит замер и ни к чему ли он меня не обязывает?",
    a: "Выезд замерщика, технический осмотр объекта, расчёт и консультация абсолютно бесплатны в Иркутске, Ангарске, Шелехове и Хомутово (пригород до 50 км). Замер вас ни к чему не обязывает.",
  },
  {
    q: "За сколько дней вы изготавливаете и монтируете пластиковые окна?",
    a: "Срок изготовления окон из профиля VEKA на нашем собственном производстве в Иркутске составляет от 5 до 14 рабочих дней. Стандартный монтаж готового окна занимает 2–3 часа.",
  },
  {
    q: "Сколько стоит и сколько длится установка кондиционера?",
    a: "Стандартный монтаж сплит-системы в готовый ремонт стоит 18 000 ₽ и занимает от 2,5 до 4 часов. Мы обязательно вакуумируем трассу, проверяем соединения под давлением и убираем за собой весь строительный мусор.",
  },
  {
    q: "Можно ли устанавливать кондиционер и делать замену окон зимой?",
    a: "Да. Для зимнего монтажа окон мы используем специализированные тёплые экраны и зимнюю монтажную пену (до −18 °C), благодаря чему проём остаётся открытым не более 15 минут. Кондиционеры также устанавливаем зимой с сухим вакуумированием трассы.",
  },
  {
    q: "Что такое «сухое» алмазное бурение и не испортит ли оно обои?",
    a: "Сухое алмазное бурение выполняется безударным методом со специальной алмазной коронкой и подключением мощного промышленного пылесоса. Пыль и бетонная крошка моментально засасываются в пылесос, не оставляя грязи и брызг на чистых обоях или мебели.",
  },
  {
    q: "Какую гарантию вы даёте на работы и оборудование?",
    a: "Гарантия на профиль VEKA — до 10 лет, на кондиционеры и бризеры — от 2 до 5 лет (в зависимости от бренда). На все виды монтажных работ компания «Вектор Комфорта» предоставляет собственную официальную гарантию до 5 лет.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 md:py-24 bg-white dark:bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-400 text-xs font-bold uppercase tracking-widest mb-3">
            Вопросы и ответы
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Часто задаваемые вопросы
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-3 text-base">
            Отвечаем на популярные вопросы наших клиентов перед заказом
          </p>
        </div>

        <div className="space-y-4">
          {faqItems.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 overflow-hidden transition duration-200"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 font-bold text-slate-900 dark:text-white text-base sm:text-lg focus:outline-none"
                >
                  <span>{item.q}</span>
                  <span
                    className={`shrink-0 w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 transition-transform duration-300 font-extrabold text-sm ${
                      isOpen ? "rotate-180 bg-[#ff6b35] text-white" : ""
                    }`}
                  >
                    ↓
                  </span>
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-200/60 dark:border-slate-800/60">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}