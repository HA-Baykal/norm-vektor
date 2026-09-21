import { Link, useLocation } from "react-router-dom";
import { useSeo, useBreadcrumb } from "../utils/useSeo";
import { LEGAL_DOCS, LEGAL_NAV, type LegalBlock } from "../data/legal";
import NotFound from "./NotFound";

// ============================================================================
// ЮРИДИЧЕСКИЕ СТРАНИЦЫ: политика, согласие, реквизиты.
// Тексты — в src/data/legal.ts. Здесь только отрисовка.
// ============================================================================

const URL_RE = /(https?:\/\/[^\s,;)]+[^\s,;.)])/g;

function withLinks(text: string) {
  const parts = text.split(URL_RE);
  return parts.map((part, i) =>
    URL_RE.test(part) ? (
      <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-brand-700 dark:text-accent-400 underline break-all">{part}</a>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

function Block({ block }: { block: LegalBlock }) {
  switch (block.type) {
    case "h2":
      return <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-3">{block.text}</h2>;
    case "p":
      return <p className="leading-relaxed text-slate-700 dark:text-slate-300 mb-3">{withLinks(block.text)}</p>;
    case "ul":
      return (
        <ul className="list-disc pl-6 space-y-1.5 text-slate-700 dark:text-slate-300 mb-4">
          {block.items.map((it, i) => <li key={i}>{withLinks(it)}</li>)}
        </ul>
      );
    case "table":
      return (
        <div className="overflow-x-auto my-4 rounded-2xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-sm">
            <tbody>
              {block.rows.map(([k, v]) => (
                <tr key={k} className="border-b last:border-b-0 border-slate-200 dark:border-slate-800">
                  <th className="text-left align-top font-semibold px-4 py-3 bg-slate-50 dark:bg-slate-900 w-1/3 text-slate-900 dark:text-white">{k}</th>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{withLinks(v)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
  }
}

export default function LegalPage() {
  const { pathname } = useLocation();
  const doc = LEGAL_DOCS[pathname.replace(/\/+$/, "") || pathname];

  useSeo(doc?.title ?? "", doc?.description ?? "");
  useBreadcrumb(doc ? [{ name: "Главная", path: "/" }, { name: doc.navTitle, path: doc.path }] : []);

  if (!doc) return <NotFound />;

  return (
    <>
      <section className="bg-gradient-to-br from-brand-700 via-brand-800 to-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">
          <nav className="text-sm text-brand-100 mb-4" aria-label="Хлебные крошки">
            <Link to="/" className="hover:underline">Главная</Link> <span className="mx-1">/</span> <span>{doc.navTitle}</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-extrabold">{doc.h1}</h1>
        </div>
      </section>

      <section className="py-10 md:py-14">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-wrap gap-2 mb-8">
            {LEGAL_NAV.map((l) => (
              <Link
                key={l.href}
                to={l.href}
                className={`px-3 py-1.5 rounded-full text-sm border transition ${
                  l.href === doc.path
                    ? "bg-brand-700 text-white border-brand-700"
                    : "border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-brand-500"
                }`}
              >
                {l.label}
              </Link>
            ))}
            <Link to="/kontakty" className="px-3 py-1.5 rounded-full text-sm border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-brand-500 transition">Контакты</Link>
          </div>

          <article>
            {doc.blocks.map((b, i) => <Block key={i} block={b} />)}
          </article>
        </div>
      </section>
    </>
  );
}
