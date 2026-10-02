// Типы для scripts/lib/baza-znaniy.mjs: модуль импортирует vite.config.ts,
// и без объявления TypeScript считает его содержимое any (ошибка TS7016).

/** Блок текста статьи. */
export type ArticleBlock =
  | { type: "p"; text: string }
  | { type: "h"; text: string }
  | { type: "list"; items: string[] };

/** Вопрос статьи: сайт и серверная отрисовка читают именно поля q и a. */
export interface ArticleFaqItem {
  q: string;
  a: string;
}

export interface Article {
  title: string;
  category: string;
  date?: string;
  modifiedDate?: string;
  content: ArticleBlock[];
  excerpt?: string;
  summary?: string;
  metaDescription?: string;
  faq?: ArticleFaqItem[];
}

/** Карточка списка статей — строка src/data/blogIndexData.ts. */
export interface BlogCard {
  slug: string;
  date: string;
  title: string;
  excerpt: string;
  category: string;
  icon: string;
  readTime: string;
}

export const ROOT: string;
export const BLOG_ARTICLE: string;
export const ARTICLES_DATA: string;
export const BLOG_INDEX_DATA: string;

export const read: (rel: string) => string;
export const write: (rel: string, text: string) => void;

export function readArticleContent(): Record<string, Article>;
export function writeArticleContent(content: Record<string, Article>): void;

export const CATEGORIES: string[];
export const INDEX_ICONS: Record<string, string>;
export const ICON: RegExp;
export const ENDING: RegExp;
export const MIN_WORDS: number;

export function headingKey(value: string): string;
export function sameHeading(left: string, right: string): boolean;
export function wordList(value: string): string[];
export function leadOverlap(paragraph: string, lead: string): number;
export function repeatsLead(paragraph: string, lead: string): boolean;
export function countWords(article: Article): number;

export function cardOf(slug: string, article: Article): BlogCard;
export function buildCards(content: Record<string, Article>): BlogCard[];
export function renderArticlesData(content: Record<string, Article>): string;
export function renderBlogIndexData(cards: BlogCard[]): string;
export function syncGeneratedFiles(): { articles: number; cards: number };
export function tidyArticle(article: Article): { content: ArticleBlock[]; fixed: string[] };
