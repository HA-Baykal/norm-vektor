// Чтение базы знаний и правила, по которым она считается правильной.
//
// Тексты статей лежат в articleContent внутри src/pages/BlogArticle.tsx.
// Из него сборка делает карточки списка (src/data/blogIndexData.ts) и
// данные для серверной отрисовки (src/data/articlesData.ts) — держать поля в
// этих файлах вручную не нужно. Общие правила одни на всех: и проверка, и
// правка текстов ходят сюда.

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

export const BLOG_ARTICLE = "src/pages/BlogArticle.tsx";
export const ARTICLES_DATA = "src/data/articlesData.ts";

const ARTICLE_START = "const articleContent: Record<string, Article> = {";
// Файл может лежать и с CRLF, и с LF — ищем границу конца без привязки к ним.
const ARTICLE_END = /};\s*\n\s*export default function BlogArticle/;

export const read = (rel) => readFileSync(join(ROOT, rel), "utf8");
export const write = (rel, text) => writeFileSync(join(ROOT, rel), text, "utf8");

/** Вырезать сбалансированный кусок от открывающей скобки до парной закрывающей. */
function sliceBalanced(source, from, open, close) {
  let depth = 0;
  for (let i = from; i < source.length; i += 1) {
    if (source[i] === open) depth += 1;
    else if (source[i] === close) {
      depth -= 1;
      if (depth === 0) return { text: source.slice(from, i + 1), end: i + 1 };
    }
  }
  throw new Error("не нашёл закрывающую скобку");
}

/** Объект articleContent из BlogArticle.tsx. */
/** Границы объекта articleContent в файле: от «{» до парной «}». */
function bounds(source) {
  const start = source.indexOf(ARTICLE_START);
  const end = ARTICLE_END.exec(source);
  if (start < 0 || !end) throw new Error("в BlogArticle.tsx не найден articleContent");
  const from = source.indexOf("{", start + ARTICLE_START.length - 1);
  const { end: closeAt } = sliceBalanced(source, from, "{", "}");
  return { from, closeAt };
}

export function readArticleContent() {
  const source = read(BLOG_ARTICLE);
  const { from, closeAt } = bounds(source);
  return eval("(" + source.slice(from, closeAt) + ")");
}

/** Записать articleContent обратно, сохранив остальной файл как есть. */
export function writeArticleContent(content) {
  const source = read(BLOG_ARTICLE);
  const { from, closeAt } = bounds(source);
  write(BLOG_ARTICLE, source.slice(0, from) + JSON.stringify(content, null, 2) + source.slice(closeAt));
}

// ============================================================
// ПРАВИЛА
// ============================================================

export const CATEGORIES = ["Окна", "Кондиционеры", "Вентиляция", "Алмазное бурение", "Балконы"];

/** Значок карточки по теме статьи. */
export const ICON = /^[^\p{L}\p{N}\s]+$/u; // эмодзи или знак, но не слово
export const ENDING = /[.!?…»"]$/u;
// Нижняя граница объёма, а не цель: короче — уже не ответ на вопрос,
// ради которого статью ищут. Статьи пишутся содержательнее этого порога.
export const MIN_WORDS = 200;

/** Заголовок без регистра и знаков — чтобы сравнить записи «об одном и том же». */
export const headingKey = (s) =>
  String(s || "")
    .toLowerCase()
    .replace(/ё/g, "е")
    .replace(/[«»]/g, '"')
    .replace(/[—–−]/g, "-")
    .replace(/[^0-9a-zа-я]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/** Один и тот же заголовок, записанный чуть иначе. */
export function sameHeading(left, right) {
  const a = headingKey(left);
  const b = headingKey(right);
  if (!a || !b) return false;
  return a === b || a.startsWith(b) || b.startsWith(a);
}

/** Слова без знаков препинания. */
export const wordList = (s) =>
  String(s || "")
    .split(/\s+/)
    .map((w) => w.replace(/[^\p{L}\p{N}]/gu, "").toLowerCase())
    .filter(Boolean);

/** Сколько первых слов абзаца совпадает с первыми словами анонса. */
export function leadOverlap(paragraph, lead) {
  const left = wordList(paragraph);
  const right = wordList(lead);
  let count = 0;
  for (let i = 0; i < Math.min(left.length, right.length); i += 1) {
    if (!left[i] || left[i] !== right[i]) break;
    count += 1;
  }
  return count;
}

/** Абзац открывается почти теми же словами, что и анонс. */
export function repeatsLead(paragraph, lead) {
  const total = wordList(lead).length;
  if (total < 8) return false;
  return leadOverlap(paragraph, lead) >= Math.max(8, Math.floor(total * 0.7));
}

export function countWords(article) {
  let words = 0;
  for (const block of article.content || []) {
    if (block.type === "p" || block.type === "h") {
      words += String(block.text || "").split(/\s+/).filter(Boolean).length;
    } else if (block.type === "list") {
      for (const item of block.items || []) {
        words += String(item).split(/\s+/).filter(Boolean).length;
      }
    }
  }
  return words;
}

// ============================================================
// СБОРКА ДАННЫХ ДЛЯ САЙТА
// ============================================================

export const BLOG_INDEX_DATA = "src/data/blogIndexData.ts";

/** Значок карточки по теме статьи. Новая тема без значка покажется как 📘. */
export const INDEX_ICONS = {
  "Окна": "🪟",
  "Кондиционеры": "❄️",
  "Вентиляция": "💨",
  "Алмазное бурение": "🔩",
};

/** Обрезка анонса для карточки: по границе слова, максимум 220 знаков. */
function clipIndexExcerpt(text) {
  const value = String(text || "");
  if (value.length <= 220) return value;
  return `${value.slice(0, 219).replace(/\s+\S*$/u, "").trimEnd()}…`;
}

/** Карточка списка. Все поля, кроме адреса, берутся из текста статьи. */
export function cardOf(slug, article) {
  if (!article.title || !article.date || !article.category) {
    throw new Error(`У статьи ${slug} отсутствуют обязательные поля title/date/category`);
  }
  const contentText = (article.content || [])
    .flatMap((block) => (block.type === "list" ? block.items || [] : [block.text || ""]))
    .join(" ");
  const words = `${article.summary || ""} ${contentText}`.match(/[\p{L}\p{N}]+/gu)?.length || 0;
  return {
    slug,
    date: article.date,
    title: article.title,
    excerpt: clipIndexExcerpt(article.excerpt || article.summary || contentText || article.title),
    category: article.category,
    icon: INDEX_ICONS[article.category] || "📘",
    readTime: `${Math.max(1, Math.ceil(words / 180))} мин`,
  };
}

/** Карточки списка по всем статьям, свежие сверху. */
export function buildCards(content) {
  return Object.keys(content)
    .map((slug) => cardOf(slug, content[slug]))
    .sort((a, b) => (b.date || "").localeCompare(a.date || "") || a.slug.localeCompare(b.slug));
}

/** Текст файла src/data/articlesData.ts — как его запишет сборка. */
export const renderArticlesData = (content) =>
  `// AUTO-GENERATED\nconst articlesData = ${JSON.stringify(content)};\nexport default articlesData;\n`;

/** Текст файла src/data/blogIndexData.ts — как его запишет сборка. */
export const renderBlogIndexData = (cards) =>
  "// AUTO-GENERATED from src/pages/BlogArticle.tsx; do not edit by hand.\n" +
  "export interface BlogIndexEntry { slug: string; date: string; title: string; excerpt: string; category: string; icon: string; readTime: string }\n" +
  `const blogIndexData: BlogIndexEntry[] = ${JSON.stringify(cards)};\nexport default blogIndexData;\n`;

/**
 * Пересобрать src/data/articlesData.ts и src/data/blogIndexData.ts из
 * articleContent. Оба файла лежат в репозитории — сборка Vercel читает их до
 * того, как отработает генератор, поэтому они должны быть на месте.
 */
export function syncGeneratedFiles() {
  const content = readArticleContent();
  const cards = buildCards(content);
  write(ARTICLES_DATA, renderArticlesData(content));
  write(BLOG_INDEX_DATA, renderBlogIndexData(cards));
  return { articles: Object.keys(content).length, cards: cards.length };
}

// ============================================================
// ПОЧИНКА ТЕКСТА СТАТЬИ
// ============================================================

/**
 * Убрать из статьи то, что видно читателю как поломка:
 * название, повторённое первым подзаголовком, и первый абзац,
 * дословно повторяющий анонс. Возвращает, что именно поправлено.
 */
export function tidyArticle(article) {
  const fixed = [];
  const content = [...(article.content || [])];

  const first = content[0];
  if (first && first.type === "h" && sameHeading(first.text, article.title)) {
    content.shift();
    fixed.push("убран подзаголовок, повторяющий название");
  }

  const lead = article.summary || article.excerpt || "";
  const paragraphAt = content.findIndex((b) => b.type === "p");
  if (paragraphAt >= 0 && repeatsLead(content[paragraphAt].text, lead)) {
    const overlap = leadOverlap(content[paragraphAt].text, lead);
    let rest = String(content[paragraphAt].text).split(/\s+/).slice(overlap).join(" ").replace(/^[ .,;:—–-]+/u, "");
    // Обрезка по словам оставляет хвост чужого предложения — начинаем со следующей точки.
    const stop = rest.indexOf(". ");
    if (stop >= 0 && stop < 60) rest = rest.slice(stop + 2).replace(/^\s+/, "");
    if (rest) rest = rest[0].toUpperCase() + rest.slice(1);
    if (rest.length >= 40) {
      content[paragraphAt] = { ...content[paragraphAt], text: rest };
      fixed.push("подрезан первый абзац, повторявший анонс");
    } else {
      content.splice(paragraphAt, 1);
      fixed.push("убран первый абзац, целиком повторявший анонс");
    }
  }

  return { content, fixed };
}
