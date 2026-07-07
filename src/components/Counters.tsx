import { useEffect, useRef, useState } from "react";

interface CounterProps {
  value: number;
  suffix?: string;
  label: string;
  icon: string;
}

function Counter({ value, suffix = "", label, icon }: CounterProps) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started) {
            setStarted(true);
            let current = 0;
            const step = Math.max(1, Math.floor(value / 40));
            const interval = setInterval(() => {
              current += step;
              if (current >= value) {
                current = value;
                clearInterval(interval);
              }
              setDisplay(current);
            }, 30);
          }
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, started]);

  return (
    <div ref={ref} className="text-center p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-300 dark:hover:border-accent-500 transition group">
      <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{icon}</div>
      <div className="text-4xl md:text-5xl font-extrabold text-brand-700 dark:text-accent-400 animate-counter">
        {display}{suffix}
      </div>
      <div className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-400">{label}</div>
    </div>
  );
}

export default function Counters() {
  const stats = [
    { value: 15, suffix: "+", label: "лет опыта работы", icon: "🏆" },
    { value: 3500, suffix: "+", label: "выполненных проектов", icon: "✅" },
    { value: 5, suffix: " лет", label: "гарантия на монтаж", icon: "🛡️" },
    { value: 50, suffix: " км", label: "зона обслуживания", icon: "📍" },
  ];

  return (
    <section className="py-16 bg-slate-50 dark:bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">
            Цифры, которые говорят за нас
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-3 max-w-2xl mx-auto">
            Мы — команда профессионалов с многолетним опытом работы в сфере остекления, климата и вентиляции
          </p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((s) => (
            <Counter key={s.label} {...s} />
          ))}
        </div>
      </div>
    </section>
  );
}
