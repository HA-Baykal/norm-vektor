interface PhotoPlaceholderProps {
  title: string;
  icon: string;
  count?: number;
}

export default function PhotoPlaceholder({ title, icon, count = 6 }: PhotoPlaceholderProps) {
  return (
    <section className="py-16 md:py-20 bg-slate-50 dark:bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h2>
          <p className="text-slate-600 dark:text-slate-400 mt-3">Фото наших работ — скоро появится</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: count }).map((_, i) => (
            <div
              key={i}
              className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-700 border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 hover:border-brand-400 dark:hover:border-accent-500 hover:text-brand-500 dark:hover:text-accent-400 transition"
            >
              <div className="text-5xl mb-2">{icon}</div>
              <div className="text-sm font-medium">Фото работы {i + 1}</div>
              <div className="text-xs mt-1 opacity-70">будет добавлено</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
