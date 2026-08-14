import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllArticleSlugs,
  getArticleBySlug,
  formatArticleDate,
} from "@/lib/articles";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

// ISR: scheduled posts are prerendered as 404s and flip to live on the first
// revalidation after their date lands in Iowa. See src/lib/articles.ts.
export const revalidate = 3600;

// Every slug, scheduled ones included — the date gate lives in the page below,
// not here, so the prebuilt page can flip without a rebuild.
export function generateStaticParams() {
  return getAllArticleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};

  return {
    title: `${article.title} | Send Network Iowa`,
    description: article.excerpt,
    openGraph: {
      type: "article",
      title: article.title,
      description: article.excerpt,
      url: `/resources/articles/${article.slug}`,
      publishedTime: article.date,
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  return (
    <>
      {/* Article hero — photo behind the title when frontmatter provides one,
          solid navy otherwise (same treatment as HeroPathwaySplit) */}
      <section
        className={`relative overflow-hidden bg-brand-navy ${
          article.image ? "py-28 sm:py-36" : "py-20"
        }`}
      >
        {article.image && (
          <>
            <Image
              src={article.image}
              alt={article.imageAlt ?? ""}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-brand-navy/80" />
          </>
        )}
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-brand-amber text-sm font-semibold uppercase tracking-widest mb-4">
            {formatArticleDate(article.date)}
            {article.sourceName && <> · via {article.sourceName}</>}
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
            {article.title}
          </h1>
        </div>
        {article.image && article.imageCredit && (
          <p className="absolute bottom-2 right-3 z-10 text-white/30 text-[10px]">
            {article.imageCreditUrl ? (
              <a
                href={article.imageCreditUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring hover:text-white/60 transition-colors"
              >
                Photo: {article.imageCredit}
              </a>
            ) : (
              <>Photo: {article.imageCredit}</>
            )}
          </p>
        )}
      </section>

      {/* Commentary / body */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* `leading-relaxed` here is load-bearing for more than rhythm: body
              links get the site focus ring (globals.css `.prose-article a`),
              and a link that wraps across lines draws a ring on each fragment.
              At this leading, measured at 200% zoom with SC 1.4.12 text-spacing
              overrides applied (line-height 1.5, paragraph spacing 2em), the
              fragments sit 9px apart against 8px of ring — they clear, with
              ~1px to spare. Tightening the leading narrows that clearance.
              Collision here is cosmetic, not a conformance failure: 1.4.12 is
              about surviving a user INCREASING spacing, and a transient ring
              crossing a descender is not loss of content. But if this value
              drops, re-measure rather than assume. Do not "fix" it with a
              line-height floor — an !important floor would itself defeat
              1.4.12 by blocking the user's own spacing overrides. */}
          <div
            className="prose-article text-gray-700 leading-relaxed space-y-5 [&_a]:text-brand-navy [&_a]:font-semibold [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-brand-amber [&_h2]:text-brand-navy [&_h2]:font-bold [&_h2]:text-xl [&_h2]:mt-8 [&_h3]:text-brand-navy [&_h3]:font-bold [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6"
            dangerouslySetInnerHTML={{ __html: article.html }}
          />

          {/* Source link block for reposts */}
          {article.sourceUrl && (
            <div className="mt-10 rounded-2xl bg-gray-50 border border-gray-100 p-6 sm:p-8">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-3">
                Original article
              </p>
              <a
                href={article.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring text-base font-bold text-brand-navy hover:text-brand-amber transition-colors"
              >
                Read the original at {article.sourceName ?? "the source"}{" "}
                &rarr;
              </a>
            </div>
          )}

          {/* Back link */}
          <div className="mt-12 pt-8 border-t border-gray-100">
            <Link
              href="/resources/articles"
              className="focus-ring text-sm font-semibold text-brand-navy hover:text-brand-amber transition-colors"
            >
              &larr; All articles
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
