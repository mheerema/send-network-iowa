import { ImageResponse } from "next/og";
import {
  getAllArticles,
  getArticleBySlug,
  formatArticleDate,
} from "@/lib/articles";
import {
  OG_SIZE,
  BRAND_AMBER,
  OgCard,
  clampTitle,
  loadLogoSrc,
  loadHeroSrc,
} from "@/lib/og";

export const alt = "Send Network Iowa article";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return getAllArticles().map((article) => ({ slug: article.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  const logoSrc = await loadLogoSrc();
  // null on absence OR fetch failure → OgCard renders the solid-navy card.
  const heroSrc = await loadHeroSrc(article?.image);

  // Unknown slug (image requested for a 404 path): fall back to site branding.
  const title = clampTitle(article?.title ?? "Send Network Iowa");
  const isRepost = Boolean(article?.sourceName);
  const byline = article
    ? isRepost
      ? `via ${article.sourceName}`
      : formatArticleDate(article.date)
    : "A church in every Iowa community";

  return new ImageResponse(
    (
      <OgCard
        logoSrc={logoSrc}
        title={title}
        byline={byline}
        bylineColor={isRepost ? BRAND_AMBER : "rgba(255,255,255,0.85)"}
        heroSrc={heroSrc}
      />
    ),
    {
      ...size,
    },
  );
}
