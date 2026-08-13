import { getAllArticles } from "@/lib/articles";

export const dynamic = "force-static";
// ISR: scheduled posts enter the feed on the first revalidation after their
// date lands in Iowa. See src/lib/articles.ts.
export const revalidate = 3600;

const SITE_URL = "https://sendnetworkiowa.com";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function GET() {
  const articles = getAllArticles();

  const items = articles
    .map((article) => {
      const url = `${SITE_URL}/resources/articles/${article.slug}`;
      const pubDate = new Date(`${article.date}T12:00:00Z`).toUTCString();
      const sourceLine = article.sourceUrl
        ? `\n      <source url="${escapeXml(article.sourceUrl)}">${escapeXml(article.sourceName ?? "Original article")}</source>`
        : "";

      return `    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(article.excerpt)}</description>${sourceLine}
    </item>`;
    })
    .join("\n");

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Send Network Iowa Articles</title>
    <link>${SITE_URL}/resources/articles</link>
    <atom:link href="${SITE_URL}/resources/articles/feed.xml" rel="self" type="application/rss+xml"/>
    <description>News and commentary on church planting in Iowa from Send Network Iowa.</description>
    <language>en-us</language>
${items}
  </channel>
</rss>
`;

  return new Response(feed, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
