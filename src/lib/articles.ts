/**
 * SCHEDULED PUBLISHING — how a future-dated article goes live
 * ===========================================================
 *
 * Drop a `.md` file in `content/articles/` with a `date:` in the future and it
 * stays invisible until that calendar day arrives in Iowa. Nothing else to do:
 * no second deploy, no flag to flip, no cron job.
 *
 * What "invisible" means:
 *   - absent from the articles index, the RSS feed, and the sitemap
 *     (all three go through `getAllArticles()`, which drops future posts)
 *   - its URL 404s — `getArticleBySlug()` refuses to return it, so the slug
 *     can't be guessed ahead of time
 *
 * How it flips on:
 *   The article pages are prerendered at build time for EVERY slug, future
 *   ones included (`getAllArticleSlugs()` feeds `generateStaticParams`), but
 *   the date gate is evaluated inside the page. Those routes set
 *   `export const revalidate = 3600`, so Next re-renders them at most an hour
 *   after the first request following expiry, and the gate answers differently
 *   once the date lands. Expect a post to appear within ~an hour of Iowa
 *   midnight, not exactly at midnight.
 *
 * The boundary:
 *   `date` is a calendar date, not an instant. Comparison is a lexicographic
 *   string compare of two zero-padded `YYYY-MM-DD` values — the article's date
 *   against today's date in `America/Chicago`. No `Date` arithmetic, no
 *   subtraction, no UTC offset math, so nothing can drift a day either way.
 *   A post dated 2026-08-14 is published for the whole of August 14 in Iowa
 *   and not one minute before.
 *
 * Invariant this relies on: `date` is `YYYY-MM-DD` with zero padding. YAML
 * date literals (`date: 2026-08-14`) and quoted strings both normalize to that
 * in `normalizeDate()`. A hand-written `2026-8-4` would sort and gate wrong —
 * same assumption the existing date sort already makes.
 */

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

export interface Article {
  slug: string;
  title: string;
  /** YYYY-MM-DD */
  date: string;
  /** Present on reposts; absent on original posts */
  sourceName?: string;
  sourceUrl?: string;
  excerpt: string;
  tags: string[];
  /** Hero photo URL (Unsplash/Pexels CDN). Absent → typographic layouts. */
  image?: string;
  imageAlt?: string;
  /** Attribution line, e.g. "Jane Doe / Unsplash" */
  imageCredit?: string;
  /** Link to the photo's page on the stock site */
  imageCreditUrl?: string;
  /** Rendered HTML of the markdown body (Matt's commentary or original post) */
  html: string;
}

const ARTICLES_DIR = path.join(process.cwd(), "content", "articles");

/** content/articles/README.md is an authoring template, not an article. */
function isArticleFile(filename: string): boolean {
  return filename.endsWith(".md") && filename.toLowerCase() !== "readme.md";
}

function normalizeDate(value: unknown): string {
  // gray-matter parses unquoted YAML dates into Date objects (UTC midnight)
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value);
}

function parseArticle(filename: string): Article {
  const slug = filename.replace(/\.md$/, "");
  const raw = fs.readFileSync(path.join(ARTICLES_DIR, filename), "utf8");
  const { data, content } = matter(raw);

  return {
    slug,
    title: String(data.title),
    date: normalizeDate(data.date),
    sourceName: data.sourceName ? String(data.sourceName) : undefined,
    sourceUrl: data.sourceUrl ? String(data.sourceUrl) : undefined,
    excerpt: String(data.excerpt),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    image: data.image ? String(data.image) : undefined,
    imageAlt: data.imageAlt ? String(data.imageAlt) : undefined,
    imageCredit: data.imageCredit ? String(data.imageCredit) : undefined,
    imageCreditUrl: data.imageCreditUrl ? String(data.imageCreditUrl) : undefined,
    html: marked.parse(content, { async: false }),
  };
}

/** Iowa. Publication days start at midnight here, not at UTC midnight. */
export const PUBLISH_TIME_ZONE = "America/Chicago";

const publishDayFormat = new Intl.DateTimeFormat("en-US", {
  timeZone: PUBLISH_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/** The current calendar day in Iowa, as a zero-padded `YYYY-MM-DD` string. */
export function todayInPublishZone(now: Date = new Date()): string {
  const parts = publishDayFormat.formatToParts(now);
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? "";
  // Padded rather than trusted: lexicographic compare is only chronological
  // while both operands are fixed-width.
  return [
    part("year").padStart(4, "0"),
    part("month").padStart(2, "0"),
    part("day").padStart(2, "0"),
  ].join("-");
}

/** Published once its date has arrived in Iowa; same-day counts as published. */
export function isPublished(date: string, now: Date = new Date()): boolean {
  return date <= todayInPublishZone(now);
}

function readAllArticles(): Article[] {
  return fs
    .readdirSync(ARTICLES_DIR)
    .filter(isArticleFile)
    .map(parseArticle)
    .sort((a, b) => b.date.localeCompare(a.date));
}

/** Live articles only. Backs the index, the RSS feed, and the sitemap. */
export function getAllArticles(): Article[] {
  return readAllArticles().filter((article) => isPublished(article.date));
}

/**
 * Every slug on disk, scheduled ones included — `generateStaticParams` needs
 * these so future posts get prerendered and can flip to live on revalidation
 * without a rebuild. Not for rendering lists; it leaks unpublished slugs.
 */
export function getAllArticleSlugs(): string[] {
  return fs
    .readdirSync(ARTICLES_DIR)
    .filter(isArticleFile)
    .map((filename) => filename.replace(/\.md$/, ""));
}

export function getArticleBySlug(slug: string): Article | undefined {
  const filename = `${slug}.md`;
  if (!isArticleFile(filename)) return undefined;
  if (!fs.existsSync(path.join(ARTICLES_DIR, filename))) return undefined;
  const article = parseArticle(filename);
  return isPublished(article.date) ? article : undefined;
}

/** "2026-08-12" → "August 12, 2026" without UTC/local timezone drift */
export function formatArticleDate(date: string): string {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
