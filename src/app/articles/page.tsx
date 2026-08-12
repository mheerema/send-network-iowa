import type { Metadata } from "next";
import Link from "next/link";
import { getAllArticles, formatArticleDate } from "@/lib/articles";

export const metadata: Metadata = {
  title: "Articles | Send Network Iowa",
  description:
    "News and commentary on church planting in Iowa — from Send Network Iowa and voices we trust across the Send Network, NAMB, and Baptist Convention of Iowa.",
  openGraph: {
    title: "Articles | Send Network Iowa",
    description:
      "News and commentary on church planting in Iowa — from Send Network Iowa and voices we trust.",
    url: "/articles",
  },
};

export default function ArticlesPage() {
  const articles = getAllArticles();

  return (
    <>
      {/* Page hero */}
      <section className="bg-brand-navy py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-brand-amber text-sm font-semibold uppercase tracking-widest mb-4">
              Articles
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
              News and commentary for the work in Iowa
            </h1>
            <p className="mt-6 text-white/70 leading-relaxed">
              What we&rsquo;re reading, writing, and passing along — church
              planting news, ministry resources, and the occasional original
              piece, all with Iowa in view.
            </p>
          </div>
        </div>
      </section>

      {/* Article list */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="space-y-4 list-none p-0">
            {articles.map((article) => (
              <li
                key={article.slug}
                className="rounded-2xl border border-gray-100 p-6 sm:p-8 hover:border-brand-amber/30 transition-colors"
              >
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-2">
                  {formatArticleDate(article.date)}
                  {article.sourceName && (
                    <>
                      {" "}
                      · via{" "}
                      <span className="text-brand-navy font-semibold normal-case tracking-normal">
                        {article.sourceName}
                      </span>
                    </>
                  )}
                </p>
                <h2 className="text-lg font-bold text-brand-navy tracking-tight mb-2">
                  <Link
                    href={`/articles/${article.slug}`}
                    className="hover:text-brand-amber transition-colors"
                  >
                    {article.title}
                  </Link>
                </h2>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  {article.excerpt}
                </p>
                <Link
                  href={`/articles/${article.slug}`}
                  className="text-sm font-semibold text-brand-navy hover:text-brand-amber transition-colors"
                >
                  Read more &rarr;
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
