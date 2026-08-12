import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllArticles,
  getArticleBySlug,
  formatArticleDate,
} from "@/lib/articles";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllArticles().map((article) => ({ slug: article.slug }));
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
      url: `/articles/${article.slug}`,
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
      {/* Article hero */}
      <section className="bg-brand-navy py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-brand-amber text-sm font-semibold uppercase tracking-widest mb-4">
            {formatArticleDate(article.date)}
            {article.sourceName && <> · via {article.sourceName}</>}
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
            {article.title}
          </h1>
        </div>
      </section>

      {/* Commentary / body */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="prose-article text-gray-700 leading-relaxed space-y-5 [&_a]:text-brand-navy [&_a]:font-semibold [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-brand-amber [&_h2]:text-brand-navy [&_h2]:font-bold [&_h2]:text-xl [&_h2]:mt-8 [&_h3]:text-brand-navy [&_h3]:font-bold [&_blockquote]:border-l-4 [&_blockquote]:border-brand-amber [&_blockquote]:pl-4 [&_blockquote]:italic [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6"
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
                className="text-base font-bold text-brand-navy hover:text-brand-amber transition-colors"
              >
                Read the original at {article.sourceName ?? "the source"}{" "}
                &rarr;
              </a>
            </div>
          )}

          {/* Back link */}
          <div className="mt-12 pt-8 border-t border-gray-100">
            <Link
              href="/articles"
              className="text-sm font-semibold text-brand-navy hover:text-brand-amber transition-colors"
            >
              &larr; All articles
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
