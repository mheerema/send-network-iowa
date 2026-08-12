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

export function getAllArticles(): Article[] {
  return fs
    .readdirSync(ARTICLES_DIR)
    .filter(isArticleFile)
    .map(parseArticle)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getArticleBySlug(slug: string): Article | undefined {
  const filename = `${slug}.md`;
  if (!isArticleFile(filename)) return undefined;
  if (!fs.existsSync(path.join(ARTICLES_DIR, filename))) return undefined;
  return parseArticle(filename);
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
